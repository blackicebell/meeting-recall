import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import { IconButton, PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import { useAudioPlayback } from "../../hooks/useAudioPlayback";
import { devLog } from "../../lib/devLog";
import {
  deleteRecordingFileIfPossible,
  formatMillis,
  getRecordingLocationLabel,
  prepareRecordingForShare,
  validateSavedRecordingForHandoff
} from "../../lib/fileStorage";
import { removeRecording } from "../../lib/recordingStore";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "RecordingDetail">;
const NOTEBOOKLM_URL = "https://notebooklm.google.com/";
const PLAYBACK_KEEP_AWAKE_TAG = "meeting-recall-active-playback";

type ReadinessState = "checking" | "ready" | "failed";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function RecordingDetailScreen({ navigation, route }: Props) {
  const recording = route.params;
  const playback = useAudioPlayback(recording.fileUri);
  const recordingLocation = getRecordingLocationLabel();
  const [actionError, setActionError] = useState<string | null>(null);
  const [readinessState, setReadinessState] = useState<ReadinessState>("checking");
  const [readinessDebug, setReadinessDebug] = useState<string | null>(null);
  const [keepAwakeActive, setKeepAwakeActive] = useState(false);
  const [keepAwakeError, setKeepAwakeError] = useState<string | null>(null);
  const keepAwakeRequestId = useRef(0);
  const keepAwakeHeldRef = useRef(false);
  const isMounted = useRef(true);
  const readinessRequestId = useRef(0);
  const waveProgress = useRef(new Animated.Value(0)).current;
  const waveformBars = useMemo(
    () => Array.from({ length: 34 }, (_, index) => 0.35 + ((index * 9) % 10) / 16),
    []
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (keepAwakeHeldRef.current) {
        keepAwakeHeldRef.current = false;
        deactivateKeepAwake(PLAYBACK_KEEP_AWAKE_TAG).catch((error) => {
          devLog.warn("Unable to release playback wake lock on unmount", error);
        });
      }
    };
  }, []);

  async function validateRecordingReadiness() {
    const requestId = readinessRequestId.current + 1;
    readinessRequestId.current = requestId;

    setActionError(null);
    setReadinessState("checking");
    setReadinessDebug(null);

    try {
      const result = await validateSavedRecordingForHandoff({
        fileName: recording.fileName,
        fileUri: recording.fileUri
      });

      if (!isMounted.current || readinessRequestId.current !== requestId) {
        return false;
      }

      setReadinessState("ready");
      setReadinessDebug(
        `File ready: ${result.fileSize} bytes, ${result.mimeType}, playback validated`
      );
      return true;
    } catch (error) {
      const message = getErrorMessage(error);

      devLog.warn("Recording handoff readiness failed", {
        error: message,
        fileName: recording.fileName,
        fileUri: recording.fileUri,
        platform: Platform.OS
      });

      if (!isMounted.current || readinessRequestId.current !== requestId) {
        return false;
      }

      setReadinessState("failed");
      setReadinessDebug(message);
      setActionError("Recording could not be prepared.");
      return false;
    }
  }

  useEffect(() => {
    validateRecordingReadiness();
  }, [recording.fileName, recording.fileUri]);

  useEffect(() => {
    const requestId = keepAwakeRequestId.current + 1;
    keepAwakeRequestId.current = requestId;

    async function syncPlaybackKeepAwake() {
      try {
        if (playback.isPlaying) {
          await activateKeepAwakeAsync(PLAYBACK_KEEP_AWAKE_TAG);
          keepAwakeHeldRef.current = true;
          if (isMounted.current && keepAwakeRequestId.current === requestId) {
            setKeepAwakeActive(true);
            setKeepAwakeError(null);
          }
          return;
        }

        if (keepAwakeHeldRef.current) {
          await deactivateKeepAwake(PLAYBACK_KEEP_AWAKE_TAG);
          keepAwakeHeldRef.current = false;
        }

        if (isMounted.current && keepAwakeRequestId.current === requestId) {
          setKeepAwakeActive(false);
          setKeepAwakeError(null);
        }
      } catch (error) {
        devLog.warn("Unable to update playback wake lock", error);
        if (isMounted.current && keepAwakeRequestId.current === requestId) {
          setKeepAwakeActive(keepAwakeHeldRef.current);
          setKeepAwakeError("Playback keep awake failed");
        }
      }
    }

    syncPlaybackKeepAwake();
  }, [playback.isPlaying]);

  useEffect(() => {
    if (!playback.isPlaying) {
      waveProgress.stopAnimation();
      waveProgress.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(waveProgress, {
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.timing(waveProgress, {
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          toValue: 0,
          useNativeDriver: true
        })
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [playback.isPlaying, waveProgress]);

  async function recordingFileIsReady() {
    if (readinessState === "ready") {
      return true;
    }

    return validateRecordingReadiness();
  }

  async function openNotebookLm() {
    if (!(await recordingFileIsReady())) {
      return;
    }

    setActionError(null);

    try {
      const notebookLmSupported = await Linking.canOpenURL(NOTEBOOKLM_URL);

      devLog.info("NotebookLM open attempt", {
        attemptedFirstUrl: NOTEBOOKLM_URL,
        browserFallbackUsed: "not-detectable-before-open",
        primaryCanOpenUrlResult: notebookLmSupported
      });

      if (!notebookLmSupported) {
        setActionError("Unable to open NotebookLM.");
        return;
      }

      await Linking.openURL(NOTEBOOKLM_URL);

      devLog.info("NotebookLM open result", {
        browserFallbackUsed: "os-routed-app-or-browser",
        fallbackUsed: false,
        finalOpenResult: "opened-primary-url",
        finalUrlOpened: NOTEBOOKLM_URL
      });

      return;
    } catch (error) {
      devLog.warn("NotebookLM primary open failed", {
        attemptedFirstUrl: NOTEBOOKLM_URL,
        error: getErrorMessage(error)
      });

      // The primary NotebookLM URL is also the safest fallback. Android may route
      // it to the app when NotebookLM exposes an app link, or to the browser.
      devLog.info("NotebookLM fallback result", {
        browserFallbackUsed: false,
        fallbackUrl: NOTEBOOKLM_URL,
        fallbackUsed: true,
        finalUrlOpened: null
      });

      setActionError("Unable to open NotebookLM.");
    }
  }

  async function shareRecording() {
    if (!(await recordingFileIsReady())) {
      return;
    }

    try {
      const shareFile = await prepareRecordingForShare({
        fileName: recording.fileName,
        fileUri: recording.fileUri
      });
      const Sharing = await import("expo-sharing");

      devLog.info("Meeting Recall share payload", {
        fileName: shareFile.fileName,
        fileSize: shareFile.fileSize,
        mimeType: shareFile.mimeType,
        uri: shareFile.uri
      });

      if (!(await Sharing.isAvailableAsync())) {
        setActionError("Unable to share recording.");
        return;
      }

      await Sharing.shareAsync(shareFile.uri, {
        dialogTitle: shareFile.fileName,
        mimeType: shareFile.mimeType,
        UTI: "public.mpeg-4-audio"
      });
    } catch (error) {
      const message = getErrorMessage(error);

      if (
        message === "Recording file could not be found." ||
        message === "Recording file is not ready yet."
      ) {
        setActionError(message);
        return;
      }

      devLog.warn("Unable to share recording.", message);
      setActionError("Unable to share recording.");
    }
  }

  async function handlePlay() {
    if (!(await recordingFileIsReady())) {
      return;
    }

    try {
      await playback.play();
    } catch (error) {
      // Detail error handling will be expanded in the production error-state pass.
      devLog.warn("Unable to play recording.", getErrorMessage(error));
    }
  }

  async function handleStop() {
    try {
      await playback.stop();
    } catch (error) {
      devLog.warn("Unable to stop playback.", getErrorMessage(error));
    }
  }

  async function deleteRecording() {
    let deleteResult: Awaited<ReturnType<typeof deleteRecordingFileIfPossible>>;

    try {
      try {
        await playback.stop();
      } catch {
        // Playback cleanup should not block deletion.
      }

      await removeRecording(recording.id);
      deleteResult = await deleteRecordingFileIfPossible(recording.fileUri);
    } catch {
      Alert.alert("Unable to delete recording.", "Please try again.");
      return;
    }

    if (!deleteResult.fileExisted) {
      Alert.alert(
        "Recording removed",
        "The audio file was already missing, so Meeting Recall cleaned up the saved recording.",
        [{ text: "OK", onPress: () => navigation.navigate("Home") }]
      );
      return;
    }

    if (!deleteResult.deleted) {
      Alert.alert(
        "Recording removed",
        "Recording removed from the app, but the file may still remain in your Meeting Recall folder.",
        [{ text: "OK", onPress: () => navigation.navigate("Home") }]
      );
      return;
    }

    navigation.navigate("Home");
  }

  function confirmDelete() {
    Alert.alert(
      "Delete recording?",
      "This removes the recording from Meeting Recall. If possible, the audio file will also be deleted from your device.",
      [
        {
          style: "cancel",
          text: "Cancel"
        },
        {
          onPress: deleteRecording,
          style: "destructive",
          text: "Delete Recording"
        }
      ]
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <IconButton label="Back" symbol={"\u2039"} onPress={() => navigation.navigate("Home")} />
        <View style={styles.statusChip}>
          <View
            style={[
              styles.statusDot,
              readinessState === "checking" ? styles.statusDotChecking : null,
              readinessState === "failed" ? styles.statusDotFailed : null
            ]}
          />
          <Text style={styles.statusText}>
            {readinessState === "checking"
              ? "Preparing recording..."
              : readinessState === "failed"
                ? "Recording needs attention"
                : "Ready for NotebookLM"}
          </Text>
        </View>
        <IconButton
          icon="delete"
          label="Delete recording"
          onPress={confirmDelete}
          tone="destructive"
        />
      </View>

      <Text numberOfLines={2} style={styles.title}>{recording.title}</Text>
      <Text style={styles.meta}>
        {formatMillis(recording.durationMillis)} {"\u2022"} Saved to Meeting Recall
      </Text>

      <View style={styles.filePanel}>
        <Text numberOfLines={1} style={styles.fileValue}>{recording.fileName}</Text>
        <Text style={styles.locationValue}>{recordingLocation}</Text>
      </View>

      <View style={styles.waveform}>
        {waveformBars.map((baseScale, index) => {
          const animatedScale = waveProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              baseScale,
              0.4 + (((index + 5) * 13) % 10) / 16,
              baseScale
            ]
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.bar,
                {
                  backgroundColor: playback.isPlaying ? theme.colors.primary : theme.colors.divider,
                  transform: [{ scaleY: playback.isPlaying ? animatedScale : baseScale }]
                }
              ]}
            />
          );
        })}
      </View>

      <View style={styles.playback}>
        <IconButton
          disabled={readinessState !== "ready"}
          label="Play recording"
          symbol={"\u25B6"}
          onPress={handlePlay}
          tone={readinessState === "ready" ? "default" : "muted"}
        />
        <IconButton label="Stop playback" symbol={"\u25A0"} onPress={handleStop} tone="muted" />
      </View>

      <View style={styles.actions}>
        <PrimaryButton disabled={readinessState !== "ready"} onPress={openNotebookLm}>
          {"Open NotebookLM \u2197"}
        </PrimaryButton>
        <SecondaryButton disabled={readinessState !== "ready"} onPress={shareRecording}>
          Share
        </SecondaryButton>
        {actionError ? (
          <Text style={styles.error}>{actionError}</Text>
        ) : null}
        {readinessState === "failed" ? (
          <SecondaryButton onPress={validateRecordingReadiness}>Try Again</SecondaryButton>
        ) : null}
        {__DEV__ ? (
          <Text style={styles.debug}>
            Playback keep awake: {keepAwakeActive ? "active" : "inactive"}
            {keepAwakeError ? `\n${keepAwakeError}` : ""}
            {readinessDebug ? `\nReadiness: ${readinessDebug}` : ""}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg
  },
  statusChip: {
    alignItems: "center",
    borderColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  statusDot: {
    backgroundColor: "#2f9e44",
    borderRadius: theme.radii.pill,
    height: 7,
    width: 7
  },
  statusDotChecking: {
    backgroundColor: theme.colors.textSubtle
  },
  statusDotFailed: {
    backgroundColor: theme.colors.recording
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700"
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: theme.typography.title.fontWeight,
    lineHeight: 34
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    marginTop: theme.spacing.sm
  },
  filePanel: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  fileValue: {
    color: theme.colors.text,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    lineHeight: theme.typography.metadata.lineHeight
  },
  locationValue: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight
  },
  waveform: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    height: 68,
    marginTop: theme.spacing.lg
  },
  bar: {
    borderRadius: theme.radii.pill,
    height: 58,
    width: 4
  },
  playback: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing["2xl"],
    justifyContent: "center",
    marginTop: theme.spacing.md
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  },
  error: {
    color: theme.colors.recording,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    textAlign: "center"
  },
  debug: {
    color: theme.colors.textSubtle,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center"
  }
});
