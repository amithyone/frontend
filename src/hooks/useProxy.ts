import { useState, useEffect, useCallback } from 'react';
import { 
  proxyApiService, 
  ProxyProfile, 
  ProxyServer, 
  ProxyListResponse, 
  ProxyStats, 
  SubscriptionPlan, 
  ProxyConfig, 
  IpAuthorization, 
  ProxyActivity, 
  ProxyPurchaseRequest, 
  ProxyPurchaseResponse 
} from '../services/proxyApi';

interface UseProxyReturn {
  // Profile
  profile: ProxyProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;

  // Proxy List
  proxyList: ProxyListResponse | null;
  proxyListLoading: boolean;
  proxyListError: string | null;
  fetchProxyList: (params?: Record<string, any>) => Promise<void>;

  // Statistics
  stats: ProxyStats | null;
  statsLoading: boolean;
  statsError: string | null;
  fetchStats: (params?: Record<string, any>) => Promise<void>;

  // Subscription Plans
  plans: SubscriptionPlan[];
  plansLoading: boolean;
  plansError: string | null;
  fetchPlans: () => Promise<void>;

  // Configuration
  config: ProxyConfig | null;
  configLoading: boolean;
  configError: string | null;
  fetchConfig: () => Promise<void>;

  // IP Authorizations
  ipAuthorizations: IpAuthorization[];
  ipAuthorizationsLoading: boolean;
  ipAuthorizationsError: string | null;
  fetchIpAuthorizations: () => Promise<void>;

  // Activities
  activities: ProxyActivity[];
  activitiesLoading: boolean;
  activitiesError: string | null;
  fetchActivities: (params?: Record<string, any>) => Promise<void>;

  // Actions
  downloadProxyList: (params?: Record<string, any>) => Promise<{ download_url: string }>;
  refreshProxyList: () => Promise<{ message: string }>;
  createIpAuthorization: (ip: string) => Promise<IpAuthorization>;
  deleteIpAuthorization: (authorizationId: number) => Promise<{ message: string }>;
  getMyIp: () => Promise<{ ip: string; country: string; city: string }>;
  downloadActivities: (params?: Record<string, any>) => Promise<{ download_url: string }>;
  purchasePlan: (request: ProxyPurchaseRequest) => Promise<ProxyPurchaseResponse>;
}

export const useProxy = (): UseProxyReturn => {
  // Profile state
  const [profile, setProfile] = useState<ProxyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Proxy list state
  const [proxyList, setProxyList] = useState<ProxyListResponse | null>(null);
  const [proxyListLoading, setProxyListLoading] = useState(false);
  const [proxyListError, setProxyListError] = useState<string | null>(null);

  // Statistics state
  const [stats, setStats] = useState<ProxyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Plans state
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);

  // Config state
  const [config, setConfig] = useState<ProxyConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  // IP Authorizations state
  const [ipAuthorizations, setIpAuthorizations] = useState<IpAuthorization[]>([]);
  const [ipAuthorizationsLoading, setIpAuthorizationsLoading] = useState(false);
  const [ipAuthorizationsError, setIpAuthorizationsError] = useState<string | null>(null);

  // Activities state
  const [activities, setActivities] = useState<ProxyActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await proxyApiService.getUserProfile();
      setProfile(data);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to fetch profile');
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Fetch proxy list
  const fetchProxyList = useCallback(async (params: Record<string, any> = {}) => {
    setProxyListLoading(true);
    setProxyListError(null);
    try {
      const data = await proxyApiService.getProxyList(params);
      setProxyList(data);
    } catch (error) {
      setProxyListError(error instanceof Error ? error.message : 'Failed to fetch proxy list');
    } finally {
      setProxyListLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async (params: Record<string, any> = {}) => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await proxyApiService.getProxyStats(params);
      setStats(data);
    } catch (error) {
      setStatsError(error instanceof Error ? error.message : 'Failed to fetch statistics');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch subscription plans
  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    setPlansError(null);
    try {
      const data = await proxyApiService.getSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      setPlansError(error instanceof Error ? error.message : 'Failed to fetch subscription plans');
    } finally {
      setPlansLoading(false);
    }
  }, []);

  // Fetch configuration
  const fetchConfig = useCallback(async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const data = await proxyApiService.getProxyConfig();
      setConfig(data);
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Failed to fetch configuration');
    } finally {
      setConfigLoading(false);
    }
  }, []);

  // Fetch IP authorizations
  const fetchIpAuthorizations = useCallback(async () => {
    setIpAuthorizationsLoading(true);
    setIpAuthorizationsError(null);
    try {
      const data = await proxyApiService.getIpAuthorizations();
      setIpAuthorizations(data);
    } catch (error) {
      setIpAuthorizationsError(error instanceof Error ? error.message : 'Failed to fetch IP authorizations');
    } finally {
      setIpAuthorizationsLoading(false);
    }
  }, []);

  // Fetch activities
  const fetchActivities = useCallback(async (params: Record<string, any> = {}) => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    try {
      const data = await proxyApiService.getProxyActivities(params);
      setActivities(data);
    } catch (error) {
      setActivitiesError(error instanceof Error ? error.message : 'Failed to fetch activities');
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  // Download proxy list
  const downloadProxyList = useCallback(async (params: Record<string, any> = {}) => {
    return await proxyApiService.downloadProxyList(params);
  }, []);

  // Refresh proxy list
  const refreshProxyList = useCallback(async () => {
    return await proxyApiService.refreshProxyList();
  }, []);

  // Create IP authorization
  const createIpAuthorization = useCallback(async (ip: string) => {
    const result = await proxyApiService.createIpAuthorization(ip);
    // Refresh the list after creating
    await fetchIpAuthorizations();
    return result;
  }, [fetchIpAuthorizations]);

  // Delete IP authorization
  const deleteIpAuthorization = useCallback(async (authorizationId: number) => {
    const result = await proxyApiService.deleteIpAuthorization(authorizationId);
    // Refresh the list after deleting
    await fetchIpAuthorizations();
    return result;
  }, [fetchIpAuthorizations]);

  // Get my IP
  const getMyIp = useCallback(async () => {
    return await proxyApiService.getMyIp();
  }, []);

  // Download activities
  const downloadActivities = useCallback(async (params: Record<string, any> = {}) => {
    return await proxyApiService.downloadProxyActivities(params);
  }, []);

  // Purchase plan
  const purchasePlan = useCallback(async (request: ProxyPurchaseRequest) => {
    return await proxyApiService.purchaseProxyPlan(request);
  }, []);

  // Load initial data
  useEffect(() => {
    fetchProfile();
    fetchPlans();
    fetchConfig();
    fetchIpAuthorizations();
  }, [fetchProfile, fetchPlans, fetchConfig, fetchIpAuthorizations]);

  return {
    // Profile
    profile,
    profileLoading,
    profileError,
    fetchProfile,

    // Proxy List
    proxyList,
    proxyListLoading,
    proxyListError,
    fetchProxyList,

    // Statistics
    stats,
    statsLoading,
    statsError,
    fetchStats,

    // Subscription Plans
    plans,
    plansLoading,
    plansError,
    fetchPlans,

    // Configuration
    config,
    configLoading,
    configError,
    fetchConfig,

    // IP Authorizations
    ipAuthorizations,
    ipAuthorizationsLoading,
    ipAuthorizationsError,
    fetchIpAuthorizations,

    // Activities
    activities,
    activitiesLoading,
    activitiesError,
    fetchActivities,

    // Actions
    downloadProxyList,
    refreshProxyList,
    createIpAuthorization,
    deleteIpAuthorization,
    getMyIp,
    downloadActivities,
    purchasePlan,
  };
};
