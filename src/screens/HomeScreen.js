import React, { useState } from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import AddActivityModal from '../components/AddActivityModal';
import ProfileCard from '../components/home/ProfileCard';
import SanctuaryCard from '../components/home/SanctuaryCard';
import ShopCard from '../components/home/ShopCard';
import DataCard from '../components/home/DataCard';
import ResourcesCard from '../components/home/ResourcesCard';

const CARD_MARGIN = 16;

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState([]);

  const handleAddActivity = (activity, happiness) => {
    const newActivity = {
      id: Date.now().toString(),
      name: activity,
      happiness: happiness,
      timestamp: new Date(),
    };
    setActivities([newActivity, ...activities]);
    setModalVisible(false);
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileCompletion');
  };

  const handleSanctuaryPress = () => {
    console.log('Navigate to Sanctuary');
  };

  const handleShopPress = () => {
    console.log('Navigate to Shop');
  };

  const handleDataPress = () => {
    navigation.navigate('Data', { 
      activities, 
      setActivities 
    });
  };

  const handleResourcesPress = () => {
    console.log('Navigate to Resources');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfileCard onPress={handleProfilePress} />
          <SanctuaryCard onPress={handleSanctuaryPress} />
          
          <View style={styles.bottomRow}>
            <ShopCard onPress={handleShopPress} />
            <DataCard onPress={handleDataPress} />
          </View>

          <ResourcesCard onPress={handleResourcesPress} />
          
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Image
        source={require('../../assets/onboarding/background-glow.png')}
        style={styles.addButtonGradient}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/onboarding/add-button.png')}
          style={styles.addButtonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <AddActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddActivity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: CARD_MARGIN,
    paddingBottom: 120,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
    width: '100%',
  },
  signOutButton: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  addButtonGradient: {
    position: 'absolute',
    bottom: -20,
    right: -40,
    width: 200,
    height: 200,
    zIndex: 0,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 70,
    height: 70,
    zIndex: 1,
  },
  addButtonImage: {
    width: 70,
    height: 70,
  },
});