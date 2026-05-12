import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View>
          <Text style={styles.brand}>Meeting Recall</Text>
          <Text style={styles.title}>Record meetings. Recall everything.</Text>
          <Text style={styles.body}>
            Capture important conversations with a simple, focused recording app built for NotebookLM workflows.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.navigate("Home")}>Get started</PrimaryButton>
          <SecondaryButton onPress={() => navigation.navigate("Home")}>Skip for now</SecondaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  brand: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: theme.spacing["3xl"]
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.display.fontSize,
    fontWeight: theme.typography.display.fontWeight,
    lineHeight: theme.typography.display.lineHeight
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    marginTop: theme.spacing.xl
  },
  actions: {
    gap: theme.spacing.md
  }
});
