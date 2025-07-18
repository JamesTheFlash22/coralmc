import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`glass-card p-6 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="text-gaming-danger" size={48} />
        <h3 className="text-lg font-semibold text-white">Something went wrong</h3>
        <p className="text-white/70">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="gaming-button flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;