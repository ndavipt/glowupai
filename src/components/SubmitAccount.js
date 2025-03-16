import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstagramAILeaderboard.css';

const SubmitAccount = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setErrorMessage('Please enter an Instagram username');
      return;
    }
    
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Mock API call - will be replaced with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setSuccessMessage(`@${username} was successfully submitted for tracking!`);
      setUsername('');
    } catch (error) {
      setErrorMessage('Error submitting account. Please try again.');
      console.error('Error submitting account:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="leaderboard-container">
      {/* Top navigation bar */}
      <header className="leaderboard-header">
        <div className="header-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img 
            src="/woman_2_blue.svg" 
            alt="Woman Icon" 
            style={{ height: '40px', marginRight: '10px' }} 
          />
          <img 
            src="/glowuplogo_wht_blueaccent_v4.svg" 
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
              className="sidebar-item" 
              onClick={() => navigate('/')}
            >
              <img 
                src="/man.png" 
                alt="Leaderboard Icon" 
                style={{ width: '18px', height: '18px', marginRight: '8px' }} 
              />
              <span>Leaderboard</span>
            </div>
            <div className="sidebar-item active">
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
              <h2 className="card-title">Submit an Instagram Account</h2>
            </div>
            
            <div className="submit-form-container">
              {/* Introduction */}
              <div className="form-intro">
                <p>
                  Want to track a new AI-related Instagram account? Submit it below and we'll add it to our tracking system.
                </p>
                <p>
                  Our automated system will verify the account and begin collecting growth data within 24 hours.
                </p>
              </div>
              
              {/* Form */}
              <form className="submit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Instagram Username</label>
                  <div className="username-input-wrapper">
                    <span className="username-prefix">@</span>
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter Instagram username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <small className="form-help-text">
                    Enter the username without '@' (e.g. "openai" instead of "@openai")
                  </small>
                </div>
                
                {/* Error and success messages */}
                {errorMessage && (
                  <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {errorMessage}
                  </div>
                )}
                
                {successMessage && (
                  <div className="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="success-icon">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    {successMessage}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Account'
                  )}
                </button>
              </form>
              
              {/* Additional information */}
              <div className="form-footer">
                <h3>What happens next?</h3>
                <div className="info-cards">
                  <div className="info-card">
                    <div className="info-icon">1</div>
                    <div className="info-text">
                      <h4>Verification</h4>
                      <p>We verify the account exists and is AI-related</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">2</div>
                    <div className="info-text">
                      <h4>Data Collection</h4>
                      <p>We begin collecting follower and growth data</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">3</div>
                    <div className="info-text">
                      <h4>Tracking</h4>
                      <p>Account appears on the leaderboard within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitAccount;