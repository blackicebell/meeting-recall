import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { IconButton, PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "NotebookLMHelper">;

const steps = ["Open NotebookLM", "Tap Add Source", "Upload your recording"];

export function NotebookLMHelperScreen({ navigation }: Props) {
  return (
    <Screen>
      <IconButton label="Back to recording detail" symbol="‹" onPress={() => navigation.navigate("RecordingDetail")} />
      <Text style={styles.badge}>Saved</Text>
      <Text style={styles.title}>Your recording is ready.</Text>
      <Text style={styles.body}>
        We saved it to your Meeting Recall folder so it is easy to find when uploading to NotebookLM.
      </Text>

      <View style={styles.steps}>
        {steps.map((step, index) => (
          <View key={step} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton onPress={() => undefined}>Open NotebookLM</PrimaryButton>
        <SecondaryButton onPress={() => navigation.navigate("RecordingDetail")}>Share instead</SecondaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginTop: theme.spacing["2xl"],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.display.fontSize,
    fontWeight: theme.typography.display.fontWeight,
    lineHeight: theme.typography.display.lineHeight,
    marginTop: theme.spacing.xl
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    marginTop: theme.spacing.lg
  },
  steps: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: theme.spacing["2xl"]
  },
  step: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg
  },
  stepNumber: {
    alignItems: "center",
    borderColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  stepNumberText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize
  },
  stepText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700"
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing["2xl"]
  }
});
