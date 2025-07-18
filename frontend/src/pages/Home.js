import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Target, Award, Search, TrendingUp, Crown } from 'lucide-react';
import PlayerSearch from '../components/PlayerSearch';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../utils/api';
import { formatNumber } from '../utils/helpers';

const Home = () => {
  const [leaderboardPreview, setLeaderboardPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboardPreview = async () => {
      try {
        const winstreakData = await apiService.getBedwarsLeaderboard('winstreak');
        setLeaderboardPreview(winstreakData.slice(0, 5));
      } catch (err) {
        setError('Failed to load leaderboard preview');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardPreview();
  }, []);

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Player Search',
      description: 'Search for any player and view their detailed statistics',
      color: 'text-gaming-accent'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Leaderboards',
      description: 'View top players across different categories',
      color: 'text-gaming-secondary'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Detailed Stats',
      description: 'Comprehensive Bedwars statistics and performance metrics',
      color: 'text-gaming-highlight'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Match History',
      description: 'Track recent matches and performance trends',
      color: 'text-gaming-success'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-gaming-darker to-gaming-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 minecraft-text animate-float">
              <span className="bg-gradient-to-r from-gaming-accent to-gaming-secondary bg-clip-text text-transparent">
                Coral Stats
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Track your Bedwars performance on CoralMC server. View detailed statistics, 
              leaderboards, and match history all in one place.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
              <PlayerSearch />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard
                title="Total Players"
                value="10,000+"
                icon={<Users className="w-6 h-6" />}
                color="text-gaming-accent"
              />
              <StatCard
                title="Matches Tracked"
                value="500K+"
                icon={<Target className="w-6 h-6" />}
                color="text-gaming-secondary"
              />
              <StatCard
                title="Active Players"
                value="2,500+"
                icon={<Trophy className="w-6 h-6" />}
                color="text-gaming-highlight"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/leaderboards" className="gaming-button">
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboards
              </Link>
              <a 
                href="#features" 
                className="gaming-button-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gaming-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className={`${feature.color} mb-4 flex justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20 bg-gaming-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Top Players
            </h2>
            <p className="text-white/70 mb-8">
              Check out the current winstreak leaders
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Loading leaderboard..." />
          ) : error ? (
            <div className="text-center text-gaming-danger">
              {error}
            </div>
          ) : leaderboardPreview ? (
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Crown className="w-5 h-5 mr-2 text-gaming-accent" />
                    Current Winstreak Leaders
                  </h3>
                  <Link 
                    to="/leaderboards" 
                    className="text-gaming-accent hover:text-gaming-accent/80 text-sm"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {leaderboardPreview.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gaming-accent text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <Link 
                            to={`/player/${player.username}`}
                            className="text-white font-semibold hover:text-gaming-accent"
                          >
                            {player.username}
                          </Link>
                          {player.clan && (
                            <span className="clan-badge ml-2">
                              {player.clan}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gaming-accent font-bold">
                          {formatNumber(player.stats.winstreak)} wins
                        </div>
                        <div className="text-white/60 text-sm">
                          Level {player.stats.level}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-gaming-darker to-gaming-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Track Your Stats?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of players who use Coral Stats to track their Bedwars performance 
            and climb the leaderboards.
          </p>
          <div className="max-w-md mx-auto">
            <PlayerSearch />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;