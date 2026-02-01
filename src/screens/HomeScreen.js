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
import { useAuth } from '../context/AuthContext';
import TempProgressBar from '../components/TempProgressBar';
import AddActivityModal from '../components/AddActivityModal';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = width - (CARD_MARGIN * 2);

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
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
    console.log('Navigate to Data');
  };

  const handleResourcesPress = () => {
    console.log('Navigate to Resources');
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
          {/* Profile Card */}
          <TouchableOpacity 
            style={[styles.card, styles.profileCard]}
            onPress={handleProfilePress}
            activeOpacity={0.9}
          >
            <View style={styles.profileBackgroundContainer}>
              <Image
                source={require('../../assets/home/profile-background.png')}
                style={styles.profileBackground}
                resizeMode="cover"
              />
            </View>
            <View style={styles.profileOverlay} />
            
            <View style={styles.profileContent}>
              {/* Left side: Egg and Progress */}
              <View style={styles.profileLeft}>
                <Image
                  source={require('../../assets/home/egg-icon.png')}
                  style={styles.eggIcon}
                  resizeMode="contain"
                />
                <TempProgressBar progress={50} width={120} height={14} />
              </View>

              {/* Right side: Title and Button */}
              <View style={styles.profileRight}>
                <View style={styles.profileTextContainer}>
                  <Image
                    source={require('../../assets/home/wood-plank.png')}
                    style={styles.woodPlankProfile}
                    resizeMode="stretch"
                  />
                  <Text style={styles.profileTitle}>Complete Profile</Text>
                </View>
                <Text style={styles.profileDescription}>
                  Fill out your profile to hatch your first egg
                </Text>
                <View style={styles.getStartedButton}>
                  <Text style={styles.getStartedText}>Get Started</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Sanctuary Card */}
          <TouchableOpacity 
            style={[styles.card, styles.sanctuaryCard]}
            onPress={handleSanctuaryPress}
            activeOpacity={0.9}
          >
            <View style={styles.sanctuaryBackgroundContainer}>
              <Image
                source={require('../../assets/home/sanctuary-background.png')}
                style={styles.sanctuaryBackground}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.sanctuaryHeader}>
              <Image
                source={require('../../assets/home/wood-plank.png')}
                style={styles.woodPlankSanctuary}
                resizeMode="stretch"
              />
              <Text style={styles.sanctuaryTitle}>Sanctuary</Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Row: Shop and Data */}
          <View style={styles.bottomRow}>
            {/* Shop Card */}
            <TouchableOpacity 
              style={[styles.card, styles.shopCard]}
              onPress={handleShopPress}
              activeOpacity={0.9}
            >
              <View style={styles.shopBackgroundContainer}>
                <Image
                  source={require('../../assets/home/shop-background.png')}
                  style={styles.shopBackground}
                  resizeMode="cover"
                />
              </View>
              
              <View style={styles.shopContent}>
                <View style={styles.shopFooter}>
                  <View style={styles.coinBubble}>
                    <Image
                      source={require('../../assets/home/coin-icon.png')}
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

            {/* Data Card */}
            <TouchableOpacity 
              style={[styles.card, styles.dataCard]}
              onPress={handleDataPress}
              activeOpacity={0.9}
            >
              <View style={styles.dataBackgroundContainer}>
                <Image
                  source={require('../../assets/home/data-background.png')}
                  style={styles.dataBackground}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.dataOverlay} />
              
              <Image
                source={require('../../assets/home/data-chart.png')}
                style={styles.dataChart}
                resizeMode="contain"
              />
              
              <View style={styles.dataHeader}>
                <Image
                  source={require('../../assets/home/wood-plank.png')}
                  style={styles.woodPlankData}
                  resizeMode="stretch"
                />
                <Text style={styles.dataTitle}>Data</Text>
              </View>

              {/* Explore Bubble */}
              <View style={styles.exploreBubble}>
                <Text style={styles.exploreText}>Explore</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Mental Health Resources Card */}
          <TouchableOpacity 
            style={[styles.card, styles.resourcesCard]}
            onPress={handleResourcesPress}
            activeOpacity={0.9}
          >
            <Text style={styles.resourcesTitle}>Mental Health Resources</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Image
        source={require('../../assets/onboarding/background-glow.png')}
        style={styles.addButtonGradient}
        resizeMode="contain"
      />

      {/* Floating Add Button */}
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
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: CARD_MARGIN,
    paddingBottom: 100,
  },

  // Base Card Style
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  // Profile Card
  profileCard: {
    height: 158,
    marginBottom: 16,
    borderBottomWidth: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#67D375',
  },
  profileBackgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  },
  profileBackground: {
    position: 'absolute',
    width: '110%',
    height: '100%',
    top: 0,
    right: -10,
  },
  profileOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#3D5E4ACC',
    borderRadius: 20,
  },
  profileContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  profileLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  eggIcon: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  profileRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  profileTextContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    height: 40,
  },
  woodPlankProfile: {
    position: 'absolute',
    width: 240,
    height: 500,
    top: -30,
    right: -25,
  },
  profileTitle: {
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
  profileDescription: {
    fontSize: 17,
    width: 192,
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: 500,
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  getStartedText: {
    fontSize: 15,
    color: '#177023',
  },

  // Sanctuary Card
  sanctuaryCard: {
    height: 246,
    marginBottom: 16,
    borderBottomWidth: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#75383B',
  },
  sanctuaryBackgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  },
  sanctuaryBackground: {
    position: 'absolute',
    width: '110%',
    height: '120%',
    top: -45,
    left: -17,
  },
  sanctuaryHeader: {
    alignItems: 'center',
    position: 'relative',
    bottom: 20,
  },
  woodPlankSanctuary: {
    width: 400,
    height: 500,
  },
  sanctuaryTitle: {
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

  // Bottom Row
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },

  // Shop Card
  shopCard: {
    flex: 1,
    height: 278,
    borderBottomWidth: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#225987',
  },
  shopBackgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  shopBackground: {
    position: 'absolute',
    width: '115%',
    height: '115%',
    top: -20,
    left: -20,
  },
  shopContent: {
    flex: 1,
  },
  shopFooter: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row'
  },
  coinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 12,
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

  // Data Card
  dataCard: {
    flex: 1,
    height: 278,
    borderBottomWidth: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#B33AE4',
  },
  dataBackgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  dataBackground: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    top: -30,
    left: -25,
    borderRadius: 20,
  },
  dataOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E0329CC',
    borderRadius: 20,
  },
  dataChart: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 40,
    width: '80%',
    height: 180,
  },
  dataHeader: {
    alignItems: 'center',
    paddingTop: 16,
    position: 'relative',
  },
  woodPlankData: {
    width: 170,
    height: 500,
    bottom: 35,
  },
  dataTitle: {
    position: 'absolute',
    top: 12,
    fontFamily: 'Sigmar',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F2DAB3',
    textShadowColor: '#75383B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  exploreBubble: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exploreText: {
    fontSize: 16,
    color: '#333',
  },

  // Resources Card
  resourcesCard: {
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2DAB3',
    borderBottomWidth: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#75383B',
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
  },

  // Add Button Gradient
  addButtonGradient: {
    position: 'absolute',
    bottom: 30,
    right: 14,
    width: 90,
    height: 90,
    zIndex: 0,
  },

  // Floating Add Button
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