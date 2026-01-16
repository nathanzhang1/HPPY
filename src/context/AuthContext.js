import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // In-memory user storage for demo

  const signIn = (phone, password) => {
    // ⚠️ SECURITY WARNING: This is for DEMO purposes only!
    // In production, NEVER store or compare passwords in plain text.
    
    // Normalize phone number (remove non-digits)
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Find user in our in-memory storage
    const foundUser = users.find(
      u => u.phone === normalizedPhone && u.password === password
    );

    if (foundUser) {
      setUser({ phone: foundUser.phone });
      return { success: true };
    }
    return { success: false, error: 'Invalid phone number or password' };
  };

  const createAccount = (phone, password) => {
    // ⚠️ SECURITY WARNING: This is for DEMO purposes only! 
    // In production, NEVER store passwords in plain text.
    
    // Normalize phone number
    const normalizedPhone = phone. replace(/\D/g, '');
    
    // Check if user already exists
    const existingUser = users.find(u => u.phone === normalizedPhone);
    if (existingUser) {
      return { success: false, error: 'An account with this phone number already exists' };
    }

    // Create new user
    const newUser = { phone: normalizedPhone, password };
    setUsers([...users, newUser]);
    setUser({ phone: normalizedPhone });
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, createAccount, signOut }}>
      {children}
    </AuthContext. Provider>
  );
};