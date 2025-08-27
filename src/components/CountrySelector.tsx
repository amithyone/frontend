import React from 'react';
import { Globe } from 'lucide-react';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onCountryChange }) => {
  const countries = [
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', popular: true },
    { code: 'US', name: 'United States', flag: '🇺🇸', popular: true },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', popular: true },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', popular: true },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', popular: false },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', popular: false },
    { code: 'FR', name: 'France', flag: '🇫🇷', popular: false },
    { code: 'IN', name: 'India', flag: '🇮🇳', popular: true },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', popular: false },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', popular: false }
  ];

  const popularCountries = countries.filter(country => country.popular);
  const otherCountries = countries.filter(country => !country.popular);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Globe className="h-4 w-4 inline mr-1" />
        Select Country
      </label>
      
      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
      >
        <optgroup label="Popular Countries">
          {popularCountries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Other Countries">
          {otherCountries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

export default CountrySelector;