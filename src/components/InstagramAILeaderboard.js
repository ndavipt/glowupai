import React, { useState, useEffect } from 'react';
import { Search, Users, RefreshCw } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './InstagramAILeaderboard.css';

// API base URL - the correct one according to documentation
const API_BASE_URL = 'https://logic-service.onrender.com/api/v1';

const InstagramAILeaderboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Fetch data from all required endpoints
  const fetchData = async () => {
    setIsLoading(true);
    console.log('Starting data fetch with correct endpoints...');
    
    try {
      // Add timestamp for cache busting
      const timestamp = new Date().getTime();
      
      // Step 1: Fetch accounts list
      console.log('Fetching accounts...');
      const accountsResponse = await fetch(`${API_BASE_URL}/accounts/?t=${timestamp}`, {
        headers: { 
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!accountsResponse.ok) {
        throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`);
      }
      
      const accountsData = await accountsResponse.json();
      console.log(`Successfully fetched ${accountsData.length} accounts`);
      
      // Step 2: Fetch profiles
      console.log('Fetching profiles...');
      const profilesResponse = await fetch(`${API_BASE_URL}/profiles/?t=${timestamp}`, {
        headers: { 
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!profilesResponse.ok) {
        throw new Error(`Failed to fetch profiles: ${profilesResponse.status}`);
      }
      
      const profilesData = await profilesResponse.json();
      console.log(`Successfully fetched ${profilesData.length} profiles`);
      
      // Create profile lookup map
      const profileMap = {};
      profilesData.forEach(profile => {
        profileMap[profile.username] = profile;
      });
      
      // Step 3: Process accounts in sequence to avoid overwhelming the API
      const combinedData = [];
      
      for (const account of accountsData) {
        try {
          // Get matching profile
          const profile = profileMap[account.username] || {};
          
          // Fetch growth metrics
          console.log(`Fetching growth data for ${account.username}...`);
          let growth24h = { change: 0 };
          
          try {
            const growthResponse = await fetch(`${API_BASE_URL}/analytics/growth/${account.username}?t=${timestamp}`, {
              headers: { 
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
              }
            });
            
            if (growthResponse.ok) {
              const growthData = await growthResponse.json();
              // According to API docs, access the correct property
              growth24h = growthData.change_24h || { change: 0 };
              console.log(`Got growth data for ${account.username}`);
            } else {
              console.warn(`Failed to get growth data for ${account.username}`);
            }
          } catch (growthError) {
            console.warn(`Error fetching growth for ${account.username}:`, growthError);
          }
          
          // Fetch rolling average
          console.log(`Fetching rolling average for ${account.username}...`);
          let rollingAvg = { rolling_avg_7day: { average_change: 0 } };
          
          try {
            const avgResponse = await fetch(`${API_BASE_URL}/analytics/rolling-average/${account.username}?t=${timestamp}`, {
              headers: { 
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
              }
            });
            
            if (avgResponse.ok) {
              rollingAvg = await avgResponse.json();
              console.log(`Got rolling average for ${account.username}`);
            } else {
              console.warn(`Failed to get rolling average for ${account.username}`);
            }
          } catch (avgError) {
            console.warn(`Error fetching average for ${account.username}:`, avgError);
          }
          
          // Add the combined data
          combinedData.push({
            id: account.id,
            username: account.username,
            follower_count: profile.follower_count || 0,
            biography: profile.biography || 'No bio available',
            profile_pic_url: profile.profile_pic_url,
            growth_24h: growth24h, // Using the correct structure from API
            rolling_avg_7day: rollingAvg.rolling_avg_7day || { average_change: 0 }
          });
          
          // Small delay to avoid overwhelming API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.error(`Error processing account ${account.username}:`, err);
        }
      }
      
      console.log(`Successfully processed ${combinedData.length} accounts`);
      
      // Sort by follower count (highest first)
      combinedData.sort((a, b) => b.follower_count - a.follower_count);
      
      setAccounts(combinedData);
      setError(null);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Error: ${err.message}. Please try again.`);
      
      // If error, use a minimal placeholder
      setAccounts([
        {
          username: 'instagram',
          follower_count: 618000000,
          biography: 'Instagram',
          growth_24h: { change: 50000 },
          rolling_avg_7day: { average_change: 45000 }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load and refresh setup
  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        setIsRefreshing(true);
        fetchData().finally(() => {
          setIsRefreshing(false);
        });
      }, 60000);
      
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
          <img 
            src="/woman-alt.svg" 
            alt="Woman Icon" 
            style={{ height: '40px', marginRight: '10px' }} 
          />
          <img 
            src="/glowuplogo_wht_blueaccent_v3.svg" 
            alt="GlowUpAI Logo" 
            style={{ height: '40px', marginRight: '10px' }} 
          />
        </div>
        
        <div className="header-buttons">
          <button className="nav-button active">
            <img 
              src="/submit-icon.png" 
              alt="Submit Icon" 
              style={{ width: '16px', height: '16px', marginRight: '8px' }} 
            />
            <span>Submit Account</span>
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
              <img 
                src="/man.png" 
                alt="Leaderboard Icon" 
                style={{ width: '18px', height: '18px', marginRight: '8px' }} 
              />
              <span>Leaderboard</span>
            </div>
            <div className="sidebar-item">
              <img 
                src="/submit-icon.png" 
                alt="Submit Icon" 
                style={{ width: '18px', height: '18px', marginRight: '8px' }} 
              />
              <span>Submit Account</span>
            </div>
            <div 
              className="sidebar-item"
              onClick={() => navigate('/about')}
            >
              <img 
                src="/info.png" 
                alt="About Icon" 
                style={{ width: '18px', height: '18px', marginRight: '8px' }} 
              />
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
            
            {/* Debug info */}
            {error && (
              <div className="error-message" style={{ padding: '10px', color: 'red' }}>
                {error}
              </div>
            )}
            
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