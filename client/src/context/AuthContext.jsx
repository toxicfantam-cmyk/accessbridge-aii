import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAccessibility } from './AccessibilityContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('accessbridge_token'));
  const [loading, setLoading] = useState(true);
  const { updatePreference, announce } = useAccessibility();

  // Load user profile on mount if token is stored
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/profile');
        if (response.data?.user) {
          setUser(response.data.user);
          // Apply user's saved accessibility preferences
          if (response.data.user.preferences) {
            updatePreference(response.data.user.preferences);
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Failed to load user profile with token:', err.message);
        localStorage.removeItem('accessbridge_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, updatePreference]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('accessbridge_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);

      if (receivedUser.preferences) {
        updatePreference(receivedUser.preferences);
      }

      announce(`Welcome back, ${receivedUser.name}. Logged in successfully.`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      announce(`Error: ${message}`);
      return { success: false, message };
    }
  };

  const register = async (name, email, password, preferences) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        preferences
      });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('accessbridge_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);

      if (receivedUser.preferences) {
        updatePreference(receivedUser.preferences);
      }

      announce(`Account created successfully! Welcome to AccessBridge AI, ${receivedUser.name}.`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      announce(`Error: ${message}`);
      return { success: false, message };
    }
  };

  const demoLogin = async () => {
    try {
      const response = await api.post('/auth/demo');
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('accessbridge_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);

      if (receivedUser.preferences) {
        updatePreference(receivedUser.preferences);
      }

      announce('Logged in as Hackathon Demo Evaluator with accessible defaults.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Demo session failed to initialize.';
      announce(`Error: ${message}`);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessbridge_token');
    setToken(null);
    setUser(null);
    announce('Logged out successfully.');
  };

  const updateProfilePreferences = async (newPrefs) => {
    // Update local state first for instant response
    updatePreference(newPrefs);

    if (token) {
      try {
        const response = await api.put('/auth/preferences', { preferences: newPrefs });
        if (response.data?.preferences && user) {
          setUser({ ...user, preferences: response.data.preferences });
        }
      } catch (err) {
        console.warn('[AuthContext] Could not persist preferences to server:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateProfilePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
