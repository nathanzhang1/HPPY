import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { Dimensions, Animated, Easing } from 'react-native';

const { width } = Dimensions.get('window');

const AnimatedBackgroundContext = createContext({});

export const useAnimatedBackground = () => useContext(AnimatedBackgroundContext);

export const AnimatedBackgroundProvider = ({ children }) => {
  const scrollX = useRef(new Animated. Value(0)).current;
  const [phase, setPhase] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);
  const scrollAnimationRef = useRef(null);

  useEffect(() => {
    // Horizontal scrolling animation - 120 seconds for full cycle
    scrollAnimationRef.current = Animated.loop(
      Animated. timing(scrollX, {
        toValue: -width,
        duration: 120000, // 120 seconds
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    scrollAnimationRef.current.start();

    // Wave morphing animation
    const animateWaves = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      // Completes one full cycle in 120 seconds
      setPhase(elapsed * (Math.PI * 2 / 60)); // 2x speed as requested earlier
      animationFrameRef.current = requestAnimationFrame(animateWaves);
    };
    animateWaves();

    return () => {
      if (scrollAnimationRef.current) {
        scrollAnimationRef.current. stop();
      }
      if (animationFrameRef. current) {
        cancelAnimationFrame(animationFrameRef. current);
      }
    };
  }, []);

  return (
    <AnimatedBackgroundContext.Provider value={{ scrollX, phase }}>
      {children}
    </AnimatedBackgroundContext.Provider>
  );
};