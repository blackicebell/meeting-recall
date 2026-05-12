import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState, IconButton, PrimaryButton, Screen, SectionHeader } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const mockMeetings = [
  { title: "Meeting Yoshi", time: "10:00 AM" },
  { title: "Design review", time: "11:30 AM" }
];

const mockRecordings = [
  { title: "2026-05-11 - Meeting Yoshi", duration: "42:18" },
  { title: "2026-05-10 - Client Strategy", duration: "28:04" }
];

export function HomeScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Meeting Recall</Text>
        <IconButton label="Open settings" symbol="⚙" onPress={() => navigation.navigate("Settings")} />
      </View>

      <SectionHeader>Today's Meetings</SectionHeader>
      <View style={styles.list}>
        {mockMeetings.map((meeting) => (
          <Pressable key={meeting.title} style={styles.row} onPress={() => navigation.navigate("Recording")}>
            <Text style={styles.rowTitle}>{meeting.title}</Text>
            <Text style={styles.meta}>{meeting.time}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader>Recent Recordings</SectionHeader>
        {mockRecordings.length > 0 ? (
          <View style={styles.list}>
            {mockRecordings.map((recording) => (
              <Pressable
                key={recording.title}
                style={styles.row}
                onPress={() => navigation.navigate("RecordingDetail")}
              >
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{recording.title}</Text>
                  <Text style={styles.meta}>Saved in Meeting Recall folder</Text>
                </View>
                <Text style={styles.meta}>{recording.duration}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <EmptyState
            title="Your recordings will appear here."
            body="Recordings stay on your device and save to your Meeting Recall folder."
          />
        )}
      </View>

      <View style={styles.recordButton}>
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
    marginBottom: theme.spacing["2xl"]
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight
  },
  section: {
    marginTop: theme.spacing["2xl"]
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
    minHeight: 74,
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
    lineHeight: theme.typography.metadata.lineHeight
  },
  recordButton: {
    marginTop: theme.spacing["2xl"]
  }
});
