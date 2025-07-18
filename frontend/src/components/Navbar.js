import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gaming-darker/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gaming-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Coral <span className="text-gaming-accent">Stats</span>
            </span>
          </Link>

          <div className="flex space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gaming-accent text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home size={18} />
              <span className="hidden md:inline">Home</span>
            </Link>
            
            <Link
              to="/leaderboards"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/leaderboards') 
                  ? 'bg-gaming-accent text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Trophy size={18} />
              <span className="hidden md:inline">Leaderboards</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;