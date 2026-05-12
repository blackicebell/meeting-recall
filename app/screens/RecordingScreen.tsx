import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { IconButton, Screen } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Recording">;

export function RecordingScreen({ navigation }: Props) {
  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <IconButton label="Close recording" symbol="×" onPress={() => navigation.navigate("Home")} />
        <View style={styles.status}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Recording</Text>
        </View>
        <View style={styles.headerSpace} />
      </View>

      <View style={styles.center}>
        <Text style={styles.meetingName}>Meeting Yoshi</Text>
        <Text style={styles.timer}>00:07</Text>
        <View style={styles.waveform}>
          {Array.from({ length: 32 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                { height: 24 + ((index * 17) % 58) }
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        <IconButton label="Pause recording" symbol="Ⅱ" onPress={() => undefined} />
        <IconButton label="Stop recording" symbol="■" onPress={() => navigation.navigate("SaveRecording")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  status: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.recording
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    textTransform: "uppercase"
  },
  headerSpace: {
    width: 48
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  meetingName: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginBottom: theme.spacing.xl,
    textTransform: "uppercase"
  },
  timer: {
    color: theme.colors.text,
    fontSize: 84,
    fontWeight: "300"
  },
  waveform: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    height: 96,
    marginTop: theme.spacing["2xl"]
  },
  bar: {
    width: 4,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.recording
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing["2xl"],
    paddingBottom: theme.spacing.xl
  }
});
