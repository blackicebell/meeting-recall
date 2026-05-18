import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../../constants/theme";

type PrimaryButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
};

export function PrimaryButton({ children, disabled = false, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : null]}
    >
      <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>{children}</Text>
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
  buttonDisabled: {
    backgroundColor: theme.colors.divider
  },
  label: {
    color: theme.colors.white,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight
  },
  labelDisabled: {
    color: theme.colors.textMuted
  }
});
