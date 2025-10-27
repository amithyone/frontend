import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Smartphone } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Get token and user from URL (query or hash fragment)
        let token = searchParams.get('token');
        let userParam = searchParams.get('user');
        if (!token || !userParam) {
          const hash = window.location.hash?.startsWith('#') ? window.location.hash.slice(1) : '';
          if (hash) {
            const hashParams = new URLSearchParams(hash);
            token = token || hashParams.get('token');
            userParam = userParam || hashParams.get('user');
          }
        }

        if (!token || !userParam) {
          setError('Invalid callback data');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userParam));

        // Store auth data (AuthContext will pick this up automatically)
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));

        console.log('AuthCallback: Stored token and user data in localStorage');

        // Trigger a custom event to notify AuthContext to reload
        window.dispatchEvent(new CustomEvent('auth:token-updated', { detail: { token, user } }));

        console.log('AuthCallback: Dispatched auth:token-updated event');

        // Redirect to dashboard (AuthContext will reload and detect the auth)
        window.location.href = '/dashboard';
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError('Failed to complete authentication');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>

          {error ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
              <p className="text-red-300 mb-4">{error}</p>
              <p className="text-gray-400 text-sm">Redirecting to login...</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Completing Sign In</h1>
              <div className="flex justify-center items-center space-x-2 text-gray-300">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Please wait...</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;

