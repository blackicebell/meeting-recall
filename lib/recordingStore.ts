import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

import type { SavedRecording } from "./fileStorage";
import { loadJsonWithLegacyFallback, saveJson } from "./appStorage";

const RECORDINGS_STORE_FILE = "meeting-recall-recordings.json";

export type StoredRecording = SavedRecording & {
  createdAt: string;
  id: string;
};

function createRecordingId() {
  return `recording-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function migrateIosNestedRecording(recording: StoredRecording) {
  if (Platform.OS !== "ios" || !FileSystem.documentDirectory) {
    return recording;
  }

  const legacyFolderUri = `${FileSystem.documentDirectory}Meeting Recall/`;

  if (!recording.fileUri.startsWith(legacyFolderUri)) {
    return recording;
  }

  const targetUri = `${FileSystem.documentDirectory}${recording.fileName}`;
  const targetInfo = await FileSystem.getInfoAsync(targetUri);

  if (targetInfo.exists) {
    return recording;
  }

  const sourceInfo = await FileSystem.getInfoAsync(recording.fileUri);

  if (!sourceInfo.exists) {
    return recording;
  }

  await FileSystem.moveAsync({
    from: recording.fileUri,
    to: targetUri
  });

  return {
    ...recording,
    fileUri: targetUri,
    folderUri: FileSystem.documentDirectory
  };
}

async function migrateIosNestedRecordings(recordings: StoredRecording[]) {
  let changed = false;
  const migratedRecordings: StoredRecording[] = [];

  for (const recording of recordings) {
    const migratedRecording = await migrateIosNestedRecording(recording);

    if (migratedRecording.fileUri !== recording.fileUri) {
      changed = true;
    }

    migratedRecordings.push(migratedRecording);
  }

  if (changed) {
    await saveRecordings(migratedRecordings);
  }

  return migratedRecordings;
}

export async function loadRecordings(): Promise<StoredRecording[]> {
  const parsed = await loadJsonWithLegacyFallback<StoredRecording[]>(RECORDINGS_STORE_FILE, []);
  const migrated = await migrateIosNestedRecordings(parsed);

  return migrated.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function saveRecordings(recordings: StoredRecording[]) {
  await saveJson(RECORDINGS_STORE_FILE, recordings);
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
