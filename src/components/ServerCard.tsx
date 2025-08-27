import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Server, Wifi, Zap, Shield, Globe } from 'lucide-react';

const ServerCard: React.FC = () => {
  const { isDark } = useTheme();

  const serverStats = [
    { label: 'Active Servers', value: '6', icon: Server, color: 'text-blue-500' },
    { label: 'Success Rate', value: '99.2%', icon: Shield, color: 'text-green-500' },
    { label: 'Avg Speed', value: 'Fast', icon: Zap, color: 'text-orange-500' },
    { label: 'Countries', value: '8+', icon: Globe, color: 'text-purple-500' }
  ];

  const topServers = [
    { name: 'FaddedSMS Premium', country: '🇳🇬', status: 'online', reliability: 99.8 },
    { name: 'SMS-Activate', country: '🇷🇺', status: 'online', reliability: 98.5 },
    { name: '5SIM Global', country: '🌍', status: 'online', reliability: 97.2 }
  ];

  return (
    <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Server Network</h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-500 font-medium">All Systems Online</span>
        </div>
      </div>

      {/* Server Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {serverStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`p-3 rounded-xl ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <div>
                  <div className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{stat.value}</div>
                  <div className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Servers */}
      <div className="space-y-2">
        <h4 className={`text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>Top Performing Servers</h4>
        {topServers.map((server, index) => (
          <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{server.country}</span>
              <span className={`text-xs font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{server.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-500">{server.reliability}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-4 p-3 rounded-xl ${
        isDark ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'
      }`}>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          🌐 Multiple server options ensure 99.9% uptime and fastest SMS delivery
        </p>
      </div>
    </div>
  );
};

export default ServerCard;