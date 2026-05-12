import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";

import { Screen } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Recording">;

type SpikeRecordingStatus = "idle" | "preparing" | "recording" | "paused" | "stopped";

function formatMillis(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatSeconds(seconds: number) {
  return formatMillis(seconds * 1000);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function RecordingScreen({ navigation }: Props) {
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  const [recordingStatus, setRecordingStatus] = useState<SpikeRecordingStatus>("idle");
  const [savedFileUri, setSavedFileUri] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const playerSource = useMemo(() => (savedFileUri ? { uri: savedFileUri } : null), [savedFileUri]);
  const player = useAudioPlayer(playerSource, { updateInterval: 250 });
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    async function loadPermissionStatus() {
      try {
        const permission = await getRecordingPermissionsAsync();
        setPermissionStatus(permission.status);
      } catch (error) {
        setLastError(`Permission check failed: ${getErrorMessage(error)}`);
      }
    }

    loadPermissionStatus();
  }, []);

  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  async function requestPermission() {
    try {
      setLastError(null);
      const permission = await requestRecordingPermissionsAsync();
      setPermissionStatus(permission.status);

      if (!permission.granted) {
        setLastError("Microphone permission was denied.");
      }

      return permission.granted;
    } catch (error) {
      setLastError(`Permission request failed: ${getErrorMessage(error)}`);
      return false;
    }
  }

  async function startRecording() {
    try {
      setLastError(null);
      setRecordingStatus("preparing");

      const permissionGranted =
        permissionStatus === "granted" ? true : await requestPermission();

      if (!permissionGranted) {
        setRecordingStatus("idle");
        return;
      }

      player.pause();
      await player.seekTo(0);

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: "doNotMix",
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setSavedFileUri(null);
      setRecordingStatus("recording");
    } catch (error) {
      setRecordingStatus("idle");
      setLastError(`Unable to start recording: ${getErrorMessage(error)}`);
    }
  }

  function pauseRecording() {
    try {
      setLastError(null);
      recorder.pause();
      setRecordingStatus("paused");
    } catch (error) {
      setLastError(`Unable to pause recording: ${getErrorMessage(error)}`);
    }
  }

  function resumeRecording() {
    try {
      setLastError(null);
      recorder.record();
      setRecordingStatus("recording");
    } catch (error) {
      setLastError(`Unable to resume recording: ${getErrorMessage(error)}`);
    }
  }

  async function stopRecording() {
    try {
      setLastError(null);
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });

      const uri = recorder.uri ?? recorderState.url;
      setSavedFileUri(uri);
      setRecordingStatus("stopped");

      if (!uri) {
        setLastError("Recording stopped, but no file URI was returned.");
      }
    } catch (error) {
      setLastError(`Unable to stop recording: ${getErrorMessage(error)}`);
    }
  }

  async function playRecording() {
    try {
      setLastError(null);

      if (!savedFileUri) {
        setLastError("Record something first. No saved file URI is available.");
        return;
      }

      player.replace({ uri: savedFileUri });
      await player.seekTo(0);
      player.play();
    } catch (error) {
      setLastError(`Unable to play recording: ${getErrorMessage(error)}`);
    }
  }

  async function stopPlayback() {
    try {
      setLastError(null);
      player.pause();
      await player.seekTo(0);
    } catch (error) {
      setLastError(`Unable to stop playback: ${getErrorMessage(error)}`);
    }
  }

  const canStart = recordingStatus === "idle" || recordingStatus === "stopped";
  const canPause = recordingStatus === "recording";
  const canResume = recordingStatus === "paused";
  const canStop = recordingStatus === "recording" || recordingStatus === "paused";
  const canPlay = Boolean(savedFileUri) && !playerStatus.playing;
  const canStopPlayback = playerStatus.playing;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Technical spike</Text>
        <Text style={styles.title}>Audio Recording Validation</Text>
        <Text style={styles.body}>
          Plain test screen for microphone permission, recording, pause/resume, saved URI,
          and playback. This is not the final Meeting Recall recording UI.
        </Text>
      </View>

      <View style={styles.actions}>
        <SpikeButton disabled={!canStart} label="Start recording" onPress={startRecording} primary />
        <SpikeButton disabled={!canPause} label="Pause recording" onPress={pauseRecording} />
        <SpikeButton disabled={!canResume} label="Resume recording" onPress={resumeRecording} />
        <SpikeButton disabled={!canStop} label="Stop recording" onPress={stopRecording} />
        <SpikeButton disabled={!canPlay} label="Play saved recording" onPress={playRecording} primary />
        <SpikeButton disabled={!canStopPlayback} label="Stop playback" onPress={stopPlayback} />
        <SpikeButton label="Back to Home" onPress={() => navigation.navigate("Home")} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Debug status</Text>
        <DebugRow label="Permission" value={permissionStatus} />
        <DebugRow label="Recording status" value={recordingStatus} />
        <DebugRow label="Recorder can record" value={String(recorderState.canRecord)} />
        <DebugRow label="Recorder active" value={String(recorderState.isRecording)} />
        <DebugRow label="Recording duration" value={formatMillis(recorderState.durationMillis)} />
        <DebugRow label="Recorder URL" value={recorderState.url ?? "none"} />
        <DebugRow label="Saved file URI" value={savedFileUri ?? "none"} />
        <DebugRow label="Playback loaded" value={String(playerStatus.isLoaded)} />
        <DebugRow label="Playback status" value={playerStatus.playbackState} />
        <DebugRow label="Playback playing" value={String(playerStatus.playing)} />
        <DebugRow label="Playback time" value={formatSeconds(playerStatus.currentTime)} />
        <DebugRow label="Playback duration" value={formatSeconds(playerStatus.duration)} />
        <DebugRow label="Last error" value={lastError ?? "none"} error={Boolean(lastError)} />
      </View>
    </Screen>
  );
}

type SpikeButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  primary?: boolean;
};

function SpikeButton({ disabled = false, label, onPress, primary = false }: SpikeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton
      ]}
    >
      <Text style={[styles.buttonText, primary && styles.primaryButtonText, disabled && styles.disabledText]}>
        {label}
      </Text>
    </Pressable>
  );
}

type DebugRowProps = {
  error?: boolean;
  label: string;
  value: string;
};

function DebugRow({ error = false, label, value }: DebugRowProps) {
  return (
    <View style={styles.debugRow}>
      <Text style={styles.debugLabel}>{label}</Text>
      <Text selectable style={[styles.debugValue, error && styles.errorText]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg
  },
  eyebrow: {
    color: theme.colors.recording,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    lineHeight: theme.typography.title.lineHeight
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight
  },
  actions: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg
  },
  button: {
    alignItems: "center",
    borderRadius: theme.radii.md,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: theme.spacing.md
  },
  primaryButton: {
    backgroundColor: theme.colors.primary
  },
  secondaryButton: {
    borderColor: theme.colors.divider,
    borderWidth: StyleSheet.hairlineWidth
  },
  disabledButton: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.divider
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight
  },
  primaryButtonText: {
    color: theme.colors.white
  },
  disabledText: {
    color: theme.colors.textSubtle
  },
  panel: {
    borderColor: theme.colors.divider,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.md
  },
  panelTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    marginBottom: theme.spacing.sm
  },
  debugRow: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm
  },
  debugLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700"
  },
  debugValue: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 18
  },
  errorText: {
    color: theme.colors.recording,
    fontWeight: "700"
  }
});
