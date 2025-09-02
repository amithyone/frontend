import React, { useState, useEffect } from 'react';
import { X, Globe, Smartphone, CheckCircle, Clock, Phone, Copy, Search } from 'lucide-react';
import { smsApiService } from '../services/smsApi';
import { SmsCountry, SmsService } from '../services/smsApi';

interface VirtualNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FlowStep = 'country' | 'service' | 'summary' | 'phone' | 'waiting';

const VirtualNumberModal: React.FC<VirtualNumberModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('country');
  const [countries, setCountries] = useState<SmsCountry[]>([]);
  const [services, setServices] = useState<SmsService[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<SmsCountry | null>(null);
  const [selectedService, setSelectedService] = useState<SmsService | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quick filter search states
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCountries();
      loadServices();
    }
  }, [isOpen]);

  const loadCountries = async () => {
    try {
      const data = await smsApiService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
      // Fallback to mock countries
      setCountries([
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: 'FR', name: 'France', flag: '🇫🇷' },
        { code: 'IT', name: 'Italy', flag: '🇮🇹' },
        { code: 'ES', name: 'Spain', flag: '🇪🇸' },
        { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
        { code: 'SE', name: 'Sweden', flag: '🇸🇪' }
      ]);
    }
  };

  const loadServices = async () => {
    try {
      const data = await smsApiService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  // Filtered data based on search terms
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: SmsCountry) => {
    setSelectedCountry(country);
    setCurrentStep('service');
    setCountrySearchTerm(''); // Clear search when moving to next step
  };

  const handleServiceSelect = (service: SmsService) => {
    setSelectedService(service);
    setCurrentStep('summary');
    setServiceSearchTerm(''); // Clear search when moving to next step
  };

  const handleConfirmOrder = async () => {
    if (!selectedCountry || !selectedService) return;

    setIsLoading(true);
    setError(null);

    try {
      const order = await smsApiService.createOrder(
        selectedCountry.code,
        selectedService.service,
        'auto' // Auto-select fastest server
      );

      setOrderId(order.order_id);
      setPhoneNumber(order.phone_number);
      setCurrentStep('phone');

      // Start polling for SMS code
      startPollingForSms(order.order_id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  const startPollingForSms = (orderId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await smsApiService.getSmsCode(orderId);
        if (response.sms_code) {
          setSmsCode(response.sms_code);
          setCurrentStep('waiting');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error polling for SMS:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
  };

  const resetFlow = () => {
    setCurrentStep('country');
    setSelectedCountry(null);
    setSelectedService(null);
    setPhoneNumber('');
    setSmsCode('');
    setOrderId('');
    setError(null);
    setCountrySearchTerm('');
    setServiceSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Virtual Number Verification</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-4 border-b border-white/20">
          {['country', 'service', 'summary', 'phone', 'waiting'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === step 
                  ? 'bg-blue-500 text-white' 
                  : index < ['country', 'service', 'summary', 'phone', 'waiting'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white/50'
              }`}>
                {index < ['country', 'service', 'summary', 'phone', 'waiting'].indexOf(currentStep) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 4 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index < ['country', 'service', 'summary', 'phone', 'waiting'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Country Selection with Quick Search */}
          {currentStep === 'country' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Select Country
              </h3>
              
              {/* Quick Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all text-left hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{country.flag}</div>
                    <div className="text-white font-medium">{country.name}</div>
                    <div className="text-white/60 text-sm">{country.code}</div>
                  </button>
                ))}
              </div>
              
              {filteredCountries.length === 0 && countrySearchTerm && (
                <div className="text-center py-8 text-white/50">
                  No countries found matching "{countrySearchTerm}"
                </div>
              )}
            </div>
          )}

          {/* Step 2: Service Selection with Quick Search */}
          {currentStep === 'service' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                Select Service
              </h3>
              
              {/* Quick Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services (WhatsApp, Telegram, Facebook, Google...)"
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all text-left hover:scale-105"
                  >
                    <div className="text-white font-medium mb-2">{service.name}</div>
                    <div className="text-blue-400 font-bold">${service.cost}</div>
                    <div className="text-white/60 text-sm">Success: {service.success_rate}%</div>
                  </button>
                ))}
              </div>
              
              {filteredServices.length === 0 && serviceSearchTerm && (
                <div className="text-center py-8 text-white/50">
                  No services found matching "{serviceSearchTerm}"
                </div>
              )}
            </div>
          )}

          {/* Step 3: Order Summary */}
          {currentStep === 'summary' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Country:</span>
                    <span className="text-white">{selectedCountry?.flag} {selectedCountry?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Service:</span>
                    <span className="text-white">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Cost:</span>
                    <span className="text-blue-400 font-bold">${selectedService?.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Server Selection:</span>
                    <span className="text-green-400">Auto (Fastest Available)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('service')}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-all"
                >
                  {isLoading ? 'Creating Order...' : 'Confirm & Get Number'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Phone Number Display */}
          {currentStep === 'phone' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Your Virtual Number
              </h3>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{phoneNumber}</div>
                <p className="text-white/70 mb-4">Use this number for verification</p>
                <button
                  onClick={copyPhoneNumber}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center mx-auto"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Number
                </button>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-white/70 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Waiting for SMS/OTP...
                </div>
                <div className="text-sm text-white/50">
                  The system will automatically detect when the code arrives
                </div>
              </div>
            </div>
          )}

          {/* Step 5: SMS Code Received */}
          {currentStep === 'waiting' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                SMS Code Received!
              </h3>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-6 text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{smsCode}</div>
                <p className="text-white/70">Use this code to complete your verification</p>
              </div>
              <div className="text-center space-y-3">
                <button
                  onClick={resetFlow}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Get Another Number
                </button>
                <div className="text-sm text-white/50">
                  Order ID: {orderId}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualNumberModal;