// ============================================
// Auth Hook
// ============================================

import { useContext } from 'react';
import type { AuthContextType } from '../types';
import AuthContext from '../context/AuthContext';
// import AuthContext from '@/context/AuthContext';
// import { AuthContextType } from '@/types';

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}