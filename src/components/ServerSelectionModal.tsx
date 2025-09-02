import React, { useState, useEffect } from 'react';
import { X, Server, CheckCircle } from 'lucide-react';
import { smsApiService } from '../services/smsApi';

interface ServerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServerSelectionModal: React.FC<ServerSelectionModalProps> = ({ isOpen, onClose }) => {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadServers();
    }
  }, [isOpen]);

  const loadServers = async () => {
    try {
      setLoading(true);
      const data = await smsApiService.getServers();
      setServers(data);
    } catch (error) {
      console.error('Error loading servers:', error);
      // Fallback to mock servers
      setServers([
        {
          id: 1,
          name: 'Premium Server 1',
          success_rate: 98,
          total_orders: 1250,
          status: 'active',
          location: 'US East'
        },
        {
          id: 2,
          name: 'Standard Server 2',
          success_rate: 95,
          total_orders: 890,
          status: 'active',
          location: 'US West'
        },
        {
          id: 3,
          name: 'Budget Server 3',
          success_rate: 92,
          total_orders: 650,
          status: 'active',
          location: 'Europe'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleServerSelect = (server: any) => {
    setSelectedServer(server);
  };

  const handleConfirm = () => {
    if (selectedServer) {
      console.log('Selected server:', selectedServer);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Select Server</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white text-xl">Loading servers...</div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Available Servers</h3>
                <p className="text-gray-300 text-sm">
                  Choose your preferred SMS server for verification services
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedServer?.id === server.id
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                    onClick={() => handleServerSelect(server)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                          <Server className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{server.name}</h4>
                          <p className="text-white/60 text-sm">{server.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-400 text-sm mb-1">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {server.success_rate}% Success
                        </div>
                        <div className="text-white/50 text-xs">
                          {server.total_orders} orders
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedServer}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-all"
                >
                  Confirm Selection
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerSelectionModal;