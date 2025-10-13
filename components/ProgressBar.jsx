'use client';

import React from 'react';

const ProgressBar = ({ current, total, progress, showPercentage = true }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progress
        </span>
        <span className="text-sm text-gray-500">
          {current} / {total} slides
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs text-gray-600">
            {Math.round(percentage)}% complete
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;




