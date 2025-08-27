import React, { useState } from 'react';
import { X, Zap, Check, CreditCard, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ElectricityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ElectricityModal: React.FC<ElectricityModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [meterNumber, setMeterNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const providers = [
    { id: 'ekedc', name: 'Eko Electric (EKEDC)', color: 'bg-blue-600', logo: '⚡' },
    { id: 'ikedc', name: 'Ikeja Electric (IKEDC)', color: 'bg-green-600', logo: '🔌' },
    { id: 'aedc', name: 'Abuja Electric (AEDC)', color: 'bg-red-600', logo: '💡' },
    { id: 'phed', name: 'Port Harcourt Electric (PHED)', color: 'bg-purple-600', logo: '⚡' },
    { id: 'kedco', name: 'Kano Electric (KEDCO)', color: 'bg-orange-600', logo: '🔋' },
    { id: 'eedc', name: 'Enugu Electric (EEDC)', color: 'bg-indigo-600', logo: '💡' }
  ];

  const quickAmounts = [1000, 2000, 5000, 10000, 15000, 20000];

  const handleVerifyMeter = async () => {
    if (!meterNumber || !selectedProvider) {
      alert('Please enter meter number and select provider');
      return;
    }
    
    setIsVerifying(true);
    // Simulate API call to verify meter
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCustomerName('John Doe'); // Simulated customer name
    setIsVerifying(false);
  };

  const handlePayment = async () => {
    if (!selectedProvider || !meterNumber || !amount) {
      alert('Please fill all fields');
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert(`Electricity bill payment successful! ₦${amount} credited to meter ${meterNumber}`);
    onClose();
  };

  const handleClose = () => {
    setSelectedProvider('');
    setMeterNumber('');
    setCustomerName('');
    setAmount('');
    setMeterType('prepaid');
    setIsProcessing(false);
    setIsVerifying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <Zap className="h-6 w-6 mr-2 text-orange-500" />
            Electricity Bills
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
          {/* Meter Type */}
          <div>
            <label className="block text-sm font-medium mb-3">Meter Type</label>
            <div className="flex space-x-3">
              <button
                onClick={() => setMeterType('prepaid')}
                className={`flex-1 p-3 rounded-lg border transition-all duration-200 ${
                  meterType === 'prepaid'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 text-orange-600'
                    : isDark 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                Prepaid
              </button>
              <button
                onClick={() => setMeterType('postpaid')}
                className={`flex-1 p-3 rounded-lg border transition-all duration-200 ${
                  meterType === 'postpaid'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 text-orange-600'
                    : isDark 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                Postpaid
              </button>
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Provider</label>
            <div className="space-y-2">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setSelectedProvider(provider.id);
                    setCustomerName('');
                  }}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                    selectedProvider === provider.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20'
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
                      <Check className="h-5 w-5 text-orange-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Meter Number */}
          <div>
            <label className="block text-sm font-medium mb-2">Meter Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter meter number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
              <button
                onClick={handleVerifyMeter}
                disabled={isVerifying || !meterNumber || !selectedProvider}
                className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
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

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Amount</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    amount === quickAmount.toString()
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 text-orange-600'
                      : isDark 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  ₦{quickAmount}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedProvider || !meterNumber || !amount}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Pay Bill - ₦{amount || '0'}</span>
              </>
            )}
          </button>

          {/* Info */}
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'
          }`}>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              ⚡ {meterType === 'prepaid' ? 'Units will be credited to your meter within 5 minutes' : 'Your bill payment will be processed within 24 hours'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityModal;