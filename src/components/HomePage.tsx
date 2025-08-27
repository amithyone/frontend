import React, { useState } from 'react';
import { MessageCircle, Send, Instagram, Facebook, Twitter, Globe, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import CountrySelector from './CountrySelector';
import ServiceCard from './ServiceCard';
import VTUSection from './VTUSection';

interface HomePageProps {
  setCurrentPage: (page: 'home' | 'services') => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const popularServices = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      price: '₦150',
      available: 1250,
      color: 'bg-green-500',
      description: 'Most popular messaging app verification'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      price: '₦120',
      available: 980,
      color: 'bg-blue-500',
      description: 'Secure messaging platform verification'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      price: '₦200',
      available: 750,
      color: 'bg-pink-500',
      description: 'Social media platform verification'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      price: '₦180',
      available: 650,
      color: 'bg-blue-600',
      description: 'Social network verification'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      price: '₦170',
      available: 420,
      color: 'bg-black',
      description: 'Social media verification'
    },
    {
      id: 'other',
      name: 'Other Services',
      icon: Globe,
      price: 'From ₦100',
      available: 2500,
      color: 'bg-purple-500',
      description: '200+ other platforms available'
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleGetNumber = () => {
    // In a real app, this would make an API call
    alert(`Getting ${selectedService} number for ${selectedCountry}...`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Get SMS Verification
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Instantly</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Verify any service in seconds with our reliable SMS reception. Nigerian VTU services included for seamless top-ups.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Instant Delivery</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">99.9% Success Rate</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Quick Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Your Service</h2>
        
        <div className="mb-6">
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {popularServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedService === service.id}
              onSelect={handleServiceSelect}
            />
          ))}
        </div>

        {selectedService && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to get your number?</h3>
            <p className="text-gray-600 mb-4">
              Service: {popularServices.find(s => s.id === selectedService)?.name} | 
              Country: {selectedCountry === 'NG' ? ' Nigeria' : ' Selected Country'}
            </p>
            <button
              onClick={handleGetNumber}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Number Now
              <ArrowRight className="h-5 w-5 ml-2 inline" />
            </button>
          </div>
        )}
      </div>

      {/* VTU Section */}
      <VTUSection />

      {/* Advanced Options */}
      <div className="text-center bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Need More Options?</h3>
        <p className="text-gray-600 mb-6">
          Access 200+ services, bulk purchases, API integration, and advanced provider selection.
        </p>
        <button
          onClick={() => setCurrentPage('services')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          Go to Pro Services
        </button>
      </div>
    </div>
  );
};

export default HomePage;