import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../../constants/theme";

type SecondaryButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
};

export function SecondaryButton({ children, disabled = false, onPress }: SecondaryButtonProps) {
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
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.pill,
    borderColor: theme.colors.divider,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.lg
  },
  buttonDisabled: {
    opacity: 0.55
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight
  },
  labelDisabled: {
    color: theme.colors.textMuted
  }
});
