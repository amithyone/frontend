import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const WalletCard: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  // Get wallet balance from auth context
  const balance = user?.balance || 0;

  return (
    <div className={`rounded-2xl p-6 text-white shadow-xl transition-all duration-200 ${
      isDark 
        ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
        : 'bg-gradient-to-r from-oxford-blue to-oxford-blue-dark'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-blue-200'
          }`}>Wallet Balance</p>
          <h2 className="text-3xl font-bold">
            ₦{balance.toLocaleString()}
          </h2>
          <p className={`text-sm mt-1 ${
            isDark ? 'text-gray-300' : 'text-blue-200'
          }`}>Available for VTU services</p>
        </div>
        <div className={`p-3 rounded-xl ${
          isDark ? 'bg-gray-700' : 'bg-white bg-opacity-20'
        }`}>
          <Wallet className="h-8 w-8" />
        </div>
      </div>
      
      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105">
        <Plus className="h-5 w-5" />
        <span>Fund Wallet</span>
      </button>
    </div>
  );
};

export default WalletCard;
