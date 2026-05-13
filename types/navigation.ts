import type { StoredRecording } from "../lib/recordingStore";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Recording: {
    autoStart?: boolean;
    suggestedTitle?: string;
  } | undefined;
  SaveRecording: {
    durationMillis: number;
    suggestedTitle?: string;
    tempUri: string;
  };
  RecordingDetail: StoredRecording;
  Settings: undefined;
};
