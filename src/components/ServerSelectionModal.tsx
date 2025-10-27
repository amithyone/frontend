import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { X, Server, CheckCircle, MapPin, Globe, Smartphone, Phone, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { smsApiService, SmsService as SmsServiceType, SmsCountry } from '../services/smsApi';

interface ServerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'server' | 'details' | 'review' | 'phone' | 'waiting';

const nameToProviderSlug = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('fadded global') || n.includes('tiger')) return 'tiger_sms';
  if (n.includes('fadded sim') || n.includes('5sim')) return '5sim';
  if (n.includes('fadded usa only') || n.includes('dassy')) return 'dassy';
  if (n.includes('fadded pool') || n.includes('global 2') || n.includes('smspool')) return 'smspool';
  if (n.includes('fadded verified') || n.includes('verified') || n.includes('textverified')) return 'textverified';
  return 'tiger_sms';
};

const ServerSelectionModal: React.FC<ServerSelectionModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState<Step>('server');

  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<any>(null);

  const [countries, setCountries] = useState<SmsCountry[]>([]);
  const [services, setServices] = useState<SmsServiceType[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Array<{ country_id: string; country_name: string; cost: number; count: number; provider: string }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const [creating, setCreating] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [serviceQuery, setServiceQuery] = useState<string>('');
  const [countryQuery, setCountryQuery] = useState<string>('');

  // Simple localStorage cache with TTL
  const cacheGet = (key: string): any | null => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { v, t, ttl } = JSON.parse(raw);
      if (!t || !ttl || Date.now() - t > ttl) return null;
      return v;
    } catch {
      return null;
    }
  };
  const cacheSet = (key: string, v: any, ttlMs = 5 * 60 * 1000) => {
    try {
      localStorage.setItem(key, JSON.stringify({ v, t: Date.now(), ttl: ttlMs }));
    } catch {}
  };

  // Prewarm caches in background
  const prewarm = async () => {
    try {
      // Prewarm servers via the new getServers method
      const servers = await smsApiService.getServers();
      const ordered = servers
        .sort((a, b) => {
          if (a.priority !== b.priority) return (a.priority || 999) - (b.priority || 999);
          return (b.success_rate || 0) - (a.success_rate || 0);
        })
        .map((server: any) => ({
          id: server.id,
          name: server.display_name || server.name || 'SMS Provider',
          success_rate: server.success_rate || 95,
          total_orders: server.total_orders || 0,
          successful_orders: server.successful_orders || 0,
          status: server.status || 'active',
          location: server.location || server.region || 'Global',
          provider: server.provider || 'tiger_sms',
          priority: server.priority || 999,
        }));
      cacheSet('sms:servers', ordered, 5 * 60 * 1000);
      // Prewarm first provider countries
      const first = ordered[0]?.provider;
      if (first) {
        smsApiService.getCountries(first).then(c => cacheSet(`sms:countries:${first}`, c, 5 * 60 * 1000)).catch(() => {});
      }
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      setStep('server');
      setSelectedServer(null);
      setSelectedCountry('');
      setSelectedService('');
      setOrderId('');
      setPhoneNumber('');
      setError('');
      loadServers();
      prewarm();
    }
  }, [isOpen]);

  const loadServers = async () => {
    try {
      setLoading(true);
      // Serve from cache immediately
      const cachedServers = cacheGet('sms:servers');
      if (cachedServers) {
        setServers(cachedServers);
        // Keep loading true for background refresh, UI will not block since servers.length > 0
      }
      
      // Use the new getServers method that calls /api/servers
      const serverList = await smsApiService.getServers();
      
      const ordered = serverList
        .sort((a, b) => {
          // Sort by priority first, then by success rate
          if (a.priority !== b.priority) return (a.priority || 999) - (b.priority || 999);
          return (b.success_rate || 0) - (a.success_rate || 0);
        })
        .map((server: any) => ({
          id: server.id,
          name: server.display_name || server.name || 'SMS Provider',
          success_rate: server.success_rate || 95,
          total_orders: server.total_orders || 0,
          successful_orders: server.successful_orders || 0,
          status: server.status || 'active',
          location: server.location || server.region || 'Global',
          provider: server.provider || 'tiger_sms',
          priority: server.priority || 999,
        }));
      
      setServers(ordered);
      cacheSet('sms:servers', ordered, 5 * 60 * 1000);
    } catch (error) {
      console.error('Error loading servers:', error);
      // Fallback to mock data if API fails
      setServers([
        { id: 1, name: 'FADDED GLOBAL', success_rate: 98.5, total_orders: 1250, successful_orders: 1188, status: 'active', location: 'Global', provider: 'tiger_sms', priority: 1 },
        { id: 2, name: 'FADDED SIM', success_rate: 96, total_orders: 1040, successful_orders: 998, status: 'active', location: 'Global', provider: '5sim', priority: 2 },
        { id: 3, name: 'FADDED USA ONLY', success_rate: 94, total_orders: 800, successful_orders: 752, status: 'active', location: 'Global', provider: 'dassy', priority: 3 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (server: any) => {
    try {
      setLoadingDetails(true);
      // Use server.provider directly - it's more reliable than guessing from name
      const provider = server.provider || nameToProviderSlug(server.name || '');
      console.log('Loading details for server:', server.name, 'Provider:', provider);
      
      // Clear filtered countries when switching providers
      setFilteredCountries([]);
      
      // Provider-scoped countries (cached)
      const countriesCacheKey = `sms:countries:${provider}`;
      const cachedCountries = cacheGet(countriesCacheKey);
      const scopedCountriesRaw = cachedCountries || await smsApiService.getCountries(provider);
      // Normalize country display to full name and flag for better UX
      const scopedCountries = (scopedCountriesRaw || []).map((c: SmsCountry) => {
        const info = smsApiService.getCountryDisplayInfo(c.code);
        return { ...c, name: info.name, flag: info.flag } as SmsCountry;
      });
      
      // For DASSY (FADDED USA ONLY), ensure we only show US countries
      const filteredScopedCountries = provider === 'dassy' 
        ? scopedCountries.filter((c: SmsCountry) => c.code === '187' || c.code === 'US')
        : scopedCountries;
      
      console.log('DASSY filtered countries:', filteredScopedCountries);
      
      // Prefer US/UK by default (handle multiple code variants), else first available
      const preferredCountryCodes = ['US', '1001', '1', 'GB', '3', 'UK'];
      let initialCountry = '';
      for (const pref of preferredCountryCodes) {
        const hit = filteredScopedCountries.find((c: SmsCountry) => (c.code || '').toUpperCase() === pref);
        if (hit) { initialCountry = hit.code; break; }
      }
      if (!initialCountry && filteredScopedCountries.length > 0) {
        initialCountry = filteredScopedCountries[0].code;
      }
      
      let providerServices: SmsServiceType[] = [];
      if (initialCountry) {
        const svcCacheKey = `sms:services:${provider}:${initialCountry}`;
        const cachedSvcs = cacheGet(svcCacheKey);
        providerServices = (cachedSvcs || await smsApiService.getServices(initialCountry, provider))
          // Hard filter to ensure only services for the selected provider are shown
          .filter((svc: any) => (svc?.provider || provider) === provider);
        if (!cachedSvcs) cacheSet(svcCacheKey, providerServices, 60 * 1000);
      }
      setCountries(filteredScopedCountries);
      setServices(providerServices);
      setSelectedCountry(initialCountry);
      setSelectedService(providerServices[0]?.service || '');
      if (!cachedCountries) cacheSet(countriesCacheKey, filteredScopedCountries, 5 * 60 * 1000);
    } catch (e: any) {
      setError(e?.message || 'Failed to load provider details');
      setCountries([]);
      setServices([]);
      setSelectedCountry('');
      setSelectedService('');
    } finally {
      setLoadingDetails(false);
    }
  };

  const onCountryChange = async (countryCode: string) => {
    try {
      setSelectedCountry(countryCode);
      setLoadingDetails(true);
      const provider = selectedServer?.provider || nameToProviderSlug(selectedServer?.name || '');
      console.log('Country change - Provider:', provider, 'Country:', countryCode);
      const svcCacheKey = `sms:services:${provider}:${countryCode}`;
      const cachedSvcs = cacheGet(svcCacheKey);
      const svc = (cachedSvcs || await smsApiService.getServices(countryCode, provider))
        // Hard filter to ensure only services for the selected provider are shown
        .filter((row: any) => (row?.provider || provider) === provider);
      setServices(svc);
      setSelectedService(svc[0]?.service || '');
      if (!cachedSvcs) cacheSet(svcCacheKey, svc, 60 * 1000);
    } catch (e) {
      console.error('Error loading services for country:', e);
      setServices([]);
      setSelectedService('');
    } finally {
      setLoadingDetails(false);
    }
  };

  const onServiceChange = async (serviceCode: string) => {
    try {
      setSelectedService(serviceCode);
      setLoadingDetails(true);
      const provider = selectedServer?.provider || nameToProviderSlug(selectedServer?.name || '');
      console.log('Service change - Provider:', provider, 'Service:', serviceCode);
      console.log('Selected server:', selectedServer);
      
      const cbsCacheKey = `sms:countriesByService:${provider}:${serviceCode}`;
      const cachedRows = cacheGet(cbsCacheKey);
      const rows = cachedRows || await smsApiService.getCountriesByService(serviceCode, provider);
      
      console.log('Raw countries from API:', rows);
      
      // For DASSY (FADDED USA ONLY), ensure we only show US countries even for services
      const filteredRows = provider === 'dassy' 
        ? rows.filter((row: any) => row.country_id === '187' || row.country_id === 'US')
        : rows;
      
      console.log('Filtered countries for DASSY:', filteredRows);
      
      setFilteredCountries(filteredRows);
      // Prefer US/UK if present in filteredRows
      const preferredCountryCodes = ['US', '1001', '1', 'GB', '3', 'UK'];
      let pick = '';
      for (const pref of preferredCountryCodes) {
        const hit = filteredRows.find((r: any) => (r.country_id || '').toUpperCase() === pref);
        if (hit) { pick = hit.country_id; break; }
      }
      if (!pick) {
        pick = filteredRows[0]?.country_id || '';
      }
      if (pick) {
        setSelectedCountry(pick);
        console.log('Selected country after service change:', pick);
      }
      if (!cachedRows) cacheSet(cbsCacheKey, filteredRows, 60 * 1000);
    } catch (e) {
      console.error('Error loading countries by service:', e);
      setFilteredCountries([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleServerSelect = (server: any) => {
    setSelectedServer(server);
  };

  const handleConfirmServer = async () => {
    if (!selectedServer) return;
    setConfirmLoading(true);
    try {
      await loadDetails(selectedServer);
      setStep('details');
    } finally {
      setConfirmLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      setCreating(true);
      setError('');
      toast.loading('Creating order…', { id: 'create-order' });
      const provider = selectedServer?.provider || nameToProviderSlug(selectedServer?.name || '');
      console.log('Creating order - Provider:', provider, 'Country:', selectedCountry, 'Service:', selectedService);
      const order = await smsApiService.createOrder(selectedCountry, selectedService, 'manual', provider);
      setOrderId(order.order_id);
      setPhoneNumber(order.phone_number);
      setStep('phone');
      setTimeout(pollForSms, 1500);
      toast.success('Number acquired', { id: 'create-order' });
    } catch (e: any) {
      setError(e?.message || 'Failed to create order');
      toast.error(e?.message || 'Failed to create order', { id: 'create-order' });
    } finally {
      setCreating(false);
    }
  };

  const pollForSms = async () => {
    try {
      setStep('waiting');
      const code = await smsApiService.pollForSmsCode(orderId, 60, 3000);
      if (code) onClose();
    } catch (e) {
      console.warn('Polling ended without code:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <Toaster richColors position="top-center" />
      <div className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border transition-colors ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-3 md:p-4 border-b flex-shrink-0 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {step === 'server' && 'Select Server'}
              {step === 'details' && 'Select Service & Country'}
              {step === 'review' && 'Review Selection'}
              {step === 'phone' && 'Your Number'}
              {step === 'waiting' && 'Waiting for SMS'}
            </h2>
            <p className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {step === 'server' && 'Choose your preferred SMS provider'}
              {step === 'details' && 'Pick a service and country'}
              {step === 'review' && 'Confirm your choices'}
              {step === 'phone' && 'Use this number for verification'}
              {step === 'waiting' && 'Polling for SMS code...'}
            </p>
          </div>
          <button onClick={onClose} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {step === 'server' && (
            <>
          {loading && servers.length === 0 ? (
                <div className={`text-center py-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading servers...</div>
          ) : (
            <>
                  <div className="grid grid-cols-1 gap-3">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className={`p-2.5 md:p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedServer?.id === server.id
                            ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')
                            : (isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50')
                    }`}
                    onClick={() => handleServerSelect(server)}
                  >
                    <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                            }`}>
                              <Server className={`${isDark ? 'text-purple-300' : 'text-purple-600'} w-4 h-4`} />
                        </div>
                        <div>
                              <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{server.name}</h4>
                              <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <MapPin className="w-3 h-3" /> {server.location}
                              </div>
                              {/* Special indicator for FADDED VERIFIED - Financial services only */}
                              {server.name && server.name.toLowerCase().includes('verified') && (
                                <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  isDark ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                }`}>
                                  💰 Financial Services Only
                                </div>
                              )}
                              {/* Special indicator for Global/US providers - Messaging apps */}
                              {server.name && (server.name.toLowerCase().includes('global') || server.name.toLowerCase().includes('usa only') || server.name.toLowerCase().includes('sim')) && (
                                <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  isDark ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-green-100 text-green-800 border border-green-300'
                                }`}>
                                  📱 WhatsApp & Telegram Available
                                </div>
                              )}
                        </div>
                      </div>
                      <div className="text-right">
                            <div className={`flex items-center gap-1 text-xs font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                              <CheckCircle className="w-3.5 h-3.5" /> {server.success_rate}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </>
              )}
            </>
          )}

          {step === 'details' && (
            <>
              {loadingDetails ? (
                <div className={`text-center py-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading services and countries...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Smartphone className="w-4 h-4" />
                        <span className="text-sm font-semibold">Service</span>
                      </div>
                      <input
                        type="text"
                        value={serviceQuery}
                        onChange={(e) => setServiceQuery(e.target.value)}
                        placeholder="Search services..."
                        className={`w-full mb-2 px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {services
                          .filter((svc) => {
                            if (!serviceQuery) return true;
                            const q = serviceQuery.toLowerCase();
                            return (
                              (svc.name || '').toLowerCase().includes(q) ||
                              (svc.service || '').toLowerCase().includes(q) ||
                              (svc.provider_name || '').toLowerCase().includes(q)
                            );
                          })
                          .map((svc) => (
                          <label
                            key={svc.service}
                            className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${
                              selectedService === svc.service
                                ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')
                                : (isDark ? 'bg-gray-900/40 border-gray-700 hover:bg-gray-900/60' : 'bg-white border-gray-200 hover:bg-white')
                            }`}
                          >
                            <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium`}>{svc.name}</div>
                            <div className={`${isDark ? 'text-blue-300' : 'text-blue-700'} text-sm font-semibold`}>₦{Number(svc.cost).toLocaleString()}</div>
                            <input
                              type="radio"
                              name="service"
                              className="hidden"
                              checked={selectedService === svc.service}
                              onChange={() => onServiceChange(svc.service)}
                            />
                          </label>
                        ))}
                        {services.filter((svc) => {
                          if (!serviceQuery) return true;
                          const q = serviceQuery.toLowerCase();
                          return (
                            (svc.name || '').toLowerCase().includes(q) ||
                            (svc.service || '').toLowerCase().includes(q) ||
                            (svc.provider_name || '').toLowerCase().includes(q)
                          );
                        }).length === 0 && (
                          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No services found for this selection.</div>
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-semibold">Country</span>
                      </div>
                      <input
                        type="text"
                        value={countryQuery}
                        onChange={(e) => setCountryQuery(e.target.value)}
                        placeholder="Search countries..."
                        className={`w-full mb-2 px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {(() => {
                          const provider = selectedServer?.provider || nameToProviderSlug(selectedServer?.name || '');
                          const displayCountries = filteredCountries.length > 0
                            ? filteredCountries.map((c: { country_id: string; country_name: string }) => {
                                const info = smsApiService.getCountryDisplayInfo(c.country_id);
                                return { code: c.country_id, name: info.name, flag: info.flag };
                              })
                            : countries;
                          
                          console.log('Country display debug:', {
                            provider,
                            filteredCountries: filteredCountries.length,
                            generalCountries: countries.length,
                            displayCountries: displayCountries.length,
                            selectedServer: selectedServer?.name
                          });
                          
                          return displayCountries
                            .filter((c: any) => {
                              if (!countryQuery) return true;
                              const q = countryQuery.toLowerCase();
                              return (
                                (c.name || '').toLowerCase().includes(q) ||
                                (c.code || '').toLowerCase().includes(q)
                              );
                            })
                            .map((c: any) => {
                            const flag = typeof c.flag === 'string' ? c.flag : '🌍';
                            return (
                              <label
                                key={c.code}
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  selectedCountry === c.code
                                    ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')
                                    : (isDark ? 'bg-gray-900/40 border-gray-700 hover:bg-gray-900/60' : 'bg-white border-gray-200 hover:bg-white')
                                }`}
                              >
                                <span className="text-base">{flag}</span>
                                <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium flex-1`}>{c.name}</div>
                                <input
                                  type="radio"
                                  name="country"
                                  className="hidden"
                                  checked={selectedCountry === c.code}
                                  onChange={() => onCountryChange(c.code)}
                                />
                              </label>
                            );
                          });
                        })()}
                        {countries.length === 0 && (
                          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No countries available.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 'review' && (
            <>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Server</div>
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{selectedServer?.name}</div>
                  </div>
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Country</div>
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>
                      {(() => {
                        const countryInfo = smsApiService.getCountryDisplayInfo(selectedCountry);
                        return `${countryInfo.flag} ${countryInfo.name}`;
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Service</div>
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{services.find(s => s.service === selectedService)?.name || selectedService}</div>
                  </div>
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Price</div>
                    <div className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-semibold`}>₦{Number(services.find(s => s.service === selectedService)?.cost || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              {error && (
                <div className={`p-3 rounded-lg mt-4 ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>{error}</div>
              )}
            </>
          )}

          {step === 'phone' && (
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Phone className="w-4 h-4" />
                <span className="font-semibold">Your Number</span>
              </div>
              <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-2`}>{phoneNumber || '—'}</div>
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>We will start polling for the SMS automatically.</div>
            </div>
          )}

          {step === 'waiting' && (
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Waiting for SMS</span>
              </div>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>We are polling your order for the SMS code. Use the phone number below to request for verification code. You can keep this modal open or close it; your Inbox will update once the code arrives.</div>
              {phoneNumber ? (
                <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-900/40 border border-gray-700 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                  <div className="text-sm opacity-70 mb-1">Phone Number</div>
                  <div className="text-xl font-semibold">{phoneNumber}</div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer - Fixed buttons */}
        {(step === 'server' || step === 'details' || step === 'review') && (
          <div className={`flex gap-2 p-2.5 md:p-3 border-t flex-shrink-0 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            {step === 'server' && (
              <>
                <button
                  onClick={onClose}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmServer}
                  disabled={!selectedServer || confirmLoading}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                    selectedServer && !confirmLoading
                      ? (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                      : (isDark ? 'bg-blue-600/50 text-white/70' : 'bg-blue-400/50 text-white')
                  }`}
                >
                  {confirmLoading ? (
                    <span className="inline-block h-3 w-3 mr-1 align-[-2px] animate-spin border-2 border-white border-t-transparent rounded-full" />
                  ) : null}
                  {confirmLoading ? 'Loading…' : 'Continue'}
                </button>
              </>
            )}

            {step === 'details' && (
              <>
                <button
                  onClick={() => setStep('server')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('review')}
                  disabled={!selectedService || !selectedCountry}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                    selectedService && selectedCountry
                      ? (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                      : (isDark ? 'bg-blue-600/50 text-white/70' : 'bg-blue-400/50 text-white')
                  }`}
                >
                  Continue
                </button>
              </>
            )}

            {step === 'review' && (
              <>
                <button
                  onClick={() => setStep('details')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Back
                </button>
                <button
                  onClick={createOrder}
                  disabled={!selectedService || !selectedCountry || creating}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                    (!selectedService || !selectedCountry || creating)
                      ? (isDark ? 'bg-green-600/50 text-white/70' : 'bg-green-400/50 text-white')
                      : (isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')
                  }`}
                >
                  {creating ? (
                    <span className="inline-block h-3 w-3 mr-1 align-[-2px] animate-spin border-2 border-white border-t-transparent rounded-full" />
                  ) : null}
                  {creating ? 'Creating…' : 'Get Number'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerSelectionModal;