import React, { useState, useEffect } from 'react';
import { X, Wifi, CreditCard, CheckCircle, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useVtuContext } from '../contexts/VtuContext';

interface DataBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataBundleModal: React.FC<DataBundleModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { updateWalletBalance } = useAuth();
  const { user } = useAuth();
  const {
    dataNetworks,
    dataBundles,
    loadingNetworks,
    loadingBundles,
    errorNetworks,
    errorBundles,
    fetchDataBundles,
    purchaseDataBundle,
    validatePhoneNumber
  } = useVtuContext();

  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [selectedBundle, setSelectedBundle] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [phoneValidation, setPhoneValidation] = useState<{ isValid: boolean; message: string } | null>(null);
  const walletBalance = typeof user?.wallet === 'number' ? user.wallet : 0;

  // Fetch bundles when network changes
  useEffect(() => {
    if (selectedNetwork) {
      fetchDataBundles(selectedNetwork);
      setSelectedBundle('');
    }
  }, [selectedNetwork, fetchDataBundles]);

  // Validate phone number when network or phone changes
  useEffect(() => {
    if (selectedNetwork && phoneNumber.length === 11) {
      validatePhone();
    } else {
      setPhoneValidation(null);
    }
  }, [selectedNetwork, phoneNumber]);

  const validatePhone = async () => {
    try {
      const result = await validatePhoneNumber(phoneNumber, selectedNetwork);
      setPhoneValidation({
        isValid: result.is_valid,
        message: result.is_valid ? 'Phone number is valid' : 'Invalid phone number for selected network'
      });
    } catch (error) {
      setPhoneValidation({
        isValid: false,
        message: 'Failed to validate phone number'
      });
    }
  };

  const handlePurchase = async () => {
    if (!selectedNetwork || !selectedBundle || !phoneNumber) {
      setError('Please fill in all fields');
      return;
    }

    if (phoneValidation && !phoneValidation.isValid) {
      setError('Please enter a valid phone number for the selected network');
      return;
    }

    const bundle = dataBundles.find(b => b.id === selectedBundle);
    if (!bundle) {
      setError('Selected bundle not found');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await purchaseDataBundle({
        network: selectedNetwork,
        phone: phoneNumber,
        plan: selectedBundle,
        plan_name: bundle.name,
        amount: bundle.price
      });

      setSuccess(`Data bundle purchase successful! Reference: ${result.reference}`);
      if ((result as any)?.wallet !== undefined) {
        updateWalletBalance((result as any).wallet);
      }
      
      // Reset form
      setSelectedNetwork('');
      setSelectedBundle('');
      setPhoneNumber('');
      setPhoneValidation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase data bundle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedNetwork('');
    setSelectedBundle('');
    setPhoneNumber('');
    setError(null);
    setSuccess(null);
    setPhoneValidation(null);
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
            <Wifi className="h-6 w-6 mr-2 text-blue-500" />
            Buy Data Bundle
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
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          {/* Network Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Network</label>
            {loadingNetworks ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                <span>Loading networks...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {dataNetworks.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => setSelectedNetwork(network.code)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      selectedNetwork === network.code
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                        : isDark
                          ? 'border-gray-600 hover:border-blue-400 bg-gray-700 hover:bg-gray-600'
                          : 'border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{network.logo || '📱'}</div>
                      <div className="font-medium text-sm">{network.name}</div>
                      <div className={`text-xs ${
                        network.status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {network.status === 'active' ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Data Bundle Selection */}
          {selectedNetwork && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Data Bundle</label>
              {loadingBundles ? (
                <div className="flex items-center justify-center py-4">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading bundles...</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {dataBundles.map((bundle) => (
                    <button
                      key={bundle.id}
                      onClick={() => setSelectedBundle(bundle.id)}
                      className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                        selectedBundle === bundle.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                          : isDark
                            ? 'border-gray-600 hover:border-blue-400 bg-gray-700 hover:bg-gray-600'
                            : 'border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium text-sm">{bundle.name}</div>
                          <div className="text-xs text-gray-500">
                            {bundle.size} • {bundle.validity}
                          </div>
                          {bundle.description && (
                            <div className="text-xs text-gray-400 mt-1">
                              {bundle.description}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">₦{bundle.price}</div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="08012345678"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              maxLength={11}
            />
            {phoneValidation && (
              <div className={`mt-1 text-sm flex items-center ${
                phoneValidation.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {phoneValidation.isValid ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {phoneValidation.message}
              </div>
            )}
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isLoading || !selectedNetwork || !selectedBundle || !phoneNumber || (phoneValidation && !phoneValidation.isValid)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Buy Data Bundle
              </>
            )}
          </button>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💡 Powered by VTU.ng - Instant data bundle activation
            </p>
            <p className="text-xs mt-1">
              Wallet: ₦{walletBalance?.toLocaleString?.() || walletBalance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBundleModal;