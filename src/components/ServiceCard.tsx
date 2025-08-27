import React from 'react';
import { DivideIcon as LucideIcon, Users, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: LucideIcon;
  price: string;
  available: number;
  color: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => {
  const Icon = service.icon;

  return (
    <div
      onClick={() => onSelect(service.id)}
      className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
        isSelected
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg'
          : 'bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300'
      }`}
    >
      {isSelected && (
        <CheckCircle className="absolute top-4 right-4 h-6 w-6 text-blue-600" />
      )}
      
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${service.color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{service.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{service.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-green-600">{service.price}</span>
              <div className="flex items-center space-x-1 text-gray-500">
                <Users className="h-4 w-4" />
                <span className="text-sm">{service.available}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;