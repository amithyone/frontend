import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vtuApiService, VtuNetwork, VtuDataBundle, VtuPurchaseRequest, VtuPurchaseResponse, VtuTransactionStatus, VtuProviderBalance } from '../services/vtuApi';

interface UseVtuReturn {
  // Networks
  airtimeNetworks: VtuNetwork[];
  dataNetworks: VtuNetwork[];
  loadingNetworks: boolean;
  errorNetworks: string | null;
  fetchAirtimeNetworks: () => Promise<void>;
  fetchDataNetworks: () => Promise<void>;

  // Data Bundles
  dataBundles: VtuDataBundle[];
  loadingBundles: boolean;
  errorBundles: string | null;
  fetchDataBundles: (network: string) => Promise<void>;

  // Provider Balance
  providerBalance: VtuProviderBalance | null;
  loadingBalance: boolean;
  errorBalance: string | null;
  fetchProviderBalance: () => Promise<void>;

  // Actions
  purchaseAirtime: (request: VtuPurchaseRequest) => Promise<VtuPurchaseResponse>;
  purchaseDataBundle: (request: VtuPurchaseRequest) => Promise<VtuPurchaseResponse>;
  getTransactionStatus: (reference: string) => Promise<VtuTransactionStatus>;
  validatePhoneNumber: (phone: string, network: string) => Promise<{ is_valid: boolean; phone: string; network: string }>;
}

export const useVtu = (): UseVtuReturn => {
  const { token } = useAuth();
  // Networks state
  const [airtimeNetworks, setAirtimeNetworks] = useState<VtuNetwork[]>([]);
  const [dataNetworks, setDataNetworks] = useState<VtuNetwork[]>([]);
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [errorNetworks, setErrorNetworks] = useState<string | null>(null);

  // Data Bundles state
  const [dataBundles, setDataBundles] = useState<VtuDataBundle[]>([]);
  const [loadingBundles, setLoadingBundles] = useState(false);
  const [errorBundles, setErrorBundles] = useState<string | null>(null);

  // Provider Balance state
  const [providerBalance, setProviderBalance] = useState<VtuProviderBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [errorBalance, setErrorBalance] = useState<string | null>(null);

  // Fetch airtime networks
  const fetchAirtimeNetworks = useCallback(async () => {
    setLoadingNetworks(true);
    setErrorNetworks(null);
    
    try {
      const data = await vtuApiService.getAirtimeNetworks();
      setAirtimeNetworks(data);
    } catch (error) {
      setErrorNetworks(error instanceof Error ? error.message : 'Failed to fetch airtime networks');
    } finally {
      setLoadingNetworks(false);
    }
  }, []);

  // Fetch data networks
  const fetchDataNetworks = useCallback(async () => {
    setLoadingNetworks(true);
    setErrorNetworks(null);
    
    try {
      const data = await vtuApiService.getDataNetworks();
      setDataNetworks(data);
    } catch (error) {
      setErrorNetworks(error instanceof Error ? error.message : 'Failed to fetch data networks');
    } finally {
      setLoadingNetworks(false);
    }
  }, []);

  // Fetch data bundles
  const fetchDataBundles = useCallback(async (network: string) => {
    setLoadingBundles(true);
    setErrorBundles(null);
    
    try {
      const data = await vtuApiService.getDataBundles(network);
      setDataBundles(data);
    } catch (error) {
      setErrorBundles(error instanceof Error ? error.message : 'Failed to fetch data bundles');
    } finally {
      setLoadingBundles(false);
    }
  }, []);

  // Fetch provider balance
  const fetchProviderBalance = useCallback(async () => {
    setLoadingBalance(true);
    setErrorBalance(null);
    
    try {
      const data = await vtuApiService.getProviderBalance();
      setProviderBalance(data);
    } catch (error) {
      setErrorBalance(error instanceof Error ? error.message : 'Failed to fetch provider balance');
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  // Purchase airtime
  const purchaseAirtime = useCallback(async (request: VtuPurchaseRequest): Promise<VtuPurchaseResponse> => {
    try {
      const response = await vtuApiService.purchaseAirtime(request);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Purchase data bundle
  const purchaseDataBundle = useCallback(async (request: VtuPurchaseRequest): Promise<VtuPurchaseResponse> => {
    try {
      const response = await vtuApiService.purchaseDataBundle(request);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Get transaction status
  const getTransactionStatus = useCallback(async (reference: string): Promise<VtuTransactionStatus> => {
    try {
      const response = await vtuApiService.getTransactionStatus(reference);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Validate phone number
  const validatePhoneNumber = useCallback(async (phone: string, network: string): Promise<{ is_valid: boolean; phone: string; network: string }> => {
    try {
      const response = await vtuApiService.validatePhoneNumber(phone, network);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Load data when auth token is available
  useEffect(() => {
    if (!token) {
      return;
    }
    fetchAirtimeNetworks();
    fetchDataNetworks();
    fetchProviderBalance();
  }, [token]);

  return {
    // Networks
    airtimeNetworks,
    dataNetworks,
    loadingNetworks,
    errorNetworks,
    fetchAirtimeNetworks,
    fetchDataNetworks,

    // Data Bundles
    dataBundles,
    loadingBundles,
    errorBundles,
    fetchDataBundles,

    // Provider Balance
    providerBalance,
    loadingBalance,
    errorBalance,
    fetchProviderBalance,

    // Actions
    purchaseAirtime,
    purchaseDataBundle,
    getTransactionStatus,
    validatePhoneNumber,
  };
};
