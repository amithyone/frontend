import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import WalletCard from './WalletCard';
import ServiceGrid from './ServiceGrid';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';
import Transactions from './Transactions';
import ServerCard from './ServerCard';
import Navigation from './Navigation';
import BottomNavigation from './BottomNavigation';
import Inbox from './Inbox';
import TopUpModal from './TopUpModal';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState<'home' | 'services'>('home');
  const [bottomCurrentPage, setBottomCurrentPage] = useState<'dashboard' | 'inbox' | 'wallet' | 'transactions' | 'settings'>('dashboard');
  const [showTopUp, setShowTopUp] = useState(false);

  const renderContent = () => {
    switch (bottomCurrentPage) {
      case 'dashboard':
        return (
          <>
            <WalletCard onFund={() => setShowTopUp(true)} />
            <ServiceGrid />
            <QuickActions />
            <ServerCard />
            <RecentTransactions />
          </>
        );
      case 'inbox':
        return <Inbox />;
      case 'wallet':
        return (
          <>
            <WalletCard onFund={() => setShowTopUp(true)} />
          </>
        );
      case 'transactions':
        return <Transactions />;
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

      <TopUpModal
        isOpen={showTopUp}
        onClose={() => setShowTopUp(false)}
        onCredited={() => {
          // Optionally refresh other widgets on credit
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavigation currentPage={bottomCurrentPage} setCurrentPage={setBottomCurrentPage} />
    </div>
  );
};

export default Dashboard;