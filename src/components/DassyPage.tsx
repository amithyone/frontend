import React, { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { smsApiService, SmsService as SmsServiceType } from '../services/smsApi';
import { Smartphone, Globe, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from './Navigation';
import BottomNavigation from './BottomNavigation';

const mapNameToGeneric = (name: string): string => {
  const n = (name || '').toLowerCase();
  if (n.includes('whatsapp') || n === 'wa') return 'whatsapp';
  if (n.includes('telegram') || n === 'tg') return 'telegram';
  if (n.includes('facebook') || n === 'fb') return 'facebook';
  if (n.includes('instagram') || n === 'ig') return 'instagram';
  if (n.includes('google') || n === 'go' || n.includes('gmail')) return 'google';
  if (n.includes('twitter') || n === 'tw' || n.includes('x.com')) return 'twitter';
  if (n.includes('tinder') || n === 'oi') return 'tinder';
  if (n.includes('signal') || n === 'bw') return 'signal';
  return n.replace(/\s+/g, ' ').trim();
};

const DassyPage: React.FC = () => {
  const { isDark } = useTheme();
  const [services, setServices] = useState<SmsServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [serviceQuery, setServiceQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await smsApiService.getCountries('dassy'); // side-effect only
        let svc = await smsApiService.getServices('US', 'dassy');
        // Dassy-only display name normalization: map common acronyms to full names
        const NAME_MAP: Record<string, string> = {
          'wa': 'WhatsApp',
          'tg': 'Telegram',
          'fb': 'Facebook',
          'ig': 'Instagram',
          'go': 'Google',
          'tw': 'Twitter',
          'oi': 'Tinder',
          'bw': 'Signal',
        };
        const normalizeName = (s: SmsServiceType): SmsServiceType => {
          const code = (s.service || '').toLowerCase();
          const nm = (s.name || '').toLowerCase();
          const byCode = NAME_MAP[code];
          const byName = NAME_MAP[nm];
          let display = s.name;
          if (byCode) display = byCode;
          else if (byName) display = byName;
          else if (/^[a-z]{1,3}$/.test(nm) && NAME_MAP[nm]) display = NAME_MAP[nm];
          return { ...s, name: display } as SmsServiceType;
        };
        svc = svc.map(normalizeName);
        if (!mounted) return;
        const wa = svc.find(s => (s.service || '').toLowerCase().includes('wa') || (s.name || '').toLowerCase().includes('whatsapp'));
        setServices(svc);
        setSelectedService(wa?.service || svc[0]?.service || '');
      } catch (e: any) {
        setError(e?.message || 'Failed to load Fadded USA Only services');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredServices = useMemo(() => {
    const q = (serviceQuery || '').toLowerCase();
    if (!q) return services;
    return services.filter((s) => (s.name || '').toLowerCase().includes(q) || (s.service || '').toLowerCase().includes(q));
  }, [services, serviceQuery]);

  const createOrderAuto = async () => {
    const chosen = services.find(s => s.service === selectedService) || services[0];
    const rawName = (chosen?.name || '').toLowerCase().trim();
    const serviceForAuto = rawName && !/^\d+$/.test(rawName) ? rawName : mapNameToGeneric(rawName || chosen?.service || '');
    const order = await smsApiService.createOrder('US', serviceForAuto, 'auto');
    return order;
  };

  const createOrder = async () => {
    try {
      setCreating(true);
      setError('');
      toast.loading('Creating Fadded USA Only order…', { id: 'create-order' });
      const order = await smsApiService.createOrder('US', selectedService, 'manual', 'dassy');
      setOrderId(order.order_id);
      setPhoneNumber(order.phone_number);
      toast.success('Number acquired', { id: 'create-order' });
    } catch (e: any) {
      const msg = e?.message || 'Failed to create order';
      // Auto-fallback if insufficient balance
      if (typeof msg === 'string' && (msg.toLowerCase().includes('no_money') || msg.toLowerCase().includes('insufficient'))) {
        try {
          toast.message('Dassy balance low. Trying Auto Provider…');
          const order = await createOrderAuto();
          setOrderId(order.order_id);
          setPhoneNumber(order.phone_number);
          toast.success('Number acquired', { id: 'create-order' });
          return;
        } catch (autoErr: any) {
          setError(autoErr?.message || 'Auto provider failed');
          toast.error(autoErr?.message || 'Auto provider failed', { id: 'create-order' });
          return;
        }
      }
      setError(msg);
      toast.error(msg, { id: 'create-order' });
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
        <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>Fadded USA Only</h1>
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
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
                <span className="text-base">🇺🇸</span>
                <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium flex-1`}>United States</div>
                <input type="radio" name="country" className="hidden" checked readOnly />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={createOrder}
          disabled={!selectedService || creating}
          className={`px-3 py-2 text-sm rounded-lg transition-all ${(!selectedService || creating) ? (isDark ? 'bg-green-600/50 text-white/70' : 'bg-green-400/50 text-white') : (isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')}`}
        >
          {creating ? 'Creating…' : 'Get Number'}
        </button>
        <button
          onClick={pollForSms}
          disabled={!orderId}
          className={`px-3 py-2 text-sm rounded-lg transition-all ${!orderId ? (isDark ? 'bg-blue-600/50 text-white/70' : 'bg-blue-400/50 text_white') : (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')}`}
        >
          Poll for SMS
        </button>
      </div>

      <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Route: /faddedusaonly</div>

      {orderId && (
        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}>
          <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}><Phone className="w-4 h-4" /><span className="font-semibold">Your Number</span></div>
          <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-1`}>{phoneNumber || '—'}</div>
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>We will start polling for the SMS automatically.</div>
        </div>
      )}

      <BottomNavigation currentPage="dashboard" setCurrentPage={() => {}} />
    </div>
  );
};

export default DassyPage;
