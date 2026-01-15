// ============================================
// Main Layout Component - COMPLETE
// ============================================

import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  X,
  Radio,
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';
import Navbar from './Navbar';
// import { useAuth } from '@/hooks/useAuth';
// import { cn } from '@/utils/helpers';
// import { ROUTES } from '@/utils/constants';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Clients',
    path: ROUTES.CLIENTS,
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Rate Card',
    path: ROUTES.RATES,
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    name: 'Invoices',
    path: ROUTES.INVOICES,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Payments',
    path: ROUTES.PAYMENTS,
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    name: 'Settings',
    path: ROUTES.SETTINGS,
    icon: <Settings className="h-5 w-5" />,
  },
];

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />

          {/* Mobile Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 lg:hidden flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Radio className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">Emirate FM</h1>
                  <p className="text-xs text-gray-400">98.5 FM</p>
                </div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )
                  }
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Info & Logout - Mobile */}
            <div className="px-4 py-4 border-t border-gray-800 space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg">
                <div className="bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center font-semibold">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.username || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.role || 'Administrator'}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  toggleMobileMenu();
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-800">
              <p className="text-xs text-gray-400 text-center">
                © 2026 Emirate FM Radio Station
              </p>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={toggleMobileMenu} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;