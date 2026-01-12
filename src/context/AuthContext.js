import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // In-memory user storage for demo

  const signIn = (email, password) => {
    // Find user in our in-memory storage
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser({ email: foundUser.email, phone: foundUser.phone });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const createAccount = (email, password, phone) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new user
    const newUser = { email, password, phone };
    setUsers([...users, newUser]);
    setUser({ email, phone });
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
