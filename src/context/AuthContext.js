import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // In-memory user storage for demo

  const signIn = (email, password) => {
    // ⚠️ SECURITY WARNING: This is for DEMO purposes only!
    // In production, NEVER store or compare passwords in plain text.
    // Use proper authentication with a secure backend API that handles:
    // - Password hashing (bcrypt, Argon2, etc.)
    // - Salting
    // - Secure token generation (JWT)
    // - HTTPS communication
    
    // Normalize email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();
    
    // Find user in our in-memory storage
    const foundUser = users.find(
      u => u.email === normalizedEmail && u.password === password
    );

    if (foundUser) {
      setUser({ email: foundUser.email, phone: foundUser.phone });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const createAccount = (email, password, phone) => {
    // ⚠️ SECURITY WARNING: This is for DEMO purposes only!
    // In production, NEVER store passwords in plain text.
    // Always use a secure backend API with proper password hashing.
    
    // Normalize email to lowercase to prevent duplicate accounts with different cases
    const normalizedEmail = email.toLowerCase();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === normalizedEmail);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new user
    const newUser = { email: normalizedEmail, password, phone };
    setUsers([...users, newUser]);
    setUser({ email: normalizedEmail, phone });
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, createAccount, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
