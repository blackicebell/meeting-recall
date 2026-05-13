import * as FileSystem from "expo-file-system/legacy";

import type { SavedRecording } from "./fileStorage";

const RECORDINGS_STORE_FILE = "meeting-recall-recordings.json";

export type StoredRecording = SavedRecording & {
  createdAt: string;
  id: string;
};

function getStoreUri() {
  if (!FileSystem.documentDirectory) {
    throw new Error("App document storage is unavailable.");
  }

  return `${FileSystem.documentDirectory}${RECORDINGS_STORE_FILE}`;
}

function createRecordingId() {
  return `recording-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadRecordings(): Promise<StoredRecording[]> {
  const storeUri = getStoreUri();
  const storeInfo = await FileSystem.getInfoAsync(storeUri);

  if (!storeInfo.exists) {
    return [];
  }

  const rawJson = await FileSystem.readAsStringAsync(storeUri);
  const parsed = JSON.parse(rawJson) as StoredRecording[];

  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function saveRecordings(recordings: StoredRecording[]) {
  await FileSystem.writeAsStringAsync(getStoreUri(), JSON.stringify(recordings, null, 2));
}

export async function addRecording(recording: SavedRecording) {
  const recordings = await loadRecordings();
  const storedRecording: StoredRecording = {
    ...recording,
    createdAt: new Date().toISOString(),
    id: createRecordingId()
  };

  await saveRecordings([storedRecording, ...recordings]);

  return storedRecording;
}

export async function removeRecording(recordingId: string) {
  const recordings = await loadRecordings();
  const remainingRecordings = recordings.filter((recording) => recording.id !== recordingId);

  await saveRecordings(remainingRecordings);
}
