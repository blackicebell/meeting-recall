import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync
} from "expo-audio";

import { PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { theme } from "../../constants/theme";
import { chooseMeetingRecallFolder, loadStoredMeetingRecallFolderUri } from "../../lib/fileStorage";
import { loadOnboardingCompleted, saveOnboardingCompleted } from "../../lib/onboardingState";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;
type SetupPhase = "slides" | "microphone" | "microphoneDenied" | "folder";

const onboardingScreens = [
  {
    headline: "Record meetings.\nRecall everything.",
    subtext: "Capture important conversations with a simple recorder built for meetings."
  },
  {
    headline: "Use NotebookLM for insights",
    subtext:
      "Save your recording, open NotebookLM, and upload the file to get summaries, answers, and action items."
  },
  {
    headline: "Your recordings stay with you",
    subtext:
      "Files save locally to your Meeting Recall folder, so you can find and upload them when you need them."
  }
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function RecallSignalMark() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.signalMark}
    >
      <View style={[styles.signalRay, styles.signalRayLeft]} />
      <View style={[styles.signalRay, styles.signalRayCenter]} />
      <View style={[styles.signalRay, styles.signalRayRight]} />
      <View style={styles.signalDot} />
    </View>
  );
}

export function OnboardingScreen({ navigation }: Props) {
  const [phase, setPhase] = useState<SetupPhase>("slides");
  const [screenIndex, setScreenIndex] = useState(0);
  const [folderUri, setFolderUri] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const currentScreen = onboardingScreens[screenIndex];
  const progressText = useMemo(
    () => `${screenIndex + 1} of ${onboardingScreens.length}`,
    [screenIndex]
  );

  useEffect(() => {
    let isActive = true;

    async function loadSetupState() {
      try {
        const completed = await loadOnboardingCompleted();

        if (completed && isActive) {
          navigation.replace("Home");
          return;
        }

        const storedFolderUri = await loadStoredMeetingRecallFolderUri();

        if (isActive) {
          setFolderUri(storedFolderUri);
        }
      } catch {
        // First launch can continue even if stored setup state cannot be read.
      }
    }

    loadSetupState();

    return () => {
      isActive = false;
    };
  }, [navigation]);

  async function finishSetup() {
    await saveOnboardingCompleted();
    navigation.replace("Home");
  }

  async function continueFromSlides() {
    setStatusMessage(null);

    if (screenIndex < onboardingScreens.length - 1) {
      setScreenIndex((currentIndex) => currentIndex + 1);
      return;
    }

    try {
      const permission = await getRecordingPermissionsAsync();

      if (permission.granted) {
        setPhase("folder");
        return;
      }
    } catch {
      // If checking fails, still show the explainer before asking.
    }

    setPhase("microphone");
  }

  function skipSlides() {
    setStatusMessage(null);
    setPhase("microphone");
  }

  async function requestMicrophoneAccess() {
    try {
      setStatusMessage(null);
      const permission = await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        setPhase("microphoneDenied");
        return;
      }

      setPhase("folder");
    } catch (error) {
      setStatusMessage(`Unable to request microphone access. ${getErrorMessage(error)}`);
    }
  }

  async function openAppSettings() {
    try {
      await Linking.openSettings();
    } catch {
      setStatusMessage("Unable to open Settings.");
    }
  }

  async function chooseFolder() {
    try {
      setStatusMessage(null);
      const selectedFolderUri = await chooseMeetingRecallFolder();
      setFolderUri(selectedFolderUri);
      await finishSetup();
    } catch (error) {
      setStatusMessage(getErrorMessage(error));
    }
  }

  async function continueWithStoredFolder() {
    try {
      await finishSetup();
    } catch (error) {
      setStatusMessage(getErrorMessage(error));
    }
  }

  if (phase === "microphone") {
    return (
      <Screen scroll={false}>
        <View style={styles.container}>
          <View>
            <Text style={styles.kicker}>Microphone</Text>
            <Text style={styles.title}>Enable microphone access</Text>
            <Text style={styles.body}>Meeting Recall needs microphone access to record your meetings.</Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton onPress={requestMicrophoneAccess}>Allow Microphone Access</PrimaryButton>
            {statusMessage ? <Text style={styles.error}>{statusMessage}</Text> : null}
          </View>
        </View>
      </Screen>
    );
  }

  if (phase === "microphoneDenied") {
    return (
      <Screen scroll={false}>
        <View style={styles.container}>
          <View>
            <Text style={styles.kicker}>Permission needed</Text>
            <Text style={styles.title}>Microphone access is off.</Text>
            <Text style={styles.body}>Turn it on in Settings to record meetings.</Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton onPress={openAppSettings}>Open Settings</PrimaryButton>
            <SecondaryButton onPress={() => setPhase("microphone")}>Try Again</SecondaryButton>
            {statusMessage ? <Text style={styles.error}>{statusMessage}</Text> : null}
          </View>
        </View>
      </Screen>
    );
  }

  if (phase === "folder") {
    return (
      <Screen scroll={false}>
        <View style={styles.container}>
          <View>
            <Text style={styles.kicker}>Storage</Text>
            <Text style={styles.title}>Choose where recordings are saved</Text>
            <Text style={styles.body}>
              We recommend Documents - Meeting Recall so your files are easy to find when uploading to NotebookLM.
            </Text>
            {folderUri ? (
              <View style={styles.folderReady}>
                <Text style={styles.folderReadyText}>Meeting Recall folder is ready.</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.actions}>
            <PrimaryButton onPress={folderUri ? continueWithStoredFolder : chooseFolder}>
              {folderUri ? "Continue" : "Choose Folder"}
            </PrimaryButton>
            {folderUri ? (
              <SecondaryButton onPress={chooseFolder}>Choose Different Folder</SecondaryButton>
            ) : null}
            {statusMessage ? <Text style={styles.error}>{statusMessage}</Text> : null}
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View>
          <Text style={styles.brand}>Meeting Recall</Text>
          <Text style={styles.progress}>{progressText}</Text>
          {screenIndex === 0 ? <RecallSignalMark /> : null}
          <Text style={styles.title}>{currentScreen.headline}</Text>
          <Text style={styles.body}>{currentScreen.subtext}</Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton onPress={continueFromSlides}>Continue</PrimaryButton>
          <SecondaryButton onPress={skipSlides}>Skip</SecondaryButton>
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
    marginBottom: theme.spacing["2xl"]
  },
  progress: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginBottom: theme.spacing.lg,
    textTransform: "uppercase"
  },
  signalMark: {
    alignSelf: "flex-start",
    height: 52,
    marginBottom: theme.spacing.lg,
    marginLeft: 1,
    width: 62
  },
  signalDot: {
    backgroundColor: theme.colors.recording,
    borderRadius: 10,
    bottom: 3,
    height: 20,
    left: 21,
    position: "absolute",
    shadowColor: theme.colors.recording,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: 20
  },
  signalRay: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.radii.pill,
    height: 4,
    opacity: 0.16,
    position: "absolute",
    width: 26
  },
  signalRayCenter: {
    height: 26,
    left: 29,
    top: 0,
    width: 4
  },
  signalRayLeft: {
    left: 8,
    top: 17,
    transform: [{ rotate: "45deg" }]
  },
  signalRayRight: {
    right: 8,
    top: 17,
    transform: [{ rotate: "-45deg" }]
  },
  kicker: {
    color: theme.colors.primary,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    marginBottom: theme.spacing.lg,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    fontSize: 44,
    fontWeight: "300",
    lineHeight: 52
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    marginTop: theme.spacing.xl
  },
  folderReady: {
    borderColor: theme.colors.divider,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  folderReadyText: {
    color: theme.colors.text,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700"
  },
  actions: {
    gap: theme.spacing.md
  },
  error: {
    color: theme.colors.recording,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700",
    textAlign: "center"
  }
});
