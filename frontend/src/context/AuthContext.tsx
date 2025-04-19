import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginApi, getUserProfile } from '../services/api';

// Types
interface User {
  id: number;
  username: string;
  fullName: string;
  qualification?: string;
  dob?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: () => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if token exists and fetch user data
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await getUserProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Token might be invalid, clear it
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (username: string, password: string): Promise<User> => {
    try {
      setError(null);
      const response = await loginApi(username, password);
      const { token: newToken, user: userData } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return userData;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 