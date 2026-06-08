import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showRetry = true,
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${message}`}
    >
      <Text style={styles.message}>{message}</Text>
      {showRetry && onRetry && (
        <Button
          title="Retry"
          onPress={onRetry}
          variant="outline"
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#FED7D7',
    alignItems: 'center',
  },
  message: {
    color: '#C53030',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 12,
    minWidth: 120,
  },
});

export default ErrorMessage;
