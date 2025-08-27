import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import WalletCard from './WalletCard';
import ServiceGrid from './ServiceGrid';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';
import ServerCard from './ServerCard';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
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
    </div>
  );
};

export default Dashboard;