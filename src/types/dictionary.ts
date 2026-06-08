export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: {
    name?: string;
    url?: string;
  };
}

export interface Definition {
  definition?: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
}

export interface Meaning {
  partOfSpeech?: string;
  definitions?: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  license?: {
    name?: string;
    url?: string;
  };
  sourceUrls?: string[];
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SearchError {
  message: string;
  canRetry: boolean;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  normalizedWord?: string;
}

export interface AudioPronunciationOption {
  url: string;
  label: string;
  shortLabel: string;
  icon: string;
  phoneticText: string | null;
}
