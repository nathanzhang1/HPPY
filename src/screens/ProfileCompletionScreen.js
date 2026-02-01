import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

export default function ProfileCompletionScreen({ navigation }) {
  const [activityInput, setActivityInput] = useState('');
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notificationFrequency, setNotificationFrequency] = useState(5);

  const handleAddActivity = () => {
    if (activityInput.trim() && activities.length < 10) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput('');
      Keyboard.dismiss();
    }
  };

  const handleToggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else if (selectedActivities.length < 5) {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleSave = () => {
    console.log('Selected activities:', selectedActivities);
    console.log('Notification frequency:', notificationFrequency);
    navigation.goBack();
  };

  const progress = (selectedActivities.length / 5) * 100;

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

            {/* Content Area with Overlay - Dynamic Height */}
            <View style={styles.contentWrapper}>
              <View style={styles.contentContainer}>
                <View style={styles.overlay} />
                
                <View style={styles.content}>
                  {/* Activities Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Add and select 5 activities that you do regularly
                    </Text>
                    
                    <TextInput
                      style={styles.input}
                      value={activityInput}
                      onChangeText={setActivityInput}
                      onSubmitEditing={handleAddActivity}
                      placeholder="Activity (i.e. Dinner, Scrolling, Sports)"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      returnKeyType="done"
                    />

                    {/* Activity Bubbles */}
                    {activities.length > 0 && (
                      <View style={styles.bubblesContainer}>
                        {activities.map((activity, index) => {
                          const isSelected = selectedActivities.includes(activity);
                          return (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.bubble,
                                isSelected && styles.bubbleSelected
                              ]}
                              onPress={() => handleToggleActivity(activity)}
                              activeOpacity={0.7}
                            >
                              <Text style={[
                                styles.bubbleText,
                                isSelected && styles.bubbleTextSelected
                              ]}>
                                {activity}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
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

            {/* Egg and Progress Bar - Outside Overlay */}
            <View style={styles.bottomSection}>
              <Image
                source={require('../../assets/home/egg-icon.png')}
                style={styles.eggIcon}
                resizeMode="contain"
              />
              <View style={styles.progressBarContainer}>
                <TempProgressBar progress={progress} width={width - 140} height={20} />
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
    width: 400,
    height: 900,
    top: -30,
  },
  headerTitle: {
    position: 'absolute',
    top: 37,
    fontFamily: 'Sigmar',
    fontSize: 28,
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
    borderRadius: 16,
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
  bubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bubbleSelected: {
    backgroundColor: '#FFFFFF',
  },
  bubbleText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  bubbleTextSelected: {
    color: '#3D5E4A',
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
  },
  eggIcon: {
    width: 115,
    height: 115,
    marginBottom: 12,
  },
  progressBarContainer: {
    alignItems: 'center',
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
    color: '#3D5E4A',
  },
});