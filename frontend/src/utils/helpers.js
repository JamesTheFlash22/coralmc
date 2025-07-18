// Helper functions for formatting and calculations

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateKDR = (kills, deaths) => {
  if (deaths === 0) return kills.toString();
  return (kills / deaths).toFixed(2);
};

export const calculateWinRate = (wins, played) => {
  if (played === 0) return 0;
  return ((wins / played) * 100).toFixed(1);
};

export const getPlayerRank = (level) => {
  if (level >= 100) return 'Legend';
  if (level >= 50) return 'Master';
  if (level >= 25) return 'Expert';
  if (level >= 10) return 'Veteran';
  if (level >= 5) return 'Skilled';
  return 'Rookie';
};

export const getRankColor = (rank) => {
  const colors = {
    'Legend': 'text-yellow-400',
    'Master': 'text-purple-400',
    'Expert': 'text-blue-400',
    'Veteran': 'text-green-400',
    'Skilled': 'text-orange-400',
    'Rookie': 'text-gray-400'
  };
  return colors[rank] || 'text-gray-400';
};

export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

export const isValidUsername = (username) => {
  if (!username || username.length < 3 || username.length > 16) {
    return false;
  }
  return /^[a-zA-Z0-9_]+$/.test(username);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};