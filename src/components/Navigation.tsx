import React, { useState } from 'react';
import { Shield, Smartphone, Settings, Search, Sun, Moon, LogOut, User, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useBranding } from '../contexts/BrandingContext';

interface NavigationProps {
  currentPage: 'home' | 'services';
  setCurrentPage: (page: 'home' | 'services') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const { isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const { branding } = useBranding();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center space-x-2">
            {branding?.logo_url ? (
              <img src={branding.logo_url} alt={branding.brand_name} className="h-8 w-auto max-w-[120px]" />
            ) : (
              <>
                <img src="/logo.svg" alt={branding?.brand_name || 'FaddedSMS'} className="h-8 w-8" />
                <span className="text-sm font-semibold whitespace-nowrap">{branding?.brand_name || 'FaddedSMS'} v2</span>
              </>
            )}
          </div>

          {/* Center - Navigation Tabs (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'home'
                  ? isDark 
                    ? 'bg-blue-900 text-blue-300' 
                    : 'bg-blue-100 text-blue-700'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Quick Verify</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('services')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'services'
                  ? isDark 
                    ? 'bg-blue-900 text-blue-300' 
                    : 'bg-blue-100 text-blue-700'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Pro Services</span>
            </button>
          </div>

          {/* Right side - Search, Theme Toggle, User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Quick Search - Always visible */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-8 pr-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-32 sm:w-48`}
                />
              </div>
            </form>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-yellow-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* User Menu - Hidden on mobile (shown in dropdown) */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <User className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user?.name || user?.email || 'User'}
                </span>
              </div>
              
              <button
                onClick={logout}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`px-2 pt-2 pb-3 space-y-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
              {/* Mobile Navigation Items */}
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'home'
                    ? isDark 
                      ? 'bg-blue-900 text-blue-300' 
                      : 'bg-blue-100 text-blue-700'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Quick Verify</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentPage('services');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'services'
                    ? isDark 
                      ? 'bg-blue-900 text-blue-300' 
                      : 'bg-blue-100 text-blue-700'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Pro Services</span>
              </button>

              {/* Mobile User Menu */}
              <div className={`pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <User className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.name || user?.email || 'User'}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                      : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;