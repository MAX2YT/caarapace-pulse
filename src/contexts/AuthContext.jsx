import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, getCurrentUser, setCurrentUser, clearCurrentUser } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any existing session on app start
    clearCurrentUser();

    // Set authentication state to false
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      const users = getUsers();
      const foundUser = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role
      );

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        setCurrentUser(foundUser);
        return { success: true };
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearCurrentUser();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};