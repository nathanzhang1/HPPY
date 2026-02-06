import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TempProgressBar({ 
  progress = 0, 
  width = 120, 
  height = 14,
  borderColor = '#177023',
  backgroundColor = '#D6D9DE',
  progressColor = '#67D375',
  showBorder = true
}) {
  const borderRadius = height / 2;
  const progressWidth = Math.max(0, Math.min(100, progress)) * width / 100;
  
  return (
    <View style={[
      styles.container, 
      { 
        width, 
        height, 
        borderRadius,
        borderWidth: showBorder ? 2 : 0,
        borderColor: borderColor,
      }
    ]}>
      {/* Background */}
      <View style={[styles.backgroundBar, { borderRadius, backgroundColor }]} />

      {/* Progress fill */}
      {progress > 0 && (
        <View 
          style={[
            styles.progressFill,
            { 
              width: progressWidth,
              borderRadius,
              backgroundColor: progressColor,
            }
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  backgroundBar: {
    width: '100%',
    height: '100%',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
});