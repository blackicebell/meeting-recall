import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import {
  buildRecordingFileName,
  DEFAULT_RECORDING_TITLE,
  formatMillis,
  getRecordingLocationLabel,
  getStorageSetupCopy,
  loadStoredMeetingRecallFolderUri,
  saveRecordingToMeetingRecallFolder
} from "../../lib/fileStorage";
import { devLog } from "../../lib/devLog";
import { addRecording } from "../../lib/recordingStore";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "SaveRecording">;

type FolderStatus = "checking" | "ready" | "needsSelection" | "failed";

function getFolderStatusCopy(status: FolderStatus) {
  const storageCopy = getStorageSetupCopy();

  if (status === "checking") {
    return "Checking save location...";
  }

  if (status === "needsSelection") {
    return storageCopy.button === "Choose Folder"
      ? "You will choose your Meeting Recall folder when saving."
      : "Recordings are saved inside Meeting Recall on this device.";
  }

  if (status === "failed") {
    return "Unable to check save location. You can still try saving.";
  }

  return null;
}

export function SaveRecordingScreen({ navigation, route }: Props) {
  const saveInProgressRef = useRef(false);
  const [title, setTitle] = useState(route.params.suggestedTitle ?? DEFAULT_RECORDING_TITLE);
  const [folderUri, setFolderUri] = useState<string | null>(null);
  const [folderStatus, setFolderStatus] = useState<FolderStatus>("checking");
  const [saveStatus, setSaveStatus] = useState("not saved");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileName = useMemo(() => buildRecordingFileName(title), [title]);
  const folderStatusCopy = getFolderStatusCopy(folderStatus);
  const locationLabel = getRecordingLocationLabel();

  useEffect(() => {
    async function loadFolder() {
      try {
        const storedFolderUri = await loadStoredMeetingRecallFolderUri();
        setFolderUri(storedFolderUri);
        setFolderStatus(storedFolderUri ? "ready" : "needsSelection");
      } catch (error) {
        devLog.warn("Unable to load Meeting Recall folder", error);
        setFolderStatus("failed");
      }
    }

    loadFolder();
  }, []);

  async function handleSave() {
    if (saveInProgressRef.current) {
      return;
    }

    saveInProgressRef.current = true;

    try {
      setErrorMessage(null);
      setSaveStatus("saving");
      const savedRecording = await saveRecordingToMeetingRecallFolder({
        durationMillis: route.params.durationMillis,
        folderUri,
        sourceUri: route.params.tempUri,
        title
      });
      const storedRecording = await addRecording(savedRecording);
      setFolderUri(savedRecording.folderUri);
      setSaveStatus("saved");
      navigation.replace("RecordingDetail", storedRecording);
    } catch (error) {
      devLog.warn("Unable to save recording", error);
      setSaveStatus("failed");
      setErrorMessage("Recording could not be finalized.");
      saveInProgressRef.current = false;
    }
  }

  return (
    <Screen scroll={false}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Recording stopped</Text>
          <Text style={styles.title}>Save recording</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            autoCapitalize="words"
            onChangeText={setTitle}
            placeholder="Meeting title"
            placeholderTextColor={theme.colors.textSubtle}
            style={styles.input}
            value={title}
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.preview}>
            <Text style={styles.metaLabel}>Final filename</Text>
            <Text numberOfLines={2} style={styles.fileName}>{fileName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{locationLabel}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{formatMillis(route.params.durationMillis)}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton onPress={handleSave}>
            {saveStatus === "saving" ? "Saving..." : "Save Recording"}
          </PrimaryButton>
          <SecondaryButton onPress={() => navigation.navigate("Home")}>Cancel</SecondaryButton>
        </View>

        {folderStatusCopy ? (
          <Text style={styles.status}>{folderStatusCopy}</Text>
        ) : null}
        {saveStatus === "saved" ? (
          <Text style={styles.success}>Saved to Meeting Recall folder.</Text>
        ) : null}
        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: theme.spacing.lg
  },
  header: {
    marginBottom: theme.spacing.lg
  },
  eyebrow: {
    color: theme.colors.recording,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: theme.typography.title.fontWeight,
    lineHeight: 36
  },
  field: {
    marginTop: theme.spacing.sm
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700",
    minHeight: 52
  },
  summary: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: theme.spacing.lg
  },
  preview: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: theme.spacing.md
  },
  fileName: {
    color: theme.colors.text,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    lineHeight: theme.typography.metadata.lineHeight,
    marginTop: theme.spacing.xs
  },
  metaLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize
  },
  detailRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48
  },
  detailLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize
  },
  detailValue: {
    color: theme.colors.text,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700"
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  },
  status: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    marginTop: theme.spacing.md,
    textAlign: "center"
  },
  success: {
    color: theme.colors.primary,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    marginTop: theme.spacing.md,
    textAlign: "center"
  },
  error: {
    color: theme.colors.recording,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    marginTop: theme.spacing.md,
    textAlign: "center"
  }
});
