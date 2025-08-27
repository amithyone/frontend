import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Phone, CheckCircle, Clock, XCircle } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  const { isDark } = useTheme();

  const transactions = [
    {
      id: 1,
      type: 'Virtual Number',
      service: 'WhatsApp',
      amount: 500,
      status: 'success',
      time: '1 min ago',
      icon: Shield
    },
    {
      id: 2,
      type: 'Airtime',
      service: 'MTN',
      amount: 1000,
      status: 'success',
      time: '2 mins ago',
      icon: Phone
    },
    {
      id: 3,
      type: 'Virtual Number',
      service: 'Telegram',
      amount: 300,
      status: 'pending',
      time: '5 mins ago',
      icon: Shield
    },
    {
      id: 4,
      type: 'Data Bundle',
      service: 'Airtel',
      amount: 2000,
      status: 'failed',
      time: '10 mins ago',
      icon: Phone
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
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
      case 'success':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'pending':
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return baseClasses;
    }
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
        {transactions.map((transaction) => {
          const Icon = transaction.icon;
          return (
            <div key={transaction.id} className={`flex items-center justify-between p-3 rounded-xl ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-gray-600' : 'bg-oxford-blue'
                }`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className={`font-medium text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{transaction.type}</p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{transaction.service} • {transaction.time}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>₦{transaction.amount}</p>
                  <div className="flex items-center justify-end space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className={`w-full mt-4 py-3 font-medium text-sm rounded-xl transition-colors duration-200 ${
        isDark 
          ? 'text-blue-400 hover:bg-gray-700' 
          : 'text-oxford-blue hover:bg-gray-50'
      }`}>
        View All Transactions
      </button>
    </div>
  );
};

export default RecentTransactions;