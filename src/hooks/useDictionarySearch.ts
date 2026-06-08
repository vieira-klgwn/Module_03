import { useCallback, useRef, useState } from 'react';
import { fetchWordDefinition } from '../api/dictionaryApi';
import {
  DictionaryEntry,
  SearchError,
  SearchStatus,
} from '../types/dictionary';
import { parseApiError } from '../utils/errorHandler';
import { validateSearchInput } from '../utils/validators';
import { useIsMounted } from './useIsMounted';

interface UseDictionarySearchResult {
  entries: DictionaryEntry[] | null;
  status: SearchStatus;
  error: SearchError | null;
  validationMessage: string | null;
  searchedWord: string | null;
  search: (input: string) => Promise<boolean>;
  retry: () => Promise<void>;
  clearResults: () => void;
  clearValidation: () => void;
}

export function useDictionarySearch(
  onSuccess?: (word: string) => void
): UseDictionarySearchResult {
  const isMounted = useIsMounted();
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [error, setError] = useState<SearchError | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [searchedWord, setSearchedWord] = useState<string | null>(null);
  const lastSearchWordRef = useRef<string | null>(null);
  const isSearchingRef = useRef(false);

  const clearResults = useCallback(() => {
    setEntries(null);
    setError(null);
    setSearchedWord(null);
    setStatus('idle');
  }, []);

  const clearValidation = useCallback(() => {
    setValidationMessage(null);
  }, []);

  const search = useCallback(
    async (input: string): Promise<boolean> => {
      if (isSearchingRef.current) {
        return false;
      }

      const validation = validateSearchInput(input);

      if (!validation.valid) {
        if (isMounted()) {
          setValidationMessage(validation.message ?? 'Invalid input');
          setError(null);
          setEntries(null);
          setStatus('idle');
        }
        return false;
      }

      const word = validation.normalizedWord!;
      isSearchingRef.current = true;
      lastSearchWordRef.current = word;

      if (isMounted()) {
        setValidationMessage(null);
        setError(null);
        setStatus('loading');
        setSearchedWord(word);
      }

      try {
        const data = await fetchWordDefinition(word);

        if (!isMounted()) return false;

        setEntries(data);
        setStatus('success');
        setError(null);
        onSuccess?.(word);
        return true;
      } catch (err) {
        if (!isMounted()) return false;

        if (err instanceof Error && err.message === 'canceled') {
          return false;
        }

        const parsedError = parseApiError(err);
        setError(parsedError);
        setEntries(null);
        setStatus('error');
        return false;
      } finally {
        isSearchingRef.current = false;
      }
    },
    [isMounted, onSuccess]
  );

  const retry = useCallback(async () => {
    if (lastSearchWordRef.current) {
      await search(lastSearchWordRef.current);
    }
  }, [search]);

  return {
    entries,
    status,
    error,
    validationMessage,
    searchedWord,
    search,
    retry,
    clearResults,
    clearValidation,
  };
}
