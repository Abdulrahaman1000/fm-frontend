// ============================================
// Local Storage Utilities
// ============================================

import { STORAGE_KEYS } from './constants';

/**
 * Save data to localStorage
 */
export const saveToStorage = (key: string, value: any): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Get data from localStorage
 */
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all localStorage
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Save auth token
 */
export const saveToken = (token: string): void => {
  saveToStorage(STORAGE_KEYS.TOKEN, token);
};

/**
 * Get auth token
 */
export const getToken = (): string | null => {
  return getFromStorage<string>(STORAGE_KEYS.TOKEN);
};

/**
 * Remove auth token
 */
export const removeToken = (): void => {
  removeFromStorage(STORAGE_KEYS.TOKEN);
};

/**
 * Save user data
 */
export const saveUser = (user: any): void => {
  saveToStorage(STORAGE_KEYS.USER, user);
};

/**
 * Get user data
 */
export const getUser = <T>(): T | null => {
  return getFromStorage<T>(STORAGE_KEYS.USER);
};

/**
 * Remove user data
 */
export const removeUser = (): void => {
  removeFromStorage(STORAGE_KEYS.USER);
};