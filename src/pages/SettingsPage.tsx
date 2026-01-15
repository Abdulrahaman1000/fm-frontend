// ============================================
// Settings Page (Placeholder)
// ============================================

import React from 'react';
import Header from '../components/layout/Header';
// import Header from '@/components/layout/Header';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <Header 
        title="Settings" 
        subtitle="Configure station details and preferences"
      />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Settings coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;