import { Pressable, StyleSheet, View } from "react-native";

import { theme } from "../../constants/theme";

type RecordingActionButtonProps = {
  label: string;
  mode: "record" | "stop";
  onPress: () => void;
};

export function RecordingActionButton({ label, mode, onPress }: RecordingActionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null
      ]}
    >
      {mode === "record" ? (
        <View style={styles.microphoneIcon}>
          <View style={styles.micHead} />
          <View style={styles.micStem} />
          <View style={styles.micBase} />
        </View>
      ) : (
        <View style={styles.stopIcon} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.recording,
    borderRadius: 36,
    elevation: 8,
    height: 72,
    justifyContent: "center",
    shadowColor: theme.colors.recording,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    width: 72
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }]
  },
  microphoneIcon: {
    alignItems: "center",
    height: 38,
    justifyContent: "center",
    width: 38
  },
  micHead: {
    backgroundColor: theme.colors.white,
    borderRadius: 9,
    height: 26,
    width: 16
  },
  micStem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    height: 12,
    marginTop: -1,
    width: 3
  },
  micBase: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    height: 3,
    marginTop: 1,
    width: 20
  },
  stopIcon: {
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    height: 24,
    width: 24
  }
});
