import React from 'react';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: any) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  currentPage, 
  setCurrentPage, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Mobile Header */}
      <header className={`p-4 sticky top-0 z-50 shadow-lg transition-colors duration-200 ${
        isDark ? 'bg-gray-800 text-white' : 'bg-oxford-blue text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-oxford-blue-light rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="FaddedSMS" className="h-8 w-8" />
              <span className="text-sm font-semibold whitespace-nowrap">FaddedSMS v2</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-oxford-blue-light dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="p-2 hover:bg-oxford-blue-light rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search services..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-700 text-white placeholder-gray-400' 
                : 'bg-oxford-blue-light text-white placeholder-gray-300'
            }`}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;