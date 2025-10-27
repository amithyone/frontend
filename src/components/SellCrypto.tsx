import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  DollarSign,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  Info,
  TrendingUp,
  Wallet as WalletIcon
} from 'lucide-react';

interface ExchangeRate {
  payment_method: string;
  rate_per_usd: number;
  min_amount: number;
  max_amount: number;
  instructions: string;
  disclaimer: string;
  admin_wallet_address?: string;
  admin_paypal_email?: string;
}

interface CryptoSale {
  id: number;
  transaction_id: string;
  payment_method: string;
  crypto_amount: number;
  exchange_rate: number;
  naira_amount: number;
  status: string;
  created_at: string;
  admin_notes?: string;
}

const SellCrypto: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [sales, setSales] = useState<CryptoSale[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || '');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [paypalEmail, setPaypalEmail] = useState<string>('');
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'sell' | 'history'>('sell');

  useEffect(() => {
    loadRates();
    loadSalesHistory();
  }, []);

  const loadRates = async () => {
    try {
      const response = await fetch('https://api.fadsms.com/api/crypto/rates');
      const data = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setRates(data.data);
        if (data.data.length > 0) {
          setSelectedMethod(data.data[0].payment_method);
        }
      }
    } catch (error) {
      console.error('Failed to load rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSalesHistory = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/crypto/my-sales', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setSales(data.data);
      }
    } catch (error) {
      console.error('Failed to load sales history:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setProofImages(prev => prev.filter((_, i) => i !== index));
  };

  const calculateNaira = () => {
    const selectedRate = rates.find(r => r.payment_method === selectedMethod);
    if (!selectedRate || !amount) return 0;
    return parseFloat(amount) * selectedRate.rate_per_usd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      alert('Please add your phone number to continue');
      return;
    }

    if (proofImages.length === 0) {
      alert('Please upload at least one proof of payment screenshot');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const payload = {
        payment_method: selectedMethod,
        crypto_amount: parseFloat(amount),
        user_wallet_address: walletAddress || null,
        user_paypal_email: paypalEmail || null,
        recipient_account_number: accountNumber,
        recipient_account_name: accountName,
        recipient_bank_name: bankName,
        recipient_phone: phoneNumber,
        proof_images: proofImages
      };

      const response = await fetch('https://api.fadsms.com/api/crypto/sell', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('✅ ' + data.message);
        // Reset form
        setAmount('');
        setWalletAddress('');
        setPaypalEmail('');
        setProofImages([]);
        loadSalesHistory();
        setActiveTab('history');
      } else {
        alert('❌ ' + (data.message || 'Failed to submit request'));
      }
    } catch (error) {
      console.error('Failed to submit crypto sale:', error);
      alert('❌ Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRate = rates.find(r => r.payment_method === selectedMethod);
  const nairaAmount = calculateNaira();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'usdt': '💵 USDT (TRC20)',
      'paypal': '💙 PayPal',
      'bitcoin': '₿ Bitcoin',
      'ethereum': 'Ξ Ethereum'
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-3 py-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-3 py-4">
          <div className="text-center py-12">
            <WalletIcon className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Crypto Sales Unavailable
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Crypto and PayPal sales are currently disabled. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-3 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💰 Sell Crypto & PayPal
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Convert your crypto or PayPal to Naira instantly
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex space-x-1">
          {[
            { id: 'sell', label: 'Sell Now', icon: TrendingUp },
            { id: 'history', label: 'History', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sell Tab */}
        {activeTab === 'sell' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Method Selection */}
            <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {rates.map(rate => (
                  <button
                    key={rate.payment_method}
                    type="button"
                    onClick={() => setSelectedMethod(rate.payment_method)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedMethod === rate.payment_method
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : isDark
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={selectedMethod === rate.payment_method ? 'text-blue-600 dark:text-blue-400' : ''}>
                      {getMethodLabel(rate.payment_method)}
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ₦{rate.rate_per_usd.toLocaleString()}/USD
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            {selectedRate && (
              <>
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={selectedRate.min_amount}
                    max={selectedRate.max_amount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-lg border text-lg font-bold ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                    placeholder={`Min: $${selectedRate.min_amount} | Max: $${selectedRate.max_amount}`}
                  />
                  
                  {amount && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">You will receive:</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₦{nairaAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Rate: ₦{selectedRate.rate_per_usd}/USD
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Address */}
                {selectedRate.payment_method !== 'paypal' ? (
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Your Wallet Address
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required
                      className={`w-full px-4 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter your wallet address"
                    />
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Your PayPal Email
                    </label>
                    <input
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      required
                      className={`w-full px-4 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                )}

                {/* Send To Address */}
                <div className={`p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`}>
                  <div className="flex items-start space-x-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className={`font-medium text-sm mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                        Send your {selectedRate.payment_method.toUpperCase()} to:
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className={`text-xs font-mono font-bold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                          {selectedRate.admin_wallet_address || selectedRate.admin_paypal_email}
                        </code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedRate.admin_wallet_address || selectedRate.admin_paypal_email || '');
                            alert('Copied!');
                          }}
                          className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Bank Account (Where we send Naira)
                  </h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Account Number"
                    />
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Account Name"
                    />
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Bank Name"
                    />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                {/* Proof of Payment */}
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Proof of Payment (Screenshots)
                  </label>
                  
                  <div className="space-y-3">
                    <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDark
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Click to upload screenshots
                      </span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Preview uploaded images */}
                    {proofImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {proofImages.map((img, index) => (
                          <div key={index} className="relative">
                            <img src={img} alt={`Proof ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                {selectedRate.instructions && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-start space-x-2">
                      <Info className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <h4 className={`font-medium text-xs mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                          Instructions
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                          {selectedRate.instructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                {selectedRate.disclaimer && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                      <div>
                        <h4 className={`font-medium text-xs mb-1 ${isDark ? 'text-red-300' : 'text-red-900'}`}>
                          Warning
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-red-200' : 'text-red-800'}`}>
                          {selectedRate.disclaimer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !amount || proofImages.length === 0}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                    submitting || !amount || proofImages.length === 0
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {submitting ? '⏳ Submitting...' : `💸 Sell ${amount || '0'} USD for ₦${nairaAmount.toLocaleString()}`}
                </button>
              </>
            )}
          </form>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className={`rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {sales.length === 0 ? (
              <div className="text-center py-8">
                <Clock className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No crypto sales yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sales.map(sale => (
                  <div key={sale.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {getMethodLabel(sale.payment_method)}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {sale.transaction_id}
                        </div>
                      </div>
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                        {getStatusIcon(sale.status)}
                        <span>{sale.status}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          ${sale.crypto_amount} @ ₦{sale.exchange_rate}/USD
                        </div>
                      </div>
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ₦{sale.naira_amount.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(sale.created_at).toLocaleString()}
                    </div>
                    
                    {sale.admin_notes && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                        <strong>Admin Note:</strong> {sale.admin_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellCrypto;

