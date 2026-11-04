import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-900/20 p-6 rounded-full mb-6 border border-red-900/50">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-400 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

export default ErrorState
