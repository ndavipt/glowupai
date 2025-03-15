import React from 'react';
import { Instagram, User, Users, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './InstagramAILeaderboard.css';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="leaderboard-container">
      {/* Top navigation bar */}
      <header className="leaderboard-header">
        <div className="header-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Instagram className="header-icon" />
          <h1>GlowUpAI</h1>
        </div>
        
        <div className="header-buttons">
          <button className="nav-button" onClick={() => navigate('/')}>
            <User size={16} />
            <span>Submit Account</span>
          </button>
          <button className="nav-button active">
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
              className="sidebar-item" 
              onClick={() => navigate('/')}
            >
              <Users size={18} />
              <span>Leaderboard</span>
            </div>
            <div className="sidebar-item">
              <User size={18} />
              <span>Submit Account</span>
            </div>
            <div className="sidebar-item active">
              <Info size={18} />
              <span>About</span>
            </div>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">About GlowUpAI</h2>
            </div>
            
            <div className="about-content">
              <section className="about-section">
                <h3>What is GlowUpAI?</h3>
                <p>
                  GlowUpAI is a sophisticated analytics platform that tracks and analyzes Instagram account growth. 
                  Our platform provides real-time data on follower growth, engagement rates, and audience insights 
                  for AI-related Instagram accounts.
                </p>
              </section>
              
              <section className="about-section">
                <h3>How It Works</h3>
                <p>
                  Our system collects data from Instagram accounts at regular intervals, processing millions of data points
                  to provide accurate growth metrics. We track follower counts, engagement statistics, and content performance
                  to help you understand which accounts are growing fastest and why.
                </p>
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <div className="feature-text">
                      <h4>Real-time Analytics</h4>
                      <p>Monitor account growth with 12-hour and 24-hour tracking periods</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🔍</div>
                    <div className="feature-text">
                      <h4>Account Discovery</h4>
                      <p>Find and track trending AI-focused Instagram accounts</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📈</div>
                    <div className="feature-text">
                      <h4>Growth Tracking</h4>
                      <p>Compare growth rates and performance between accounts</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="about-section">
                <h3>Why We Built This</h3>
                <p>
                  We created GlowUpAI to provide transparency in the rapidly evolving AI content ecosystem on Instagram.
                  By monitoring growth patterns and account performance, we help creators, marketers, and enthusiasts
                  understand trends and benchmark performance in the AI community.
                </p>
              </section>
              
              <section className="about-section">
                <h3>Our Team</h3>
                <p>
                  GlowUpAI was developed by a team of data scientists, web developers, and social media analysts
                  passionate about AI, analytics, and creating powerful tools for the creator economy.
                </p>
                <div className="team-grid">
                  <div className="team-member">
                    <div className="team-image">JD</div>
                    <h4>John Doe</h4>
                    <p>Founder & Data Scientist</p>
                  </div>
                  <div className="team-member">
                    <div className="team-image">JS</div>
                    <h4>Jane Smith</h4>
                    <p>Lead Developer</p>
                  </div>
                  <div className="team-member">
                    <div className="team-image">AT</div>
                    <h4>Alex Taylor</h4>
                    <p>Growth Analyst</p>
                  </div>
                </div>
              </section>
              
              <section className="about-section">
                <h3>Contact Us</h3>
                <p>
                  Have questions or suggestions? We'd love to hear from you. Reach out to our team at 
                  <a href="mailto:contact@glowupai.com"> contact@glowupai.com</a>.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;