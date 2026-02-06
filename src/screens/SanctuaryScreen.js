import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import TempProgressBar from '../components/TempProgressBar';

const { width, height } = Dimensions.get('window');

export default function SanctuaryScreen({ navigation }) {
  const [hasHatched, setHasHatched] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [recommendedActivities, setRecommendedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadSanctuaryData();
    }, [])
  );

  const loadSanctuaryData = async () => {
    try {
      const [settingsData, activitiesData] = await Promise.all([
        api.getUserSettings(),
        api.getRecommendedActivities(),
      ]);
      
      setHasHatched(settingsData.has_hatched);
      setAnimals(settingsData.animals || []);
      setRecommendedActivities(activitiesData.activities || []);
    } catch (error) {
      console.error('Failed to load sanctuary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFittingRoomPress = () => {
    navigation.navigate('FittingRoom');
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Image */}
      <Image
        source={require('../../assets/home/sanctuary-background.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Content */}
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/home/wood-plank.png')}
            style={styles.woodPlank}
            resizeMode="stretch"
          />
          <Text style={styles.headerTitle}>Sanctuary</Text>
        </View>

        {!hasHatched ? (
          // Before hatching: Show centered box with egg
          <View style={styles.centerContainer}>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={require('../../assets/home/egg-icon.png')}
                  style={styles.eggIcon}
                  resizeMode="contain"
                />
                
                <View style={styles.rightContent}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Nobody's Here Yet</Text>
                  </View>
                  <Text style={styles.descriptionText}>
                    Fill out your profile to hatch{'\n'}your first egg
                  </Text>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleHomePress}
                  >
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressDot} />
                <TempProgressBar 
                  progress={(recommendedActivities.length / 5) * 100} 
                  width={90}
                  height={16}
                  showBorder={false}
                  backgroundColor="#FFFFFF"
                  progressColor="#75383B"
                />
              </View>
            </View>
          </View>
        ) : (
          // After hatching: Show platypus and buttons
          <View style={styles.hatchedContent}>
            <TouchableOpacity 
              style={styles.platypusContainer}
              onPress={handleFittingRoomPress}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/profile-completion/platypus.png')}
                style={styles.platypusImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleHomePress}
              >
                <Text style={styles.navButtonText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleFittingRoomPress}
              >
                <Text style={styles.navButtonText}>Fitting Room</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: 368,
    height: 158,
    backgroundColor: '#F2DAB3',
    borderRadius: 20,
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
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 100,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eggIcon: {
    width: 90,
    height: 100,
    marginRight: 25,
  },
  rightContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  badge: {
    backgroundColor: '#75383B',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    width: "100%",
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  descriptionText: {
    color: '#75383B',
    fontSize: 17,
    lineHeight: 17,
    marginBottom: 8,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: '#75383B',
    fontSize: 15,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20,
  },
  hatchedContent: {
    flex: 1,
    position: 'relative',
  },
  platypusContainer: {
    position: 'absolute',
    bottom: '20%',
    left: '50%',
    // transform: [{ translateX: -53 }, { translateY: -53 }],
  },
  platypusImage: {
    width: 106,
    height: 106,
  },
  buttonRow: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
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
  navButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1E0329',
  },
});
