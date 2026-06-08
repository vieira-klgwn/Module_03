import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DictionaryEntry } from '../types/dictionary';
import {
  getAudioPronunciations,
  getPhoneticText,
  isValidArray,
  safeString,
} from '../utils/helpers';
import PronunciationButton from './PronunciationButton';
import { useAudioPronunciation } from '../hooks/useAudioPronunciation';

interface WordDetailsProps {
  entries: DictionaryEntry[];
  searchedWord: string;
}

const WordDetails: React.FC<WordDetailsProps> = ({ entries, searchedWord }) => {
  const {
    playbackState,
    currentUrl,
    errorMessage,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
  } = useAudioPronunciation();

  const primaryEntry = entries[0];
  const phoneticText = primaryEntry ? getPhoneticText(primaryEntry) : null;
  const audioOptions = primaryEntry ? getAudioPronunciations(primaryEntry) : [];
  const hasMultipleAudios = audioOptions.length > 1;
  const singleAudio = audioOptions.length === 1 ? audioOptions[0] : null;

  const meaningsContent = useMemo(() => {
    if (!isValidArray(entries)) {
      return (
        <Text style={styles.emptyText}>No data available</Text>
      );
    }

    const allMeanings = entries.flatMap((entry) =>
      isValidArray(entry.meanings) ? entry.meanings : []
    );

    if (allMeanings.length === 0) {
      return (
        <Text style={styles.emptyText}>Definitions unavailable</Text>
      );
    }

    return allMeanings.map((meaning, meaningIndex) => {
      const partOfSpeech = safeString(meaning.partOfSpeech, 'unknown');
      const definitions = isValidArray(meaning.definitions)
        ? meaning.definitions
        : [];

      return (
        <View key={`meaning-${meaningIndex}`} style={styles.meaningBlock}>
          <Text style={styles.partOfSpeech}>{partOfSpeech}</Text>

          {definitions.length === 0 ? (
            <Text style={styles.emptyText}>Definitions unavailable</Text>
          ) : (
            definitions.map((def, defIndex) => {
              const definitionText = safeString(def.definition);
              const exampleText = safeString(def.example);

              if (!definitionText) return null;

              return (
                <View key={`def-${meaningIndex}-${defIndex}`} style={styles.definitionBlock}>
                  <Text style={styles.definitionNumber}>{defIndex + 1}.</Text>
                  <View style={styles.definitionContent}>
                    <Text style={styles.definitionText}>{definitionText}</Text>
                    {exampleText ? (
                      <Text style={styles.exampleText}>
                        &ldquo;{exampleText}&rdquo;
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </View>
      );
    });
  }, [entries]);

  const displayWord = safeString(primaryEntry?.word, searchedWord);

  const handlePlayPause = async (url: string) => {
    if (currentUrl === url && playbackState === 'playing') {
      pauseAudio();
      return;
    }
    if (currentUrl === url && playbackState === 'paused') {
      resumeAudio();
      return;
    }
    await playAudio(url);
  };

  const getPlaybackStateForUrl = (url: string) => {
    if (currentUrl !== url) {
      return 'idle' as const;
    }
    return playbackState;
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator
      accessibilityLabel="Word details"
    >
      <Text style={styles.word} accessibilityRole="header">
        {displayWord}
      </Text>

      {(phoneticText || audioOptions.length > 0) && (
        hasMultipleAudios ? (
          <View style={styles.pronunciationSection}>
            {phoneticText ? (
              <Text style={styles.phoneticHeader} accessibilityLabel={`Phonetic: ${phoneticText}`}>
                {phoneticText}
              </Text>
            ) : null}
            <View style={styles.audioOptionsRow}>
              {audioOptions.map((option) => (
                <PronunciationButton
                  key={option.url}
                  phoneticText={null}
                  audioUrl={option.url}
                  localeIcon={option.icon}
                  localeLabel={option.shortLabel}
                  localeFullLabel={option.label}
                  playbackState={getPlaybackStateForUrl(option.url)}
                  errorMessage={errorMessage}
                  showError={false}
                  onPlayPause={() => handlePlayPause(option.url)}
                  onStop={stopAudio}
                />
              ))}
            </View>
            {errorMessage ? (
              <Text style={styles.audioErrorText} accessibilityRole="alert">
                {errorMessage}
              </Text>
            ) : null}
          </View>
        ) : (
          <PronunciationButton
            phoneticText={phoneticText}
            audioUrl={singleAudio?.url ?? null}
            playbackState={playbackState}
            errorMessage={errorMessage}
            onPlayPause={() => {
              if (singleAudio) {
                void handlePlayPause(singleAudio.url);
              }
            }}
            onStop={stopAudio}
          />
        )
      )}

      <View style={styles.meaningsContainer}>{meaningsContent}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  word: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  pronunciationSection: {
    marginTop: 8,
  },
  phoneticHeader: {
    fontSize: 18,
    color: '#718096',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  audioOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  audioErrorText: {
    fontSize: 13,
    color: '#C53030',
    marginTop: 8,
  },
  meaningsContainer: {
    marginTop: 20,
  },
  meaningBlock: {
    marginBottom: 24,
  },
  partOfSpeech: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
    fontStyle: 'italic',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  definitionBlock: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingRight: 8,
  },
  definitionNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A5568',
    marginRight: 8,
    minWidth: 20,
  },
  definitionContent: {
    flex: 1,
  },
  definitionText: {
    fontSize: 15,
    color: '#2D3748',
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  exampleText: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  emptyText: {
    fontSize: 15,
    color: '#718096',
    fontStyle: 'italic',
    marginVertical: 8,
  },
});

export default WordDetails;
