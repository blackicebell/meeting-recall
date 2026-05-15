import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { IconButton, Screen, SecondaryButton, SectionHeader } from "../../components/ui";
import { theme } from "../../constants/theme";
import { clearCalendarConnection, loadCalendarConnection, saveCalendarConnection } from "../../lib/calendarStore";
import { devLog } from "../../lib/devLog";
import {
  connectGoogleCalendarAccount,
  disconnectGoogleCalendarAccount
} from "../../lib/googleSignIn";
import type { CalendarConnection } from "../../types/calendar";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const [calendarConnection, setCalendarConnection] = useState<CalendarConnection>({
    connected: false,
    email: null,
    lastConnectedAt: null,
    provider: "google"
  });
  const [calendarStatus, setCalendarStatus] = useState("Not connected");
  const [isCalendarBusy, setIsCalendarBusy] = useState(false);

  useEffect(() => {
    async function loadConnection() {
      const connection = await loadCalendarConnection();
      setCalendarConnection(connection);
      setCalendarStatus(connection.connected ? "Connected" : "Not connected");
    }

    loadConnection();
  }, []);

  async function connectCalendar() {
    try {
      setIsCalendarBusy(true);
      setCalendarStatus("Connecting...");
      const account = await connectGoogleCalendarAccount();
      const connection = await saveCalendarConnection(account.email);

      devLog.info("Google Calendar connected", {
        accessTokenReceived: Boolean(account.accessToken),
        email: account.email
      });

      setCalendarConnection(connection);
      setCalendarStatus("Connected");
    } catch (error) {
      devLog.warn("Unable to connect Google Calendar.", error);

      setCalendarStatus("Unable to connect Google Calendar. Please try again.");
    } finally {
      setIsCalendarBusy(false);
    }
  }

  async function disconnectCalendar() {
    try {
      setIsCalendarBusy(true);
      await disconnectGoogleCalendarAccount();
      await clearCalendarConnection();
      setCalendarConnection({
        connected: false,
        email: null,
        lastConnectedAt: null,
        provider: "google"
      });
      setCalendarStatus("Not connected");
    } catch (error) {
      devLog.warn("Unable to disconnect Google Calendar.", error);
      setCalendarStatus("Unable to disconnect Google Calendar. Please try again.");
    } finally {
      setIsCalendarBusy(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton label="Back to home" symbol="‹" onPress={() => navigation.navigate("Home")} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpace} />
      </View>

      <Text style={styles.title}>Settings</Text>

      <SectionHeader>Integrations</SectionHeader>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Connect Google Calendar</Text>
          <Text style={styles.meta}>
            {calendarConnection.connected
              ? calendarConnection.email ?? "Calendar connected"
              : "Use today's meetings to suggest titles."}
          </Text>
          <Text style={styles.meta}>{calendarStatus}</Text>
        </View>
        <SecondaryButton onPress={calendarConnection.connected ? disconnectCalendar : connectCalendar}>
          {isCalendarBusy ? "Working" : calendarConnection.connected ? "Disconnect" : "Connect"}
        </SecondaryButton>
      </View>

      <View style={styles.section}>
        <SectionHeader>Storage</SectionHeader>
        <View style={styles.dividerRow}>
          <Text style={styles.rowTitle}>Meeting Recall folder</Text>
          <Text style={styles.meta}>Recordings are saved locally and accessible from your device files.</Text>
        </View>
        <View style={styles.dividerRow}>
          <Text style={styles.rowTitle}>File naming</Text>
          <Text style={styles.meta}>YYYY-MM-DD - Meeting Name.m4a</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader>About</SectionHeader>
        {["Support", "Terms", "Privacy Policy"].map((item) => (
          <View key={item} style={styles.linkRow}>
            <Text style={styles.rowTitle}>{item}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
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
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700"
  },
  headerSpace: {
    width: 48
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.display.fontSize,
    fontWeight: theme.typography.display.fontWeight,
    lineHeight: theme.typography.display.lineHeight,
    marginBottom: theme.spacing["2xl"]
  },
  section: {
    marginTop: theme.spacing["2xl"]
  },
  row: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg
  },
  rowText: {
    flex: 1
  },
  dividerRow: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: theme.spacing.lg
  },
  linkRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg
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
  chevron: {
    color: theme.colors.textSubtle,
    fontSize: 30
  }
});
