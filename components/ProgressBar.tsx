import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  message?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, message }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-neutral-700">{message || 'Generando...'}</span>
        <span className="text-sm font-medium text-neutral-700">{Math.round(clampedProgress)}%</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2.5 shadow-inner">
        <div 
          className="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;