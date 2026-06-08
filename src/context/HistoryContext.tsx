import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeHistoryWord } from '../utils/helpers';

const HISTORY_STORAGE_KEY = '@dictionary_search_history';
const MAX_HISTORY_ITEMS = 50;

interface HistoryContextValue {
  history: string[];
  isLoading: boolean;
  addToHistory: (word: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (mounted && stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setHistory(parsed.filter((item) => typeof item === 'string'));
          }
        }
      } catch {
        // Keep empty history on read failure
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const persistHistory = useCallback(async (items: string[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Silently fail persistence; in-memory history still works
    }
  }, []);

  const addToHistory = useCallback(
    async (word: string) => {
      const normalized = normalizeHistoryWord(word);
      if (!normalized) return;

      setHistory((prev) => {
        const filtered = prev.filter(
          (item) => normalizeHistoryWord(item) !== normalized
        );
        const updated = [normalized, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        persistHistory(updated);
        return updated;
      });
    },
    [persistHistory]
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore clear failures
    }
  }, []);

  const value = useMemo(
    () => ({ history, isLoading, addToHistory, clearHistory }),
    [history, isLoading, addToHistory, clearHistory]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
