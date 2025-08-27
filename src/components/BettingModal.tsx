import React, { useState } from 'react';
import { X, Gamepad2, Check, CreditCard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const platforms = [
    { id: 'bet9ja', name: 'Bet9ja', color: 'bg-green-600', logo: '🎯' },
    { id: 'sportybet', name: 'SportyBet', color: 'bg-blue-600', logo: '⚽' },
    { id: 'betking', name: 'BetKing', color: 'bg-red-600', logo: '👑' },
    { id: 'nairabet', name: 'NairaBet', color: 'bg-orange-600', logo: '🏆' },
    { id: '1xbet', name: '1xBet', color: 'bg-blue-800', logo: '🎲' },
    { id: 'betway', name: 'Betway', color: 'bg-green-700', logo: '🎰' }
  ];

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  const handleFunding = async () => {
    if (!selectedPlatform || !userId || !amount) {
      alert('Please fill all fields');
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert(`Betting wallet funded successfully! ₦${amount} sent to ${selectedPlatform} account ${userId}`);
    onClose();
  };

  const handleClose = () => {
    setSelectedPlatform('');
    setUserId('');
    setAmount('');
    setIsProcessing(false);
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
            <Gamepad2 className="h-6 w-6 mr-2 text-yellow-500" />
            Betting Wallet
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
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Betting Platform</label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedPlatform === platform.id
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20'
                      : isDark 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-2 rounded-lg ${platform.color}`}>
                      <span className="text-white text-lg">{platform.logo}</span>
                    </div>
                    <span className="font-medium text-sm text-center">{platform.name}</span>
                    {selectedPlatform === platform.id && (
                      <Check className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User ID */}
          <div>
            <label className="block text-sm font-medium mb-2">User ID / Phone Number</label>
            <input
              type="text"
              placeholder="Enter your betting account ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
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
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 text-yellow-600'
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Funding Button */}
          <button
            onClick={handleFunding}
            disabled={isProcessing || !selectedPlatform || !userId || !amount}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Fund Wallet - ₦{amount || '0'}</span>
              </>
            )}
          </button>

          {/* Info */}
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'
          }`}>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💡 Funds will be credited to your betting account within 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingModal;