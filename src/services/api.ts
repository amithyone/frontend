// API service for communicating with Laravel backend
const API_BASE_URL = 'http://localhost:8000/api';

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
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
    return this.request('/test');
  }

  // Get all services
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>('/services');
  }

  // Create a new service
  async createService(serviceData: Omit<Service, 'id'>): Promise<ApiResponse<Service>> {
    return this.request<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  // Update a service
  async updateService(id: number, serviceData: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  // Delete a service
  async deleteService(id: number): Promise<ApiResponse<any>> {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;
