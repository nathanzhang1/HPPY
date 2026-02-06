import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function SanctuaryCard({ onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../../assets/home/sanctuary-background.png')}
          style={styles.background}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.header}>
        <Image
          source={require('../../../assets/home/wood-plank.png')}
          style={styles.woodPlank}
          resizeMode="stretch"
        />
        <Text style={styles.title}>Sanctuary</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 246,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderBottomWidth: 12,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#75383B',
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
    height: '120%',
    top: -45,
    left: -17,
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
    top: 32,
    fontFamily: 'Sigmar',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F2DAB3',
    textShadowColor: '#75383B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});