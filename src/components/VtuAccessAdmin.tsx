import React, { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle, AlertCircle, Users, Shield, X, Calendar } from 'lucide-react';
import { apiService } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  vtu_access_enabled: boolean;
  vtu_access_reason: string | null;
  vtu_access_disabled_at: string | null;
  vtu_access_disabled_by: number | null;
  created_at: string;
}

interface Stats {
  total_users: number;
  enabled_users: number;
  disabled_users: number;
  recently_disabled: User[];
}

const VtuAccessAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    loadStats();
    loadUsers();
  }, [statusFilter, currentPage]);

  const loadStats = async () => {
    try {
      const response = await apiService.get('/admin/vtu-access/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', currentPage.toString());
      params.append('per_page', '50');

      const response = await apiService.get(`/admin/vtu-access/users?${params.toString()}`);
      if (response.success && response.data) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleDisableAccess = async () => {
    if (!selectedUser || !disableReason.trim()) {
      alert('Please provide a reason for disabling VTU access');
      return;
    }

    try {
      const response = await apiService.post(`/admin/vtu-access/${selectedUser.id}/disable`, {
        reason: disableReason
      });

      if (response.success) {
        alert('VTU access disabled successfully');
        setShowDisableModal(false);
        setSelectedUser(null);
        setDisableReason('');
        loadUsers();
        loadStats();
      } else {
        alert('Failed to disable VTU access: ' + response.message);
      }
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to disable VTU access'));
    }
  };

  const handleEnableAccess = async (user: User) => {
    if (!confirm(`Enable VTU access for ${user.email}?`)) return;

    try {
      const response = await apiService.post(`/admin/vtu-access/${user.id}/enable`, {});
      
      if (response.success) {
        alert('VTU access enabled successfully');
        loadUsers();
        loadStats();
      } else {
        alert('Failed to enable VTU access: ' + response.message);
      }
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to enable VTU access'));
    }
  };

  const openDisableModal = (user: User) => {
    setSelectedUser(user);
    setShowDisableModal(true);
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-500" />
          VTU Access Management
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Manage user access to VTU services (Airtime, Data, Electricity, Cable TV)
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats.total_users.toLocaleString()}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>VTU Access Enabled</p>
                <p className="text-3xl font-bold mt-1 text-green-500">{stats.enabled_users.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>

          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>VTU Access Disabled</p>
                <p className="text-3xl font-bold mt-1 text-red-500">{stats.disabled_users.toLocaleString()}</p>
              </div>
              <Ban className="w-12 h-12 text-red-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by email, name, or phone..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`w-full px-4 py-2 border rounded-lg ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Users</option>
              <option value="enabled">Enabled Only</option>
              <option value="disabled">Disabled Only</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Users Table */}
      <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">VTU Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className={isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{user.name || 'Unknown'}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</div>
                        {user.phone && (
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{user.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">₦{user.balance.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      {user.vtu_access_enabled ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Enabled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <Ban className="w-4 h-4" />
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.vtu_access_reason ? (
                        <div>
                          <div className="text-sm">{user.vtu_access_reason}</div>
                          {user.vtu_access_disabled_at && (
                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1 mt-1`}>
                              <Calendar className="w-3 h-3" />
                              {new Date(user.vtu_access_disabled_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.vtu_access_enabled ? (
                          <button
                            onClick={() => openDisableModal(user)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                          >
                            <Ban className="w-4 h-4" />
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnableAccess(user)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Enable
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Disable VTU Access Modal */}
      {showDisableModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Ban className="w-6 h-6 text-red-500" />
                  Disable VTU Access
                </h2>
                <button
                  onClick={() => {
                    setShowDisableModal(false);
                    setSelectedUser(null);
                    setDisableReason('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  You are about to disable VTU services access for:
                </p>
                <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-gray-500">{selectedUser.email}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reason for Disabling <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  placeholder="E.g., Suspicious activity, fraud, policy violation..."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDisableAccess}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Disable Access
                </button>
                <button
                  onClick={() => {
                    setShowDisableModal(false);
                    setSelectedUser(null);
                    setDisableReason('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VtuAccessAdmin;

