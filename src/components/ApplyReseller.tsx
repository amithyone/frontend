import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Rocket,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Globe,
  Palette,
  CreditCard,
  Users,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

interface ResellerPanel {
  id: number;
  panel_name: string;
  subdomain: string;
  custom_domain: string | null;
  status: string;
  subscription_type: string;
  subscription_fee: number;
  subscription_expires_at: string | null;
  brand_name: string;
}

const ApplyReseller: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [existingPanel, setExistingPanel] = useState<ResellerPanel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [panelName, setPanelName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'annual'>('monthly');
  const [brandName, setBrandName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  const subscriptionFee = subscriptionType === 'annual' ? 300000 : 30000;

  useEffect(() => {
    loadExistingPanel();
  }, []);

  const loadExistingPanel = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/reseller/my-panel', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        setExistingPanel(data.data);
      }
    } catch (error) {
      console.error('Failed to load panel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user && user.balance < subscriptionFee) {
      alert(`❌ Insufficient balance. You need ₦${subscriptionFee.toLocaleString()} but have ₦${user.balance.toLocaleString()}`);
      return;
    }

    if (!confirm(`Confirm: ₦${subscriptionFee.toLocaleString()} will be deducted from your wallet balance for ${subscriptionType} subscription.`)) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const payload = {
        panel_name: panelName,
        subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        custom_domain: customDomain || null,
        subscription_type: subscriptionType,
        brand_name: brandName,
        business_description: businessDescription
      };

      const response = await fetch('https://api.fadsms.com/api/reseller/apply', {
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
        loadExistingPanel();
      } else {
        // Show detailed validation errors if available
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, messages]: [string, any]) => {
              const fieldName = field.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
              return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
            })
            .join('\n');
          alert('❌ Validation Error:\n\n' + errorMessages);
        } else {
          alert('❌ ' + (data.message || 'Failed to submit application'));
        }
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('❌ Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-4 pb-24 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  // If user already has a panel
  if (existingPanel) {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <div className={`p-4 pb-24 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-4">
          <button onClick={() => window.history.back()} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ← Back
          </button>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Reseller Panel</h2>
        </div>

        <div className={`rounded-lg p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {existingPanel.panel_name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(existingPanel.status)}`}>
              {existingPanel.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Brand Name:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{existingPanel.brand_name}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subdomain:</span>
              <a href={`https://${existingPanel.subdomain}.fadsms.com`} target="_blank" 
                className="font-medium text-blue-600 hover:underline">
                {existingPanel.subdomain}.fadsms.com
              </a>
            </div>
            {existingPanel.custom_domain && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Custom Domain:</span>
                <a href={`https://${existingPanel.custom_domain}`} target="_blank" 
                  className="font-medium text-blue-600 hover:underline">
                  {existingPanel.custom_domain}
                </a>
              </div>
            )}
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subscription:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₦{existingPanel.subscription_fee.toLocaleString()}/{existingPanel.subscription_type}
              </span>
            </div>
            {existingPanel.subscription_expires_at && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Expires:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(existingPanel.subscription_expires_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {existingPanel.status === 'pending' && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                ⏳ Your application is pending review. We'll activate your panel within 24 hours.
              </p>
            </div>
          )}

          {existingPanel.status === 'active' && (
            <div className="mt-4 space-y-2">
              <a href="/reseller-admin"
                className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                🛠️ Manage Panel Settings
              </a>
              <a href={`https://${existingPanel.subdomain}.fadsms.com`} target="_blank"
                className="block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                🌐 View Customer Site
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Application form
  return (
    <div className={`p-4 pb-24 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center mb-4">
        <button onClick={() => window.history.back()} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          ← Back
        </button>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Apply for Reseller Panel</h2>
      </div>

      {/* Benefits */}
      <div className={`rounded-lg p-6 border bg-gradient-to-r from-blue-500 to-purple-600 text-white`}>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Rocket className="h-6 w-6 mr-2" />
          Start Your Own SMS/VTU Business
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Your own branded platform</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Custom domain support</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="font-bold">5% discount on all services!</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Set your own markup</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Use Paystack/Flutterwave</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Manage your customers</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Auto SSL & subdomain</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Keep 100% of profits</span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSubscriptionType('monthly')}
          className={`p-4 rounded-lg border-2 transition-all ${
            subscriptionType === 'monthly'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
          }`}
        >
          <div className={`text-2xl font-bold mb-1 ${subscriptionType === 'monthly' ? 'text-blue-600' : isDark ? 'text-white' : 'text-gray-900'}`}>
            ₦30,000
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Per Month</div>
        </button>

        <button
          onClick={() => setSubscriptionType('annual')}
          className={`p-4 rounded-lg border-2 transition-all relative ${
            subscriptionType === 'annual'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
          }`}
        >
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            Save ₦60k
          </div>
          <div className={`text-2xl font-bold mb-1 ${subscriptionType === 'annual' ? 'text-green-600' : isDark ? 'text-white' : 'text-gray-900'}`}>
            ₦300,000
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Per Year</div>
        </button>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Panel Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Business/Panel Name *
              </label>
              <input
                type="text"
                value={panelName}
                onChange={(e) => setPanelName(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., QuickSMS Pro"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Brand Name (Displayed to users) *
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., QuickSMS"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Subdomain * (lowercase, letters/numbers/hyphens only)
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                  required
                  pattern="[a-z0-9-]+"
                  className={`flex-1 px-4 py-2 rounded-l-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  placeholder="mybrand"
                />
                <div className={`px-4 py-2 rounded-r-lg border-t border-r border-b ${
                  isDark ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-200 border-gray-300 text-gray-600'
                }`}>
                  .fadsms.com
                </div>
              </div>
              {subdomain && (
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your panel will be: <strong>{subdomain}.fadsms.com</strong>
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Custom Domain (Optional - Your own domain)
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., sms.mybrand.com (optional)"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Use your own domain for complete white-label (setup help provided)
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Business Description
              </label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
                placeholder="Tell us about your business (optional)"
              />
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
          <h4 className={`font-medium text-sm mb-3 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
            What's Included:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center space-x-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <Globe className="h-3 w-3" />
              <span>Your branded platform</span>
            </div>
            <div className={`flex items-center space-x-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <Palette className="h-3 w-3" />
              <span>Logo & color customization</span>
            </div>
            <div className={`flex items-center space-x-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <DollarSign className="h-3 w-3" />
              <span>Set your own profit margins</span>
            </div>
            <div className={`flex items-center space-x-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <CreditCard className="h-3 w-3" />
              <span>Paystack/PayVibe integration</span>
            </div>
            <div className={`flex items-center space-x-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <Users className="h-3 w-3" />
              <span>Manage your customers</span>
            </div>
            <div className={`flex items-center space-x-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <Zap className="h-3 w-3" />
              <span>All SMS & VTU services</span>
            </div>
          </div>
        </div>

        {/* Balance Check */}
        <div className={`p-4 rounded-lg border ${
          user && user.balance >= subscriptionFee
            ? isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
            : isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start space-x-2">
            {user && user.balance >= subscriptionFee ? (
              <CheckCircle className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            ) : (
              <AlertCircle className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            )}
            <div>
              <p className={`text-sm font-medium ${
                user && user.balance >= subscriptionFee
                  ? isDark ? 'text-green-300' : 'text-green-900'
                  : isDark ? 'text-red-300' : 'text-red-900'
              }`}>
                {user && user.balance >= subscriptionFee
                  ? `✅ Sufficient balance: ₦${user.balance.toLocaleString()}`
                  : `❌ Insufficient balance: ₦${user?.balance.toLocaleString() || '0'} (Need ₦${subscriptionFee.toLocaleString()})`
                }
              </p>
              <p className={`text-xs mt-1 ${
                user && user.balance >= subscriptionFee
                  ? isDark ? 'text-green-200' : 'text-green-800'
                  : isDark ? 'text-red-200' : 'text-red-800'
              }`}>
                {user && user.balance >= subscriptionFee
                  ? `₦${subscriptionFee.toLocaleString()} will be deducted from your wallet upon submission`
                  : 'Please fund your wallet to continue'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !user || user.balance < subscriptionFee}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            submitting || !user || user.balance < subscriptionFee
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
          }`}
        >
          {submitting ? '⏳ Submitting Application...' : `🚀 Apply Now - Pay ₦${subscriptionFee.toLocaleString()}`}
        </button>

        <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          By applying, you agree to our terms and conditions for reseller partners
        </p>
      </form>
    </div>
  );
};

export default ApplyReseller;

