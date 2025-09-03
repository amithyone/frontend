import { apiService } from './api';

// SMS API Types
export interface SmsCountry {
  code: string;
  name: string;
  flag?: string;
  provider: string;
}

export interface SmsService {
  id?: number;
  name: string;
  service: string;
  cost: number;
  count: number;
  provider: string;
  provider_name: string;
  description?: string;
  status?: string;
  priority?: number;
  success_rate?: number;
}

export interface SmsOrder {
  id: string;
  order_id: string;
  phone_number: string;
  phone: string;
  service: string;
  country: string;
  cost: number;
  amount: number;
  status: string;
  expires_at: string;
  provider: string;
  provider_name: string;
  mode: string;
  success_rate: number;
  currency: string;
  reference: string;
  created_at: string;
  updated_at: string;
  message?: string;
}

export interface SmsProvider {
  id: number;
  name: string;
  provider: string;
  success_rate: number;
  total_orders: number;
  successful_orders: number;
  balance: number;
  last_balance_check: string;
  status: string;
  display_name: string;
}

export interface SmsCodeResponse {
  sms_code: string | null;
  status: string;
  received_at?: string;
  message?: string;
}

export interface SmsOrderHistory {
  order_id: string;
  phone_number: string;
  service: string;
  country: string;
  cost: number;
  status: string;
  status_label: string;
  sms_code?: string | null;
  expires_at?: string | null;
  received_at?: string | null;
  provider: string;
  created_at: string;
}

export interface SmsStats {
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  total_spent: number;
  recent_orders: Array<{
    order_id: string;
    service: string;
    status: string;
    created_at: string;
  }>;
}

// Mock data for development (fallback)
const MOCK_SMS_COUNTRIES: SmsCountry[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', provider: 'auto' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', provider: 'auto' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', provider: 'auto' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', provider: 'auto' },
];

const MOCK_SMS_SERVICES: SmsService[] = [
  {
    id: 1,
    name: 'WhatsApp',
    service: 'whatsapp',
    cost: 50,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  },
  {
    id: 2,
    name: 'Telegram',
    service: 'telegram',
    cost: 45,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  },
  {
    id: 3,
    name: 'Google',
    service: 'google',
    cost: 60,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  },
  {
    id: 4,
    name: 'Facebook',
    service: 'facebook',
    cost: 40,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  }
];

const MOCK_SMS_PROVIDERS: SmsProvider[] = [
  {
    id: 1,
    name: 'Auto Provider',
    provider: 'auto',
    success_rate: 95,
    total_orders: 1250,
    successful_orders: 1188,
    balance: 5000,
    last_balance_check: '2024-01-15T10:30:00Z',
    status: 'active',
    display_name: 'Auto Selection'
  }
];

import { API_SMS_URL } from './api';

// SMS API Service
class SmsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_SMS_URL;
  }

  /**
   * Get available countries from Laravel backend
   */
  async getCountries(): Promise<SmsCountry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch countries`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Transform Laravel response to match our interface
        return data.data.map((country: any) => ({
          code: country.code,
          name: country.name,
          flag: this.getCountryFlag(country.code),
          provider: country.provider || 'auto'
        }));
      } else {
        // Fallback to mock data if Laravel doesn't return expected format
        console.warn('Using mock SMS countries data');
        return MOCK_SMS_COUNTRIES;
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      // Fallback to mock data
      return MOCK_SMS_COUNTRIES;
    }
  }

  /**
   * Get available SMS services from Laravel backend
   */
  async getServices(country: string, provider?: string): Promise<SmsService[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ country, provider }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch services`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Transform Laravel response to match our interface
        return data.data.map((service: any) => ({
          id: service.id,
          name: service.name,
          service: service.service,
          cost: Number(service.cost),
          count: service.count ?? 1,
          provider: service.provider,
          provider_name: service.provider_name,
          description: service.description,
          status: service.status ?? 'active',
          priority: service.priority ?? 1,
          success_rate: service.success_rate ?? 95,
        }));
      } else {
        // Fallback to mock data if Laravel doesn't return expected format
        console.warn('Using mock SMS services data');
        return MOCK_SMS_SERVICES;
      }
    } catch (error) {
      console.error('Error fetching services from Laravel, using mock data:', error);
      return MOCK_SMS_SERVICES;
    }
  }

  /**
   * Get available SMS servers (Manual Server Selection)
   */
  async getServers(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/servers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch servers`);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch servers');
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
      throw error;
    }
  }

  /**
   * Get available providers with success rates for manual selection
   */
  async getProviders(): Promise<SmsProvider[]> {
    try {
      // Use the getServices method to get providers
      const services = await this.getServices();
      
      // Transform services to providers format
      return services.map((service: any) => ({
        id: service.id || 1,
        name: service.name,
        provider: service.provider,
        success_rate: service.success_rate || 95,
        total_orders: 0,
        successful_orders: 0,
        balance: 0,
        last_balance_check: new Date().toISOString(),
        status: service.status || 'active',
        display_name: service.name
      }));
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  }

  /**
   * Create a new SMS order with mode selection
   */
  async createOrder(country: string, service: string, mode: 'auto' | 'manual' = 'auto', provider?: string, userIdOverride?: number): Promise<SmsOrder> {
    try {
      const tokenUserId = this.getUserId();
      const effectiveUserId = userIdOverride ?? tokenUserId ?? null;

      const body: any = {
        country: country.toLowerCase(),
        service: service,
        mode: mode,
      };
      if (provider) body.provider = provider;
      if (effectiveUserId) body.user_id = effectiveUserId;

      const response = await fetch(`${this.baseUrl}/sms/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let msg = `HTTP ${response.status}: Failed to create order`;
        try {
          const errJson = await response.json();
          if (errJson?.message) msg = errJson.message;
        } catch {}
        throw new Error(msg);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Transform Laravel response to match our interface
        return {
          id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          order_id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          phone_number: data.data.phone_number || '',
          phone: data.data.phone_number || '',
          country: data.data.country || country,
          service: data.data.service || service,
          cost: Number(data.data.cost) || 0,
          amount: Number(data.data.cost) || 0,
          status: data.data.status || 'pending',
          expires_at: new Date(Date.now() + 300000).toISOString(), // 5 minutes
          provider: data.data.provider || 'Auto',
          provider_name: data.data.provider_name || 'Auto',
          mode: mode,
          success_rate: 95,
          currency: data.data.currency || 'NGN',
          reference: data.data.order_id?.toString() || `SMS${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      } else if (data.status === 'success' && data.data) {
        // Handle alternative response format
        return {
          id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          order_id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          phone_number: data.data.phone_number || '',
          phone: data.data.phone_number || '',
          country: data.data.country || country,
          service: data.data.service || service,
          cost: Number(data.data.cost) || 0,
          amount: Number(data.data.cost) || 0,
          status: data.data.status || 'pending',
          expires_at: new Date(Date.now() + 300000).toISOString(), // 5 minutes
          provider: data.data.provider || 'Auto',
          provider_name: data.data.provider_name || 'Auto',
          mode: mode,
          success_rate: 95,
          currency: data.data.currency || 'NGN',
          reference: data.data.order_id?.toString() || `SMS${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get SMS code for an order
   */
  async getSmsCode(orderId: string): Promise<{ sms_code: string; status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          user_id: this.getUserId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to get SMS code`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          sms_code: data.data.sms_code || data.data.code || '',
          status: data.data.status || 'pending',
        };
      } else if (data.status === 'success' && data.data) {
        return {
          sms_code: data.data.sms_code || data.data.code || '',
          status: data.data.status || 'pending',
        };
      } else {
        throw new Error(data.message || 'Failed to get SMS code');
      }
    } catch (error) {
      console.error('Error getting SMS code:', error);
      throw error;
    }
  }

  /**
   * Cancel an SMS order
   */
  async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to cancel order`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: data.success,
          message: data.message,
        };
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling SMS order:', error);
      throw error;
    }
  }

  /**
   * Get user's SMS orders
   */
  async getOrders(status?: string, page: number = 1): Promise<SmsOrderHistory[]> {
    try {
      // Ensure page is a valid number and not too high
      const validPage = Math.max(1, Math.min(page, 100)); // Limit to 100 pages max
      
      const params = new URLSearchParams({ page: validPage.toString() });
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${this.baseUrl}/sms/orders?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch orders`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Handle paginated response structure
        const orders = data.data.data || data.data;
        
        return orders.map((order: any) => ({
          order_id: order.order_id?.toString() || order.id?.toString(),
          phone_number: order.phone_number || '',
          service: order.service_type || order.service,
          country: order.country || '',
          cost: parseFloat(order.amount) || 0,
          status: order.status || 'pending',
          status_label: order.status || 'pending',
          sms_code: order.sms_code || null,
          expires_at: order.expires_at || null,
          received_at: order.received_at || null,
          provider: order.provider || 'auto',
          created_at: order.created_at || new Date().toISOString(),
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching SMS orders:', error);
      throw error;
    }
  }

  /**
   * Get inbox (previous SMS requests) using existing orders endpoint
   */
  async getInbox(status?: string, limit: number = 20): Promise<SmsOrderHistory[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('limit', String(limit));

      const response = await fetch(`${this.baseUrl}/sms/orders?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch inbox`);
      const data = await response.json();
      if (data.success && data.data) return data.data as SmsOrderHistory[];
      throw new Error(data.message || 'Failed to fetch inbox');
    } catch (e) {
      console.error('Error fetching inbox:', e);
      throw e;
    }
  }

  /**
   * Get SMS service statistics
   */
  async getStats(): Promise<SmsStats> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch statistics`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching SMS statistics:', error);
      throw error;
    }
  }

  /**
   * Poll for SMS code with retry mechanism
   */
  async pollForSmsCode(orderId: string, maxAttempts: number = 30, interval: number = 2000): Promise<string> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;
          const response = await this.getSmsCode(orderId);

          if (response.sms_code) {
            resolve(response.sms_code);
            return;
          }

          if (attempts >= maxAttempts) {
            reject(new Error('SMS code not received within timeout period'));
            return;
          }

          // Continue polling
          setTimeout(poll, interval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Get countries and NGN prices for a given service
   */
  async getCountriesByService(service: string): Promise<Array<{ country: string; cost: number; provider_name: string }>> {
    const response = await fetch(`${this.baseUrl}/sms/countries-by-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ service })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch countries by service`);
    const data = await response.json();
    if (data.success && data.data) {
      return data.data.map((r: any) => ({ country: r.country, cost: Number(r.cost), provider_name: r.provider_name }));
    }
    throw new Error(data.message || 'Failed to fetch countries by service');
  }

  /**
   * Get services catalog (distinct services) with min NGN price and counts
   */
  async getServicesCatalog(search: string = '', limit: number = 100, offset: number = 0): Promise<{ items: SmsService[]; limit: number; offset: number; count: number; has_more: boolean; }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('limit', String(limit));
    params.append('offset', String(offset));

    const response = await fetch(`${this.baseUrl}/sms/services/catalog?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch services catalog`);
    const data = await response.json();

    if (data.success && data.data) {
      const items: SmsService[] = (data.data.items || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        service: s.service,
        cost: Number(s.cost),
        count: Number(s.count ?? 1),
        provider: s.provider || 'auto',
        provider_name: s.provider_name || 'Best price',
        description: s.description,
        status: s.status || 'active',
        priority: s.priority || 1,
        success_rate: s.success_rate || 95,
      }));
      return {
        items,
        limit: Number(data.data.limit ?? limit),
        offset: Number(data.data.offset ?? offset),
        count: Number(data.data.count ?? items.length),
        has_more: Boolean(data.data.has_more),
      };
    }

    throw new Error(data.message || 'Failed to fetch services catalog');
  }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  /**
   * Get user ID from auth token
   */
  private getUserId(): number | null {
    try {
      const token = this.getAuthToken();
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      const candidate = payload.sub ?? payload.user_id ?? payload.id ?? payload.uid ?? null;
      return candidate != null ? Number(candidate) : null;
    } catch (error) {
      console.error('Error getting user ID from token:', error);
      return null;
    }
  }

  /**
   * Get country flag emoji
   */
  private getCountryFlag(countryCode: string): string {
    const flagMap: { [key: string]: string } = {
      'US': '🇺🇸', 'UK': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'AT': '🇦🇹', 'CH': '🇨🇭',
      'IE': '🇮🇪', 'PT': '🇵🇹', 'GR': '🇬🇷', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'NZ': '🇳🇿', 'JP': '🇯🇵',
      'KR': '🇰🇷', 'CN': '🇨🇳', 'HK': '🇭🇰', 'TW': '🇹🇼', 'IL': '🇮🇱',
      'TR': '🇹🇷', 'SA': '🇸🇦', 'AE': '🇦🇪', 'QA': '🇶🇦', 'KW': '🇰🇼',
      'BH': '🇧🇭', 'OM': '🇴🇲', 'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾',
      'IQ': '🇮🇶', 'IR': '🇮🇷', 'AF': '🇦🇫', 'UZ': '🇺🇿', 'KZ': '🇰🇿',
      'KG': '🇰🇬', 'TJ': '🇹🇯', 'TM': '🇹🇲', 'AZ': '🇦🇿', 'GE': '🇬🇪',
      'AM': '🇦🇲', 'BY': '🇧🇾', 'MD': '🇲🇩', 'AL': '🇦🇱', 'MK': '🇲🇰',
      'RS': '🇷🇸', 'ME': '🇲🇪', 'BA': '🇧🇦', 'XK': '🇽🇰', 'NG': '🇳🇬'
    };
    return flagMap[countryCode] || '🌍';
  }
}

export const smsApiService = new SmsApiService();
export default SmsApiService;
