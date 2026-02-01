import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';

export default function ProgressBar({ progress = 0, width = 120, height = 14 }) {
  const borderRadius = height / 2;
  const progressWidth = Math.max(0, Math.min(100, progress)) * width / 100;
  const borderWidth = 1.5;
  
  // Generate unique ID for this instance to avoid conflicts
  const patternId = `blueStripes-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      {/* Solid gray background */}
      <View style={[styles.backgroundBar, { borderRadius }]} />

      {/* Progress fill - only shows if progress > 0 */}
      {progress > 0 && (
        <View 
          style={[
            styles.progressContainer,
            { 
              width: progressWidth,
              borderRadius,
              borderWidth: borderWidth,
              borderColor: '#177023',
            }
          ]}
        >
          <Svg 
            width={progressWidth} 
            height={height} 
            style={styles.progressSvg}
          >
            <Defs>
              {/* Green diagonal stripe pattern for progress */}
              <Pattern
                id={patternId}
                patternUnits="userSpaceOnUse"
                width="20"
                height="12"
                patternTransform="rotate(-30)"
              >
                <Rect width="10" height="18" fill="#177023" />
                <Rect x="10" width="20" height="18" fill="#67D375" />
              </Pattern>
            </Defs>
            {/* Progress bar with green stripes */}
            <Rect
              width={progressWidth}
              height={height}
              rx={borderRadius}
              ry={borderRadius}
              fill={`url(#${patternId})`}
            />
          </Svg>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  backgroundBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D6D9DE',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  progressSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});