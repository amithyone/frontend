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
  const [servicesByProvider, setServicesByProvider] = useState<{ provider: string; services: SmsService[] }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<SmsCountry | null>(null);
  const [selectedService, setSelectedService] = useState<SmsService | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
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
      // Preload static countries instantly (no API) for fast UX
      const staticCountries: SmsCountry[] = [
        { code: 'US', name: 'United States', flag: '🇺🇸', provider: 'auto' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', provider: 'auto' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦', provider: 'auto' },
        { code: 'NG', name: 'Nigeria', flag: '🇳🇬', provider: 'auto' },
        { code: 'IN', name: 'India', flag: '🇮🇳', provider: 'auto' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺', provider: 'auto' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪', provider: 'auto' },
        { code: 'FR', name: 'France', flag: '🇫🇷', provider: 'auto' },
        { code: 'IT', name: 'Italy', flag: '🇮🇹', provider: 'auto' },
        { code: 'ES', name: 'Spain', flag: '🇪🇸', provider: 'auto' },
        { code: 'NL', name: 'Netherlands', flag: '🇳🇱', provider: 'auto' },
        { code: 'SE', name: 'Sweden', flag: '🇸🇪', provider: 'auto' },
        { code: 'NO', name: 'Norway', flag: '🇳🇴', provider: 'auto' },
        { code: 'DK', name: 'Denmark', flag: '🇩🇰', provider: 'auto' },
        { code: 'FI', name: 'Finland', flag: '🇫🇮', provider: 'auto' },
        { code: 'JP', name: 'Japan', flag: '🇯🇵', provider: 'auto' },
        { code: 'KR', name: 'South Korea', flag: '🇰🇷', provider: 'auto' },
        { code: 'CN', name: 'China', flag: '🇨🇳', provider: 'auto' },
        { code: 'BR', name: 'Brazil', flag: '🇧🇷', provider: 'auto' },
        { code: 'ZA', name: 'South Africa', flag: '🇿🇦', provider: 'auto' },
        { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', provider: 'auto' },
        { code: 'TR', name: 'Turkey', flag: '🇹🇷', provider: 'auto' },
        { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', provider: 'auto' }
      ];
      setCountries(staticCountries);

      // In the background, fetch full Dassy country list and merge (non-blocking)
      (async () => {
        try {
          const dassyCountries = await smsApiService.getCountries('dassy');
          if (Array.isArray(dassyCountries) && dassyCountries.length > 0) {
            // Merge unique by code
            const seen = new Set<string>();
            const merged = [...staticCountries, ...dassyCountries]
              .filter((c) => {
                const code = (c.code || '').toUpperCase();
                // Only accept ISO2 codes (two letters)
                const isIso2 = /^[A-Z]{2}$/.test(code);
                if (!isIso2) return false;
                if (seen.has(code)) return false;
                seen.add(code);
                return true;
              })
              .map((c) => ({ ...c, code: (c.code || '').toUpperCase(), provider: 'auto' }));
            setCountries(merged);
          }
        } catch {}
      })();
    }
  }, [isOpen]);

  const loadServicesForCountry = async (countryCode: string) => {
    if (!countryCode) return;
    
    setIsLoading(true);
    setError(null);
    try {
      console.log(`🔄 Loading services for country: ${countryCode}`);
      
      // Get services from all providers for this country
      const providerServices = await smsApiService.getServicesFromAllProviders(countryCode);
      console.log(`📋 Received services from ${providerServices.length} providers for ${countryCode}`);
      
      setServicesByProvider(providerServices);
      
      // Flatten all services for search/filtering
      const allServices = providerServices.flatMap(ps => ps.services);
      setServices(allServices);
      
      if (allServices.length === 0) {
        console.warn(`⚠️ No services available for ${countryCode} from any provider`);
        setError(`No services available for ${countryCode} from any provider. Please try a different country or contact support.`);
      } else {
        console.log(`✅ Successfully loaded ${allServices.length} services for ${countryCode}`);
      }
    } catch (error) {
      console.error('❌ Error loading services:', error);
      setError('Failed to load services for this country. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered data based on search terms
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const handleCountrySelect = async (country: SmsCountry) => {
    setSelectedCountry(country);
    setCurrentStep('service');
    setCountrySearchTerm(''); // Clear search when moving to next step
    
    // Load services for this country
    await loadServicesForCountry(country.code);
  };

  const handleServiceSelect = (service: SmsService, provider: string) => {
    setSelectedService(service);
    setSelectedProvider(provider);
    setCurrentStep('summary');
    setServiceSearchTerm(''); // Clear search when moving to next step
  };

  const handleConfirmOrder = async () => {
    if (!selectedCountry || !selectedService || !selectedProvider) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Creating order for ${selectedService.name} in ${selectedCountry.name} (${selectedCountry.code}) via ${selectedProvider}`);
      const order = await smsApiService.createOrder(
        selectedCountry.code,
        selectedService.service,
        'manual',
        selectedProvider
      );

      setOrderId(order.order_id);
      setPhoneNumber(order.phone_number);
      setCurrentStep('phone');

      // Start polling for SMS code
      startPollingForSms(order.order_id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      console.error('Order creation failed:', errorMessage);
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('All providers are currently unavailable')) {
        setError('All SMS providers are temporarily unavailable. Please try again in a few minutes or contact support.');
      } else if (errorMessage.includes('Insufficient balance')) {
        setError('Insufficient wallet balance. Please top up your account to continue.');
      } else if (errorMessage.includes('Service not available')) {
        setError('This service is not available for the selected country. Please try a different service or country.');
      } else {
        setError(errorMessage);
      }
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
    setSelectedProvider('');
    setServicesByProvider([]);
    setPhoneNumber('');
    setSmsCode('');
    setOrderId('');
    setError(null);
    setCountrySearchTerm('');
    setServiceSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Virtual Number Verification</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {['country', 'service', 'summary', 'phone', 'waiting'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                currentStep === step 
                  ? 'bg-orange-500 text-white' 
                  : index < ['country', 'service', 'summary', 'phone', 'waiting'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {index < ['country', 'service', 'summary', 'phone', 'waiting'].indexOf(currentStep) ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 4 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  index < ['country', 'service', 'summary', 'phone', 'waiting'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Step 1: Country Selection with Quick Search */}
          {currentStep === 'country' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Globe className="w-4 h-4 mr-1.5" />
                Select Country
              </h3>
              
              {/* Quick Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-all text-left"
                  >
                    <div className="text-xl mb-1">{country.flag}</div>
                    <div className="text-gray-900 dark:text-white font-medium text-xs">{country.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{country.code}</div>
                  </button>
                ))}
              </div>
              
              {filteredCountries.length === 0 && countrySearchTerm && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No countries found matching "{countrySearchTerm}"
                </div>
              )}
            </div>
          )}

          {/* Step 2: Service Selection with Quick Search */}
          {currentStep === 'service' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Smartphone className="w-4 h-4 mr-1.5" />
                  Select Service
                </h3>
                <button
                  onClick={() => setCurrentStep('country')}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Change Country
                </button>
              </div>
              
              <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300 text-xs">
                  ✨ Auto Mode: {selectedCountry?.flag} {selectedCountry?.name} - Popular services prioritized
                </p>
              </div>
              
              {/* Quick Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search (WhatsApp, Telegram, Signal, Tinder, Google, Facebook, TikTok...)"
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading services from all providers...</span>
                </div>
              ) : (
                <>
                  {/* Service Comparison View */}
                  <div className="max-h-80 overflow-y-auto">
                    {(() => {
                      // Group services by name for comparison
                      const serviceGroups: { [key: string]: { service: SmsService; provider: string }[] } = {};
                      
                      servicesByProvider.forEach(providerGroup => {
                        providerGroup.services.forEach(service => {
                          const serviceName = service.name.toLowerCase();
                          if (serviceName.includes(serviceSearchTerm.toLowerCase()) || 
                              service.service.toLowerCase().includes(serviceSearchTerm.toLowerCase())) {
                            if (!serviceGroups[service.name]) {
                              serviceGroups[service.name] = [];
                            }
                            serviceGroups[service.name].push({ service, provider: providerGroup.provider });
                          }
                        });
                      });

                      // Sort services by name, then by price within each group
                      const sortedServiceNames = Object.keys(serviceGroups).sort();
                      
                      return sortedServiceNames.map(serviceName => {
                        const options = serviceGroups[serviceName].sort((a, b) => a.service.cost - b.service.cost);
                        const isWhatsApp = serviceName.toLowerCase().includes('whatsapp');
                        const isTelegram = serviceName.toLowerCase().includes('telegram');
                        const isSignal = serviceName.toLowerCase().includes('signal');
                        const isTinder = serviceName.toLowerCase().includes('tinder');
                        const isGoogle = serviceName.toLowerCase().includes('google');
                        const isFacebook = serviceName.toLowerCase().includes('facebook');

                        return (
                          <div key={serviceName} className="mb-4 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            {/* Service Header */}
                            <div className={`p-3 ${
                              isWhatsApp 
                                ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700' 
                                : isTelegram
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700'
                                : isSignal
                                ? 'bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-700'
                                : 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {serviceName}
                                  </h3>
                                  {isWhatsApp && <span className="text-sm">🔥</span>}
                                  {isTelegram && <span className="text-sm">📱</span>}
                                  {isSignal && <span className="text-sm">🔒</span>}
                                  {isTinder && <span className="text-sm">💕</span>}
                                  {isGoogle && <span className="text-sm">🔍</span>}
                                  {isFacebook && <span className="text-sm">👥</span>}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {options.length} provider{options.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>

                            {/* Provider Options */}
                            <div className="divide-y divide-gray-200 dark:divide-gray-600">
                              {options.map((option, index) => {
                                const isBestPrice = index === 0; // First option is cheapest
                                const isMostAvailable = option.service.count === Math.max(...options.map(o => o.service.count));
                                
                                return (
                                  <button
                                    key={`${option.provider}-${option.service.id || option.service.service}`}
                                    onClick={() => handleServiceSelect(option.service, option.provider)}
                                    className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                      isBestPrice ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                                            {option.service.provider_name || smsApiService.getProviderDisplayName(option.provider)}
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {option.service.count > 0 ? `${option.service.count} available` : 'Auto'}
                                          </span>
                                        </div>
                                        {isBestPrice && (
                                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                            Best Price
                                          </span>
                                        )}
                                        {isMostAvailable && option.service.count > 0 && (
                                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                            Most Available
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <div className="text-green-600 dark:text-green-400 font-bold text-lg">
                                          ₦{option.service.cost.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          Click to select
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  
                  {servicesByProvider.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                      {serviceSearchTerm 
                        ? `No services found matching "${serviceSearchTerm}"`
                        : `No services available for ${selectedCountry?.name} from any provider`
                      }
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Order Summary */}
          {currentStep === 'summary' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Country:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedCountry?.flag} {selectedCountry?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">₦{selectedService?.cost}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    * Minimum ₦1,500 pricing applied
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                      {selectedService?.provider_name || smsApiService.getProviderDisplayName(selectedProvider)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentStep('service')}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all border border-gray-300 dark:border-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-sm bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white rounded-lg transition-all font-medium"
                >
                  {isLoading ? 'Creating Order...' : 'Confirm & Get Number'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Phone Number Display */}
          {currentStep === 'phone' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Phone className="w-4 h-4 mr-1.5" />
                Your Virtual Number
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 mb-4 text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">{phoneNumber}</div>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">Use this number for verification</p>
                <button
                  onClick={copyPhoneNumber}
                  className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all flex items-center mx-auto"
                >
                  <Copy className="w-3 h-3 mr-1.5" />
                  Copy Number
                </button>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-2 text-sm">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Waiting for SMS/OTP...
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Auto-detection enabled
                </div>
              </div>
            </div>
          )}

          {/* Step 5: SMS Code Received */}
          {currentStep === 'waiting' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />
                SMS Code Received!
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">{smsCode}</div>
                <p className="text-gray-600 dark:text-gray-400 text-xs">Use this code to complete verification</p>
              </div>
              <div className="text-center space-y-2">
                <button
                  onClick={resetFlow}
                  className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all"
                >
                  Get Another Number
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Order ID: {orderId}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualNumberModal;