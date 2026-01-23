import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const signIn = (phone, password) => {
    const normalizedPhone = phone.replace(/\D/g, '');
    const foundUser = users.find(
      u => u.phone === normalizedPhone && u.password === password
    );

    if (foundUser) {
      setUser({ phone: foundUser.phone });
      setHasCompletedOnboarding(true); // Existing users skip onboarding
      return { success: true };
    }
    return { success: false, error: 'Invalid phone number or password' };
  };

  const createAccount = (phone, password) => {
    const normalizedPhone = phone.replace(/\D/g, '');
    const existingUser = users.find(u => u.phone === normalizedPhone);
    
    if (existingUser) {
      return { success: false, error: 'An account with this phone number already exists' };
    }

    const newUser = { phone: normalizedPhone, password };
    setUsers([...users, newUser]);
    setUser({ phone: normalizedPhone });
    setHasCompletedOnboarding(false); // New users MUST go through onboarding
    return { success: true };
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const signOut = () => {
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};