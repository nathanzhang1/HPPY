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
import { validatePhone } from '../utils/validation';

const SIMULATED_NETWORK_DELAY = 500;

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setErrors({});

    const phoneValidation = validatePhone(phone);
    const newErrors = {};

    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation. message;
    }
    if (! password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = signIn(phone, password);
      setLoading(false);

      if (!result.success) {
        Alert.alert('Sign In Failed', result.error);
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
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles. keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formContainer}>
                <Text style={styles.title}>What's your phone number?</Text>
                
                <TextInput
                  style={styles. input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="eg. 1(234)567-8910"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="phone-pad"
                />
                {errors.phone ? <Text style={styles.errorText}>{errors. phone}</Text> : null}

                <Text style={styles.subtitle}>Enter your password</Text>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputWithButton}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.showButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.showButtonText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.signInButton, loading && styles.buttonDisabled]}
                onPress={handleSignIn}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.signInButtonText}>
                  {loading ?  'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.createContainer}
                onPress={() => navigation.navigate('PhoneEntry')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerText}>
                  Don't have an account? <Text style={styles.createLink}>Create one</Text>
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
    color:  '#FFFFFF',
    marginBottom: 16,
    // Subtle dark outline effect
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width:  0, height: 0 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize:  24,
    fontWeight:  '600',
    color: '#FFFFFF',
    marginTop:  24,
    marginBottom:  16,
    // Subtle dark outline effect
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius:  4,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color:  '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContainer: {
    position: 'relative',
  },
  inputWithButton: {
    backgroundColor:  'rgba(0, 0, 0, 0.15)',
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
    top:  14,
  },
  showButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width:  0, height: 0 },
    textShadowRadius: 3,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 20 :  30,
    alignItems:  'center',
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    paddingVertical:  14,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonDisabled: {
    opacity:  0.7,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  createContainer: {
    paddingVertical: 8,
  },
  footerText: {
    fontSize:  14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor:  'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  createLink:  {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});