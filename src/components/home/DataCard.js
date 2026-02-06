import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function DataCard({ onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../../assets/home/data-background.png')}
          style={styles.background}
          resizeMode="cover"
        />
      </View>
      <View style={styles.overlay} />
      
      <Image
        source={require('../../../assets/home/data-chart.png')}
        style={styles.chart}
        resizeMode="contain"
      />
      
      <View style={styles.header}>
        <Image
          source={require('../../../assets/home/wood-plank.png')}
          style={styles.woodPlank}
          resizeMode="stretch"
        />
        <Text style={styles.title}>Data</Text>
      </View>

      <View style={styles.exploreBubble}>
        <Text style={styles.exploreText}>Explore</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 278,
    borderRadius: 20,
    overflow: 'hidden',
    borderBottomWidth: 12,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#B33AE4',
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
  },
  background: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    top: -30,
    left: -25,
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E0329CC',
  },
  chart: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 40,
    width: '80%',
    height: 180,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    position: 'relative',
  },
  woodPlank: {
    width: 170,
    height: 500,
    bottom: 35,
  },
  title: {
    position: 'absolute',
    top: 14,
    fontFamily: 'Sigmar',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F2DAB3',
    textShadowColor: '#75383B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  exploreBubble: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exploreText: {
    fontSize: 16,
    color: '#333',
  },
});