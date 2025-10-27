import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Users, 
  Copy, 
  TrendingUp, 
  DollarSign, 
  Award,
  CheckCircle,
  Share2,
  BarChart3,
  ExternalLink,
  AlertCircle,
  Gift,
  Target,
  Crown
} from 'lucide-react';

interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  total_commission_earned: number;
  pending_commission: number;
  paid_commission: number;
  total_volume: number;
  tier: string;
  tier_rate: number;
}

interface ReferralData {
  id: number;
  name: string;
  username: string;
  created_at: string;
}

interface Commission {
  id: number;
  amount: number;
  transaction_amount: number;
  commission_rate: number;
  type: string;
  status: string;
  description: string;
  created_at: string;
}

interface TierInfo {
  name: string;
  referrals_required: number;
  commission_rate: number;
  benefits: string[];
}

const Referral: React.FC = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [tiers, setTiers] = useState<TierInfo[]>([]);
  const [referralLink, setReferralLink] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'commissions' | 'tiers'>('overview');

  useEffect(() => {
    loadReferralData();
    loadTiers();
  }, []);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // Load stats
      const statsResponse = await fetch('https://api.fadsms.com/api/referrals/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const statsData = await statsResponse.json();
      
      if (statsData.status === 'success') {
        setStats(statsData.data.stats);
        setReferrals(statsData.data.referrals);
        setReferralLink(statsData.data.referral_link);
      }

      // Load referral link
      const linkResponse = await fetch('https://api.fadsms.com/api/referrals/link', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const linkData = await linkResponse.json();
      
      if (linkData.status === 'success') {
        setReferralLink(linkData.data.referral_link);
        setReferralCode(linkData.data.referral_code);
      }

      // Load commissions
      const commissionsResponse = await fetch('https://api.fadsms.com/api/referrals/commissions?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const commissionsData = await commissionsResponse.json();
      
      if (commissionsData.status === 'success') {
        setCommissions(commissionsData.data.data || []);
      }

    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTiers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/referrals/tiers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setTiers(data.data);
      }
    } catch (error) {
      console.error('Failed to load tier info:', error);
    }
  };

  const generateReferralCode = async () => {
    try {
      setGeneratingCode(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/referrals/generate-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setReferralCode(data.data.referral_code);
        setReferralLink(`https://fadsms.com/register?ref=${data.data.referral_code}`);
        alert('✅ ' + data.message);
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Failed to generate referral code:', error);
      alert('❌ Failed to generate referral code');
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return 'from-purple-500 to-pink-500';
      case 'gold': return 'from-yellow-400 to-orange-500';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-red-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return <Crown className="h-6 w-6" />;
      case 'gold': return <Award className="h-6 w-6" />;
      case 'silver': return <Target className="h-6 w-6" />;
      default: return <Gift className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-3 py-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-3"></div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-3 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💰 Referral Program
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Earn 5% on first deposits and {stats ? (stats.tier_rate * 100).toFixed(1) : '1'}% on recurring deposits
          </p>
        </div>

        {/* Tier Badge */}
        {stats && (
          <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${getTierColor(stats.tier)} text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="scale-75">{getTierIcon(stats.tier)}</div>
                <div>
                  <h3 className="text-sm font-bold capitalize">{stats.tier} Tier</h3>
                  <p className="text-xs opacity-90">{(stats.tier_rate * 100).toFixed(1)}% Commission</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{stats.total_referrals}</p>
                <p className="text-xs opacity-90">Referrals</p>
              </div>
            </div>
          </div>
        )}

        {/* Referral Link Card */}
        <div className={`mb-4 p-4 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <div className="flex items-center mb-3">
            <Share2 className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Referral Link
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className={`flex-1 px-3 py-2 rounded-lg border text-xs ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={() => copyToClipboard(referralLink, 'link')}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
              >
                <Copy className="h-3 w-3" />
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>

            <div className="flex gap-2">
              {referralCode ? (
                <>
                  <div className={`flex-1 px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Code: </span>
                    <span className={`font-mono font-bold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{referralCode}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralCode, 'code')}
                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                      isDark 
                        ? 'border-gray-600 hover:bg-gray-700 text-white' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <button
                  onClick={generateReferralCode}
                  disabled={generatingCode}
                  className={`flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-2 ${
                    generatingCode ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Gift className="h-4 w-4" />
                  <span>{generatingCode ? 'Generating...' : 'Generate Referral Code'}</span>
                </button>
              )}
            </div>
          </div>

          {copySuccess && (
            <div className="mt-2 flex items-center space-x-1 text-green-500">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs">Copied!</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-4 flex space-x-1 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'referrals', label: 'Referrals', icon: Users },
            { id: 'commissions', label: 'Earnings', icon: DollarSign },
            { id: 'tiers', label: 'Tiers', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <p className={`text-xl font-bold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.active_referrals}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Referrals
              </p>
            </div>

            <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <p className={`text-xl font-bold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₦{stats.total_commission_earned.toLocaleString()}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Earned
              </p>
            </div>

            <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <p className={`text-xl font-bold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₦{stats.pending_commission.toLocaleString()}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Pending
              </p>
            </div>

            <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <CheckCircle className="h-5 w-5 text-purple-500" />
              </div>
              <p className={`text-xl font-bold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₦{stats.paid_commission.toLocaleString()}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Paid Out
              </p>
            </div>
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
            {referrals.length === 0 ? (
              <div className="text-center py-8">
                <Users className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No referrals yet
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Share your link to start earning
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {referrals.map((referral) => (
                  <div key={referral.id} className="p-3">
                    <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {referral.name}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        @{referral.username}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(referral.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
            {commissions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No commissions yet
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Earn when referrals deposit
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {commissions.map((commission) => (
                  <div key={commission.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        commission.type === 'first_deposit' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {commission.type === 'first_deposit' ? '5% First' : 'Recurring'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        commission.status === 'paid' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : commission.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {commission.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ₦{commission.amount.toLocaleString()}
                      </div>
                      <div className="text-right">
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {(commission.commission_rate * 100).toFixed(1)}% rate
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(commission.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 gap-3">
            {tiers.map((tier, index) => {
              const isCurrentTier = stats && tier.name.toLowerCase() === stats.tier.toLowerCase();
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-lg border-2 ${
                    isCurrentTier
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
                      : isDark
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="scale-75">{getTierIcon(tier.name)}</div>
                      <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {tier.name}
                      </h3>
                    </div>
                    {isCurrentTier && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500 text-white">
                        CURRENT
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {(tier.commission_rate * 100).toFixed(1)}%
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Commission Rate
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {tier.referrals_required === 0 
                          ? 'No requirements' 
                          : `${tier.referrals_required}+ referrals`}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Benefits:
                    </p>
                    <ul className="space-y-0.5">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className={`text-xs flex items-start ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className={`mt-4 p-3 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-start space-x-2">
            <AlertCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h4 className={`font-medium text-xs mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                How it works
              </h4>
              <ul className={`text-xs space-y-0.5 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                <li>• Earn <strong>5%</strong> on first deposit</li>
                <li>• Earn <strong>{stats ? (stats.tier_rate * 100).toFixed(1) : '1'}%</strong> on recurring deposits</li>
                <li>• Auto-credited to balance</li>
                <li>• Higher tiers = better rates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;

