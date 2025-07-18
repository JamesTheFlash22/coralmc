import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlayerStats from './pages/PlayerStats';
import Leaderboards from './pages/Leaderboards';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player/:username" element={<PlayerStats />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;