import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AnimatedBackgroundProvider } from './src/context/AnimatedBackgroundContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import PhoneEntryScreen from './src/screens/PhoneEntryScreen';
import CreatePasswordScreen from './src/screens/CreatePasswordScreen';
import SignInScreen from './src/screens/SignInScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileCompletionScreen from './src/screens/ProfileCompletionScreen';
import DataScreen from './src/screens/DataScreen';
import SanctuaryScreen from './src/screens/SanctuaryScreen';
import FittingRoomScreen from './src/screens/FittingRoomScreen';
import ShopScreen from './src/screens/ShopScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, hasCompletedOnboarding, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a splash screen component
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
          <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </>
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
          <Stack.Screen name="Data" component={DataScreen} />
          <Stack.Screen name="Sanctuary" component={SanctuaryScreen} />
          <Stack.Screen name="FittingRoom" component={FittingRoomScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Sigmar': require('./assets/fonts/Sigmar-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

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