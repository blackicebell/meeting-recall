import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Linking,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";

import { IconButton, PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import { useAudioPlayback } from "../../hooks/useAudioPlayback";
import {
  deleteRecordingFileIfPossible,
  ensureM4aFileName,
  formatMillis,
  prepareRecordingForShare
} from "../../lib/fileStorage";
import { removeRecording } from "../../lib/recordingStore";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "RecordingDetail">;
const NOTEBOOKLM_URL = "https://notebooklm.google.com/";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function RecordingDetailScreen({ navigation, route }: Props) {
  const recording = route.params;
  const playback = useAudioPlayback(recording.fileUri);
  const [actionError, setActionError] = useState<string | null>(null);
  const waveProgress = useRef(new Animated.Value(0)).current;
  const waveformBars = useMemo(
    () => Array.from({ length: 34 }, (_, index) => 0.35 + ((index * 9) % 10) / 16),
    []
  );

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
    try {
      setActionError(null);
      const expectedFileName = ensureM4aFileName(recording.fileName);
      const fileInfo = await FileSystem.getInfoAsync(recording.fileUri);
      const fileSize =
        fileInfo.exists && "size" in fileInfo && typeof fileInfo.size === "number"
          ? fileInfo.size
          : recording.fileSize;

      if (!fileInfo.exists) {
        setActionError("Recording file could not be found.");
        return false;
      }

      if (fileSize <= 0) {
        setActionError("Recording file is not ready yet.");
        return false;
      }

      if (!expectedFileName.toLowerCase().endsWith(".m4a")) {
        setActionError("Recording file is not ready yet.");
        return false;
      }

      return true;
    } catch {
      setActionError("Recording file could not be found.");
      return false;
    }
  }

  async function openNotebookLm() {
    if (!(await recordingFileIsReady())) {
      return;
    }

    try {
      setActionError(null);
      await Linking.openURL(NOTEBOOKLM_URL);
    } catch (error) {
      try {
        const canOpenBrowser = await Linking.canOpenURL(NOTEBOOKLM_URL);

        if (canOpenBrowser) {
          setActionError("Opening NotebookLM in your browser.");
          await Linking.openURL(NOTEBOOKLM_URL);
          return;
        }
      } catch {
        // Fall through to the user-facing error below.
      }

      console.warn(getErrorMessage(error));
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

      if (__DEV__) {
        console.info("Meeting Recall share payload", {
          fileName: shareFile.fileName,
          fileSize: shareFile.fileSize,
          mimeType: shareFile.mimeType,
          uri: shareFile.uri
        });
      }

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

      console.warn(message);
      setActionError("Unable to share recording.");
    }
  }

  async function handlePlay() {
    try {
      await playback.play();
    } catch (error) {
      // Detail error handling will be expanded in the production error-state pass.
      console.warn(getErrorMessage(error));
    }
  }

  async function handleStop() {
    try {
      await playback.stop();
    } catch (error) {
      console.warn(getErrorMessage(error));
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
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Ready for NotebookLM</Text>
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
        <Text style={styles.locationValue}>{"Documents \u2192 Meeting Recall"}</Text>
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
        <IconButton label="Play recording" symbol={"\u25B6"} onPress={handlePlay} />
        <IconButton label="Stop playback" symbol={"\u25A0"} onPress={handleStop} tone="muted" />
      </View>

      <View style={styles.actions}>
        <Text style={styles.notebookHint}>
          When NotebookLM opens, tap Add Source and choose this file.
        </Text>
        <PrimaryButton onPress={openNotebookLm}>{"Open NotebookLM \u2197"}</PrimaryButton>
        <SecondaryButton onPress={shareRecording}>Share</SecondaryButton>
        {actionError ? (
          <Text style={styles.error}>{actionError}</Text>
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
  notebookHint: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight,
    textAlign: "center"
  },
  error: {
    color: theme.colors.recording,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    textAlign: "center"
  }
});
