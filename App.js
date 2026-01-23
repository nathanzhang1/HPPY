import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AnimatedBackgroundProvider } from './src/context/AnimatedBackgroundContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import PhoneEntryScreen from './src/screens/PhoneEntryScreen';
import CreatePasswordScreen from './src/screens/CreatePasswordScreen';
import SignInScreen from './src/screens/SignInScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, hasCompletedOnboarding } = useAuth();

  console.log('Navigation State:', { 
    hasUser: !!user, 
    hasCompletedOnboarding 
  }); // Debug log

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
      }}
    >
      {!user ? (
        // User is not authenticated - show auth screens
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
          <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </>
      ) : !hasCompletedOnboarding ? (
        // User is authenticated but hasn't completed onboarding
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        // User is authenticated and has completed onboarding
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AnimatedBackgroundProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </AnimatedBackgroundProvider>
    </SafeAreaProvider>
  );
}