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
  onPress: () => void;
}

const PronunciationButton: React.FC<PronunciationButtonProps> = ({
  phoneticText,
  audioUrl,
  playbackState,
  errorMessage,
  onPress,
}) => {
  if (!phoneticText && !audioUrl) {
    return null;
  }

  const showAudioIcon = Boolean(audioUrl);
  const isPlaying = playbackState === 'playing';
  const isLoading = playbackState === 'loading';

  return (
    <View style={styles.container}>
      {phoneticText ? (
        <Text style={styles.phonetic} accessibilityLabel={`Phonetic: ${phoneticText}`}>
          {phoneticText}
        </Text>
      ) : null}

      {showAudioIcon ? (
        <TouchableOpacity
          onPress={onPress}
          disabled={isLoading}
          style={styles.audioButton}
          accessibilityLabel="Play pronunciation"
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#6C63FF" />
          ) : (
            <Ionicons
              name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
              size={28}
              color="#6C63FF"
            />
          )}
        </TouchableOpacity>
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
