import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'blue' | 'green' | 'red';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'amber', 
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    amber: 'border-amber-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div 
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {text && (
        <p className="text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;