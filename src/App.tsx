import React, { useState } from 'react';
import MobileLayout from './components/MobileLayout';
import Sidebar from './components/Sidebar';
import BottomNavigation from './components/BottomNavigation';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Wallet from './components/Wallet';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AuthedApp() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'services' | 'wallet' | 'transactions' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'services':
        return <Services />;
      case 'wallet':
        return <Wallet />;
      case 'transactions':
        return <Transactions />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileLayout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {renderCurrentPage()}
      </MobileLayout>
      
      <BottomNavigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

const RootApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Login />;
  }
  return <AuthedApp />;
};

const App: React.FC = () => (
  <AuthProvider>
    <RootApp />
  </AuthProvider>
);

export default App;