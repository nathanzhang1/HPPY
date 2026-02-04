import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import TempProgressBar from '../components/TempProgressBar';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const MAX_LINES = 5;

export default function ProfileCompletionScreen({ navigation }) {
  const [activityInput, setActivityInput] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notificationFrequency, setNotificationFrequency] = useState(5);
  const [isHatching, setIsHatching] = useState(false);
  const [hasHatched, setHasHatched] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [measurementKey, setMeasurementKey] = useState(0);
  const tempMeasureRef = useRef(null);
  const animationRef = useRef(null);

  const handleBubblesLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  const calculateLines = (height) => {
    if (height === 0) return 0;
    // Bubble height + gap
    const bubbleHeight = 32; // paddingVertical: 8 * 2 + fontSize: 14 + some padding
    const gap = 8;
    const lineHeight = bubbleHeight + gap;
    return Math.ceil(height / lineHeight);
  };

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      const newActivity = activityInput.trim();
      
      // Create temp array to measure
      const tempActivities = [...selectedActivities, newActivity];
      
      // Trigger a temporary render to measure
      setMeasurementKey(prev => prev + 1);
      
      // Use setTimeout to allow the layout to measure
      setTimeout(() => {
        if (tempMeasureRef.current) {
          tempMeasureRef.current.measure((x, y, width, height) => {
            const wouldBeLines = calculateLines(height);
            
            if (wouldBeLines <= MAX_LINES) {
              // Safe to add
              setSelectedActivities(tempActivities);
              setActivityInput('');
              Keyboard.dismiss();
            } else {
              // Would exceed max lines - don't add
              console.log('Cannot add activity: would exceed 4 lines');
            }
          });
        } else {
          // Fallback: if measurement fails, just add it
          setSelectedActivities(tempActivities);
          setActivityInput('');
          Keyboard.dismiss();
        }
      }, 0);
    }
  };

  const handleRemoveActivity = (activity) => {
    // Remove activity when clicked
    setSelectedActivities(selectedActivities.filter(a => a !== activity));
  };

  const handleSave = () => {
    console.log('Selected activities:', selectedActivities);
    console.log('Notification frequency:', notificationFrequency);
    navigation.goBack();
  };

  const handleHatch = () => {
    setIsHatching(true);
    // Play animation
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const handleAnimationFinish = () => {
    setIsHatching(false);
    setHasHatched(true);
  };

  const handleGoHome = () => {
    navigation.goBack();
  };

  const handleGoSanctuary = () => {
    // TODO: Navigate to sanctuary when implemented
    console.log('Navigate to Sanctuary');
  };

  // Progress based on minimum of 5 activities, but capped at 100%
  const progress = Math.min((selectedActivities.length / 5) * 100, 100);
  const isProfileComplete = selectedActivities.length >= 5;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Background Image - Full Screen */}
        <Image
          source={require('../../assets/home/profile-background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.mainContent}>
            {/* Header with Wood Plank */}
            <View style={styles.header}>
              <Image
                source={require('../../assets/home/wood-plank.png')}
                style={styles.woodPlank}
                resizeMode="stretch"
              />
              <Text style={styles.headerTitle}>Complete Profile</Text>
            </View>

            {/* Content Area with Overlay - Always visible */}
            <View style={styles.contentWrapper}>
              <View style={styles.contentContainer}>
                <View style={styles.overlay} />
                
                <View style={styles.content}>
                  {/* Activities Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Add 5 activities that you do regularly
                    </Text>
                    
                    <TextInput
                      style={styles.input}
                      value={activityInput}
                      onChangeText={setActivityInput}
                      onSubmitEditing={handleAddActivity}
                      placeholder="Activity (i.e. Dinner, Scrolling, Sports)"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      returnKeyType="done"
                      editable={!hasHatched}
                    />

                    {/* Activity Bubbles */}
                    {selectedActivities.length > 0 && (
                      <View 
                        style={styles.bubblesContainer}
                        onLayout={handleBubblesLayout}
                      >
                        {selectedActivities.map((activity, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.bubbleSelected}
                            onPress={() => handleRemoveActivity(activity)}
                            activeOpacity={0.7}
                            disabled={hasHatched}
                          >
                            <Text style={styles.bubbleTextSelected}>
                              {activity}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Hidden measurement container */}
                    <View 
                      style={styles.hiddenMeasurement}
                      key={measurementKey}
                    >
                      <View 
                        ref={tempMeasureRef}
                        style={styles.bubblesContainer}
                        collapsable={false}
                      >
                        {[...selectedActivities, activityInput.trim()].map((activity, index) => (
                          activity && (
                            <View key={index} style={styles.bubbleSelected}>
                              <Text style={styles.bubbleTextSelected}>
                                {activity}
                              </Text>
                            </View>
                          )
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Notification Frequency Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      How many notifications do you want per day?
                    </Text>
                    
                    <View style={styles.sliderWrapper}>
                      <Image
                        source={require('../../assets/emoji/turtle.png')}
                        style={styles.icon}
                        resizeMode="contain"
                      />
                      
                      <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={notificationFrequency}
                        onValueChange={setNotificationFrequency}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                        thumbTintColor="#FFFFFF"
                        disabled={hasHatched}
                      />
                      
                      <Image
                        source={require('../../assets/emoji/hare.png')}
                        style={styles.icon}
                        resizeMode="contain"
                      />
                    </View>
                    
                    <Text style={styles.sliderHint}>
                      This translates to {notificationFrequency} check-ins a day
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Egg/Animation/Platypus Section */}
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
              ) : hasHatched ? (
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

            {/* Message and Buttons Section */}
            {hasHatched ? (
              <View style={styles.hatchedFooter}>
                {/* Message */}
                <View style={styles.messageContainer}>
                  <Text style={styles.hatchedMessage}>
                    Check out your new friend in the Sanctuary!
                  </Text>
                </View>

                {/* Buttons */}
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
            ) : !isHatching && (
              /* Save/Hatch Button - Hide during animation */
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
            )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bubbleSelected: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bubbleTextSelected: {
    color: '#3D5E4A',
    fontSize: 14,
    fontWeight: '500',
  },
  hiddenMeasurement: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    width: '100%',
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  icon: {
    width: 28,
    height: 28,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderHint: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    fontWeight: '600',
    color: '#3D5E4A',
  },
  // Hatched Footer Styles
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