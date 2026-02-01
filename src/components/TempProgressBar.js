import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TempProgressBar({ progress = 0, width = 120, height = 14 }) {
  const borderRadius = height / 2;
  const progressWidth = Math.max(0, Math.min(100, progress)) * width / 100;
  
  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      {/* Gray background */}
      <View style={[styles.backgroundBar, { borderRadius }]} />

      {/* Solid green progress fill */}
      {progress > 0 && (
        <View 
          style={[
            styles.progressFill,
            { 
              width: progressWidth,
              borderRadius,
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
    borderWidth: 2,
    borderColor: '#177023',
  },
  backgroundBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D6D9DE',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#67D375',
  },
});