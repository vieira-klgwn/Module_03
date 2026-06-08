import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useHistory } from '../context/HistoryContext';

interface HistoryDrawerContentProps extends DrawerContentComponentProps {
  onSelectWord: (word: string) => void;
  isSearching: boolean;
}

const HistoryDrawerContent: React.FC<HistoryDrawerContentProps> = ({
  onSelectWord,
  isSearching,
  navigation,
  ...props
}) => {
  const { history, isLoading, clearHistory } = useHistory();
  const selectingRef = useRef(false);

  const handleSelectWord = async (word: string) => {
    if (isSearching || selectingRef.current) return;

    selectingRef.current = true;
    navigation.closeDrawer();

    try {
      await onSelectWord(word);
    } finally {
      setTimeout(() => {
        selectingRef.current = false;
      }, 500);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book-outline" size={28} color="#6C63FF" />
        <Text style={styles.headerTitle}>Dictionary</Text>
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Search History</Text>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={clearHistory}
            accessibilityLabel="Clear search history"
            accessibilityRole="button"
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#6C63FF" style={styles.loader} />
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={40} color="#CBD5E0" />
          <Text style={styles.emptyText}>No search history</Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {history.map((item, index) => (
            <TouchableOpacity
              key={`${item}-${index}`}
              style={[styles.historyItem, isSearching && styles.historyItemDisabled]}
              onPress={() => handleSelectWord(item)}
              disabled={isSearching}
              accessibilityLabel={`Search for ${item}`}
              accessibilityRole="button"
            >
              <Ionicons name="search-outline" size={18} color="#6C63FF" />
              <Text style={styles.historyWord}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  clearText: {
    fontSize: 14,
    color: '#E53E3E',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#A0AEC0',
    marginTop: 12,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  historyItemDisabled: {
    opacity: 0.5,
  },
  historyWord: {
    fontSize: 16,
    color: '#2D3748',
    textTransform: 'capitalize',
  },
  loader: {
    marginTop: 20,
  },
});

export default HistoryDrawerContent;
