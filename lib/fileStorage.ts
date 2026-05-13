import * as FileSystem from "expo-file-system/legacy";

const ANDROID_EXPORT_PARENT_FOLDER = "Documents";
const DEFAULT_RECORDING_TITLE = "Test Recording";
const SAF_FOLDER_STORE_FILE = "meeting-recall-saf-folder-uri.txt";
export const RECORDING_SHARE_MIME_TYPE = "audio/mp4";
export const RECORDING_SHARE_FALLBACK_MIME_TYPE = "audio/x-m4a";

export type SavedRecording = {
  durationMillis: number;
  fileName: string;
  fileSize: number;
  fileUri: string;
  folderUri: string;
  title: string;
};

export type DeleteRecordingFileResult = {
  deleted: boolean;
  errorMessage?: string;
  fileExisted: boolean;
};

export type ShareableRecordingFile = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uri: string;
};

type SaveRecordingInput = {
  durationMillis: number;
  folderUri?: string | null;
  sourceUri: string;
  title: string;
};

export function formatMillis(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function sanitizeRecordingTitle(title: string) {
  return title
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim() || DEFAULT_RECORDING_TITLE;
}

export function buildRecordingFileName(title: string, date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day} \u2013 ${sanitizeRecordingTitle(title)}.m4a`;
}

export function ensureM4aFileName(fileName: string) {
  const trimmedName = fileName.trim();

  if (!trimmedName) {
    return buildRecordingFileName(DEFAULT_RECORDING_TITLE);
  }

  return trimmedName.toLowerCase().endsWith(".m4a") ? trimmedName : `${trimmedName}.m4a`;
}

function getStoredSafFolderFileUri() {
  return FileSystem.documentDirectory
    ? `${FileSystem.documentDirectory}${SAF_FOLDER_STORE_FILE}`
    : null;
}

export async function loadStoredMeetingRecallFolderUri() {
  const storedUriFile = getStoredSafFolderFileUri();

  if (!storedUriFile) {
    return null;
  }

  const fileInfo = await FileSystem.getInfoAsync(storedUriFile);

  if (!fileInfo.exists) {
    return null;
  }

  return FileSystem.readAsStringAsync(storedUriFile);
}

async function persistMeetingRecallFolderUri(folderUri: string) {
  const storedUriFile = getStoredSafFolderFileUri();

  if (!storedUriFile) {
    return;
  }

  await FileSystem.writeAsStringAsync(storedUriFile, folderUri);
}

export async function chooseMeetingRecallFolder() {
  const initialFolderUri =
    FileSystem.StorageAccessFramework.getUriForDirectoryInRoot(ANDROID_EXPORT_PARENT_FOLDER);
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(initialFolderUri);

  if (!permissions.granted) {
    throw new Error("Folder access was not granted.");
  }

  await persistMeetingRecallFolderUri(permissions.directoryUri);

  return permissions.directoryUri;
}

function getFileSize(fileInfo: Awaited<ReturnType<typeof FileSystem.getInfoAsync>>) {
  return fileInfo.exists && "size" in fileInfo && typeof fileInfo.size === "number"
    ? fileInfo.size
    : null;
}

async function createSafAudioFile(folderUri: string, fileName: string) {
  const extension = ".m4a";
  const baseName = fileName.replace(/\.m4a$/i, "");

  for (let index = 1; index <= 5; index += 1) {
    const candidateName = index === 1 ? fileName : `${baseName} (${index})${extension}`;

    try {
      return {
        fileName: candidateName,
        uri: await FileSystem.StorageAccessFramework.createFileAsync(
          folderUri,
          candidateName,
          "audio/mp4"
        )
      };
    } catch {
      // Android document providers differ in duplicate-name behavior.
    }
  }

  const fallbackName = `${baseName} (${Date.now()})${extension}`;

  return {
    fileName: fallbackName,
    uri: await FileSystem.StorageAccessFramework.createFileAsync(folderUri, fallbackName, "audio/mp4")
  };
}

async function deleteSafFileIfPossible(fileUri: string) {
  try {
    await FileSystem.StorageAccessFramework.deleteAsync(fileUri);
  } catch {
    // Best-effort cleanup only. Save validation still reports the failure.
  }
}

export async function saveRecordingToMeetingRecallFolder({
  durationMillis,
  folderUri,
  sourceUri,
  title
}: SaveRecordingInput): Promise<SavedRecording> {
  const sourceInfo = await FileSystem.getInfoAsync(sourceUri);
  const sourceSize = getFileSize(sourceInfo);

  if (!sourceInfo.exists || sourceSize === null || sourceSize <= 0) {
    throw new Error("Source recording file is empty or unreadable.");
  }

  const targetFolderUri = folderUri ?? await chooseMeetingRecallFolder();
  const cleanTitle = sanitizeRecordingTitle(title);
  const targetFile = await createSafAudioFile(targetFolderUri, buildRecordingFileName(cleanTitle));

  try {
    const recordingBase64 = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64
    });

    if (!recordingBase64) {
      throw new Error("Source recording file is empty or unreadable.");
    }

    await FileSystem.StorageAccessFramework.writeAsStringAsync(targetFile.uri, recordingBase64, {
      encoding: FileSystem.EncodingType.Base64
    });

    const targetInfo = await FileSystem.getInfoAsync(targetFile.uri);
    const targetSize = getFileSize(targetInfo);

    if (!targetInfo.exists || targetSize === null || targetSize <= 0) {
      await deleteSafFileIfPossible(targetFile.uri);
      throw new Error("Saved file is missing or empty.");
    }

    return {
      durationMillis,
      fileName: targetFile.fileName,
      fileSize: targetSize,
      fileUri: targetFile.uri,
      folderUri: targetFolderUri,
      title: cleanTitle
    };
  } catch (error) {
    await deleteSafFileIfPossible(targetFile.uri);
    throw error;
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function deleteRecordingFileIfPossible(
  fileUri: string
): Promise<DeleteRecordingFileResult> {
  let fileInfo: Awaited<ReturnType<typeof FileSystem.getInfoAsync>>;

  try {
    fileInfo = await FileSystem.getInfoAsync(fileUri);
  } catch (error) {
    return {
      deleted: false,
      errorMessage: getErrorMessage(error),
      fileExisted: true
    };
  }

  if (!fileInfo.exists) {
    return {
      deleted: false,
      fileExisted: false
    };
  }

  try {
    if (fileUri.startsWith("content://")) {
      await FileSystem.StorageAccessFramework.deleteAsync(fileUri);
    } else {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }

    return {
      deleted: true,
      fileExisted: true
    };
  } catch (error) {
    return {
      deleted: false,
      errorMessage: getErrorMessage(error),
      fileExisted: true
    };
  }
}

export async function prepareRecordingForShare({
  fileName,
  fileUri
}: {
  fileName: string;
  fileUri: string;
}): Promise<ShareableRecordingFile> {
  const shareFileName = ensureM4aFileName(fileName);
  const sourceInfo = await FileSystem.getInfoAsync(fileUri);
  const sourceSize = getFileSize(sourceInfo);

  if (!sourceInfo.exists) {
    throw new Error("Recording file could not be found.");
  }

  if (sourceSize === null || sourceSize <= 0) {
    throw new Error("Recording file is not ready yet.");
  }

  if (!FileSystem.cacheDirectory) {
    throw new Error("Unable to prepare recording for sharing.");
  }

  const shareUri = `${FileSystem.cacheDirectory}${shareFileName}`;

  try {
    const existingShareFile = await FileSystem.getInfoAsync(shareUri);

    if (existingShareFile.exists) {
      await FileSystem.deleteAsync(shareUri, { idempotent: true });
    }

    await FileSystem.copyAsync({
      from: fileUri,
      to: shareUri
    });

    const shareInfo = await FileSystem.getInfoAsync(shareUri);
    const shareSize = getFileSize(shareInfo);

    if (!shareInfo.exists || shareSize === null || shareSize <= 0) {
      throw new Error("Unable to prepare recording for sharing.");
    }

    return {
      fileName: shareFileName,
      fileSize: shareSize,
      mimeType: RECORDING_SHARE_MIME_TYPE,
      uri: shareUri
    };
  } catch (error) {
    try {
      await FileSystem.deleteAsync(shareUri, { idempotent: true });
    } catch {
      // Best-effort cleanup only.
    }

    throw error;
  }
}
