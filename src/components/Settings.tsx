import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  Settings as SettingsIcon, 
  User, 
  Sun,
  Moon,
  Key,
  MessageSquare,
  ChevronRight,
  Save,
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
  Bell,
  Users,
  Volume2,
  VolumeX,
  Rocket,
  Shield
} from 'lucide-react';
import Referral from './Referral';
import ApplyReseller from './ApplyReseller';
import ResellerAdmin from './ResellerAdmin';
import { NotificationSound } from '../utils/notificationSound';

interface ApiKey {
  id: number;
  name: string;
  key: string;
  is_active: boolean;
  permissions: string[];
  usage_count: number;
  last_used_at: string | null;
  created_at: string;
}

interface Ticket {
  id: number;
  subject: string;
  message: string;
  status: 'open' | 'replied' | 'closed';
  created_at: string;
  reply?: string;
}

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, updateUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'password' | 'api' | 'theme' | 'notifications' | 'support' | 'referral' | 'reseller'>('main');
  
  // Profile
  const [name, setName] = useState(user?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    transactions: true,
    promotions: false,
    sound: NotificationSound.isSoundEnabled()
  });
  
  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['sms', 'vtu']);
  const [showKeySecret, setShowKeySecret] = useState<{[key: number]: boolean}>({});
  
  // Support Tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSendingTicket, setIsSendingTicket] = useState(false);

  const menuItems = [
    {
      id: 'profile',
      name: 'Profile Settings',
      icon: User,
      description: 'Update your personal information',
      color: 'text-blue-500'
    },
    {
      id: 'password',
      name: 'Password & Security',
      icon: Lock,
      description: 'Change password and security settings',
      color: 'text-red-500'
    },
    {
      id: 'referral',
      name: 'Referral Program',
      icon: Users,
      description: 'Earn commissions by referring friends',
      color: 'text-green-500'
    },
    {
      id: 'reseller',
      name: 'Reseller Panel',
      icon: Rocket,
      description: 'Get your own white-label SMS/VTU platform',
      color: 'text-purple-500'
    },
    {
      id: 'reseller-admin',
      name: 'Manage My Panel',
      icon: Shield,
      description: 'Manage your reseller panel settings',
      color: 'text-indigo-500'
    },
    {
      id: 'api',
      name: 'API Keys',
      icon: Key,
      description: 'Manage your API keys for integration',
      color: 'text-purple-500'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Email, SMS, and push notifications',
      color: 'text-yellow-500'
    },
    {
      id: 'theme',
      name: 'Theme Settings',
      icon: isDark ? Moon : Sun,
      description: 'Customize your app appearance',
      color: 'text-orange-500'
    },
    {
      id: 'support',
      name: 'Support & Tickets',
      icon: MessageSquare,
      description: 'Get help and submit tickets',
      color: 'text-pink-500'
    }
  ];

  // Load API keys
  const loadApiKeys = async () => {
    setIsLoadingKeys(true);
    try {
      const response = await apiService.request('/api-keys', { method: 'GET' });
      if (response.success) {
        setApiKeys(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'api') {
      loadApiKeys();
    }
  }, [activeSection]);

  // Save profile
  const saveProfile = async () => {
    if (!name.trim()) {
      alert('Name cannot be empty');
      return;
    }

    setIsSavingProfile(true);
    try {
      // API call to update profile
      const response = await apiService.request('/user/update', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim() })
      });

      if (response.success || response.status === 'success') {
        updateUser({ ...user, name: name.trim() });
        alert('Profile updated successfully!');
      } else {
        alert(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Create API key
  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for your API key');
      return;
    }

    try {
      const response = await apiService.request('/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          name: newKeyName.trim(),
          permissions: selectedPermissions
        })
      });

      if (response.success) {
        alert(`API Key created!\n\nKey: ${response.data.key}\nSecret: ${response.data.secret}\n\nSave this information securely!`);
        setNewKeyName('');
        setShowNewKeyForm(false);
        loadApiKeys();
      } else {
        alert(response.message || 'Failed to create API key');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create API key');
    }
  };

  // Delete API key
  const deleteApiKey = async (id: number, name: string) => {
    if (!confirm(`Delete API key "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiService.request(`/api-keys/${id}`, { method: 'DELETE' });
      if (response.success) {
        alert('API key deleted successfully');
        loadApiKeys();
      } else {
        alert(response.message || 'Failed to delete API key');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete API key');
    }
  };

  // Submit ticket
  const submitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      alert('Please fill in both subject and message');
      return;
    }

    setIsSendingTicket(true);
    try {
      // For now, create an inbox message as a ticket
      const response = await apiService.createInboxMessage({
        type: 'support',
        title: `Support: ${ticketSubject.trim()}`,
        message: ticketMessage.trim(),
        metadata: {
          ticket_type: 'support',
          status: 'open',
          created_at: new Date().toISOString()
        }
      });

      alert('Support ticket submitted successfully! We\'ll respond within 24 hours.');
      setTicketSubject('');
      setTicketMessage('');
      setShowNewTicketForm(false);
    } catch (error: any) {
      alert(error.message || 'Failed to submit ticket');
    } finally {
      setIsSendingTicket(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Main menu
  if (activeSection === 'main') {
    return (
      <div className={`p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your account and preferences</p>
        </div>

        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full p-4 rounded-xl shadow-sm border transition-all duration-200 text-left ${
                  isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Profile Section
  if (activeSection === 'profile') {
    return (
      <div className={`p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-6">
          <button onClick={() => setActiveSection('main')} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ← Back
          </button>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h2>
        </div>

        <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className={`px-4 py-3 border rounded-lg ${isDark ? 'bg-gray-700/50 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-500'}`}>
                {user?.email || 'Not set'}
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Email cannot be changed for security reasons
              </p>
            </div>

            <button
              onClick={saveProfile}
              disabled={isSavingProfile || !name.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                isSavingProfile || !name.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSavingProfile ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // API Keys Section
  if (activeSection === 'api') {
    return (
      <div className={`p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => setActiveSection('main')} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ← Back
            </button>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>API Keys</h2>
          </div>
          <button
            onClick={() => setShowNewKeyForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Key</span>
          </button>
        </div>

        {/* New API Key Form */}
        {showNewKeyForm && (
          <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="e.g., Production Key, Test Key"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Permissions
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'sms', label: 'SMS Services', desc: 'Purchase SMS numbers and receive codes' },
                    { id: 'vtu', label: 'VTU Services', desc: 'Airtime, data, electricity purchases' }
                  ].map((perm) => (
                    <label key={perm.id} className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      selectedPermissions.includes(perm.id)
                        ? isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'
                        : isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, perm.id]);
                          } else {
                            setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                          }
                        }}
                        className="mr-3"
                      />
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{perm.label}</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{perm.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewKeyForm(false)}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={createApiKey}
                  disabled={!newKeyName.trim() || selectedPermissions.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        <div className="space-y-3">
          {isLoadingKeys ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading API keys...
            </div>
          ) : apiKeys.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No API keys yet</p>
              <p className="text-sm">Create your first API key to get started</p>
            </div>
          ) : (
            apiKeys.map((key) => (
              <div key={key.id} className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{key.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {key.is_active ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">Inactive</span>
                      )}
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {key.usage_count} requests
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteApiKey(key.id, key.name)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className={`p-3 rounded-lg font-mono text-sm mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {showKeySecret[key.id] ? key.key : key.key.substring(0, 20) + '••••••••••••'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowKeySecret({...showKeySecret, [key.id]: !showKeySecret[key.id]})}
                        className={`p-1 hover:bg-gray-600 rounded ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {showKeySecret[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className={`p-1 hover:bg-gray-600 rounded ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {key.permissions?.map((perm: string) => (
                    <span key={perm} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {perm}
                    </span>
                  ))}
                </div>

                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Created: {new Date(key.created_at).toLocaleDateString()}
                  {key.last_used_at && ` • Last used: ${new Date(key.last_used_at).toLocaleDateString()}`}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <p className="font-semibold mb-1">API Documentation</p>
              <p>Use your API keys to integrate FaddedSMS services into your applications. Check the API documentation for endpoints and examples.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Theme Section
  if (activeSection === 'theme') {
    return (
      <div className={`p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-6">
          <button onClick={() => setActiveSection('main')} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ← Back
          </button>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Theme Settings</h2>
        </div>

        <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Appearance</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => !isDark && toggleTheme()}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                !isDark 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-600 bg-gray-700 hover:bg-gray-650'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sun className={`h-6 w-6 ${!isDark ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className={`font-semibold ${!isDark ? 'text-gray-900' : 'text-white'}`}>Light Mode</div>
                    <div className={`text-sm ${!isDark ? 'text-gray-600' : 'text-gray-400'}`}>Bright and clean interface</div>
                  </div>
                </div>
                {!isDark && <CheckCircle className="h-5 w-5 text-blue-600" />}
              </div>
            </button>

            <button
              onClick={() => isDark || toggleTheme()}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                isDark 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dark Mode</div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Easy on the eyes</div>
                  </div>
                </div>
                {isDark && <CheckCircle className="h-5 w-5 text-blue-400" />}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Support Section
  if (activeSection === 'support') {
    return (
      <div className={`p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => setActiveSection('main')} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ← Back
            </button>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Support & Tickets</h2>
          </div>
          {!showNewTicketForm && (
            <button
              onClick={() => setShowNewTicketForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Ticket</span>
            </button>
          )}
        </div>

        {/* New Ticket Form */}
        {showNewTicketForm && (
          <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Submit Support Ticket</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewTicketForm(false)}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={submitTicket}
                  disabled={isSendingTicket || !ticketSubject.trim() || !ticketMessage.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSendingTicket ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Us</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MessageSquare className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Support Email</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>support@fadsms.com</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Response Time</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Within 24 hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Resources */}
        <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Help Resources</h3>
          
          <div className="space-y-2">
            <a 
              href="https://api.fadsms.com/API_DOCUMENTATION.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}
            >
              📖 API Documentation
            </a>
            <a 
              href="https://api.fadsms.com/HELP_RESOURCES.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}
            >
              ❓ FAQs & Help Center
            </a>
            <a 
              href="https://api.fadsms.com/TERMS_OF_USE.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}
            >
              📜 Terms of Use
            </a>
            <a 
              href="https://api.fadsms.com/PRIVACY_POLICY.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}
            >
              🔒 Privacy Policy
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Password Section
  if (activeSection === 'password') {
    const changePassword = async () => {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all password fields');
        return;
      }

      if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }

      setIsChangingPassword(true);
      try {
        const response = await apiService.request('/change-password', {
          method: 'POST',
          body: JSON.stringify({
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword
          })
        });

        if (response.success || response.status === 'success') {
          alert('Password changed successfully!');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          alert(response.message || 'Failed to change password');
        }
      } catch (error: any) {
        alert(error.message || 'Failed to change password');
      } finally {
        setIsChangingPassword(false);
      }
    };

    return (
      <div className={`p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-6">
          <button onClick={() => setActiveSection('main')} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ← Back
          </button>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Password & Security</h2>
        </div>

        <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Change Password</h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg pr-12 ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg pr-12 ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Enter new password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={changePassword}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                isChangingPassword || !currentPassword || !newPassword || !confirmPassword
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isChangingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <p className="font-semibold mb-1">Password Requirements</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Minimum 8 characters</li>
                <li>Mix of letters and numbers recommended</li>
                <li>Cannot be your email or name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Notifications Section
  if (activeSection === 'notifications') {
    const saveNotifications = async () => {
      try {
        alert('Notification preferences saved!');
      } catch (error) {
        alert('Failed to save notification preferences');
      }
    };

    return (
      <div className={`p-4 pb-24 space-y-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-6">
          <button onClick={() => setActiveSection('main')} className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ← Back
          </button>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notification Settings</h2>
        </div>

        <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Notification Channels</h3>
          
          <div className="space-y-4">
            {[
              { key: 'sound', label: 'Sound Notifications', desc: 'Play sound when new messages arrive', icon: notifications.sound ? Volume2 : VolumeX },
              { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Get SMS alerts for important updates' },
              { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' }
            ].map((channel) => {
              const Icon = channel.icon;
              return (
                <label key={channel.key} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    {Icon && <Icon className={`h-5 w-5 ${notifications[channel.key as keyof typeof notifications] ? 'text-green-500' : 'text-gray-400'}`} />}
                    <div>
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{channel.label}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{channel.desc}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[channel.key as keyof typeof notifications]}
                    onChange={(e) => {
                      const newValue = e.target.checked;
                      setNotifications({...notifications, [channel.key]: newValue});
                      if (channel.key === 'sound') {
                        NotificationSound.setEnabled(newValue);
                        if (newValue) {
                          NotificationSound.playSuccessSound();
                        }
                      }
                    }}
                    className="w-5 h-5 accent-green-500"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Notification Types</h3>
          
          <div className="space-y-4">
            {[
              { key: 'transactions', label: 'Transaction Alerts', desc: 'Get notified about all transactions' },
              { key: 'promotions', label: 'Promotions & Offers', desc: 'Receive special offers and promotions' }
            ].map((type) => (
              <label key={type.key} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{type.label}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{type.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[type.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications({...notifications, [type.key]: e.target.checked})}
                  className="w-5 h-5"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={saveNotifications}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>Save Preferences</span>
        </button>
      </div>
    );
  }

  // Referral Section
  if (activeSection === 'referral') {
    return <Referral />;
  }

  // Reseller Section
  if (activeSection === 'reseller') {
    return <ApplyReseller />;
  }

  // Reseller Admin Section - Navigate to route
  if (activeSection === 'reseller-admin') {
    window.location.href = '/reseller-admin';
    return null;
  }

  return null;
};

export default Settings;
