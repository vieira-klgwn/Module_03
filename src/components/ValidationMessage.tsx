import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ValidationMessageProps {
  message: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ message }) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLabel={`Validation error: ${message}`}
    >
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFAF0',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FEEBC8',
  },
  message: {
    color: '#C05621',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ValidationMessage;
