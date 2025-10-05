import React, { useEffect, useState } from 'react';
import { API_VTU_URL } from '../services/api';
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
        const resp = await fetch(`${API_VTU_URL}/electricity/providers`);
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
      const resp = await fetch(`${API_VTU_URL}/electricity/verify`, {
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
    
    let transactionId = null;
    
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
      
      // Step 1: Create transaction record with "processing" status
      const transactionResp = await fetch(`${API_VTU_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          type: 'debit',
          amount: amt,
          description: `Electricity bill payment - ${providers.find(p => p.id === serviceId)?.name || 'Unknown Provider'}`,
          reference: `ELEC${Date.now()}`,
          status: 'processing',
          metadata: {
            service_id: serviceId,
            customer_id: customerId,
            variation_id: meterType,
            customer_name: verifiedName
          }
        }),
      });
      
      const transactionData = await transactionResp.json();
      if (transactionData.success) {
        transactionId = transactionData.data.id;
      }
      
      // Step 2: Attempt electricity purchase
      const resp = await fetch(`${API_VTU_URL}/electricity/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ service_id: serviceId, customer_id: customerId, variation_id: meterType, amount: amt }),
      });
      
      const ct = resp.headers.get('content-type') || '';
      if (!ct.includes('application/json')) throw new Error('Unexpected response type');
      const data = await resp.json();
      
      if (data.success) {
        // Step 3: Update transaction status to "completed"
        if (transactionId) {
          await fetch(`${API_VTU_URL}/transactions/${transactionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              status: 'completed',
              metadata: {
                token: data.data?.token,
                units: data.data?.units,
                reference: data.data?.reference
              }
            }),
          });
        }
        
        // Step 4: Store electricity token in inbox
        await fetch(`${API_VTU_URL}/inbox/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            type: 'electricity_token',
            title: '🔆 Fadded VIP Electricity Token',
            message: `Your electricity token has been generated successfully. Token: ${data.data?.token || 'N/A'}, Units: ${data.data?.units || 'N/A'}`,
            reference: data.data?.reference || `ELEC${Date.now()}`,
            metadata: {
              token: data.data?.token,
              units: data.data?.units,
              customer_name: verifiedName,
              amount: amt,
              provider: providers.find(p => p.id === serviceId)?.name || 'Unknown'
            }
          }),
        });
        
        // Save the meter/account number after successful purchase
        addCustomerToHistory(customerId);
        
        // Store purchase result for receipt display
        setPurchaseResult({
          reference: data.data?.reference || `ELEC${Date.now()}`,
          customerId: customerId,
          customerName: verifiedName,
          amount: amt,
          provider: providers.find(p => p.id === serviceId)?.name || 'Unknown',
          meterType: meterType,
          token: data.data?.token || data.data?.receipt?.token || 'N/A',
          units: data.data?.units || data.data?.receipt?.units || 'N/A',
          date: new Date().toLocaleString(),
          ...data.data
        });
        
        setMsg({ 
          type: 'success', 
          text: 'Electricity purchased successfully! Token sent to your SMS and inbox. Click to view receipt.' 
        });
        setShowReceipt(true);
        
        // Clear form
        setCustomerId('');
        setAmount('');
        setVerifiedName(null);
        
      } else {
        // Step 3: Update transaction status to "failed" and refund user
        if (transactionId) {
          await fetch(`${API_VTU_URL}/transactions/${transactionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              status: 'failed',
              metadata: {
                error_message: data.message,
                refunded: true
              }
            }),
          });
        }
        
        // Create refund notification in inbox
        await fetch(`${API_VTU_URL}/inbox/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            type: 'general',
            title: '💳 Refund Notification',
            message: `Your electricity purchase failed and ₦${amt.toLocaleString()} has been refunded to your wallet. Reference: ${data.data?.reference || 'N/A'}`,
            reference: data.data?.reference || `REFUND${Date.now()}`,
            metadata: {
              amount: amt,
              original_reference: data.data?.reference,
              refund_reason: data.message
            }
          }),
        });
        
        throw new Error(data.message || 'Electricity purchase failed');
      }
      
    } catch (e: any) {
      // Update transaction status to "failed" if we have a transaction ID
      if (transactionId) {
        try {
          const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || '';
          await fetch(`${API_VTU_URL}/transactions/${transactionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              status: 'failed',
              metadata: {
                error_message: e.message,
                refunded: true
              }
            }),
          });
        } catch (updateError) {
          console.error('Failed to update transaction status:', updateError);
        }
      }
      
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
                <p className="text-2xl font-bold text-green-600">₦{purchaseResult.amount.toLocaleString()}</p>
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
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                        🔆 Fadded VIP Token Details
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Token:</span>
                          <span className="font-mono text-lg font-bold text-yellow-700 dark:text-yellow-300">{purchaseResult.token}</span>
                        </div>
                        {purchaseResult.units && purchaseResult.units !== 'N/A' && (
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
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => {
                    // Copy token to clipboard if available
                    if (purchaseResult.token && purchaseResult.token !== 'N/A') {
                      navigator.clipboard.writeText(purchaseResult.token);
                    }
                  }}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Copy Token
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