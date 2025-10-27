import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useBranding } from '../contexts/BrandingContext';
import {
  Users,
  DollarSign,
  Settings,
  Palette,
  TrendingUp,
  CreditCard,
  Bell,
  BarChart3,
  Package,
  Shield,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Save,
  Wallet
} from 'lucide-react';

interface PanelStats {
  total_users: number;
  total_revenue: number;
  total_transactions: number;
  subscription_status: string;
  subscription_expires_at: string;
}

interface PanelSettings {
  brand_name: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  footer_text: string | null;
  sms_margin_percentage: number;
  vtu_margin_percentage: number;
  data_margin_percentage: number;
  electricity_margin_percentage: number;
}

interface PaymentGatewaySettings {
  gateway: 'paystack' | 'flutterwave' | '';
  paystack_public_key: string;
  paystack_secret_key: string;
  flutterwave_public_key: string;
  flutterwave_secret_key: string;
  flutterwave_encryption_key: string;
}

const ResellerAdmin: React.FC = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { branding } = useBranding();
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<any>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);
  const [stats, setStats] = useState<PanelStats | null>(null);
  const [settings, setSettings] = useState<PanelSettings>({
    brand_name: '',
    primary_color: '#0f172a',
    secondary_color: '#1c64f2',
    logo_url: null,
    footer_text: null,
    sms_margin_percentage: 10,
    vtu_margin_percentage: 5,
    data_margin_percentage: 5,
    electricity_margin_percentage: 5
  });
  const [saving, setSaving] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [addingDomain, setAddingDomain] = useState(false);
  const [newCustomDomain, setNewCustomDomain] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'branding' | 'pricing' | 'payment' | 'dns'>('overview');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGatewaySettings>({
    gateway: '',
    paystack_public_key: '',
    paystack_secret_key: '',
    flutterwave_public_key: '',
    flutterwave_secret_key: '',
    flutterwave_encryption_key: ''
  });
  
  // Wallet top-up states
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isGeneratingAccount, setIsGeneratingAccount] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState<any>(null);
  const [topUpStatus, setTopUpStatus] = useState<'pending' | 'completed' | 'failed' | ''>('');

  useEffect(() => {
    loadPanelData();
  }, []);

  const loadPanelData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/reseller/my-panel', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();

      if (data.status === 'success' && data.data) {
        setPanel(data.data);
        setSettings({
          brand_name: data.data.brand_name || '',
          primary_color: data.data.primary_color || '#0f172a',
          secondary_color: data.data.secondary_color || '#1c64f2',
          logo_url: data.data.logo_url,
          footer_text: data.data.footer_text,
          sms_margin_percentage: data.data.sms_margin_percentage || 10,
          vtu_margin_percentage: data.data.vtu_margin_percentage || 5,
          data_margin_percentage: data.data.data_margin_percentage || 5,
          electricity_margin_percentage: data.data.electricity_margin_percentage || 5
        });
        setPaymentGateway({
          gateway: data.data.payment_gateway || '',
          paystack_public_key: data.data.paystack_public_key || '',
          paystack_secret_key: data.data.paystack_secret_key || '',
          flutterwave_public_key: data.data.flutterwave_public_key || '',
          flutterwave_secret_key: data.data.flutterwave_secret_key || '',
          flutterwave_encryption_key: data.data.flutterwave_encryption_key || ''
        });
        setStats({
          total_users: data.data.total_users || 0,
          total_revenue: data.data.total_revenue || 0,
          total_transactions: data.data.total_transactions || 0,
          subscription_status: data.data.status,
          subscription_expires_at: data.data.subscription_expires_at
        });
      }
    } catch (error) {
      console.error('Failed to load panel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/reseller/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      const data = await response.json();

      if (data.status === 'success') {
        alert('✅ Settings saved successfully!');
        loadPanelData();
      } else {
        alert('❌ Failed to save settings: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('❌ Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const savePaymentGateway = async () => {
    try {
      setSavingPayment(true);
      const token = localStorage.getItem('auth_token');
      
      const payload: any = {
        payment_gateway: paymentGateway.gateway
      };

      if (paymentGateway.gateway === 'paystack') {
        payload.paystack_public_key = paymentGateway.paystack_public_key;
        payload.paystack_secret_key = paymentGateway.paystack_secret_key;
      } else if (paymentGateway.gateway === 'flutterwave') {
        payload.flutterwave_public_key = paymentGateway.flutterwave_public_key;
        payload.flutterwave_secret_key = paymentGateway.flutterwave_secret_key;
        payload.flutterwave_encryption_key = paymentGateway.flutterwave_encryption_key;
      }

      const response = await fetch('https://api.fadsms.com/api/reseller/payment-gateway', {
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
        alert('✅ Payment gateway configured successfully!');
        loadPanelData();
      } else {
        alert('❌ Failed to configure: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to save payment gateway:', error);
      alert('❌ Failed to save payment gateway');
    } finally {
      setSavingPayment(false);
    }
  };

  const addCustomDomain = async () => {
    if (!newCustomDomain) {
      alert('⚠️ Please enter a custom domain');
      return;
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(newCustomDomain)) {
      alert('⚠️ Invalid domain format. Example: sms.yourbrand.com');
      return;
    }

    if (!confirm(`Add custom domain "${newCustomDomain}"? You'll need to configure DNS records after this.`)) {
      return;
    }

    try {
      setAddingDomain(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/reseller/custom-domain', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ custom_domain: newCustomDomain })
      });
      const data = await response.json();

      if (data.status === 'success') {
        alert('✅ Custom domain added! Please configure DNS records as shown below.');
        setNewCustomDomain('');
        loadPanelData();
      } else {
        alert('❌ Failed to add domain: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to add custom domain:', error);
      alert('❌ Failed to add custom domain');
    } finally {
      setAddingDomain(false);
    }
  };

  const calculateCharge = (amt: number): number => {
    if (amt <= 0) return 0;
    if (amt <= 10000) return Math.round(amt * 0.015 + 100);
    if (amt <= 40000) return Math.round(amt * 0.02 + 200);
    return Math.round(amt * 0.025 + 300);
  };

  const fundPanelWallet = async () => {
    const amount = parseInt(topUpAmount || '0', 10);
    if (amount < 1000) {
      alert('⚠️ Minimum top-up amount is ₦1,000');
      return;
    }

    const charge = calculateCharge(amount);
    const finalAmount = amount + charge;

    if (!confirm(`Confirm top-up:\n\nAmount: ₦${amount.toLocaleString()}\nCharge: ₦${charge.toLocaleString()}\nTotal: ₦${finalAmount.toLocaleString()}`)) {
      return;
    }

    setIsGeneratingAccount(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Use the public topup endpoint with all required parameters
      const response = await fetch(`https://api.fadsms.com/api/wallet/topup/initiate-public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          user_id: user?.id,
          panel_id: panel.id,
          is_reseller_topup: true
        })
      });

      const data = await response.json();
      console.log('Top-up response:', data);

      if (data.success && data.data) {
        console.log('Virtual account data:', data.data);
        console.log('Account number:', data.data.account_number);
        setVirtualAccount(data.data);
        setTopUpStatus('pending');
        // Don't show alert - UI already shows the account details
        // Start polling for payment
        startTopUpPolling(data.data.reference);
      } else {
        alert('❌ ' + (data.message || 'Failed to generate account'));
        console.error('Failed response:', data);
      }
    } catch (error) {
      console.error('Failed to generate account:', error);
      alert('❌ Failed to generate account');
    } finally {
      setIsGeneratingAccount(false);
    }
  };

  const startTopUpPolling = (reference: string) => {
    let attempts = 0;
    const maxAttempts = 18;
    const intervalId = setInterval(async () => {
      attempts++;
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`https://api.fadsms.com/api/wallet/topup/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ reference })
        });

        const data = await response.json();
        console.log('Polling response:', data);

        if (data.success && data.data?.status === 'completed') {
          setTopUpStatus('completed');
          clearInterval(intervalId);
          // Don't show alert - UI shows completion message
          loadPanelData(); // Refresh panel data to update balance
          // Auto-clear after 3 seconds
          setTimeout(() => {
            setVirtualAccount(null);
            setTopUpAmount('');
            setTopUpStatus('');
          }, 3000);
        } else if (data.data?.status === 'failed') {
          setTopUpStatus('failed');
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    }, 10000); // Check every 10 seconds
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading your panel...</p>
        </div>
      </div>
    );
  }

  if (!panel) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No Reseller Panel
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            You don't have a reseller panel yet. Apply for one in Settings → Reseller Panel.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🚀 Reseller Admin Panel
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                panel.status === 'active' ? 'bg-green-100 text-green-700' :
                panel.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {panel.status.toUpperCase()}
              </span>
            </div>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {panel.brand_name} • {panel.subdomain}.fadsms.com
          </p>
        </div>

        {/* Subscription Warning */}
        {panel.subscription_expires_at && new Date(panel.subscription_expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            isDark ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 border-yellow-500'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className={`font-semibold ${isDark ? 'text-yellow-500' : 'text-yellow-700'}`}>
                  Subscription Expiring Soon
                </p>
                <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  Your subscription expires on {new Date(panel.subscription_expires_at).toLocaleDateString()}. 
                  Please renew to avoid service interruption.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
              <div className="flex items-center justify-between mb-2">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  ₦{parseFloat(panel.wallet_balance || 0).toLocaleString()}
                </p>
                <p className="text-sm text-blue-100">Panel Wallet</p>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.total_users}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₦{parseFloat(stats.total_revenue).toLocaleString()}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <Package className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.total_transactions}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Transactions</p>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {panel.subscription_type === 'annual' ? 'Annual' : 'Monthly'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Expires: {new Date(stats.subscription_expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'wallet', label: 'Fund Wallet', icon: Wallet },
            { id: 'branding', label: 'Branding', icon: Palette },
            { id: 'pricing', label: 'Pricing', icon: TrendingUp },
            { id: 'payment', label: 'Payment', icon: CreditCard },
            { id: 'dns', label: 'DNS Setup', icon: Globe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`rounded-lg shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Panel Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Panel Name
                    </label>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{panel.panel_name}</p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subdomain
                    </label>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://${panel.subdomain}.fadsms.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <span>{panel.subdomain}.fadsms.com</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(`https://${panel.subdomain}.fadsms.com`)}
                        className={`p-1 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700' : ''}`}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {panel.custom_domain && (
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Custom Domain
                      </label>
                      <a
                        href={`https://${panel.custom_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <span>{panel.custom_domain}</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Fund Panel Wallet
              </h2>

              <div className={`p-4 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className={`font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                      How Reseller Wallet Works
                    </p>
                    <ul className={`text-sm space-y-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      <li>• You get 5% discount on all services</li>
                      <li>• Add your markup (5-10%) to sell to customers</li>
                      <li>• Customers pay the marked-up price</li>
                      <li>• Your panel wallet is debited the discounted price</li>
                      <li>• You keep the margin as profit!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {!virtualAccount ? (
                <>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Top-Up Amount
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[5000, 10000, 20000, 50000, 100000, 200000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setTopUpAmount(String(amt))}
                          className={`p-3 rounded-lg border text-sm font-medium ${
                            topUpAmount === String(amt)
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                              : isDark
                              ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                              : 'border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="Enter custom amount (min ₦1,000)"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {topUpAmount && parseInt(topUpAmount) >= 1000 && (
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Amount:</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ₦{parseInt(topUpAmount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Charge:</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ₦{calculateCharge(parseInt(topUpAmount)).toLocaleString()}
                          </span>
                        </div>
                        <div className={`flex justify-between pt-2 border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total to Transfer:</span>
                          <span className={`font-bold text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            ₦{(parseInt(topUpAmount) + calculateCharge(parseInt(topUpAmount))).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={fundPanelWallet}
                    disabled={isGeneratingAccount || !topUpAmount || parseInt(topUpAmount) < 1000}
                    className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 ${
                      (isGeneratingAccount || !topUpAmount || parseInt(topUpAmount) < 1000) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <DollarSign className="h-5 w-5" />
                    <span>{isGeneratingAccount ? 'Generating Account...' : 'Generate Virtual Account'}</span>
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-800'}`}>
                        Virtual Account Generated
                      </p>
                    </div>
                    <div className={`text-sm space-y-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">₦{parseInt(topUpAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charge:</span>
                        <span className="font-semibold">₦{calculateCharge(parseInt(topUpAmount)).toLocaleString()}</span>
                      </div>
                      <div className={`flex justify-between pt-2 mt-2 border-t ${isDark ? 'border-green-700' : 'border-green-300'}`}>
                        <span className="font-bold">Transfer Exactly:</span>
                        <span className="font-bold text-lg">₦{(parseInt(topUpAmount) + calculateCharge(parseInt(topUpAmount))).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bank Name</p>
                        <button onClick={() => copyToClipboard(virtualAccount.bank_name)} className="text-blue-600 hover:underline text-sm">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{virtualAccount.bank_name}</p>
                    </div>

                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Account Number</p>
                        {virtualAccount.account_number && (
                          <button onClick={() => copyToClipboard(virtualAccount.account_number)} className="text-blue-600 hover:underline text-sm">
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {virtualAccount.account_number || 'Loading...'}
                      </p>
                      {!virtualAccount.account_number && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          If account number doesn't appear, check console for errors
                        </p>
                      )}
                    </div>

                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Account Name</p>
                        <button onClick={() => copyToClipboard(virtualAccount.account_name)} className="text-blue-600 hover:underline text-sm">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{virtualAccount.account_name}</p>
                    </div>
                  </div>

                  {topUpStatus === 'completed' && (
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-800'}`}>
                          Payment Confirmed! Your panel wallet has been funded.
                        </p>
                      </div>
                    </div>
                  )}

                  {topUpStatus === 'pending' && (
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-600 animate-spin" />
                        <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                          Waiting for payment... This will update automatically when payment is received.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setVirtualAccount(null);
                      setTopUpAmount('');
                      setTopUpStatus('');
                    }}
                    className={`w-full py-3 border rounded-lg font-medium ${
                      isDark ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Start New Top-Up
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Customize Your Branding
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.brand_name}
                    onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={settings.logo_url || ''}
                    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Primary Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Secondary Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={settings.footer_text || ''}
                    onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                    placeholder="© 2025 Your Brand. All rights reserved."
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving...' : 'Save Branding'}</span>
              </button>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Pricing Margins
              </h2>
              <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Set your profit margins for each service. These percentages will be added to the base price.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    SMS Margin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={settings.sms_margin_percentage}
                    onChange={(e) => setSettings({ ...settings, sms_margin_percentage: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    VTU/Airtime Margin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={settings.vtu_margin_percentage}
                    onChange={(e) => setSettings({ ...settings, vtu_margin_percentage: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Data Margin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={settings.data_margin_percentage}
                    onChange={(e) => setSettings({ ...settings, data_margin_percentage: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Electricity Margin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={settings.electricity_margin_percentage}
                    onChange={(e) => setSettings({ ...settings, electricity_margin_percentage: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving...' : 'Save Pricing'}</span>
              </button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payment Gateway Configuration
              </h2>
              
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className={`font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                      Direct Payment Integration
                    </p>
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      Configure your own payment gateway to receive payments directly from your customers.
                      You keep 100% of your revenue!
                    </p>
                  </div>
                </div>
              </div>

              {/* Gateway Selection */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentGateway({ ...paymentGateway, gateway: 'paystack' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentGateway.gateway === 'paystack'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💳</div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Paystack</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Popular in Nigeria</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentGateway({ ...paymentGateway, gateway: 'flutterwave' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentGateway.gateway === 'flutterwave'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🦋</div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Flutterwave</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Multi-currency</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Paystack Configuration */}
              {paymentGateway.gateway === 'paystack' && (
                <div className="space-y-4">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Paystack API Keys
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get your API keys from: <a href="https://dashboard.paystack.com/#/settings/developer" target="_blank" className="text-blue-600 hover:underline">Paystack Dashboard → Settings → API Keys</a>
                  </p>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Public Key *
                    </label>
                    <input
                      type="text"
                      value={paymentGateway.paystack_public_key}
                      onChange={(e) => setPaymentGateway({ ...paymentGateway, paystack_public_key: e.target.value })}
                      placeholder="pk_live_..."
                      className={`w-full px-4 py-2 rounded-lg border font-mono text-sm ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Secret Key *
                    </label>
                    <input
                      type="password"
                      value={paymentGateway.paystack_secret_key}
                      onChange={(e) => setPaymentGateway({ ...paymentGateway, paystack_secret_key: e.target.value })}
                      placeholder="sk_live_..."
                      className={`w-full px-4 py-2 rounded-lg border font-mono text-sm ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Flutterwave Configuration */}
              {paymentGateway.gateway === 'flutterwave' && (
                <div className="space-y-4">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Flutterwave API Keys
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get your API keys from: <a href="https://dashboard.flutterwave.com/settings/apis" target="_blank" className="text-blue-600 hover:underline">Flutterwave Dashboard → Settings → API Keys</a>
                  </p>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Public Key *
                    </label>
                    <input
                      type="text"
                      value={paymentGateway.flutterwave_public_key}
                      onChange={(e) => setPaymentGateway({ ...paymentGateway, flutterwave_public_key: e.target.value })}
                      placeholder="FLWPUBK-..."
                      className={`w-full px-4 py-2 rounded-lg border font-mono text-sm ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Secret Key *
                    </label>
                    <input
                      type="password"
                      value={paymentGateway.flutterwave_secret_key}
                      onChange={(e) => setPaymentGateway({ ...paymentGateway, flutterwave_secret_key: e.target.value })}
                      placeholder="FLWSECK-..."
                      className={`w-full px-4 py-2 rounded-lg border font-mono text-sm ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Encryption Key *
                    </label>
                    <input
                      type="password"
                      value={paymentGateway.flutterwave_encryption_key}
                      onChange={(e) => setPaymentGateway({ ...paymentGateway, flutterwave_encryption_key: e.target.value })}
                      placeholder="FLWSECK_TEST..."
                      className={`w-full px-4 py-2 rounded-lg border font-mono text-sm ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {paymentGateway.gateway && (
                <>
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 border-yellow-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                      <strong>⚠️ Security Note:</strong> Your API keys are encrypted and stored securely. Never share them with anyone.
                    </p>
                  </div>

                  <button
                    onClick={savePaymentGateway}
                    disabled={savingPayment}
                    className={`w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 ${
                      savingPayment ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Save className="h-5 w-5" />
                    <span>{savingPayment ? 'Configuring...' : 'Save Payment Gateway'}</span>
                  </button>
                </>
              )}

              {!paymentGateway.gateway && (
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    👆 Select a payment gateway above to get started
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dns' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Domain & DNS Setup
              </h2>
              
              <div>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Your Subdomain
                </h3>
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Active & Ready:</p>
                      <a
                        href={`https://${panel.subdomain}.fadsms.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold flex items-center space-x-1"
                      >
                        <span>{panel.subdomain}.fadsms.com</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`https://${panel.subdomain}.fadsms.com`)}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {panel.custom_domain && (
                <div>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Custom Domain Setup
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    To use your custom domain ({panel.custom_domain}), add these DNS records at your domain provider:
                  </p>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`font-semibold mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>A Record #1</p>
                      <div className="space-y-1 text-sm font-mono">
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Type: A</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Host: @</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Value: 75.119.155.252</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>TTL: Automatic</p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`font-semibold mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>A Record #2 (Optional)</p>
                      <div className="space-y-1 text-sm font-mono">
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Type: A</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Host: www</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Value: 75.119.155.252</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>TTL: Automatic</p>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 border-yellow-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                      <strong>Note:</strong> DNS changes can take up to 48 hours to propagate. After DNS is configured, 
                      SSL certificate will be obtained automatically. Contact support if you need assistance.
                    </p>
                  </div>
                </div>
              )}

              {!panel.custom_domain && (
                <div>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Add Custom Domain
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Use your own domain name for complete white-label experience (e.g., sms.yourbrand.com)
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCustomDomain}
                      onChange={(e) => setNewCustomDomain(e.target.value.toLowerCase())}
                      placeholder="sms.yourbrand.com"
                      className={`flex-1 px-4 py-3 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={addCustomDomain}
                      disabled={addingDomain || !newCustomDomain}
                      className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium ${
                        addingDomain || !newCustomDomain ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {addingDomain ? 'Adding...' : 'Add Domain'}
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    After adding, DNS instructions will appear below
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResellerAdmin;

