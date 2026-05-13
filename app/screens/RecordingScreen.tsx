import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Animated, AppState, Easing, StyleSheet, Text, View } from "react-native";

import { RecordingActionButton } from "../../components/recording/RecordingActionButton";
import { IconButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import { formatMillis } from "../../lib/fileStorage";
import type { RootStackParamList } from "../../types/navigation";
import { useRecordingController } from "../../hooks/useRecordingController";

type Props = NativeStackScreenProps<RootStackParamList, "Recording">;

const WAVEFORM_BAR_COUNT = 31;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeMetering(metering?: number) {
  if (typeof metering !== "number" || Number.isNaN(metering)) {
    return null;
  }

  if (metering <= 0) {
    return clamp((metering + 58) / 48, 0, 1);
  }

  if (metering <= 1) {
    return clamp(metering, 0, 1);
  }

  return clamp(metering / 100, 0, 1);
}

function getBarScale(index: number, level: number, phase: number, isRecording: boolean) {
  const midpoint = (WAVEFORM_BAR_COUNT - 1) / 2;
  const distanceFromCenter = Math.abs(index - midpoint) / midpoint;
  const centerWeight = Math.pow(1 - distanceFromCenter, 1.45);
  const ripple = (Math.sin(phase + index * 0.72) + 1) / 2;
  const flutter = (Math.sin(phase * 0.57 + index * 1.91) + 1) / 2;
  const base = 0.18 + centerWeight * 0.2;

  if (!isRecording) {
    return 0.16 + centerWeight * 0.12;
  }

  return clamp(
    base + centerWeight * level * 0.78 + ripple * 0.1 + flutter * level * 0.14,
    0.16,
    1.12
  );
}

export function RecordingScreen({ navigation, route }: Props) {
  const recording = useRecordingController();
  const autoStartAttempted = useRef(false);
  const appState = useRef(AppState.currentState);
  const recordingStatusRef = useRef(recording.status);
  const stopRecordingRef = useRef(recording.stop);
  const stoppingForInterruption = useRef(false);
  const [interruptionMessage, setInterruptionMessage] = useState<string | null>(null);
  const waveformBars = useRef(
    Array.from({ length: WAVEFORM_BAR_COUNT }, () => new Animated.Value(0.2))
  ).current;
  const waveformPhase = useRef(0);

  useEffect(() => {
    recordingStatusRef.current = recording.status;
    stopRecordingRef.current = recording.stop;
  }, [recording.status, recording.stop]);

  useEffect(() => {
    if (!route.params?.autoStart || autoStartAttempted.current) {
      return;
    }

    autoStartAttempted.current = true;
    recording.start();
  }, [route.params?.autoStart]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasActive = appState.current === "active";
      appState.current = nextAppState;

      if (
        wasActive &&
        nextAppState !== "active" &&
        (recordingStatusRef.current === "recording" || recordingStatusRef.current === "paused")
      ) {
        handleInterruptedStop();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const meteringLevel = normalizeMetering(recording.metering);
    const fallbackPulse =
      0.16 + ((Math.sin(recording.durationMillis / 420) + 1) / 2) * 0.16;
    const level = meteringLevel ?? fallbackPulse;
    const isRecording = recording.status === "recording";

    waveformPhase.current += 0.38 + level * 0.24;

    const animations = waveformBars.map((bar, index) =>
      Animated.timing(bar, {
        duration: isRecording ? 210 : 260,
        easing: Easing.out(Easing.cubic),
        toValue: getBarScale(index, level, waveformPhase.current, isRecording),
        useNativeDriver: true
      })
    );

    Animated.parallel(animations).start();
  }, [recording.durationMillis, recording.metering, recording.status, waveformBars]);

  async function handleStop() {
    const stoppedRecording = await recording.stop();

    if (!stoppedRecording) {
      return;
    }

    navigation.navigate("SaveRecording", {
      durationMillis: stoppedRecording.durationMillis,
      suggestedTitle: route.params?.suggestedTitle,
      tempUri: stoppedRecording.uri
    });
  }

  async function handleInterruptedStop() {
    if (stoppingForInterruption.current) {
      return;
    }

    stoppingForInterruption.current = true;
    setInterruptionMessage("Recording was interrupted.");

    const stoppedRecording = await stopRecordingRef.current();
    stoppingForInterruption.current = false;

    if (!stoppedRecording) {
      setInterruptionMessage("Recording was interrupted. We could not prepare it to save.");
      return;
    }

    navigation.navigate("SaveRecording", {
      durationMillis: stoppedRecording.durationMillis,
      suggestedTitle: route.params?.suggestedTitle,
      tempUri: stoppedRecording.uri
    });
  }

  const canStart = recording.status === "idle" || recording.status === "stopped";
  const canPause = recording.status === "recording";
  const canResume = recording.status === "paused";
  const canStop = recording.status === "recording" || recording.status === "paused";
  const stateLabel = recording.status === "recording"
    ? "Recording"
    : recording.status === "paused"
      ? "Paused"
      : "Ready";

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <IconButton label="Back" symbol={"\u2039"} onPress={() => navigation.navigate("Home")} />
        <Text style={styles.headerLabel}>Recording</Text>
        <View style={styles.headerSpace} />
      </View>

      <View style={styles.content}>
        {route.params?.suggestedTitle ? (
          <View style={styles.meetingContext}>
            <Text style={styles.meetingContextLabel}>Recording for:</Text>
            <Text numberOfLines={1} style={styles.meetingContextTitle}>
              {route.params.suggestedTitle}
            </Text>
          </View>
        ) : null}

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, recording.status === "recording" && styles.activeDot]} />
          <Text style={styles.statusText}>{stateLabel}</Text>
        </View>

        <Text style={styles.timer}>{formatMillis(recording.durationMillis)}</Text>

        <View style={styles.waveform}>
          {waveformBars.map((scaleY, index) => {
            return (
              <Animated.View
                key={index}
                style={[
                  styles.bar,
                  {
                    opacity: recording.status === "paused" ? 0.45 : 1,
                    transform: [{ scaleY }],
                    backgroundColor: recording.status === "recording"
                      ? theme.colors.text
                      : theme.colors.divider
                  }
                ]}
              />
            );
          })}
        </View>

        {recording.errorMessage ? (
          <Text style={styles.error}>{recording.errorMessage}</Text>
        ) : interruptionMessage ? (
          <Text style={styles.notice}>{interruptionMessage}</Text>
        ) : (
          <Text style={styles.helper}>For best recording results, keep Meeting Recall open while recording.</Text>
        )}
      </View>

      <View style={styles.actions}>
        {canStart ? (
          <RecordingActionButton label="Start recording" mode="record" onPress={recording.start} />
        ) : null}
        {canPause ? (
          <SecondaryButton onPress={recording.pause}>Pause</SecondaryButton>
        ) : null}
        {canResume ? (
          <SecondaryButton onPress={recording.resume}>Resume</SecondaryButton>
        ) : null}
        {canStop ? (
          <RecordingActionButton label="Stop recording" mode="stop" onPress={handleStop} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    textTransform: "uppercase"
  },
  headerSpace: {
    width: 48
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  meetingContext: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    maxWidth: "92%"
  },
  meetingContextLabel: {
    color: theme.colors.textSubtle,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    lineHeight: 18,
    textTransform: "uppercase"
  },
  meetingContextTitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    lineHeight: theme.typography.metadata.lineHeight,
    marginTop: theme.spacing.xs
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl
  },
  statusDot: {
    backgroundColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    height: 10,
    width: 10
  },
  activeDot: {
    backgroundColor: theme.colors.recording
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700"
  },
  timer: {
    color: theme.colors.text,
    fontSize: 64,
    fontWeight: "300"
  },
  waveform: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    height: 96,
    marginTop: theme.spacing["2xl"]
  },
  bar: {
    borderRadius: theme.radii.pill,
    height: 64,
    width: 4
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    marginTop: theme.spacing.xl,
    textAlign: "center"
  },
  error: {
    color: theme.colors.recording,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    marginTop: theme.spacing.xl,
    textAlign: "center"
  },
  notice: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    marginTop: theme.spacing.xl,
    textAlign: "center"
  },
  actions: {
    alignItems: "center",
    gap: theme.spacing.md
  }
});
