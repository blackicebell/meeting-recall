import type { StoredRecording } from "../lib/recordingStore";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Recording: undefined;
  SaveRecording: {
    durationMillis: number;
    tempUri: string;
  };
  RecordingDetail: StoredRecording;
  Settings: undefined;
};
