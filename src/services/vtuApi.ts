// VTU API Types
export interface VtuNetwork {
  id: string;
  name: string;
  code: string;
  logo?: string;
  status: 'active' | 'inactive';
}

export interface VtuDataBundle {
  id: string;
  name: string;
  size: string;
  validity: string;
  price: number;
  network: string;
  description?: string;
}

export interface VtuPurchaseRequest {
  network: string;
  phone: string;
  amount?: number;
  plan?: string;
  plan_name?: string;
}

export interface VtuPurchaseResponse {
  reference: string;
  network: string;
  phone: string;
  amount: number;
  status: string;
  message: string;
  plan?: string;
  plan_name?: string;
}

export interface VtuTransactionStatus {
  reference: string;
  status: string;
  message: string;
  data?: any;
}

export interface VtuProviderBalance {
  balance: number;
  currency: string;
}

// VTU API Service
class VtuApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8000/api/vtu';
  }

  /**
   * Get available airtime networks
   */
  async getAirtimeNetworks(): Promise<VtuNetwork[]> {
    try {
      const response = await fetch(`${this.baseUrl}/airtime/networks`, {
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
        throw new Error(data.message || 'Failed to fetch airtime networks');
      }
    } catch (error) {
      console.error('Error fetching airtime networks:', error);
      throw error;
    }
  }

  /**
   * Get available data networks
   */
  async getDataNetworks(): Promise<VtuNetwork[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/networks`, {
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
        throw new Error(data.message || 'Failed to fetch data networks');
      }
    } catch (error) {
      console.error('Error fetching data networks:', error);
      throw error;
    }
  }

  /**
   * Get data bundles for a specific network
   */
  async getDataBundles(network: string): Promise<VtuDataBundle[]> {
    try {
      const params = new URLSearchParams({ network });
      const response = await fetch(`${this.baseUrl}/data/bundles?${params}`, {
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
        throw new Error(data.message || 'Failed to fetch data bundles');
      }
    } catch (error) {
      console.error('Error fetching data bundles:', error);
      throw error;
    }
  }

  /**
   * Purchase airtime
   */
  async purchaseAirtime(request: VtuPurchaseRequest): Promise<VtuPurchaseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/airtime/purchase`, {
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
        throw new Error(data.message || 'Failed to purchase airtime');
      }
    } catch (error) {
      console.error('Error purchasing airtime:', error);
      throw error;
    }
  }

  /**
   * Purchase data bundle
   */
  async purchaseDataBundle(request: VtuPurchaseRequest): Promise<VtuPurchaseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/data/purchase`, {
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
        throw new Error(data.message || 'Failed to purchase data bundle');
      }
    } catch (error) {
      console.error('Error purchasing data bundle:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(reference: string): Promise<VtuTransactionStatus> {
    try {
      const params = new URLSearchParams({ reference });
      const response = await fetch(`${this.baseUrl}/transaction/status?${params}`, {
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
        throw new Error(data.message || 'Failed to get transaction status');
      }
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  /**
   * Get provider balance
   */
  async getProviderBalance(): Promise<VtuProviderBalance> {
    try {
      const response = await fetch(`${this.baseUrl}/provider/balance`, {
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
        throw new Error(data.message || 'Failed to get provider balance');
      }
    } catch (error) {
      console.error('Error getting provider balance:', error);
      throw error;
    }
  }

  /**
   * Validate phone number
   */
  async validatePhoneNumber(phone: string, network: string): Promise<{ is_valid: boolean; phone: string; network: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/validate/phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ phone, network }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to validate phone number');
      }
    } catch (error) {
      console.error('Error validating phone number:', error);
      throw error;
    }
  }

  private getAuthToken(): string {
    // Get token from localStorage or your auth management
    return localStorage.getItem('auth_token') || '';
  }
}

export const vtuApiService = new VtuApiService();
export default VtuApiService;
