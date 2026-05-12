import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../../constants/theme";

type SecondaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
};

export function SecondaryButton({ children, onPress }: SecondaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.pill,
    borderColor: theme.colors.divider,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.lg
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight
  }
});
