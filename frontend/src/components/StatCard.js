import React from 'react';
import { formatNumber } from '../utils/helpers';

const StatCard = ({ title, value, icon, color = 'text-white', change, className = '' }) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && <div className={`${color}`}>{icon}</div>}
          <div>
            <p className="text-white/70 text-sm">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
          </div>
        </div>
        {change && (
          <div className={`text-sm ${change > 0 ? 'text-gaming-success' : 'text-gaming-danger'}`}>
            {change > 0 ? '+' : ''}{change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;