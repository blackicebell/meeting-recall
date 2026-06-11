import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { RecordingActionButton } from "../../components/recording/RecordingActionButton";
import { EmptyState, IconButton, Screen, SectionHeader } from "../../components/ui";
import {
  isScreenshotMode,
  screenshotRecordings
} from "../../constants/screenshotData";
import { theme } from "../../constants/theme";
import { formatMillis } from "../../lib/fileStorage";
import { loadRecordings, type StoredRecording } from "../../lib/recordingStore";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const brandMark = require("../../assets/brand/logo-primary-transparent.png");

function formatRecordingDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short"
  }).format(new Date(isoDate));
}

export function HomeScreen({ navigation }: Props) {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [loadStatus, setLoadStatus] = useState("idle");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function refreshRecordings() {
        if (isScreenshotMode) {
          setRecordings(screenshotRecordings);
          setLoadStatus("loaded");
          return;
        }

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
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={brandMark}
              style={styles.headerMark}
            />
            <Text style={styles.title}>Meeting Recall</Text>
          </View>
          <Text style={styles.subtitle}>Record, save, and open in NotebookLM.</Text>
        </View>
        <View style={styles.settingsButton}>
          <IconButton icon="settings" label="Settings" onPress={() => navigation.navigate("Settings")} />
        </View>
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
                  style={({ pressed }) => [
                    styles.row,
                    pressed ? styles.pressedRow : null
                  ]}
                  onPress={() => navigation.navigate("RecordingDetail", recording)}
                >
                  <View style={styles.rowText}>
                    <Text numberOfLines={1} style={styles.rowTitle}>{recording.title}</Text>
                    <Text style={styles.meta}>{formatRecordingDate(recording.createdAt)}</Text>
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

      <View pointerEvents="box-none" style={styles.recordDock}>
        <RecordingActionButton
          label="Record meeting"
          mode="record"
          onPress={() => navigation.navigate("Recording", { autoStart: true })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg
  },
  headerText: {
    flex: 1,
    paddingRight: theme.spacing.md
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  headerMark: {
    height: 30,
    width: 46
  },
  settingsButton: {
    marginTop: -3
  },
  title: {
    color: theme.colors.text,
    fontSize: 33,
    fontWeight: theme.typography.title.fontWeight,
    letterSpacing: 0,
    lineHeight: 39
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: theme.spacing.xs
  },
  section: {
    flex: 1
  },
  pressedRow: {
    opacity: 0.64
  },
  listContent: {
    paddingBottom: 132
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 132
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
    minHeight: 78,
    paddingVertical: 14
  },
  rowText: {
    flex: 1,
    paddingRight: theme.spacing.md
  },
  rowTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight,
    marginTop: theme.spacing.xs
  },
  fileName: {
    color: theme.colors.textSubtle,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  duration: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700"
  },
  error: {
    color: theme.colors.recording,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    marginTop: theme.spacing.md
  },
  recordDock: {
    alignItems: "center",
    bottom: theme.spacing.lg,
    left: 0,
    position: "absolute",
    right: 0
  }
});
