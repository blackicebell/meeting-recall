import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

function getUriExtension(uri: string | null) {
  if (!uri) {
    return "none";
  }

  const cleanUri = uri.split("?")[0] ?? uri;
  const match = cleanUri.match(/\.([a-z0-9]+)$/i);

  return match ? `.${match[1]}` : "unknown";
}

export function RecordingScreen({ navigation }: Props) {
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  const [recordingStatus, setRecordingStatus] = useState<SpikeRecordingStatus>("idle");
  const [tempRecordingUri, setTempRecordingUri] = useState<string | null>(null);
  const [selectedFolderUri, setSelectedFolderUri] = useState<string | null>(null);
  const [folderChoiceStatus, setFolderChoiceStatus] = useState("not selected");
  const [folderPersistenceStatus, setFolderPersistenceStatus] = useState("not persisted");
  const [titleInput, setTitleInput] = useState(DEFAULT_RECORDING_TITLE);
  const [finalFileName, setFinalFileName] = useState(buildRecordingFileName(DEFAULT_RECORDING_TITLE));
  const [finalSavedUri, setFinalSavedUri] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState("not saved");
  const [saveSuccess, setSaveSuccess] = useState("false");
  const [savedFileExists, setSavedFileExists] = useState<FileCheckStatus>("not checked");
  const [savedFileSize, setSavedFileSize] = useState("not checked");
  const [tempFileExists, setTempFileExists] = useState<FileCheckStatus>("not checked");
  const [debugTargetFolderUri, setDebugTargetFolderUri] = useState<string | null>(null);
  const [debugTargetFileUri, setDebugTargetFileUri] = useState<string | null>(null);
  const [debugOperation, setDebugOperation] = useState("not run");
  const [debugSuccess, setDebugSuccess] = useState("false");
  const [debugErrorMessage, setDebugErrorMessage] = useState("none");
  const [debugFileExists, setDebugFileExists] = useState<FileCheckStatus>("not checked");
  const [debugFileSize, setDebugFileSize] = useState("not checked");
  const [recordingInfoExists, setRecordingInfoExists] = useState<FileCheckStatus>("not checked");
  const [recordingInfoSize, setRecordingInfoSize] = useState("not checked");
  const [recordingMimeType, setRecordingMimeType] = useState("unknown");
  const [recordingReadable, setRecordingReadable] = useState("not tested");
  const [recordingReadWarning, setRecordingReadWarning] = useState("none");
  const [copyMethod, setCopyMethod] = useState("not run");
  const [copySourceUri, setCopySourceUri] = useState<string | null>(null);
  const [copyTargetUri, setCopyTargetUri] = useState<string | null>(null);
  const [copyTargetFileName, setCopyTargetFileName] = useState("none");
  const [copySuccess, setCopySuccess] = useState("false");
  const [copyError, setCopyError] = useState("none");
  const [copyTargetExists, setCopyTargetExists] = useState<FileCheckStatus>("not checked");
  const [copyTargetSize, setCopyTargetSize] = useState("not checked");
  const [lastError, setLastError] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const playbackUri = finalSavedUri ?? tempRecordingUri;
  const playerSource = useMemo(() => (playbackUri ? { uri: playbackUri } : null), [playbackUri]);
  const player = useAudioPlayer(playerSource, { updateInterval: 250 });
  const playerStatus = useAudioPlayerStatus(player);

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
        setSelectedFolderUri(storedUri);
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
      setTempRecordingUri(null);
      setFinalSavedUri(null);
      setFinalFileName(buildRecordingFileName(titleInput));
      setSaveStatus("not saved");
      setSaveSuccess("false");
      setSavedFileExists("not checked");
      setSavedFileSize("not checked");
      setTempFileExists("not checked");
      resetFileSaveDebug();
      resetRecordingCopyDebug();
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
      setTempRecordingUri(uri);
      setRecordingStatus("stopped");

      if (!uri) {
        setLastError("Recording stopped, but no temp file URI was returned.");
        return;
      }

      await testTempFileExists(uri);
    } catch (error) {
      setLastError(`Unable to stop recording: ${getErrorMessage(error)}`);
    }
  }

  async function testTempFileExists(uri = tempRecordingUri) {
    try {
      setLastError(null);

      if (!uri) {
        setTempFileExists("missing");
        setLastError("No temp recording URI is available yet.");
        return false;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSize = getFileSizeDebug(fileInfo);
      const exists = fileInfo.exists ? "exists" : "missing";

      setTempFileExists(exists);
      setRecordingInfoExists(exists);
      setRecordingInfoSize(fileSize === null ? "unknown" : String(fileSize));
      setRecordingMimeType("audio/mp4 expected from .m4a recording preset");

      if (!fileInfo.exists) {
        setLastError("Temp recording file could not be found.");
      }

      return fileInfo.exists;
    } catch (error) {
      setTempFileExists("missing");
      setLastError(`Unable to check temp file: ${getErrorMessage(error)}`);
      return false;
    }
  }

  async function testSavedFileExists(uri = finalSavedUri) {
    try {
      setLastError(null);

      if (!uri) {
        setSavedFileExists("missing");
        setSavedFileSize("not checked");
        setLastError("No saved public file URI is available yet.");
        return false;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSize = getFileSizeDebug(fileInfo);
      setSavedFileExists(fileInfo.exists ? "exists" : "missing");
      setSavedFileSize(fileSize === null ? "unknown" : String(fileSize));

      if (!fileInfo.exists) {
        setLastError("Saved public file could not be found.");
      }

      return fileInfo.exists;
    } catch (error) {
      setSavedFileExists("missing");
      setSavedFileSize("not checked");
      setLastError(`Unable to check saved public file: ${getErrorMessage(error)}`);
      return false;
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

      setSelectedFolderUri(permissions.directoryUri);
      setFolderChoiceStatus("selected SAF folder");
      await persistSafFolderUri(permissions.directoryUri);
    } catch (error) {
      setFolderChoiceStatus("failed");
      setLastError(`Unable to choose folder: ${getErrorMessage(error)}`);
    }
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

  function resetFileSaveDebug() {
    setDebugTargetFolderUri(null);
    setDebugTargetFileUri(null);
    setDebugOperation("not run");
    setDebugSuccess("false");
    setDebugErrorMessage("none");
    setDebugFileExists("not checked");
    setDebugFileSize("not checked");
  }

  function resetRecordingCopyDebug() {
    setRecordingInfoExists("not checked");
    setRecordingInfoSize("not checked");
    setRecordingMimeType("unknown");
    setRecordingReadable("not tested");
    setRecordingReadWarning("none");
    setCopyMethod("not run");
    setCopySourceUri(null);
    setCopyTargetUri(null);
    setCopyTargetFileName("none");
    setCopySuccess("false");
    setCopyError("none");
    setCopyTargetExists("not checked");
    setCopyTargetSize("not checked");
  }

  async function updateDebugFileResult(fileUri: string) {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileSize = getFileSizeDebug(fileInfo);

    setDebugFileExists(fileInfo.exists ? "exists" : "missing");
    setDebugFileSize(fileSize === null ? "unknown" : String(fileSize));

    return {
      exists: fileInfo.exists,
      size: fileSize
    };
  }

  async function updateCopyTargetResult(fileUri: string) {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileSize = getFileSizeDebug(fileInfo);

    setCopyTargetExists(fileInfo.exists ? "exists" : "missing");
    setCopyTargetSize(fileSize === null ? "unknown" : String(fileSize));

    return {
      exists: fileInfo.exists,
      size: fileSize
    };
  }

  async function deleteFailedSafFile(fileUri: string) {
    try {
      await FileSystem.StorageAccessFramework.deleteAsync(fileUri);
      return "failed target deleted";
    } catch (error) {
      return `failed target could not be deleted: ${getErrorMessage(error)}`;
    }
  }

  async function validateReadableSourceRecording(options: { readBytes: boolean }) {
    if (!tempRecordingUri) {
      throw new Error("Source recording file is empty or unreadable.");
    }

    const fileInfo = await FileSystem.getInfoAsync(tempRecordingUri);
    const fileSize = getFileSizeDebug(fileInfo);

    setRecordingInfoExists(fileInfo.exists ? "exists" : "missing");
    setRecordingInfoSize(fileSize === null ? "unknown" : String(fileSize));
    setRecordingMimeType("audio/mp4 expected from .m4a recording preset");

    if (!fileInfo.exists || fileSize === null || fileSize <= 0) {
      setRecordingReadable("false");
      throw new Error("Source recording file is empty or unreadable.");
    }

    if (!options.readBytes) {
      setRecordingReadable("not tested");
      return null;
    }

    try {
      const recordingBase64 = await FileSystem.readAsStringAsync(tempRecordingUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (!recordingBase64) {
        setRecordingReadable("false");
        throw new Error("Source recording file is empty or unreadable.");
      }

      setRecordingReadable("true");
      return recordingBase64;
    } catch (error) {
      setRecordingReadable("false");
      throw new Error(`Source recording file is empty or unreadable. ${getErrorMessage(error)}`);
    }
  }

  function ensureSelectedFolderForDebug(operation: string) {
    setLastError(null);
    setDebugOperation(operation);
    setDebugSuccess("false");
    setDebugErrorMessage("none");
    setDebugFileExists("not checked");
    setDebugFileSize("not checked");
    setDebugTargetFolderUri(selectedFolderUri);
    setDebugTargetFileUri(null);

    if (!selectedFolderUri) {
      const message = "Choose the visible Meeting Recall folder first.";
      setDebugErrorMessage(message);
      setLastError(message);
      return null;
    }

    return selectedFolderUri;
  }

  async function createTestTextFile() {
    const operation = "create test text file";

    try {
      const folderUri = ensureSelectedFolderForDebug(operation);

      if (!folderUri) {
        return;
      }

      const fileName = `${getDatePrefix()} Meeting Recall SAF Test.txt`;
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        folderUri,
        fileName,
        "text/plain"
      );
      setDebugTargetFileUri(fileUri);

      await FileSystem.StorageAccessFramework.writeAsStringAsync(
        fileUri,
        `Meeting Recall file save debug ${new Date().toISOString()}`
      );

      const result = await updateDebugFileResult(fileUri);
      setDebugSuccess(String(result.exists && result.size !== null && result.size > 0));
    } catch (error) {
      const message = getErrorMessage(error);
      setDebugSuccess("false");
      setDebugErrorMessage(message);
      setLastError(`Text file debug failed: ${message}`);
    }
  }

  async function copyLatestRecordingToFolder() {
    const operation = "copy latest recording to folder";

    try {
      const folderUri = ensureSelectedFolderForDebug(operation);

      if (!folderUri) {
        return;
      }

      if (!tempRecordingUri) {
        const message = "Record something first. No temp recording URI is available.";
        setDebugErrorMessage(message);
        setLastError(message);
        return;
      }

      const recordingBase64 = await validateReadableSourceRecording({ readBytes: true });

      if (!recordingBase64) {
        throw new Error("Source recording file is empty or unreadable.");
      }

      const fileName = buildRecordingFileName(titleInput);
      const destination = await createSafAudioFile(folderUri, fileName);
      setDebugTargetFileUri(destination.uri);
      setFinalFileName(destination.fileName);
      setFinalSavedUri(destination.uri);

      await FileSystem.StorageAccessFramework.writeAsStringAsync(destination.uri, recordingBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      const result = await updateDebugFileResult(destination.uri);
      const success = result.exists && result.size !== null && result.size > 0;

      setSaveSuccess(String(success));
      setSaveStatus(success ? "saved" : "needs review");
      setSavedFileExists(result.exists ? "exists" : "missing");
      setSavedFileSize(result.size === null ? "unknown" : String(result.size));
      setDebugSuccess(String(success));

      if (!success) {
        const cleanupResult = await deleteFailedSafFile(destination.uri);
        setDebugErrorMessage(`Recording byte write completed, but saved file is missing or empty. ${cleanupResult}`);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setSaveStatus("failed");
      setSaveSuccess("false");
      setDebugSuccess("false");
      setDebugErrorMessage(message);
      setLastError(`Recording copy debug failed: ${message}`);
    }
  }

  async function testReadRecording() {
    try {
      setLastError(null);
      setRecordingReadable("testing");
      setRecordingReadWarning("Reads a tiny test recording only. Not production-safe for long meetings.");

      if (!tempRecordingUri) {
        const message = "Record a 3-5 second clip first. No temp recording URI is available.";
        setRecordingReadable("false");
        setLastError(message);
        return;
      }

      await validateReadableSourceRecording({ readBytes: true });
      setRecordingReadable("true");
    } catch (error) {
      setRecordingReadable("false");
      setLastError(`Unable to read recording: ${getErrorMessage(error)}`);
    }
  }

  function prepareCopyDebug(method: string) {
    setLastError(null);
    setCopyMethod(method);
    setCopySourceUri(tempRecordingUri);
    setCopyTargetUri(null);
    setCopyTargetFileName("none");
    setCopySuccess("false");
    setCopyError("none");
    setCopyTargetExists("not checked");
    setCopyTargetSize("not checked");

    if (!selectedFolderUri) {
      const message = "Choose the visible Meeting Recall folder first.";
      setCopyError(message);
      setLastError(message);
      return null;
    }

    if (!tempRecordingUri) {
      const message = "Record a 3-5 second clip first. No temp recording URI is available.";
      setCopyError(message);
      setLastError(message);
      return null;
    }

    return {
      folderUri: selectedFolderUri,
      sourceUri: tempRecordingUri
    };
  }

  async function copyRecordingAsBase64Test() {
    const prepared = prepareCopyDebug("base64 test copy, not production-safe");

    if (!prepared) {
      return;
    }

    try {
      setRecordingReadWarning("Base64 copy is for 3-5 second test recordings only. Not production-safe for meetings.");

      const recordingBase64 = await validateReadableSourceRecording({ readBytes: true });

      if (!recordingBase64) {
        throw new Error("Source recording file is empty or unreadable.");
      }
      const targetFileName = buildRecordingFileName(`${sanitizeRecordingTitle(titleInput)} Base64 Test`);
      const destination = await createSafAudioFile(prepared.folderUri, targetFileName);
      setCopyTargetUri(destination.uri);
      setCopyTargetFileName(destination.fileName);

      await FileSystem.StorageAccessFramework.writeAsStringAsync(destination.uri, recordingBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      const result = await updateCopyTargetResult(destination.uri);
      const success = result.exists && result.size !== null && result.size > 0;
      setCopySuccess(String(success));

      if (!success) {
        const cleanupResult = await deleteFailedSafFile(destination.uri);
        setCopyError(`Base64 copy completed, but target file is missing or empty. ${cleanupResult}`);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setCopySuccess("false");
      setCopyError(message);
      setLastError(`Base64 copy test failed: ${message}`);
    }
  }

  async function copyRecordingUsingFileSystemApi() {
    const prepared = prepareCopyDebug("FileSystem.copyAsync");

    if (!prepared) {
      return;
    }

    try {
      await validateReadableSourceRecording({ readBytes: false });
      const targetFileName = buildRecordingFileName(`${sanitizeRecordingTitle(titleInput)} Copy API Test`);
      const destination = await createSafAudioFile(prepared.folderUri, targetFileName);
      setCopyTargetUri(destination.uri);
      setCopyTargetFileName(destination.fileName);

      await FileSystem.copyAsync({ from: prepared.sourceUri, to: destination.uri });

      const result = await updateCopyTargetResult(destination.uri);
      const success = result.exists && result.size !== null && result.size > 0;
      setCopySuccess(String(success));

      if (!success) {
        const cleanupResult = await deleteFailedSafFile(destination.uri);
        setCopyError(`FileSystem.copyAsync completed, but target file is missing or empty. ${cleanupResult}`);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setCopySuccess("false");
      setCopyError(message);
      setLastError(`FileSystem.copyAsync test failed: ${message}`);
    }
  }

  async function saveToMeetingRecallFolder() {
    try {
      setLastError(null);
      setSaveStatus("saving");
      setSaveSuccess("false");
      setSavedFileExists("not checked");
      setSavedFileSize("not checked");

      if (Platform.OS !== "android") {
        setSaveStatus("unsupported");
        setLastError("This spike only validates Android SAF saving first.");
        return;
      }

      if (!tempRecordingUri) {
        setSaveStatus("failed");
        setLastError("Record something first. No temp recording URI is available.");
        return;
      }

      const recordingBase64 = await validateReadableSourceRecording({ readBytes: true });

      if (!recordingBase64) {
        throw new Error("Source recording file is empty or unreadable.");
      }

      if (!selectedFolderUri) {
        setSaveStatus("needs selected folder");
        setLastError("Choose the visible Meeting Recall folder before saving.");
        return;
      }

      const targetFileName = buildRecordingFileName(titleInput);
      const destination = await createSafAudioFile(selectedFolderUri, targetFileName);
      setFinalFileName(destination.fileName);
      setFinalSavedUri(destination.uri);

      await FileSystem.StorageAccessFramework.writeAsStringAsync(destination.uri, recordingBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      const destinationInfo = await FileSystem.getInfoAsync(destination.uri);
      const destinationSize = getFileSizeDebug(destinationInfo);
      const exists = destinationInfo.exists;
      const hasSize = destinationSize !== null && destinationSize > 0;

      setSavedFileExists(exists ? "exists" : "missing");
      setSavedFileSize(destinationSize === null ? "unknown" : String(destinationSize));
      setSaveSuccess(String(exists && hasSize));
      setSaveStatus(exists && hasSize ? "saved" : "needs review");

      if (!exists || !hasSize) {
        const cleanupResult = await deleteFailedSafFile(destination.uri);
        setLastError(`Saved file is missing or empty. ${cleanupResult}`);
      }
    } catch (error) {
      setSaveStatus("failed");
      setSaveSuccess("false");
      setLastError(`Unable to save file: ${getErrorMessage(error)}`);
    }
  }

  async function playRecording() {
    try {
      setLastError(null);

      const fileToPlay = finalSavedUri ?? tempRecordingUri;

      if (!fileToPlay) {
        setLastError("Record something first. No file URI is available.");
        return;
      }

      player.replace({ uri: fileToPlay });
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
  const canSave = Boolean(tempRecordingUri);
  const canPlay = Boolean(finalSavedUri ?? tempRecordingUri) && !playerStatus.playing;
  const canStopPlayback = playerStatus.playing;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Technical spike</Text>
        <Text style={styles.title}>File Accessibility Validation</Text>
        <Text style={styles.body}>
          Minimal test only: record audio, save one file to the selected Meeting Recall folder,
          and verify the saved file exists. Rename, NotebookLM, and Recents tests are disabled.
        </Text>
      </View>

      <View style={styles.actions}>
        <SpikeButton disabled={!canStart} label="Start recording" onPress={startRecording} primary />
        <SpikeButton disabled={!canPause} label="Pause recording" onPress={pauseRecording} />
        <SpikeButton disabled={!canResume} label="Resume recording" onPress={resumeRecording} />
        <SpikeButton disabled={!canStop} label="Stop recording" onPress={stopRecording} />
        <SpikeButton label="Choose Meeting Recall Folder" onPress={chooseMeetingRecallFolder} primary />
        <SpikeButton disabled={!canSave} label="Save One File to Folder" onPress={saveToMeetingRecallFolder} />
        <SpikeButton disabled={!finalSavedUri} label="Test Saved File Exists" onPress={() => testSavedFileExists()} />
        <SpikeButton disabled={!canPlay} label="Play Current File" onPress={playRecording} />
        <SpikeButton disabled={!canStopPlayback} label="Stop playback" onPress={stopPlayback} />
        <SpikeButton label="Back to Home" onPress={() => navigation.navigate("Home")} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>File Save Debug</Text>
        <View style={styles.actions}>
          <SpikeButton label="Create Test Text File" onPress={createTestTextFile} />
          <SpikeButton
            disabled={!canSave}
            label="Copy Latest Recording to Folder"
            onPress={copyLatestRecordingToFolder}
          />
          <SpikeButton disabled={!canSave} label="Test Read Recording" onPress={testReadRecording} />
          <SpikeButton
            disabled={!canSave}
            label="Copy Recording as Binary/Base64 Test"
            onPress={copyRecordingAsBase64Test}
          />
          <SpikeButton
            disabled={!canSave}
            label="Copy Recording Using FileSystem API"
            onPress={copyRecordingUsingFileSystemApi}
          />
        </View>
        <DebugRow label="Target folder URI" value={debugTargetFolderUri ?? "none"} />
        <DebugRow label="Target file URI" value={debugTargetFileUri ?? "none"} />
        <DebugRow label="Operation attempted" value={debugOperation} />
        <DebugRow label="Success" value={debugSuccess} />
        <DebugRow label="File exists result" value={debugFileExists} />
        <DebugRow label="File size result" value={debugFileSize} />
        <DebugRow label="Exact error message" value={debugErrorMessage} error={debugErrorMessage !== "none"} />
        <DebugRow label="Recording URI" value={tempRecordingUri ?? "none"} />
        <DebugRow label="Recording file exists" value={recordingInfoExists} />
        <DebugRow label="Recording file size" value={recordingInfoSize} />
        <DebugRow label="Recording MIME/type" value={recordingMimeType} />
        <DebugRow label="Recording extension" value={getUriExtension(tempRecordingUri)} />
        <DebugRow label="Recording URI readable" value={recordingReadable} />
        <DebugRow label="Read warning" value={recordingReadWarning} />
        <DebugRow label="Copy method" value={copyMethod} />
        <DebugRow label="Copy source URI" value={copySourceUri ?? "none"} />
        <DebugRow label="Copy target URI" value={copyTargetUri ?? "none"} />
        <DebugRow label="Copy target filename" value={copyTargetFileName} />
        <DebugRow label="Copy success" value={copySuccess} />
        <DebugRow label="Copy exact error" value={copyError} error={copyError !== "none"} />
        <DebugRow label="Copy target exists" value={copyTargetExists} />
        <DebugRow label="Copy target size" value={copyTargetSize} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Save test</Text>
        <TextInput
          autoCapitalize="words"
          onChangeText={(value) => {
            setTitleInput(value);
            setFinalFileName(buildRecordingFileName(value));
          }}
          placeholder="Recording title"
          placeholderTextColor={theme.colors.textSubtle}
          style={styles.input}
          value={titleInput}
        />
        <DebugRow label="Final filename" value={buildRecordingFileName(titleInput)} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Debug status</Text>
        <DebugRow label="Permission" value={permissionStatus} />
        <DebugRow label="Recording status" value={recordingStatus} />
        <DebugRow label="Recorder can record" value={String(recorderState.canRecord)} />
        <DebugRow label="Recorder active" value={String(recorderState.isRecording)} />
        <DebugRow label="Recording duration" value={formatMillis(recorderState.durationMillis)} />
        <DebugRow label="Recording temp URI" value={tempRecordingUri ?? "none"} />
        <DebugRow label="Temp storage method" value={describeStorageMethod(tempRecordingUri)} />
        <DebugRow label="Temp file exists" value={tempFileExists} />
        <DebugRow label="Selected/public folder URI" value={selectedFolderUri ?? "none"} />
        <DebugRow label="Selected folder storage method" value={describeStorageMethod(selectedFolderUri)} />
        <DebugRow label="Folder choice status" value={folderChoiceStatus} />
        <DebugRow label="Folder persistence status" value={folderPersistenceStatus} />
        <DebugRow label="Final saved URI" value={finalSavedUri ?? "none"} />
        <DebugRow label="Final filename" value={finalFileName} />
        <DebugRow label="Save success" value={saveSuccess} />
        <DebugRow label="File exists" value={savedFileExists} />
        <DebugRow label="File size" value={savedFileSize} />
        <DebugRow label="Save status" value={saveStatus} />
        <DebugRow label="Playback loaded" value={String(playerStatus.isLoaded)} />
        <DebugRow label="Playback status" value={playerStatus.playbackState} />
        <DebugRow label="Playback playing" value={String(playerStatus.playing)} />
        <DebugRow label="Playback time" value={formatSeconds(playerStatus.currentTime)} />
        <DebugRow label="Playback duration" value={formatSeconds(playerStatus.duration)} />
        <DebugRow label="Error message" value={lastError ?? "none"} error={Boolean(lastError)} />
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
