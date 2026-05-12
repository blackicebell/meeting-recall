import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../../constants/theme";

type IconButtonProps = {
  label: string;
  symbol: string;
  onPress: () => void;
};

export function IconButton({ label, symbol, onPress }: IconButtonProps) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.symbol}>{symbol}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.pill
  },
  symbol: {
    color: theme.colors.text,
    fontSize: 24
  }
});
