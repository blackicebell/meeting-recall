import * as FileSystem from "expo-file-system/legacy";

const APP_DATA_FOLDER = ".meeting-recall-data";

export function getDocumentStorageUri(fileName: string) {
  if (!FileSystem.documentDirectory) {
    throw new Error("App storage is unavailable.");
  }

  return `${FileSystem.documentDirectory}${fileName}`;
}

export async function getAppDataStorageUri(fileName: string) {
  if (!FileSystem.documentDirectory) {
    throw new Error("App storage is unavailable.");
  }

  const dataFolderUri = `${FileSystem.documentDirectory}${APP_DATA_FOLDER}/`;
  await FileSystem.makeDirectoryAsync(dataFolderUri, { intermediates: true });

  return `${dataFolderUri}${fileName}`;
}

export async function loadJsonWithLegacyFallback<T>(fileName: string, fallbackValue: T) {
  const currentUri = await getAppDataStorageUri(fileName);
  const currentInfo = await FileSystem.getInfoAsync(currentUri);

  if (currentInfo.exists) {
    const rawJson = await FileSystem.readAsStringAsync(currentUri);
    return JSON.parse(rawJson) as T;
  }

  const legacyUri = getDocumentStorageUri(fileName);
  const legacyInfo = await FileSystem.getInfoAsync(legacyUri);

  if (!legacyInfo.exists) {
    return fallbackValue;
  }

  const rawJson = await FileSystem.readAsStringAsync(legacyUri);
  const parsed = JSON.parse(rawJson) as T;
  await saveJson(fileName, parsed);
  await FileSystem.deleteAsync(legacyUri, { idempotent: true });

  return parsed;
}

export async function saveJson<T>(fileName: string, value: T) {
  const currentUri = await getAppDataStorageUri(fileName);
  await FileSystem.writeAsStringAsync(currentUri, JSON.stringify(value, null, 2));

  const legacyUri = getDocumentStorageUri(fileName);
  await FileSystem.deleteAsync(legacyUri, { idempotent: true });
}

export async function deleteJson(fileName: string) {
  const currentUri = await getAppDataStorageUri(fileName);
  await FileSystem.deleteAsync(currentUri, { idempotent: true });

  const legacyUri = getDocumentStorageUri(fileName);
  await FileSystem.deleteAsync(legacyUri, { idempotent: true });
}
