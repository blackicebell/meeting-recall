import * as FileSystem from "expo-file-system/legacy";
import { createAudioPlayer } from "expo-audio";
import { Platform } from "react-native";

import { devLog } from "./devLog";

const ANDROID_EXPORT_PARENT_FOLDER = "Documents";
export const DEFAULT_RECORDING_TITLE = "Meeting Recording";
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

type FinalizedFileInfo = {
  exists: true;
  size: number;
  uri: string;
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
  if (Platform.OS !== "android") {
    return null;
  }

  return FileSystem.documentDirectory
    ? `${FileSystem.documentDirectory}${SAF_FOLDER_STORE_FILE}`
    : null;
}

export function getRecordingLocationLabel() {
  return Platform.OS === "android"
    ? "Documents \u2192 Meeting Recall"
    : "Meeting Recall on this device";
}

export function getStorageSetupCopy() {
  if (Platform.OS === "android") {
    return {
      body: "We recommend Documents - Meeting Recall so your files are easy to find when uploading to NotebookLM.",
      button: "Choose Folder",
      ready: "Meeting Recall folder is ready.",
      title: "Choose where recordings are saved"
    };
  }

  return {
    body: "Use Share when you want to send a recording to NotebookLM or another app.",
    button: "Continue",
    ready: null,
    title: "Saved inside Meeting Recall"
  };
}

async function getIosMeetingRecallFolderUri() {
  if (!FileSystem.documentDirectory) {
    throw new Error("App document storage is unavailable.");
  }

  return FileSystem.documentDirectory;
}

export async function loadStoredMeetingRecallFolderUri() {
  if (Platform.OS !== "android") {
    try {
      return await getIosMeetingRecallFolderUri();
    } catch {
      return null;
    }
  }

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
  if (Platform.OS !== "android") {
    return;
  }

  const storedUriFile = getStoredSafFolderFileUri();

  if (!storedUriFile) {
    return;
  }

  await FileSystem.writeAsStringAsync(storedUriFile, folderUri);
}

export async function chooseMeetingRecallFolder() {
  if (Platform.OS !== "android") {
    return getIosMeetingRecallFolderUri();
  }

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

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function getReadableFileInfo(fileUri: string): Promise<FinalizedFileInfo> {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  const fileSize = getFileSize(fileInfo);

  if (!fileInfo.exists || fileSize === null || fileSize <= 0) {
    throw new Error("Recording file is empty or unreadable.");
  }

  return {
    exists: true,
    size: fileSize,
    uri: fileInfo.uri
  };
}

async function waitForFinalizedFile(fileUri: string, label: string): Promise<FinalizedFileInfo> {
  let previousSize: number | null = null;
  let stableReadCount = 0;
  let latestInfo: FinalizedFileInfo | null = null;

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      latestInfo = await getReadableFileInfo(fileUri);
      devLog.info(`${label} finalization check`, {
        attempt,
        size: latestInfo.size,
        uri: latestInfo.uri
      });

      if (latestInfo.size === previousSize) {
        stableReadCount += 1;
      } else {
        stableReadCount = 1;
      }

      if (stableReadCount >= 2) {
        return latestInfo;
      }

      previousSize = latestInfo.size;
    } catch (error) {
      devLog.warn(`${label} finalization check failed`, error);
    }

    await wait(250);
  }

  if (latestInfo) {
    return latestInfo;
  }

  throw new Error("Recording file is empty or unreadable.");
}

async function validateAudioCanInitialize(fileUri: string, label: string) {
  const player = createAudioPlayer({ uri: fileUri }, { updateInterval: 100 });

  try {
    for (let attempt = 1; attempt <= 10; attempt += 1) {
      const status = player.currentStatus;

      devLog.info(`${label} playback validation check`, {
        attempt,
        duration: status.duration,
        isLoaded: status.isLoaded,
        playbackState: status.playbackState,
        uri: fileUri
      });

      if (status.isLoaded || status.duration > 0) {
        return;
      }

      await wait(150);
    }

    throw new Error("Recording could not be finalized.");
  } finally {
    player.remove();
  }
}

async function createSafAudioFile(folderUri: string, fileName: string) {
  if (Platform.OS !== "android") {
    throw new Error("Android folder export is not available on this device.");
  }

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

async function createAppDocumentAudioFile(folderUri: string, fileName: string) {
  const extension = ".m4a";
  const baseName = fileName.replace(/\.m4a$/i, "");

  await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });

  for (let index = 1; index <= 5; index += 1) {
    const candidateName = index === 1 ? fileName : `${baseName} (${index})${extension}`;
    const candidateUri = `${folderUri}${candidateName}`;
    const candidateInfo = await FileSystem.getInfoAsync(candidateUri);

    if (!candidateInfo.exists) {
      return {
        fileName: candidateName,
        uri: candidateUri
      };
    }
  }

  const fallbackName = `${baseName} (${Date.now()})${extension}`;

  return {
    fileName: fallbackName,
    uri: `${folderUri}${fallbackName}`
  };
}

async function createPlatformAudioFile(folderUri: string, fileName: string) {
  return Platform.OS === "android"
    ? createSafAudioFile(folderUri, fileName)
    : createAppDocumentAudioFile(folderUri, fileName);
}

async function deleteSafFileIfPossible(fileUri: string) {
  try {
    if (Platform.OS === "android" && fileUri.startsWith("content://")) {
      await FileSystem.StorageAccessFramework.deleteAsync(fileUri);
      return;
    }

    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  } catch {
    // Best-effort cleanup only. Save validation still reports the failure.
  }
}

async function writeRecordingToPlatformFile(sourceUri: string, targetUri: string) {
  if (Platform.OS === "android" && targetUri.startsWith("content://")) {
    const recordingBase64 = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64
    });

    if (!recordingBase64) {
      throw new Error("Source recording file is empty or unreadable.");
    }

    await FileSystem.StorageAccessFramework.writeAsStringAsync(targetUri, recordingBase64, {
      encoding: FileSystem.EncodingType.Base64
    });
    return;
  }

  await FileSystem.copyAsync({
    from: sourceUri,
    to: targetUri
  });
}

export async function saveRecordingToMeetingRecallFolder({
  durationMillis,
  folderUri,
  sourceUri,
  title
}: SaveRecordingInput): Promise<SavedRecording> {
  const exportStartedAt = Date.now();
  const sourceInfo = await waitForFinalizedFile(sourceUri, "Source recording");
  await validateAudioCanInitialize(sourceUri, "Source recording");

  const targetFolderUri = Platform.OS === "android"
    ? folderUri ?? await chooseMeetingRecallFolder()
    : await getIosMeetingRecallFolderUri();
  const cleanTitle = sanitizeRecordingTitle(title);
  const targetFile = await createPlatformAudioFile(
    targetFolderUri,
    buildRecordingFileName(cleanTitle)
  );

  try {
    devLog.info("Recording export started", {
      fileName: targetFile.fileName,
      sourceSize: sourceInfo.size,
      sourceUri,
      targetUri: targetFile.uri
    });

    await writeRecordingToPlatformFile(sourceUri, targetFile.uri);

    const targetInfo = await waitForFinalizedFile(targetFile.uri, "Exported recording");
    await validateAudioCanInitialize(targetFile.uri, "Exported recording");

    devLog.info("Recording export completed", {
      elapsedMs: Date.now() - exportStartedAt,
      exportedFileSize: targetInfo.size,
      exportedUri: targetFile.uri,
      fileName: targetFile.fileName,
      playbackValidation: true,
      sourceFileSize: sourceInfo.size
    });

    return {
      durationMillis,
      fileName: targetFile.fileName,
      fileSize: targetInfo.size,
      fileUri: targetFile.uri,
      folderUri: targetFolderUri,
      title: cleanTitle
    };
  } catch (error) {
    devLog.warn("Recording export failed", {
      elapsedMs: Date.now() - exportStartedAt,
      error,
      fileName: targetFile.fileName,
      sourceUri,
      targetUri: targetFile.uri
    });
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
      if (Platform.OS === "android") {
        await FileSystem.StorageAccessFramework.deleteAsync(fileUri);
      }
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
