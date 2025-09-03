import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_AUTH_URL } from '../services/api';

export interface AuthUser {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  wallet?: number; // Add wallet balance
  balance?: number; // Add balance field from users table
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => void;
  updateWalletBalance: (balance: number) => void; // Add function to update wallet balance
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
      // Fetch fresh user profile from backend to ensure wallet matches DB
      const loadProfile = async () => {
        try {
          const base = API_AUTH_URL;
          const resp = await fetch(`${base}/user`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (resp.ok) {
            const freshUser = await resp.json();
            // Expect wallet on the model; default to 0 if missing
            // Check multiple possible field names: wallet, balance, wallet_balance
            const walletBalance = freshUser?.wallet ?? freshUser?.balance ?? freshUser?.wallet_balance ?? 0;
            const normalized: AuthUser = {
              id: freshUser?.id,
              name: freshUser?.name,
              email: freshUser?.email,
              wallet: typeof walletBalance === 'number' ? walletBalance : Number(walletBalance ?? 0),
              balance: typeof walletBalance === 'number' ? walletBalance : Number(walletBalance ?? 0),
            };
            setUser((prev) => ({ ...(prev || {} as any), ...normalized }));
          }
        } catch {}
      };
      loadProfile();
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const register = useCallback(async (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => {
    const base = API_AUTH_URL;
    const resp = await fetch(`${base}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        password_confirmation: password,
        name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || email
      }),
    });
    
    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await resp.json();
    
    console.log('Registration response:', data); // Debug log
    
    const newToken: string | undefined = data?.data?.token || data?.token;
    let newUser: AuthUser | undefined = data?.data?.user || data?.user;
    
    if (!newToken) {
      throw new Error('Missing token in response');
    }
    
    // Ensure user object has wallet balance
    if (newUser) {
      // Check multiple possible field names: wallet, balance, wallet_balance
      const walletBalance = newUser.wallet ?? newUser.balance ?? newUser.wallet_balance ?? 
                           data?.data?.wallet ?? data?.data?.balance ?? data?.data?.wallet_balance ??
                           data?.wallet ?? data?.balance ?? data?.wallet_balance ?? 0;
      
      if (walletBalance !== undefined) {
        newUser = { ...newUser, wallet: walletBalance };
      } else {
        newUser = { ...newUser, wallet: 0 };
      }
    }
    
    setToken(newToken);
    setUser(newUser ?? null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Use Laravel login endpoint
    const base = API_AUTH_URL;
    const resp = await fetch(`${base}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }
    
    const data = await resp.json();
    
    console.log('Login response:', data); // Debug log
    
    const newToken: string | undefined = data?.data?.token || data?.token;
    let newUser: AuthUser | undefined = data?.data?.user || data?.user;
    
    if (!newToken) {
      throw new Error('Missing token in response');
    }
    
    // Ensure user object has wallet balance
    if (newUser) {
      // If wallet balance is in the user object
      if (newUser.wallet !== undefined) {
        // Wallet balance is already in user object
      } else if (data?.data?.wallet !== undefined) {
        // Wallet balance is at the data level
        newUser = { ...newUser, wallet: data.data.wallet };
      } else if (data?.wallet !== undefined) {
        // Wallet balance is at the root level
        newUser = { ...newUser, wallet: data.wallet };
      } else {
        // Set default wallet balance
        newUser = { ...newUser, wallet: 0 };
      }
    }
    
    setToken(newToken);
    setUser(newUser ?? null);
    // After login, fetch fresh profile to ensure wallet sync
    try {
      const base = API_AUTH_URL;
      const resp = await fetch(`${base}/user`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
      });
      if (resp.ok) {
        const freshUser = await resp.json();
        // Check multiple possible field names: wallet, balance, wallet_balance
        const walletBalance = freshUser?.wallet ?? freshUser?.balance ?? freshUser?.wallet_balance ?? 0;
        const normalized: AuthUser = {
          id: freshUser?.id,
          name: freshUser?.name,
          email: freshUser?.email,
          wallet: typeof walletBalance === 'number' ? walletBalance : Number(walletBalance ?? 0),
          balance: typeof walletBalance === 'number' ? walletBalance : Number(walletBalance ?? 0),
        };
        setUser((prev) => ({ ...(prev || {} as any), ...normalized }));
      }
    } catch {}
  }, []);

  const updateWalletBalance = useCallback((balance: number) => {
    console.log('AuthContext - updateWalletBalance called with:', balance);
    console.log('AuthContext - current user:', user);
    if (user) {
      const updatedUser = { ...user, wallet: balance, balance: balance };
      console.log('AuthContext - setting updated user:', updatedUser);
      setUser(updatedUser);
    } else {
      console.log('AuthContext - no user to update');
    }
  }, [user]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(token),
    user,
    token,
    login,
    register,
    logout,
    updateWalletBalance,
  }), [token, user, login, register, logout, updateWalletBalance]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


