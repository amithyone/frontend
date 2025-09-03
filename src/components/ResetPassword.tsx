import React, { useMemo, useState } from 'react';
import { API_AUTH_URL } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const initialEmail = useMemo(() => query.get('email') || '', [query]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const base = API_AUTH_URL;
      // Conventional Laravel reset route; adjust if different in your backend
      const resp = await fetch(`${base}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, token: code, password }),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(json?.message || 'Reset failed');
      setMessage(json?.message || 'Password reset successful. You can now sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-sm rounded-2xl p-6 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h1 className="text-2xl font-bold mb-2">Reset password</h1>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enter your code and new password</p>
        {message && <div className="mb-4 text-sm text-green-600">{message}</div>}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Reset code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} required
              className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="text-sm mb-1 block">New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
        <div className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <a href="/login" className="hover:underline">Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


