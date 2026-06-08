import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlaybackState } from '../hooks/useAudioPronunciation';

interface PronunciationButtonProps {
  phoneticText: string | null;
  audioUrl: string | null;
  playbackState: AudioPlaybackState;
  errorMessage: string | null;
  onPlayPause: () => void;
  onStop: () => void;
}

const PronunciationButton: React.FC<PronunciationButtonProps> = ({
  phoneticText,
  audioUrl,
  playbackState,
  errorMessage,
  onPlayPause,
  onStop,
}) => {
  if (!phoneticText && !audioUrl) {
    return null;
  }

  const showAudioControls = Boolean(audioUrl);
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isLoading = playbackState === 'loading';
  const showStopButton = isPlaying || isPaused;

  const playPauseIcon = isPlaying
    ? 'pause'
    : isPaused
      ? 'play'
      : 'volume-medium-outline';

  const playPauseLabel = isPlaying
    ? 'Pause pronunciation'
    : isPaused
      ? 'Resume pronunciation'
      : 'Play pronunciation';

  return (
    <View style={styles.container}>
      {phoneticText ? (
        <Text style={styles.phonetic} accessibilityLabel={`Phonetic: ${phoneticText}`}>
          {phoneticText}
        </Text>
      ) : null}

      {showAudioControls ? (
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onPlayPause}
            disabled={isLoading}
            style={styles.audioButton}
            accessibilityLabel={playPauseLabel}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#6C63FF" />
            ) : (
              <Ionicons name={playPauseIcon} size={28} color="#6C63FF" />
            )}
          </TouchableOpacity>

          {showStopButton ? (
            <TouchableOpacity
              onPress={onStop}
              style={styles.audioButton}
              accessibilityLabel="Stop pronunciation"
              accessibilityRole="button"
            >
              <Ionicons name="stop" size={26} color="#6C63FF" />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {errorMessage ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  phonetic: {
    fontSize: 18,
    color: '#718096',
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#EDF2F7',
  },
  errorText: {
    fontSize: 13,
    color: '#C53030',
    width: '100%',
  },
});

export default PronunciationButton;
