import { Image, Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../../constants/theme";

const FLUENT_DELETE_ICON_URI =
  "https://cdn.creazilla.com/icons/3181325/ic-fluent-delete-20-regular-icon-md.png";
const FLUENT_SETTINGS_ICON_URI =
  "https://cdn.creazilla.com/icons/3183538/ic-fluent-settings-16-regular-icon-md.png";

type IconButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  tone?: "default" | "destructive" | "muted";
} & (
  | {
      icon?: never;
      symbol: string;
    }
  | {
      icon: "delete";
      symbol?: never;
    }
  | {
      icon: "settings";
      symbol?: never;
    }
);

function getToneColor(tone: NonNullable<IconButtonProps["tone"]>) {
  if (tone === "destructive") {
    return theme.colors.recording;
  }

  if (tone === "muted") {
    return theme.colors.textMuted;
  }

  return theme.colors.text;
}

export function IconButton({
  disabled = false,
  icon,
  label,
  onPress,
  symbol,
  tone = "default"
}: IconButtonProps) {
  const iconColor = getToneColor(tone);

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : null]}
    >
      {icon === "delete" ? (
        <Image
          source={{ uri: FLUENT_DELETE_ICON_URI }}
          style={[styles.iconImage, { tintColor: iconColor }]}
        />
      ) : icon === "settings" ? (
        <Image
          source={{ uri: FLUENT_SETTINGS_ICON_URI }}
          style={[styles.iconImage, { tintColor: iconColor }]}
        />
      ) : (
        <Text style={[styles.symbol, { color: iconColor }]}>{symbol}</Text>
      )}
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
  buttonDisabled: {
    opacity: 0.45
  },
  symbol: {
    fontSize: 24,
    includeFontPadding: false,
    lineHeight: 28,
    textAlign: "center"
  },
  iconImage: {
    height: 24,
    resizeMode: "contain",
    width: 24
  }
});
