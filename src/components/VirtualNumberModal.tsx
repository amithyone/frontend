import React, { useState, useEffect } from 'react';
import { X, Globe, Phone, Clock, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSms } from '../hooks/useSms';

interface VirtualNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvider?: string; // For manual mode
}

const VirtualNumberModal: React.FC<VirtualNumberModalProps> = ({ isOpen, onClose, selectedProvider }) => {
  const { isDark } = useTheme();
  const {
    countries,
    services,
    loadingCountries,
    loadingServices,
    createOrder,
    getSmsCode,
    pollForSmsCode,
    fetchServices
  } = useSms();

  const [step, setStep] = useState<'country' | 'service' | 'number' | 'waiting' | 'completed'>('country');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [assignedNumber, setAssignedNumber] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  // Determine if this is manual mode
  const isManualMode = !!selectedProvider;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'waiting' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time expired
            setError('SMS code not received within time limit');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCountrySelect = async (countryCode: string) => {
    setSelectedCountry(countryCode);
    setError(null);
    
    try {
      // For manual mode, fetch services for the specific provider
      if (isManualMode && selectedProvider) {
        await fetchServices(countryCode, selectedProvider);
      } else {
        await fetchServices(countryCode);
      }
      setStep('service');
    } catch (err) {
      setError('Failed to load services for this country');
    }
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setStep('number');
  };

  const handleGetNumber = async () => {
    if (!selectedCountry || !selectedService) {
      setError('Please select a country and service');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create order with appropriate mode
      const order = await createOrder(
        selectedCountry, 
        selectedService, 
        isManualMode ? 'manual' : 'auto',
        isManualMode ? selectedProvider : undefined
      );
      
      setAssignedNumber(order.phone_number);
      setOrderId(order.order_id);
      setIsLoading(false);
      setStep('waiting');
      setTimeLeft(300);

      // Start polling for SMS code
      pollForSmsCodeWithTimeout(order.order_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      setIsLoading(false);
    }
  };

  const pollForSmsCodeWithTimeout = async (orderId: string) => {
    try {
      const code = await pollForSmsCode(orderId, 30, 2000); // 30 attempts, 2 second intervals
      setSmsCode(code);
      setStep('completed');
    } catch (err) {
      setError('SMS code not received within time limit');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClose = () => {
    setStep('country');
    setSelectedCountry('');
    setSelectedService('');
    setAssignedNumber('');
    setSmsCode('');
    setTimeLeft(300);
    setError(null);
    setOrderId('');
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
          <h2 className="text-xl font-bold">
            FaddedSMS - {isManualMode ? 'Manual Mode' : 'Auto Mode'}
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
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Step 1: Country Selection */}
          {step === 'country' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                Select Country
              </h3>
              <div className="space-y-3">
                {loadingCountries ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                    <p>Loading countries...</p>
                  </div>
                ) : (
                  countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country.code)}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-gray-600 hover:border-blue-500 bg-gray-700 hover:bg-gray-600' 
                          : 'border-gray-200 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </div>
                        <span className="text-green-600 font-semibold">
                          {isManualMode ? 'Manual' : 'Auto'}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 'service' && selectedCountry && (
            <div>
              <button
                onClick={() => setStep('country')}
                className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
              >
                ← Back to countries
              </button>
              <h3 className="text-lg font-semibold mb-4">
                Select Service
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {loadingServices ? (
                  <div className="col-span-2 text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                    <p>Loading services...</p>
                  </div>
                ) : (
                  services.map((service) => (
                    <button
                      key={service.service}
                      onClick={() => handleServiceSelect(service.service)}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                        isDark 
                          ? 'border-gray-600 hover:border-blue-500 bg-gray-700 hover:bg-gray-600' 
                          : 'border-gray-200 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <div className="font-medium text-sm">{service.name}</div>
                        <div className="text-green-600 font-semibold text-xs">₦{service.cost}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 3: Get Number */}
          {step === 'number' && selectedCountry && selectedService && (
            <div className="text-center">
              <button
                onClick={() => setStep('service')}
                className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
              >
                ← Back to services
              </button>
              
              <div className="mb-6">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="text-lg font-semibold">
                  {isManualMode ? 'Manual Mode' : 'Auto Mode'}
                </h3>
                <p className="text-gray-500">
                  {isManualMode 
                    ? `Using provider: ${selectedProvider}`
                    : 'System will automatically select the best available provider'
                  }
                </p>
              </div>
              
              <div className={`p-4 rounded-xl mb-6 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-sm text-blue-500 mb-1">
                  {isManualMode ? '🎯 Manual Provider Selected' : '🚀 Best Provider Auto-Selected'}
                </div>
                <div className="text-xs text-gray-500">
                  {isManualMode ? 'You have full control over the provider' : 'Optimal success rate & speed'}
                </div>
              </div>

              <button
                onClick={handleGetNumber}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Getting Number...</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5" />
                    <span>Get Number ({isManualMode ? 'Manual' : 'Auto'} Mode)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 4: Waiting for SMS */}
          {step === 'waiting' && (
            <div className="text-center">
              <div className="mb-6">
                <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">Waiting for SMS</h3>
                <p className="text-gray-500 mb-4">Use this number for verification</p>
                <p className="text-xs text-blue-500">
                  {isManualMode ? `Provider: ${selectedProvider}` : 'Auto-selected provider'}
                </p>
              </div>

              <div className={`p-4 rounded-xl mb-4 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-semibold">{assignedNumber}</span>
                  <button
                    onClick={() => copyToClipboard(assignedNumber)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-500">Time remaining</div>
              </div>

              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-blue-900 bg-opacity-50' : 'bg-blue-50'
              }`}>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  📱 Use the number above to receive your verification code
                </p>
              </div>

              {/* Verification Code Section */}
              <div className={`p-4 rounded-xl border-2 border-dashed transition-colors duration-200 ${
                isDark 
                  ? 'border-gray-600 bg-gray-700' 
                  : 'border-gray-300 bg-gray-50'
              }`}>
                <div className="text-center">
                  <div className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Verification Code
                  </div>
                  <div className={`text-2xl font-mono font-bold mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    - - - - - -
                  </div>
                  <div className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Waiting for SMS...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: SMS Received */}
          {step === 'completed' && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">SMS Received!</h3>
              <p className="text-gray-500 mb-6">Your verification code is ready</p>

              <div className={`p-6 rounded-xl mb-6 ${
                isDark ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
              }`}>
                <div className="text-3xl font-bold text-green-600 mb-2 font-mono">
                  {smsCode}
                </div>
                <button
                  onClick={() => copyToClipboard(smsCode)}
                  className="flex items-center space-x-2 mx-auto text-green-600 hover:text-green-700 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Code</span>
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              >
                Complete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualNumberModal;