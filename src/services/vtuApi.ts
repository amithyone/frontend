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
  // For data purchases via VTU.ng-backed API, use:
  // network: service_id (e.g., 'mtn' | 'glo' | 'airtel' | '9mobile')
  network: string;
  phone: string;
  amount?: number;
  // plan holds variation_id from VTU.ng variations endpoint
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

// Mock data for development
const MOCK_AIRTIME_NETWORKS: VtuNetwork[] = [
  { id: '1', name: 'MTN', code: 'MTN', status: 'active' },
  { id: '2', name: 'Airtel', code: 'AIRTEL', status: 'active' },
  { id: '3', name: 'Glo', code: 'GLO', status: 'active' },
  { id: '4', name: '9mobile', code: '9MOBILE', status: 'active' },
];

const MOCK_DATA_NETWORKS: VtuNetwork[] = [
  { id: '1', name: 'MTN', code: 'MTN', status: 'active' },
  { id: '2', name: 'Airtel', code: 'AIRTEL', status: 'active' },
  { id: '3', name: 'Glo', code: 'GLO', status: 'active' },
  { id: '4', name: '9mobile', code: '9MOBILE', status: 'active' },
];

const MOCK_DATA_BUNDLES: { [key: string]: VtuDataBundle[] } = {
  MTN: [
    { id: '1', name: '1GB', size: '1GB', validity: '30 days', price: 250, network: 'MTN' },
    { id: '2', name: '2GB', size: '2GB', validity: '30 days', price: 450, network: 'MTN' },
    { id: '3', name: '5GB', size: '5GB', validity: '30 days', price: 1000, network: 'MTN' },
  ],
  AIRTEL: [
    { id: '4', name: '1.5GB', size: '1.5GB', validity: '30 days', price: 300, network: 'AIRTEL' },
    { id: '5', name: '3GB', size: '3GB', validity: '30 days', price: 600, network: 'AIRTEL' },
  ],
  GLO: [
    { id: '6', name: '1GB', size: '1GB', validity: '30 days', price: 200, network: 'GLO' },
    { id: '7', name: '2GB', size: '2GB', validity: '30 days', price: 400, network: 'GLO' },
  ],
  '9MOBILE': [
    { id: '8', name: '1GB', size: '1GB', validity: '30 days', price: 180, network: '9MOBILE' },
    { id: '9', name: '2GB', size: '2GB', validity: '30 days', price: 350, network: '9MOBILE' },
  ],
};

import { API_VTU_URL } from './api';

// VTU API Service
class VtuApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_VTU_URL;
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

      if (response.status === 404) {
        console.warn('VTU airtime networks endpoint not found, using mock data');
        return MOCK_AIRTIME_NETWORKS;
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch airtime networks');
      }
    } catch (error) {
      console.error('Error fetching airtime networks:', error);
      console.warn('Using mock airtime networks data');
      return MOCK_AIRTIME_NETWORKS;
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

      if (response.status === 404) {
        console.warn('VTU data networks endpoint not found, using mock data');
        return MOCK_DATA_NETWORKS;
      }

      const data = await response.json();
      
      if (data.success) {
        // Backend returns an array of service_id strings (e.g., ['mtn','glo',...])
        if (Array.isArray(data.data)) {
          return (data.data as string[]).map((code, idx) => ({
            id: String(idx + 1),
            name: code.toUpperCase(),
            code: code.toUpperCase(),
            status: 'active',
          }));
        }
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch data networks');
      }
    } catch (error) {
      console.error('Error fetching data networks:', error);
      console.warn('Using mock data networks');
      return MOCK_DATA_NETWORKS;
    }
  }

  /**
   * Get data bundles for a specific network
   */
  async getDataBundles(network: string): Promise<VtuDataBundle[]> {
    try {
      // Proxy to backend variations endpoint which talks to VTU.ng
      const params = new URLSearchParams({ service_id: network.toLowerCase() });
      const response = await fetch(`${this.baseUrl}/variations/data?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // variations endpoint is public in backend; auth header optional
          'Authorization': this.getAuthToken() ? `Bearer ${this.getAuthToken()}` : '',
        },
      });

      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        throw new Error(`Unexpected response type: ${ct || 'unknown'}`);
      }
      const data = await response.json();
      
      if (data.success) {
        // Map VTU.ng format to VtuDataBundle[]
        const payload = data.data;
        const list = Array.isArray(payload?.data) ? payload.data : [];
        return list.map((item: any) => ({
          id: String(item.variation_id),
          name: item.data_plan || item.service_name || 'Plan',
          size: item.data_plan || '',
          validity: '',
          price: Number(item.reseller_price ?? item.price ?? 0),
          network: network.toUpperCase(),
          description: item.data_plan || '',
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch data bundles');
      }
    } catch (error) {
      console.error('Error fetching data bundles:', error);
      console.warn('Using mock data bundles');
      return MOCK_DATA_BUNDLES[network] || [];
    }
  }

  /**
   * Purchase airtime
   */
  async purchaseAirtime(request: VtuPurchaseRequest): Promise<VtuPurchaseResponse> {
    try {
      // Adapt to backend payload: { service_id, phone, amount }
      const payload = {
        service_id: (request.network || '').toLowerCase(),
        phone: request.phone,
        amount: request.amount ?? 0,
      };
      const response = await fetch(`${this.baseUrl}/airtime/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        throw new Error(`Unexpected response type: ${ct || 'unknown'}`);
      }
      const data = await response.json();
      
      if (data.success) {
        return {
          reference: data.data.reference,
          network: payload.service_id,
          phone: payload.phone,
          amount: payload.amount,
          status: 'success',
          message: 'Airtime purchase request sent',
        };
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
      // Adapt request to backend payload: { service_id, phone, variation_id, amount }
      const payload = {
        service_id: (request.network || '').toLowerCase(),
        phone: request.phone,
        variation_id: request.plan || '',
        amount: request.amount ?? 0,
      };
      const response = await fetch(`${this.baseUrl}/data/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 404) {
        console.warn('VTU data purchase endpoint not found, returning mock response');
        return {
          reference: `DATA${Date.now()}`,
          network: request.network,
          phone: request.phone,
          amount: request.amount || 0,
          status: 'pending',
          message: 'Mock data purchase - endpoint not implemented',
          plan: request.plan,
          plan_name: request.plan_name,
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          reference: data.data.reference,
          network: payload.service_id,
          phone: payload.phone,
          amount: payload.amount,
          status: 'success',
          message: 'Data bundle purchase request sent',
          plan: payload.variation_id,
          plan_name: request.plan_name,
        };
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

      if (response.status === 404) {
        console.warn('VTU transaction status endpoint not found, returning mock response');
        return {
          reference,
          status: 'pending',
          message: 'Mock transaction status - endpoint not implemented',
        };
      }

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

  // TV: variations (public)
  async getTvVariations(serviceId: string) {
    const params = new URLSearchParams({ service_id: serviceId.toLowerCase() });
    const resp = await fetch(`${this.baseUrl}/variations/tv?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error(`Unexpected response type: ${ct || 'unknown'}`);
    const data = await resp.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch TV variations');
    return data.data;
  }

  // Verify customer (electricity/TV/betting)
  async verifyCustomer(serviceId: string, customerId: string, variationId?: string) {
    const payload: any = { service_id: serviceId.toLowerCase(), customer_id: customerId };
    if (variationId) payload.variation_id = variationId;
    const resp = await fetch(`${this.baseUrl}/verify-customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error(`Unexpected response type: ${ct || 'unknown'}`);
    const data = await resp.json();
    if (!data.success) throw new Error(data.message || 'Verification failed');
    return data.data;
  }

  // Purchase TV
  async purchaseTv(serviceId: string, customerId: string, variationId: string) {
    const payload = { service_id: serviceId.toLowerCase(), customer_id: customerId, variation_id: variationId };
    const resp = await fetch(`${this.baseUrl}/tv/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error(`Unexpected response type: ${ct || 'unknown'}`);
    const data = await resp.json();
    if (!data.success) throw new Error(data.message || 'TV purchase failed');
    return data.data;
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

      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        throw new Error(`Unexpected response type: ${ct || 'unknown'}`);
      }
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

      if (response.status === 404) {
        console.warn('VTU phone validation endpoint not found, returning mock response');
        return {
          is_valid: true,
          phone,
          network,
        };
      }

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
    // Prefer 'auth_token' (AuthContext), fallback to legacy 'authToken'
    return localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
  }
}

export const vtuApiService = new VtuApiService();
export default VtuApiService;
