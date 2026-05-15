import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { RecordingActionButton } from "../../components/recording/RecordingActionButton";
import { EmptyState, IconButton, Screen, SectionHeader } from "../../components/ui";
import {
  isScreenshotMode,
  screenshotMeetings,
  screenshotRecordings
} from "../../constants/screenshotData";
import { theme } from "../../constants/theme";
import { devLog } from "../../lib/devLog";
import {
  CalendarServiceError,
  fetchTodayMeetingsFromConnectedProviders
} from "../../lib/calendar/calendarService";
import { formatMillis } from "../../lib/fileStorage";
import { loadRecordings, type StoredRecording } from "../../lib/recordingStore";
import type { MeetingEvent } from "../../types/calendar";
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

function formatMeetingTime(startTime: string | null, endTime: string | null) {
  if (!startTime) {
    return "Time unavailable";
  }

  const startDate = new Date(startTime);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  if (!endTime) {
    return formatter.format(startDate);
  }

  return `${formatter.format(startDate)} - ${formatter.format(new Date(endTime))}`;
}

export function HomeScreen({ navigation }: Props) {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [todayMeetings, setTodayMeetings] = useState<MeetingEvent[]>([]);
  const [calendarStatus, setCalendarStatus] = useState<
    "checking" | "connected" | "disconnected" | "empty" | "failed"
  >("checking");
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

      async function refreshTodayMeetings() {
        if (isScreenshotMode) {
          setTodayMeetings(screenshotMeetings);
          setCalendarStatus("connected");
          return;
        }

        try {
          setCalendarStatus("checking");
          const result = await fetchTodayMeetingsFromConnectedProviders();

          if (!result.connected) {
            if (isActive) {
              setTodayMeetings([]);
              setCalendarStatus("disconnected");
            }
            return;
          }

          if (isActive) {
            devLog.info("Calendar service result", result.debugInfo);
            setTodayMeetings(result.meetings);
            setCalendarStatus(result.meetings.length > 0 ? "connected" : "empty");
          }
        } catch (error) {
          devLog.warn("Unable to load calendar events.", error);

          if (isActive) {
            setTodayMeetings([]);
            if (error instanceof CalendarServiceError) {
              devLog.warn("Calendar service error", error.debugInfo);
              setCalendarStatus(error.httpStatus === 401 ? "disconnected" : "failed");
            } else {
              setCalendarStatus("failed");
            }
          }
        }
      }

      refreshRecordings();
      refreshTodayMeetings();

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

      <View style={styles.meetingsSection}>
        <SectionHeader>Today&apos;s Meetings</SectionHeader>
        <View style={styles.meetingsList}>
          {calendarStatus === "connected" ? (
            todayMeetings.map((meeting) => (
              <Pressable
                key={meeting.id}
                style={({ pressed }) => [
                  styles.meetingRow,
                  pressed ? styles.pressedRow : null
                ]}
                onPress={() => navigation.navigate("Recording", { suggestedTitle: meeting.title })}
              >
                <View style={styles.providerDot} />
                <View style={styles.meetingText}>
                  <Text numberOfLines={1} style={styles.meetingTitle}>{meeting.title}</Text>
                  <Text style={styles.meta}>{formatMeetingTime(meeting.startTime, meeting.endTime)}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.meetingState}>
              <Text style={styles.meetingStateText}>
                {calendarStatus === "checking"
                  ? "Loading today's meetings..."
                  : calendarStatus === "empty"
                    ? "No meetings today."
                    : calendarStatus === "failed"
                      ? "Unable to load calendar events."
                      : "Connect Google Calendar to name recordings from your meetings."}
              </Text>
            </View>
          )}
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
  meetingsSection: {
    marginBottom: theme.spacing.xl
  },
  meetingsList: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  meetingRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 64,
    paddingVertical: theme.spacing.md
  },
  pressedRow: {
    opacity: 0.64
  },
  providerDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    height: 7,
    marginRight: theme.spacing.md,
    opacity: 0.65,
    width: 7
  },
  meetingText: {
    flex: 1
  },
  meetingTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24
  },
  meetingState: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: theme.spacing.md
  },
  meetingStateText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight
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
