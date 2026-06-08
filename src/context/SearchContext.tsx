import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

interface SearchContextValue {
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  registerSearchHandler: (handler: (word: string) => Promise<boolean>) => void;
  searchFromHistory: (word: string) => Promise<boolean>;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearching, setIsSearching] = useState(false);
  const searchHandlerRef = useRef<((word: string) => Promise<boolean>) | null>(
    null
  );

  const registerSearchHandler = useCallback(
    (handler: (word: string) => Promise<boolean>) => {
      searchHandlerRef.current = handler;
    },
    []
  );

  const searchFromHistory = useCallback(async (word: string) => {
    if (!searchHandlerRef.current || isSearching) {
      return false;
    }
    return searchHandlerRef.current(word);
  }, [isSearching]);

  const value = useMemo(
    () => ({
      isSearching,
      setIsSearching,
      registerSearchHandler,
      searchFromHistory,
    }),
    [isSearching, registerSearchHandler, searchFromHistory]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
