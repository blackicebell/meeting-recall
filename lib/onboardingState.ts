import { loadJsonWithLegacyFallback, saveJson } from "./appStorage";

const ONBOARDING_STATE_FILE = "meeting-recall-onboarding.json";

type OnboardingState = {
  completed: boolean;
};

export async function loadOnboardingCompleted() {
  const parsedState = await loadJsonWithLegacyFallback<Partial<OnboardingState>>(
    ONBOARDING_STATE_FILE,
    {}
  );

  return parsedState.completed === true;
}

export async function saveOnboardingCompleted() {
  const state: OnboardingState = {
    completed: true
  };

  await saveJson(ONBOARDING_STATE_FILE, state);
}
