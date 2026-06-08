import { AudioPronunciationOption, DictionaryEntry, Phonetic } from '../types/dictionary';

const LOCALE_INFO: Record<string, { label: string; shortLabel: string; icon: string }> = {
  uk: { label: 'British', shortLabel: 'UK', icon: '🇬🇧' },
  us: { label: 'American', shortLabel: 'US', icon: '🇺🇸' },
  au: { label: 'Australian', shortLabel: 'AU', icon: '🇦🇺' },
};

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

function parseLocaleFromAudioUrl(url: string): string | null {
  const match = url.match(/-([a-z]{2})\.mp3(?:\?|$)/i);
  return match ? match[1].toLowerCase() : null;
}

function isValidAudioUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function getAudioPronunciations(entry: DictionaryEntry): AudioPronunciationOption[] {
  if (!isValidArray(entry.phonetics)) {
    return [];
  }

  const seen = new Set<string>();
  const options: AudioPronunciationOption[] = [];

  for (const phonetic of entry.phonetics) {
    if (!isNonEmptyString(phonetic.audio)) {
      continue;
    }

    const url = phonetic.audio.trim();
    if (!isValidAudioUrl(url) || seen.has(url)) {
      continue;
    }

    seen.add(url);

    const locale = parseLocaleFromAudioUrl(url);
    const localeInfo = locale ? LOCALE_INFO[locale] : null;

    options.push({
      url,
      label: localeInfo?.label ?? 'Pronunciation',
      shortLabel: localeInfo?.shortLabel ?? '●',
      icon: localeInfo?.icon ?? '🔊',
      phoneticText: isNonEmptyString(phonetic.text) ? phonetic.text : null,
    });
  }

  return options;
}

export function getAudioUrl(entry: DictionaryEntry): string | null {
  const pronunciations = getAudioPronunciations(entry);
  return pronunciations.length > 0 ? pronunciations[0].url : null;
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
