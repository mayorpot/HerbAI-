// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  healthProfile: {
    allergies: string[];
    medicalHistory: string[];
    medications: string[];
    preferences: {
      preferredLanguage: string;
      measurementSystem: string;
    };
  };
  lastLogin?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  healthProfile?: {
    allergies: string[];
    medicalHistory: string[];
    medications: string[];
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token and get user data
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user: userData, token: userToken } = data.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user: newUser, token: userToken } = data.data;
      
      setUser(newUser);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUserProfile = async (profile: Partial<User>) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(data.data.user);
      
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};