import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { HistoryProvider } from './src/context/HistoryContext';
import { SearchProvider } from './src/context/SearchContext';
import DrawerNavigator from './src/navigation/DrawerNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <HistoryProvider>
          <SearchProvider>
            <NavigationContainer>
              <DrawerNavigator />
              <StatusBar style="dark" />
            </NavigationContainer>
          </SearchProvider>
        </HistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
