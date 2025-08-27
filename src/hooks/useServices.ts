import { useState, useEffect } from 'react';
import { apiService, Service, ApiResponse } from '../services/api';

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  refreshServices: () => Promise<void>;
  createService: (serviceData: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: number, serviceData: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Service[]> = await apiService.getServices();
      
      if (response.status === 'success' && response.data) {
        setServices(response.data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      setError(null);
      const response: ApiResponse<Service> = await apiService.createService(serviceData);
      
      if (response.status === 'success' && response.data) {
        setServices(prev => [...prev, response.data!]);
      } else {
        setError('Failed to create service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateService = async (id: number, serviceData: Partial<Service>) => {
    try {
      setError(null);
      const response: ApiResponse<Service> = await apiService.updateService(id, serviceData);
      
      if (response.status === 'success' && response.data) {
        setServices(prev => 
          prev.map(service => 
            service.id === id ? response.data! : service
          )
        );
      } else {
        setError('Failed to update service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteService = async (id: number) => {
    try {
      setError(null);
      const response: ApiResponse<any> = await apiService.deleteService(id);
      
      if (response.status === 'success') {
        setServices(prev => prev.filter(service => service.id !== id));
      } else {
        setError('Failed to delete service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refreshServices: fetchServices,
    createService,
    updateService,
    deleteService,
  };
};
