import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TempProgressBar from '../TempProgressBar';

export default function ProfileCard({ onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../../assets/home/profile-background.png')}
          style={styles.background}
          resizeMode="cover"
        />
      </View>
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.left}>
          <Image
            source={require('../../../assets/home/egg-icon.png')}
            style={styles.eggIcon}
            resizeMode="contain"
          />
          <TempProgressBar progress={50} width={120} height={14} />
        </View>

        <View style={styles.right}>
          <View style={styles.textContainer}>
            <Image
              source={require('../../../assets/home/wood-plank.png')}
              style={styles.woodPlank}
              resizeMode="stretch"
            />
            <Text style={styles.title}>Complete Profile</Text>
          </View>
          <Text style={styles.description}>
            Fill out your profile to hatch your first egg
          </Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </View>
        </View>
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
    borderBottomWidth: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#67D375',
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
    height: '100%',
    top: 0,
    right: -10,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#3D5E4ACC',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  left: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  eggIcon: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    height: 40,
  },
  woodPlank: {
    position: 'absolute',
    width: 240,
    height: 500,
    top: -30,
    right: -25,
  },
  title: {
    position: 'absolute',
    fontFamily: 'Sigmar',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F2DAB3',
    textShadowColor: '#75383B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    width: 220,
    bottom: 5,
    right: -45,
  },
  description: {
    fontSize: 17,
    width: 192,
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#177023',
  },
});