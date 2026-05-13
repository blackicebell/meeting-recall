import { useEffect, useState } from "react";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";

export type RecordingStatus = "idle" | "preparing" | "recording" | "paused" | "stopped";

export type StoppedRecording = {
  durationMillis: number;
  uri: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

const RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true
};

export function useRecordingController() {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPermissionStatus() {
      try {
        const permission = await getRecordingPermissionsAsync();
        setPermissionStatus(permission.status);
      } catch (error) {
        setErrorMessage(`Permission check failed: ${getErrorMessage(error)}`);
      }
    }

    loadPermissionStatus();
  }, []);

  async function requestPermission() {
    const permission = await requestRecordingPermissionsAsync();
    setPermissionStatus(permission.status);

    if (!permission.granted) {
      setErrorMessage("Microphone permission was denied.");
    }

    return permission.granted;
  }

  async function start() {
    try {
      setErrorMessage(null);
      setStatus("preparing");

      const permissionGranted =
        permissionStatus === "granted" ? true : await requestPermission();

      if (!permissionGranted) {
        setStatus("idle");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: "doNotMix",
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setStatus("recording");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(`Unable to start recording: ${getErrorMessage(error)}`);
    }
  }

  function pause() {
    try {
      setErrorMessage(null);
      recorder.pause();
      setStatus("paused");
    } catch (error) {
      setErrorMessage(`Unable to pause recording: ${getErrorMessage(error)}`);
    }
  }

  function resume() {
    try {
      setErrorMessage(null);
      recorder.record();
      setStatus("recording");
    } catch (error) {
      setErrorMessage(`Unable to resume recording: ${getErrorMessage(error)}`);
    }
  }

  async function stop(): Promise<StoppedRecording | null> {
    try {
      setErrorMessage(null);
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      setStatus("stopped");

      const uri = recorder.uri ?? recorderState.url;

      if (!uri) {
        setErrorMessage("Recording stopped, but no file URI was returned.");
        return null;
      }

      return {
        durationMillis: recorderState.durationMillis,
        uri
      };
    } catch (error) {
      setErrorMessage(`Unable to stop recording: ${getErrorMessage(error)}`);
      return null;
    }
  }

  return {
    durationMillis: recorderState.durationMillis,
    errorMessage,
    isRecording: recorderState.isRecording,
    metering: recorderState.metering,
    permissionStatus,
    pause,
    resume,
    start,
    status,
    stop
  };
}
