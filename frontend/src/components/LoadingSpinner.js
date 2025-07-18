import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-white/20 border-t-gaming-accent rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-4 text-white/60 text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;