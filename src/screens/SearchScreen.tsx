import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SearchBar from '../components/SearchBar';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import ValidationMessage from '../components/ValidationMessage';
import WordDetails from '../components/WordDetails';
import { useDictionarySearch } from '../hooks/useDictionarySearch';
import { useHistory } from '../context/HistoryContext';
import { useSearchContext } from '../context/SearchContext';
import { cancelActiveRequest } from '../api/dictionaryApi';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addToHistory } = useHistory();
  const { setIsSearching, registerSearchHandler } = useSearchContext();
  const [inputValue, setInputValue] = useState('');

  const handleSearchSuccess = useCallback(
    (word: string) => {
      addToHistory(word);
    },
    [addToHistory]
  );

  const {
    entries,
    status,
    error,
    validationMessage,
    searchedWord,
    search,
    retry,
    clearValidation,
  } = useDictionarySearch(handleSearchSuccess);

  const isLoading = status === 'loading';

  useEffect(() => {
    setIsSearching(isLoading);
  }, [isLoading, setIsSearching]);

  useEffect(() => {
    return () => {
      cancelActiveRequest();
    };
  }, []);

  const performSearch = useCallback(
    async (word: string) => {
      setInputValue(word);
      return search(word);
    },
    [search]
  );

  useEffect(() => {
    registerSearchHandler(performSearch);
  }, [performSearch, registerSearchHandler]);

  const handleSearch = useCallback(async () => {
    Keyboard.dismiss();
    await search(inputValue);
  }, [inputValue, search]);

  const handleInputChange = useCallback(
    (text: string) => {
      setInputValue(text);
      if (validationMessage) {
        clearValidation();
      }
    },
    [validationMessage, clearValidation]
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
          accessibilityLabel="Open navigation drawer"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={28} color="#1A202C" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const showEmptyState =
    status === 'idle' && !validationMessage && !entries && !error;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <SearchBar
            value={inputValue}
            onChangeText={handleInputChange}
            onSearch={handleSearch}
            loading={isLoading}
            disabled={isLoading}
          />

          {validationMessage && <ValidationMessage message={validationMessage} />}

          {error && (
            <ErrorMessage
              message={error.message}
              onRetry={retry}
              showRetry={error.canRetry}
            />
          )}

          {showEmptyState && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color="#CBD5E0" />
              <Text style={styles.emptyTitle}>Search for a word</Text>
              <Text style={styles.emptySubtitle}>
                Enter an English word to find its definition, pronunciation, and examples.
              </Text>
            </View>
          )}

          {entries && searchedWord && status === 'success' && (
            <View style={styles.resultsContainer}>
              <WordDetails entries={entries} searchedWord={searchedWord} />
            </View>
          )}

          <LoadingIndicator visible={isLoading} />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  menuButton: {
    marginLeft: 16,
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});

export default SearchScreen;
