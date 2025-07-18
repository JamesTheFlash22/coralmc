import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, Clock, Users, Target, Bed, Crown, 
  ArrowLeft, Calendar, Server, Award, Sword, Shield
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { apiService } from '../utils/api';
import { formatDate, formatDuration, calculateKDR } from '../utils/helpers';

const MatchDetail = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatchData();
  }, [matchId]);

  const fetchMatchData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await apiService.getMatchDetail(matchId);
      setMatchData(data);
    } catch (err) {
      setError(err.message || 'Failed to load match data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading match details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchMatchData} />;
  }

  if (!matchData) {
    return <ErrorMessage message="Match not found" />;
  }

  // Group players by team
  const teams = {};
  matchData.per_player_stats.forEach(player => {
    if (!teams[player.team_name]) {
      teams[player.team_name] = [];
    }
    teams[player.team_name].push(player);
  });

  const getTeamColor = (teamName) => {
    const colors = {
      'Red': 'text-red-400 border-red-400',
      'Blue': 'text-blue-400 border-blue-400',
      'Green': 'text-green-400 border-green-400',
      'Yellow': 'text-yellow-400 border-yellow-400',
      'Purple': 'text-purple-400 border-purple-400',
      'Orange': 'text-orange-400 border-orange-400',
      'Pink': 'text-pink-400 border-pink-400',
      'Gray': 'text-gray-400 border-gray-400',
    };
    return colors[teamName] || 'text-white border-white';
  };

  const getTeamBgColor = (teamName) => {
    const colors = {
      'Red': 'bg-red-500/20',
      'Blue': 'bg-blue-500/20',
      'Green': 'bg-green-500/20',
      'Yellow': 'bg-yellow-500/20',
      'Purple': 'bg-purple-500/20',
      'Orange': 'bg-orange-500/20',
      'Pink': 'bg-pink-500/20',
      'Gray': 'bg-gray-500/20',
    };
    return colors[teamName] || 'bg-white/5';
  };

  const isWinningTeam = (teamName) => {
    return teamName === matchData.winning_team_name;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gaming-accent hover:text-gaming-accent/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>

        {/* Match Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="w-20 h-20 bg-gaming-accent rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white minecraft-text">
                  {matchData.arena_name}
                </h1>
                <p className="text-white/70 text-lg mt-1">
                  {matchData.type_name}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="win-badge">
                    Winner: {matchData.winning_team_name}
                  </span>
                  <span className="neutral-badge">
                    Match #{matchData.match_id}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-4 text-white/70 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {formatDate(matchData.start_time)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {formatDuration(matchData.duration_seconds)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-white/70">
                <div className="flex items-center space-x-1">
                  <Server className="w-4 h-4" />
                  <span className="text-sm">
                    Server {matchData.server_id}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {matchData.per_player_stats.length} players
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Total Kills
            </h3>
            <div className="text-3xl font-bold text-gaming-danger">
              {matchData.per_player_stats.reduce((total, player) => total + player.kills, 0)}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sword className="w-5 h-5 mr-2" />
              Final Kills
            </h3>
            <div className="text-3xl font-bold text-gaming-accent">
              {matchData.per_player_stats.reduce((total, player) => total + player.final_kills, 0)}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bed className="w-5 h-5 mr-2" />
              Beds Broken
            </h3>
            <div className="text-3xl font-bold text-gaming-secondary">
              {matchData.per_player_stats.reduce((total, player) => total + player.beds_broken, 0)}
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-6">
          {Object.entries(teams).map(([teamName, players]) => (
            <div key={teamName} className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold flex items-center ${getTeamColor(teamName)}`}>
                  {isWinningTeam(teamName) && <Crown className="w-6 h-6 mr-2" />}
                  Team {teamName}
                  {isWinningTeam(teamName) && (
                    <span className="ml-2 win-badge">
                      WINNER
                    </span>
                  )}
                </h3>
                <div className="text-white/60">
                  {players.length} players
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/70">Player</th>
                      <th className="text-center py-3 px-4 text-white/70">Kills</th>
                      <th className="text-center py-3 px-4 text-white/70">Final Kills</th>
                      <th className="text-center py-3 px-4 text-white/70">Deaths</th>
                      <th className="text-center py-3 px-4 text-white/70">Beds</th>
                      <th className="text-center py-3 px-4 text-white/70">K/D</th>
                      <th className="text-center py-3 px-4 text-white/70">Score</th>
                      <th className="text-center py-3 px-4 text-white/70">Damage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-white/5 hover:${getTeamBgColor(teamName)} transition-colors`}
                      >
                        <td className="py-4 px-4">
                          <Link
                            to={`/player/${player.username}`}
                            className="text-white font-semibold hover:text-gaming-accent flex items-center space-x-2"
                          >
                            <div className={`w-3 h-3 rounded-full ${getTeamColor(teamName).replace('text-', 'bg-').replace('border-', '')}`}></div>
                            <span>{player.username}</span>
                          </Link>
                        </td>
                        <td className="text-center py-4 px-4 text-white">
                          {player.kills}
                        </td>
                        <td className="text-center py-4 px-4 text-gaming-accent font-semibold">
                          {player.final_kills}
                        </td>
                        <td className="text-center py-4 px-4 text-gaming-danger">
                          {player.deaths}
                        </td>
                        <td className="text-center py-4 px-4 text-gaming-secondary">
                          {player.beds_broken}
                        </td>
                        <td className="text-center py-4 px-4 text-white font-semibold">
                          {player.kd}
                        </td>
                        <td className="text-center py-4 px-4 text-gaming-highlight">
                          {player.score}
                        </td>
                        <td className="text-center py-4 px-4 text-white/70">
                          {player.damage_dealt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Match Summary */}
        <div className="glass-card p-6 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Match Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg text-gaming-accent mb-3">Top Performers</h4>
              <div className="space-y-2">
                {/* Top Killer */}
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Most Kills:</span>
                  <span className="text-white font-semibold">
                    {matchData.per_player_stats.reduce((prev, current) => 
                      prev.kills > current.kills ? prev : current
                    ).username} ({matchData.per_player_stats.reduce((prev, current) => 
                      prev.kills > current.kills ? prev : current
                    ).kills})
                  </span>
                </div>
                
                {/* Top Final Killer */}
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Most Final Kills:</span>
                  <span className="text-gaming-accent font-semibold">
                    {matchData.per_player_stats.reduce((prev, current) => 
                      prev.final_kills > current.final_kills ? prev : current
                    ).username} ({matchData.per_player_stats.reduce((prev, current) => 
                      prev.final_kills > current.final_kills ? prev : current
                    ).final_kills})
                  </span>
                </div>
                
                {/* Top Bed Breaker */}
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Most Beds Broken:</span>
                  <span className="text-gaming-secondary font-semibold">
                    {matchData.per_player_stats.reduce((prev, current) => 
                      prev.beds_broken > current.beds_broken ? prev : current
                    ).username} ({matchData.per_player_stats.reduce((prev, current) => 
                      prev.beds_broken > current.beds_broken ? prev : current
                    ).beds_broken})
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg text-gaming-secondary mb-3">Match Info</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Duration:</span>
                  <span className="text-white">{formatDuration(matchData.duration_seconds)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Started:</span>
                  <span className="text-white">{formatDate(matchData.start_time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Ended:</span>
                  <span className="text-white">{formatDate(matchData.end_time)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;