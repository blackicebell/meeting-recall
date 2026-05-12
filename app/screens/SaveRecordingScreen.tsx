import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "SaveRecording">;

export function SaveRecordingScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.sheet}>
        <Text style={styles.title}>Save recording</Text>
        <Text style={styles.body}>
          Your file will be saved to the Meeting Recall folder so it is easy to find when uploading to NotebookLM.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>2026-05-11 - Meeting Yoshi</Text>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Duration</Text>
            <Text style={styles.metaValue}>00:09</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>File size</Text>
            <Text style={styles.metaValue}>Pending</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.navigate("RecordingDetail")}>Save recording</PrimaryButton>
          <SecondaryButton onPress={() => navigation.navigate("Home")}>Discard</SecondaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: theme.spacing.xl
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    marginBottom: theme.spacing.md
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight
  },
  field: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase"
  },
  value: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700"
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xl
  },
  metaLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize
  },
  metaValue: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700",
    marginTop: theme.spacing.sm
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing["2xl"]
  }
});
