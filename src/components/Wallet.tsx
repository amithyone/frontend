import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Wallet as WalletIcon, 
  Plus, 
  History, 
  TrendingUp, 
  TrendingDown,
  Copy,
  CheckCircle,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference?: string;
}

interface TopUpMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  processingTime: string;
}

const Wallet: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'topup' | 'history'>('overview');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [generatedAccount, setGeneratedAccount] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  const balance = 1234.56;
  const totalSpent = 15420.00;
  const totalTopUps = 16654.56;

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const topUpMethods: TopUpMethod[] = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: CreditCard,
      description: 'Transfer to generated account number',
      processingTime: 'Instant verification'
    }
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'credit',
      amount: 5000,
      description: 'Wallet Top-up via Bank Transfer',
      status: 'completed',
      date: '2024-01-15 14:30',
      reference: 'TXN123456789'
    },
    {
      id: '2',
      type: 'debit',
      amount: 150,
      description: 'WhatsApp Virtual Number - Nigeria',
      status: 'completed',
      date: '2024-01-15 13:45'
    },
    {
      id: '3',
      type: 'debit',
      amount: 1000,
      description: 'MTN Airtime Purchase',
      status: 'completed',
      date: '2024-01-15 12:20'
    },
    {
      id: '4',
      type: 'credit',
      amount: 10000,
      description: 'Wallet Top-up via Bank Transfer',
      status: 'pending',
      date: '2024-01-15 11:15',
      reference: 'TXN987654321'
    },
    {
      id: '5',
      type: 'debit',
      amount: 2500,
      description: 'DStv Compact Subscription',
      status: 'completed',
      date: '2024-01-14 16:30'
    }
  ];

  const generateAccountNumber = async () => {
    if (!selectedAmount) {
      alert('Please select an amount first');
      return;
    }

    setIsGenerating(true);
    // Simulate API call to generate account number
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random account number
    const accountNumber = '22' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    setGeneratedAccount(accountNumber);
    setAccountName('FaddedSMS - ' + Math.random().toString(36).substr(2, 6).toUpperCase());
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'failed':
        return <CheckCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`;
      case 'pending':
        return `${baseClasses} bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={`p-4 space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>My Wallet</h1>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>Manage your funds and transactions</p>
      </div>

      {/* Balance Card */}
      <div className={`rounded-2xl p-6 text-white shadow-xl transition-all duration-200 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-oxford-blue to-oxford-blue-dark'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-blue-200'
            }`}>Available Balance</p>
            <h2 className="text-3xl font-bold">₦{balance.toLocaleString()}</h2>
          </div>
          <div className={`p-3 rounded-xl ${
            isDark ? 'bg-gray-700' : 'bg-white bg-opacity-20'
          }`}>
            <WalletIcon className="h-8 w-8" />
          </div>
        </div>
        
        <button 
          onClick={() => setShowTopUpModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Top Up Wallet</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <div>
              <p className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>₦{totalTopUps.toLocaleString()}</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Top-ups</p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-6 w-6 text-red-500" />
            <div>
              <p className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>₦{totalSpent.toLocaleString()}</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`rounded-xl p-1 shadow-sm border transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'overview', name: 'Overview', icon: WalletIcon },
            { id: 'topup', name: 'Top Up', icon: Plus },
            { id: 'history', name: 'History', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Recent Transactions</h3>
          
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{transaction.description}</p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{transaction.date}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topup' && (
        <div className="space-y-6">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Top Up Your Wallet</h3>
          
          {/* Amount Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Select Amount</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount.toString())}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedAmount === amount.toString()
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 text-orange-600'
                      : isDark 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  ₦{amount.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Top-up Method */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Payment Method</label>
            {topUpMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.id} className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="h-6 w-6 text-orange-500" />
                    <div>
                      <h4 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{method.name}</h4>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>{method.description}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={generateAccountNumber}
                    disabled={isGenerating || !selectedAmount}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
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
                </div>
              );
            })}
          </div>

          {/* Generated Account Details */}
          {generatedAccount && (
            <div className={`p-6 rounded-xl border-2 border-dashed ${
              isDark 
                ? 'border-green-600 bg-green-900 bg-opacity-20' 
                : 'border-green-500 bg-green-50'
            }`}>
              <h4 className={`font-semibold mb-4 text-green-600 dark:text-green-400`}>
                Payment Details Generated
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Account Number:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold">{generatedAccount}</span>
                    <button
                      onClick={() => copyToClipboard(generatedAccount)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Account Name:</span>
                  <span className="font-semibold">{accountName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Amount:</span>
                  <span className="font-bold text-green-600">₦{parseInt(selectedAmount).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Bank:</span>
                  <span className="font-semibold">Wema Bank</span>
                </div>
              </div>
              
              <div className={`mt-4 p-3 rounded-lg ${
                isDark ? 'bg-blue-900 bg-opacity-50' : 'bg-blue-50'
              }`}>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  💡 Transfer the exact amount to this account. Your wallet will be credited automatically after payment verification.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Transaction History</h3>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>
          </div>
          
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{transaction.description}</p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{transaction.date}</p>
                    {transaction.reference && (
                      <p className={`text-xs font-mono ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>Ref: {transaction.reference}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Top Up Wallet</h2>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-6">
              <p className={`text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Use the Top Up tab to generate account details for wallet funding.
              </p>
              <button
                onClick={() => {
                  setShowTopUpModal(false);
                  setActiveTab('topup');
                }}
                className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Go to Top Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;