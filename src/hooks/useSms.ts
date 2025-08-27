import { useState, useEffect, useCallback } from 'react';
import { smsApiService, SmsCountry, SmsService, SmsOrder, SmsOrderHistory, SmsStats, SmsProvider } from '../services/smsApi';

interface UseSmsReturn {
  // Countries
  countries: SmsCountry[];
  loadingCountries: boolean;
  errorCountries: string | null;
  fetchCountries: () => Promise<void>;

  // Services
  services: SmsService[];
  loadingServices: boolean;
  errorServices: string | null;
  fetchServices: (country: string, provider?: string) => Promise<void>;

  // Providers
  providers: SmsProvider[];
  loadingProviders: boolean;
  errorProviders: string | null;
  fetchProviders: () => Promise<void>;

  // Orders
  orders: SmsOrderHistory[];
  loadingOrders: boolean;
  errorOrders: string | null;
  fetchOrders: (status?: string, limit?: number) => Promise<void>;

  // Stats
  stats: SmsStats | null;
  loadingStats: boolean;
  errorStats: string | null;
  fetchStats: () => Promise<void>;

  // Actions
  createOrder: (country: string, service: string, mode?: 'auto' | 'manual', provider?: string) => Promise<SmsOrder>;
  getSmsCode: (orderId: string) => Promise<{ sms_code: string | null; status: string }>;
  cancelOrder: (orderId: string) => Promise<{ success: boolean; message: string }>;
  pollForSmsCode: (orderId: string, maxAttempts?: number, interval?: number) => Promise<string>;
}

export const useSms = (): UseSmsReturn => {
  // Countries state
  const [countries, setCountries] = useState<SmsCountry[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [errorCountries, setErrorCountries] = useState<string | null>(null);

  // Services state
  const [services, setServices] = useState<SmsService[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  // Providers state
  const [providers, setProviders] = useState<SmsProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [errorProviders, setErrorProviders] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<SmsOrderHistory[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState<SmsStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    setLoadingCountries(true);
    setErrorCountries(null);
    
    try {
      const data = await smsApiService.getCountries();
      setCountries(data);
    } catch (error) {
      setErrorCountries(error instanceof Error ? error.message : 'Failed to fetch countries');
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  // Fetch services
  const fetchServices = useCallback(async (country: string, provider?: string) => {
    setLoadingServices(true);
    setErrorServices(null);
    
    try {
      const data = await smsApiService.getServices(country, provider);
      setServices(data);
    } catch (error) {
      setErrorServices(error instanceof Error ? error.message : 'Failed to fetch services');
    } finally {
      setLoadingServices(false);
    }
  }, []);

  // Fetch providers
  const fetchProviders = useCallback(async () => {
    setLoadingProviders(true);
    setErrorProviders(null);
    
    try {
      const data = await smsApiService.getProviders();
      setProviders(data);
    } catch (error) {
      setErrorProviders(error instanceof Error ? error.message : 'Failed to fetch providers');
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async (status?: string, limit: number = 20) => {
    setLoadingOrders(true);
    setErrorOrders(null);
    
    try {
      const data = await smsApiService.getOrders(status, limit);
      setOrders(data);
    } catch (error) {
      setErrorOrders(error instanceof Error ? error.message : 'Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    setErrorStats(null);
    
    try {
      const data = await smsApiService.getStats();
      setStats(data);
    } catch (error) {
      setErrorStats(error instanceof Error ? error.message : 'Failed to fetch statistics');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Create order
  const createOrder = useCallback(async (country: string, service: string, mode?: 'auto' | 'manual', provider?: string): Promise<SmsOrder> => {
    try {
      const order = await smsApiService.createOrder(country, service, mode, provider);
      
      // Refresh orders list
      await fetchOrders();
      
      // Refresh stats
      await fetchStats();
      
      return order;
    } catch (error) {
      throw error;
    }
  }, [fetchOrders, fetchStats]);

  // Get SMS code
  const getSmsCode = useCallback(async (orderId: string) => {
    try {
      const response = await smsApiService.getSmsCode(orderId);
      
      // If SMS code received, refresh orders to update status
      if (response.sms_code) {
        await fetchOrders();
        await fetchStats();
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchOrders, fetchStats]);

  // Cancel order
  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      const result = await smsApiService.cancelOrder(orderId);
      
      // Refresh orders and stats
      await fetchOrders();
      await fetchStats();
      
      return result;
    } catch (error) {
      throw error;
    }
  }, [fetchOrders, fetchStats]);

  // Poll for SMS code
  const pollForSmsCode = useCallback(async (orderId: string, maxAttempts: number = 30, interval: number = 2000): Promise<string> => {
    try {
      const smsCode = await smsApiService.pollForSmsCode(orderId, maxAttempts, interval);
      
      // Refresh orders and stats when SMS code is received
      await fetchOrders();
      await fetchStats();
      
      return smsCode;
    } catch (error) {
      throw error;
    }
  }, [fetchOrders, fetchStats]);

  // Load initial data
  useEffect(() => {
    fetchCountries();
    fetchOrders();
    fetchStats();
    fetchProviders(); // Added fetchProviders to load providers
  }, [fetchCountries, fetchOrders, fetchStats, fetchProviders]);

  return {
    // Countries
    countries,
    loadingCountries,
    errorCountries,
    fetchCountries,

    // Services
    services,
    loadingServices,
    errorServices,
    fetchServices,

    // Providers
    providers,
    loadingProviders,
    errorProviders,
    fetchProviders,

    // Orders
    orders,
    loadingOrders,
    errorOrders,
    fetchOrders,

    // Stats
    stats,
    loadingStats,
    errorStats,
    fetchStats,

    // Actions
    createOrder,
    getSmsCode,
    cancelOrder,
    pollForSmsCode,
  };
};
