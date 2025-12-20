import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', message?: string }> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div 
        className={`${sizeClasses[size]} border-neutral-300 border-t-red-600 rounded-full animate-spin`}
      ></div>
      {message && <p className="text-neutral-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;