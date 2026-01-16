import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AnimatedBackground from '../components/AnimatedBackground';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated Morphing Background */}
      <AnimatedBackground />

      {/* Content */}
      <SafeAreaView style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>HPPY</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('CreateAccount')}
            activeOpacity={0.8}
          >
            <Text style={styles.createAccountText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.buttonSpacing} />

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.8}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:  1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonSpacing: {
    height: 16,
  },
  createAccountButton: {
    backgroundColor: '#FFFFFF',
    borderRadius:  25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C44569',
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});