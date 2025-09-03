import React, { useEffect, useState } from 'react';
import { API_VTU_URL } from '../services/api';
import { X, Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface ElectricityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Provider = { id: string; name: string };

enum MeterType {
  Prepaid = 'prepaid',
  Postpaid = 'postpaid',
}

const ElectricityModal: React.FC<ElectricityModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [meterType, setMeterType] = useState<MeterType>(MeterType.Prepaid);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState<string>('');

  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const wallet = typeof user?.balance === 'number' ? user.balance : 0;

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        const resp = await fetch(`${API_VTU_URL}/electricity/providers`);
        const ct = resp.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('Unexpected response');
        const data = await resp.json();
        if (!data.success) throw new Error('Failed to load providers');
        setProviders(data.data || []);
      } catch {
        setProviders([]);
      }
    };
    load();
  }, [isOpen]);

  useEffect(() => {
    if (!serviceId && providers.length) setServiceId(providers[0].id);
  }, [providers, serviceId]);

  const verify = async () => {
    setMsg(null);
    setVerifying(true);
    setVerifiedName(null);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
      const resp = await fetch(`${API_VTU_URL}/electricity/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ service_id: serviceId, customer_id: customerId, variation_id: meterType }),
      });
      const ct = resp.headers.get('content-type') || '';
      if (!ct.includes('application/json')) throw new Error('Unexpected response type');
      const data = await resp.json();
      if (!data.success) throw new Error(data.message || 'Verification failed');
      const name = data?.data?.data?.customer_name || data?.data?.customer_name || 'Verified';
      setVerifiedName(name);
      setMsg({ type: 'success', text: `Verified: ${name}` });
    } catch (e: any) {
      setMsg({ type: 'error', text: e?.message || 'Verification failed' });
    } finally {
      setVerifying(false);
    }
  };

  const submit = async () => {
    setMsg(null);
    const amt = Number(amount);
    if (!serviceId || !customerId || !amt || amt <= 0) {
      setMsg({ type: 'error', text: 'Select provider, enter meter number and valid amount' });
      return;
    }
    if (amt > wallet) {
      setMsg({ type: 'error', text: 'Insufficient wallet balance' });
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
      const resp = await fetch(`${API_VTU_URL}/electricity/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ service_id: serviceId, customer_id: customerId, variation_id: meterType, amount: amt }),
      });
      const ct = resp.headers.get('content-type') || '';
      if (!ct.includes('application/json')) throw new Error('Unexpected response type');
      const data = await resp.json();
      if (!data.success) throw new Error(data.message || 'Electricity purchase failed');
      setMsg({ type: 'success', text: 'Electricity purchased successfully' });
      setCustomerId('');
      setAmount('');
      setVerifiedName(null);
    } catch (e: any) {
      setMsg({ type: 'error', text: e?.message || 'Electricity purchase failed' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-500" /> Electricity Bills
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {msg && (
            <div className={`p-3 rounded flex items-center ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              {msg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Provider</label>
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
              {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meter Type</label>
            <select value={meterType} onChange={(e) => setMeterType(e.target.value as MeterType)} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
              <option value={MeterType.Prepaid}>Prepaid</option>
              <option value={MeterType.Postpaid}>Postpaid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meter / Account Number</label>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="Enter meter/account number" />
            {verifiedName && <div className="text-xs mt-1 text-green-600">Name: {verifiedName}</div>}
            <button onClick={verify} disabled={verifying || !serviceId || !customerId} className="mt-2 text-sm flex items-center gap-1 disabled:opacity-50">
              {verifying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Verify
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').replace(/^0+/, ''))}
              className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="e.g. 1000"
            />
            <div className="text-xs mt-1">Wallet: ₦{wallet.toLocaleString?.() || wallet}</div>
          </div>

          <button onClick={submit} disabled={isLoading || !serviceId || !customerId || Number(amount) <= 0} className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
            {isLoading ? 'Processing...' : 'Pay Electricity Bill'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectricityModal;