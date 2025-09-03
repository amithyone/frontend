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
      // Debug: inspect raw response from backend to verify shape
      console.log('VTU getDataNetworks raw:', data);
      
      if (data.success) {
         const payload = data.data;
         if (Array.isArray(payload)) {
           return payload.map((item: any, idx: number) => {
             const rawCode = typeof item === 'string' ? item : (item?.code ?? item?.id ?? item?.name ?? `NET${idx+1}`);
             const rawName = typeof item === 'string' ? item : (item?.name ?? rawCode);
             const status = typeof item === 'object' && item?.status ? item.status : 'active';
             const codeStr = String(rawCode).toUpperCase();
             return {
               id: String(idx + 1),
               name: String(rawName).toUpperCase(),
               code: codeStr,
               status,
             } as VtuNetwork;
           });
         }
         return payload;
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
      console.log('VTU getDataBundles called with network:', network);
      // Proxy to backend variations endpoint which talks to VTU.ng
      const params = new URLSearchParams({ service_id: network.toLowerCase() });
      console.log('VTU getDataBundles URL params:', params.toString());
      const fullUrl = `${this.baseUrl}/variations/data?${params}`;
      console.log('VTU getDataBundles full URL:', fullUrl);
      const response = await fetch(fullUrl, {
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
      // Debug: inspect raw variations from backend to verify fields
      console.log('VTU getDataBundles raw:', data);
      
      if (data.success) {
        // Map backend response format to VtuDataBundle[]
        const payload = data.data;
        console.log('VTU getDataBundles payload:', payload);
        
        // Handle nested data structure: data.data.data or data.data
        const list = Array.isArray(payload) ? payload : (payload?.data && Array.isArray(payload.data) ? payload.data : []);
        console.log('VTU getDataBundles list:', list);
        
        const mappedBundles = list.map((item: any, idx: number) => ({
          id: String(
            item?.variation_id ??
            item?.id ??
            `${network.toUpperCase()}-${item?.plan ?? idx}`
          ),
          name: item.plan_name || item.plan || item.name || 'Plan',
          size: item.plan || '',
          validity: '',
          price: Number(
            item.amount ??
            item.reseller_price ??
            item.selling_price ??
            item.variation_amount ??
            item.price ??
            0
          ),
          network: network.toUpperCase(),
          description: item.plan_name || item.plan || '',
        }));
        
        console.log('VTU getDataBundles mapped:', mappedBundles);
        return mappedBundles;
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
      // Validate required fields
      if (!request.network) throw new Error('Network is required');
      if (!request.phone) throw new Error('Phone number is required');
      if (!request.plan) throw new Error('Plan is required');
      if (!request.amount || request.amount <= 0) throw new Error('Valid amount is required');

      // Adapt request to backend payload: { network, phone, plan, plan_name, amount }
      const payload = {
        network: (request.network || '').toLowerCase(),
        phone: request.phone,
        plan: request.plan,
        plan_name: request.plan_name || request.plan,
        amount: request.amount,
      };

      console.log('Data bundle purchase payload:', payload);
      const response = await fetch(`${this.baseUrl}/data/purchase`, {
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
      console.log('Backend response:', data);

      if (data.success) {
        return {
          reference: data.data.reference,
          network: payload.network,
          phone: payload.phone,
          amount: request.amount,
          status: 'success',
          message: 'Data bundle purchase request sent',
          plan: payload.plan,
          plan_name: payload.plan_name,
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
