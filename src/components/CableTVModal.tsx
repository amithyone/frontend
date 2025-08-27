import React, { useState } from 'react';
import { X, Tv, Check, CreditCard, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface CableTVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TVPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
}

const CableTVModal: React.FC<CableTVModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [smartCardNumber, setSmartCardNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const providers = [
    { id: 'dstv', name: 'DStv', color: 'bg-blue-600', logo: '📺' },
    { id: 'gotv', name: 'GOtv', color: 'bg-green-600', logo: '📻' },
    { id: 'startimes', name: 'StarTimes', color: 'bg-red-600', logo: '⭐' }
  ];

  const tvPlans: Record<string, TVPlan[]> = {
    dstv: [
      { id: 'dstv-padi', name: 'DStv Padi', price: 2500, duration: '1 month' },
      { id: 'dstv-yanga', name: 'DStv Yanga', price: 3500, duration: '1 month' },
      { id: 'dstv-confam', name: 'DStv Confam', price: 6200, duration: '1 month' },
      { id: 'dstv-compact', name: 'DStv Compact', price: 10500, duration: '1 month' },
      { id: 'dstv-premium', name: 'DStv Premium', price: 24500, duration: '1 month' }
    ],
    gotv: [
      { id: 'gotv-smallie', name: 'GOtv Smallie', price: 1100, duration: '1 month' },
      { id: 'gotv-jinja', name: 'GOtv Jinja', price: 2250, duration: '1 month' },
      { id: 'gotv-jolli', name: 'GOtv Jolli', price: 3300, duration: '1 month' },
      { id: 'gotv-max', name: 'GOtv Max', price: 4850, duration: '1 month' }
    ],
    startimes: [
      { id: 'startimes-nova', name: 'Nova', price: 1200, duration: '1 month' },
      { id: 'startimes-basic', name: 'Basic', price: 2200, duration: '1 month' },
      { id: 'startimes-smart', name: 'Smart', price: 2800, duration: '1 month' },
      { id: 'startimes-classic', name: 'Classic', price: 3500, duration: '1 month' }
    ]
  };

  const handleVerifyCard = async () => {
    if (!smartCardNumber || !selectedProvider) {
      alert('Please enter smart card number and select provider');
      return;
    }
    
    setIsVerifying(true);
    // Simulate API call to verify card
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCustomerName('John Doe'); // Simulated customer name
    setIsVerifying(false);
  };

  const handlePurchase = async () => {
    if (!selectedProvider || !selectedPlan || !smartCardNumber) {
      alert('Please fill all fields');
      return;
    }
    
    const plan = tvPlans[selectedProvider].find(p => p.id === selectedPlan);
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert(`${plan?.name} subscription successful for ${smartCardNumber}!`);
    onClose();
  };

  const handleClose = () => {
    setSelectedProvider('');
    setSelectedPlan('');
    setSmartCardNumber('');
    setCustomerName('');
    setIsProcessing(false);
    setIsVerifying(false);
    onClose();
  };

  const selectedPlanData = selectedProvider && selectedPlan 
    ? tvPlans[selectedProvider].find(p => p.id === selectedPlan)
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <Tv className="h-6 w-6 mr-2 text-purple-500" />
            Cable TV
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Provider</label>
            <div className="space-y-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setSelectedProvider(provider.id);
                    setSelectedPlan('');
                    setCustomerName('');
                  }}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                    selectedProvider === provider.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20'
                      : isDark 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${provider.color}`}>
                      <span className="text-white text-lg">{provider.logo}</span>
                    </div>
                    <span className="font-medium">{provider.name}</span>
                    {selectedProvider === provider.id && (
                      <Check className="h-5 w-5 text-purple-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Smart Card Number */}
          <div>
            <label className="block text-sm font-medium mb-2">Smart Card Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter smart card number"
                value={smartCardNumber}
                onChange={(e) => setSmartCardNumber(e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
              <button
                onClick={handleVerifyCard}
                disabled={isVerifying || !smartCardNumber || !selectedProvider}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isVerifying ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>
            </div>
            {customerName && (
              <div className={`mt-2 p-3 rounded-lg ${
                isDark ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
              }`}>
                <p className="text-sm text-green-600">
                  ✓ Customer: {customerName}
                </p>
              </div>
            )}
          </div>

          {/* TV Plans */}
          {selectedProvider && (
            <div>
              <label className="block text-sm font-medium mb-3">Select Package</label>
              <div className="space-y-2">
                {tvPlans[selectedProvider].map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                      selectedPlan === plan.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20'
                        : isDark 
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">₦{plan.price}</div>
                        {selectedPlan === plan.id && (
                          <Check className="h-5 w-5 text-purple-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isProcessing || !selectedProvider || !selectedPlan || !smartCardNumber}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Pay - ₦{selectedPlanData?.price || '0'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CableTVModal;