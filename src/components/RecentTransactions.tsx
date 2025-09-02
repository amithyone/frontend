import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Phone, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

interface Transaction {
  id: number;
  type: number; // 1=credit, 2=debit, etc.
  amount: number;
  detail?: string;
  ref_id?: string;
  status: number; // 0=pending, 1=success, 2=failed, 3=cancelled
  created_at: string;
  charge?: number;
  final_amount?: number;
}

const RecentTransactions: React.FC = () => {
  const { isDark } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTx = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await apiService.getUserTransactions();
        
        if (isMounted) {
          if (resp?.status === 'success' && resp.data) {
            // Handle both array and paginated response
            const transactionData = Array.isArray(resp.data) ? resp.data : (resp.data as any).data || [];
            setTransactions(transactionData);
          } else {
            setTransactions([]);
          }
        }
      } catch (e) {
        console.error('Error fetching transactions:', e);
        if (isMounted) {
          setTransactions([]);
          setError(e instanceof Error ? e.message : 'Failed to load transactions');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTx();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: // success
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 0: // pending
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 2: // failed
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 3: // cancelled
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 1: // success
        return `${baseClasses} bg-green-100 text-green-700`;
      case 0: // pending
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case 2: // failed
        return `${baseClasses} bg-red-100 text-red-700`;
      case 3: // cancelled
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return baseClasses;
    }
  };

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 1: // credit
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 2: // debit
        return <Phone className="h-4 w-4 text-blue-500" />;
      case 3: // service_purchase
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatAmount = (amount: number, type: number) => {
    const formattedAmount = Math.abs(amount).toLocaleString();
    return type === 1 ? `+₦${formattedAmount}` : `-₦${formattedAmount}`;
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Recent Transactions</h3>
      
      <div className="space-y-4">
        {loading && (
          <div className={`text-sm text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading transactions...
          </div>
        )}
        
        {!loading && error && (
          <div className={`text-sm text-center py-8 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading transactions</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}
        
        {!loading && !error && Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className={`flex items-center justify-between p-3 rounded-xl ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className={`font-medium text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{transaction.detail || 'Transaction'}</p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {transaction.type} • {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{formatAmount(transaction.amount, transaction.type)}</p>
                  <div className="flex items-center justify-end space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : !loading && !error ? (
          <div className={`text-sm text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No transactions found</p>
            <p className="text-xs mt-1">Your transaction history will appear here</p>
          </div>
        ) : null}
      </div>
      
      {!loading && !error && transactions.length > 5 && (
        <button className={`w-full mt-4 py-3 font-medium text-sm rounded-xl transition-colors duration-200 ${
          isDark 
            ? 'text-blue-400 hover:bg-gray-700' 
            : 'text-blue-600 hover:bg-gray-50'
        }`}>
          View All Transactions ({transactions.length})
        </button>
      )}
    </div>
  );
};

export default RecentTransactions;