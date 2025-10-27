import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { smsApiService } from '../services/smsApi';
import { NotificationSound } from '../utils/notificationSound';
import { 
  Mail, 
  MailOpen, 
  X, 
  Zap, 
  Copy,
  RefreshCw,
  Eye,
  AlertCircle,
  Smartphone,
  Clock,
  CheckCircle,
  Volume2,
  VolumeX,
  ExternalLink
} from 'lucide-react';

const Inbox: React.FC = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [copyNotificationText, setCopyNotificationText] = useState('');
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(NotificationSound.isSoundEnabled());
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelStatus, setCancelStatus] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelClicked, setCancelClicked] = useState(false);

  useEffect(() => {
    loadMessages();
    loadUnreadCount();
    loadAdvertisements();
  }, [currentPage]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getInboxMessages({ 
        page: currentPage, 
        limit: 20 
      });
      const respData: any = (response as any)?.data ?? response;
      const payload = respData?.messages ? respData : (respData?.data?.messages ? respData.data : {});
      const incoming = Array.isArray(payload?.messages) ? payload.messages : [];
      const pageInfo = payload?.pagination || {};

      setMessages(incoming);
      setLastPage(Number(pageInfo.last_page) || 1);
      setTotal(Number(pageInfo.total) || incoming.length);
      setError(null);
    } catch (error) {
      setMessages([]);
      setError('Failed to load messages from server');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getInboxUnreadCount();
      const respData: any = (response as any)?.data ?? response;
      const unread = respData?.unread_count ?? respData?.data?.unread_count;
      const newUnreadCount = typeof unread === 'number' ? unread : 0;
      
      // Play sound if new messages arrived
      if (newUnreadCount > previousUnreadCount && previousUnreadCount > 0) {
        NotificationSound.playInboxSound();
      }
      
      setPreviousUnreadCount(newUnreadCount);
      setUnreadCount(newUnreadCount);
    } catch (error) {
      setUnreadCount(0);
    }
  };

  const loadAdvertisements = async () => {
    try {
      const apiUrl = 'https://api.fadsms.com/api';
      const url = `${apiUrl}/advertisements`;
      console.log('Inbox: Fetching ads from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Inbox: API response:', data);
      
      if ((data.status === 'success' || data.success === true) && Array.isArray(data.data)) {
        // Get all active ads for inbox (can show featured or non-featured)
        const inboxAds = data.data.filter((ad: any) => ad.is_active);
        console.log('Inbox: Active ads for inbox:', inboxAds.length, inboxAds);
        setAdvertisements(inboxAds);
      } else {
        console.error('Inbox: Invalid API response format:', data);
      }
    } catch (error) {
      console.error('Inbox: Failed to load advertisements:', error);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
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
    setCancelClicked(false);
    if (!message.is_read) {
      await handleMarkAsRead(String(message.id));
    }
  };

  const handleCopyToken = (token: string, label: string = 'Text') => {
    navigator.clipboard.writeText(token);
    setCopyNotificationText(`${label} copied to clipboard!`);
    setShowCopyNotification(true);
    setTimeout(() => {
      setShowCopyNotification(false);
    }, 3000);
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    NotificationSound.setEnabled(newSoundEnabled);
    
    // Play test sound when enabling
    if (newSoundEnabled) {
      NotificationSound.playSuccessSound();
    }
  };

  const handleCancelOrder = async (orderId?: string) => {
    if (!orderId) return;
    try {
      setCancelError(null);
      setCancelStatus(null);
      setCancelClicked(true);
      setCancelLoading(true);
      const res = await smsApiService.cancelOrder(orderId);
      setCancelStatus(res.message || 'Order cancelled and refunded.');
      // Refresh inbox and unread
      await loadMessages();
      await loadUnreadCount();
    } catch (e: any) {
      setCancelError(e?.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
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
                    onClick={() => handleCopyToken(token, 'Electricity token')}
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

    if (message.type === 'sms_order' && message.metadata) {
      const { 
        formatted_phone, 
        service_name, 
        status, 
        status_label, 
        sms_code, 
        cost,
        country,
        provider_name,
        expires_at
      } = message.metadata;
      
      return (
        <div className="sms-order-details">
          <h4 className="flex items-center text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
            <Smartphone className="h-5 w-5 mr-2" />
            🔆 Fadded VIP SMS Order
          </h4>
          <div className="sms-info space-y-2">
            {service_name && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Service:</span>
                <span className="font-medium">{service_name}</span>
              </div>
            )}
            {formatted_phone && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Phone Number:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                    {formatted_phone}
                  </code>
                  <button
                    onClick={() => handleCopyToken(formatted_phone, 'Phone number')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy phone number"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {sms_code && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">SMS Code:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-green-100 dark:bg-green-900 px-3 py-1.5 rounded font-mono text-lg font-bold text-green-600 dark:text-green-400">
                    {sms_code}
                  </code>
                  <button
                    onClick={() => handleCopyToken(sms_code, 'SMS code')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy SMS code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {status_label && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`font-medium flex items-center space-x-1 ${
                  status === 'completed' ? 'text-green-600 dark:text-green-400' : 
                  status === 'active' || status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {status === 'completed' && <CheckCircle className="h-4 w-4" />}
                  {(status === 'active' || status === 'pending') && <Clock className="h-4 w-4" />}
                  <span>{status_label}</span>
                </span>
              </div>
            )}
            {country && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Country:</span>
                <span className="font-medium">{country}</span>
              </div>
            )}
            {provider_name && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Provider:</span>
                <span className="font-medium">{provider_name}</span>
              </div>
            )}
            {cost && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Cost:</span>
                <span className="font-medium">₦{Number(cost).toLocaleString()}</span>
              </div>
            )}
            {expires_at && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Expires:</span>
                <span className="font-mono text-sm">{new Date(expires_at).toLocaleString()}</span>
              </div>
            )}
            {message.reference && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
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

  const handleAdClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getAdBackgroundStyle = (ad: any) => {
    if (ad.background_type === 'image' && ad.background_image) {
      return {
        backgroundImage: `url(${ad.background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: ad.text_color
      };
    }
    return {
      backgroundColor: ad.background_color,
      color: ad.text_color
    };
  };

  // Merge messages with ads - insert ad every 3 messages
  const getMergedItems = () => {
    console.log('Inbox: getMergedItems called', { 
      messagesCount: messages.length, 
      adsCount: advertisements.length 
    });
    
    if (advertisements.length === 0) {
      console.log('Inbox: No ads to merge, returning messages only');
      return messages.map(msg => ({ ...msg, itemType: 'message' }));
    }
    
    const merged: any[] = [];
    let adIndex = 0;
    
    messages.forEach((message, index) => {
      merged.push({ ...message, itemType: 'message' });
      
      // Insert ad after every 3 messages
      if ((index + 1) % 3 === 0 && adIndex < advertisements.length) {
        console.log(`Inbox: Inserting ad #${adIndex} after message #${index + 1}`);
        merged.push({ ...advertisements[adIndex], itemType: 'ad' });
        adIndex++;
      }
    });
    
    console.log('Inbox: Merged items count:', merged.length);
    return merged;
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

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={toggleSound}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark 
              ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
              : 'border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100'
          }`}
          title={soundEnabled ? 'Disable notification sounds' : 'Enable notification sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          <span className="text-sm hidden sm:inline">
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </span>
        </button>
        
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
        ) : (error && messages.length === 0) ? (
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
              Your inbox is empty. SMS orders, electricity tokens, and other notifications will appear here.
            </p>
          </div>
        ) : (
          getMergedItems().map((item, index) => {
            // Render advertisement
            if (item.itemType === 'ad') {
              return (
                <div
                  key={`ad-${item.id}`}
                  className="relative overflow-hidden rounded-xl p-4 cursor-pointer transition-transform hover:scale-[1.02] shadow-lg min-h-[120px]"
                  style={getAdBackgroundStyle(item)}
                  onClick={() => handleAdClick(item.button_url)}
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
                      <span className="text-xs px-2 py-0.5 bg-yellow-500 text-black rounded-full font-semibold">
                        Ad
                      </span>
                    </div>
                    <p className="text-xs opacity-90 mb-3 line-clamp-2">{item.description}</p>
                    <button 
                      className="inline-flex items-center space-x-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdClick(item.button_url);
                      }}
                    >
                      <span>{item.button_text}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              );
            }
            
            // Render message
            const message = item;
            const { date, time } = formatDate(message.created_at);
            return (
              <div 
                key={`msg-${message.id}`}
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
                      {typeof message.message === 'string' 
                        ? (message.message.length > 100 
                            ? `${message.message.substring(0, 100)}...` 
                            : message.message)
                        : ''
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
                      {message.type === 'sms_order' && (
                        <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                          <Smartphone className="h-3 w-3" />
                          <span>SMS</span>
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

      {/* Pagination */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Page {currentPage} of {lastPage} • Total {total}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className={`px-3 py-1 rounded border ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-800'} disabled:opacity-50`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => (p < lastPage ? p + 1 : p))}
              disabled={currentPage >= lastPage || loading}
              className={`px-3 py-1 rounded border ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-800'} disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>
      )}

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
                {selectedMessage.type === 'sms_order' && (
                  <Smartphone className="h-6 w-6 mr-2 text-blue-500" />
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
                    onClick={() => handleCopyToken(selectedMessage.metadata.token, 'Electricity token')}
                    className="w-full flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Token</span>
                  </button>
                </div>
              )}
              {selectedMessage.type === 'sms_order' && selectedMessage.metadata && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  {selectedMessage.metadata.formatted_phone && (
                    <button 
                      onClick={() => handleCopyToken(selectedMessage.metadata.formatted_phone, 'Phone number')}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Phone Number</span>
                    </button>
                  )}
                  {selectedMessage.metadata.sms_code && (
                    <button 
                      onClick={() => handleCopyToken(selectedMessage.metadata.sms_code, 'SMS code')}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy SMS Code</span>
                    </button>
                  )}
                  {/* Allow cancellation when no SMS code yet and order is pending/active */}
                  {!selectedMessage.metadata.sms_code && ((selectedMessage.metadata.status || '').toLowerCase() === 'pending' || (selectedMessage.metadata.status || '').toLowerCase() === 'active') && (
                    <button
                      onClick={() => handleCancelOrder(selectedMessage.metadata.order_id || selectedMessage.reference)}
                      disabled={cancelLoading || cancelClicked}
                      className={`w-full flex items-center justify-center space-x-2 ${(cancelLoading || cancelClicked) ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white py-2 px-4 rounded-lg font-medium transition-colors`}
                    >
                      <X className="h-4 w-4" />
                      <span>{cancelLoading ? 'Cancelling...' : (cancelClicked ? 'Cancellation Requested' : 'Cancel Order & Refund')}</span>
                    </button>
                  )}
                  {/* Expired orders auto-refund, show disabled state */}
                  {!selectedMessage.metadata.sms_code && (selectedMessage.metadata.status || '').toLowerCase() === 'expired' && (
                    <button
                      disabled
                      className="w-full flex items-center justify-center space-x-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                    >
                      <X className="h-4 w-4" />
                      <span>Expired — Auto-refunded</span>
                    </button>
                  )}
                  {(cancelStatus || cancelError) && (
                    <div className={`text-sm px-3 py-2 rounded ${cancelError ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                      {cancelError || cancelStatus}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Copy Notification Toast */}
      {showCopyNotification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg ${
            isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
          }`}>
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{copyNotificationText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;