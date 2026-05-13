import * as FileSystem from "expo-file-system/legacy";

const ONBOARDING_STATE_FILE = "meeting-recall-onboarding.json";

type OnboardingState = {
  completed: boolean;
};

function getOnboardingStateUri() {
  if (!FileSystem.documentDirectory) {
    throw new Error("App storage is unavailable.");
  }

  return `${FileSystem.documentDirectory}${ONBOARDING_STATE_FILE}`;
}

export async function loadOnboardingCompleted() {
  const stateUri = getOnboardingStateUri();
  const fileInfo = await FileSystem.getInfoAsync(stateUri);

  if (!fileInfo.exists) {
    return false;
  }

  const rawState = await FileSystem.readAsStringAsync(stateUri);
  const parsedState = JSON.parse(rawState) as Partial<OnboardingState>;

  return parsedState.completed === true;
}

export async function saveOnboardingCompleted() {
  const state: OnboardingState = {
    completed: true
  };

  await FileSystem.writeAsStringAsync(getOnboardingStateUri(), JSON.stringify(state, null, 2));
}
