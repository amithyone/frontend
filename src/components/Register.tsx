import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const resp = await apiService.register({ name, email, password });
      if (resp.status === 'success' && (resp as any).data?.token) {
        await login(email, password);
        navigate('/', { replace: true });
      } else {
        setError((resp as any).message || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-sm rounded-2xl p-6 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sign up to continue</p>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm mb-1 block">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <div className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <a href="/login" className="hover:underline">Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;


