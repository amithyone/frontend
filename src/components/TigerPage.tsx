import React, { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { smsApiService, SmsService as SmsServiceType, SmsCountry } from '../services/smsApi';
import { Smartphone, Globe, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from './Navigation';
import BottomNavigation from './BottomNavigation';

const TigerPage: React.FC = () => {
  const { isDark } = useTheme();
  const [countries, setCountries] = useState<SmsCountry[]>([]);
  const [services, setServices] = useState<SmsServiceType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [serviceQuery, setServiceQuery] = useState<string>('');
  const [countryQuery, setCountryQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const provider = 'tiger_sms';
        const c = await smsApiService.getCountries(provider);
        if (!mounted) return;
        const mapped = (c || []).map((row: SmsCountry) => {
          const info = smsApiService.getCountryDisplayInfo(row.code);
          return { ...row, name: info.name, flag: info.flag } as SmsCountry;
        });
        setCountries(mapped);

        // Prefer US/UK by default if present
        const pref = ['US', '1001', '1', 'GB', '3', 'UK'];
        let initialCountry = '';
        for (const p of pref) {
          const hit = mapped.find((cc) => (cc.code || '').toUpperCase() === p);
          if (hit) { initialCountry = hit.code; break; }
        }
        if (!initialCountry && mapped.length > 0) initialCountry = mapped[0].code;
        setSelectedCountry(initialCountry);

        if (initialCountry) {
          const svc = await smsApiService.getServices(initialCountry, provider);
          if (!mounted) return;
          setServices(svc);
          const wa = svc.find(s => (s.service || '').toLowerCase().includes('wa') || (s.name || '').toLowerCase().includes('whatsapp'));
          setSelectedService(wa?.service || svc[0]?.service || '');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load Fadded Global countries/services');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const displayCountries = useMemo(() => {
    return countries.map((c) => {
      const info = smsApiService.getCountryDisplayInfo(c.code);
      return { code: c.code, name: info.name, flag: info.flag };
    });
  }, [countries]);

  const filteredCountries = useMemo(() => {
    const q = (countryQuery || '').toLowerCase();
    if (!q) return displayCountries;
    return displayCountries.filter((c) => (c.name || '').toLowerCase().includes(q));
  }, [displayCountries, countryQuery]);

  const filteredServices = useMemo(() => {
    const q = (serviceQuery || '').toLowerCase();
    if (!q) return services;
    return services.filter((s) => (s.name || '').toLowerCase().includes(q) || (s.service || '').toLowerCase().includes(q));
  }, [services, serviceQuery]);

  const onCountryChange = async (countryCode: string) => {
    try {
      setSelectedCountry(countryCode);
      setLoading(true);
      const svc = await smsApiService.getServices(countryCode, 'tiger_sms');
      setServices(svc);
      const wa = svc.find(s => (s.service || '').toLowerCase().includes('wa') || (s.name || '').toLowerCase().includes('whatsapp'));
      setSelectedService(wa?.service || svc[0]?.service || '');
    } catch (e: any) {
      setError(e?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      setCreating(true);
      setError('');
      toast.loading('Creating Fadded Global order…', { id: 'create-order' });
      const order = await smsApiService.createOrder(selectedCountry, selectedService, 'manual', 'tiger_sms');
      setOrderId(order.order_id);
      setPhoneNumber(order.phone_number);
      toast.success('Number acquired', { id: 'create-order' });
    } catch (e: any) {
      setError(e?.message || 'Failed to create order');
      toast.error(e?.message || 'Failed to create order', { id: 'create-order' });
    } finally {
      setCreating(false);
    }
  };

  const pollForSms = async () => {
    if (!orderId) return;
    try {
      toast.loading('Waiting for SMS…', { id: 'poll' });
      const code = await smsApiService.pollForSmsCode(orderId, 60, 3000);
      if (code) {
        toast.success('SMS code received!', { id: 'poll' });
      } else {
        toast.info('No code yet', { id: 'poll' });
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed polling for SMS', { id: 'poll' });
    }
  };

  return (
    <div className={`min-h-screen p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster richColors position="top-center" />
      <Navigation currentPage="services" setCurrentPage={() => {}} />

      <div className="mb-2">
        <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>Fadded Global</h1>
      </div>

      {error && (
        <div className={`p-3 rounded-lg mb-3 ${isDark ? 'bg-red-900/30 text-red-200 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'}`}>{error}</div>
      )}

      {loading ? (
        <div className={`${isDark ? 'text_white/80' : 'text-gray-700'}`}>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`flex items_center gap-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}><Smartphone className="w-4 h-4" /><span className="text-sm font-semibold">Service</span></div>
            <input
              type="text"
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
              placeholder="Search services..."
              className={`w-full mb-2 px-3 py-1.5 text-sm rounded-lg border focus:outline_none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {filteredServices.map((svc) => (
                <label key={svc.service} className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${selectedService === svc.service ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300') : (isDark ? 'bg-gray-900/40 border-gray-700 hover:bg-gray-900/60' : 'bg-white border-gray-200 hover:bg-white')}`}>
                  <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium`}>{svc.name}</div>
                  <div className={`${isDark ? 'text-blue-300' : 'text-blue-700'} text-sm font-semibold`}>₦{Number(svc.cost).toLocaleString()}</div>
                  <input type="radio" name="service" className="hidden" checked={selectedService === svc.service} onChange={() => setSelectedService(svc.service)} />
                </label>
              ))}
              {filteredServices.length === 0 && (
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No services found.</div>
              )}
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}><Globe className="w-4 h-4" /><span className="text-sm font-semibold">Country</span></div>
            <input
              type="text"
              value={countryQuery}
              onChange={(e) => setCountryQuery(e.target.value)}
              placeholder="Search countries..."
              className={`w-full mb-2 px-3 py-1.5 text-sm rounded-lg border focus:outline_none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredCountries.map((c) => (
                <label key={c.code} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${selectedCountry === c.code ? (isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300') : (isDark ? 'bg-gray-900/40 border-gray-700 hover:bg-gray-900/60' : 'bg-white border-gray-200 hover:bg-white')}`}>
                  <span className="text-base">{c.flag}</span>
                  <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium flex-1`}>{c.name}</div>
                  <input type="radio" name="country" className="hidden" checked={selectedCountry === c.code} onChange={() => onCountryChange(c.code)} />
                </label>
              ))}
              {filteredCountries.length === 0 && (
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No countries found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={createOrder}
          disabled={!selectedService || !selectedCountry || creating}
          className={`px-3 py-2 text-sm rounded-lg transition-all ${(!selectedService || !selectedCountry || creating) ? (isDark ? 'bg-green-600/50 text-white/70' : 'bg-green-400/50 text-white') : (isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')}`}
        >
          {creating ? 'Creating…' : 'Get Number'}
        </button>
        <button
          onClick={pollForSms}
          disabled={!orderId}
          className={`px-3 py-2 text-sm rounded-lg transition-all ${!orderId ? (isDark ? 'bg-blue-600/50 text-white/70' : 'bg-blue-400/50 text-white') : (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')}`}
        >
          Poll for SMS
        </button>
      </div>

      <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Route: /faddedglobal</div>

      {orderId && (
        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700 text_white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}>
          <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}><Phone className="w-4 h-4" /><span className="font-semibold">Your Number</span></div>
          <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-1`}>{phoneNumber || '—'}</div>
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>We will start polling for the SMS automatically.</div>
        </div>
      )}

      <BottomNavigation currentPage="dashboard" setCurrentPage={() => {}} />
    </div>
  );
};

export default TigerPage;

