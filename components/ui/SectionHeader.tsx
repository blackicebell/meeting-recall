import { StyleSheet, Text } from "react-native";

import { theme } from "../../constants/theme";

type SectionHeaderProps = {
  children: string;
};

export function SectionHeader({ children }: SectionHeaderProps) {
  return <Text style={styles.header}>{children.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  header: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginBottom: theme.spacing.md
  }
});
