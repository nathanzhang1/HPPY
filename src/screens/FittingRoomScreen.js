import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
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

export default function FittingRoomScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState('platypus'); // Track current animal
  const [equippedItemId, setEquippedItemId] = useState(null); // Track equipped item for current animal
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      const settingsData = await api.getUserSettings();
      const userItems = settingsData.items || [];
      
      console.log('FittingRoom - All user items:', userItems);
      
      // Filter out eggs (id: 1) and group by item ID to track quantities
      const fittingRoomItems = userItems.filter(item => item.id !== 1);
      
      console.log('FittingRoom - After filtering eggs:', fittingRoomItems);
      
      // Group items by id and count quantities
      const itemGroups = {};
      fittingRoomItems.forEach(item => {
        if (!itemGroups[item.id]) {
          itemGroups[item.id] = {
            ...item,
            quantity: 1,
            instances: [item]
          };
        } else {
          itemGroups[item.id].quantity += 1;
          itemGroups[item.id].instances.push(item);
        }
      });
      
      // Convert back to array for display
      const groupedItems = Object.values(itemGroups);
      console.log('FittingRoom - Grouped items:', groupedItems);
      setItems(groupedItems);
      
      // Find equipped item for current animal
      const equipped = fittingRoomItems.find(item => item.equipped && item.animal === selectedAnimal);
      setEquippedItemId(equipped ? equipped.id : null);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemEquip = async (item) => {
    try {
      // Toggle equip status for current animal
      const isCurrentlyEquipped = equippedItemId === item.id;
      const newEquipStatus = !isCurrentlyEquipped;
      
      // Get all user items from backend
      const settingsData = await api.getUserSettings();
      const allItems = settingsData.items || [];
      
      // Update items: unequip all for this animal, then equip first instance of selected item if toggling on
      const updatedItems = allItems.map((i, index) => {
        // Unequip all items for current animal
        if (i.animal === selectedAnimal) {
          return { ...i, equipped: false, animal: null };
        }
        // Equip first instance of the selected item
        if (i.id === item.id && newEquipStatus && index === allItems.findIndex(x => x.id === item.id)) {
          return { ...i, equipped: true, animal: selectedAnimal };
        }
        return i;
      });
      
      // Save to backend
      await api.updateUserSettings({ items: updatedItems });
      
      // Update local state
      setEquippedItemId(newEquipStatus ? item.id : null);
      
      // Reload items to update display
      await loadItems();
    } catch (error) {
      console.error('Failed to equip item:', error);
    }
  };

  // Get the image for the animal (with or without item)
  const getAnimalImage = () => {
    if (equippedItemId === 2) { // Hula skirt
      return require('../../assets/shop/platypus-hula.png');
    }
    return require('../../assets/profile-completion/platypus.png');
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

        {/* Animal Display - Fixed Position */}
        <View style={styles.animalContainer}>
          <Image
            source={getAnimalImage()}
            style={[
              styles.animalImage,
              equippedItemId === 2 && styles.animalImageWithHula
            ]}
            resizeMode="contain"
          />
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
                          {item.quantity > 1 && (
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
    top: 500,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
