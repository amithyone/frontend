import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBranding } from '../contexts/BrandingContext';
import { apiService } from '../services/api';
import { CreditCard, DollarSign, Copy, CheckCircle, Clock, XCircle } from 'lucide-react';

// Declare global payment gateway objects
declare global {
  interface Window {
    PaystackPop?: any;
    FlutterwaveCheckout?: any;
  }
}

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredited?: () => void; // optional callback to refresh balance/history
}

const quickAmounts = [1000, 2000, 5000];

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onCredited }) => {
  const { user } = useAuth();
  const { getPanelId, isResellerPanel } = useBranding();

  const [amount, setAmount] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gateway, setGateway] = useState<'payvibe'>('payvibe');
  const [paymentConfig, setPaymentConfig] = useState<any>(null);

  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed' | ''>('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPaymentConfig();
    } else {
      setAmount('');
      setIsGenerating(false);
      setGateway('payvibe');
      setAccountNumber('');
      setAccountName('');
      setBankName('');
      setReference('');
      setStatus('');
      setIsChecking(false);
    }
  }, [isOpen]);

  const loadPaymentConfig = async () => {
    try {
      const panelId = getPanelId();
      const url = panelId 
        ? `${import.meta.env.VITE_API_BASE_URL}/payment-config?panel_id=${panelId}`
        : `${import.meta.env.VITE_API_BASE_URL}/payment-config`;
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setPaymentConfig(data.data);
        console.log('Payment config loaded:', data.data);
        // Dynamically load gateway scripts only for reseller panels
        if (data.data?.is_reseller && data.data?.gateway) {
          if (data.data.gateway === 'paystack' && data.data.paystack_public_key) {
            await loadScriptOnce('https://js.paystack.co/v1/inline.js', 'paystack-inline');
          }
          if (data.data.gateway === 'flutterwave' && data.data.flutterwave_public_key) {
            await loadScriptOnce('https://checkout.flutterwave.com/v3.js', 'flutterwave-v3');
          }
        }
      }
    } catch (error) {
      console.error('Failed to load payment config:', error);
    }
  };

  const loadScriptOnce = (src: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const s = document.createElement('script');
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(s);
    });
  };

  const charge = useMemo(() => {
    const a = parseInt(amount || '0', 10) || 0;
    if (a <= 0) return 0;
    if (a <= 10000) return Math.round(a * 0.015 + 100);
    if (a <= 40000) return Math.round(a * 0.02 + 200);
    return Math.round(a * 0.025 + 300);
  }, [amount]);

  const finalAmount = useMemo(() => {
    const a = parseInt(amount || '0', 10) || 0;
    return a + charge;
  }, [amount, charge]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const startPolling = (ref: string) => {
    let attempts = 0;
    const maxAttempts = 18;
    const id = setInterval(async () => {
      attempts += 1;
      try {
        const resp = await apiService.checkPaymentStatus({ reference: ref });
        if (resp.status === 'success' && resp.data) {
          const st = resp.data.status || 'pending';
          setStatus(st as any);
          if (st === 'completed') {
            clearInterval(id);
            onCredited?.();
          }
          if (st === 'failed') {
            clearInterval(id);
          }
        }
      } catch {}
      if (attempts >= maxAttempts) clearInterval(id);
    }, 10000);
  };

  const generate = async () => {
    const a = parseInt(amount || '0', 10) || 0;
    if (a < 100) {
      alert('Please enter a valid amount (minimum ₦100)');
      return;
    }

    const panelId = getPanelId();
    const isOnResellerPanel = paymentConfig?.is_reseller && panelId;

    // If on reseller panel, check if they have configured payment gateway
    if (isOnResellerPanel) {
      if (!paymentConfig?.gateway) {
        alert('⚠️ This panel has not configured a payment gateway yet. Please contact the panel administrator.');
        return;
      }

      if (paymentConfig.gateway === 'paystack' && !paymentConfig.paystack_public_key) {
        alert('⚠️ Paystack not properly configured. Please contact the panel administrator.');
        return;
      }

      if (paymentConfig.gateway === 'flutterwave' && !paymentConfig.flutterwave_public_key) {
        alert('⚠️ Flutterwave not properly configured. Please contact the panel administrator.');
        return;
      }

      // Use Paystack or Flutterwave for reseller panel customers
      if (paymentConfig.gateway === 'paystack') {
        initiatePaystackPayment(a, paymentConfig.paystack_public_key);
        return;
      } else if (paymentConfig.gateway === 'flutterwave') {
        initiateFlutterwavePayment(a, paymentConfig.flutterwave_public_key);
        return;
      }
    }

    // Main site users - use PayVibe
    setIsGenerating(true);
    try {
      const userId = user?.id || 1; // Use user ID from auth context, fallback to 1 for testing
      const resp = await apiService.initiateTopUp({ amount: a, user_id: userId });
      
      if (resp.status === 'success' && resp.data) {
        setAccountNumber(resp.data.account_number);
        setAccountName(resp.data.account_name);
        setBankName(resp.data.bank_name);
        setReference(resp.data.reference);
        setStatus('pending');
        startPolling(resp.data.reference);
      } else {
        alert(resp.message || 'Failed to generate account number');
      }
    } catch (e) {
      alert('Failed to generate account number. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const initiatePaystackPayment = (amount: number, publicKey: string) => {
    // @ts-ignore - Paystack is loaded globally
    const handler = window.PaystackPop?.setup({
      key: publicKey,
      email: (user as any)?.email || '',
      amount: amount * 100, // Convert to kobo
      currency: 'NGN',
      ref: 'PSK_' + Math.floor(Math.random() * 1000000000),
      callback: function(response: any) {
        // Payment successful
        alert('✅ Payment successful! Your wallet will be credited shortly.');
        onClose();
        // Trigger balance refresh if callback exists
      },
      onClose: function() {
        alert('Payment cancelled');
      }
    });
    handler?.openIframe();
  };

  const initiateFlutterwavePayment = (amount: number, publicKey: string) => {
    // @ts-ignore - Flutterwave is loaded globally
    window.FlutterwaveCheckout?.({
      public_key: publicKey,
      tx_ref: 'FLW_' + Math.floor(Math.random() * 1000000000),
      amount: amount,
      currency: 'NGN',
      payment_options: 'card,banktransfer,ussd',
      customer: {
        email: (user as any)?.email || '',
        name: (user as any)?.name || '',
      },
      callback: function(response: any) {
        alert('✅ Payment successful! Your wallet will be credited shortly.');
        onClose();
      },
      onclose: function() {
        alert('Payment cancelled');
      }
    });
  };

  const checkNow = async () => {
    if (!reference) return;
    setIsChecking(true);
    try {
      const resp = await apiService.checkPaymentStatus({ reference });
      if (resp.status === 'success' && resp.data) {
        const st = resp.data.status || 'pending';
        setStatus(st as any);
        if (st === 'completed') onCredited?.();
      } else {
        alert(resp.message || 'Failed to check payment status');
      }
    } catch (e) {
      alert('Failed to check payment status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="w-full sm:w-[480px] bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Fund Wallet</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Amount</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {quickAmounts.map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className={`p-2 rounded-lg border text-sm ${amount === String(v) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`}
                >
                  ₦{v.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Payment Gateway</label>
            <div className="p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700">
              {paymentConfig?.is_reseller && paymentConfig?.gateway ? (
                <div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <span className="font-medium dark:text-white">
                      {paymentConfig.gateway === 'paystack' ? '💳 Paystack' : 
                       paymentConfig.gateway === 'flutterwave' ? '🦋 Flutterwave' : 
                       'PayVibe'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-300">
                    Payments processed by panel's configured gateway
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-orange-500" />
                    <span className="font-medium dark:text-white">PayVibe Bank Transfer</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-300">Instant virtual account generation and automatic verification</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={isGenerating || !amount}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Account...</span>
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5" />
                <span>Generate Account Number</span>
              </>
            )}
          </button>

          {accountNumber && (
            <div className="p-4 rounded-xl border-2 border-dashed border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600">
              <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Account Number</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold">{accountNumber}</span>
                    <button onClick={() => copyToClipboard(accountNumber)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Account Name</span>
                  <span className="font-semibold">{accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Bank</span>
                  <span className="font-semibold">{bankName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Amount</span>
                  <span className="font-bold text-green-600">₦{(parseInt(amount || '0', 10) || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Charge</span>
                  <span className="font-bold text-orange-600">₦{charge.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">Total to Transfer</span>
                  <span className="font-bold text-blue-600">₦{finalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Reference</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold">{reference}</span>
                    <button onClick={() => copyToClipboard(reference)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {status && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : status === 'pending'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {status}
                    </span>
                  </div>
                )}
              </div>

              {reference && status === 'pending' && (
                <button
                  onClick={checkNow}
                  disabled={isChecking}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  {isChecking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Check Payment Status</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;


