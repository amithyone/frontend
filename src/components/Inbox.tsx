import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { 
  Mail, 
  MailOpen, 
  X, 
  CheckCircle, 
  Clock, 
  Zap, 
  Copy,
  Trash2,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';

const Inbox: React.FC = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
    loadUnreadCount();
  }, [currentPage]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getInboxMessages({ 
        page: currentPage, 
        limit: 20 
      });
      
      console.log('Inbox API Response:', response); // Debug log
      
      if (response.status === 'success' && response.data) {
        setMessages(response.data.messages || []);
      } else {
        // For now, show sample data if API fails
        console.log('API failed, showing sample data');
        setMessages([
          {
            id: 1,
            user_id: 1,
            type: 'electricity_token',
            title: '🔆 Fadded VIP Electricity Token',
            message: 'Your electricity token has been generated successfully. Token: 1234-5678-9012-3456, Units: 45.5 kWh',
            reference: 'ELEC202401131045',
            is_read: false,
            metadata: {
              token: '1234-5678-9012-3456',
              units: '45.5 kWh',
              customer_name: 'John Doe',
              amount: 5000
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            user_id: 1,
            type: 'general',
            title: 'Welcome to Fadded VIP',
            message: 'Welcome to your SMS and VTU service platform. You can now purchase airtime, data, electricity, and more!',
            reference: 'WELCOME001',
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Show sample data on error
      setMessages([
        {
          id: 1,
          user_id: 1,
          type: 'electricity_token',
          title: '🔆 Fadded VIP Electricity Token',
          message: 'Your electricity token has been generated successfully. Token: 1234-5678-9012-3456, Units: 45.5 kWh',
          reference: 'ELEC202401131045',
          is_read: false,
          metadata: {
            token: '1234-5678-9012-3456',
            units: '45.5 kWh',
            customer_name: 'John Doe',
            amount: 5000
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getInboxUnreadCount();
      console.log('Unread count API Response:', response); // Debug log
      
      if (response.status === 'success' && response.data) {
        setUnreadCount(response.data.unread_count || 0);
      } else {
        // Fallback to sample unread count
        setUnreadCount(1);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
      // Fallback to sample unread count
      setUnreadCount(1);
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await apiService.markInboxMessageAsRead({ message_id: messageId });
      loadMessages();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleViewMessage = async (message: any) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      await handleMarkAsRead(message.id);
    }
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    // You could add a toast notification here
  };

  const renderMessageContent = (message: any) => {
    if (message.type === 'electricity_token' && message.metadata) {
      const { token, units, customer_name, amount } = message.metadata;
      return (
        <div className="electricity-token-details">
          <h4 className="flex items-center text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
            <Zap className="h-5 w-5 mr-2" />
            🔆 Fadded VIP Electricity Token
          </h4>
          <div className="token-info space-y-2">
            {customer_name && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Customer:</span>
                <span className="font-medium">{customer_name}</span>
              </div>
            )}
            {token && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Token:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-sm font-bold text-pink-600 dark:text-pink-400">
                    {token}
                  </code>
                  <button
                    onClick={() => handleCopyToken(token)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy token"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {units && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Units:</span>
                <span className="font-medium">{units} kWh</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                <span className="font-medium">₦{amount.toLocaleString()}</span>
              </div>
            )}
            {message.reference && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Reference:</span>
                <span className="font-mono text-sm">{message.reference}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="message-content">
        <p className="whitespace-pre-wrap">{message.message}</p>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className={`p-4 space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-2xl font-bold mb-2 flex items-center justify-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Mail className="h-8 w-8 mr-3 text-blue-500" />
          Inbox
        </h1>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>Your messages and notifications</p>
        {unreadCount > 0 && (
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            loadMessages();
            loadUnreadCount();
          }}
          disabled={loading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
            isDark 
              ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50' 
              : 'border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 disabled:opacity-50'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-500" />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading messages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Error loading messages
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
            <button
              onClick={() => {
                setError(null);
                loadMessages();
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MailOpen className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No messages found
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Your inbox is empty. Messages will appear here when you make transactions.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const { date, time } = formatDate(message.created_at);
            return (
              <div 
                key={message.id} 
                className={`message-item cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                    : 'bg-white border-gray-100 hover:bg-gray-50'
                } ${
                  !message.is_read 
                    ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' 
                    : 'border border-gray-200 dark:border-gray-700'
                } rounded-xl p-4`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {message.title}
                      </h4>
                      {!message.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {message.message.length > 100 
                        ? `${message.message.substring(0, 100)}...` 
                        : message.message
                      }
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{date}</span>
                      <span>{time}</span>
                      {message.type === 'electricity_token' && (
                        <span className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                          <Zap className="h-3 w-3" />
                          <span>Token</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!message.is_read && (
                      <div className="flex items-center space-x-1 text-blue-600 text-xs">
                        <Mail className="h-3 w-3" />
                        <span>New</span>
                      </div>
                    )}
                    <Eye className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold flex items-center">
                {selectedMessage.type === 'electricity_token' && (
                  <Zap className="h-6 w-6 mr-2 text-yellow-500" />
                )}
                {selectedMessage.title}
              </h3>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(selectedMessage.created_at).date} at {formatDate(selectedMessage.created_at).time}
              </div>
              <div className="modal-content">
                {renderMessageContent(selectedMessage)}
              </div>
              {selectedMessage.type === 'electricity_token' && selectedMessage.metadata?.token && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => handleCopyToken(selectedMessage.metadata.token)}
                    className="w-full flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Token</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;