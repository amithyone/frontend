import React, { useState, useEffect } from 'react';
import { X, Server, Globe, Star, Gauge, CheckCircle, Users, Zap, Shield, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSms } from '../hooks/useSms';
import VirtualNumberModal from './VirtualNumberModal';

interface ServerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServerSelectionModal: React.FC<ServerSelectionModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const {
    providers,
    loadingProviders,
    fetchProviders
  } = useSms();

  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showVirtualModal, setShowVirtualModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen, fetchProviders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-500';
      case 'low_balance':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>;
      case 'low_balance':
        return <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
  };

  const handleProceed = () => {
    if (selectedProvider) {
      setShowVirtualModal(true);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedProvider('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold flex items-center">
              <Server className="h-6 w-6 mr-2 text-indigo-500" />
              Choose Verification Provider
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className={`text-sm mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Select a specific SMS provider for manual control. You can see success rates and availability.
            </p>

            {/* Provider Grid */}
            <div className="space-y-4">
              {loadingProviders ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-500" />
                  <p className="text-lg font-medium">Loading providers...</p>
                  <p className="text-sm text-gray-500">Fetching real-time provider data</p>
                </div>
              ) : (
                providers.map((provider) => (
                  <button
                    key={provider.provider}
                    onClick={() => handleProviderSelect(provider.provider)}
                    disabled={provider.status === 'low_balance'}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedProvider === provider.provider
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20'
                        : provider.status === 'low_balance'
                          ? 'border-gray-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 opacity-50 cursor-not-allowed'
                          : isDark 
                            ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-indigo-400' 
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📱</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-semibold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>{provider.name}</h3>
                            {getStatusIcon(provider.status)}
                          </div>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>Provider: {provider.provider}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {selectedProvider === provider.provider && (
                          <CheckCircle className="h-6 w-6 text-indigo-500" />
                        )}
                      </div>
                    </div>

                    {/* Provider Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-semibold">{provider.success_rate}%</span>
                        </div>
                        <div className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>Success Rate</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-semibold">{provider.total_orders}</span>
                        </div>
                        <div className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>Total Orders</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-semibold">{provider.successful_orders}</span>
                        </div>
                        <div className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>Successful</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className={`text-sm font-semibold ${
                            provider.balance > 0 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {provider.balance > 0 ? '💰' : '⚠️'}
                          </span>
                        </div>
                        <div className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {provider.balance > 0 ? 'Available' : 'Low Balance'}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        provider.status === 'available' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {provider.status === 'available' ? '🟢 Available' : '🟡 Low Balance'}
                      </div>
                      
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Last updated: {new Date(provider.last_balance_check).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Selected Provider Details */}
            {selectedProvider && (
              <div className={`mt-6 p-4 rounded-xl border-2 border-dashed ${
                isDark 
                  ? 'border-indigo-600 bg-indigo-900 bg-opacity-20' 
                  : 'border-indigo-500 bg-indigo-50'
              }`}>
                <h4 className={`font-semibold mb-2 text-indigo-600 dark:text-indigo-400`}>
                  Selected: {providers.find(p => p.provider === selectedProvider)?.name}
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Success Rate:</div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400">
                      {providers.find(p => p.provider === selectedProvider)?.success_rate}% success rate
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Status:</div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400">
                      {providers.find(p => p.provider === selectedProvider)?.status === 'available' 
                        ? 'Available for orders' 
                        : 'Low balance - may be unavailable'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>Proceed with Manual Selection</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Virtual Number Modal for Manual Mode */}
      <VirtualNumberModal 
        isOpen={showVirtualModal} 
        onClose={() => setShowVirtualModal(false)}
        selectedProvider={selectedProvider}
      />
    </>
  );
};

export default ServerSelectionModal;