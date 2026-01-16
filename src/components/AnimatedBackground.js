import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground() {
  const scrollX = useRef(new Animated. Value(0)).current;
  const [phase, setPhase] = useState(0);

  // Calculate wave Y position at any X point
  const getWaveY = (x, baseY, amplitude, phaseOffset, totalWidth) => {
    const normalizedX = (x + width) / totalWidth;
    
    const wave1 = Math.sin(phase + phaseOffset + normalizedX * Math.PI * 4) * amplitude;
    const wave2 = Math.sin(phase * 1.3 + phaseOffset + normalizedX * Math.PI * 2) * (amplitude * 0.4);
    const wave3 = Math.sin(phase * 0.7 + phaseOffset + normalizedX * Math.PI * 6) * (amplitude * 0.2);
    
    return baseY + wave1 + wave2 + wave3;
  };

  // Generate smooth wave path using cubic bezier curves
  const generateWavePath = (baseY, amplitude, phaseOffset) => {
    const totalWidth = width * 3;
    const segments = 60;
    const points = [];

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * totalWidth - width;
      const y = getWaveY(x, baseY, amplitude, phaseOffset, totalWidth);
      points.push({ x, y });
    }

    let path = `M${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const prevPoint = points[i - 1] || current;
      const nextNextPoint = points[i + 2] || next;
      
      const tension = 0.3;
      
      const cp1x = current.x + (next.x - prevPoint.x) * tension;
      const cp1y = current. y + (next.y - prevPoint.y) * tension;
      const cp2x = next. x - (nextNextPoint.x - current.x) * tension;
      const cp2y = next.y - (nextNextPoint. y - current.y) * tension;
      
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    path += ` L${width * 2},${height} L${-width},${height} Z`;
    return path;
  };

  // Generate smooth shadow path using cubic bezier curves
  const generateDropShadowPath = (baseY, amplitude, phaseOffset, shadowHeight = 12) => {
    const totalWidth = width * 3;
    const segments = 60;
    const topPoints = [];
    const bottomPoints = [];

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * totalWidth - width;
      const y = getWaveY(x, baseY, amplitude, phaseOffset, totalWidth);
      
      topPoints.push({ x, y: y - shadowHeight });
      bottomPoints.push({ x, y });
    }

    let path = `M${topPoints[0].x},${topPoints[0].y}`;
    
    for (let i = 0; i < topPoints.length - 1; i++) {
      const current = topPoints[i];
      const next = topPoints[i + 1];
      const prevPoint = topPoints[i - 1] || current;
      const nextNextPoint = topPoints[i + 2] || next;
      
      const tension = 0.3;
      
      const cp1x = current. x + (next.x - prevPoint.x) * tension;
      const cp1y = current. y + (next.y - prevPoint.y) * tension;
      const cp2x = next. x - (nextNextPoint.x - current.x) * tension;
      const cp2y = next.y - (nextNextPoint. y - current.y) * tension;
      
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    const reversedBottom = [... bottomPoints].reverse();
    
    for (let i = 0; i < reversedBottom.length - 1; i++) {
      const current = reversedBottom[i];
      const next = reversedBottom[i + 1];
      const prevPoint = reversedBottom[i - 1] || current;
      const nextNextPoint = reversedBottom[i + 2] || next;
      
      const tension = 0.3;
      
      if (i === 0) {
        path += ` L${current.x},${current. y}`;
      }
      
      const cp1x = current.x + (next.x - prevPoint.x) * tension;
      const cp1y = current.y + (next.y - prevPoint.y) * tension;
      const cp2x = next.x - (nextNextPoint. x - current.x) * tension;
      const cp2y = next.y - (nextNextPoint.y - current.y) * tension;
      
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    path += ' Z';
    return path;
  };

  useEffect(() => {
    // Horizontal scrolling animation - 60 seconds (2x faster)
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -width,
        duration: 60000, // 60 seconds (was 120)
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    scrollAnimation.start();

    // Wave morphing animation - 2x faster phase change
    let animationFrameId;
    let startTime = Date.now();

    const animateWaves = () => {
      const elapsed = (Date. now() - startTime) / 1000;
      // 2x faster:  completes one full cycle in 60 seconds
      setPhase(elapsed * (Math.PI * 2 / 60));
      animationFrameId = requestAnimationFrame(animateWaves);
    };
    animateWaves();

    return () => {
      scrollAnimation.stop();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Animated. View
      style={[
        styles.container,
        {
          transform: [{ translateX:  scrollX }],
        },
      ]}
    >
      <Svg height={height} width={width * 3}>
        <Defs>
          <LinearGradient id="dropShadow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity="0" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0.015" />
          </LinearGradient>
        </Defs>

        {/* Green layer */}
        <Path d={generateWavePath(height * 0.18, 40, 0)} fill="#67D375" />

        {/* Shadow cast by green onto blue */}
        <Path d={generateDropShadowPath(height * 0.32, 50, Math.PI * 0.5, 10)} fill="url(#dropShadow)" />
        {/* Blue layer */}
        <Path d={generateWavePath(height * 0.32, 50, Math.PI * 0.5)} fill="#57A9EC" />

        {/* Shadow cast by blue onto purple */}
        <Path d={generateDropShadowPath(height * 0.50, 45, Math.PI, 10)} fill="url(#dropShadow)" />
        {/* Purple layer */}
        <Path d={generateWavePath(height * 0.50, 45, Math.PI)} fill="#C9449A" />

        {/* Shadow cast by purple onto yellow */}
        <Path d={generateDropShadowPath(height * 0.75, 35, Math.PI * 1.5, 10)} fill="url(#dropShadow)" />
        {/* Yellow/Gold layer */}
        <Path d={generateWavePath(height * 0.75, 35, Math.PI * 1.5)} fill="#E0AE26" />
      </Svg>
    </Animated.View>
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