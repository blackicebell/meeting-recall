import { useEffect, useState } from "react";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";

import { devLog } from "../lib/devLog";

export type RecordingStatus = "idle" | "preparing" | "recording" | "paused" | "stopped";

export type StoppedRecording = {
  durationMillis: number;
  uri: string;
};

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
        devLog.warn("Microphone permission check failed", error);
        setErrorMessage("Unable to check microphone access. Please try again.");
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
      devLog.warn("Unable to start recording", error);
      setStatus("idle");
      setErrorMessage("Unable to start recording. Please check microphone access and try again.");
    }
  }

  function pause() {
    try {
      setErrorMessage(null);
      recorder.pause();
      setStatus("paused");
    } catch (error) {
      devLog.warn("Unable to pause recording", error);
      setErrorMessage("Unable to pause recording. Please try again.");
    }
  }

  function resume() {
    try {
      setErrorMessage(null);
      recorder.record();
      setStatus("recording");
    } catch (error) {
      devLog.warn("Unable to resume recording", error);
      setErrorMessage("Unable to resume recording. Please try again.");
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
      devLog.warn("Unable to stop recording", error);
      setErrorMessage("Unable to stop recording. Please try again.");
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
