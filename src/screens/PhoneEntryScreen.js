import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AnimatedBackground from '../components/AnimatedBackground';
import { validatePhone } from '../utils/validation';

export default function PhoneEntryScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      setError(phoneValidation.message);
      return;
    }

    navigation.navigate('CreatePassword', { phone });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        <AnimatedBackground blur={true} blurIntensity={80} />
        
        <SafeAreaView style={styles.content} edges={['top', 'left', 'right']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles. keyboardView}
          >
            <View style={styles.formContainer}>
              <Text style={styles.title}>What's your phone number? </Text>
              
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="eg.  1(234)567-8910"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="phone-pad"
                autoFocus
                onSubmitEditing={handleNext}
                returnKeyType="next"
              />
              
              {error ?  <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.signInContainer}
                onPress={() => navigation.navigate('SignIn')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerText}>
                  Already have an account?  <Text style={styles.signInLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    // Subtle dark outline effect
    textShadowColor:  'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  input:  {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical:  14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  errorText:  {
    color: '#FF6B6B',
    fontSize:  14,
    marginTop:  8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  footer:  {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor:  '#FFFFFF',
    borderRadius:  25,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C9449A',
  },
  signInContainer: {
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  signInLink: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});