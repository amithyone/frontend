// Centralized API configuration

// export const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:8000';
// export const API_AUTH_URL = (import.meta as any)?.env?.VITE_API_AUTH_URL || 'http://localhost:8000';
// export const API_VTU_URL = (import.meta as any)?.env?.VITE_API_VTU_URL || 'http://localhost:8000/vtu';
// export const API_SMS_URL = (import.meta as any)?.env?.VITE_API_SMS_URL || 'http://localhost:8000';
// export const API_PROXY_URL = (import.meta as any)?.env?.VITE_API_PROXY_URL || 'http://localhost:8000/proxy';
// export const API_WALLET_URL = (import.meta as any)?.env?.VITE_API_WALLET_URL || 'http://localhost:8000/wallet';

export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T> { status: ApiStatus; data?: T; message?: string }

// Auth
export interface RegisterBody { name: string; email: string; password: string }
export interface LoginBody { email: string; password: string }
export interface AuthUser { id: number; name: string; email: string; wallet?: any; role_id?: number }
export interface AuthResponse { user: AuthUser; token: string }

// Profile
export interface ProfileData { id: number; name: string; email: string; wallet: any; role_id: number }

// Transactions
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionType = 'credit' | 'debit';
export interface TransactionItem {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  reference?: string;
  created_at: string;
}

// Wallet (PayVibe)
export interface InitiateTopUpBody { amount: number; user_id: number }
export interface InitiateTopUpData {
  reference: string;
  account_number: string;
  bank_name: string; // Wema Bank
  account_name: string; // Finspa/PAYVIBE
  amount: number;
  charge: number;
  final_amount: number;
  expiry: number; // seconds
  transaction_id: number | string;
}
export interface VerifyPaymentBody { reference: string }
export interface VerifyPaymentData { status: 'pending' | 'completed' | 'failed'; amount?: number }

// SMS Services
export interface SmsServiceItem { id: number; name: string; country: string; price: number; currency: string }
export interface OrderSmsNumberBody { user_id: number; service: string; country: string; provider?: string; mode?: 'auto' | 'manual' }
export interface OrderSmsNumberData { order_id: string | number; phone: string; cost: number; api_service_id: number | string }
export interface GetSmsCodeBody { activation_id: string; user_id: number }
export interface GetSmsCodeData { code?: string; status: 'pending' | 'received' | 'expired' }

// Inbox
export interface InboxMessage {
  id: number;
  user_id: number;
  type: 'electricity_token' | 'general';
  title: string;
  message: string;
  reference?: string;
  is_read: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}
export interface InboxMessagesResponse {
  messages: InboxMessage[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}
export interface UnreadCountResponse {
  unread_count: number;
}
export interface MarkAsReadBody {
  message_id: string;
}

// VTU
export type VtuType = 'airtime' | 'data';
export interface VtuServiceItem { id: number; name: string; type: VtuType; provider: string; price: number }
export interface PurchaseVtuBody { service_id: number; phone: string; amount?: number; bundle_code?: string }
export interface PurchaseVtuData { order_id: string | number; status: string }

// Airtime Purchase
export interface AirtimePurchaseBody {
  network: string;
  phone: string;
  amount: number;
}

export interface AirtimePurchaseData {
  reference: string;
  network: string;
  phone: string;
  amount: number;
  status: string;
  message: string;
}

// Proxy
export interface ProxyServiceItem { id: number; name: string; price: number; provider: string }
export interface PurchaseProxyBody { service_id: number; region: string }
export interface PurchaseProxyData { order_id: string | number; status: string }

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.fadsms.com/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    const token = localStorage.getItem('auth_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const init: RequestInit = { ...options, headers };

    const resp = await fetch(url, init);
    if (resp.status === 401) {
      // Do not auto-clear token here; let callers decide how to handle 401s
      return { status: 'error', message: 'Unauthenticated.', statusCode: 401 } as any;
    }
    if (!resp.ok) {
      console.error(`HTTP ${resp.status} for ${endpoint}`);
    }
    const json = (await resp.json()) as ApiResponse<T>;
    return json;
  }

  // Auth
  public async register(body: RegisterBody, init?: RequestInit) {
    return this.request<ApiResponse<AuthResponse>['data']>('/register', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  public async login(body: LoginBody, init?: RequestInit) {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  public async logout(init?: RequestInit) {
    return this.request<undefined>('/logout', {
      method: 'POST',
      ...init,
    });
  }

  // Profile
  public async getUserProfile(init?: RequestInit) {
    return this.request<ProfileData>('/user', { method: 'GET', ...init });
  }

  // Transactions
  public async getUserTransactions(init?: RequestInit) {
    try {
      const response = await this.request<TransactionItem[]>('/transactions', { method: 'GET', ...init });
      // Normalize backend { success, data } into ApiResponse shape
      const anyResp: any = response as any;
      if (typeof anyResp?.success === 'boolean') {
        return {
          status: anyResp.success ? 'success' as const : 'error' as const,
          data: anyResp.data ?? [],
          message: anyResp.message,
        };
      }
      return response;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return {
        status: 'success' as const,
        data: []
      };
    }
  }

  // NOTE: Transactions are created automatically by backend purchase endpoints
  // createTransaction and updateTransaction methods removed - not needed on frontend

  // Wallet
  public async getWalletStats(init?: RequestInit) {
    return this.request<{ totalTopUps: number; totalSpent: number }>('/wallet/stats', { method: 'GET', ...init });
  }

  public async getRecentDeposits(init?: RequestInit) {
    return this.request<Array<{ id: number; amount: number; reference: string; status: string; created_at: string }>>('/wallet/deposits', { method: 'GET', ...init });
  }

  // Support - unread replies count
  public async getSupportUnreadCount(init?: RequestInit) {
    const raw = await this.request<{ unread_count: number }>('/support/unread-count', { method: 'GET', ...init });
    const anyResp: any = raw as any;
    const payload: any = (typeof anyResp?.success === 'boolean') ? (anyResp?.data ?? {}) : (anyResp ?? {});
    const unread = payload?.unread_count ?? payload?.data?.unread_count ?? 0;
    const success = typeof unread === 'number';
    return { success, data: { unread_count: success ? unread : 0 } } as any;
  }

  public async initiateTopUp(body: InitiateTopUpBody, init?: RequestInit) {
    // Protected endpoint expects only { amount } and uses auth token for user
    const primary = await this.request<InitiateTopUpData>('/wallet/topup/initiate', {
      method: 'POST',
      body: JSON.stringify({ amount: body.amount }),
      ...init,
    });
    const anyResp: any = primary as any;
    const unauth = anyResp?.message === 'Unauthenticated.' || anyResp?.status === 401;
    if (unauth) {
      // Fallback to public initiate endpoint when not authenticated
      return this.request<InitiateTopUpData>('/wallet/topup/initiate-public', {
        method: 'POST',
        body: JSON.stringify(body),
        ...init,
      });
    }
    return primary;
  }

  public async checkPaymentStatus(body: VerifyPaymentBody, init?: RequestInit) {
    return this.request<VerifyPaymentData>('/wallet/topup/verify', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  public async getTopUpHistory(init?: RequestInit) {
    return this.request<any>('/wallet/history', { method: 'GET', ...init });
  }

  // SMS Services - Note: Use smsApiService.getServices() instead

  public async orderSmsNumber(body: OrderSmsNumberBody, init?: RequestInit) {
    return this.request<OrderSmsNumberData>('/sms/order', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  public async getSmsCode(body: GetSmsCodeBody, init?: RequestInit) {
    return this.request<GetSmsCodeData>('/sms/code', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  // VTU
  public async getVtuServices(init?: RequestInit) {
    return this.request<VtuServiceItem[]>('/vtu/services', { method: 'GET', ...init });
  }

  public async purchaseVtu(body: PurchaseVtuBody, init?: RequestInit) {
    return this.request<PurchaseVtuData>('/vtu/purchase', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  public async purchaseAirtime(body: AirtimePurchaseBody, init?: RequestInit) {
    return this.request<AirtimePurchaseData>('/vtu/airtime/purchase', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  // Proxy
  public async getProxyServices(init?: RequestInit) {
    return this.request<ProxyServiceItem[]>('/proxy/services', { method: 'GET', ...init });
  }

  public async purchaseProxy(body: PurchaseProxyBody, init?: RequestInit) {
    return this.request<PurchaseProxyData>('/proxy/purchase', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  // Inbox
  public async getInboxMessages(params: { type?: string; is_read?: boolean; limit?: number; page?: number } = {}, init?: RequestInit) {
    const queryParams = new URLSearchParams();
    if (params.type) queryParams.append('type', params.type);
    if (params.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/inbox/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const raw = await this.request<InboxMessagesResponse>(endpoint, { method: 'GET', ...init });
    const anyResp: any = raw as any;
    const payload: any = (typeof anyResp?.success === 'boolean') ? (anyResp?.data ?? {}) : (anyResp ?? {});
    const messages = payload?.messages ?? payload?.data?.messages ?? [];
    const pagination = payload?.pagination ?? payload?.data?.pagination ?? {
      current_page: 1,
      last_page: 1,
      per_page: Array.isArray(messages) ? messages.length : 0,
      total: Array.isArray(messages) ? messages.length : 0,
      has_more: false,
    };
    const success = Array.isArray(messages);
    return { success, data: { messages, pagination }, message: anyResp?.message } as any;
  }

  public async getInboxUnreadCount(init?: RequestInit) {
    const raw = await this.request<UnreadCountResponse>('/inbox/unread-count', { method: 'GET', ...init });
    const anyResp: any = raw as any;
    if (anyResp?.message === 'Unauthenticated.' || anyResp?.status === 401) {
      return { success: false, message: 'Unauthenticated.' } as any;
    }
    const payload: any = (typeof anyResp?.success === 'boolean') ? (anyResp?.data ?? {}) : (anyResp ?? {});
    const unread = payload?.unread_count ?? payload?.data?.unread_count ?? 0;
    const success = typeof unread === 'number';
    return { success, data: { unread_count: success ? unread : 0 } } as any;
  }

  public async markInboxMessageAsRead(body: MarkAsReadBody, init?: RequestInit) {
    const raw = await this.request<{ success: boolean; message: string }>('/inbox/mark-read', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
    const anyResp: any = raw as any;
    const success = typeof anyResp?.success === 'boolean' ? anyResp.success : false;
    return { success, message: anyResp?.message ?? (success ? 'OK' : 'Failed to mark as read') } as any;
  }

  public async markAllInboxMessagesAsRead(init?: RequestInit) {
    const raw = await this.request<{ success: boolean; message: string }>('/inbox/mark-all-read', {
      method: 'POST',
      ...init,
    });
    const anyResp: any = raw as any;
    const success = typeof anyResp?.success === 'boolean' ? anyResp.success : false;
    return { success, message: anyResp?.message ?? (success ? 'OK' : 'Failed to mark all as read') } as any;
  }

  public async getInboxMessageDetails(messageId: number, init?: RequestInit) {
    const raw = await this.request<InboxMessage>(`/inbox/message/${messageId}`, { method: 'GET', ...init });
    const anyResp: any = raw as any;
    if (typeof anyResp?.success === 'boolean') return anyResp;
    return { success: true, data: anyResp } as any;
  }

  public async deleteInboxMessage(messageId: number, init?: RequestInit) {
    return this.request<{ success: boolean; message: string }>(`/inbox/message/${messageId}`, {
      method: 'DELETE',
      ...init,
    });
  }

  public async getElectricityTokenMessages(params: { limit?: number; page?: number } = {}, init?: RequestInit) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/inbox/electricity-tokens${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<InboxMessagesResponse>(endpoint, { method: 'GET', ...init });
  }

  public async createInboxMessage(body: { type: string; title: string; message: string; reference?: string; metadata?: any }, init?: RequestInit) {
    return this.request<InboxMessage>('/inbox/messages', {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    });
  }

  // Utilities
  public async testConnection(init?: RequestInit) {
    return this.request<any>('/simple-test', { method: 'GET', ...init });
  }
}

// Create service instances with appropriate base URLs
export const apiService = new ApiService('https://api.fadsms.com/api');
export const vtuApiService = new ApiService('https://api.fadsms.com/api');
export const smsApiService = new ApiService('https://api.fadsms.com/api');
export const proxyApiService = new ApiService('https://api.fadsms.com/api');
export const walletApiService = new ApiService('https://api.fadsms.com/api');

export default ApiService;
