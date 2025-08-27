import React, { useState } from 'react';
import { Search, Filter, Grid3X3, List, ArrowLeft, Star, TrendingUp, DollarSign } from 'lucide-react';
import ServiceGrid from './ServiceGrid';
import ProviderFilter from './ProviderFilter';

interface ServicesPageProps {
  setCurrentPage: (page: 'home' | 'services') => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');

  const categories = [
    { id: 'all', name: 'All Services', count: 200 },
    { id: 'social', name: 'Social Media', count: 45 },
    { id: 'messaging', name: 'Messaging', count: 25 },
    { id: 'shopping', name: 'Shopping', count: 30 },
    { id: 'finance', name: 'Financial', count: 20 },
    { id: 'dating', name: 'Dating', count: 15 },
    { id: 'delivery', name: 'Delivery', count: 18 },
    { id: 'gaming', name: 'Gaming', count: 22 },
    { id: 'crypto', name: 'Crypto', count: 25 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Quick Verify</span>
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Professional Services</h1>
        <p className="text-gray-600">Advanced SMS verification with detailed provider options and bulk services</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        {/* Search and View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="price">Lowest Price</option>
              <option value="availability">Best Availability</option>
              <option value="success">Success Rate</option>
            </select>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Provider Filter */}
        <ProviderFilter
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <Star className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">99.2%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">15.2K</p>
              <p className="text-sm text-gray-500">Available Numbers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">₦100</p>
              <p className="text-sm text-gray-500">Starting From</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <Filter className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">200+</p>
              <p className="text-sm text-gray-500">Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Grid */}
      <ServiceGrid
        searchTerm={searchTerm}
        selectedProvider={selectedProvider}
        selectedCategory={selectedCategory}
        viewMode={viewMode}
        sortBy={sortBy}
      />
    </div>
  );
};

export default ServicesPage;