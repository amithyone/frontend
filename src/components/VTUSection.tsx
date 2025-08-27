import React, { useState } from 'react';
import { Smartphone, Zap, CreditCard, Wifi, Tv, ArrowRight } from 'lucide-react';

const VTUSection: React.FC = () => {
  const [selectedVTUService, setSelectedVTUService] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const vtuServices = [
    {
      id: 'airtime',
      name: 'Airtime',
      icon: Smartphone,
      color: 'bg-green-500',
      description: 'All Nigerian networks'
    },
    {
      id: 'data',
      name: 'Data',
      icon: Wifi,
      color: 'bg-blue-500',
      description: 'MTN, Airtel, Glo, 9mobile'
    },
    {
      id: 'electricity',
      name: 'Electricity',
      icon: Zap,
      color: 'bg-yellow-500',
      description: 'PHCN, EKEDC, IKEDC'
    },
    {
      id: 'cable',
      name: 'Cable TV',
      icon: Tv,
      color: 'bg-purple-500',
      description: 'DStv, GOtv, Startimes'
    }
  ];

  const handleVTUPurchase = () => {
    if (!selectedVTUService || !amount || !phoneNumber) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Processing ${selectedVTUService} purchase of ₦${amount} for ${phoneNumber}...`);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nigerian VTU Services</h2>
        <p className="text-gray-600">Buy airtime, data, pay electricity bills and cable TV subscriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {vtuServices.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => setSelectedVTUService(service.id)}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
                selectedVTUService === service.id
                  ? 'bg-white border-2 border-green-500 shadow-lg'
                  : 'bg-white border border-gray-200 hover:shadow-md'
              }`}
            >
              <div className={`p-3 rounded-lg ${service.color} w-fit mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          );
        })}
      </div>

      {selectedVTUService && (
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Purchase {vtuServices.find(s => s.id === selectedVTUService)?.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleVTUPurchase}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <CreditCard className="h-5 w-5" />
            <span>Purchase Now</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VTUSection;