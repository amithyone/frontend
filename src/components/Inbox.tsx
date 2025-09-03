import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Filter, CheckCircle2, AlertCircle, Bell, Wallet, Zap, Wifi, Phone } from 'lucide-react';
import { smsApiService, SmsOrderHistory } from '../services/smsApi';

export interface InboxItem {
  id: string | number;
  title: string;
  body: string;
  category: 'orders' | 'wallet' | 'vtu' | 'system';
  status?: 'info' | 'success' | 'warning' | 'error';
  created_at: string; // ISO or display
}

// Map backend SMS order to inbox item
const mapOrderToInboxItem = (o: SmsOrderHistory): InboxItem => {
  const isWaiting = !o.sms_code && (o.status?.toLowerCase?.() === 'pending' || o.status?.toLowerCase?.().includes('wait'));
  const status: InboxItem['status'] = o.status?.toLowerCase?.() === 'completed' || o.status?.toLowerCase?.() === 'success'
    ? 'success'
    : isWaiting ? 'warning' : 'info';
  const title = isWaiting ? 'Waiting for SMS code' : (o.sms_code ? 'SMS code received' : `SMS order ${o.status || ''}`.trim());
  const cost = isNaN(Number(o.cost)) ? '' : ` • ₦${Number(o.cost).toLocaleString()}`;
  const body = `${o.service?.toUpperCase?.() || 'SERVICE'} • ${o.phone_number || '—'}${cost}`;
  return {
    id: o.order_id,
    title,
    body,
    category: 'orders',
    status,
    created_at: o.created_at || new Date().toISOString(),
  };
};

const statusIcon = (status?: InboxItem['status']) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Bell className="h-4 w-4 text-blue-600" />;
  }
};

const categoryIcon = (cat: InboxItem['category']) => {
  switch (cat) {
    case 'wallet':
      return <Wallet className="h-5 w-5" />;
    case 'vtu':
      return <Wifi className="h-5 w-5" />;
    case 'orders':
      return <Zap className="h-5 w-5" />;
    default:
      return <Phone className="h-5 w-5" />;
  }
};

const Inbox: React.FC = () => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'all' | 'orders' | 'wallet' | 'vtu' | 'system'>('all');
  const [orders, setOrders] = useState<SmsOrderHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await smsApiService.getInbox(undefined, 50);
      setOrders(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    const t = setInterval(fetchInbox, 10000);
    return () => clearInterval(t);
  }, []);

  const items = useMemo(() => {
    let list: InboxItem[] = orders.map(mapOrderToInboxItem);
    if (tab !== 'all') list = list.filter(i => i.category === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.body.toLowerCase().includes(q));
    }
    return list;
  }, [orders, query, tab]);

  return (
    <div className={`rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Inbox</h3>
          <div className="flex items-center gap-2">
            <div className={`flex items-center px-3 py-2 rounded-lg gap-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Search className={`h-4 w-4 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className={`bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
              />
            </div>
            <button className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <Filter className="h-4 w-4" /> Filter
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto">
          {(['all','orders','wallet','vtu','system'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${tab === t
                ? (isDark ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700')
                : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <ul className="divide-y last:border-b-0">
        {loading && (
          <li className="p-4 text-sm opacity-70">Loading inbox…</li>
        )}
        {error && (
          <li className="p-4 text-sm text-red-600">{error}</li>
        )}
        {items.map((i) => (
          <li key={i.id} className={`p-4 flex items-start gap-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              {categoryIcon(i.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {statusIcon(i.status)}
                  <span className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{i.title}</span>
                </div>
                <span className={`text-xs whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{i.created_at}</span>
              </div>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{i.body}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{i.category}</span>
                {i.status && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    i.status === 'success' ? 'bg-green-100 text-green-700' : i.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : i.status === 'error' ? 'bg-red-100 text-red-700' : (isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700')
                  }`}>{i.status}</span>
                )}
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="p-10 text-center text-sm opacity-70">No messages yet</li>
        )}
      </ul>
    </div>
  );
};

export default Inbox;
