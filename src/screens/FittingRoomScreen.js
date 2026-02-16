import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  PanResponder,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import TextStroke from '../components/TextStroke';

const { width, height } = Dimensions.get('window');

// Helper function to get item image
const getItemImage = (itemId) => {
  const itemImages = {
    1: require('../../assets/home/egg-icon.png'),
    2: require('../../assets/shop/hula-skirt.png'),
    3: require('../../assets/shop/shirt.png'),
    4: require('../../assets/shop/hat.png'),
    5: require('../../assets/shop/necklace.png'),
    6: require('../../assets/shop/snorkel.png'),
    7: require('../../assets/shop/floatie.png'),
    8: require('../../assets/shop/flippers.png'),
    9: require('../../assets/shop/swimsuit.png'),
  };
  return itemImages[itemId] || null;
};

export default function FittingRoomScreen({ navigation, route }) {
  const [items, setItems] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [equippedItemId, setEquippedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const translateX = useRef(new Animated.Value(0)).current;

  // Initialize PanResponder for swipe gestures
  React.useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Update translateX for visual feedback
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 50;
        
        if (gestureState.dx > swipeThreshold) {
          // Swipe right - go to previous animal
          handlePreviousAnimal();
        } else if (gestureState.dx < -swipeThreshold) {
          // Swipe left - go to next animal
          handleNextAnimal();
        }
        
        // Reset translateX
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    });
  }, [currentAnimalIndex, animals]);

  const panResponder = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  React.useEffect(() => {
    // Set initial animal from route params if provided
    if (route?.params?.selectedAnimal && animals.length > 0) {
      const index = animals.indexOf(route.params.selectedAnimal);
      if (index !== -1) {
        setCurrentAnimalIndex(index);
        navigation.setParams({ selectedAnimal: null }); // Clear param
      }
    }
  }, [route?.params?.selectedAnimal, animals]);

  const loadData = async () => {
    try {
      const settingsData = await api.getUserSettings();
      const userAnimals = settingsData.animals || [];
      const userItems = settingsData.items || [];
      
      setAnimals(userAnimals);
      
      // Load items and set initial animal
      loadItems(userItems, userAnimals, currentAnimalIndex);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (userItems = null, userAnimals = null, animalIndex = null) => {
    try {
      if (!userItems) {
        const settingsData = await api.getUserSettings();
        userItems = settingsData.items || [];
        userAnimals = settingsData.animals || [];
      }
      
      const currentAnimal = userAnimals[animalIndex !== null ? animalIndex : currentAnimalIndex];
      
      console.log('FittingRoom - All user items:', userItems);
      
      // Filter out eggs (id: 1) and only show hula skirt (id: 2) for now
      // Other items (3-9) are not implemented yet
      const fittingRoomItems = userItems.filter(item => item.id === 2);
      
      console.log('FittingRoom - After filtering (only hula skirts):', fittingRoomItems);
      
      // Group items by id and count quantities
      const itemGroups = {};
      fittingRoomItems.forEach(item => {
        if (!itemGroups[item.id]) {
          itemGroups[item.id] = {
            ...item,
            quantity: (!item.equipped || !item.animal) ? 1 : 0, // Count only unequipped
            instances: [item]
          };
        } else {
          itemGroups[item.id].quantity += (!item.equipped || !item.animal) ? 1 : 0; // Count only unequipped
          itemGroups[item.id].instances.push(item);
        }
      });
      
      // Convert back to array for display
      const groupedItems = Object.values(itemGroups);
      console.log('FittingRoom - Grouped items:', groupedItems);
      setItems(groupedItems);
      
      // Find equipped item for current animal
      const equipped = fittingRoomItems.find(item => item.equipped && item.animal === currentAnimal);
      setEquippedItemId(equipped ? equipped.id : null);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemEquip = async (item) => {
    try {
      const currentAnimal = animals[currentAnimalIndex];
      
      // Get all user items from backend
      const settingsData = await api.getUserSettings();
      const allItems = settingsData.items || [];
      
      // Check if this item is currently equipped on this animal
      const currentlyEquippedOnThisAnimal = allItems.find(
        i => i.id === item.id && i.equipped && i.animal === currentAnimal
      );
      
      if (currentlyEquippedOnThisAnimal) {
        // CASE 1: Item is equipped on this animal → unequip it
        const updatedItems = allItems.map(i => {
          if (i === currentlyEquippedOnThisAnimal) {
            return { ...i, equipped: false, animal: null };
          }
          return i;
        });
        
        await api.updateUserSettings({ items: updatedItems });
        setEquippedItemId(null);
        await loadItems();
      } else {
        // CASE 2: Item is not equipped on this animal → try to equip it
        
        // First, check if there's an unequipped instance available
        const unequippedInstance = allItems.find(
          i => i.id === item.id && (!i.equipped || !i.animal)
        );
        
        if (!unequippedInstance) {
          // No unequipped instances available - do nothing
          console.log('No unequipped instances available for item:', item.id);
          return;
        }
        
        // Unequip any other item currently on this animal
        const updatedItems = allItems.map(i => {
          // Unequip current item from this animal (if any)
          if (i.animal === currentAnimal && i.equipped) {
            return { ...i, equipped: false, animal: null };
          }
          // Equip the unequipped instance to this animal
          if (i === unequippedInstance) {
            return { ...i, equipped: true, animal: currentAnimal };
          }
          return i;
        });
        
        await api.updateUserSettings({ items: updatedItems });
        setEquippedItemId(item.id);
        await loadItems();
      }
    } catch (error) {
      console.error('Failed to equip item:', error);
    }
  };

  // Get the image for the animal (with or without item)
  const getAnimalImage = () => {
    const currentAnimal = animals[currentAnimalIndex];
    
    if (equippedItemId === 2) { // Hula skirt
      const hulaImages = {
        platypus: require('../../assets/shop/platypus-hula.png'),
        cat: require('../../assets/shop/cat-hula.png'),
        dinosaur: require('../../assets/shop/dinosaur-hula.png'),
        raccoon: require('../../assets/shop/raccoon-hula.png'),
      };
      return hulaImages[currentAnimal] || hulaImages.platypus;
    }
    
    const animalImages = {
      platypus: require('../../assets/sanctuary/platypus.png'),
      cat: require('../../assets/sanctuary/cat.png'),
      dinosaur: require('../../assets/sanctuary/dinosaur.png'),
      raccoon: require('../../assets/sanctuary/raccoon.png'),
    };
    return animalImages[currentAnimal] || animalImages.platypus;
  };

  const handlePreviousAnimal = () => {
    const newIndex = currentAnimalIndex === 0 ? animals.length - 1 : currentAnimalIndex - 1;
    setCurrentAnimalIndex(newIndex);
    loadItems(null, null, newIndex);
  };

  const handleNextAnimal = () => {
    const newIndex = currentAnimalIndex === animals.length - 1 ? 0 : currentAnimalIndex + 1;
    setCurrentAnimalIndex(newIndex);
    loadItems(null, null, newIndex);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Image */}
      <Image
        source={require('../../assets/fitting-room/fitting-room-background.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/home/wood-plank.png')}
            style={styles.woodPlank}
            resizeMode="stretch"
          />
          <TextStroke stroke={3} color="#75383B">
            <Text style={styles.headerTitle}>Fitting Room</Text>
          </TextStroke>
        </View>

        {/* Animal Display - Fixed Position with Navigation */}
        <View style={styles.animalContainer}>
          {/* Left Arrow - Only show if more than one animal */}
          {animals.length > 1 && (
            <TouchableOpacity
              style={[styles.navArrow, styles.leftArrow]}
              onPress={handlePreviousAnimal}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text style={styles.navArrowText}>◀</Text>
            </TouchableOpacity>
          )}

          {/* Animal Image with Swipe Support */}
          <Animated.View
            style={[
              styles.animalImageWrapper,
              {
                transform: [
                  {
                    translateX: translateX.interpolate({
                      inputRange: [-width, 0, width],
                      outputRange: [-50, 0, 50],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
            {...(panResponder.current?.panHandlers || {})}
          >
            <Image
              source={getAnimalImage()}
              style={[
                styles.animalImage,
                equippedItemId === 2 && { transform: [{ scale: 1.3 }] }
              ]}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Right Arrow - Only show if more than one animal */}
          {animals.length > 1 && (
            <TouchableOpacity
              style={[styles.navArrow, styles.rightArrow]}
              onPress={handleNextAnimal}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text style={styles.navArrowText}>▶</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Your Items Section */}
          <View style={styles.itemsSection}>
            <View style={styles.itemsCard}>
              <Text style={styles.sectionTitle}>Your Items</Text>
              
              {items.length === 0 ? (
                <View style={styles.itemsInnerSection}>
                  <Text style={styles.emptyText}>
                    Nothing's here! Let's go shopping!
                  </Text>
                </View>
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.itemsScrollContent}
                >
                  {items.map((item) => {
                    const isEquipped = equippedItemId === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.itemCard}
                        onPress={() => handleItemEquip(item)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.itemImageContainer}>
                          {getItemImage(item.id) && (
                            <Image
                              source={getItemImage(item.id)}
                              style={[styles.itemImage, isEquipped && styles.itemImageEquipped]}
                              resizeMode="contain"
                            />
                          )}
                          {isEquipped && (
                            <View style={styles.crossOverlay}>
                              <View style={[styles.crossLine, styles.crossLine1]} />
                              <View style={[styles.crossLine, styles.crossLine2]} />
                            </View>
                          )}
                          {item.quantity >= 1 && (
                            <View style={styles.quantityBadge}>
                              <Text style={styles.quantityText}>{item.quantity}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Back Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    position: 'relative',
    height: 50,
  },
  woodPlank: {
    position: 'absolute',
    width: 420,
    height: 900,
    top: -30,
  },
  headerTitle: {
    position: 'absolute',
    top: 34,
    right: -135,
    fontFamily: 'Sigmar',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F2DAB3',
    paddingHorizontal: 6,
    zIndex: 1,
    width: 250,
  },
  itemsSection: {
    marginHorizontal: 20,
    marginTop: 80,
    marginBottom: 20,
  },
  itemsCard: {
    backgroundColor: '#F2DAB3',
    borderRadius: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 12,
    borderColor: '#75383B',
    paddingTop: 13,
    paddingLeft: 13,
    paddingRight: 13,
    paddingBottom: 13,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
    color: '#75383B',
  },
  itemsInnerSection: {
    backgroundColor: '#FDF8EF',
    borderRadius: 13,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 17,
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
  itemsScrollContent: {
    gap: 12,
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemCard: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemImage: {
    width: 85,
    height: 85,
  },
  itemImageEquipped: {
    opacity: 0.5,
  },
  crossOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossLine: {
    position: 'absolute',
    width: 80,
    height: 8,
    backgroundColor: '#75383B',
  },
  crossLine1: {
    transform: [{ rotate: '45deg' }],
  },
  crossLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  quantityBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#75383B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  animalContainer: {
    position: 'absolute',
    top: 400,
    left: 0,
    right: 0,
    height: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  animalImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalImage: {
    width: 270,
    height: 270,
  },
  animalImageWithHula: {
    // Adjust these values to align platypus-hula with regular platypus
    width: 337,      // Adjust width if needed
    height: 337,     // Adjust height if needed
    // Uncomment and adjust if you need position offset:
    right: 20,
  },
  navArrow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  leftArrow: {
    left: 20,
  },
  rightArrow: {
    right: 20,
  },
  navArrowText: {
    fontSize: 40,
    color: '#75383B',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  backButton: {
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
  backButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1E0329',
  },
});
