import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Plus, X, Clock, CheckCircle, AlertCircle, XCircle, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { NotificationSound } from '../utils/notificationSound';

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
  messages?: SupportMessage[];
}

interface SupportMessage {
  id: number;
  message: string;
  is_admin: boolean;
  created_at: string;
  user: {
    name: string;
  };
}

export default function Support() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [soundEnabled, setSoundEnabled] = useState(NotificationSound.isSoundEnabled());
  
  // Create ticket form fields
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const existingContainer = document.getElementById('custom-notification-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = document.createElement('div');
    container.id = 'custom-notification-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      font-weight: 500;
      animation: slideInRight 0.3s ease;
      max-width: 350px;
    `;
    notification.textContent = message;
    
    container.appendChild(notification);
    document.body.appendChild(container);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => container.remove(), 300);
    }, 3000);
  };

  const loadTickets = async () => {
    if (tickets.length === 0) setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/support/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      console.log('📋 Tickets API Response:', data);
      
      if (data.status === 'success') {
        // Handle paginated response - data is in data.data (Laravel pagination)
        const ticketsArray = data.data?.data || data.data?.tickets || [];
        console.log('🎫 Extracted tickets array:', ticketsArray);
        console.log('📊 Total tickets:', ticketsArray.length);
        setTickets(Array.isArray(ticketsArray) ? ticketsArray : []);
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
      showNotification('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.fadsms.com/api/support/tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject,
          description,
          category,
          priority
        })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        showNotification('✅ Ticket created successfully!', 'success');
        setShowCreateForm(false);
        setSubject('');
        setDescription('');
        setCategory('general');
        setPriority('medium');
        await loadTickets();
      } else {
        showNotification(data.message || 'Failed to create ticket', 'error');
      }
    } catch (error) {
      showNotification('Failed to create ticket', 'error');
    } finally {
      setSending(false);
    }
  };

  const viewTicket = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🎫 Fetching ticket ID:', id);
      const response = await fetch(`https://api.fadsms.com/api/support/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      console.log('📦 Full API response:', data);
      
      if (data.status === 'success' && data.data?.ticket) {
        const ticket = data.data.ticket;
        console.log('🎟️ Ticket object:', ticket);
        console.log('💬 Raw messages:', ticket.messages);
        
        // Ensure messages is always an array
        if (!ticket.messages || !Array.isArray(ticket.messages)) {
          console.warn('⚠️ Messages is not an array, setting to empty:', ticket.messages);
          ticket.messages = [];
        }
        
        console.log('✅ Final messages array:', ticket.messages);
        console.log('📊 Messages count:', ticket.messages.length);
        
        setSelectedTicket(ticket);
        setTimeout(scrollToBottom, 100);
      } else {
        console.error('❌ Invalid response format:', data);
      }
    } catch (error) {
      console.error('💥 Failed to load ticket details:', error);
      showNotification('Failed to load ticket details', 'error');
    }
  };

  const refreshSelectedTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://api.fadsms.com/api/support/tickets/${selectedTicket.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 'success' && data.data?.ticket) {
        const ticket = data.data.ticket;
        ticket.messages = Array.isArray(ticket.messages) ? ticket.messages : [];
        
        const currentMessageCount = selectedTicket.messages?.length || 0;
        const newMessageCount = ticket.messages.length;
        
        if (newMessageCount > currentMessageCount) {
          showNotification('💬 New message from support!', 'info');
          NotificationSound.playSupportSound();
          setTimeout(scrollToBottom, 100);
        }
        
        setSelectedTicket(ticket);
      }
    } catch (error) {
      console.error('Failed to refresh ticket:', error);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://api.fadsms.com/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: replyMessage
        })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setReplyMessage('');
        await viewTicket(selectedTicket.id);
        showNotification('✅ Message sent!', 'success');
      } else {
        showNotification(data.message || 'Failed to send message', 'error');
      }
    } catch (error) {
      showNotification('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Observe theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadTickets, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    if (selectedTicket && autoRefresh) {
      const interval = setInterval(refreshSelectedTicket, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedTicket, autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <AlertCircle className="h-3 w-3" />;
      case 'resolved': return <CheckCircle className="h-3 w-3" />;
      case 'closed': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (selectedTicket) {
    // Viewing ticket detail
    return (
      <div className="min-h-screen pb-20 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-6 w-full">
          {/* Back button */}
          <button
            onClick={() => setSelectedTicket(null)}
            className={`mb-4 flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Back to tickets</span>
          </button>

          {/* Ticket Card */}
          <div className={`rounded-xl shadow-lg overflow-hidden transition-colors w-full ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          }`}>
            {/* Header */}
            <div className={`p-4 sm:p-6 border-b transition-colors ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Ticket #{selectedTicket.id}
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(selectedTicket.status)}`}>
                  {getStatusIcon(selectedTicket.status)}
                  <span className="font-medium">{selectedTicket.status.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
              <h2 className={`text-lg sm:text-xl font-bold mb-3 break-words ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedTicket.subject}
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  selectedTicket.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  selectedTicket.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {selectedTicket.priority.toUpperCase()}
                </span>
                <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                  {selectedTicket.category}
                </span>
                <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                  {formatDate(selectedTicket.created_at)}
                </span>
              </div>
              {autoRefresh && (
                <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Real-time updates
                </div>
              )}
            </div>

            {/* Messages */}
            <div className={`p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto overflow-x-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {/* Initial Description */}
              <div className="flex justify-end">
                <div className={`max-w-[85%] rounded-2xl rounded-tr-sm p-4 shadow-lg transition-colors ${
                  isDark ? 'bg-orange-600' : 'bg-orange-500'
                } text-white`}>
                  <p className="text-xs opacity-90 mb-2">Your initial message:</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{selectedTicket.description}</p>
                  <p className="text-xs opacity-75 mt-2">{formatDate(selectedTicket.created_at)}</p>
                </div>
              </div>

              {/* Reply Messages */}
              {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                <>
                  {selectedTicket.messages
                    .slice()
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((msg) => (
                      <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-lg transition-all ${
                          msg.is_admin 
                            ? isDark
                              ? 'bg-gray-800 border-2 border-gray-700 rounded-tl-sm'
                              : 'bg-white border-2 border-gray-200 rounded-tl-sm'
                            : isDark
                              ? 'bg-orange-600 rounded-tr-sm'
                              : 'bg-orange-500 rounded-tr-sm'
                        } text-${msg.is_admin ? (isDark ? 'gray-100' : 'gray-900') : 'white'}`}>
                          {msg.is_admin && (
                            <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                              👨‍💼 Support Team
                            </p>
                          )}
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                            msg.is_admin 
                              ? isDark ? 'text-gray-100' : 'text-gray-900'
                              : 'text-white'
                          }`}>
                            {msg.message}
                          </p>
                          <p className={`text-xs mt-2 ${
                            msg.is_admin 
                              ? isDark ? 'text-gray-500' : 'text-gray-500'
                              : 'text-white opacity-75'
                          }`}>
                            {formatDate(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No replies yet. We'll respond to your ticket soon!
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className={`p-4 border-t transition-colors ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
                  placeholder="Type your message..."
                  className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !replyMessage.trim()}
                  className={`px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                    isDark
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span className="hidden sm:inline">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-6 w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                💬 Support Tickets
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get help from our support team
                </p>
                {autoRefresh && (
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Real-time updates
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
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
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Ticket</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create Ticket Form */}
        {showCreateForm && (
          <div className={`mb-6 rounded-xl shadow-lg overflow-hidden transition-colors ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          }`}>
            <div className={`px-6 py-4 border-b transition-colors flex items-center justify-between ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create New Ticket
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  placeholder="Provide details about your issue..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-orange-500`}
                  >
                    <option value="general">General</option>
                    <option value="payment">💰 Payment</option>
                    <option value="service">📱 Service</option>
                    <option value="technical">🔧 Technical</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-orange-500`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t transition-colors flex gap-3 ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <button
                onClick={() => setShowCreateForm(false)}
                disabled={sending}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300'
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={createTicket}
                disabled={sending || !subject.trim() || !description.trim()}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {sending ? '⏳ Creating...' : '📝 Create Ticket'}
              </button>
            </div>
          </div>
        )}

        {/* Ticket List */}
        {loading && tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className={`text-center py-12 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <MessageCircle className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No support tickets yet
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Create a ticket to get help from our team
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => viewTicket(ticket.id)}
                className={`rounded-xl p-5 cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02] ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                    : 'bg-white hover:shadow-2xl border border-gray-100'
                } shadow-lg`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    #{ticket.id}
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span>{ticket.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
                
                <h3 className={`font-semibold text-base mb-2 line-clamp-2 break-words ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {ticket.subject}
                </h3>
                
                <p className={`text-sm line-clamp-3 mb-4 break-words ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {ticket.description}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ticket.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    ticket.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatDate(ticket.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
