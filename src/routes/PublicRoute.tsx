// ============================================
// Public Route Component (Redirect if authenticated)
// ============================================

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import { useAuth } from '@/hooks/useAuth';

const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;