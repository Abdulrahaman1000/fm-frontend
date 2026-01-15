// ============================================
// Application Routes Configuration
// ============================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
// import Layout from '@/components/layout/Layout';

// Pages
// import LoginPage from '@/pages/auth/LoginPage';
// import DashboardPage from '@/pages/DashboardPage';
// import ClientsPage from '@/pages/ClientsPage';
// import RatesPage from '@/pages/RatesPage';
// import InvoicesPage from '@/pages/InvoicesPage';
// import PaymentsPage from '@/pages/PaymentsPage';
// import SettingsPage from '@/pages/SettingsPage';
// import NotFoundPage from '@/pages/NotFoundPage';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/auth/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import SettingsPage from '../pages/SettingsPage';
import PaymentsPage from '../pages/PaymentsPage';
import InvoicesPage from '../pages/InvoicesPage';
import RatesPage from '../pages/RatesPage';
import ClientsPage from '../pages/ClientsPage';
import DashboardPage from '../pages/DashboardPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/rates" element={<RatesPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;