import React, { useState } from 'react';
import { X, CreditCard, Check, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface RechargeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RechargeCardModal: React.FC<RechargeCardModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const networks = [
    { id: 'mtn', name: 'MTN', color: 'bg-yellow-500', logo: '📱' },
    { id: 'airtel', name: 'Airtel', color: 'bg-red-500', logo: '📶' },
    { id: 'glo', name: 'Glo', color: 'bg-green-500', logo: '🌐' },
    { id: '9mobile', name: '9mobile', color: 'bg-green-600', logo: '📞' }
  ];

  const amounts = [100, 200, 500, 1000, 1500, 2000, 5000];

  const handlePurchase = async () => {
    if (!selectedNetwork || !selectedAmount || !quantity) {
      alert('Please fill all fields');
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    // Simulate recharge card generation
    const cards = Array.from({ length: parseInt(quantity) }, (_, i) => ({
      serial: `${Math.random().toString().substr(2, 12)}`,
      pin: `${Math.random().toString().substr(2, 16)}`
    }));
    
    alert(`Recharge cards generated successfully! ${quantity} x ₦${selectedAmount} ${selectedNetwork.toUpperCase()} cards`);
    onClose();
  };

  const handleClose = () => {
    setSelectedNetwork('');
    setSelectedAmount('');
    setQuantity('1');
    setIsProcessing(false);
    onClose();
  };

  const totalAmount = selectedAmount && quantity 
    ? (parseInt(selectedAmount) * parseInt(quantity)).toString()
    : '0';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-indigo-500" />
            Recharge Cards
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
          {/* Network Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Network</label>
            <div className="grid grid-cols-2 gap-3">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => setSelectedNetwork(network.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedNetwork === network.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20'
                      : isDark 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${network.color}`}>
                      <span className="text-white text-lg">{network.logo}</span>
                    </div>
                    <span className="font-medium">{network.name}</span>
                    {selectedNetwork === network.id && (
                      <Check className="h-5 w-5 text-indigo-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount.toString())}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedAmount === amount.toString()
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20 text-indigo-600'
                      : isDark 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  ₦{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {[1, 2, 3, 4, 5, 10, 20, 50].map(num => (
                <option key={num} value={num}>{num} card{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Total Amount */}
          {selectedAmount && quantity && (
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-indigo-900 bg-opacity-20' : 'bg-indigo-50'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-indigo-600">₦{totalAmount}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {quantity} x ₦{selectedAmount} {selectedNetwork.toUpperCase()} cards
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isProcessing || !selectedNetwork || !selectedAmount || !quantity}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Cards...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Generate Cards - ₦{totalAmount}</span>
              </>
            )}
          </button>

          {/* Info */}
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'
          }`}>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              📋 Recharge card details will be sent to your email and available for download
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeCardModal;