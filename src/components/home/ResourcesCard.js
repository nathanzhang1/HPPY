import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TextStroke from '../TextStroke';

export default function ResourcesCard({ onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../../assets/home/resources-background.png')}
          style={styles.background}
          resizeMode="cover"
        />
      </View>
      <View style={styles.overlay} />
      
      <View style={styles.header}>
        <Image
          source={require('../../../assets/home/wood-plank.png')}
          style={styles.woodPlank}
          resizeMode="stretch"
        />
        <TextStroke stroke={2} color="#75383B">
          <Text style={styles.title}>Resources</Text>
        </TextStroke>
      </View>

      <View style={styles.researchBubble}>
        <Text style={styles.researchText}>Research</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 158,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderBottomWidth: 12,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#25B0AB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  },
  background: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    top: -10,
    left: -10,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#25B0AB80',
    borderRadius: 12,
  },
  header: {
    alignItems: 'center',
    position: 'relative',
    bottom: 20,
  },
  woodPlank: {
    width: 400,
    height: 500,
  },
  title: {
    position: 'absolute',
    top: -466,
    right: -58,
    fontFamily: 'Sigmar',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F2DAB3',
    paddingHorizontal: 4,
  },
  researchBubble: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 20,
  },
  researchText: {
    fontSize: 16,
    color: '#25B0AB',
  },
});