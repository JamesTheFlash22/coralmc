import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Crown, Flame, Target, Bed, Medal } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { apiService } from '../utils/api';
import { formatNumber, formatPosition } from '../utils/helpers';

const Leaderboards = () => {
  const [selectedType, setSelectedType] = useState('winstreak');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const leaderboardTypes = [
    { 
      id: 'winstreak', 
      name: 'Current Winstreak', 
      icon: <Flame className="w-5 h-5" />,
      color: 'text-orange-400',
      description: 'Players with the highest current winning streaks'
    },
    { 
      id: 'highest-winstreak', 
      name: 'Highest Winstreak', 
      icon: <Crown className="w-5 h-5" />,
      color: 'text-yellow-400',
      description: 'Players with the highest winning streaks ever achieved'
    },
    { 
      id: 'wins', 
      name: 'Total Wins', 
      icon: <Trophy className="w-5 h-5" />,
      color: 'text-green-400',
      description: 'Players with the most total wins'
    },
    { 
      id: 'kills', 
      name: 'Total Kills', 
      icon: <Target className="w-5 h-5" />,
      color: 'text-red-400',
      description: 'Players with the most kills'
    },
    { 
      id: 'beds', 
      name: 'Beds Broken', 
      icon: <Bed className="w-5 h-5" />,
      color: 'text-purple-400',
      description: 'Players who have broken the most beds'
    }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await apiService.getBedwarsLeaderboard(selectedType);
      setLeaderboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentType = () => {
    return leaderboardTypes.find(type => type.id === selectedType);
  };

  const getStatValue = (player, type) => {
    switch (type) {
      case 'winstreak':
        return player.stats.winstreak;
      case 'highest-winstreak':
        return player.stats.highestWinstreak;
      case 'wins':
        return player.stats.wins;
      case 'kills':
        return player.stats.kills;
      case 'beds':
        return player.stats.bedsBroken;
      default:
        return 0;
    }
  };

  const getPositionColor = (position) => {
    if (position === 1) return 'text-yellow-400';
    if (position === 2) return 'text-gray-400';
    if (position === 3) return 'text-orange-600';
    if (position <= 10) return 'text-blue-400';
    return 'text-white';
  };

  const getPositionBg = (position) => {
    if (position === 1) return 'bg-yellow-500/20 border-yellow-500/30';
    if (position === 2) return 'bg-gray-400/20 border-gray-400/30';
    if (position === 3) return 'bg-orange-600/20 border-orange-600/30';
    if (position <= 10) return 'bg-blue-400/20 border-blue-400/30';
    return 'bg-white/5 border-white/10';
  };

  const currentType = getCurrentType();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 minecraft-text">
            <span className="bg-gradient-to-r from-gaming-accent to-gaming-secondary bg-clip-text text-transparent">
              Leaderboards
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Compete with the best players on CoralMC
          </p>
        </div>

        {/* Leaderboard Type Selector */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Medal className="w-5 h-5 mr-2" />
              Select Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {leaderboardTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg transition-all duration-300 text-left ${
                    selectedType === type.id
                      ? 'bg-gaming-accent text-white shadow-lg transform scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className={`${type.color} mb-2`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
                  <p className="text-xs opacity-80">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        {isLoading ? (
          <LoadingSpinner size="lg" message="Loading leaderboard..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchLeaderboard} />
        ) : (
          <div className="glass-card p-6">
            {/* Current Category Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className={`${currentType.color} mr-3`}>
                  {currentType.icon}
                </span>
                {currentType.name}
              </h2>
              <div className="text-white/60 text-sm">
                {leaderboardData.length} players
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-3">
              {leaderboardData.map((player, index) => (
                <div
                  key={index}
                  className={`leaderboard-entry p-4 border-l-4 ${getPositionBg(player.position)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Position */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        player.position === 1 ? 'bg-yellow-500 text-black' :
                        player.position === 2 ? 'bg-gray-400 text-black' :
                        player.position === 3 ? 'bg-orange-600 text-white' :
                        'bg-gaming-accent text-white'
                      }`}>
                        {player.position <= 3 ? (
                          <Crown className="w-6 h-6" />
                        ) : (
                          player.position
                        )}
                      </div>

                      {/* Player Info */}
                      <div>
                        <Link
                          to={`/player/${player.username}`}
                          className={`text-lg font-semibold hover:underline ${getPositionColor(player.position)}`}
                        >
                          {player.username}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="level-badge">
                            Level {player.stats.level}
                          </span>
                          {player.clan && (
                            <span className="clan-badge">
                              {player.clan}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${currentType.color}`}>
                        {formatNumber(getStatValue(player, selectedType))}
                      </div>
                      <div className="text-white/60 text-sm">
                        {selectedType.includes('winstreak') ? 'wins' : 
                         selectedType === 'kills' ? 'kills' : 
                         selectedType === 'beds' ? 'beds' : 'wins'}
                      </div>
                      
                      {/* Additional stats */}
                      <div className="text-xs text-white/50 mt-1">
                        {selectedType !== 'wins' && (
                          <span>W: {formatNumber(player.stats.wins)} </span>
                        )}
                        {selectedType !== 'kills' && (
                          <span>K: {formatNumber(player.stats.kills)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Position indicator */}
                  <div className="mt-2 text-xs text-white/40">
                    {formatPosition(player.position)} place
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {leaderboardData.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No data available for this leaderboard</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboards;