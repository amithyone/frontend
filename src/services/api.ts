// API service for communicating with Laravel backend
const API_BASE_URL = 'http://127.0.0.1:8000';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active?: boolean;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const defaultOptions: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Test API connection
  async testConnection(): Promise<ApiResponse<any>> {
    return this.request('/api/test');
  }

  // Get all services
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>('/api/services');
  }

  // Create a new service
  async createService(serviceData: Omit<Service, 'id'>): Promise<ApiResponse<Service>> {
    return this.request<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  // Update a service
  async updateService(id: number, serviceData: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  // Delete a service
  async deleteService(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/services/${id}`, {
      method: 'DELETE',
    });
  }

  // PayVibe wallet top-up methods - Updated to use our new endpoints
  async initiateTopUp(amount: number, userId: number = 27): Promise<ApiResponse<any>> {
    console.log('Initiating PayVibe top-up:', { amount, userId });
    
    const response = await this.request('/payvibe-initiate.php', {
      method: 'POST',
      body: JSON.stringify({ 
        amount,
        user_id: userId 
      }),
    });
    
    console.log('PayVibe response:', response);
    return response;
  }

  async checkPaymentStatus(reference: string): Promise<ApiResponse<any>> {
    return this.request('/payvibe-verify.php', {
      method: 'POST',
      body: JSON.stringify({ reference }),
    });
  }

  async getTopUpHistory(page: number = 1): Promise<ApiResponse<any>> {
    return this.request(`/api/wallet/history?page=${page}`);
  }

  // Get user profile and balance
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/api/user');
  }

  // Get user transactions
  async getUserTransactions(): Promise<ApiResponse<any>> {
    return this.request('/api/transactions');
  }

  // Get user wallet statistics
  async getWalletStats(): Promise<ApiResponse<any>> {
    return this.request('/api/wallet/stats');
  }

  // SMS Service API methods
  async getSmsServices(): Promise<ApiResponse<any>> {
    return this.request('/sms-service-api.php?action=getServices');
  }

  async orderSmsNumber(userId: number, service: string, country: string): Promise<ApiResponse<any>> {
    return this.request('/sms-service-api.php?action=orderNumber', {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userId,
        service,
        country 
      }),
    });
  }

  async getSmsCode(activationId: string, userId: number): Promise<ApiResponse<any>> {
    return this.request('/sms-service-api.php?action=getSms', {
      method: 'POST',
      body: JSON.stringify({ 
        activation_id: activationId,
        user_id: userId 
      }),
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;
