import React, { useEffect, useState } from 'react';
// import { API_SMS_URL } from '../services/api';
import { smsApiService } from '../services/smsApi';
import { SmsService } from '../services/smsApi';

const ServicesTest: React.FC = () => {
  const [services, setServices] = useState<SmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await smsApiService.getServices();
        setServices(data);
        console.log('Services fetched:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue-dark flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue-dark p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          SMS Services Test - Backend Integration
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                <span className="text-2xl font-bold text-blue-400">${service.cost}</span>
              </div>
              
              {service.description && (
                <p className="text-gray-300 mb-4">{service.description}</p>
              )}
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Service ID:</span>
                  <span className="text-blue-300">{service.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="text-blue-300">{service.provider_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="text-green-400">{service.success_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    service.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">API Response Summary</h3>
            <div className="text-left text-sm text-gray-300 space-y-2">
              <div><strong>Total Services:</strong> {services.length}</div>
              <div><strong>Backend URL:</strong> https://api.fadsms.com/api/services</div>
              <div><strong>Data Source:</strong> Laravel Backend</div>
              <div><strong>Last Updated:</strong> {new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesTest;
