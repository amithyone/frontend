import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
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
  DollarSign,
  XCircle
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
  const { user, updateWalletBalance } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'topup' | 'history'>('overview');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [generatedAccount, setGeneratedAccount] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  // Get wallet balance from auth context
  const balance = user?.wallet || 0;
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [totalTopUps, setTotalTopUps] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const topUpMethods: TopUpMethod[] = [
    {
      id: 'payvibe',
      name: 'PayVibe Bank Transfer',
      icon: CreditCard,
      description: 'Instant virtual account generation',
      processingTime: 'Instant verification'
    }
  ];

  const generateAccountNumber = async () => {
    if (!selectedAmount || parseInt(selectedAmount) < 100) {
      alert('Please enter a valid amount (minimum ₦100)');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Calling PayVibe API with amount:', selectedAmount);
      const response = await apiService.initiateTopUp({ amount: parseInt(selectedAmount), user_id: 1 });
      
      console.log('Full PayVibe response:', response);
      
      if (response.status === 'success' && response.data) {
        console.log('Setting account details:', {
          account_number: response.data.account_number,
          account_name: response.data.account_name,
          bank_name: response.data.bank_name,
          reference: response.data.reference
        });
        
        setGeneratedAccount(response.data.account_number);
        setAccountName(response.data.account_name);
        setBankName(response.data.bank_name);
        setPaymentReference(response.data.reference);
        setPaymentStatus('pending');
      } else {
        console.error('PayVibe API error:', response);
        alert(response.message || 'Failed to generate account number');
      }
    } catch (error) {
      console.error('Error generating account:', error);
      alert('Failed to generate account number. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentReference) return;

    setIsCheckingStatus(true);
    try {
      const response = await apiService.checkPaymentStatus({ reference: paymentReference });
      
      if (response.status === 'success' && response.data) {
        setPaymentStatus(response.data.status || 'pending');
        if (response.data.status === 'completed') {
          alert('Payment completed! Your wallet has been credited.');
          // Refresh user data
          fetchUserData();
        }
      } else {
        alert(response.message || 'Failed to check payment status');
      }
    } catch (error) {
      console.error('Error checking status:', error);
      alert('Failed to check payment status. Please try again.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Calculate PayVibe charges
  const calculateCharges = (amount: number) => {
    let charge = 0;
    if (amount <= 10000) {
      charge = (amount * 0.015) + 100; // 1.5% + ₦100
    } else if (amount <= 40000) {
      charge = (amount * 0.02) + 200; // 2.0% + ₦200
    } else {
      charge = (amount * 0.025) + 300; // 2.5% + ₦300
    }
    return charge;
  };

  const selectedAmountNum = parseInt(selectedAmount) || 0;
  const charge = calculateCharges(selectedAmountNum);
  const finalAmount = selectedAmountNum + charge;

  // Fetch user data and balance
  const fetchUserData = async () => {
    try {
      const response = await apiService.getUserProfile();
      if (response.status === 'success' && response.data) {
        const userData = response.data;
        // Update wallet balance in auth context
        updateWalletBalance(userData.wallet || 0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch user transactions
  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await apiService.getUserTransactions();
      if (response.status === 'success' && response.data) {
        const transactionData = response.data;
        
        // Transform API data to match our interface
        const transformedTransactions: Transaction[] = transactionData.map((tx: any) => ({
          id: tx.id.toString(),
          type: tx.type as 'credit' | 'debit',
          amount: parseFloat(tx.amount),
          description: tx.description,
          status: tx.status as 'completed' | 'pending' | 'failed',
          date: new Date(tx.created_at).toLocaleString(),
          reference: tx.reference
        }));

        setTransactions(transformedTransactions);

        // Calculate statistics
        const credits = transformedTransactions.filter(tx => tx.type === 'credit' && tx.status === 'completed');
        const debits = transformedTransactions.filter(tx => tx.type === 'debit' && tx.status === 'completed');
        
        const totalCredits = credits.reduce((sum, tx) => sum + tx.amount, 0);
        const totalDebits = debits.reduce((sum, tx) => sum + tx.amount, 0);
        
        setTotalTopUps(totalCredits);
        setTotalSpent(totalDebits);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUserData(), fetchTransactions()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
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
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-lg">Loading...</span>
              </div>
            ) : (
              <h2 className="text-3xl font-bold">₦{balance.toLocaleString()}</h2>
            )}
          </div>
          <div className={`p-3 rounded-xl ${
            isDark ? 'bg-gray-700' : 'bg-white bg-opacity-20'
          }`}>
            <WalletIcon className="h-8 w-8" />
          </div>
        </div>
        
        <button 
          onClick={() => setShowTopUpModal(true)}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>₦{totalTopUps.toLocaleString()}</p>
              )}
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
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>₦{totalSpent.toLocaleString()}</p>
              )}
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
          
          {isLoadingTransactions ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className={`text-center py-8 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          ) : (
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
          )}
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
                  <span className="font-bold text-green-600">₦{selectedAmountNum.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Charge:</span>
                  <span className="font-bold text-orange-600">₦{charge.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between border-t pt-2">
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Total to Transfer:</span>
                  <span className="font-bold text-blue-600">₦{finalAmount.toLocaleString()}</span>
                </div>
                
                                 <div className="flex items-center justify-between">
                   <span className={`text-sm ${
                     isDark ? 'text-gray-300' : 'text-gray-600'
                   }`}>Bank:</span>
                   <span className="font-semibold">{bankName}</span>
                 </div>

                 <div className="flex items-center justify-between">
                   <span className={`text-sm ${
                     isDark ? 'text-gray-300' : 'text-gray-600'
                   }`}>Reference:</span>
                   <div className="flex items-center space-x-2">
                     <span className="font-mono font-bold">{paymentReference}</span>
                     <button
                       onClick={() => copyToClipboard(paymentReference)}
                       className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                     >
                       <Copy className="h-4 w-4" />
                     </button>
                   </div>
                 </div>

                {paymentStatus && (
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      paymentStatus === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : paymentStatus === 'pending'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {paymentStatus}
                    </span>
                  </div>
                )}
              </div>
              
              <div className={`mt-4 p-3 rounded-lg ${
                isDark ? 'bg-blue-900 bg-opacity-50' : 'bg-blue-50'
              }`}>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  💡 Transfer exactly ₦{finalAmount.toLocaleString()} to this account. Your wallet will be credited with ₦{selectedAmountNum.toLocaleString()} automatically after payment verification.
                </p>
              </div>

              {/* Check Status Button */}
              {paymentReference && paymentStatus === 'pending' && (
                <button
                  onClick={checkPaymentStatus}
                  disabled={isCheckingStatus}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isCheckingStatus ? (
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
              disabled={isLoadingTransactions}
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
          
          {isLoadingTransactions ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className={`text-center py-8 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">
                {filterType === 'all' 
                  ? 'Your transaction history will appear here'
                  : `No ${filterType} transactions found`
                }
              </p>
            </div>
          ) : (
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
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      {transaction.status === 'completed' && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {transaction.status === 'pending' && (
                        <Clock className="h-3 w-3 text-yellow-500" />
                      )}
                      {transaction.status === 'failed' && (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' :
                        transaction.status === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;