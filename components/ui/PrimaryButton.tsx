import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../../constants/theme";

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
};

export function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl
  },
  label: {
    color: theme.colors.white,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight
  }
});
