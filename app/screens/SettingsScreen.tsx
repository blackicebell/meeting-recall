import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { IconButton, Screen, SecondaryButton, SectionHeader } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
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
          <Text style={styles.meta}>Use today&apos;s meetings to suggest titles.</Text>
        </View>
        <SecondaryButton onPress={() => undefined}>Connect</SecondaryButton>
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
