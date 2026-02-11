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

const { width, height } = Dimensions.get('window');

// Helper function to get item image
const getItemImage = (itemId) => {
  const itemImages = {
    1: require('../../assets/home/egg-icon.png'),
    2: require('../../assets/shop/grass-skirt.png'),
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
  const [loading, setLoading] = useState(true);
  const [equippedItem, setEquippedItem] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      const settingsData = await api.getUserSettings();
      const userItems = settingsData.items || [];
      setItems(userItems);
      
      // Find equipped item
      const equipped = userItems.find(item => item.equipped);
      setEquippedItem(equipped || null);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemEquip = async (item) => {
    try {
      // Toggle equip status
      const newEquipStatus = !item.equipped;
      
      // Update items: unequip all, then equip selected if toggling on
      const updatedItems = items.map(i => ({
        ...i,
        equipped: i.id === item.id ? newEquipStatus : false
      }));
      
      // Save to backend
      await api.updateUserSettings({ items: updatedItems });
      
      // Update local state
      setItems(updatedItems);
      setEquippedItem(newEquipStatus ? item : null);
    } catch (error) {
      console.error('Failed to equip item:', error);
    }
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
          <Text style={styles.headerTitle}>Fitting Room</Text>
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
              
              <View style={styles.itemsInnerSection}>
                {items.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Nothing's here! Let's go shopping!
                  </Text>
                ) : (
                  <View style={styles.itemsGrid}>
                    {items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.itemCard,
                          item.equipped && styles.itemCardEquipped
                        ]}
                        onPress={() => handleItemEquip(item)}
                        activeOpacity={0.7}
                      >
                        {getItemImage(item.id) && (
                          <Image
                            source={getItemImage(item.id)}
                            style={styles.itemImage}
                            resizeMode="contain"
                          />
                        )}
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.equipped && (
                          <View style={styles.equippedBadge}>
                            <Text style={styles.equippedText}>Equipped</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Platypus Display */}
          <View style={styles.platypusContainer}>
            <Image
              source={require('../../assets/profile-completion/platypus.png')}
              style={styles.platypusImage}
              resizeMode="contain"
            />
            {/* Show equipped item on platypus */}
            {equippedItem && (
              <Image
                source={getItemImage(equippedItem.id)}
                style={styles.equippedItemImage}
                resizeMode="contain"
              />
            )}
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
    fontFamily: 'Sigmar',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F2DAB3',
    textShadowColor: '#75383B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 1,
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
    marginBottom: 10,
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
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#75383B',
    padding: 10,
    width: 90,
    height: 110,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCardEquipped: {
    backgroundColor: '#E8F4E5',
    borderColor: '#177023',
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#75383B',
    textAlign: 'center',
  },
  equippedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#177023',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  equippedText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  platypusContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 30,
    position: 'relative',
  },
  platypusImage: {
    width: 260,
    height: 260,
  },
  equippedItemImage: {
    position: 'absolute',
    bottom: 40,
    width: 80,
    height: 80,
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
