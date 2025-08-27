import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Shield, 
  Phone, 
  Wifi, 
  Tv, 
  Gamepad2, 
  Zap, 
  CreditCard,
  ChevronRight,
  Server,
  Globe,
  Star,
  Gauge
} from 'lucide-react';
import VirtualNumberModal from './VirtualNumberModal';
import AirtimeModal from './AirtimeModal';
import DataBundleModal from './DataBundleModal';
import CableTVModal from './CableTVModal';
import BettingModal from './BettingModal';
import RechargeCardModal from './RechargeCardModal';
import ElectricityModal from './ElectricityModal';
import ServerSelectionModal from './ServerSelectionModal';

const ServiceGrid: React.FC = () => {
  const { isDark } = useTheme();
  const [showVirtualModal, setShowVirtualModal] = React.useState(false);
  const [showServerModal, setShowServerModal] = React.useState(false);
  const [showAirtimeModal, setShowAirtimeModal] = React.useState(false);
  const [showDataBundleModal, setShowDataBundleModal] = React.useState(false);
  const [showCableTVModal, setShowCableTVModal] = React.useState(false);
  const [showBettingModal, setShowBettingModal] = React.useState(false);
  const [showRechargeModal, setShowRechargeModal] = React.useState(false);
  const [showElectricityModal, setShowElectricityModal] = React.useState(false);

  const services = [
    {
      id: 'virtual-verify',
      name: 'Virtual Verify Number',
      description: 'Auto mode - Best provider automatically selected',
      icon: Shield,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      onClick: () => setShowVirtualModal(true)
    },
    {
      id: 'server-selection',
      name: 'Choose Server',
      description: 'Manual mode - Select specific SMS provider',
      icon: Server,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      onClick: () => setShowServerModal(true)
    },
    {
      id: 'airtime',
      name: 'Buy Airtime',
      description: 'Instant airtime to all networks',
      icon: Phone,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      onClick: () => setShowAirtimeModal(true)
    },
    {
      id: 'data-bundle',
      name: 'Buy Data Bundle',
      description: 'Data bundles for all networks',
      icon: Wifi,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      onClick: () => setShowDataBundleModal(true)
    }
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={service.onClick}
              className={`rounded-2xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md active:scale-95 text-left ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                  : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${service.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${service.textColor}`} />
                </div>
                <ChevronRight className={`h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>
            
              <h3 className={`font-semibold text-sm mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{service.name}</h3>
              <p className={`text-xs leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>{service.description}</p>
            </button>
          );
        })}
      </div>
      
      <VirtualNumberModal 
        isOpen={showVirtualModal} 
        onClose={() => setShowVirtualModal(false)} 
      />
      
      <ServerSelectionModal 
        isOpen={showServerModal} 
        onClose={() => setShowServerModal(false)} 
      />
      
      <AirtimeModal 
        isOpen={showAirtimeModal} 
        onClose={() => setShowAirtimeModal(false)} 
      />
      
      <DataBundleModal 
        isOpen={showDataBundleModal} 
        onClose={() => setShowDataBundleModal(false)} 
      />
      
      <CableTVModal 
        isOpen={showCableTVModal} 
        onClose={() => setShowCableTVModal(false)} 
      />
      
      <BettingModal 
        isOpen={showBettingModal} 
        onClose={() => setShowBettingModal(false)} 
      />
      
      <RechargeCardModal 
        isOpen={showRechargeModal} 
        onClose={() => setShowRechargeModal(false)} 
      />
      
      <ElectricityModal 
        isOpen={showElectricityModal} 
        onClose={() => setShowElectricityModal(false)} 
      />
    </>
  );
};

export default ServiceGrid;