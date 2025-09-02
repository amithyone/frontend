import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Phone, Wifi, Tv, Zap, DollarSign } from 'lucide-react';
import VirtualNumberModal from './VirtualNumberModal';
import AirtimeModal from './AirtimeModal';
import DataBundleModal from './DataBundleModal';
import CableTVModal from './CableTVModal';
import ElectricityModal from './ElectricityModal';
import BettingModal from './BettingModal';

const QuickActions: React.FC = () => {
  const { isDark } = useTheme();
  const [showVirtualModal, setShowVirtualModal] = React.useState(false);
  const [showAirtimeModal, setShowAirtimeModal] = React.useState(false);
  const [showDataModal, setShowDataModal] = React.useState(false);
  const [showCableTVModal, setShowCableTVModal] = React.useState(false);
  const [showElectricityModal, setShowElectricityModal] = React.useState(false);
  const [showBettingModal, setShowBettingModal] = React.useState(false);

  const quickActions = [
    { 
      id: 'virtual', 
      name: 'Virtual Number', 
      icon: Shield,
      onClick: () => setShowVirtualModal(true)
    },
    { 
      id: 'airtime', 
      name: 'Quick Airtime', 
      icon: Phone,
      onClick: () => setShowAirtimeModal(true)
    },
    { 
      id: 'data', 
      name: 'Quick Data', 
      icon: Wifi,
      onClick: () => setShowDataModal(true)
    },
    { 
      id: 'cable', 
      name: 'Cable TV', 
      icon: Tv,
      onClick: () => setShowCableTVModal(true)
    },
    { 
      id: 'bills', 
      name: 'Pay Bills', 
      icon: Zap,
      onClick: () => setShowElectricityModal(true)
    },
    { 
      id: 'betting', 
      name: 'Betting', 
      icon: DollarSign,
      onClick: () => setShowBettingModal(true)
    },
  ];

  return (
    <>
    <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Quick Actions</h3>
      
      <div className="grid grid-cols-5 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200 active:scale-95 ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-gray-600' : 'bg-oxford-blue'
              }`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {action.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
    
    {/* All Modals */}
    <VirtualNumberModal 
      isOpen={showVirtualModal} 
      onClose={() => setShowVirtualModal(false)} 
    />
    
    <AirtimeModal 
      isOpen={showAirtimeModal} 
      onClose={() => setShowAirtimeModal(false)} 
    />
    
    <DataBundleModal 
      isOpen={showDataModal} 
      onClose={() => setShowDataModal(false)} 
    />
    
    <CableTVModal 
      isOpen={showCableTVModal} 
      onClose={() => setShowCableTVModal(false)} 
    />
    
    <ElectricityModal 
      isOpen={showElectricityModal} 
      onClose={() => setShowElectricityModal(false)} 
    />
    
    <BettingModal 
      isOpen={showBettingModal} 
      onClose={() => setShowBettingModal(false)} 
    />
    </>
  );
};

export default QuickActions;