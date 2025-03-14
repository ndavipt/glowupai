import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, User, Users, TrendingUp, BarChart2, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Component to display stats for the compare account
const CompareAccountStats = ({ username }) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles/current/${username}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setAccountData(data);
      } catch (error) {
        console.error(`Error fetching data for ${username}:`, error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  if (!accountData) return <div className="text-center p-4">No data available</div>;

  return (
    <>
      <div className="flex justify-between text-sm mb-1">
        <span>Followers:</span>
        <span className="font-medium">{accountData.follower_count.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Name:</span>
        <span className="font-medium">{accountData.full_name}</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Last Updated:</span>
        <span className="font-medium">{new Date(accountData.checked_at).toLocaleString()}</span>
      </div>
      {accountData.biography && (
        <div className="mt-2 text-sm">
          <p className="text-gray-500 line-clamp-2">{accountData.biography}</p>
        </div>
      )}
    </>
  );
};

// Component to display a comparison chart
const ComparisonChart = ({ account1, account2 }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using the compare endpoint
        const response = await fetch(`${API_BASE_URL}/analytics/compare?account1=${account1}&account2=${account2}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setComparisonData(data);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account1, account2]);

  if (loading) return <div className="flex justify-center items-center h-full">Loading comparison data...</div>;
  if (error) return <div className="text-center text-red-500">Error loading comparison: {error}</div>;
  if (!comparisonData) return <div className="text-center">No comparison data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={comparisonData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={account1} 
          name={`@${account1}`}
          stroke="#8884d8" 
        />
        <Line 
          type="monotone" 
          dataKey={account2} 
          name={`@${account2}`}
          stroke="#82ca9d" 
        />
      </LineChart>
    </ResponsiveContainer>
  )
};

// API base URL - you can change this to your API's base URL
const API_BASE_URL = 'https://logic-service.onrender.com/api/v1';

const InstagramFollowerTracker = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [profileData, setProfileData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [changesData, setChangesData] = useState([]);
  const [growthData, setGrowthData] = useState(null);
  const [rollingAverages, setRollingAverages] = useState([]);
  const [compareAccount, setCompareAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/accounts/`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    
    fetchAccounts();
  }, []);

  const fetchProfileData = async (username) => {
    if (!username) return;
    
    setIsLoading(true);
    
    try {
      // Fetch current profile data
      const profileResponse = await fetch(`${API_BASE_URL}/profiles/current/${username}`);
      if (!profileResponse.ok) {
        throw new Error(`API error: ${profileResponse.status}`);
      }
      const profileData = await profileResponse.json();
      setProfileData(profileData);
      
      // Fetch historical data
      const historyResponse = await fetch(`${API_BASE_URL}/profiles/history/${username}`);
      if (!historyResponse.ok) {
        throw new Error(`API error: ${historyResponse.status}`);
      }
      const historyData = await historyResponse.json();
      setHistoricalData(historyData);
      
      // Fetch changes data
      const changesResponse = await fetch(`${API_BASE_URL}/analytics/changes/${username}`);
      if (!changesResponse.ok) {
        throw new Error(`API error: ${changesResponse.status}`);
      }
      const changesData = await changesResponse.json();
      setChangesData(changesData);
      
      // Fetch growth metrics
      const growthResponse = await fetch(`${API_BASE_URL}/analytics/growth/${username}`);
      if (!growthResponse.ok) {
        throw new Error(`API error: ${growthResponse.status}`);
      }
      const growthData = await growthResponse.json();
      setGrowthData(growthData);
      
      // Fetch rolling averages
      const rollingResponse = await fetch(`${API_BASE_URL}/analytics/rolling-average/${username}`);
      if (!rollingResponse.ok) {
        throw new Error(`API error: ${rollingResponse.status}`);
      }
      const rollingData = await rollingResponse.json();
      setRollingAverages(rollingData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = (username) => {
    setSelectedAccount(username);
    fetchProfileData(username);
    setCurrentView('profile');
  };

  const handleCompareSelect = (username) => {
    setCompareAccount(username);
  };

  const [error, setError] = useState(null);

  // Error handling function for API calls
  const handleApiError = (error, source) => {
    console.error(`Error in ${source}:`, error);
    setError(`Failed to fetch data from ${source}: ${error.message}`);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Instagram Follower Tracker</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setCurrentView('dashboard');
                setError(null);
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md transition-all"
            >
              Dashboard
            </button>
            {selectedAccount && (
              <button 
                onClick={() => {
                  setCurrentView('profile');
                  setError(null);
                }}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md transition-all"
              >
                Profile
              </button>
            )}
            <button 
              onClick={() => {
                setCurrentView('compare');
                setError(null);
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md transition-all"
            >
              Compare
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto flex-grow p-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading data...</div>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-3">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Select an Account</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {accounts.map(account => (
                        <div 
                          key={account.username} 
                          className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all ${account.status !== 'active' ? 'opacity-60' : ''}`}
                          onClick={() => handleAccountSelect(account.username)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                              <User size={30} className="text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">@{account.username}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${account.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <p className="text-sm text-gray-500 capitalize">{account.status}</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                Added {new Date(account.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'profile' && selectedAccount && profileData && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                        {profileData.profile_pic_url ? (
                          <img src={profileData.profile_pic_url} alt={profileData.full_name || selectedAccount} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={40} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">@{selectedAccount}</h2>
                        <p className="text-gray-500">{profileData.full_name || 'Instagram Account'}</p>
                        {profileData.biography && (
                          <p className="text-sm text-gray-500 mt-1 max-w-md line-clamp-2">{profileData.biography}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Followers</p>
                        <p className="text-xl font-bold">{profileData.follower_count.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium">{new Date(profileData.checked_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Metrics */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="mr-2 text-purple-500" size={20} />
                    Recent Growth
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${growthData.change_12h.change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="text-sm text-gray-500">12 Hour Change</p>
                      <div className="flex items-center">
                        <p className={`text-xl font-bold ${growthData.change_12h.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growthData.change_12h.change >= 0 ? '+' : ''}{growthData.change_12h.change}
                        </p>
                        {growthData.change_12h.change >= 0 ? 
                          <ArrowUpRight className="ml-1 text-green-600" size={18} /> : 
                          <ArrowDownRight className="ml-1 text-red-600" size={18} />
                        }
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {growthData.change_12h.percentage.toFixed(2)}% over {growthData.change_12h.hours_actual.toFixed(1)} hours
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${growthData.change_24h.change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="text-sm text-gray-500">24 Hour Change</p>
                      <div className="flex items-center">
                        <p className={`text-xl font-bold ${growthData.change_24h.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growthData.change_24h.change >= 0 ? '+' : ''}{growthData.change_24h.change}
                        </p>
                        {growthData.change_24h.change >= 0 ? 
                          <ArrowUpRight className="ml-1 text-green-600" size={18} /> : 
                          <ArrowDownRight className="ml-1 text-red-600" size={18} />
                        }
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {growthData.change_24h.percentage.toFixed(2)}% in last 24 hours
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50">
                      <p className="text-sm text-gray-500">Overall Growth</p>
                      <p className="text-xl font-bold text-purple-600">
                        {growthData.percentage_growth.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        +{growthData.net_growth} followers ({growthData.average_daily_growth.toFixed(1)}/day)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Historical Data */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart2 className="mr-2 text-purple-500" size={20} />
                    Follower History
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={historicalData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="followers" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Follower Changes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="mr-2 text-purple-500" size={20} />
                    Follower Changes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-1">Current Followers</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {changesData.current_followers.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-1">Data Points</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {changesData.data_points}
                      </p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={changesData.changes_between_scrapes}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth()+1}/${date.getDate()}`;
                        }} />
                        <YAxis />
                        <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <Legend />
                        <Bar dataKey="change" fill="#8884d8" name="Follower Change" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Rolling Average */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <RefreshCw className="mr-2 text-purple-500" size={20} />
                    7-Day Rolling Average
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Average Change</p>
                      <p className="text-xl font-bold text-purple-600">
                        {rollingAverages.rolling_avg_7day.average_change.toFixed(1)}/day
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Total Change</p>
                      <p className="text-xl font-bold text-purple-600">
                        {rollingAverages.rolling_avg_7day.total_change.toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Period</p>
                      <p className="text-sm font-medium">
                        {new Date(rollingAverages.rolling_avg_7day.from_date).toLocaleDateString()} - 
                        {new Date(rollingAverages.rolling_avg_7day.to_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'compare' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Compare Accounts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Account
                      </label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={selectedAccount || ''}
                        onChange={(e) => handleAccountSelect(e.target.value)}
                      >
                        <option value="">Select an account</option>
                        {accounts.map(account => (
                          <option key={account.username} value={account.username}>
                            @{account.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Second Account
                      </label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={compareAccount || ''}
                        onChange={(e) => handleCompareSelect(e.target.value)}
                      >
                        <option value="">Select an account</option>
                        {accounts.map(account => (
                          account.username !== selectedAccount && (
                            <option key={account.username} value={account.username}>
                              @{account.username}
                            </option>
                          )
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {selectedAccount && compareAccount && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">@{selectedAccount}</h4>
                          {profileData && (
                            <>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Followers:</span>
                                <span className="font-medium">{profileData.followers.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Following:</span>
                                <span className="font-medium">{profileData.following.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Posts:</span>
                                <span className="font-medium">{profileData.posts.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">@{compareAccount}</h4>
                          <CompareAccountStats username={compareAccount} />
                        </div>
                      </div>
                      
                      <div className="h-64 border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Follower Comparison</h4>
                        <ComparisonChart account1={selectedAccount} account2={compareAccount} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center text-sm">
          <p>Instagram Follower Tracker - API Testing Frontend</p>
        </div>
      </footer>
    </div>
  );
};

export default InstagramFollowerTracker;