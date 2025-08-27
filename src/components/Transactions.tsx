import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  category: 'virtual_number' | 'airtime' | 'data' | 'cable_tv' | 'betting' | 'electricity' | 'recharge_card' | 'wallet_topup';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  reference?: string;
  service?: string;
  recipient?: string;
}

const Transactions: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'credit',
      category: 'wallet_topup',
      amount: 10000,
      description: 'Wallet Top-up via Bank Transfer',
      status: 'completed',
      date: '2024-01-15',
      time: '14:30',
      reference: 'REF123456789',
      service: 'Bank Transfer'
    },
    {
      id: 'TXN002',
      type: 'debit',
      category: 'virtual_number',
      amount: 150,
      description: 'WhatsApp Virtual Number',
      status: 'completed',
      date: '2024-01-15',
      time: '13:45',
      service: 'WhatsApp',
      recipient: '+234901234567'
    },
    {
      id: 'TXN003',
      type: 'debit',
      category: 'airtime',
      amount: 1000,
      description: 'MTN Airtime Purchase',
      status: 'completed',
      date: '2024-01-15',
      time: '12:20',
      service: 'MTN',
      recipient: '08012345678'
    },
    {
      id: 'TXN004',
      type: 'credit',
      category: 'wallet_topup',
      amount: 5000,
      description: 'Wallet Top-up via Bank Transfer',
      status: 'pending',
      date: '2024-01-15',
      time: '11:15',
      reference: 'REF987654321',
      service: 'Bank Transfer'
    },
    {
      id: 'TXN005',
      type: 'debit',
      category: 'cable_tv',
      amount: 6200,
      description: 'DStv Confam Subscription',
      status: 'completed',
      date: '2024-01-14',
      time: '16:30',
      service: 'DStv',
      recipient: '1234567890'
    },
    {
      id: 'TXN006',
      type: 'debit',
      category: 'data',
      amount: 1500,
      description: 'Airtel 5GB Data Bundle',
      status: 'completed',
      date: '2024-01-14',
      time: '15:20',
      service: 'Airtel',
      recipient: '08098765432'
    },
    {
      id: 'TXN007',
      type: 'debit',
      category: 'betting',
      amount: 2000,
      description: 'Bet9ja Wallet Funding',
      status: 'failed',
      date: '2024-01-14',
      time: '14:10',
      service: 'Bet9ja',
      recipient: 'user123456'
    },
    {
      id: 'TXN008',
      type: 'debit',
      category: 'electricity',
      amount: 5000,
      description: 'EKEDC Electricity Bill',
      status: 'completed',
      date: '2024-01-13',
      time: '10:45',
      service: 'EKEDC',
      recipient: '12345678901'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'wallet_topup', name: 'Wallet Top-up' },
    { id: 'virtual_number', name: 'Virtual Numbers' },
    { id: 'airtime', name: 'Airtime' },
    { id: 'data', name: 'Data Bundles' },
    { id: 'cable_tv', name: 'Cable TV' },
    { id: 'betting', name: 'Betting' },
    { id: 'electricity', name: 'Electricity' },
    { id: 'recharge_card', name: 'Recharge Cards' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.service?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const totalCredits = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wallet_topup':
        return <CreditCard className="h-4 w-4" />;
      case 'virtual_number':
        return <CheckCircle className="h-4 w-4" />;
      case 'airtime':
      case 'data':
        return <ArrowUpRight className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
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
        }`}>Transaction History</h1>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>Track all your payments and top-ups</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <p className={`text-sm font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>₦{totalCredits.toLocaleString()}</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Credits</p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <div>
              <p className={`text-sm font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>₦{totalDebits.toLocaleString()}</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Debits</p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <p className={`text-sm font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>₦{pendingAmount.toLocaleString()}</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`rounded-2xl p-4 shadow-sm border transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
              showFilters
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 text-orange-600'
                : isDark 
                  ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
                  : 'border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}>
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}>
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="all">All Types</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
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
                <div className="flex items-center space-x-2">
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{transaction.date} • {transaction.time}</p>
                  {transaction.service && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {transaction.service}
                    </span>
                  )}
                </div>
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
              <div className="flex items-center justify-end space-x-1 mb-1">
                {getStatusIcon(transaction.status)}
                <span className={getStatusBadge(transaction.status)}>
                  {transaction.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedTransaction(transaction)}
                className={`text-xs flex items-center space-x-1 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                <Eye className="h-3 w-3" />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <History className={`h-12 w-12 mx-auto mb-4 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>No transactions found</h3>
          <p className={`${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  selectedTransaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {selectedTransaction.type === 'credit' ? (
                    <ArrowDownLeft className="h-8 w-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowUpRight className="h-8 w-8 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{selectedTransaction.description}</h3>
                <p className={`text-2xl font-bold ${
                  selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'credit' ? '+' : '-'}₦{selectedTransaction.amount.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time:</span>
                  <span>{selectedTransaction.date} {selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className={getStatusBadge(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                {selectedTransaction.service && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span>{selectedTransaction.service}</span>
                  </div>
                )}
                {selectedTransaction.recipient && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recipient:</span>
                    <span className="font-mono">{selectedTransaction.recipient}</span>
                  </div>
                )}
                {selectedTransaction.reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference:</span>
                    <span className="font-mono">{selectedTransaction.reference}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;