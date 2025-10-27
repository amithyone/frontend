import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { 
  Home, 
  Wallet, 
  History, 
  Settings,
  Inbox,
  MessageCircle
} from 'lucide-react';

interface BottomNavigationProps {
  currentPage: 'dashboard' | 'inbox' | 'wallet' | 'transactions' | 'settings' | 'support';
  setCurrentPage: (page: 'dashboard' | 'inbox' | 'wallet' | 'transactions' | 'settings' | 'support') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setCurrentPage }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [inboxUnreadCount, setInboxUnreadCount] = useState(0);
  const [supportUnreadCount, setSupportUnreadCount] = useState(0);
  
  // Debug: Force show badges for testing (remove in production)
  // setInboxUnreadCount(2);
  // setSupportUnreadCount(1);
  
  // Temporary test - force show badges (REMOVED - testing complete)

  useEffect(() => {
    loadUnreadCounts();
    // Refresh unread counts every 30 seconds
    const interval = setInterval(loadUnreadCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh unread counts when navigating away from inbox or support
  useEffect(() => {
    if (currentPage !== 'inbox' && currentPage !== 'support') {
      loadUnreadCounts();
    }
  }, [currentPage]);

  const loadUnreadCounts = async () => {
    try {
      // Load inbox unread count
      const inboxResponse = await apiService.getInboxUnreadCount();
      console.log('Inbox unread response:', inboxResponse);
      if (inboxResponse.success && inboxResponse.data) {
        const count = inboxResponse.data.unread_count || 0;
        console.log('Setting inbox unread count:', count);
        setInboxUnreadCount(count);
      }
    } catch (error) {
      console.error('Failed to load inbox unread count:', error);
    }

    try {
      // Load support unread count
      const token = localStorage.getItem('auth_token');
      const supportResponse = await fetch('https://api.fadsms.com/api/support/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const supportData = await supportResponse.json();
      console.log('Support unread response:', supportData);
      
      if (supportData.status === 'success' && supportData.data) {
        const count = supportData.data.unread_count || 0;
        console.log('Setting support unread count:', count);
        setSupportUnreadCount(count);
      }
    } catch (error) {
      console.error('Failed to load support unread count:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Home', icon: Home },
    { id: 'inbox', name: 'Inbox', icon: Inbox },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'transactions', name: 'History', icon: History },
    { id: 'support', name: 'Support', icon: MessageCircle },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t px-4 py-1 z-50 transition-colors duration-200 ${
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
              onClick={() => {
                if (item.id === 'dashboard') {
                  navigate('/dashboard');
                  setCurrentPage('dashboard');
                  return;
                }
                if (item.id === 'inbox') {
                  navigate('/dashboard#inbox');
                  setCurrentPage('inbox');
                  return;
                }
                setCurrentPage(item.id as any);
              }}
              className={`flex flex-col items-center space-y-0.5 py-1.5 px-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? isDark ? 'text-blue-400' : 'text-oxford-blue'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 relative ${
                isActive ? (isDark ? 'bg-orange-900 bg-opacity-50' : 'bg-orange-100') : ''
              }`}>
                <Icon className={`h-5 w-5 ${
                  isActive ? 'text-orange-500' : 'text-current'
                }`} />
                {/* Unread notification badge for inbox */}
                {item.id === 'inbox' && inboxUnreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold shadow-lg">
                    {inboxUnreadCount > 99 ? '99+' : inboxUnreadCount}
                  </div>
                )}
                {/* Unread notification badge for support */}
                {item.id === 'support' && supportUnreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold shadow-lg">
                    {supportUnreadCount > 99 ? '99+' : supportUnreadCount}
                  </div>
                )}
                {/* Debug info removed */}
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