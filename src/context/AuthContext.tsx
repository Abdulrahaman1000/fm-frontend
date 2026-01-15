// ============================================
// Authentication Context
// ============================================

import { createContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, LoginCredentials, User } from "../types";
import { useNotification } from "../hooks/useNotification";
import { getToken, getUser, removeToken, removeUser, saveToken, saveUser } from "../utils/storage";
import authService from "../services/authService";

// import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AuthContextType, LoginCredentials, User } from '@/types';
// import authService from '@/services/authService';
// import { saveToken, getToken, removeToken, saveUser, getUser, removeUser } from '@/utils/storage';
// import { useNotification } from '@/hooks/useNotification';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      const storedUser = getUser<User>();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);

      // Save token and user data
      saveToken(response.token);
      setToken(response.token);

      // Create user object (you might want to decode JWT to get user data)
      const userData: User = {
        id: '1',
        username: credentials.username,
        role: 'admin',
        isActive: true,
      };

      saveUser(userData);
      setUser(userData);

      success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      error(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      removeToken();
      removeUser();
      setToken(null);
      setUser(null);
      success('Logged out successfully');
      navigate('/login');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;