import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState(0);

  // Generate wave path with phase for morphing effect
  const generateWavePath = (baseY, amplitude, phaseOffset) => {
    const totalWidth = width * 3;
    const segments = 24;
    let path = '';

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * totalWidth - width;
      
      // Combine multiple sine waves for organic movement
      const wave1 = Math.sin(phase + phaseOffset + (i / segments) * Math.PI * 4) * amplitude;
      const wave2 = Math.sin(phase * 1.3 + phaseOffset + (i / segments) * Math.PI * 2) * (amplitude * 0.4);
      const wave3 = Math.sin(phase * 0.7 + phaseOffset + (i / segments) * Math.PI * 6) * (amplitude * 0.2);
      
      const y = baseY + wave1 + wave2 + wave3;

      if (i === 0) {
        path += `M${x},${y}`;
      } else {
        path += ` L${x},${y}`;
      }
    }

    path += ` L${width * 2},${height} L${-width},${height} Z`;
    return path;
  };

  useEffect(() => {
    // Horizontal scrolling animation
    const scrollAnimation = Animated. loop(
      Animated.timing(scrollX, {
        toValue: -width,
        duration: 20000,
        easing:  Easing.linear,
        useNativeDriver: true,
      })
    );
    scrollAnimation.start();

    // Wave morphing animation using requestAnimationFrame
    let animationFrameId;
    let startTime = Date.now();

    const animateWaves = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setPhase(elapsed * 0.5); // Control wave speed here
      animationFrameId = requestAnimationFrame(animateWaves);
    };
    animateWaves();

    return () => {
      scrollAnimation.stop();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: scrollX }],
        },
      ]}
    >
      <Svg height={height} width={width * 3}>
        {/* Green layer */}
        <Path d={generateWavePath(height * 0.18, 40, 0)} fill="#67D375" />
        {/* Blue layer */}
        <Path d={generateWavePath(height * 0.32, 50, Math.PI * 0.5)} fill="#57A9EC" />
        {/* Purple layer */}
        <Path d={generateWavePath(height * 0.50, 45, Math.PI)} fill="#C9449A" />
        {/* Yellow/Gold layer */}
        <Path d={generateWavePath(height * 0.75, 35, Math.PI * 1.5)} fill="#E0AE26" />
      </Svg>
    </Animated. View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left:  0,
    width: width * 3,
    height:  height,
  },
});