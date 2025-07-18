import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Player endpoints
  getPlayerInfo: async (username) => {
    try {
      const response = await api.get(`/api/player/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch player info');
    }
  },

  getBedwarsStats: async (username) => {
    try {
      const response = await api.get(`/api/player/${username}/bedwars`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch bedwars stats');
    }
  },

  getBedwarsMatches: async (username) => {
    try {
      const response = await api.get(`/api/player/${username}/bedwars/matches`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch bedwars matches');
    }
  },

  getMatchDetail: async (matchId) => {
    try {
      const response = await api.get(`/api/bedwars/match/${matchId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch match details');
    }
  },

  getBedwarsLeaderboard: async (type) => {
    try {
      const response = await api.get(`/api/bedwars/leaderboard/${type}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch leaderboard');
    }
  },

  searchPlayers: async (searchTerm) => {
    try {
      const response = await api.get(`/api/player/search/${searchTerm}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to search players');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend is not responding');
    }
  },
};

export default api;