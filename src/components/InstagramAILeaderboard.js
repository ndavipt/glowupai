import React, { useState, useEffect } from 'react';
import { Search, User, Users, RefreshCw, Info } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './InstagramAILeaderboard.css';

// API base URL
const API_BASE_URL = 'https://logic-service.onrender.com/api/v1';

// Enhanced mock data to match what we see in the screenshot
const MOCK_ACCOUNTS = [
  {
    username: 'nba',
    follower_count: 84200000,
    biography: 'No bio available',
    checked_at: new Date().toISOString(),
    growth_24h: { change: 0 },
    growth_12h: { change: 0 },
    rolling_avg_7day: { average_change: 0, total_change: 0 }
  },
  {
    username: 'kingjames',
    follower_count: 157000000,
    biography: 'No bio available',
    checked_at: new Date().toISOString(),
    growth_24h: { change: 0 },
    growth_12h: { change: 0 },
    rolling_avg_7day: { average_change: 0, total_change: 0 }
  },
  {
    username: 'nike',
    follower_count: 296000000,
    biography: 'No bio available',
    checked_at: new Date().toISOString(),
    growth_24h: { change: 0 },
    growth_12h: { change: 0 },
    rolling_avg_7day: { average_change: 0, total_change: 0 }
  },
  {
    username: 'cristiano',
    follower_count: 607000000,
    biography: 'No bio available',
    checked_at: new Date().toISOString(),
    growth_24h: { change: 0 },
    growth_12h: { change: 0 },
    rolling_avg_7day: { average_change: 0, total_change: 0 }
  },
  {
    username: 'leomessi',
    follower_count: 486000000, 
    biography: 'No bio available',
    checked_at: new Date().toISOString(),
    growth_24h: { change: 0 },
    growth_12h: { change: 0 },
    rolling_avg_7day: { average_change: 0, total_change: 0 }
  }
];

const InstagramAILeaderboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]); // Start with empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for background refreshes
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null); // Used when API returns errors
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Extract data fetching logic into a reusable function
  const fetchAccountsData = async (isInitialLoad = true) => {
    // Only set loading state for initial loads
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    try {
      console.log('Fetching accounts...');
      
      // Step 1: Fetch the list of accounts
      const accountsResponse = await fetch(`${API_BASE_URL}/accounts/`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      if (!accountsResponse.ok) {
        throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`);
      }
      
      const accountsData = await accountsResponse.json();
      console.log(`Fetched ${accountsData.length} accounts`);
      
      // Step 2: Fetch profile data for all accounts
      const profilesResponse = await fetch(`${API_BASE_URL}/profiles/`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      if (!profilesResponse.ok) {
        throw new Error(`Failed to fetch profiles: ${profilesResponse.status}`);
      }
      
      const profilesData = await profilesResponse.json();
      console.log(`Fetched ${profilesData.length} profiles`);
      
      // Create a map of usernames to profiles for quick lookup
      const profileMap = {};
      profilesData.forEach(profile => {
        profileMap[profile.username] = profile;
      });
      
      // Step 3: Combine account and profile data
      const combinedData = [];
      
      for (const account of accountsData) {
        try {
          // Get the matching profile data
          const profile = profileMap[account.username] || {};
          
          // Fetch growth data for this account
          let growth = { change_12h: { change: 0 }, change_24h: { change: 0 } };
          try {
            const growthResponse = await fetch(`${API_BASE_URL}/analytics/growth/${account.username}`, {
              headers: { 'Accept': 'application/json' },
              cache: 'no-store'
            });
            
            if (growthResponse.ok) {
              growth = await growthResponse.json();
              console.log(`Fetched growth data for ${account.username}`);
            } else {
              console.warn(`Could not fetch growth data for ${account.username}`);
            }
          } catch (growthError) {
            console.warn(`Error fetching growth data for ${account.username}:`, growthError);
          }
          
          // Fetch 7-day rolling average data
          let rollingAvg = { rolling_avg_7day: { average_change: 0, total_change: 0 } };
          try {
            const rollingAvgResponse = await fetch(`${API_BASE_URL}/analytics/rolling-average/${account.username}`, {
              headers: { 'Accept': 'application/json' },
              cache: 'no-store'
            });
            
            if (rollingAvgResponse.ok) {
              rollingAvg = await rollingAvgResponse.json();
              console.log(`Fetched rolling average data for ${account.username}`);
            } else {
              console.warn(`Could not fetch rolling average data for ${account.username}`);
            }
          } catch (rollingAvgError) {
            console.warn(`Error fetching rolling average data for ${account.username}:`, rollingAvgError);
          }
          
          // Build the combined account object with only real data, no simulation
          combinedData.push({
            id: account.id,
            username: account.username,
            status: account.status,
            created_at: account.created_at,
            follower_count: profile.follower_count || 0,
            profile_pic_url: profile.profile_pic_url || '',
            full_name: profile.full_name || '',
            biography: profile.biography || '',
            checked_at: profile.checked_at || account.created_at,
            growth_12h: growth.change_12h || { change: 0 },
            growth_24h: growth.change_24h || { change: 0 },
            rolling_avg_7day: rollingAvg.rolling_avg_7day || { average_change: 0, total_change: 0 }
          });
        } catch (error) {
          console.error(`Error processing account ${account.username}:`, error);
        }
      }
      
      console.log(`Combined ${combinedData.length} accounts with profiles and growth data`);
      
      if (combinedData.length > 0) {
        // Sort by follower count (highest first)
        combinedData.sort((a, b) => b.follower_count - a.follower_count);
        setAccounts(combinedData);
        setError(null);
      } else {
        console.error('No valid data retrieved from API');
        setAccounts(MOCK_ACCOUNTS);
        setError('No valid data retrieved from API. Using demo data instead.');
      }
      
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching data:', err);
      setAccounts(MOCK_ACCOUNTS);
      setError(`API error: ${err.message}. Using demo data instead.`);
    } finally {
      // Reset loading state properly based on whether this was an initial load or a refresh
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };
  
  // Use the fetchAccountsData function in the useEffect
  useEffect(() => {    
    // Initial load always passes true to show loading indicator
    fetchAccountsData(true);
    
    // Set up auto-refresh if enabled
    if (autoRefresh) {
      // For auto-refresh, pass false to prevent showing loading indicator
      const interval = setInterval(() => fetchAccountsData(false), 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.biography?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="leaderboard-container">
      {/* Top navigation bar */}
      <header className="leaderboard-header">
        <div className="header-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Instagram className="header-icon" />
          <h1>GlowUpAI</h1>
        </div>
        
        <div className="header-buttons">
          <button className="nav-button active">
            <User size={16} />
            <span>Submit Account</span>
          </button>
          <button className="nav-button" onClick={() => navigate('/about')}>
            <Info size={16} />
            <span>About</span>
          </button>
        </div>
      </header>
      
      <div className="main-container">
        {/* Side navigation */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">
              {/* Instagram icon removed */}
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <div 
              className="sidebar-item active"
              onClick={() => navigate('/')}
            >
              <Users size={18} />
              <span>Leaderboard</span>
            </div>
            <div className="sidebar-item">
              <User size={18} />
              <span>Submit Account</span>
            </div>
            <div 
              className="sidebar-item"
              onClick={() => navigate('/about')}
            >
              <Info size={18} />
              <span>About</span>
            </div>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">GlowUpAI Leaderboard</h2>
            </div>
            
            {/* Search box */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by username or bio"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" size={18} />
            </div>
            
            {/* Auto refresh indicator */}
            <div className="refresh-row">
              <div 
                className="auto-refresh"
                onClick={toggleAutoRefresh}
              >
                <RefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} size={16} />
                <span className={`status-badge ${autoRefresh ? 'on' : 'off'}`}>
                  {autoRefresh ? 'ON' : 'OFF'}
                </span>
                <span className="refresh-text">Auto-refresh</span>
              </div>
              <div className="updated-text">
                Updated: {lastUpdated}
              </div>
            </div>
            
            {/* API buttons removed */}
            
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-text">Loading data...</div>
              </div>
            ) : (
              <>
                {/* Account count */}
                <div className="account-count">
                  Showing {filteredAccounts.length} of {accounts.length} accounts
                </div>
                
                {filteredAccounts.length === 0 ? (
                  <div className="no-accounts">
                    <p>No accounts found. {searchTerm ? 'Try adjusting your search.' : ''}</p>
                  </div>
                ) : (
                  /* Account cards */
                  <div className="accounts-list">
                    {filteredAccounts.map((account, index) => {
                      // Extract growth data or provide defaults
                      const growth24h = account.growth_24h || {};
                      const rollingAvg = account.rolling_avg_7day || {};
                      
                      // Get initials for the profile image
                      const getInitials = (username) => {
                        if (!username) return 'AI';
                        const parts = username.split(/[._-]/);
                        if (parts.length > 1) {
                          return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
                        }
                        return username.substring(0, 2).toUpperCase();
                      };
                      
                      // Create a proxy URL to bypass CORS restrictions
                      const createProxyUrl = (url) => {
                        if (!url) return null;
                        
                        // Use a public CORS proxy service to access Instagram images
                        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
                      };
                      
                      const profileImageUrl = account.profile_pic_url ? createProxyUrl(account.profile_pic_url) : null;
                      
                      return (
                        <div key={`account-${index}-${account.username}`} className="account-card">
                          <div className="account-content">
                            <div className="account-info">
                              {/* Rank indicator */}
                              <div className="rank-badge">
                                <div className="rank-number">
                                  #{index + 1}
                                </div>
                              </div>
                              
                              {/* Profile picture - using a proxy to bypass CORS restrictions */}
                              <div className="profile-image">
                                {profileImageUrl ? (
                                  <img src={profileImageUrl} alt={account.username} />
                                ) : (
                                  getInitials(account.username)
                                )}
                              </div>
                              
                              {/* Account info */}
                              <div className="account-details">
                                <div className="account-name">
                                  <span className="username">@{account.username || 'unknown'}</span>
                                  <Instagram className="instagram-icon" size={16} />
                                </div>
                                <div className="followers-count">
                                  <Users className="users-icon" size={14} />
                                  <span className="followers-text">
                                    {formatFollowerCount(account.follower_count)} followers
                                  </span>
                                </div>
                              </div>
                              
                              {/* Bio container - moved outside account-details but still inside account-info */}
                              <div className="bio-container">
                                <p className="bio">{account.biography || 'No bio available'}</p>
                              </div>
                            </div>
                            
                            {/* Growth metrics */}
                            <div className="growth-metrics">
                              <div className={`growth-number ${(growth24h.change || 0) >= 0 ? 'positive' : 'negative'}`}>
                                {(growth24h.change || 0) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span className="growth-label">24h: </span>{(growth24h.change || 0) >= 0 ? '+' : ''}{formatNumber(growth24h.change || 0)}
                              </div>
                              <div className={`growth-number ${(rollingAvg.average_change || 0) >= 0 ? 'positive' : 'negative'}`}>
                                {(rollingAvg.average_change || 0) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span className="growth-label">7d avg: </span>{(rollingAvg.average_change || 0) >= 0 ? '+' : ''}{formatNumber(rollingAvg.average_change || 0)}/day
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper functions
const formatFollowerCount = (count) => {
  if (!count && count !== 0) return '0';
  
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Custom TrendingDown icon
const TrendingDown = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  );
};

// Custom TrendingUp component to fix the missing import
const TrendingUp = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
};

export default InstagramAILeaderboard;