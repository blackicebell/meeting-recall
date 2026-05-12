import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { IconButton, PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "RecordingDetail">;

export function RecordingDetailScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.header}>
        <IconButton label="Back to home" symbol="‹" onPress={() => navigation.navigate("Home")} />
        <Text style={styles.headerLabel}>Recording</Text>
        <View style={styles.headerSpace} />
      </View>

      <Text style={styles.title}>2026-05-11 - Meeting Yoshi</Text>
      <Text style={styles.meta}>42:18 · Saved locally</Text>

      <View style={styles.waveform}>
        {Array.from({ length: 36 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: 22 + ((index * 19) % 58),
                backgroundColor: index < 12 ? theme.colors.primary : theme.colors.divider
              }
            ]}
          />
        ))}
      </View>

      <View style={styles.playback}>
        <IconButton label="Rewind 15 seconds" symbol="↺" onPress={() => undefined} />
        <IconButton label="Play recording" symbol="▶" onPress={() => undefined} />
        <IconButton label="Forward 15 seconds" symbol="↻" onPress={() => undefined} />
      </View>

      <View style={styles.actions}>
        <PrimaryButton onPress={() => navigation.navigate("NotebookLMHelper")}>Open NotebookLM</PrimaryButton>
        <Text style={styles.helper}>Upload this file from your Meeting Recall folder.</Text>
        <View style={styles.secondaryActions}>
          <SecondaryButton onPress={() => undefined}>Share</SecondaryButton>
          <SecondaryButton onPress={() => undefined}>Rename</SecondaryButton>
          <SecondaryButton onPress={() => undefined}>Delete</SecondaryButton>
        </View>
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
  headerLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    textTransform: "uppercase"
  },
  headerSpace: {
    width: 48
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    lineHeight: theme.typography.title.lineHeight
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body.fontSize,
    marginTop: theme.spacing.md
  },
  waveform: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    height: 110,
    marginTop: theme.spacing["3xl"]
  },
  bar: {
    width: 4,
    borderRadius: theme.radii.pill
  },
  playback: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing["2xl"],
    marginTop: theme.spacing.xl
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing["3xl"]
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    textAlign: "center"
  },
  secondaryActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
    marginTop: theme.spacing.md
  }
});
