import React from 'react';
import { Shield, Smartphone, Settings } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'services';
  setCurrentPage: (page: 'home' | 'services') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VerifyNg</span>
            <span className="text-sm text-green-600 font-medium">+ VTU</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'home'
                  ? 'bg-blue-100 text-blue-700'
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
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Pro Services</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;