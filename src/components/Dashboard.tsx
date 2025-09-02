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

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'services'>('home');
  const [bottomCurrentPage, setBottomCurrentPage] = useState<'dashboard' | 'services' | 'wallet' | 'transactions' | 'settings'>('dashboard');

  return (
    <div className={`p-4 space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Top Navigation */}
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Wallet Card */}
      <WalletCard />
      
      {/* Service Grid */}
      <ServiceGrid />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Server Network Card */}
      <ServerCard />
      
      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Bottom Navigation */}
      <BottomNavigation currentPage={bottomCurrentPage} setCurrentPage={setBottomCurrentPage} />
    </div>
  );
};

export default Dashboard;