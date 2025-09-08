import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { CreditCard, DollarSign, Copy, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredited?: () => void; // optional callback to refresh balance/history
}

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onCredited }) => {
  const { user } = useAuth();

  const [amount, setAmount] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gateway, setGateway] = useState<'payvibe'>('payvibe');

  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed' | ''>('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!isOpen) {
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
    if (gateway !== 'payvibe') {
      alert('Unsupported gateway selected');
      return;
    }
    setIsGenerating(true);
    try {
      const userId = (user as any)?.id || (user as any)?.user_id || 0;
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full sm:w-[480px] bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
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
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <span className="font-medium dark:text-white">PayVibe Bank Transfer</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-300">Instant virtual account generation and automatic verification</p>
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


