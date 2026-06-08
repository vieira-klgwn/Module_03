import { DictionaryEntry, Phonetic } from '../types/dictionary';

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

export function safeString(value: unknown, fallback = ''): string {
  return isNonEmptyString(value) ? value : fallback;
}

export function validateDictionaryResponse(data: unknown): DictionaryEntry[] {
  if (!isValidArray(data)) {
    throw new Error('EMPTY_RESPONSE');
  }

  const entries: DictionaryEntry[] = [];

  for (const item of data) {
    if (item && typeof item === 'object' && isNonEmptyString((item as DictionaryEntry).word)) {
      entries.push(item as DictionaryEntry);
    }
  }

  if (entries.length === 0) {
    throw new Error('EMPTY_RESPONSE');
  }

  return entries;
}

export function getPhoneticText(entry: DictionaryEntry): string | null {
  if (isNonEmptyString(entry.phonetic)) {
    return entry.phonetic;
  }

  if (isValidArray(entry.phonetics)) {
    for (const p of entry.phonetics) {
      if (isNonEmptyString(p.text)) {
        return p.text;
      }
    }
  }

  return null;
}

export function getAudioUrl(entry: DictionaryEntry): string | null {
  if (!isValidArray(entry.phonetics)) {
    return null;
  }

  for (const phonetic of entry.phonetics) {
    if (isNonEmptyString(phonetic.audio)) {
      const url = phonetic.audio.trim();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
    }
  }

  return null;
}

export function getAllPhonetics(entry: DictionaryEntry): Phonetic[] {
  if (!isValidArray(entry.phonetics)) {
    return [];
  }
  return entry.phonetics.filter(
    (p) => isNonEmptyString(p.text) || isNonEmptyString(p.audio)
  );
}

export function normalizeHistoryWord(word: string): string {
  return word.trim().toLowerCase();
}
