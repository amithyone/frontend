// Proxy API Types
export interface ProxyProfile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}

export interface ProxyServer {
  id: string;
  proxy_address: string;
  ports: {
    http: number;
    https: number;
    socks5: number;
  };
  username: string;
  password: string;
  country: string;
  city: string;
  isp: string;
  created_at: string;
  last_used: string;
  is_active: boolean;
}

export interface ProxyListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProxyServer[];
}

export interface ProxyStats {
  total_proxies: number;
  active_proxies: number;
  total_bandwidth_used: number;
  total_requests: number;
  success_rate: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  proxy_count: number;
  bandwidth_limit: number;
  features: string[];
  is_popular: boolean;
}

export interface ProxyConfig {
  username: string;
  password: string;
  proxy_address: string;
  ports: {
    http: number;
    https: number;
    socks5: number;
  };
}

export interface IpAuthorization {
  id: number;
  ip: string;
  created_at: string;
  is_active: boolean;
}

export interface ProxyActivity {
  id: string;
  proxy_id: string;
  timestamp: string;
  bytes_sent: number;
  bytes_received: number;
  status: string;
  target_url: string;
}

export interface ProxyPurchaseRequest {
  plan_id: string;
  payment_method: string;
}

export interface ProxyPurchaseResponse {
  plan_id: string;
  status: string;
  reference: string;
}

// Proxy API Service
class ProxyApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8000/api/proxy';
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

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
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

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy list');
      }
    } catch (error) {
      console.error('Error fetching proxy list:', error);
      throw error;
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

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy statistics');
      }
    } catch (error) {
      console.error('Error fetching proxy statistics:', error);
      throw error;
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

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch subscription plans');
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }

  /**
   * Get available assets
   */
  async getAvailableAssets(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/assets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch available assets');
      }
    } catch (error) {
      console.error('Error fetching available assets:', error);
      throw error;
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

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy configuration');
      }
    } catch (error) {
      console.error('Error fetching proxy configuration:', error);
      throw error;
    }
  }

  /**
   * Create IP authorization
   */
  async createIpAuthorization(ip: string): Promise<IpAuthorization> {
    try {
      const response = await fetch(`${this.baseUrl}/ip-authorization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ ip }),
      });

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

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch IP authorizations');
      }
    } catch (error) {
      console.error('Error fetching IP authorizations:', error);
      throw error;
    }
  }

  /**
   * Delete IP authorization
   */
  async deleteIpAuthorization(authorizationId: number): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/ip-authorization`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ authorization_id: authorizationId }),
      });

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
   * Get "What's my IP" information
   */
  async getMyIp(): Promise<{ ip: string; country: string; city: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/my-ip`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get IP information');
      }
    } catch (error) {
      console.error('Error getting IP information:', error);
      throw error;
    }
  }

  /**
   * Get proxy activities
   */
  async getProxyActivities(params: Record<string, any> = {}): Promise<ProxyActivity[]> {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${this.baseUrl}/activities?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch proxy activities');
      }
    } catch (error) {
      console.error('Error fetching proxy activities:', error);
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
  async purchaseProxyPlan(request: ProxyPurchaseRequest): Promise<ProxyPurchaseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

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
    // Get token from localStorage or your auth management
    return localStorage.getItem('auth_token') || '';
  }
}

export const proxyApiService = new ProxyApiService();
export default ProxyApiService;
