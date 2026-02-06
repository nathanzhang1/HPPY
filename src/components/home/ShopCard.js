import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function ShopCard({ onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../../assets/home/shop-background.png')}
          style={styles.background}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.footer}>
          <View style={styles.coinBubble}>
            <Image
              source={require('../../../assets/home/coin-icon.png')}
              style={styles.coinIcon}
              resizeMode="contain"
            />
            <Text style={styles.coinCount}>0</Text>
          </View>
          <View style={styles.shopBubble}>
            <Text style={styles.shopLabel}>Shop</Text>
          </View>
        </View>
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
    borderColor: '#225987',
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
    width: '115%',
    height: '115%',
    top: -20,
    left: -20,
  },
  content: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  coinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 17,
  },
  coinIcon: {
    width: 24,
    height: 24,
  },
  coinCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shopBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopLabel: {
    fontSize: 16,
    color: '#333',
  },
});