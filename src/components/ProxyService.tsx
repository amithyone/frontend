import React, { useState } from 'react';
import { useProxy } from '../hooks/useProxy';
import { 
  Shield, 
  Download, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Activity, 
  Settings, 
  CreditCard,
  Globe,
  Wifi,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const ProxyService: React.FC = () => {
  const {
    profile,
    profileLoading,
    proxyList,
    proxyListLoading,
    stats,
    statsLoading,
    plans,
    plansLoading,
    config,
    configLoading,
    ipAuthorizations,
    ipAuthorizationsLoading,
    activities,
    activitiesLoading,
    fetchProxyList,
    fetchStats,
    fetchActivities,
    downloadProxyList,
    refreshProxyList,
    createIpAuthorization,
    deleteIpAuthorization,
    getMyIp,
    downloadActivities,
    purchasePlan
  } = useProxy();

  const [activeTab, setActiveTab] = useState('overview');
  const [newIp, setNewIp] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const handleCreateIpAuthorization = async () => {
    if (!newIp.trim()) return;
    try {
      await createIpAuthorization(newIp);
      setNewIp('');
    } catch (error) {
      console.error('Failed to create IP authorization:', error);
    }
  };

  const handlePurchasePlan = async () => {
    if (!selectedPlan) return;
    setPurchaseLoading(true);
    try {
      await purchasePlan({
        plan_id: selectedPlan,
        payment_method: 'balance'
      });
      setSelectedPlan('');
    } catch (error) {
      console.error('Failed to purchase plan:', error);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'proxies', label: 'Proxy List', icon: Wifi },
    { id: 'plans', label: 'Plans', icon: CreditCard },
    { id: 'authorizations', label: 'IP Auth', icon: Shield },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'config', label: 'Config', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Account Profile</h3>
        {profileLoading ? (
          <div className="animate-pulse">Loading profile...</div>
        ) : profile ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium">{profile.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">
                {profile.is_active ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    Inactive
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-600">Failed to load profile</p>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        {statsLoading ? (
          <div className="animate-pulse">Loading statistics...</div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_proxies}</div>
              <div className="text-sm text-gray-600">Total Proxies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active_proxies}</div>
              <div className="text-sm text-gray-600">Active Proxies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.total_requests}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.success_rate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        ) : (
          <p className="text-red-600">Failed to load statistics</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => fetchProxyList()}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <Wifi className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm">View Proxies</span>
          </button>
          <button
            onClick={() => fetchStats()}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm">Refresh Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <CreditCard className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm">View Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <Settings className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm">Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProxyList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Proxy List</h3>
        <div className="space-x-2">
          <button
            onClick={() => fetchProxyList()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={() => downloadProxyList()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Download
          </button>
        </div>
      </div>

      {proxyListLoading ? (
        <div className="animate-pulse">Loading proxy list...</div>
      ) : proxyList ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proxy Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proxyList.results.map((proxy) => (
                  <tr key={proxy.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{proxy.proxy_address}</div>
                      <div className="text-sm text-gray-500">{proxy.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        HTTP: {proxy.ports.http}
                      </div>
                      <div className="text-sm text-gray-500">
                        HTTPS: {proxy.ports.https}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proxy.country}</div>
                      <div className="text-sm text-gray-500">{proxy.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {proxy.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(proxy.last_used).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-red-600">Failed to load proxy list</p>
      )}
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Subscription Plans</h3>
        <button
          onClick={() => fetchPlans()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {plansLoading ? (
        <div className="animate-pulse">Loading plans...</div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow p-6 border-2 hover:border-blue-500 transition-colors">
              {plan.is_popular && (
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  POPULAR
                </div>
              )}
              <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ${plan.price}
                <span className="text-sm text-gray-500 font-normal">/{plan.currency}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  {plan.proxy_count} Proxies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  {plan.bandwidth_limit}GB Bandwidth
                </li>
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setSelectedPlan(plan.id);
                  handlePurchasePlan();
                }}
                disabled={purchaseLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {purchaseLoading ? 'Processing...' : 'Purchase Plan'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-600">No plans available</p>
      )}
    </div>
  );

  const renderAuthorizations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">IP Authorizations</h3>
        <button
          onClick={() => fetchIpAuthorizations()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Add New IP */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-md font-semibold mb-4">Add New IP Authorization</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="Enter IP address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateIpAuthorization}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* IP List */}
      {ipAuthorizationsLoading ? (
        <div className="animate-pulse">Loading IP authorizations...</div>
      ) : ipAuthorizations.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ipAuthorizations.map((auth) => (
                <tr key={auth.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {auth.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {auth.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(auth.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteIpAuthorization(auth.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No IP authorizations found</p>
      )}
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Proxy Activities</h3>
        <div className="space-x-2">
          <button
            onClick={() => fetchActivities()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={() => downloadActivities()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Download
          </button>
        </div>
      </div>

      {activitiesLoading ? (
        <div className="animate-pulse">Loading activities...</div>
      ) : activities.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Transfer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {activity.target_url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.status === 'success' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ↑ {activity.bytes_sent} / ↓ {activity.bytes_received}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No activities found</p>
      )}
    </div>
  );

  const renderConfig = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Proxy Configuration</h3>
        <button
          onClick={() => fetchConfig()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {configLoading ? (
        <div className="animate-pulse">Loading configuration...</div>
      ) : config ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold mb-4">Connection Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Proxy Address</label>
                  <input
                    type="text"
                    value={config.proxy_address}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={config.username}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={config.password}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Port Configuration</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">HTTP Port</label>
                  <input
                    type="number"
                    value={config.ports.http}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">HTTPS Port</label>
                  <input
                    type="number"
                    value={config.ports.https}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SOCKS5 Port</label>
                  <input
                    type="number"
                    value={config.ports.socks5}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-600">Failed to load configuration</p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Proxy Services</h1>
        <p className="mt-2 text-gray-600">Manage your Webshare proxy services</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'proxies' && renderProxyList()}
        {activeTab === 'plans' && renderPlans()}
        {activeTab === 'authorizations' && renderAuthorizations()}
        {activeTab === 'activities' && renderActivities()}
        {activeTab === 'config' && renderConfig()}
      </div>
    </div>
  );
};

export default ProxyService;
