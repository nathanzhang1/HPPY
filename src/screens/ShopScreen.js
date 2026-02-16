import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import ExperimentModal from '../components/shop/ExperimentModal';
import ItemPurchaseModal from '../components/shop/ItemPurchaseModal';
import EggPurchaseModal from '../components/shop/EggPurchaseModal';
import TextStroke from '../components/TextStroke';

const { width } = Dimensions.get('window');

// Calculate card dimensions to fit within wood plank width
const WOOD_PLANK_WIDTH = 390; // Approximate visible width of wood plank
const GRID_PADDING = 16; // Padding on sides
const CARD_GAP = 4; // Gap between cards
const CARDS_PER_ROW = 3;
const CARD_WIDTH = (WOOD_PLANK_WIDTH - (GRID_PADDING * 2) - (CARD_GAP * (CARDS_PER_ROW - 1))) / CARDS_PER_ROW;

// Mock shop items - will be replaced with actual data later
const SHOP_ITEMS = [
  { id: 1, name: 'Egg', price: 200, image: require('../../assets/home/egg-icon.png'), scale: 0.95, purchasable: true },
  { id: 2, name: 'Hula Skirt', price: 50, image: require('../../assets/shop/hula-skirt.png'), scale: 0.9, purchasable: true },
  { id: 3, name: 'Shirt', price: 50, image: require('../../assets/shop/shirt.png'), scale: 1.0, purchasable: false },
  { id: 4, name: 'Hat', price: 50, image: require('../../assets/shop/hat.png'), scale: 1.2, purchasable: false },
  { id: 5, name: 'Necklace', price: 50, image: require('../../assets/shop/necklace.png'), scale: 1.1, purchasable: false },
  { id: 6, name: 'Snorkel', price: 50, image: require('../../assets/shop/snorkel.png'), scale: 1.0, purchasable: false },
  { id: 7, name: 'Floatie', price: 50, image: require('../../assets/shop/floatie.png'), scale: 1.5, purchasable: false },
  { id: 8, name: 'Flippers', price: 50, image: require('../../assets/shop/flippers.png'), scale: 1.2, purchasable: false },
  { id: 9, name: 'Swimsuit', price: 50, image: require('../../assets/shop/swimsuit.png'), scale: 1.2, purchasable: false },
];

export default function ShopScreen({ navigation }) {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [hasHatched, setHasHatched] = useState(false);
  
  // Modal states
  const [dailyExerciseModal, setDailyExerciseModal] = useState(false);
  const [weekendVacationsModal, setWeekendVacationsModal] = useState(false);
  const [itemPurchaseModal, setItemPurchaseModal] = useState(false);
  const [eggPurchaseModal, setEggPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const settingsData = await api.getUserSettings();
      setCoins(settingsData.coins || 0);
      setAnimals(settingsData.animals || []);
      setHasHatched(settingsData.has_hatched || false);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleExperimentPress = (experimentName) => {
    if (experimentName === 'Daily Exercise') {
      setDailyExerciseModal(true);
    } else if (experimentName === 'Weekend Vacations') {
      setWeekendVacationsModal(true);
    }
  };

  const handleItemPress = (item) => {
    if (!item.purchasable) return;
    
    setSelectedItem(item);
    if (item.id === 1) {
      // Egg item - use EggPurchaseModal
      setEggPurchaseModal(true);
    } else {
      // Regular item - use ItemPurchaseModal
      setItemPurchaseModal(true);
    }
  };

  const handlePurchase = async (item) => {
    try {
      console.log('ShopScreen - Attempting purchase:', item);
      const response = await api.purchaseItem(item.id, item.name, item.price);
      console.log('ShopScreen - Purchase response:', response);
      setCoins(response.coins);
      
      // If egg was purchased, update animals list
      if (response.animals) {
        setAnimals(response.animals);
      }
      
      // Reload user data to get updated items/animals
      await loadUserData();
      
      return response; // Return response for modal to handle
    } catch (error) {
      console.error('ShopScreen - Purchase error:', error);
      throw new Error(error.message || 'Purchase failed');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background */}
      <Image
        source={require('../../assets/shop/background.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Experiments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image
                source={require('../../assets/home/wood-plank.png')}
                style={styles.headerWoodPlank}
                resizeMode="stretch"
              />
              <TextStroke stroke={3} color="#75383B">
                <Text style={styles.experimentsTitle}>Experiments</Text>
              </TextStroke>
            </View>

            <View style={styles.experimentsRow}>
              <TouchableOpacity 
                style={styles.exerciseCard}
                onPress={() => handleExperimentPress('Daily Exercise')}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../assets/shop/daily-exercise.png')}
                  style={styles.experimentImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.vacationsCard}
                onPress={() => handleExperimentPress('Weekend Vacations')}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../assets/shop/weekend-vacations.png')}
                  style={styles.experimentImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Shop Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image
                source={require('../../assets/home/wood-plank.png')}
                style={styles.headerWoodPlank}
                resizeMode="stretch"
              />
              <TextStroke stroke={3} color="#75383B">
                <Text style={styles.shopTitle}>Shop</Text>
              </TextStroke>
              
              <View style={styles.coinDisplay}>
                <Image
                  source={require('../../assets/home/coin-icon.png')}
                  style={styles.coinIcon}
                  resizeMode="contain"
                />
                <Text style={styles.coinText}>{coins}</Text>
              </View>
            </View>

            <View style={styles.shopGrid}>
              {SHOP_ITEMS
                .filter(item => {
                  // Hide egg (id: 1) until user has hatched their first egg
                  if (item.id === 1 && !hasHatched) {
                    return false;
                  }
                  return true;
                })
                .map((item) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.shopItemCard}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={item.purchasable ? 0.8 : 1}
                  >
                    <View style={styles.itemImageContainer}>
                      {item.image ? (
                        <Image
                          source={item.image}
                          style={[
                            styles.itemImage,
                          { 
                            transform: [{ scale: item.scale || 1 }]
                          }
                        ]}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>{item.name}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{item.price}</Text>
                    <Image
                      source={require('../../assets/home/coin-icon.png')}
                      style={styles.priceCoinIcon}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Home Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleHomePress}
          >
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Modals */}
      <ExperimentModal
        visible={dailyExerciseModal}
        onClose={() => setDailyExerciseModal(false)}
        type="dailyExercise"
      />
      
      <ExperimentModal
        visible={weekendVacationsModal}
        onClose={() => setWeekendVacationsModal(false)}
        type="weekendVacations"
      />
      
      <ItemPurchaseModal
        visible={itemPurchaseModal}
        onClose={() => {
          setItemPurchaseModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        userCoins={coins}
        onPurchase={handlePurchase}
        navigation={navigation}
      />
      
      <EggPurchaseModal
        visible={eggPurchaseModal}
        onClose={() => {
          setEggPurchaseModal(false);
          setSelectedItem(null);
        }}
        userCoins={coins}
        onPurchase={handlePurchase}
        navigation={navigation}
        allAnimalsCollected={animals.length >= 4 || (animals.includes('cat') && animals.includes('dinosaur') && animals.includes('raccoon'))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    position: 'relative',
    height: 60,
  },
  headerWoodPlank: {
    position: 'absolute',
    width: 440,
    height: 900,
    top: -60,
  },
  experimentsTitle: {
    position: 'absolute',
    top: 8,
    right: -100,
    fontFamily: 'Sigmar',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F2DAB3',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  shopTitle: {
    position: 'absolute',
    top: 8,
    right: -45,
    fontFamily: 'Sigmar',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F2DAB3',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  coinDisplay: {
    position: 'absolute',
    right: 40,
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    zIndex: 2,
  },
  coinIcon: {
    width: 24,
    height: 24,
    marginRight: 14,
  },
  coinText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#225987',
  },
  experimentsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    width: WOOD_PLANK_WIDTH,
    alignSelf: 'center',
    marginBottom: -20,
  },
  exerciseCard: {
    width: (WOOD_PLANK_WIDTH - 32 - 12) / 2, // Calculate explicit width for 2 cards
    aspectRatio: 0.85,
    borderRadius: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#284275',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  vacationsCard: {
    width: (WOOD_PLANK_WIDTH - 32 - 12) / 2, // Calculate explicit width for 2 cards
    aspectRatio: 0.85,
    borderRadius: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#282B19',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  experimentImage: {
    width: '100%',
    height: '100%',
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: WOOD_PLANK_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: GRID_PADDING,
    gap: CARD_GAP,
  },
  shopItemCard: {
    width: CARD_WIDTH,
    aspectRatio: 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#75383B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
    justifyContent: 'space-between',
  },
  itemImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '90%',
    height: '90%',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#F2DAB3',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#75383B',
    marginRight: 4,
  },
  priceCoinIcon: {
    width: 20,
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  homeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1E0329',
  },
});
