import { useMemo } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function useAudioPlayback(uri: string | null) {
  const source = useMemo(() => (uri ? { uri } : null), [uri]);
  const player = useAudioPlayer(source, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  async function play() {
    if (!uri) {
      throw new Error("No recording file is available for playback.");
    }

    player.replace({ uri });
    await player.seekTo(0);
    player.play();
  }

  async function stop() {
    try {
      player.pause();
      await player.seekTo(0);
    } catch (error) {
      throw new Error(`Unable to stop playback: ${getErrorMessage(error)}`);
    }
  }

  return {
    currentTime: status.currentTime,
    duration: status.duration,
    isLoaded: status.isLoaded,
    isPlaying: status.playing,
    play,
    playbackState: status.playbackState,
    stop
  };
}
