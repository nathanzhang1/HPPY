import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'white' && styles.whiteButton,
        variant === 'glass' && styles.glassButton,
        isDisabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ?  (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <Text
          style={[
            styles. buttonText,
            variant === 'primary' && styles.primaryButtonText,
            variant === 'secondary' && styles.secondaryButtonText,
            variant === 'white' && styles.whiteButtonText,
            variant === 'glass' && styles.glassButtonText,
            isDisabled && styles.disabledButtonText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet. create({
  button: {
    borderRadius: 25,
    paddingVertical:  16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
  },
  glassButton: {
    backgroundColor:  'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color:  '#007AFF',
  },
  whiteButtonText: {
    color: '#C44569', // Magenta/pink text
  },
  glassButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});