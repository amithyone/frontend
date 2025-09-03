import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import WalletCard from './WalletCard';
import ServiceGrid from './ServiceGrid';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';
import ServerCard from './ServerCard';
import Navigation from './Navigation';
import BottomNavigation from './BottomNavigation';
import RecentDeposits from './RecentDeposits';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'services'>('home');
  const [bottomCurrentPage, setBottomCurrentPage] = useState<'dashboard' | 'services' | 'wallet' | 'transactions' | 'settings'>('dashboard');

  const renderContent = () => {
    switch (bottomCurrentPage) {
      case 'dashboard':
        return (
          <>
            <WalletCard />
            <ServiceGrid />
            <QuickActions />
            <ServerCard />
            <RecentTransactions />
          </>
        );
      case 'services':
        return (
          <>
            <ServiceGrid />
            <QuickActions />
          </>
        );
      case 'wallet':
        return (
          <>
            <WalletCard />
            <RecentDeposits />
          </>
        );
      case 'transactions':
        return (
          <>
            <RecentTransactions />
          </>
        );
      case 'settings':
        return (
          <>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-sm opacity-80">Settings page coming soon.</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen p-4 pb-24 space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Top Navigation */}
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {renderContent()}

      {/* Bottom Navigation */}
      <BottomNavigation currentPage={bottomCurrentPage} setCurrentPage={setBottomCurrentPage} />
    </div>
  );
};

export default Dashboard;