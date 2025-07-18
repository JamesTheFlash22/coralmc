import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, X } from 'lucide-react';
import { apiService } from '../utils/api';
import { debounce, isValidUsername } from '../utils/helpers';

const PlayerSearch = ({ onPlayerSelect, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = debounce(async (term) => {
    if (!term || term.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const results = await apiService.searchPlayers(term);
      setSuggestions(results || []);
      setShowSuggestions(true);
    } catch (err) {
      setError('Failed to search players');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length < 3) {
      setError('');
    }
  };

  const handleSuggestionClick = (username) => {
    setSearchTerm(username);
    setShowSuggestions(false);
    
    if (onPlayerSelect) {
      onPlayerSelect(username);
    } else {
      navigate(`/player/${username}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!isValidUsername(searchTerm)) {
      setError('Username must be 3-16 characters long and contain only letters, numbers, and underscores');
      return;
    }

    setShowSuggestions(false);
    
    if (onPlayerSelect) {
      onPlayerSelect(searchTerm);
    } else {
      navigate(`/player/${searchTerm}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError('');
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" 
            size={20} 
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search for a player..."
            className="search-input pl-10 pr-10"
            onFocus={() => searchTerm.length >= 3 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-gaming-danger text-sm">
          {error}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gaming-darker/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-thin">
          {suggestions.map((username, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(username)}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg"
            >
              <User size={16} className="text-gaming-accent" />
              <span className="text-white">{username}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && searchTerm.length >= 3 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gaming-darker/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-4 text-center text-white/60">
          No players found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;