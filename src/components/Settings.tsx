import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Edit,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
  Sun,
  Moon,
  Globe,
  Smartphone,
  Key,
  AlertTriangle,
  CheckCircle,
  Info,
  MessageSquare,
  Star,
  Download,
  Trash2
} from 'lucide-react';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'security' | 'notifications' | 'preferences' | 'support'>('main');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  
  // User profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    avatar: '',
    verified: true
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    transactions: true,
    promotions: false,
    security: true
  });

  // App preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'NGN',
    autoTopup: false,
    biometric: false,
    twoFactor: false
  });

  const menuItems = [
    {
      id: 'profile',
      name: 'Profile Settings',
      icon: User,
      description: 'Manage your personal information',
      color: 'text-blue-500'
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      icon: Shield,
      description: 'Password, 2FA, and privacy settings',
      color: 'text-green-500'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences',
      color: 'text-orange-500'
    },
    {
      id: 'preferences',
      name: 'App Preferences',
      icon: SettingsIcon,
      description: 'Theme, language, and app settings',
      color: 'text-purple-500'
    },
    {
      id: 'support',
      name: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help and contact support',
      color: 'text-red-500'
    }
  ];

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    // Simulate password change
    alert('Password changed successfully');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    alert('Account deletion request submitted. You will receive a confirmation email.');
    setShowDeleteModal(false);
  };

  const renderMainMenu = () => (
    <div className="space-y-4">
      {/* User Profile Card */}
      <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <button className="absolute -bottom-1 -right-1 p-1 bg-orange-500 rounded-full text-white">
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{profile.name}</h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{profile.email}</p>
            <div className="flex items-center space-x-1 mt-1">
              {profile.verified ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500">Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-orange-500">Unverified</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveSection('profile')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-750' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-6 w-6 ${item.color}`} />
                <div className="text-left">
                  <h3 className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{item.name}</h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center space-x-2 p-4 rounded-xl transition-all duration-200 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-750' 
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-500" />}
          <span className={`text-sm font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
        
        <button className={`flex items-center justify-center space-x-2 p-4 rounded-xl transition-all duration-200 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-750' 
            : 'bg-white hover:bg-gray-50'
        }`}>
          <LogOut className="h-5 w-5 text-red-500" />
          <span className={`text-sm font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => setActiveSection('main')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <h2 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Profile Settings</h2>
      </div>

      <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>
          
          <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
            <Save className="h-5 w-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => setActiveSection('main')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <h2 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Security & Privacy</h2>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowPasswordModal(true)}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-750' 
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Lock className="h-6 w-6 text-blue-500" />
            <div className="text-left">
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Change Password</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Update your account password</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <div className={`flex items-center justify-between p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6 text-green-500" />
            <div>
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Two-Factor Authentication</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Add extra security to your account</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.twoFactor}
              onChange={(e) => setPreferences({...preferences, twoFactor: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-purple-500" />
            <div>
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Biometric Login</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Use fingerprint or face ID</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.biometric}
              onChange={(e) => setPreferences({...preferences, biometric: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
            isDark 
              ? 'bg-red-900 bg-opacity-20 hover:bg-opacity-30' 
              : 'bg-red-50 hover:bg-red-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Trash2 className="h-6 w-6 text-red-500" />
            <div className="text-left">
              <h3 className="font-medium text-red-600">Delete Account</h3>
              <p className={`text-sm ${
                isDark ? 'text-red-400' : 'text-red-500'
              }`}>Permanently delete your account</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-red-400" />
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => setActiveSection('main')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <h2 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Notifications</h2>
      </div>

      <div className="space-y-3">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className={`flex items-center justify-between p-4 rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div>
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {key === 'push' && 'Receive push notifications on your device'}
                {key === 'email' && 'Get notifications via email'}
                {key === 'sms' && 'Receive SMS notifications'}
                {key === 'transactions' && 'Transaction confirmations and updates'}
                {key === 'promotions' && 'Special offers and promotions'}
                {key === 'security' && 'Security alerts and login notifications'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => setActiveSection('main')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <h2 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>App Preferences</h2>
      </div>

      <div className="space-y-3">
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className={`font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Language</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Choose your preferred language</p>
              </div>
            </div>
          </div>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="en">English</option>
            <option value="yo">Yoruba</option>
            <option value="ig">Igbo</option>
            <option value="ha">Hausa</option>
          </select>
        </div>

        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-green-500" />
              <div>
                <h3 className={`font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Currency</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Default currency for transactions</p>
              </div>
            </div>
          </div>
          <select
            value={preferences.currency}
            onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="NGN">Nigerian Naira (₦)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-orange-500" />
            <div>
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Auto Top-up</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Automatically top-up when balance is low</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.autoTopup}
              onChange={(e) => setPreferences({...preferences, autoTopup: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => setActiveSection('main')}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <h2 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Help & Support</h2>
      </div>

      <div className="space-y-3">
        <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-750' 
            : 'bg-white hover:bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <div className="text-left">
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Live Chat</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Chat with our support team</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-750' 
            : 'bg-white hover:bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-6 w-6 text-green-500" />
            <div className="text-left">
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>FAQ</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Frequently asked questions</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-750' 
            : 'bg-white hover:bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <div className="text-left">
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Rate App</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Rate FaddedSMS on the app store</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-750' 
            : 'bg-white hover:bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <Info className="h-6 w-6 text-purple-500" />
            <div className="text-left">
              <h3 className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>About</h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>App version and information</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* App Info */}
      <div className={`p-4 rounded-xl text-center ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>FaddedSMS</h3>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>Version 1.0.0</p>
        <p className={`text-xs mt-2 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>© 2024 FaddedSMS. All rights reserved.</p>
      </div>
    </div>
  );

  return (
    <div className={`p-4 space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      {activeSection === 'main' && (
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Settings</h1>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Manage your account and app preferences</p>
        </div>
      )}

      {/* Content */}
      {activeSection === 'main' && renderMainMenu()}
      {activeSection === 'profile' && renderProfileSettings()}
      {activeSection === 'security' && renderSecuritySettings()}
      {activeSection === 'notifications' && renderNotificationSettings()}
      {activeSection === 'preferences' && renderPreferences()}
      {activeSection === 'support' && renderSupport()}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Confirm New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>
              
              <button
                onClick={handlePasswordChange}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6 text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Delete Account</h2>
              <p className={`text-sm mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    isDark 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;