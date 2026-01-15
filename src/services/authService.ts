// ============================================
// Authentication Service
// ============================================

import type { LoginCredentials, LoginResponse } from '../types';
import api, { handleApiError } from './api';


/**
 * Login admin user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Logout admin user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } catch (error) {
    // Even if logout fails on server, we still clear local data
    console.error('Logout error:', error);
  }
};

const authService = {
  login,
  logout,
};

export default authService;