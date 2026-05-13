import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState, IconButton, PrimaryButton, Screen, SectionHeader } from "../../components/ui";
import { theme } from "../../constants/theme";
import { formatMillis } from "../../lib/fileStorage";
import { loadRecordings, type StoredRecording } from "../../lib/recordingStore";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(isoDate));
}

export function HomeScreen({ navigation }: Props) {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [loadStatus, setLoadStatus] = useState("idle");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function refreshRecordings() {
        try {
          setLoadStatus("loading");
          const savedRecordings = await loadRecordings();

          if (isActive) {
            setRecordings(savedRecordings);
            setLoadStatus("loaded");
          }
        } catch {
          if (isActive) {
            setLoadStatus("failed");
          }
        }
      }

      refreshRecordings();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Meeting Recall</Text>
        <IconButton icon="settings" label="Settings" onPress={() => navigation.navigate("Settings")} />
      </View>

      <View style={styles.section}>
        <SectionHeader>Recent Recordings</SectionHeader>
        <ScrollView
          contentContainerStyle={recordings.length > 0 ? styles.listContent : styles.emptyContent}
          showsVerticalScrollIndicator={false}
        >
          {recordings.length > 0 ? (
            <View style={styles.list}>
              {recordings.map((recording) => (
                <Pressable
                  key={recording.id}
                  style={styles.row}
                  onPress={() => navigation.navigate("RecordingDetail", recording)}
                >
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{recording.title}</Text>
                    <Text style={styles.meta}>{formatDate(recording.createdAt)}</Text>
                    <Text style={styles.fileName}>{recording.fileName}</Text>
                  </View>
                  <Text style={styles.duration}>{formatMillis(recording.durationMillis)}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <EmptyState
              title="Your recordings will appear here."
              body="Recordings stay on your device and save to your Meeting Recall folder."
            />
          )}
          {loadStatus === "failed" ? (
            <Text style={styles.error}>Unable to load saved recordings.</Text>
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.recordDock}>
        <PrimaryButton onPress={() => navigation.navigate("Recording")}>Record meeting</PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight
  },
  section: {
    flex: 1
  },
  listContent: {
    paddingBottom: 112
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 112
  },
  list: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  row: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 86,
    paddingVertical: theme.spacing.md
  },
  rowText: {
    flex: 1,
    paddingRight: theme.spacing.md
  },
  rowTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700",
    lineHeight: theme.typography.body.lineHeight
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight,
    marginTop: theme.spacing.xs
  },
  fileName: {
    color: theme.colors.textSubtle,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight,
    marginTop: theme.spacing.xs
  },
  duration: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700"
  },
  error: {
    color: theme.colors.recording,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    marginTop: theme.spacing.md
  },
  recordDock: {
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.md
  }
});
