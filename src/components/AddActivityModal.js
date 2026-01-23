import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const RECENT_ACTIVITIES = [
  'Date', 'Meeting', 'Scrolling', 'Working',
  'Eating', 'Coffee', 'Shopping', 'Cooking',
  'Working Out', 'Jogging', 'Reading', 'Texting',
  'Morning Routine', 'TV', 'Bedtime Routine',
];

export default function AddActivityModal({ visible, onClose, onSave }) {
  const [activity, setActivity] = useState('');
  const [happiness, setHappiness] = useState(50);
  const [showSlider, setShowSlider] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setShowSlider(false);
      setActivity('');
      setHappiness(50);
      // Slide up animation
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleActivitySelect = (selectedActivity) => {
    setActivity(selectedActivity);
    setShowSlider(true);
  };

  const handleClearActivity = () => {
    setActivity('');
    setShowSlider(false);
  };

  const handleSave = () => {
    if (activity.trim()) {
      onSave(activity, happiness);
      setActivity('');
      setHappiness(50);
      setShowSlider(false);
    }
  };

  const handleTextInputSubmit = () => {
    if (activity.trim()) {
      setShowSlider(true);
      Keyboard.dismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {/* Content */}
              <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>
                  {showSlider ? 'What are you up to?' : 'What are you up to?'}
                </Text>

                {/* Activity Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={activity}
                    onChangeText={setActivity}
                    placeholder="Activity (ie Dinner, Social Media, Sports)"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    onSubmitEditing={handleTextInputSubmit}
                    returnKeyType="done"
                  />
                  {activity.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={handleClearActivity}
                    >
                      <View style={styles.clearButtonCircle}>
                        <Text style={styles.clearButtonText}>✕</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Recent Activities */}
                <Text style={styles.sectionTitle}>RECENT ACTIVITIES</Text>
                <View style={styles.activitiesGrid}>
                  {RECENT_ACTIVITIES.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.activityChip,
                        activity === item && styles.activityChipSelected,
                      ]}
                      onPress={() => handleActivitySelect(item)}
                    >
                      <Text
                        style={[
                          styles.activityChipText,
                          activity === item && styles.activityChipTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Happiness Slider */}
                {showSlider && (
                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderTitle}>How are you feeling about it?</Text>
                    <View style={styles.sliderWrapper}>
                      {/* Sad emoji PNG */}
                      <Image
                        source={require('../../assets/emoji/sad.png')}
                        style={styles.emojiIcon}
                        resizeMode="contain"
                      />
                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={happiness}
                        onValueChange={setHappiness}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                        thumbTintColor="#FFFFFF"
                      />
                      {/* Happy emoji PNG */}
                      <Image
                        source={require('../../assets/emoji/happy.png')}
                        style={styles.emojiIcon}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                )}

                {/* Save Button */}
                {showSlider && (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#C9449A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  safeArea: {
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  keyboardView: {
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
  content: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 10,
  },
  clearButtonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  activityChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activityChipSelected: {
    backgroundColor: '#FFFFFF',
  },
  activityChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  activityChipTextSelected: {
    color: '#C9449A',
  },
  sliderContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  emojiIcon: {
    width: 22,
    height: 22,
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});