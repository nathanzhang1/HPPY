import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const existingUser = await api.checkAuth();
      if (existingUser) {
        setUser(existingUser);
        setHasCompletedOnboarding(true); // Existing users skip onboarding
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (phone, password) => {
    try {
      const data = await api.login(phone, password);
      setUser(data.user);
      setHasCompletedOnboarding(true); // Existing users skip onboarding
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createAccount = async (phone, password) => {
    try {
      const data = await api.register(phone, password);
      setUser(data.user);
      setHasCompletedOnboarding(false); // New users MUST go through onboarding
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const signOut = async () => {
    await api.logout();
    setUser(null);
    setHasCompletedOnboarding(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      createAccount, 
      signOut, 
      hasCompletedOnboarding,
      completeOnboarding,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};