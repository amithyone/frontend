import React, { useEffect, useState } from 'react';
import { Wallet, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';

const WalletCard: React.FC = () => {
  const { isDark } = useTheme();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try wallet stats first
        const stats = await apiService.getWalletStats();
        if (stats?.status === 'success' && (stats as any)?.data?.balance != null) {
          if (isMounted) setBalance((stats as any).data.balance as number);
          return;
        }

        // Fallback to user profile
        const profile = await apiService.getUserProfile();
        if (profile?.status === 'success' && (profile as any)?.data?.balance != null) {
          if (isMounted) setBalance((profile as any).data.balance as number);
          return;
        }

        // Final fallback to 0
        if (isMounted) setBalance(0);
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'Failed to load balance');
          setBalance(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBalance();
    return () => {
      isMounted = false;
    };
  }, []);

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
            {loading ? '₦…' : `₦${(balance ?? 0).toLocaleString()}`}
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