// ============================================
// Sidebar Component - COMPLETE
// ============================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  CreditCard,
  Settings,
  Radio,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';
// import { cn } from '@/utils/helpers';
// import { ROUTES } from '@/utils/constants';
// import { useAuth } from '@/hooks/useAuth';

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

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Radio className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg">Emirate FM</h1>
          <p className="text-xs text-gray-400">98.5 FM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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

      {/* User Info & Logout */}
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
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors group"
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
  );
};

export default Sidebar;