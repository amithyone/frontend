import React, { useState } from 'react';
import { API_VTU_URL } from '../services/api';
import { X, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { vtuApiService } from '../services/vtuApi';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fetchProviders = async () => {
      const resp = await fetch(`${API_VTU_URL}/betting/providers`);
  const ct = resp.headers.get('content-type') || '';
  if (!ct.includes('application/json')) throw new Error('Unexpected response');
  const data = await resp.json();
  if (!data.success) throw new Error('Failed to load betting providers');
  return data.data as { id: string; name: string }[];
};

const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const wallet = typeof user?.balance === 'number' ? user.wallet : 0;

  React.useEffect(() => {
    if (!isOpen) return;
    fetchProviders().then(setProviders).catch(() => setProviders([]));
  }, [isOpen]);

  React.useEffect(() => {
    if (!serviceId && providers.length > 0) {
      setServiceId(providers[0].id);
    }
  }, [providers, serviceId]);

  const handleSubmit = async () => {
    setMsg(null);
    const amt = Number(amount);
    if (!serviceId || !customerId || !amt || amt <= 0) {
      setMsg({ type: 'error', text: 'Enter customer ID and valid amount' });
      return;
    }
    if (amt > wallet) {
      setMsg({ type: 'error', text: 'Insufficient wallet balance' });
      return;
    }
    setIsLoading(true);
    try {
      // reuse verify endpoint if needed in future
      await vtuApiService.verifyCustomer(serviceId, customerId);
      // backend wallet check + provider call
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
              const resp = await fetch(`${API_VTU_URL}/betting/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ service_id: serviceId, customer_id: customerId, amount: amt }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.message || 'Betting funding failed');
      setMsg({ type: 'success', text: 'Betting account funded successfully' });
      setCustomerId('');
      setAmount('');
    } catch (e: any) {
      setMsg({ type: 'error', text: e?.message || 'Betting funding failed' });
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
            <DollarSign className="h-6 w-6 mr-2 text-emerald-500" /> Betting
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
            <label className="block text-sm font-medium mb-2">Customer ID</label>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="Enter customer ID" />
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
              placeholder="e.g. 500"
            />
            <div className="text-xs mt-1">Wallet: ₦{wallet.toLocaleString?.() || wallet}</div>
          </div>
          <button onClick={handleSubmit} disabled={isLoading || !serviceId || !customerId || Number(amount) <= 0} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
            {isLoading ? 'Processing...' : 'Fund Betting Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BettingModal;
