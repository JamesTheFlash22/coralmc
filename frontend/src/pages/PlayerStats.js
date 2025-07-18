import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Trophy, Target, Bed, Clock, Crown, 
  TrendingUp, Calendar, Server, Award, Users, 
  Sword, Shield, Flame, Heart, Star
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import { apiService } from '../utils/api';
import { 
  formatNumber, formatDate, calculateKDR, calculateWinRate, 
  formatDuration, getPlayerRank, getRankColor, 
  getMatchOutcomeColor, getMatchOutcomeBg, formatTimeAgo
} from '../utils/helpers';

const PlayerStats = () => {
  const { username } = useParams();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [bedwarsStats, setBedwarsStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPlayerData();
  }, [username]);

  const fetchPlayerData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const [playerData, bedwarsData, matchesData] = await Promise.all([
        apiService.getPlayerInfo(username),
        apiService.getBedwarsStats(username),
        apiService.getBedwarsMatches(username)
      ]);
      
      setPlayerInfo(playerData);
      setBedwarsStats(bedwarsData);
      setRecentMatches(Array.isArray(matchesData) ? matchesData : []);
    } catch (err) {
      setError(err.message || 'Failed to load player data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading player data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchPlayerData} />;
  }

  if (!playerInfo || !bedwarsStats) {
    return <ErrorMessage message="Player not found" />;
  }

  const playerRank = getPlayerRank(bedwarsStats.level);
  const kdr = calculateKDR(bedwarsStats.kills, bedwarsStats.deaths);
  const winRate = calculateWinRate(bedwarsStats.wins, bedwarsStats.played);
  const fkdr = calculateKDR(bedwarsStats.final_kills, bedwarsStats.final_deaths);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'matches', name: 'Recent Matches', icon: <Target className="w-4 h-4" /> },
    { id: 'detailed', name: 'Detailed Stats', icon: <Trophy className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Player Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="w-20 h-20 bg-gaming-accent rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white minecraft-text">
                  {playerInfo.username}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`level-badge ${getRankColor(playerRank)}`}>
                    Level {bedwarsStats.level}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getRankColor(playerRank)}`}>
                    {playerRank}
                  </span>
                  {bedwarsStats.clan_name && (
                    <span className="clan-badge">
                      {bedwarsStats.clan_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-4 text-white/70">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {formatDate(playerInfo.joinDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Server className="w-4 h-4" />
                  <span className={`text-sm ${playerInfo.isOnline ? 'text-gaming-success' : 'text-white/70'}`}>
                    {playerInfo.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              {playerInfo.isVip && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gaming-secondary text-white">
                    <Crown className="w-4 h-4 mr-1" />
                    VIP
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card p-6 mb-8">
          <div className="flex space-x-1 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gaming-accent text-white border-b-2 border-gaming-accent'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Wins"
                value={bedwarsStats.wins}
                icon={<Trophy className="w-6 h-6" />}
                color="text-gaming-success"
              />
              <StatCard
                title="Kills"
                value={bedwarsStats.kills}
                icon={<Sword className="w-6 h-6" />}
                color="text-gaming-danger"
              />
              <StatCard
                title="Current Winstreak"
                value={bedwarsStats.winstreak}
                icon={<Flame className="w-6 h-6" />}
                color="text-gaming-accent"
              />
              <StatCard
                title="Beds Broken"
                value={bedwarsStats.beds_broken}
                icon={<Bed className="w-6 h-6" />}
                color="text-gaming-secondary"
              />
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Win Rate</span>
                    <span className="text-gaming-success font-bold">{winRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">K/D Ratio</span>
                    <span className="text-gaming-highlight font-bold">{kdr}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Final K/D</span>
                    <span className="text-gaming-accent font-bold">{fkdr}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Games Played</span>
                    <span className="text-white font-bold">{formatNumber(bedwarsStats.played)}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Highest Winstreak</span>
                    <span className="text-gaming-accent font-bold">{bedwarsStats.h_winstreak}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Level Rank</span>
                    <span className="text-gaming-secondary font-bold">#{bedwarsStats.level_rank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Coins</span>
                    <span className="text-gaming-highlight font-bold">{formatNumber(bedwarsStats.coins)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Final Kills</span>
                    <span className="text-gaming-danger font-bold">{formatNumber(bedwarsStats.final_kills)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Recent Matches
            </h3>
            
            {recentMatches.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No recent matches found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMatches.slice(0, 10).map((match, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMatchOutcomeBg(match.match_outcome)}`}>
                          {match.match_outcome === 'Win' ? (
                            <Trophy className="w-6 h-6 text-gaming-success" />
                          ) : (
                            <Target className="w-6 h-6 text-gaming-danger" />
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/match/${match.match_id}`}
                            className="text-white font-semibold hover:text-gaming-accent"
                          >
                            {match.arena_name}
                          </Link>
                          <div className="text-white/60 text-sm">
                            {match.match_type_name} • {formatTimeAgo(match.match_start)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-bold ${getMatchOutcomeColor(match.match_outcome)}`}>
                          {match.match_outcome}
                        </div>
                        <div className="text-white/60 text-sm">
                          {formatDuration(match.match_duration_seconds)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Deaths"
                value={bedwarsStats.deaths}
                icon={<Heart className="w-6 h-6" />}
                color="text-gaming-danger"
              />
              <StatCard
                title="Final Deaths"
                value={bedwarsStats.final_deaths}
                icon={<Shield className="w-6 h-6" />}
                color="text-gaming-warning"
              />
              <StatCard
                title="Losses"
                value={bedwarsStats.losses}
                icon={<Target className="w-6 h-6" />}
                color="text-red-400"
              />
              <StatCard
                title="Current Division"
                value={bedwarsStats.current_division}
                icon={<Star className="w-6 h-6" />}
                color="text-gaming-highlight"
              />
              <StatCard
                title="Division XP"
                value={bedwarsStats.current_division_exp}
                icon={<TrendingUp className="w-6 h-6" />}
                color="text-gaming-secondary"
              />
              <StatCard
                title="Total Players"
                value={bedwarsStats.total_players}
                icon={<Users className="w-6 h-6" />}
                color="text-gaming-accent"
              />
            </div>

            {/* Detailed ratios */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Detailed Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg text-gaming-accent">Combat Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Kills per Game</span>
                      <span className="text-white">{(bedwarsStats.kills / bedwarsStats.played).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Final Kills per Game</span>
                      <span className="text-white">{(bedwarsStats.final_kills / bedwarsStats.played).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Beds per Game</span>
                      <span className="text-white">{(bedwarsStats.beds_broken / bedwarsStats.played).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg text-gaming-secondary">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Win Streak Efficiency</span>
                      <span className="text-white">{((bedwarsStats.winstreak / bedwarsStats.wins) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Average Game Length</span>
                      <span className="text-white">Est. 8-12 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Rank Percentile</span>
                      <span className="text-white">Top {(100 - (bedwarsStats.level_rank / bedwarsStats.total_players * 100)).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;