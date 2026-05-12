import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";

import { Screen } from "../../components/ui";
import { theme } from "../../constants/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Recording">;

type SpikeRecordingStatus = "idle" | "preparing" | "recording" | "paused" | "stopped";
type FileCheckStatus = "not checked" | "exists" | "missing";
type RenameAttempt = {
  fileName: string;
  oldDeleted: boolean;
  size: number | null;
  strategy: string;
  uri: string;
};

type DirectRenameResult =
  | RenameAttempt
  | {
      didRename: false;
      reason: string;
    };

const NOTEBOOKLM_URL = "https://notebooklm.google.com/";
const ANDROID_EXPORT_PARENT_FOLDER = "Documents";
const DEFAULT_RECORDING_TITLE = "Test Recording";
const SAF_FOLDER_STORE_FILE = "meeting-recall-saf-folder-uri.txt";

function formatMillis(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatSeconds(seconds: number) {
  return formatMillis(seconds * 1000);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getDatePrefix() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sanitizeRecordingTitle(title: string) {
  return title
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim() || DEFAULT_RECORDING_TITLE;
}

function buildRecordingFileName(title: string) {
  return `${getDatePrefix()} \u2013 ${sanitizeRecordingTitle(title)}.m4a`;
}

function getFileNameFromUri(uri: string | null) {
  if (!uri) {
    return "none";
  }

  const lastSegment = uri.split("/").pop() ?? uri;
  return decodeURIComponent(lastSegment);
}

function describeStorageMethod(uri: string | null) {
  if (!uri) {
    return "none";
  }

  if (uri.startsWith("content://")) {
    return "Storage Access Framework URI";
  }

  if (FileSystem.documentDirectory && uri.startsWith(FileSystem.documentDirectory)) {
    return "app documentDirectory";
  }

  if (FileSystem.cacheDirectory && uri.startsWith(FileSystem.cacheDirectory)) {
    return "app cacheDirectory";
  }

  if (uri.startsWith("file://")) {
    return "file URI, location needs validation";
  }

  return "unknown";
}

function getStoredSafFolderFileUri() {
  return FileSystem.documentDirectory
    ? `${FileSystem.documentDirectory}${SAF_FOLDER_STORE_FILE}`
    : null;
}

function getFileSizeDebug(fileInfo: Awaited<ReturnType<typeof FileSystem.getInfoAsync>>) {
  return fileInfo.exists && "size" in fileInfo && typeof fileInfo.size === "number"
    ? fileInfo.size
    : null;
}

export function RecordingScreen({ navigation }: Props) {
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  const [recordingStatus, setRecordingStatus] = useState<SpikeRecordingStatus>("idle");
  const [savedFileUri, setSavedFileUri] = useState<string | null>(null);
  const [exportedFileUri, setExportedFileUri] = useState<string | null>(null);
  const [preparedFileUri, setPreparedFileUri] = useState<string | null>(null);
  const [meetingRecallFolderUri, setMeetingRecallFolderUri] = useState<string | null>(null);
  const [folderChoiceStatus, setFolderChoiceStatus] = useState("not selected");
  const [folderPersistenceStatus, setFolderPersistenceStatus] = useState("not persisted");
  const [displayName, setDisplayName] = useState(DEFAULT_RECORDING_TITLE);
  const [renameInput, setRenameInput] = useState("Renamed Test Recording");
  const [actualFileName, setActualFileName] = useState(buildRecordingFileName(DEFAULT_RECORDING_TITLE));
  const [renameOldFileName, setRenameOldFileName] = useState("none");
  const [renameNewFileName, setRenameNewFileName] = useState("none");
  const [renameOldFileUri, setRenameOldFileUri] = useState<string | null>(null);
  const [renameNewFileUri, setRenameNewFileUri] = useState<string | null>(null);
  const [renameStrategy, setRenameStrategy] = useState("not tested");
  const [renameNewFileSize, setRenameNewFileSize] = useState("not checked");
  const [renameOldFileDeleted, setRenameOldFileDeleted] = useState("not checked");
  const [finalActiveFileUri, setFinalActiveFileUri] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("not copied");
  const [prepareStatus, setPrepareStatus] = useState("not prepared");
  const [renameStatus, setRenameStatus] = useState("not renamed");
  const [originalFileCheck, setOriginalFileCheck] = useState<FileCheckStatus>("not checked");
  const [exportedFileCheck, setExportedFileCheck] = useState<FileCheckStatus>("not checked");
  const [preparedFileCheck, setPreparedFileCheck] = useState<FileCheckStatus>("not checked");
  const [oldRenamedFileCheck, setOldRenamedFileCheck] = useState<FileCheckStatus>("not checked");
  const [shareStatus, setShareStatus] = useState("not shared");
  const [notebookLmStatus, setNotebookLmStatus] = useState("not opened");
  const [lastError, setLastError] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const playerSource = useMemo(() => (savedFileUri ? { uri: savedFileUri } : null), [savedFileUri]);
  const player = useAudioPlayer(playerSource, { updateInterval: 250 });
  const playerStatus = useAudioPlayerStatus(player);
  const currentFileName = useMemo(() => buildRecordingFileName(displayName), [displayName]);

  useEffect(() => {
    async function loadPermissionStatus() {
      try {
        const permission = await getRecordingPermissionsAsync();
        setPermissionStatus(permission.status);
      } catch (error) {
        setLastError(`Permission check failed: ${getErrorMessage(error)}`);
      }
    }

    loadPermissionStatus();
  }, []);

  useEffect(() => {
    async function loadStoredSafFolderUri() {
      try {
        const storedUriFile = getStoredSafFolderFileUri();

        if (!storedUriFile) {
          setFolderPersistenceStatus("app documentDirectory unavailable");
          return;
        }

        const fileInfo = await FileSystem.getInfoAsync(storedUriFile);

        if (!fileInfo.exists) {
          setFolderPersistenceStatus("no stored SAF folder URI");
          return;
        }

        const storedUri = await FileSystem.readAsStringAsync(storedUriFile);
        setMeetingRecallFolderUri(storedUri);
        setFolderChoiceStatus("loaded stored SAF folder URI");
        setFolderPersistenceStatus("loaded from app documentDirectory");
      } catch (error) {
        setFolderPersistenceStatus(`load failed: ${getErrorMessage(error)}`);
      }
    }

    loadStoredSafFolderUri();
  }, []);

  async function requestPermission() {
    try {
      setLastError(null);
      const permission = await requestRecordingPermissionsAsync();
      setPermissionStatus(permission.status);

      if (!permission.granted) {
        setLastError("Microphone permission was denied.");
      }

      return permission.granted;
    } catch (error) {
      setLastError(`Permission request failed: ${getErrorMessage(error)}`);
      return false;
    }
  }

  async function startRecording() {
    try {
      setLastError(null);
      setRecordingStatus("preparing");

      const permissionGranted =
        permissionStatus === "granted" ? true : await requestPermission();

      if (!permissionGranted) {
        setRecordingStatus("idle");
        return;
      }

      player.pause();
      await player.seekTo(0);

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: "doNotMix",
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setSavedFileUri(null);
      setExportedFileUri(null);
      setPreparedFileUri(null);
      setDisplayName(DEFAULT_RECORDING_TITLE);
      setRenameInput("Renamed Test Recording");
      setActualFileName(buildRecordingFileName(DEFAULT_RECORDING_TITLE));
      setRenameOldFileName("none");
      setRenameNewFileName("none");
      setRenameOldFileUri(null);
      setRenameNewFileUri(null);
      setRenameStrategy("not tested");
      setRenameNewFileSize("not checked");
      setRenameOldFileDeleted("not checked");
      setFinalActiveFileUri(null);
      setCopyStatus("not copied");
      setPrepareStatus("not prepared");
      setRenameStatus("not renamed");
      setOriginalFileCheck("not checked");
      setExportedFileCheck("not checked");
      setPreparedFileCheck("not checked");
      setOldRenamedFileCheck("not checked");
      setShareStatus("not shared");
      setNotebookLmStatus("not opened");
      setRecordingStatus("recording");
    } catch (error) {
      setRecordingStatus("idle");
      setLastError(`Unable to start recording: ${getErrorMessage(error)}`);
    }
  }

  function pauseRecording() {
    try {
      setLastError(null);
      recorder.pause();
      setRecordingStatus("paused");
    } catch (error) {
      setLastError(`Unable to pause recording: ${getErrorMessage(error)}`);
    }
  }

  function resumeRecording() {
    try {
      setLastError(null);
      recorder.record();
      setRecordingStatus("recording");
    } catch (error) {
      setLastError(`Unable to resume recording: ${getErrorMessage(error)}`);
    }
  }

  async function stopRecording() {
    try {
      setLastError(null);
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });

      const uri = recorder.uri ?? recorderState.url;
      setSavedFileUri(uri);
      setRecordingStatus("stopped");

      if (!uri) {
        setLastError("Recording stopped, but no file URI was returned.");
        return;
      }

      await testOriginalFileExists(uri);
    } catch (error) {
      setLastError(`Unable to stop recording: ${getErrorMessage(error)}`);
    }
  }

  async function testOriginalFileExists(uri = savedFileUri) {
    try {
      setLastError(null);

      if (!uri) {
        setOriginalFileCheck("missing");
        setLastError("No original recording URI is available yet.");
        return false;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      setOriginalFileCheck(fileInfo.exists ? "exists" : "missing");

      if (!fileInfo.exists) {
        setLastError("Original recording file could not be found.");
      }

      return fileInfo.exists;
    } catch (error) {
      setOriginalFileCheck("missing");
      setLastError(`Unable to check original file: ${getErrorMessage(error)}`);
      return false;
    }
  }

  async function testExportedFileExists(uri = exportedFileUri) {
    try {
      setLastError(null);

      if (!uri) {
        setExportedFileCheck("missing");
        setLastError("No exported file URI is available yet.");
        return false;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      setExportedFileCheck(fileInfo.exists ? "exists" : "missing");

      if (!fileInfo.exists) {
        setLastError("Exported file could not be found.");
      }

      return fileInfo.exists;
    } catch (error) {
      setExportedFileCheck("missing");
      setLastError(`Unable to check exported file: ${getErrorMessage(error)}`);
      return false;
    }
  }

  async function testPreparedFileExists(uri = preparedFileUri) {
    try {
      setLastError(null);

      if (!uri) {
        setPreparedFileCheck("missing");
        setLastError("No prepared NotebookLM file URI is available yet.");
        return false;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      setPreparedFileCheck(fileInfo.exists ? "exists" : "missing");

      if (!fileInfo.exists) {
        setLastError("Prepared NotebookLM file could not be found.");
      }

      return fileInfo.exists;
    } catch (error) {
      setPreparedFileCheck("missing");
      setLastError(`Unable to check prepared file: ${getErrorMessage(error)}`);
      return false;
    }
  }

  async function getOrCreateMeetingRecallFolder(parentDirectoryUri: string) {
    try {
      return await FileSystem.StorageAccessFramework.makeDirectoryAsync(
        parentDirectoryUri,
        "Meeting Recall"
      );
    } catch {
      // If the folder already exists or Android refuses duplicate creation, use the selected folder.
      // For this spike, selecting an existing "Meeting Recall" folder is an acceptable manual path.
      return parentDirectoryUri;
    }
  }

  async function persistSafFolderUri(folderUri: string) {
    try {
      const storedUriFile = getStoredSafFolderFileUri();

      if (!storedUriFile) {
        setFolderPersistenceStatus("app documentDirectory unavailable");
        return;
      }

      await FileSystem.writeAsStringAsync(storedUriFile, folderUri);
      setFolderPersistenceStatus("stored SAF folder URI in app documentDirectory");
    } catch (error) {
      setFolderPersistenceStatus(`persist failed: ${getErrorMessage(error)}`);
    }
  }

  async function chooseMeetingRecallFolder() {
    try {
      setLastError(null);
      setFolderChoiceStatus("choosing visible SAF folder");

      if (Platform.OS !== "android") {
        setFolderChoiceStatus("unsupported");
        setLastError("This folder selection spike is Android-first.");
        return;
      }

      const initialFolderUri =
        FileSystem.StorageAccessFramework.getUriForDirectoryInRoot(ANDROID_EXPORT_PARENT_FOLDER);
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(initialFolderUri);

      if (!permissions.granted) {
        setFolderChoiceStatus("permission denied");
        setLastError("Folder access was not granted.");
        return;
      }

      setMeetingRecallFolderUri(permissions.directoryUri);
      setFolderChoiceStatus("selected SAF folder");
      await persistSafFolderUri(permissions.directoryUri);
    } catch (error) {
      setFolderChoiceStatus("failed");
      setLastError(`Unable to choose folder: ${getErrorMessage(error)}`);
    }
  }

  async function writeRecordingToSafFile(sourceUri: string, destinationUri: string) {
    const recordingBase64 = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64
    });

    await FileSystem.StorageAccessFramework.writeAsStringAsync(destinationUri, recordingBase64, {
      encoding: FileSystem.EncodingType.Base64
    });
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
        // Try the next suffix. Android document providers differ in how they handle duplicates.
      }
    }

    const fallbackName = `${baseName} (${Date.now()})${extension}`;

    return {
      fileName: fallbackName,
      uri: await FileSystem.StorageAccessFramework.createFileAsync(folderUri, fallbackName, "audio/mp4")
    };
  }

  async function copyToMeetingRecallFolder() {
    try {
      setLastError(null);
      setCopyStatus("copying to selected SAF folder");

      if (Platform.OS !== "android") {
        setCopyStatus("unsupported");
        setLastError("This spike only validates Android SAF export first.");
        return;
      }

      if (!savedFileUri) {
        setCopyStatus("failed");
        setLastError("Record something first. No source file URI is available.");
        return;
      }

      const sourceExists = await testOriginalFileExists(savedFileUri);

      if (!sourceExists) {
        setCopyStatus("failed");
        return;
      }

      if (!meetingRecallFolderUri) {
        setCopyStatus("needs selected folder");
        setLastError("Choose a visible Meeting Recall folder before copying.");
        return;
      }

      const folderUri = meetingRecallFolderUri;
      const destination = await createSafAudioFile(folderUri, currentFileName);
      await writeRecordingToSafFile(savedFileUri, destination.uri);

      setMeetingRecallFolderUri(folderUri);
      setExportedFileUri(destination.uri);
      setPreparedFileUri(null);
      setFinalActiveFileUri(destination.uri);
      setActualFileName(destination.fileName);
      setCopyStatus("copied");
      await testExportedFileExists(destination.uri);
    } catch (error) {
      setCopyStatus("failed");
      setLastError(`Unable to copy file: ${getErrorMessage(error)}`);
    }
  }

  async function tryDirectRename(oldFileUri: string, newFileName: string): Promise<DirectRenameResult> {
    if (oldFileUri.startsWith("content://")) {
      return {
        didRename: false,
        reason: "direct rename unsupported for SAF content URI"
      };
    }

    if (!oldFileUri.startsWith("file://")) {
      return {
        didRename: false,
        reason: "direct rename unsupported for this URI scheme"
      };
    }

    try {
      const directoryUri = oldFileUri.slice(0, oldFileUri.lastIndexOf("/") + 1);
      const newFileUri = `${directoryUri}${encodeURIComponent(newFileName)}`;
      await FileSystem.moveAsync({ from: oldFileUri, to: newFileUri });

      const newInfo = await FileSystem.getInfoAsync(newFileUri);
      const oldInfo = await FileSystem.getInfoAsync(oldFileUri);

      if (!newInfo.exists || oldInfo.exists) {
        return {
          didRename: false,
          reason: "direct rename did not produce the expected file state"
        };
      }

      return {
        fileName: newFileName,
        oldDeleted: !oldInfo.exists,
        size: getFileSizeDebug(newInfo),
        strategy: "direct rename",
        uri: newFileUri
      };
    } catch (error) {
      return {
        didRename: false,
        reason: `direct rename failed: ${getErrorMessage(error)}`
      };
    }
  }

  async function deleteOldFileForRename(oldFileUri: string) {
    try {
      if (oldFileUri.startsWith("content://")) {
        await FileSystem.StorageAccessFramework.deleteAsync(oldFileUri);
      } else {
        await FileSystem.deleteAsync(oldFileUri, { idempotent: true });
      }

      const oldInfo = await FileSystem.getInfoAsync(oldFileUri);
      return {
        deleted: !oldInfo.exists,
        message: !oldInfo.exists ? "deleted" : "delete attempted, but old file still exists"
      };
    } catch (error) {
      return {
        deleted: false,
        message: `delete failed: ${getErrorMessage(error)}`
      };
    }
  }

  async function copyAndReplaceRename(
    oldFileUri: string,
    newFileName: string,
    directRenameReason: string
  ): Promise<RenameAttempt> {
    if (!meetingRecallFolderUri) {
      throw new Error("No selected Meeting Recall folder URI is available.");
    }

    const newFile = await createSafAudioFile(meetingRecallFolderUri, newFileName);
    await writeRecordingToSafFile(oldFileUri, newFile.uri);

    const newInfo = await FileSystem.getInfoAsync(newFile.uri);
    const newSize = getFileSizeDebug(newInfo);

    if (!newInfo.exists || newSize === null || newSize <= 0) {
      throw new Error("Copy-and-replace created a missing or empty renamed file.");
    }

    const oldDeleteResult = await deleteOldFileForRename(oldFileUri);

    return {
      fileName: newFile.fileName,
      oldDeleted: oldDeleteResult.deleted,
      size: newSize,
      strategy: `copy-and-replace (${directRenameReason}; old ${oldDeleteResult.message})`,
      uri: newFile.uri
    };
  }

  async function renameFileForSpike() {
    try {
      setLastError(null);
      setRenameStatus("renaming");
      setRenameStrategy("testing direct rename support");
      setRenameNewFileSize("not checked");
      setRenameOldFileDeleted("not checked");
      setFinalActiveFileUri(null);
      setOldRenamedFileCheck("not checked");

      const fileToRename = exportedFileUri ?? preparedFileUri;

      if (!meetingRecallFolderUri || !fileToRename) {
        setRenameStatus("failed");
        setLastError("Copy a recording to the Meeting Recall folder before testing rename.");
        return;
      }

      if (!renameInput.trim()) {
        setRenameStatus("failed");
        setLastError("Enter a new recording name before testing rename.");
        return;
      }

      const newDisplayName = sanitizeRecordingTitle(renameInput);
      const newFileName = buildRecordingFileName(newDisplayName);
      const oldFileName = actualFileName;
      const oldFileUri = fileToRename;
      const directRename = await tryDirectRename(oldFileUri, newFileName);
      const renameResult = "uri" in directRename
        ? directRename
        : await copyAndReplaceRename(oldFileUri, newFileName, directRename.reason);

      const newExists = await FileSystem.getInfoAsync(renameResult.uri);
      const oldExists = await FileSystem.getInfoAsync(oldFileUri);
      const newSize = renameResult.size ?? getFileSizeDebug(newExists);
      const oldDeleted = renameResult.oldDeleted || !oldExists.exists;

      setDisplayName(newDisplayName);
      setActualFileName(renameResult.fileName);
      setExportedFileUri(renameResult.uri);
      setPreparedFileUri(null);
      setRenameOldFileName(oldFileName);
      setRenameNewFileName(renameResult.fileName);
      setRenameOldFileUri(oldFileUri);
      setRenameNewFileUri(renameResult.uri);
      setRenameStrategy(renameResult.strategy);
      setRenameNewFileSize(newSize === null ? "unknown" : String(newSize));
      setRenameOldFileDeleted(String(oldDeleted));
      setFinalActiveFileUri(renameResult.uri);
      setExportedFileCheck(newExists.exists ? "exists" : "missing");
      setOldRenamedFileCheck(oldExists.exists ? "exists" : "missing");
      setRenameStatus(
        newExists.exists && newSize !== null && newSize > 0
          ? "renamed visible file"
          : "needs review"
      );

      if (!oldDeleted) {
        setLastError("Renamed file was created, but the old file could not be confirmed deleted.");
      }
    } catch (error) {
      setRenameStatus("failed");
      setLastError(`Unable to rename file: ${getErrorMessage(error)}`);
    }
  }

  async function prepareForNotebookLm() {
    try {
      setLastError(null);
      setPrepareStatus("preparing");

      const sourceUri = exportedFileUri ?? savedFileUri;

      if (!sourceUri) {
        setPrepareStatus("failed");
        setLastError("No recording file is available to prepare.");
        return;
      }

      const sourceInfo = await FileSystem.getInfoAsync(sourceUri);

      if (!sourceInfo.exists) {
        setPrepareStatus("failed");
        setLastError("Recording file could not be found before NotebookLM prep.");
        return;
      }

      if (!meetingRecallFolderUri) {
        setPrepareStatus("needs Meeting Recall folder");
        setLastError("Copy to the Meeting Recall folder before preparing for NotebookLM.");
        return;
      }

      if (preparedFileUri) {
        await FileSystem.StorageAccessFramework.deleteAsync(preparedFileUri, { idempotent: true });
      }

      const preparedFile = await createSafAudioFile(meetingRecallFolderUri, currentFileName);
      await writeRecordingToSafFile(sourceUri, preparedFile.uri);

      setPreparedFileUri(preparedFile.uri);
      setFinalActiveFileUri(preparedFile.uri);
      setActualFileName(preparedFile.fileName);
      setPrepareStatus("prepared fresh export copy");
      await testPreparedFileExists(preparedFile.uri);
      await openNotebookLm();
    } catch (error) {
      setPrepareStatus("failed");
      setLastError(`Unable to prepare file for NotebookLM: ${getErrorMessage(error)}`);
    }
  }

  async function shareFile() {
    try {
      setLastError(null);
      setShareStatus("preparing");

      const fileToShare = preparedFileUri ?? exportedFileUri ?? savedFileUri;

      if (!fileToShare) {
        setShareStatus("failed");
        setLastError("No file is available to share yet.");
        return;
      }

      const Sharing = await import("expo-sharing");
      const sharingAvailable = await Sharing.isAvailableAsync();

      if (!sharingAvailable) {
        setShareStatus("unavailable");
        setLastError("Sharing is not available on this device.");
        return;
      }

      await Sharing.shareAsync(fileToShare, {
        dialogTitle: "Share Meeting Recall test recording",
        mimeType: "audio/mp4",
        UTI: "public.mpeg-4-audio"
      });
      setShareStatus("opened share sheet");
    } catch (error) {
      setShareStatus("failed");
      setLastError(`Unable to share file: ${getErrorMessage(error)}`);
    }
  }

  async function openNotebookLm() {
    try {
      setLastError(null);
      setNotebookLmStatus("opening");
      await Linking.openURL(NOTEBOOKLM_URL);
      setNotebookLmStatus("opened");
    } catch (error) {
      setNotebookLmStatus("failed");
      setLastError(`Unable to open NotebookLM: ${getErrorMessage(error)}`);
    }
  }

  async function playRecording() {
    try {
      setLastError(null);

      if (!savedFileUri) {
        setLastError("Record something first. No saved file URI is available.");
        return;
      }

      player.replace({ uri: savedFileUri });
      await player.seekTo(0);
      player.play();
    } catch (error) {
      setLastError(`Unable to play recording: ${getErrorMessage(error)}`);
    }
  }

  async function stopPlayback() {
    try {
      setLastError(null);
      player.pause();
      await player.seekTo(0);
    } catch (error) {
      setLastError(`Unable to stop playback: ${getErrorMessage(error)}`);
    }
  }

  const canStart = recordingStatus === "idle" || recordingStatus === "stopped";
  const canPause = recordingStatus === "recording";
  const canResume = recordingStatus === "paused";
  const canStop = recordingStatus === "recording" || recordingStatus === "paused";
  const canPlay = Boolean(savedFileUri) && !playerStatus.playing;
  const canStopPlayback = playerStatus.playing;
  const canCopyFile = Boolean(savedFileUri);
  const canShareFile = Boolean(savedFileUri || exportedFileUri);
  const canPrepareFile = Boolean(savedFileUri || exportedFileUri);
  const canRenameFile = Boolean(exportedFileUri || preparedFileUri);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Technical spike</Text>
        <Text style={styles.title}>Audio Recording Validation</Text>
        <Text style={styles.body}>
          Plain test screen for recording, playback, Android file export, sharing,
          and NotebookLM file-picker validation. This is not final UI.
        </Text>
      </View>

      <View style={styles.actions}>
        <SpikeButton disabled={!canStart} label="Start recording" onPress={startRecording} primary />
        <SpikeButton disabled={!canPause} label="Pause recording" onPress={pauseRecording} />
        <SpikeButton disabled={!canResume} label="Resume recording" onPress={resumeRecording} />
        <SpikeButton disabled={!canStop} label="Stop recording" onPress={stopRecording} />
        <SpikeButton disabled={!canPlay} label="Play saved recording" onPress={playRecording} primary />
        <SpikeButton disabled={!canStopPlayback} label="Stop playback" onPress={stopPlayback} />
        <SpikeButton
          label="Choose Meeting Recall Folder"
          onPress={chooseMeetingRecallFolder}
          primary
        />
        <SpikeButton
          disabled={!canCopyFile}
          label="Copy to Selected Folder"
          onPress={copyToMeetingRecallFolder}
        />
        <SpikeButton
          disabled={!canRenameFile}
          label="Test Rename File"
          onPress={renameFileForSpike}
        />
        <SpikeButton
          disabled={!canPrepareFile}
          label="Prepare for NotebookLM"
          onPress={prepareForNotebookLm}
          primary
        />
        <SpikeButton disabled={!canShareFile} label="Share File" onPress={shareFile} />
        <SpikeButton disabled={!savedFileUri} label="Test Current Original File Exists" onPress={() => testOriginalFileExists()} />
        <SpikeButton
          disabled={!exportedFileUri}
          label="Test Current Exported/Renamed File Exists"
          onPress={() => testExportedFileExists()}
        />
        <SpikeButton
          disabled={!preparedFileUri}
          label="Test Prepared NotebookLM File Exists"
          onPress={() => testPreparedFileExists()}
        />
        <SpikeButton label="Open NotebookLM" onPress={openNotebookLm} />
        <SpikeButton label="Back to Home" onPress={() => navigation.navigate("Home")} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Rename test</Text>
        <TextInput
          autoCapitalize="words"
          onChangeText={setRenameInput}
          placeholder="New recording name"
          placeholderTextColor={theme.colors.textSubtle}
          style={styles.input}
          value={renameInput}
        />
        <DebugRow label="Sanitized rename filename" value={buildRecordingFileName(renameInput)} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Debug status</Text>
        <DebugRow label="Permission" value={permissionStatus} />
        <DebugRow label="Recording status" value={recordingStatus} />
        <DebugRow label="Recorder can record" value={String(recorderState.canRecord)} />
        <DebugRow label="Recorder active" value={String(recorderState.isRecording)} />
        <DebugRow label="Recording duration" value={formatMillis(recorderState.durationMillis)} />
        <DebugRow label="Recorder URL" value={recorderState.url ?? "none"} />
        <DebugRow label="Original storage method" value={describeStorageMethod(savedFileUri)} />
        <DebugRow label="App documentDirectory" value={FileSystem.documentDirectory ?? "none"} />
        <DebugRow label="App cacheDirectory" value={FileSystem.cacheDirectory ?? "none"} />
        <DebugRow label="Original recording URI" value={savedFileUri ?? "none"} />
        <DebugRow label="Selected SAF folder URI" value={meetingRecallFolderUri ?? "none"} />
        <DebugRow label="Selected folder storage method" value={describeStorageMethod(meetingRecallFolderUri)} />
        <DebugRow label="Folder choice status" value={folderChoiceStatus} />
        <DebugRow label="Folder persistence status" value={folderPersistenceStatus} />
        <DebugRow label="SAF used" value={String(Boolean(meetingRecallFolderUri?.startsWith("content://")))} />
        <DebugRow label="Current display name" value={displayName} />
        <DebugRow label="Actual file name" value={actualFileName} />
        <DebugRow label="Exported/copied file URI" value={exportedFileUri ?? "none"} />
        <DebugRow label="Exported storage method" value={describeStorageMethod(exportedFileUri)} />
        <DebugRow label="Prepared NotebookLM file URI" value={preparedFileUri ?? "none"} />
        <DebugRow label="Prepared storage method" value={describeStorageMethod(preparedFileUri)} />
        <DebugRow label="URI file name fallback" value={getFileNameFromUri(preparedFileUri ?? exportedFileUri)} />
        <DebugRow label="Original file exists" value={originalFileCheck} />
        <DebugRow label="Current exported/renamed file exists" value={exportedFileCheck} />
        <DebugRow label="Prepared NotebookLM file exists" value={preparedFileCheck} />
        <DebugRow label="Old renamed file exists" value={oldRenamedFileCheck} />
        <DebugRow label="Rename strategy used" value={renameStrategy} />
        <DebugRow label="Rename old filename" value={renameOldFileName} />
        <DebugRow label="Rename new filename" value={renameNewFileName} />
        <DebugRow label="Rename old URI" value={renameOldFileUri ?? "none"} />
        <DebugRow label="Rename new URI" value={renameNewFileUri ?? "none"} />
        <DebugRow label="Rename new file size" value={renameNewFileSize} />
        <DebugRow label="Rename old file deleted" value={renameOldFileDeleted} />
        <DebugRow label="Final active file URI" value={finalActiveFileUri ?? "none"} />
        <DebugRow label="Copy/export status" value={copyStatus} />
        <DebugRow label="Prepare status" value={prepareStatus} />
        <DebugRow label="Rename status" value={renameStatus} />
        <DebugRow label="Share status" value={shareStatus} />
        <DebugRow label="NotebookLM status" value={notebookLmStatus} />
        <DebugRow label="Playback loaded" value={String(playerStatus.isLoaded)} />
        <DebugRow label="Playback status" value={playerStatus.playbackState} />
        <DebugRow label="Playback playing" value={String(playerStatus.playing)} />
        <DebugRow label="Playback time" value={formatSeconds(playerStatus.currentTime)} />
        <DebugRow label="Playback duration" value={formatSeconds(playerStatus.duration)} />
        <DebugRow label="Last error" value={lastError ?? "none"} error={Boolean(lastError)} />
      </View>
    </Screen>
  );
}

type SpikeButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  primary?: boolean;
};

function SpikeButton({ disabled = false, label, onPress, primary = false }: SpikeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton
      ]}
    >
      <Text style={[styles.buttonText, primary && styles.primaryButtonText, disabled && styles.disabledText]}>
        {label}
      </Text>
    </Pressable>
  );
}

type DebugRowProps = {
  error?: boolean;
  label: string;
  value: string;
};

function DebugRow({ error = false, label, value }: DebugRowProps) {
  return (
    <View style={styles.debugRow}>
      <Text style={styles.debugLabel}>{label}</Text>
      <Text selectable style={[styles.debugValue, error && styles.errorText]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg
  },
  eyebrow: {
    color: theme.colors.recording,
    fontSize: theme.typography.section.fontSize,
    fontWeight: theme.typography.section.fontWeight,
    letterSpacing: theme.typography.section.letterSpacing,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    lineHeight: theme.typography.title.lineHeight
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight
  },
  actions: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg
  },
  button: {
    alignItems: "center",
    borderRadius: theme.radii.md,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: theme.spacing.md
  },
  primaryButton: {
    backgroundColor: theme.colors.primary
  },
  secondaryButton: {
    borderColor: theme.colors.divider,
    borderWidth: StyleSheet.hairlineWidth
  },
  disabledButton: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.divider
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight
  },
  primaryButtonText: {
    color: theme.colors.white
  },
  disabledText: {
    color: theme.colors.textSubtle
  },
  panel: {
    borderColor: theme.colors.divider,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.md
  },
  panelTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    marginBottom: theme.spacing.sm
  },
  input: {
    borderColor: theme.colors.divider,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.sm,
    minHeight: 52,
    paddingHorizontal: theme.spacing.md
  },
  debugRow: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm
  },
  debugLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    fontWeight: "700"
  },
  debugValue: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 18
  },
  errorText: {
    color: theme.colors.recording,
    fontWeight: "700"
  }
});
