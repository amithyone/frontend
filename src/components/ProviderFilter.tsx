import React from 'react';
import { Server, Star, TrendingUp, DollarSign } from 'lucide-react';

interface ProviderFilterProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
}

const ProviderFilter: React.FC<ProviderFilterProps> = ({ selectedProvider, onProviderChange }) => {
  const providers = [
    { 
      id: 'all', 
      name: 'All Providers', 
      icon: Server, 
      count: 12,
      description: 'Best overall selection'
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      icon: Star, 
      count: 3,
      description: 'Highest success rates'
    },
    { 
      id: 'popular', 
      name: 'Most Popular', 
      icon: TrendingUp, 
      count: 5,
      description: 'Community favorites'
    },
    { 
      id: 'budget', 
      name: 'Budget Friendly', 
      icon: DollarSign, 
      count: 4,
      description: 'Best value options'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        <Server className="h-4 w-4 inline mr-1" />
        Provider Type
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <button
              key={provider.id}
              onClick={() => onProviderChange(provider.id)}
              className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                selectedProvider === provider.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{provider.name}</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  {provider.count}
                </span>
              </div>
              <p className="text-xs opacity-75">{provider.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderFilter;