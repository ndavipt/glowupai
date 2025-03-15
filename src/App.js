import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InstagramAILeaderboard from './components/InstagramAILeaderboard';
import About from './components/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InstagramAILeaderboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;