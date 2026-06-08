import { ValidationResult } from '../types/dictionary';

export const MAX_WORD_LENGTH = 45;

const ENGLISH_WORD_PATTERN = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;
const NUMBERS_ONLY_PATTERN = /^\d+$/;
const SPECIAL_CHARS_ONLY_PATTERN = /^[^a-zA-Z0-9\s'-]+$/;

export function validateSearchInput(input: string): ValidationResult {
  if (input === '') {
    return { valid: false, message: 'Please enter a word' };
  }

  const trimmed = input.trim();

  if (trimmed === '') {
    return { valid: false, message: 'Please enter a valid word' };
  }

  if (trimmed.length > MAX_WORD_LENGTH) {
    return { valid: false, message: 'Word is too long' };
  }

  if (NUMBERS_ONLY_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Only alphabetic characters are allowed' };
  }

  if (SPECIAL_CHARS_ONLY_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid English word' };
  }

  if (/\s/.test(trimmed)) {
    return { valid: false, message: 'Please enter a single word' };
  }

  if (!ENGLISH_WORD_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid English word' };
  }

  return {
    valid: true,
    normalizedWord: trimmed.toLowerCase(),
  };
}
