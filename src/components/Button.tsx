/**
 * ============================================================
 * BUTTON COMPONENT - Reusable Button
 * ============================================================
 * 
 * WHAT IS THIS?
 * A custom button component that looks better than the default
 * React Native button. It supports different colors (variants).
 * 
 * HOW TO USE:
 * <Button title="Click Me" onPress={() => alert('clicked!')} />
 * <Button title="Delete" variant="danger" onPress={handleDelete} />
 * <Button title="Cancel" variant="secondary" onPress={handleCancel} />
 * 
 * PROPS (the settings you pass to this component):
 * - title: the text on the button
 * - onPress: what happens when you tap it
 * - variant: "primary" (blue), "secondary" (gray), or "danger" (red)
 * - disabled: if true, the button is grayed out and can't be pressed
 * - style: extra styles you want to add
 * ============================================================
 */

// React import - needed for any React component
import React from 'react';

// React Native imports:
// - TouchableOpacity: a button that gets slightly transparent when pressed
// - Text: for displaying text
// - StyleSheet: for creating styles (like CSS)
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

// IN TYPESCRIPT, WE DEFINE PROPS USING AN INTERFACE
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) => {
  
  // Choose the button color based on the variant
  // This is a simple function that returns the right style
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  // Choose the text color based on the variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.buttonText;
    }
  };

  return (
    // TouchableOpacity = tappable area that fades slightly when pressed
    // activeOpacity = how transparent it gets when pressed (0.7 = 70% visible)
    <TouchableOpacity
      style={[
        styles.button,          // Base button styles
        getButtonStyle(),       // Variant-specific color
        disabled && styles.disabledButton,  // Gray out if disabled
        style,                  // Any extra styles passed as prop
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {/* Show a spinner if loading, otherwise show the title text */}
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[getTextStyle(), disabled && styles.disabledText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// -------------------------------------------------------
// STYLES
// -------------------------------------------------------
// StyleSheet.create() is like writing CSS, but for React Native
const styles = StyleSheet.create({
  // Base button style - applied to ALL buttons
  button: {
    paddingVertical: 14,          // Top and bottom padding
    paddingHorizontal: 24,        // Left and right padding
    borderRadius: 12,             // Rounded corners
    alignItems: 'center',         // Center the text horizontally
    justifyContent: 'center',     // Center the text vertically
    marginVertical: 6,            // Space above and below
  },
  // Primary button - the main action button (blue/purple)
  primaryButton: {
    backgroundColor: '#6C63FF',   // Purple-blue color
  },
  // Secondary button - for less important actions (gray)
  secondaryButton: {
    backgroundColor: '#8E8E93',   // Gray color
  },
  // Danger button - for destructive actions like delete (red)
  dangerButton: {
    backgroundColor: '#FF3B30',   // Red color
  },
  // Outline button - just a border, no fill
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  // Disabled button - grayed out
  disabledButton: {
    backgroundColor: '#C7C7CC',
    opacity: 0.6,
  },
  // Text style for filled buttons (white text)
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',            // Semi-bold
  },
  // Text style for outline buttons (colored text)
  outlineText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Text style when disabled
  disabledText: {
    color: '#FFFFFF',
  },
});

// Export the component so other files can import and use it
export default Button;
