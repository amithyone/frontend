import React, { useEffect, useState } from 'react';
// import { API_VTU_URL } from '../services/api';
import { X, Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface ElectricityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Provider = { id: string; name: string };

enum MeterType {
  Prepaid = 'prepaid',
  Postpaid = 'postpaid',
}

const ElectricityModal: React.FC<ElectricityModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [meterType, setMeterType] = useState<MeterType>(MeterType.Prepaid);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState<string>('');

  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [recentCustomers, setRecentCustomers] = useState<string[]>([]);
  const [purchaseResult, setPurchaseResult] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const wallet = typeof user?.balance === 'number' ? user.balance : 0;

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        const resp = await fetch(`https://api.fadsms.com/api/electricity/providers`);
        const ct = resp.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('Unexpected response');
        const data = await resp.json();
        if (!data.success) throw new Error('Failed to load providers');
        setProviders(data.data || []);
      } catch {
        setProviders([]);
      }
    };
    load();
  }, [isOpen]);

  // load recent meter/account numbers on open
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem('electricity_customer_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRecentCustomers(parsed.filter((s) => typeof s === 'string'));
      }
    } catch {}
  }, [isOpen]);

  const addCustomerToHistory = (id: string) => {
    const cleaned = (id || '').trim();
    if (!cleaned) return;
    const next = [cleaned, ...recentCustomers.filter((p) => p !== cleaned)].slice(0, 6);
    setRecentCustomers(next);
    try { localStorage.setItem('electricity_customer_history', JSON.stringify(next)); } catch {}
  };

  const clearCustomerHistory = () => {
    setRecentCustomers([]);
    try { localStorage.removeItem('electricity_customer_history'); } catch {}
  };

  useEffect(() => {
    if (!serviceId && providers.length) setServiceId(providers[0].id);
  }, [providers, serviceId]);

  const verify = async () => {
    setMsg(null);
    setVerifying(true);
    setVerifiedName(null);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
      const resp = await fetch(`https://api.fadsms.com/api/electricity/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ service_id: serviceId, customer_id: customerId, variation_id: meterType }),
      });
      const ct = resp.headers.get('content-type') || '';
      if (!ct.includes('application/json')) throw new Error('Unexpected response type');
      const data = await resp.json();
      if (!data.success) throw new Error(data.message || 'Verification failed');
      const name = data?.data?.data?.customer_name || data?.data?.customer_name || 'Verified';
      setVerifiedName(name);
      setMsg({ type: 'success', text: `Verified: ${name}` });
    } catch (e: any) {
      setMsg({ type: 'error', text: e?.message || 'Verification failed' });
    } finally {
      setVerifying(false);
    }
  };

  const submit = async () => {
    setMsg(null);
    const amt = Number(amount);
    if (!serviceId || !customerId || !amt || amt <= 0) {
      setMsg({ type: 'error', text: 'Select provider, enter meter number and valid amount' });
      return;
    }
    if (amt > wallet) {
      setMsg({ type: 'error', text: 'Insufficient wallet balance' });
      return;
    }
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
      
      const requestBody = { 
        service_id: serviceId, 
        customer_id: customerId, 
        variation_id: meterType, 
        amount: amt 
      };
      
      console.log('=== ELECTRICITY PURCHASE REQUEST ===');
      console.log('URL:', 'https://api.fadsms.com/api/electricity/purchase');
      console.log('Request body:', requestBody);
      console.log('Has token:', !!token);
      console.log('Token (first 20 chars):', token?.substring(0, 20));
      
      // Backend handles transaction creation, balance deduction, and SMS sending
      let resp;
      try {
        resp = await fetch(`https://api.fadsms.com/api/electricity/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(requestBody),
        });
        console.log('Fetch completed successfully');
      } catch (fetchErr: any) {
        console.error('=== FETCH ERROR ===');
        console.error('Error type:', fetchErr.name);
        console.error('Error message:', fetchErr.message);
        console.error('Full error:', fetchErr);
        throw new Error(`Network error: ${fetchErr.message}. Check your internet connection.`);
      }
      
      console.log('Electricity purchase response status:', resp.status);
      console.log('Response headers:', {
        contentType: resp.headers.get('content-type'),
        status: resp.status,
        statusText: resp.statusText
      });
      
      const ct = resp.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        console.error('Non-JSON response received:', ct);
        const textResponse = await resp.text();
        console.error('Full response content:', textResponse);
        console.error('Response URL:', resp.url);
        throw new Error(`Server returned HTML instead of JSON. Status: ${resp.status}. Check console for details.`);
      }
      
      const data = await resp.json();
      console.log('Electricity purchase data:', data);
      
      if (!resp.ok) {
        console.error('Electricity purchase failed:', data);
        throw new Error(data.message || `HTTP ${resp.status}: ${resp.statusText}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Electricity purchase failed');
      }
      
      // Backend has already handled everything, just display the result
      addCustomerToHistory(customerId);
      
      // Check if transaction is processing (timeout scenario)
      const isProcessing = data.processing || data.data?.status === 'processing';
      
      // Store purchase result for receipt display
      setPurchaseResult({
        reference: data.data?.reference || `ELEC${Date.now()}`,
        customerId: customerId,
        customerName: verifiedName,
        amount: amt,
        provider: providers.find(p => p.id === serviceId)?.name || 'Unknown',
        meterType: meterType,
        token: data.data?.token || (isProcessing ? 'Processing...' : 'N/A'),
        units: data.data?.units || (isProcessing ? 'Processing...' : 'N/A'),
        date: new Date().toLocaleString(),
        status: isProcessing ? 'processing' : 'completed',
        ...data.data
      });
      
      if (isProcessing) {
        setMsg({ 
          type: 'success',  // Still success color since request was accepted
          text: 'Request received! Due to provider timeout, your electricity token is being processed. Check your inbox in 5-10 minutes for the token and receipt.' 
        });
        setShowReceipt(true);  // Show receipt with processing status
      } else {
        setMsg({ 
          type: 'success', 
          text: 'Electricity purchased successfully! Token sent to your SMS and inbox. Click to view receipt.' 
        });
        setShowReceipt(true);
      }
      
      // Clear form
      setCustomerId('');
      setAmount('');
      setVerifiedName(null);
      
    } catch (e: any) {
      console.error('=== ELECTRICITY PURCHASE ERROR ===');
      console.error('Error:', e);
      console.error('Error message:', e?.message);
      console.error('Error stack:', e?.stack);
      setMsg({ type: 'error', text: e?.message || 'Electricity purchase failed' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-500" /> Electricity Bills
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {msg && (
            <div className={`p-3 rounded flex items-center ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              {msg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Provider</label>
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
              {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meter Type</label>
            <select value={meterType} onChange={(e) => setMeterType(e.target.value as MeterType)} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
              <option value={MeterType.Prepaid}>Prepaid</option>
              <option value={MeterType.Postpaid}>Postpaid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meter / Account Number</label>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="Enter meter/account number" />
            {recentCustomers.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Recent meter/account</span>
                  <button type="button" onClick={clearCustomerHistory} className="text-xs text-red-500 hover:underline">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentCustomers.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCustomerId(id)}
                      className={`px-2 py-1 rounded border text-sm ${
                        isDark ? 'bg-gray-700 border-gray-600 hover:border-yellow-400' : 'bg-gray-50 border-gray-200 hover:border-yellow-400'
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {verifiedName && <div className="text-xs mt-1 text-green-600">Name: {verifiedName}</div>}
            <button onClick={verify} disabled={verifying || !serviceId || !customerId} className="mt-2 text-sm flex items-center gap-1 disabled:opacity-50">
              {verifying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Verify
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').replace(/^0+/, ''))}
              className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="e.g. 1000"
            />
            <div className="text-xs mt-1">Wallet: ₦{wallet.toLocaleString?.() || wallet}</div>
          </div>

          <button onClick={submit} disabled={isLoading || !serviceId || !customerId || Number(amount) <= 0} className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
            {isLoading ? 'Processing...' : 'Pay Electricity Bill'}
          </button>
        </div>
      </div>
      
      {/* Electricity Receipt Modal */}
      {showReceipt && purchaseResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center">
                <Zap className="h-6 w-6 mr-2 text-yellow-500" /> Electricity Receipt
              </h2>
              <button onClick={() => setShowReceipt(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                {purchaseResult.status === 'processing' ? (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-4">
                      <RefreshCw className="h-8 w-8 text-orange-600 dark:text-orange-400 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Request Processing</h3>
                    <p className="text-2xl font-bold text-orange-600">₦{purchaseResult.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-2">Token will be delivered to your inbox shortly</p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
                    <p className="text-2xl font-bold text-green-600">₦{purchaseResult.amount.toLocaleString()}</p>
                  </>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Provider:</span>
                  <span className="font-medium">{purchaseResult.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Meter Number:</span>
                  <span className="font-mono">{purchaseResult.customerId}</span>
                </div>
                {purchaseResult.customerName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer Name:</span>
                    <span className="font-medium">{purchaseResult.customerName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Meter Type:</span>
                  <span className="font-medium capitalize">{purchaseResult.meterType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-mono text-sm">{purchaseResult.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>{purchaseResult.date}</span>
                </div>
                
                {purchaseResult.token && purchaseResult.token !== 'N/A' && (
                  <div className="border-t pt-3 mt-3">
                    {purchaseResult.status === 'processing' ? (
                      <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Token Processing
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Your electricity token is being generated by the provider. This usually takes 5-10 minutes due to provider timeout.
                        </p>
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-200">
                          💡 Token will be sent to your inbox and SMS once processing completes. Reference: {purchaseResult.reference}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          🔆 Fadded VIP Token Details
                        </h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Token:</span>
                            <span className="font-mono text-lg font-bold text-yellow-700 dark:text-yellow-300">{purchaseResult.token}</span>
                          </div>
                          {purchaseResult.units && purchaseResult.units !== 'N/A' && purchaseResult.units !== 'Processing...' && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Units:</span>
                              <span className="font-medium">{purchaseResult.units} kWh</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-200">
                          💡 Token also sent to your SMS and saved in inbox for future reference
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => {
                    // Copy token to clipboard if available and not processing
                    if (purchaseResult.token && purchaseResult.token !== 'N/A' && purchaseResult.status !== 'processing') {
                      navigator.clipboard.writeText(purchaseResult.token);
                      setMsg({ type: 'success', text: 'Token copied to clipboard!' });
                    } else if (purchaseResult.status === 'processing') {
                      setMsg({ type: 'error', text: 'Token is still processing. Please check your inbox in a few minutes.' });
                    }
                  }}
                  disabled={purchaseResult.status === 'processing'}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    purchaseResult.status === 'processing' 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  {purchaseResult.status === 'processing' ? 'Processing...' : 'Copy Token'}
                </button>
                <button 
                  onClick={() => setShowReceipt(false)} 
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricityModal;