import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

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
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Player endpoints
  getPlayerInfo: async (username) => {
    const response = await api.get(`/api/player/${username}`);
    return response.data;
  },

  getBedwarsStats: async (username) => {
    const response = await api.get(`/api/player/${username}/bedwars`);
    return response.data;
  },

  getBedwarsMatches: async (username) => {
    const response = await api.get(`/api/player/${username}/bedwars/matches`);
    return response.data;
  },

  getBedwarsLeaderboard: async (type) => {
    const response = await api.get(`/api/bedwars/leaderboard/${type}`);
    return response.data;
  },

  searchPlayers: async (searchTerm) => {
    const response = await api.get(`/api/player/search/${searchTerm}`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
};

export default api;