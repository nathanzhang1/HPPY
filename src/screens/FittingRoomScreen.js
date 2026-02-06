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

export default function FittingRoomScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      const settingsData = await api.getUserSettings();
      setItems(settingsData.items || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
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
                    {items.map((item, index) => (
                      <View key={index} style={styles.itemCard}>
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
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
  platypusContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  platypusImage: {
    width: 260,
    height: 260,
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
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#75383B',
    minWidth: 100,
  },
  itemName: {
    fontSize: 14,
    color: '#75383B',
    fontWeight: '600',
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
