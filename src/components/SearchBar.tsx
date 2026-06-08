import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Button from './Button';
import { MAX_WORD_LENGTH } from '../utils/validators';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  loading = false,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter a word..."
        placeholderTextColor="#A0AEC0"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSearch}
        maxLength={MAX_WORD_LENGTH + 10}
        editable={!loading}
        accessibilityLabel="Word search input"
        accessibilityHint="Type an English word to search in the dictionary"
      />
      <Button
        title="Search"
        onPress={onSearch}
        loading={loading}
        disabled={disabled || loading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A202C',
    marginBottom: 12,
  },
  button: {
    marginVertical: 0,
  },
});

export default SearchBar;
