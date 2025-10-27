import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import WalletCarousel from './WalletCarousel';
import ServiceGrid from './ServiceGrid';
import QuickActions from './QuickActions';
import AdvertisementSection from './AdvertisementSection';
import RecentTransactions from './RecentTransactions';
import Transactions from './Transactions';
import ServerCard from './ServerCard';
import Navigation from './Navigation';
import BottomNavigation from './BottomNavigation';
import Inbox from './Inbox';
import TopUpModal from './TopUpModal';
import Wallet from './Wallet';
import Settings from './Settings';
import Support from './Support';
import Referral from './Referral';
import { notificationPoller } from '../services/notificationPoller';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState<'home' | 'services'>('home');
  const [bottomCurrentPage, setBottomCurrentPage] = useState<'dashboard' | 'inbox' | 'wallet' | 'transactions' | 'settings' | 'support' | 'referral'>('dashboard');
  const [showTopUp, setShowTopUp] = useState(false);

  // Start notification polling when dashboard mounts
  useEffect(() => {
    // Start polling for notifications
    notificationPoller.start();

    // Cleanup on unmount
    return () => {
      notificationPoller.stop();
    };
  }, []);

  const renderContent = () => {
    switch (bottomCurrentPage) {
      case 'dashboard':
        return (
          <>
            <WalletCarousel onFund={() => setShowTopUp(true)} />
            <ServiceGrid />
            <QuickActions />
            <AdvertisementSection />
            <ServerCard />
            <RecentTransactions />
          </>
        );
      case 'inbox':
        return <Inbox />;
      case 'wallet':
        return <Wallet />;
      case 'transactions':
        return <Transactions />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      case 'referral':
        return <Referral />;
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