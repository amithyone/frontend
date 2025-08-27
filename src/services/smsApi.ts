import { apiService } from './api';

// SMS API Types
export interface SmsCountry {
  code: string;
  name: string;
  flag?: string;
  provider: string;
}

export interface SmsService {
  name: string;
  service: string;
  cost: number;
  count: number;
  provider: string;
  provider_name: string;
}

export interface SmsOrder {
  order_id: string;
  phone_number: string;
  service: string;
  country: string;
  cost: number;
  status: string;
  expires_at: string;
  provider: string;
  provider_name: string;
  mode: string;
  success_rate: number;
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
  sms_code?: string;
  expires_at?: string;
  received_at?: string;
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

// SMS API Service
class SmsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8000/api/sms';
  }

  /**
   * Get available countries from all SMS providers
   */
  async getCountries(): Promise<SmsCountry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/countries`, {
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
        throw new Error(data.message || 'Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  /**
   * Get available services for a specific country
   */
  async getServices(country: string, provider?: string): Promise<SmsService[]> {
    try {
      const params = new URLSearchParams({ country });
      if (provider) {
        params.append('provider', provider);
      }

      const response = await fetch(`${this.baseUrl}/services?${params}`, {
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
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  /**
   * Get available providers with success rates for manual selection
   */
  async getProviders(): Promise<SmsProvider[]> {
    try {
      const response = await fetch(`${this.baseUrl}/providers`, {
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
        throw new Error(data.message || 'Failed to fetch providers');
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  }

  /**
   * Create a new SMS order with mode selection
   */
  async createOrder(country: string, service: string, mode: 'auto' | 'manual' = 'auto', provider?: string): Promise<SmsOrder> {
    try {
      const body: any = {
        country,
        service,
        mode,
      };

      if (mode === 'manual' && provider) {
        body.provider = provider;
      }

      const response = await fetch(`${this.baseUrl}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create SMS order');
      }
    } catch (error) {
      console.error('Error creating SMS order:', error);
      throw error;
    }
  }

  /**
   * Get SMS code for an order
   */
  async getSmsCode(orderId: string): Promise<SmsCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/code?order_id=${orderId}`, {
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
      const response = await fetch(`${this.baseUrl}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await response.json();
      
      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      console.error('Error cancelling SMS order:', error);
      throw error;
    }
  }

  /**
   * Get user's SMS orders
   */
  async getOrders(status?: string, limit: number = 20): Promise<SmsOrderHistory[]> {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${this.baseUrl}/orders?${params}`, {
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
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching SMS orders:', error);
      throw error;
    }
  }

  /**
   * Get SMS service statistics
   */
  async getStats(): Promise<SmsStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
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

  private getAuthToken(): string {
    // Get token from localStorage or your auth management
    return localStorage.getItem('auth_token') || '';
  }
}

export const smsApiService = new SmsApiService();
export default SmsApiService;
