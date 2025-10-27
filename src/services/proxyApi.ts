// Proxy API Types
export interface ProxyProfile {
  id: string;
  username: string;
  email: string;
  balance: number;
  currency: string;
  subscription_status: 'active' | 'inactive' | 'expired';
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProxyListResponse {
  proxies: Proxy[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface Proxy {
  id: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  country: string;
  city?: string;
  type: 'http' | 'https' | 'socks4' | 'socks5';
  anonymity: 'transparent' | 'anonymous' | 'elite';
  speed: number;
  uptime: number;
  last_checked: string;
  is_active: boolean;
}

export interface ProxyStats {
  total_proxies: number;
  active_proxies: number;
  inactive_proxies: number;
  countries: number;
  types: {
    http: number;
    https: number;
    socks4: number;
    socks5: number;
  };
  anonymity: {
    transparent: number;
    anonymous: number;
    elite: number;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  duration_unit: 'days' | 'months' | 'years';
  features: string[];
  proxy_count: number;
  country_count: number;
  max_speed: number;
  is_popular: boolean;
}

export interface ProxyConfig {
  default_country: string;
  default_type: string;
  default_anonymity: string;
  max_proxies_per_request: number;
  refresh_interval: number;
  download_format: 'txt' | 'json' | 'csv';
}

export interface IpAuthorization {
  id: string;
  ip: string;
  description?: string;
  created_at: string;
  is_active: boolean;
}

export interface ProxyActivity {
  id: string;
  proxy_id: string;
  action: 'download' | 'test' | 'refresh' | 'delete';
  ip_address: string;
  user_agent?: string;
  created_at: string;
}

export interface ProxyActivityResponse {
  activities: ProxyActivity[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface PurchaseProxyRequest {
  plan_id: string;
  payment_method: string;
}

export interface PurchaseProxyResponse {
  success: boolean;
  message: string;
  reference?: string;
  subscription_expires_at?: string;
}

// Mock data for development
const MOCK_PROXY_PROFILE: ProxyProfile = {
  id: '1',
  username: 'john_doe',
  email: 'john@example.com',
  balance: 5000,
  currency: 'NGN',
  subscription_status: 'active',
  subscription_expires_at: '2024-12-31T23:59:59Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const MOCK_PROXY_LIST: Proxy[] = [
  { id: '1', ip: '192.168.1.1', port: 8080, username: 'user1', password: 'pass1', country: 'Nigeria', type: 'http', anonymity: 'elite', speed: 85, uptime: 95, last_checked: '2024-01-01T00:00:00Z', is_active: true },
  { id: '2', ip: '192.168.1.2', port: 8080, username: 'user2', password: 'pass2', country: 'Ghana', type: 'https', anonymity: 'anonymous', speed: 75, uptime: 88, last_checked: '2024-01-01T00:00:00Z', is_active: true },
  { id: '3', ip: '192.168.1.3', port: 1080, username: 'user3', password: 'pass3', country: 'Kenya', type: 'socks5', anonymity: 'transparent', speed: 65, uptime: 92, last_checked: '2024-01-01T00:00:00Z', is_active: true },
];

const MOCK_PROXY_STATS: ProxyStats = {
  total_proxies: 1000,
  active_proxies: 850,
  inactive_proxies: 150,
  countries: 25,
  types: { http: 400, https: 300, socks4: 200, socks5: 100 },
  anonymity: { transparent: 200, anonymous: 500, elite: 300 },
};

const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: '1', name: 'Basic', description: 'Perfect for small projects', price: 5000, currency: 'NGN', duration: 30, duration_unit: 'days', features: ['500 proxies', '10 countries', 'Basic support'], proxy_count: 500, country_count: 10, max_speed: 10, is_popular: false },
  { id: '2', name: 'Professional', description: 'Great for growing businesses', price: 15000, currency: 'NGN', duration: 30, duration_unit: 'days', features: ['2000 proxies', '25 countries', 'Priority support'], proxy_count: 2000, country_count: 25, max_speed: 50, is_popular: true },
  { id: '3', name: 'Enterprise', description: 'For large scale operations', price: 50000, currency: 'NGN', duration: 30, duration_unit: 'days', features: ['Unlimited proxies', 'All countries', '24/7 support'], proxy_count: -1, country_count: -1, max_speed: 100, is_popular: false },
];

// import { API_PROXY_URL } from './api';

// Proxy API Service
class ProxyApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.fadsms.com/api';
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<ProxyProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy profile endpoint not found, using mock data');
        return MOCK_PROXY_PROFILE;
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      console.warn('Using mock proxy profile data');
      return MOCK_PROXY_PROFILE;
    }
  }

  /**
   * Get proxy list
   */
  async getProxyList(params: Record<string, any> = {}): Promise<ProxyListResponse> {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${this.baseUrl}/list?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy list endpoint not found, using mock data');
        return {
          proxies: MOCK_PROXY_LIST,
          total: MOCK_PROXY_LIST.length,
          current_page: 1,
          last_page: 1,
          per_page: MOCK_PROXY_LIST.length,
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy list');
      }
    } catch (error) {
      console.error('Error fetching proxy list:', error);
      console.warn('Using mock proxy list data');
      return {
        proxies: MOCK_PROXY_LIST,
        total: MOCK_PROXY_LIST.length,
        current_page: 1,
        last_page: 1,
        per_page: MOCK_PROXY_LIST.length,
      };
    }
  }

  /**
   * Download proxy list
   */
  async downloadProxyList(params: Record<string, any> = {}): Promise<{ download_url: string }> {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${this.baseUrl}/list/download?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy download endpoint not found, returning mock response');
        return { download_url: 'https://example.com/mock-proxy-list.txt' };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to generate download link');
      }
    } catch (error) {
      console.error('Error downloading proxy list:', error);
      throw error;
    }
  }

  /**
   * Refresh proxy list
   */
  async refreshProxyList(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/list/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy refresh endpoint not found, returning mock response');
        return { message: 'Mock proxy list refreshed - endpoint not implemented' };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to refresh proxy list');
      }
    } catch (error) {
      console.error('Error refreshing proxy list:', error);
      throw error;
    }
  }

  /**
   * Get proxy statistics
   */
  async getProxyStats(params: Record<string, any> = {}): Promise<ProxyStats> {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${this.baseUrl}/stats?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy stats endpoint not found, using mock data');
        return MOCK_PROXY_STATS;
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy stats');
      }
    } catch (error) {
      console.error('Error fetching proxy stats:', error);
      console.warn('Using mock proxy stats data');
      return MOCK_PROXY_STATS;
    }
  }

  /**
   * Get subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy plans endpoint not found, using mock data');
        return MOCK_SUBSCRIPTION_PLANS;
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch subscription plans');
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      console.warn('Using mock subscription plans data');
      return MOCK_SUBSCRIPTION_PLANS;
    }
  }

  /**
   * Get proxy configuration
   */
  async getProxyConfig(): Promise<ProxyConfig> {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy config endpoint not found, using mock data');
        return {
          default_country: 'Nigeria',
          default_type: 'http',
          default_anonymity: 'elite',
          max_proxies_per_request: 100,
          refresh_interval: 300,
          download_format: 'txt',
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy config');
      }
    } catch (error) {
      console.error('Error fetching proxy config:', error);
      console.warn('Using mock proxy config data');
      return {
        default_country: 'Nigeria',
        default_type: 'http',
        default_anonymity: 'elite',
        max_proxies_per_request: 100,
        refresh_interval: 300,
        download_format: 'txt',
      };
    }
  }

  /**
   * Get IP authorizations
   */
  async getIpAuthorizations(): Promise<IpAuthorization[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ip-authorizations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy IP authorizations endpoint not found, using mock data');
        return [
          { id: '1', ip: '192.168.1.100', description: 'Office IP', created_at: '2024-01-01T00:00:00Z', is_active: true },
          { id: '2', ip: '192.168.1.101', description: 'Home IP', created_at: '2024-01-01T00:00:00Z', is_active: true },
        ];
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch IP authorizations');
      }
    } catch (error) {
      console.error('Error fetching IP authorizations:', error);
      console.warn('Using mock IP authorizations data');
      return [
        { id: '1', ip: '192.168.1.100', description: 'Office IP', created_at: '2024-01-01T00:00:00Z', is_active: true },
        { id: '2', ip: '192.168.1.101', description: 'Home IP', created_at: '2024-01-01T00:00:00Z', is_active: true },
      ];
    }
  }

  /**
   * Get proxy activities
   */
  async getProxyActivities(params: Record<string, any> = {}): Promise<ProxyActivityResponse> {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${this.baseUrl}/activities?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy activities endpoint not found, using mock data');
        return {
          activities: [],
          total: 0,
          current_page: 1,
          last_page: 1,
          per_page: 10,
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy activities');
      }
    } catch (error) {
      console.error('Error fetching proxy activities:', error);
      console.warn('Using mock proxy activities data');
      return {
        activities: [],
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 10,
      };
    }
  }

  /**
   * Create IP authorization
   */
  async createIpAuthorization(ip: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/ip-authorizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ ip }),
      });

      if (response.status === 404) {
        console.warn('Proxy create IP authorization endpoint not found, returning mock response');
        return { message: 'Mock IP authorization created - endpoint not implemented' };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create IP authorization');
      }
    } catch (error) {
      console.error('Error creating IP authorization:', error);
      throw error;
    }
  }

  /**
   * Delete IP authorization
   */
  async deleteIpAuthorization(authorizationId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/ip-authorizations/${authorizationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy delete IP authorization endpoint not found, returning mock response');
        return { message: 'Mock IP authorization deleted - endpoint not implemented' };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to delete IP authorization');
      }
    } catch (error) {
      console.error('Error deleting IP authorization:', error);
      throw error;
    }
  }

  /**
   * Get my IP address
   */
  async getMyIp(): Promise<{ ip: string; country: string; city?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/my-ip`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy my-ip endpoint not found, returning mock response');
        return { ip: '192.168.1.100', country: 'Nigeria', city: 'Lagos' };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get IP address');
      }
    } catch (error) {
      console.error('Error getting IP address:', error);
      throw error;
    }
  }

  /**
   * Download proxy activities
   */
  async downloadProxyActivities(params: Record<string, any> = {}): Promise<{ download_url: string }> {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${this.baseUrl}/activities/download?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.status === 404) {
        console.warn('Proxy activities download endpoint not found, returning mock response');
        return { download_url: 'https://example.com/mock-proxy-activities.csv' };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to generate activities download link');
      }
    } catch (error) {
      console.error('Error downloading proxy activities:', error);
      throw error;
    }
  }

  /**
   * Purchase proxy plan
   */
  async purchaseProxyPlan(request: PurchaseProxyRequest): Promise<PurchaseProxyResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (response.status === 404) {
        console.warn('Proxy purchase endpoint not found, returning mock response');
        return {
          success: true,
          message: 'Mock proxy plan purchased - endpoint not implemented',
          reference: `PROXY${Date.now()}`,
          subscription_expires_at: '2024-12-31T23:59:59Z',
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to purchase proxy plan');
      }
    } catch (error) {
      console.error('Error purchasing proxy plan:', error);
      throw error;
    }
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}

export const proxyApiService = new ProxyApiService();
export default ProxyApiService;
