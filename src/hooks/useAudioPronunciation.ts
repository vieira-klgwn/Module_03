import { useCallback, useEffect, useRef, useState } from 'react';
import { createAudioPlayer, AudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useIsMounted } from './useIsMounted';

export type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'error';

interface UseAudioPronunciationResult {
  playbackState: AudioPlaybackState;
  errorMessage: string | null;
  playAudio: (url: string | null) => Promise<void>;
  stopAudio: () => void;
}

export function useAudioPronunciation(): UseAudioPronunciationResult {
  const isMounted = useIsMounted();
  const playerRef = useRef<AudioPlayer | null>(null);
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPollers = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const stopAudio = useCallback(() => {
    clearPollers();

    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.remove();
      } catch {
        // Player may already be released
      }
      playerRef.current = null;
    }

    if (isMounted()) {
      setPlaybackState('idle');
    }
  }, [clearPollers, isMounted]);

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

        player.play();

        if (isMounted()) {
          setPlaybackState('playing');
        }

        pollIntervalRef.current = setInterval(() => {
          if (!player.playing) {
            clearPollers();
            try {
              player.remove();
            } catch {
              // ignore
            }
            if (playerRef.current === player) {
              playerRef.current = null;
            }
            if (isMounted()) {
              setPlaybackState('idle');
            }
          }
        }, 300);

        pollTimeoutRef.current = setTimeout(() => {
          clearPollers();
        }, 30000);
      } catch {
        if (isMounted()) {
          setErrorMessage('Could not play pronunciation');
          setPlaybackState('error');
        }
        stopAudio();
      }
    },
    [clearPollers, isMounted, stopAudio]
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
    stopAudio,
  };
}
