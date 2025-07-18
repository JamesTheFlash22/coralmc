import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gaming-darker/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gaming-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-white minecraft-text">
              Coral Stats
            </span>
          </Link>

          {/* Navigation Links */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white/70 hover:text-white">
              <Users size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;