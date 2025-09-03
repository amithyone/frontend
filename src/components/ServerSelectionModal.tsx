import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { X, Server, CheckCircle, MapPin, Activity, Globe, Smartphone, Phone, Clock } from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { smsApiService, SmsService as SmsServiceType, SmsCountry } from '../services/smsApi';

interface ServerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'server' | 'details' | 'review' | 'phone' | 'waiting';

const nameToProviderSlug = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('tiger')) return 'tiger_sms';
  if (n.includes('5sim')) return '5sim';
  if (n.includes('dassy')) return 'dassy';
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
      const token = localStorage.getItem('auth_token') || '';
      if (!token) return;
      // Prewarm providers
      await fetch(`${API_BASE_URL}/sms/providers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }).then(r => r.json()).then(j => {
        const list: any[] = Array.isArray(j?.data) ? j.data : [];
        const ordered = list.map((s: any, idx: number) => ({
          id: s.id ?? idx + 1,
          name: s.name || s.provider || 'SMS Provider',
          success_rate: s.success_rate ?? 95,
          total_orders: s.total_orders ?? 0,
          status: s.status || 'available',
          location: s.region || s.location || 'Global',
          provider: nameToProviderSlug(s.name || s.provider || ''),
        }));
        cacheSet('sms:providers', ordered, 5 * 60 * 1000);
        // Prewarm first provider countries
        const first = ordered[0]?.provider;
        if (first) {
          smsApiService.getCountries(first).then(c => cacheSet(`sms:countries:${first}`, c, 5 * 60 * 1000)).catch(() => {});
        }
      }).catch(() => {});
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
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
      // Serve from cache immediately
      const cachedProviders = cacheGet('sms:providers');
      if (cachedProviders) {
        setServers(cachedProviders);
      }
      const resp = await fetch(`${API_BASE_URL}/sms/providers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      const data = await resp.json();
      const list: any[] = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      const ordered = list
        .sort((a, b) => {
          const an = (a.name || a.provider || '').toLowerCase();
          const bn = (b.name || b.provider || '').toLowerCase();
          const at = an.includes('tiger') ? -1 : 0;
          const bt = bn.includes('tiger') ? -1 : 0;
          if (at !== bt) return at - bt;
          return an.localeCompare(bn);
        })
        .map((s, idx) => ({
          id: s.id ?? idx + 1,
          name: s.name || s.provider || 'SMS Provider',
          success_rate: s.success_rate ?? 95,
          total_orders: s.total_orders ?? 0,
          status: s.status || 'available',
          location: s.region || s.location || 'Global',
          provider: nameToProviderSlug(s.name || s.provider || ''),
        }));
      setServers(ordered);
      cacheSet('sms:providers', ordered, 5 * 60 * 1000);
    } catch (error) {
      console.error('Error loading servers:', error);
      setServers([
        { id: 1, name: 'Tiger SMS', success_rate: 98, total_orders: 1250, status: 'active', location: 'Global', provider: 'tiger_sms' },
        { id: 2, name: '5SIM', success_rate: 96, total_orders: 1040, status: 'active', location: 'Global', provider: '5sim' },
        { id: 3, name: 'Dassy', success_rate: 94, total_orders: 800, status: 'active', location: 'Global', provider: 'dassy' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (server: any) => {
    try {
      setLoadingDetails(true);
      const provider = server.provider || nameToProviderSlug(server.name || '');
      // Provider-scoped countries (cached)
      const countriesCacheKey = `sms:countries:${provider}`;
      const cachedCountries = cacheGet(countriesCacheKey);
      const scopedCountries = cachedCountries || await smsApiService.getCountries(provider);
      const initialCountry = (
        scopedCountries.find(c => (c.name || '').toLowerCase() === 'nigeria') || scopedCountries[0]
      )?.code || '';
      let providerServices: SmsServiceType[] = [];
      if (initialCountry) {
        const svcCacheKey = `sms:services:${provider}:${initialCountry}`;
        const cachedSvcs = cacheGet(svcCacheKey);
        providerServices = cachedSvcs || await smsApiService.getServices(initialCountry, provider);
        if (!cachedSvcs) cacheSet(svcCacheKey, providerServices, 60 * 1000);
      }
      setCountries(scopedCountries);
      setServices(providerServices);
      setSelectedCountry(initialCountry);
      setSelectedService(providerServices[0]?.service || '');
      if (!cachedCountries) cacheSet(countriesCacheKey, scopedCountries, 5 * 60 * 1000);
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
      const svcCacheKey = `sms:services:${provider}:${countryCode}`;
      const cachedSvcs = cacheGet(svcCacheKey);
      const svc = cachedSvcs || await smsApiService.getServices(countryCode, provider);
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
      const cbsCacheKey = `sms:countriesByService:${provider}:${serviceCode}`;
      const cachedRows = cacheGet(cbsCacheKey);
      const rows = cachedRows || await smsApiService.getCountriesByService(serviceCode, provider);
      setFilteredCountries(rows);
      const first = rows[0]?.country_id || '';
      if (first) {
        setSelectedCountry(first);
      }
      if (!cachedRows) cacheSet(cbsCacheKey, rows, 60 * 1000);
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
      <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border transition-colors ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {step === 'server' && 'Select Server'}
              {step === 'details' && 'Select Service & Country'}
              {step === 'review' && 'Review Selection'}
              {step === 'phone' && 'Your Number'}
              {step === 'waiting' && 'Waiting for SMS'}
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {step === 'server' && 'Choose your preferred SMS provider'}
              {step === 'details' && 'Pick a service and country. Prices shown are per number.'}
              {step === 'review' && 'Confirm your choices before continuing'}
              {step === 'phone' && 'Use this number for verification. We will poll for SMS.'}
              {step === 'waiting' && 'We are polling for the SMS code. This may take a while.'}
            </p>
          </div>
          <button onClick={onClose} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'server' && (
            <>
          {loading ? (
                <div className={`text-center py-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading servers...</div>
          ) : (
            <>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedServer?.id === server.id
                            ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')
                            : (isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50')
                    }`}
                    onClick={() => handleServerSelect(server)}
                  >
                    <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                            }`}>
                              <Server className={`${isDark ? 'text-purple-300' : 'text-purple-600'} w-5 h-5`} />
                        </div>
                        <div>
                              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{server.name}</h4>
                              <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <MapPin className="w-3.5 h-3.5" /> {server.location}
                              </div>
                        </div>
                      </div>
                      <div className="text-right">
                            <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-green-400' : 'text-green-600'} mb-1`}>
                              <CheckCircle className="w-4 h-4" /> {server.success_rate}% Success
                        </div>
                            <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs flex items-center gap-1`}>
                              <Activity className="w-3.5 h-3.5" /> {server.total_orders} orders
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmServer}
                      disabled={!selectedServer || confirmLoading}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                        selectedServer && !confirmLoading
                          ? (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                          : (isDark ? 'bg-blue-600/50 text-white/70' : 'bg-blue-400/50 text-white')
                      }`}
                    >
                      {confirmLoading ? (
                        <span className="inline-block h-4 w-4 mr-2 align-[-2px] animate-spin border-2 border-white border-t-transparent rounded-full" />
                      ) : null}
                      {confirmLoading ? 'Loading…' : 'Continue'}
                    </button>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Smartphone className="w-4 h-4" />
                        <span className="font-semibold">Service</span>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {services.map((svc) => (
                          <label
                            key={svc.service}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                              selectedService === svc.service
                                ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')
                                : (isDark ? 'bg-gray-900/40 border-gray-700 hover:bg-gray-900/60' : 'bg-white border-gray-200 hover:bg-white')
                            }`}
                          >
                            <div>
                              <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{svc.name}</div>
                              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Provider: {svc.provider_name}</div>
                            </div>
                            <div className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-semibold`}>₦{Number(svc.cost).toLocaleString()}</div>
                            <input
                              type="radio"
                              name="service"
                              className="hidden"
                              checked={selectedService === svc.service}
                              onChange={() => onServiceChange(svc.service)}
                            />
                          </label>
                        ))}
                        {services.length === 0 && (
                          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No services found for this selection.</div>
                        )}
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Globe className="w-4 h-4" />
                        <span className="font-semibold">Country</span>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {(filteredCountries.length > 0 ? filteredCountries.map(c => ({ code: c.country_id, name: c.country_name })) : countries).map((c) => (
                          <label
                            key={c.code}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                              selectedCountry === c.code
                                ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300')
                                : (isDark ? 'bg-gray-900/40 border-gray-700 hover:bg-gray-900/60' : 'bg-white border-gray-200 hover:bg-white')
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{c.flag || '🌍'}</span>
                              <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{c.name} <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>({c.code})</span></div>
                            </div>
                            <input
                              type="radio"
                              name="country"
                              className="hidden"
                              checked={selectedCountry === c.code}
                              onChange={() => onCountryChange(c.code)}
                            />
                          </label>
                        ))}
                        {countries.length === 0 && (
                          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No countries available.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('server')}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('review')}
                      disabled={!selectedService || !selectedCountry}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                        selectedService && selectedCountry
                          ? (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')
                          : (isDark ? 'bg-blue-600/50 text-white/70' : 'bg-blue-400/50 text-white')
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {step === 'review' && (
            <>
              <div className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Server</div>
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{selectedServer?.name}</div>
                  </div>
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Country</div>
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{selectedCountry}</div>
                  </div>
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Service</div>
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{services.find(s => s.service === selectedService)?.name || selectedService}</div>
                  </div>
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Estimated Price</div>
                    <div className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-semibold`}>₦{Number(services.find(s => s.service === selectedService)?.cost || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              {error && (
                <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>{error}</div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Back
                </button>
                <button
                  onClick={createOrder}
                  disabled={!selectedService || !selectedCountry || creating}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    (!selectedService || !selectedCountry || creating)
                      ? (isDark ? 'bg-green-600/50 text-white/70' : 'bg-green-400/50 text-white')
                      : (isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')
                  }`}
                >
                  {creating ? (
                    <span className="inline-block h-4 w-4 mr-2 align-[-2px] animate-spin border-2 border-white border-t-transparent rounded-full" />
                  ) : null}
                  {creating ? 'Creating…' : 'Confirm & Get Number'}
                </button>
              </div>
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
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>We are polling your order for the SMS code. You can keep this modal open or close it; your Inbox will update once the code arrives.</div>
              {phoneNumber ? (
                <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-900/40 border border-gray-700 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                  <div className="text-sm opacity-70 mb-1">Phone Number</div>
                  <div className="text-xl font-semibold">{phoneNumber}</div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerSelectionModal;