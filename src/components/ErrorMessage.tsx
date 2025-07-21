import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;