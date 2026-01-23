import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Welcome!',
    description: 'Find what makes you happy.\nBuild your life around it.',
    // Import your logo asset here
    image: require('../../assets/onboarding/logo2.png'), // Your HPPY logo with gradient
    hasGlow: false,
    showBackButton: false,
    nextButtonText: 'Next',
  },
  {
    id: 2,
    title: 'Activity Tracking',
    description: "We'll send short check-ins throughout the day.\nTell us what you're doing and how it's going.",
    // Import your add button asset here
    image: require('../../assets/onboarding/add-button.png'), // The + button
    hasGlow: true,
    showBackButton: true,
    nextButtonText: 'Next',
  },
  {
    id: 3,
    title: 'Egg?',
    description: 'Hatch your first egg by filling out your profile.',
    // Import your egg asset here
    image: require('../../assets/onboarding/egg.png'), // The egg with spots
    hasGlow: true,
    showBackButton: true,
    nextButtonText: 'Next',
  },
  {
    id: 4,
    title: 'Keep it going!',
    description: 'Continue logging to hatch more eggs and\ndecorate your sanctuary.',
    // Import your scene and animals assets here
    sceneImage: require('../../assets/onboarding/sanctuary-scene.png'), // The room/sanctuary
    animals: [
      { image: require('../../assets/onboarding/animal-1.png'), position: 'bottom-left' }, // Brown animal
      { image: require('../../assets/onboarding/animal-2.png'), position: 'bottom-left-center' }, // Beige animal
      { image: require('../../assets/onboarding/animal-3.png'), position: 'bottom-center' }, // White/penguin animal
      { image: require('../../assets/onboarding/animal-4.png'), position: 'bottom-right' }, // Blue animal
    ],
    hasGlow: true,
    showBackButton: true,
    nextButtonText: "Let's go!",
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useAuth();
  const step = ONBOARDING_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderImage = () => {
    if (step.id === 4) {
      // Special rendering for the final screen with sanctuary and animals
      return (
        <View style={styles.finalSceneContainer}>
          {/* Glow PNG underneath */}
          {step.hasGlow && (
            <Image
              source={require('../../assets/onboarding/background-glow.png')}
              style={styles.glowImageLarge}
              resizeMode="contain"
            />
          )}
          
          {/* Sanctuary scene */}
          <Image
            source={step.sceneImage}
            style={styles.sanctuaryImage}
            resizeMode="contain"
          />
          
          {/* Animals positioned around the scene */}
          <View style={styles.animalsContainer}>
            {step.animals.map((animal, index) => (
              <Image
                key={index}
                source={animal.image}
                style={[
                  styles.animalImage,
                  animal.position === 'bottom-left-center' && styles.animalBottomLeftCenter,
                  animal.position === 'bottom-left' && styles.animalBottomLeft,
                  animal.position === 'bottom-center' && styles.animalBottomCenter,
                  animal.position === 'bottom-right' && styles.animalBottomRight,
                ]}
                resizeMode="contain"
              />
            ))}
          </View>
        </View>
      );
    }

    // Regular image rendering for steps 1-3
    return (
      <View style={styles.imageContainer}>
        {/* Glow PNG underneath the icon (steps 2 & 3) */}
        {step.hasGlow && (
          <Image
            source={require('../../assets/onboarding/background-glow.png')}
            style={styles.glowImage}
            resizeMode="contain"
          />
        )}
        
        <Image
          source={step.image}
          style={[
            step.id === 1 ? styles.logoImage : styles.iconImage,
          ]}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.content}>
        {/* Main content */}
        <View style={styles.mainContent}>
          {renderImage()}
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        </View>

        {/* Bottom section with pagination and buttons */}
        <View style={styles.bottomSection}>
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {ONBOARDING_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          {/* Navigation buttons */}
          <View style={styles.buttonContainer}>
            {step.showBackButton ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>{step.nextButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
    width: 200,
    height: 200,
  },
  glowImage: {
    position: 'absolute',
    width: 250,
    height: 250,
    top: 10,
    zIndex: 0,
  },
  glowImageLarge: {
    position: 'absolute',
    width: 400,
    height: 400,
    top: 80,
    zIndex: 0,
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 10,
    zIndex: 1,
  },
  iconImage: {
    width: 110,
    height: 110,
    marginBottom: 10,
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 15.5,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 20,
  },
  finalSceneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    position: 'relative',
    width: width * 0.85,
    height: height * 0.45,
  },
  sanctuaryImage: {
    width: '70%',
    height: '65%',
    borderRadius: 20,
    bottom: 20,
    zIndex: 1,
  },
  animalsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 60,
    zIndex: 2,
  },
  animalImage: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  animalBottomLeftCenter: {
    bottom: 10,
    left: 40,
  },
  animalBottomLeft: {
    bottom: -10,
    left: -10,
    zIndex: 2,
  },
  animalBottomCenter: {
    bottom: 10,
    left: '65%',
  },
  animalBottomRight: {
    bottom: -10,
    right: -10,
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#C9449A',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#C9449A',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C9449A',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#C9449A',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9449A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});