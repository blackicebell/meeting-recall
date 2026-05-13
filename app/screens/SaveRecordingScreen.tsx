import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import {
  buildRecordingFileName,
  formatMillis,
  loadStoredMeetingRecallFolderUri,
  saveRecordingToMeetingRecallFolder
} from "../../lib/fileStorage";
import { addRecording } from "../../lib/recordingStore";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "SaveRecording">;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function SaveRecordingScreen({ navigation, route }: Props) {
  const [title, setTitle] = useState("Test Recording");
  const [folderUri, setFolderUri] = useState<string | null>(null);
  const [folderStatus, setFolderStatus] = useState("loading folder");
  const [saveStatus, setSaveStatus] = useState("not saved");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileName = useMemo(() => buildRecordingFileName(title), [title]);

  useEffect(() => {
    async function loadFolder() {
      try {
        const storedFolderUri = await loadStoredMeetingRecallFolderUri();
        setFolderUri(storedFolderUri);
        setFolderStatus(storedFolderUri ? "Meeting Recall folder ready" : "choose folder on save");
      } catch (error) {
        setFolderStatus(`folder load failed: ${getErrorMessage(error)}`);
      }
    }

    loadFolder();
  }, []);

  async function handleSave() {
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
      setSaveStatus("failed");
      setErrorMessage(getErrorMessage(error));
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
            <Text style={styles.detailValue}>Meeting Recall folder</Text>
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

        {folderStatus !== "Meeting Recall folder ready" ? (
          <Text style={styles.status}>{folderStatus}</Text>
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
