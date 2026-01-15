// ============================================
// Navbar Component - COMPLETE
// ============================================

import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        {/* Center: Page Title */}
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <h2 className="text-lg font-semibold text-gray-900 lg:ml-4">
            Radio Station Invoicing System
          </h2>
        </div>

        {/* Right: Notifications */}
        <div className="flex items-center gap-2">
          <button 
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;