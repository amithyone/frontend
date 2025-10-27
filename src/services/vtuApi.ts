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
  availability?: string;
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

// Mock data removed - VTU services should always use real provider prices
// If API fails, return empty array to avoid showing incorrect pricing
const MOCK_DATA_BUNDLES: { [key: string]: VtuDataBundle[] } = {
  MTN: [],
  AIRTEL: [],
  GLO: [],
  '9MOBILE': [],
};

// import { API_VTU_URL } from './api';

// Lightweight localStorage cache with TTL
function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const { value, expiresAt } = parsed;
    if (expiresAt && Date.now() > Number(expiresAt)) {
      localStorage.removeItem(key);
      return null;
    }
    return value as T;
  } catch {
    return null;
  }
}

function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  try {
    const expiresAt = Date.now() + ttlMs;
    localStorage.setItem(key, JSON.stringify({ value, expiresAt }));
  } catch {
    // ignore
  }
}

// VTU API Service
class VtuApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.fadsms.com/api';
  }

  /**
   * Get available airtime networks
   */
  async getAirtimeNetworks(): Promise<VtuNetwork[]> {
    try {
      const cacheKey = 'vtu.airtime.networks';
      const cached = cacheGet<VtuNetwork[]>(cacheKey);
      if (cached && cached.length) {
        // Background refresh using fresh fetcher to avoid recursion
        this.fetchAirtimeNetworksFresh().then((fresh) => {
          if (fresh && fresh.length) cacheSet(cacheKey, fresh, 1000 * 60 * 30);
        }).catch(() => {});
        return cached;
      }
      const fresh = await this.fetchAirtimeNetworksFresh();
      cacheSet(cacheKey, fresh, 1000 * 60 * 30);
      return fresh;
    } catch (error) {
      console.error('Error fetching airtime networks:', error);
      console.warn('Using mock airtime networks data');
      cacheSet('vtu.airtime.networks', MOCK_AIRTIME_NETWORKS, 1000 * 60 * 30);
      return MOCK_AIRTIME_NETWORKS;
    }
  }

  /**
   * Get available data networks
   */
  async getDataNetworks(): Promise<VtuNetwork[]> {
    try {
      const cacheKey = 'vtu.data.networks';
      const cached = cacheGet<VtuNetwork[]>(cacheKey);
      if (cached && cached.length) {
        this.fetchDataNetworksFresh().then((fresh) => {
          if (fresh && fresh.length) cacheSet(cacheKey, fresh, 1000 * 60 * 30);
        }).catch(() => {});
        return cached;
      }
      const fresh = await this.fetchDataNetworksFresh();
      cacheSet(cacheKey, fresh, 1000 * 60 * 30);
      return fresh;
    } catch (error) {
      console.error('Error fetching data networks:', error);
      console.warn('Using mock data networks');
      cacheSet('vtu.data.networks', MOCK_DATA_NETWORKS, 1000 * 60 * 30);
      return MOCK_DATA_NETWORKS;
    }
  }

  /**
   * Get data bundles for a specific network
   */
  async getDataBundles(network: string): Promise<VtuDataBundle[]> {
    try {
      console.log('VTU getDataBundles called with network:', network);
      // Cache key per network
      const cacheKey = `vtu.bundles.${network.toLowerCase()}`;
      const cached = cacheGet<VtuDataBundle[]>(cacheKey);
      if (cached && cached.length) {
        this.fetchDataBundlesFresh(network).then((fresh) => {
          if (fresh && fresh.length) cacheSet(cacheKey, fresh, 1000 * 60 * 15);
        }).catch(() => {});
        return cached;
      }
      const fresh = await this.fetchDataBundlesFresh(network);
      cacheSet(cacheKey, fresh, 1000 * 60 * 15);
      return fresh;
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
      // Adapt to backend payload: { network, phone, amount }
      const payload = {
        network: (request.network || '').toLowerCase(),
        phone: request.phone,
        amount: request.amount ?? 0,
      };
      const response = await fetch(`${this.baseUrl}/vtu/airtime/purchase`, {
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
          network: payload.network,
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
      const response = await fetch(`${this.baseUrl}/vtu/data/purchase`, {
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
      const response = await fetch(`${this.baseUrl}/vtu/transaction/status?${params}`, {
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
    const resp = await fetch(`${this.baseUrl}/vtu/variations/tv?${params}`, {
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
    const resp = await fetch(`${this.baseUrl}/vtu/verify-customer`, {
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
    const resp = await fetch(`${this.baseUrl}/vtu/tv/purchase`, {
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
      const response = await fetch(`${this.baseUrl}/vtu/provider/balance`, {
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
      const response = await fetch(`${this.baseUrl}/vtu/validate/phone`, {
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

  // Optional: warm up caches in parallel
  async warmup(): Promise<void> {
    try {
      await Promise.allSettled([
        this.getAirtimeNetworks(),
        this.getDataNetworks(),
        this.getDataBundles('mtn'),
        this.getDataBundles('airtel'),
      ]);
    } catch {}
  }

  private getAuthToken(): string {
    // Prefer 'auth_token' (AuthContext), fallback to legacy 'authToken'
    return localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
  }

  // Internal fresh fetchers (no cache, no background refresh)
  private async fetchAirtimeNetworksFresh(): Promise<VtuNetwork[]> {
    const response = await fetch(`${this.baseUrl}/vtu/airtime/networks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    if (response.status === 404) return MOCK_AIRTIME_NETWORKS;
    const data = await response.json();
    return data.success ? (data.data as VtuNetwork[]) : MOCK_AIRTIME_NETWORKS;
  }

  private async fetchDataNetworksFresh(): Promise<VtuNetwork[]> {
    const response = await fetch(`${this.baseUrl}/vtu/data/networks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    if (response.status === 404) return MOCK_DATA_NETWORKS;
    const data = await response.json();
    if (data.success) {
      const payload = data.data;
      if (Array.isArray(payload)) {
        return payload.map((item: any, idx: number) => {
          const rawCode = typeof item === 'string' ? item : (item?.code ?? item?.id ?? item?.name ?? `NET${idx+1}`);
          const rawName = typeof item === 'string' ? item : (item?.name ?? rawCode);
          const status = typeof item === 'object' && item?.status ? item.status : 'active';
          const codeStr = String(rawCode).toUpperCase();
          return { id: String(idx + 1), name: String(rawName).toUpperCase(), code: codeStr, status } as VtuNetwork;
        });
      }
      return payload as VtuNetwork[];
    }
    return MOCK_DATA_NETWORKS;
  }

  private async fetchDataBundlesFresh(network: string): Promise<VtuDataBundle[]> {
    const params = new URLSearchParams({ service_id: network.toLowerCase() });
    const fullUrl = `${this.baseUrl}/vtu/variations/data?${params}`;
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthToken() ? `Bearer ${this.getAuthToken()}` : '',
      },
    });
    const ct = response.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return [];
    const data = await response.json();
    if (!data.success) return [];
    const payload = data.data;
    const rawList = Array.isArray(payload) ? payload : (payload?.data && Array.isArray(payload.data) ? payload.data : []);
    const mapped = (rawList as any[]).map((item: any, idx: number) => {
      const id = String(item?.variation_id ?? item?.id ?? item?.plan ?? `plan_${idx}`);
      const planText = item?.data_plan || item?.variation_name || item?.plan_name || item?.plan || '';
      const price = Number(item?.price ?? item?.variation_amount ?? item?.amount ?? item?.reseller_price ?? item?.selling_price ?? 0);
      return { 
        id, 
        name: planText || 'Plan', 
        size: planText, 
        validity: item?.validity || '', 
        price, 
        network: network.toUpperCase(), 
        description: item?.description || planText,
        availability: item?.availability || 'Available'
      } as VtuDataBundle;
    }).filter((b: VtuDataBundle) => b.id && b.price > 0 && b.availability === 'Available');
    return mapped;
  }
}

export const vtuApiService = new VtuApiService();
export default VtuApiService;
