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
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { validatePassword } from '../utils/validation';

const SIMULATED_NETWORK_DELAY = 500;

export default function CreatePasswordScreen({ navigation, route }) {
  const { phone } = route.params;
  const { createAccount } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = () => {
    setErrors({});

    const passwordValidation = validatePassword(password);
    const newErrors = {};

    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object. keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = createAccount(phone, password);
      setLoading(false);

      if (! result.success) {
        Alert.alert('Account Creation Failed', result.error);
      }
    }, SIMULATED_NETWORK_DELAY);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        <AnimatedBackground blur={true} blurIntensity={80} />
        
        <SafeAreaView style={styles.content} edges={['top', 'left', 'right']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ?  'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles. formContainer}>
                <Text style={styles.title}>Create a password</Text>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles. input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles. showButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.showButtonText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password ?  <Text style={styles.errorText}>{errors.password}</Text> : null}

                <Text style={styles.subtitle}>Confirm your password</Text>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.showButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.showButtonText}>
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                <View style={styles.requirements}>
                  <Text style={styles.requirementText}>• At least 8 characters</Text>
                  <Text style={styles.requirementText}>• One uppercase & lowercase letter</Text>
                  <Text style={styles.requirementText}>• One number & special character</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.createButton, loading && styles.buttonDisabled]}
                onPress={handleCreateAccount}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles. createButtonText}>
                  {loading ? 'Creating...' :  'Create Account'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.signInContainer}
                onPress={() => navigation.navigate('SignIn')}
                activeOpacity={0.7}
              >
                <Text style={styles. footerText}>
                  Already have an account? <Text style={styles.signInLink}>Sign In</Text>
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
  content:  {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    // Subtle dark outline effect
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
    // Subtle dark outline effect
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 60,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  showButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  showButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  errorText:  {
    color: '#FF6B6B',
    fontSize:  14,
    marginTop:  8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius:  3,
  },
  requirements: {
    marginTop:  20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  requirementText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  footer: {
    paddingHorizontal:  32,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#FFFFFF',
    borderRadius:  25,
    paddingVertical: 14,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity:  0.7,
  },
  createButtonText: {
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