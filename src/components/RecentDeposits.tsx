import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { RefreshCw } from 'lucide-react';

const RecentDeposits: React.FC = () => {
  const [items, setItems] = useState<Array<{ id: number; amount: number; reference: string; status: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await apiService.getRecentDeposits();
      if ((resp as any)?.status === 'error') {
        setError((resp as any)?.message || 'Failed to load deposits');
        setItems([]);
      } else {
        setItems((resp as any)?.data || []);
      }
    } catch (e) {
      setError('Failed to load deposits');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Recent Deposits</h3>
        <button onClick={load} className="text-sm flex items-center gap-1">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>
      {loading && <div className="text-sm opacity-70">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((d) => (
            <li key={d.id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">₦{Number(d.amount).toLocaleString()}</div>
                <div className="opacity-70">Ref: {d.reference}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${d.status === 'completed' ? 'bg-green-100 text-green-700' : d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {d.status}
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-3 text-sm opacity-70">No deposits yet</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default RecentDeposits;
