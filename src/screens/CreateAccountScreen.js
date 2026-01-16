import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail, validatePassword, validatePhone } from '../utils/validation';

// Simulated network delay for demo purposes
const SIMULATED_NETWORK_DELAY = 500;

export default function CreateAccountScreen({ navigation }) {
  const { createAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    // Reset errors
    setErrors({});

    // Validate all inputs
    const emailValidation = validateEmail(email);
    const phoneValidation = validatePhone(phone);
    const passwordValidation = validatePassword(password);

    const newErrors = {};
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message;
    }
    if (!phoneValidation. valid) {
      newErrors.phone = phoneValidation.message;
    }
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Attempt to create account
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = createAccount(email, password, phone);
      setLoading(false);

      if (!result.success) {
        Alert.alert('Account Creation Failed', result.error);
      } else {
        Alert.alert('Success', 'Your account has been created successfully!');
      }
    }, SIMULATED_NETWORK_DELAY);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles. subtitle}>Join us today!</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors. email}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="(123) 456-7890"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password must contain:</Text>
              <Text style={styles.requirementItem}>• At least 8 characters</Text>
              <Text style={styles.requirementItem}>• One uppercase letter (A-Z)</Text>
              <Text style={styles.requirementItem}>• One lowercase letter (a-z)</Text>
              <Text style={styles. requirementItem}>• One number (0-9)</Text>
              <Text style={styles.requirementItem}>• One special character (!@#$%^&*)</Text>
            </View>

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleCreateAccount}
              loading={loading}
              disabled={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Button
                title="Sign In"
                onPress={() => navigation.navigate('SignIn')}
                variant="secondary"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex:  1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize:  16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  passwordRequirements: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize:  12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  footer:  {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize:  14,
    color: '#666',
    marginBottom: 12,
  },
});