import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api';
import TempProgressBar from '../components/TempProgressBar';
import LottieView from 'lottie-react-native';
import ActivityInput from '../components/profile-completion/ActivityInput';
import NotificationSlider from '../components/profile-completion/NotificationSlider';

const { width, height } = Dimensions.get('window');

export default function ProfileCompletionScreen({ navigation }) {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notificationFrequency, setNotificationFrequency] = useState(5);
  const [isHatching, setIsHatching] = useState(false);
  const [hasHatched, setHasHatched] = useState(false);
  const [justHatched, setJustHatched] = useState(false); // Track if egg just hatched in this session
  const [loading, setLoading] = useState(true);
  const animationRef = useRef(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log('Loading user data...');
      const [settingsData, activitiesData] = await Promise.all([
        api.getUserSettings(),
        api.getRecommendedActivities(),
      ]);
      console.log('Settings loaded:', settingsData);
      console.log('Activities loaded:', activitiesData);

      setNotificationFrequency(parseInt(settingsData.notification_frequency) || 5);
      setHasHatched(settingsData.has_hatched);
      setSelectedActivities(activitiesData.activities || []);
    } catch (error) {
      console.error('Failed to load user data:', error);
      console.error('Error details:', error.message, error.stack);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = (activity) => {
    setSelectedActivities([...selectedActivities, activity]);
  };

  const handleRemoveActivity = (activity) => {
    setSelectedActivities(selectedActivities.filter(a => a !== activity));
  };

  const handleSave = async () => {
    try {
      console.log('Saving activities:', selectedActivities);
      console.log('Saving notification frequency:', notificationFrequency);
      const results = await Promise.all([
        api.saveRecommendedActivities(selectedActivities),
        api.updateUserSettings({ 
          notification_frequency: notificationFrequency.toString() 
        }),
      ]);
      console.log('Save successful:', results);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save user data:', error);
      console.error('Error details:', error.message, error.stack);
    }
  };

  const handleHatch = async () => {
    setIsHatching(true);
    if (animationRef.current) {
      animationRef.current.play();
    }
    // Save that egg has hatched
    try {
      await api.updateUserSettings({ has_hatched: true });
    } catch (error) {
      console.error('Failed to update hatched status:', error);
    }
  };

  const handleAnimationFinish = () => {
    setIsHatching(false);
    setHasHatched(true);
    setJustHatched(true); // Mark that we just hatched in this session
  };

  const handleGoHome = async () => {
    // Save any changes made after hatching
    try {
      await Promise.all([
        api.saveRecommendedActivities(selectedActivities),
        api.updateUserSettings({ 
          notification_frequency: notificationFrequency.toString() 
        }),
      ]);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
    navigation.goBack();
  };

  const handleGoSanctuary = async () => {
    // Save any changes made after hatching
    try {
      await Promise.all([
        api.saveRecommendedActivities(selectedActivities),
        api.updateUserSettings({ 
          notification_frequency: notificationFrequency.toString() 
        }),
      ]);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
    navigation.navigate('Sanctuary');
  };

  const progress = Math.min((selectedActivities.length / 5) * 100, 100);
  const isProfileComplete = selectedActivities.length >= 5;
  const showSettingsMode = hasHatched && !justHatched; // Only show Settings mode when returning to already-hatched profile

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        <Image
          source={require('../../assets/home/profile-background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Image
                source={require('../../assets/home/wood-plank.png')}
                style={styles.woodPlank}
                resizeMode="stretch"
              />
              <Text style={styles.headerTitle}>{showSettingsMode ? 'Settings' : 'Complete Profile'}</Text>
            </View>

            <View style={styles.contentWrapper}>
              <View style={styles.contentContainer}>
                <View style={styles.overlay} />
                
                <View style={styles.content}>
                  <ActivityInput
                    selectedActivities={selectedActivities}
                    onAddActivity={handleAddActivity}
                    onRemoveActivity={handleRemoveActivity}
                  />

                  <NotificationSlider
                    value={notificationFrequency}
                    onValueChange={setNotificationFrequency}
                  />
                </View>
              </View>
            </View>

            {!showSettingsMode && (
              <View style={styles.bottomSection}>
                {isHatching ? (
                  <LottieView
                    ref={animationRef}
                    source={require('../../assets/profile-completion/egg-hatching.json')}
                    style={styles.hatchingAnimation}
                    autoPlay
                    loop={false}
                    onAnimationFinish={handleAnimationFinish}
                    resizeMode="contain"
                  />
                ) : justHatched ? (
                  <View style={styles.platypusContainer}>
                    <Image
                      source={require('../../assets/profile-completion/platypus-glow.png')}
                      style={styles.platypusGlow}
                      resizeMode="contain"
                    />
                    <Image
                      source={require('../../assets/profile-completion/platypus.png')}
                      style={styles.platypusImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <>
                    <Image
                      source={require('../../assets/home/egg-icon.png')}
                      style={styles.eggIcon}
                      resizeMode="contain"
                    />
                    <View style={styles.progressBarContainer}>
                      <TempProgressBar progress={progress} width={width - 140} height={20} />
                    </View>
                  </>
                )}
              </View>
            )}

            {showSettingsMode ? (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : justHatched ? (
              <View style={styles.hatchedFooter}>
                <View style={styles.messageContainer}>
                  <Text style={styles.hatchedMessage}>Check out your new friend in the Sanctuary!</Text>
                </View>
                <View style={styles.hatchedButtons}>
                  <TouchableOpacity
                    style={styles.hatchedButton}
                    onPress={handleGoHome}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hatchedButtonText}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.hatchedButton}
                    onPress={handleGoSanctuary}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hatchedButtonText}>Sanctuary</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : !isHatching ? (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={isProfileComplete ? handleHatch : handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>
                    {isProfileComplete ? 'Hatch' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D5E4A',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '105%',
    top: -10,
    bottom: 10,
  },
  safeArea: {
    flex: 1,
  },
  mainContent: {
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
    top: 35,
    fontFamily: 'Sigmar',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F2DAB3',
    textShadowColor: '#75383B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  contentContainer: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(61, 94, 74, 0.9)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
    height: 160,
    justifyContent: 'center',
  },
  eggIcon: {
    width: 115,
    height: 115,
    marginBottom: 12,
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  hatchingAnimation: {
    width: 200,
    height: 200,
  },
  platypusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 130,
    height: 130,
  },
  platypusGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    top: 10,
  },
  platypusImage: {
    width: 120,
    height: 120,
    zIndex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    alignItems: 'flex-end',
  },
  saveButton: {
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
  saveButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#3D5E4A',
  },
  hatchedFooter: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 20 : 24,
    alignItems: 'center',
  },
  messageContainer: {
    backgroundColor: 'rgba(61, 94, 74, 0.95)',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  hatchedMessage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  hatchedButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  hatchedButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  hatchedButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#3D5E4A',
  },
});