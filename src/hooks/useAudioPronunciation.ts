import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createAudioPlayer,
  AudioPlayer,
  setAudioModeAsync,
  type AudioStatus,
} from 'expo-audio';
import { useIsMounted } from './useIsMounted';

export type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface UseAudioPronunciationResult {
  playbackState: AudioPlaybackState;
  errorMessage: string | null;
  playAudio: (url: string | null) => Promise<void>;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
}

const PLAYBACK_STATUS_UPDATE = 'playbackStatusUpdate';

export function useAudioPronunciation(): UseAudioPronunciationResult {
  const isMounted = useIsMounted();
  const playerRef = useRef<AudioPlayer | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listenerRef = useRef<{ remove: () => void } | null>(null);

  const clearPollers = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const removePlaybackListener = useCallback(() => {
    if (listenerRef.current) {
      listenerRef.current.remove();
      listenerRef.current = null;
    }
  }, []);

  const handlePlaybackFinished = useCallback(() => {
    clearPollers();
    removePlaybackListener();

    const player = playerRef.current;
    if (player) {
      try {
        player.remove();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }

    currentUrlRef.current = null;

    if (isMounted()) {
      setPlaybackState('idle');
    }
  }, [clearPollers, isMounted, removePlaybackListener]);

  const hasPlaybackFinished = useCallback((player: AudioPlayer, status?: AudioStatus) => {
    if (status?.didJustFinish) {
      return true;
    }

    const currentStatus = status ?? player.currentStatus;
    if (currentStatus?.didJustFinish) {
      return true;
    }

    if (player.paused) {
      return false;
    }

    const duration = player.duration || currentStatus?.duration || 0;
    const currentTime = player.currentTime || currentStatus?.currentTime || 0;

    return duration > 0 && !player.playing && currentTime >= duration - 0.25;
  }, []);

  const attachPlaybackListener = useCallback(
    (player: AudioPlayer) => {
      removePlaybackListener();

      listenerRef.current = player.addListener(
        PLAYBACK_STATUS_UPDATE,
        (status: AudioStatus) => {
          if (hasPlaybackFinished(player, status)) {
            handlePlaybackFinished();
          }
        }
      );
    },
    [handlePlaybackFinished, hasPlaybackFinished, removePlaybackListener]
  );

  const startPlaybackPoller = useCallback(
    (player: AudioPlayer) => {
      clearPollers();

      pollIntervalRef.current = setInterval(() => {
        if (hasPlaybackFinished(player)) {
          handlePlaybackFinished();
        }
      }, 250);
    },
    [clearPollers, handlePlaybackFinished, hasPlaybackFinished]
  );

  const stopAudio = useCallback(() => {
    clearPollers();
    removePlaybackListener();

    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.remove();
      } catch {
        // Player may already be released
      }
      playerRef.current = null;
    }

    currentUrlRef.current = null;

    if (isMounted()) {
      setPlaybackState('idle');
    }
  }, [clearPollers, isMounted, removePlaybackListener]);

  const pauseAudio = useCallback(() => {
    if (!playerRef.current) return;

    clearPollers();

    try {
      playerRef.current.pause();
    } catch {
      // ignore
    }

    if (isMounted()) {
      setPlaybackState('paused');
    }
  }, [clearPollers, isMounted]);

  const resumeAudio = useCallback(() => {
    if (!playerRef.current) return;

    try {
      playerRef.current.play();
    } catch {
      if (isMounted()) {
        setErrorMessage('Could not play pronunciation');
        setPlaybackState('error');
      }
      return;
    }

    if (isMounted()) {
      setErrorMessage(null);
      setPlaybackState('playing');
    }

    attachPlaybackListener(playerRef.current);
    startPlaybackPoller(playerRef.current);
  }, [attachPlaybackListener, isMounted, startPlaybackPoller]);

  const playAudio = useCallback(
    async (url: string | null) => {
      if (!url) return;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (isMounted()) {
          setErrorMessage('Audio unavailable');
          setPlaybackState('error');
        }
        return;
      }

      if (
        playerRef.current &&
        currentUrlRef.current === url &&
        playerRef.current.paused
      ) {
        resumeAudio();
        return;
      }

      stopAudio();

      if (isMounted()) {
        setErrorMessage(null);
        setPlaybackState('loading');
      }

      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });

        const player = createAudioPlayer({ uri: url }, { downloadFirst: true });
        playerRef.current = player;
        currentUrlRef.current = url;

        player.play();

        if (isMounted()) {
          setPlaybackState('playing');
        }

        attachPlaybackListener(player);
        startPlaybackPoller(player);
      } catch {
        if (isMounted()) {
          setErrorMessage('Could not play pronunciation');
          setPlaybackState('error');
        }
        stopAudio();
      }
    },
    [
      attachPlaybackListener,
      isMounted,
      resumeAudio,
      startPlaybackPoller,
      stopAudio,
    ]
  );

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {
      // Non-critical setup failure
    });

    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    playbackState,
    errorMessage,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
  };
}
