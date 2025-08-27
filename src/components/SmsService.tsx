import React, { useState } from 'react';
import { useSms } from '../hooks/useSms';

interface SmsServiceProps {
  onOrderCreated?: (order: any) => void;
}

export const SmsService: React.FC<SmsServiceProps> = ({ onOrderCreated }) => {
  const {
    countries,
    services,
    providers,
    loadingCountries,
    loadingServices,
    loadingProviders,
    createOrder,
    fetchServices,
    fetchProviders
  } = useSms();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle country selection
  const handleCountryChange = async (country: string) => {
    setSelectedCountry(country);
    setSelectedService('');
    if (country) {
      await fetchServices(country);
    }
  };

  // Handle service selection
  const handleServiceChange = (service: string) => {
    setSelectedService(service);
  };

  // Handle mode change
  const handleModeChange = (newMode: 'auto' | 'manual') => {
    setMode(newMode);
    setSelectedProvider('');
    if (newMode === 'manual') {
      fetchProviders();
    }
  };

  // Handle provider selection (manual mode only)
  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
  };

  // Create SMS order
  const handleCreateOrder = async () => {
    if (!selectedCountry || !selectedService) {
      setError('Please select a country and service');
      return;
    }

    if (mode === 'manual' && !selectedProvider) {
      setError('Please select a provider for manual mode');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await createOrder(
        selectedCountry,
        selectedService,
        mode,
        mode === 'manual' ? selectedProvider : undefined
      );

      // Reset form
      setSelectedCountry('');
      setSelectedService('');
      setSelectedProvider('');
      setMode('auto');

      // Notify parent component
      if (onOrderCreated) {
        onOrderCreated(order);
      }

      // Show success message
      alert(`Order created successfully! Phone: ${order.phone_number} (${order.provider_name})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">SMS Verification Service</h2>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Mode
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="auto"
              checked={mode === 'auto'}
              onChange={() => handleModeChange('auto')}
              className="mr-2"
            />
            <span className="text-sm">Auto (Best Provider)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="manual"
              checked={mode === 'manual'}
              onChange={() => handleModeChange('manual')}
              className="mr-2"
            />
            <span className="text-sm">Manual (Choose Provider)</span>
          </label>
        </div>
      </div>

      {/* Country Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loadingCountries}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        {loadingCountries && <p className="text-sm text-gray-500 mt-1">Loading countries...</p>}
      </div>

      {/* Service Selection */}
      {selectedCountry && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service
          </label>
          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingServices}
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.service} value={service.service}>
                {service.name} - ₦{service.cost}
              </option>
            ))}
          </select>
          {loadingServices && <p className="text-sm text-gray-500 mt-1">Loading services...</p>}
        </div>
      )}

      {/* Provider Selection (Manual Mode Only) */}
      {mode === 'manual' && selectedCountry && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingProviders}
          >
            <option value="">Select Provider</option>
            {providers.map((provider) => (
              <option key={provider.provider} value={provider.provider}>
                {provider.display_name}
              </option>
            ))}
          </select>
          {loadingProviders && <p className="text-sm text-gray-500 mt-1">Loading providers...</p>}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Create Order Button */}
      <button
        onClick={handleCreateOrder}
        disabled={loading || !selectedCountry || !selectedService || (mode === 'manual' && !selectedProvider)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Order...' : 'Get SMS Number'}
      </button>

      {/* Mode Information */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          {mode === 'auto' ? 'Auto Mode' : 'Manual Mode'}
        </h3>
        <p className="text-xs text-gray-600">
          {mode === 'auto' 
            ? 'Automatically selects the best available provider based on success rate and availability.'
            : 'You choose the specific SMS provider. Select from available providers with their success rates.'
          }
        </p>
      </div>
    </div>
  );
};
