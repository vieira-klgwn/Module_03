/**
 * ============================================================
 * LOADING INDICATOR - Full Screen Loading Spinner
 * ============================================================
 * 
 * WHAT IS THIS?
 * A loading spinner that covers the entire screen.
 * Show it while waiting for data from an API.
 * 
 * HOW TO USE:
 * <LoadingIndicator visible={isLoading} />
 * 
 * PROPS:
 * - visible: true to show the spinner, false to hide it
 * ============================================================
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export interface LoadingIndicatorProps {
  visible?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ visible = false }) => {
  // If not visible, don't render anything
  if (!visible) return null;

  return (
    // This View covers the entire screen with a semi-transparent background
    <View style={styles.container}>
      {/* ActivityIndicator is React Native's built-in spinner */}
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // These 4 properties make the View cover the ENTIRE screen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Semi-transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,  // Make sure it's on TOP of everything
  },
  loaderBox: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});

export default LoadingIndicator;
