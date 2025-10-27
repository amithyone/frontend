import React from 'react';
import { 
  Home, 
  Shield, 
  Wallet, 
  History, 
  Settings, 
  X,
  Phone,
  CreditCard,
  Users
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'services', name: 'Services', icon: Shield },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'transactions', name: 'Transactions', icon: History },
    { id: 'referral', name: '💰 Referral Program', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-oxford-blue text-white z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="FaddedSMS" className="h-8 w-8" />
              <span className="text-sm font-semibold whitespace-nowrap">FaddedSMS v2</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-oxford-blue-light rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-blue-200 hover:bg-oxford-blue-light hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;