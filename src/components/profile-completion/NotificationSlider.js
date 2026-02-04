import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function NotificationSlider({ 
  value, 
  onValueChange, 
  disabled 
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        How many notifications do you want per day?
      </Text>
      
      <View style={styles.sliderWrapper}>
        <Image
          source={require('../../../assets/emoji/turtle.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
          thumbTintColor="#FFFFFF"
          disabled={disabled}
        />
        
        <Image
          source={require('../../../assets/emoji/hare.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.sliderHint}>
        This translates to {value} check-ins a day
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  icon: {
    width: 28,
    height: 28,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderHint: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});