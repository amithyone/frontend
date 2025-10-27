import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Shield, 
  Phone, 
  Wifi, 
  Tv, 
  Gamepad2, 
  Zap, 
  CreditCard,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Users,
  ChevronRight,
  Settings
} from 'lucide-react';
import VirtualNumberModal from './VirtualNumberModal';
import AirtimeModal from './AirtimeModal';
import DataBundleModal from './DataBundleModal';
import CableTVModal from './CableTVModal';
import BettingModal from './BettingModal';
import RechargeCardModal from './RechargeCardModal';
import ElectricityModal from './ElectricityModal';

const Services: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  
  // Modal states
  const [showVirtualModal, setShowVirtualModal] = useState(false);
  const [showAirtimeModal, setShowAirtimeModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showCableTVModal, setShowCableTVModal] = useState(false);
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showElectricityModal, setShowElectricityModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Services', count: 7 },
    { id: 'verification', name: 'Verification', count: 1 },
    { id: 'telecom', name: 'Telecom', count: 3 },
    { id: 'entertainment', name: 'Entertainment', count: 1 },
    { id: 'utilities', name: 'Utilities', count: 1 },
    { id: 'gaming', name: 'Gaming/Betting', count: 1 }
  ];

  const services = [
    {
      id: 'virtual-verify',
      name: 'Virtual Verify Number',
      description: 'WhatsApp & Telegram prioritized • 200+ services • Auto best provider',
      icon: Shield,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      category: 'verification',
      price: 'From ₦150',
      rating: 4.9,
      users: '15.2K',
      popular: true,
      onClick: () => setShowVirtualModal(true)
    },
    {
      id: 'airtime',
      name: 'Buy Airtime',
      description: 'Instant airtime top-up for all Nigerian networks (MTN, Airtel, Glo, 9mobile)',
      icon: Phone,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      category: 'telecom',
      price: 'From ₦100',
      rating: 4.8,
      users: '25.8K',
      popular: true,
      onClick: () => setShowAirtimeModal(true)
    },
    {
      id: 'data',
      name: 'Data Bundles',
      description: 'Purchase data bundles for all networks with competitive pricing',
      icon: Wifi,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      category: 'telecom',
      price: 'From ₦300',
      rating: 4.7,
      users: '18.5K',
      popular: true,
      onClick: () => setShowDataModal(true)
    },
    {
      id: 'cable',
      name: 'DSTV/GoTV/StarTimes',
      description: 'Pay for cable TV subscriptions and renew your packages instantly',
      icon: Tv,
      color: 'bg-red-500',
      textColor: 'text-red-500',
      category: 'entertainment',
      price: 'From ₦1,100',
      rating: 4.6,
      users: '12.3K',
      popular: false,
      onClick: () => setShowCableTVModal(true)
    },
    {
      id: 'betting',
      name: 'Betting Wallet',
      description: 'Fund your betting accounts on popular platforms like Bet9ja, SportyBet',
      icon: Gamepad2,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      category: 'gaming',
      price: 'From ₦500',
      rating: 4.5,
      users: '8.7K',
      popular: false,
      onClick: () => setShowBettingModal(true)
    },
    {
      id: 'electricity',
      name: 'Electricity Bills',
      description: 'Pay electricity bills for all major Nigerian power distribution companies',
      icon: Zap,
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      category: 'utilities',
      price: 'From ₦1,000',
      rating: 4.4,
      users: '9.2K',
      popular: false,
      onClick: () => setShowElectricityModal(true)
    },
    {
      id: 'recharge',
      name: 'Recharge Cards',
      description: 'Generate and download recharge cards for all networks instantly',
      icon: CreditCard,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      category: 'telecom',
      price: 'From ₦100',
      rating: 4.3,
      users: '5.1K',
      popular: false,
      onClick: () => setShowRechargeModal(true)
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case 'rating':
        return b.rating - a.rating;
      case 'users':
        return parseFloat(b.users.replace('K', '')) - parseFloat(a.users.replace('K', ''));
      default: // popularity
        return b.popular ? 1 : -1;
    }
  });

  return (
    <div className={`p-4 space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>All Services</h1>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>Complete VTU and verification services</p>
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
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="popularity">Most Popular</option>
              <option value="price">Lowest Price</option>
              <option value="rating">Highest Rated</option>
              <option value="users">Most Users</option>
            </select>
          </div>
          
          <div className={`flex rounded-lg p-1 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? isDark ? 'bg-gray-600 text-white' : 'bg-white shadow-sm text-gray-900'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? isDark ? 'bg-gray-600 text-white' : 'bg-white shadow-sm text-gray-900'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-1 opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <div>
              <p className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>4.7</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Avg Rating</p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-500" />
            <div>
              <p className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>95K+</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-3'}>
        {sortedServices.map((service) => {
          const Icon = service.icon;
          
          if (viewMode === 'list') {
            return (
              <button
                key={service.id}
                onClick={service.onClick}
                className={`w-full p-4 rounded-xl border transition-all duration-200 hover:shadow-md active:scale-95 text-left ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                    : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${service.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${service.textColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{service.name}</h3>
                      {service.popular && (
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{service.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-green-600 font-semibold text-sm">{service.price}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>{service.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>{service.users}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </button>
            );
          }

          return (
            <button
              key={service.id}
              onClick={service.onClick}
              className={`w-full rounded-2xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md active:scale-95 text-left ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                  : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${service.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${service.textColor}`} />
                </div>
                <div className="flex items-center space-x-2">
                  {service.popular && (
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  )}
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            
              <h3 className={`font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{service.name}</h3>
              <p className={`text-sm mb-3 leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{service.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold">{service.price}</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{service.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{service.users}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* No Results */}
      {sortedServices.length === 0 && (
        <div className="text-center py-12">
          <Settings className={`h-12 w-12 mx-auto mb-4 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>No services found</h3>
          <p className={`${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* All Modals */}
      <VirtualNumberModal 
        isOpen={showVirtualModal} 
        onClose={() => setShowVirtualModal(false)} 
      />
      <AirtimeModal 
        isOpen={showAirtimeModal} 
        onClose={() => setShowAirtimeModal(false)} 
      />
      <DataBundleModal 
        isOpen={showDataModal} 
        onClose={() => setShowDataModal(false)} 
      />
      <CableTVModal 
        isOpen={showCableTVModal} 
        onClose={() => setShowCableTVModal(false)} 
      />
      <BettingModal 
        isOpen={showBettingModal} 
        onClose={() => setShowBettingModal(false)} 
      />
      <RechargeCardModal 
        isOpen={showRechargeModal} 
        onClose={() => setShowRechargeModal(false)} 
      />
      <ElectricityModal 
        isOpen={showElectricityModal} 
        onClose={() => setShowElectricityModal(false)} 
      />
    </div>
  );
};

export default Services;