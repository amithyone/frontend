import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  Shield, 
  Wallet, 
  History, 
  Settings
} from 'lucide-react';

interface BottomNavigationProps {
  currentPage: 'dashboard' | 'services' | 'wallet' | 'transactions' | 'settings';
  setCurrentPage: (page: 'dashboard' | 'services' | 'wallet' | 'transactions' | 'settings') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setCurrentPage }) => {
  const { isDark } = useTheme();

  const navItems = [
    { id: 'dashboard', name: 'Home', icon: Home },
    { id: 'services', name: 'Services', icon: Shield },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'transactions', name: 'History', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t px-4 py-2 z-50 transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as any)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? isDark ? 'text-blue-400' : 'text-oxford-blue'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${
                isActive ? (isDark ? 'bg-orange-900 bg-opacity-50' : 'bg-orange-100') : ''
              }`}>
                <Icon className={`h-5 w-5 ${
                  isActive ? 'text-orange-500' : 'text-current'
                }`} />
              </div>
              <span className={`text-xs font-medium ${
                isActive ? (isDark ? 'text-blue-400' : 'text-oxford-blue') : 'text-current'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;