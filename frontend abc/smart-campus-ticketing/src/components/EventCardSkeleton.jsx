import React from 'react'

const EventCardSkeleton = () => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      {/* Image skeleton */}
      <div className="h-48 skeleton" />
      
      {/* Content */}
      <div className="p-5">
        <div className="h-6 skeleton mb-3" />
        <div className="h-4 skeleton mb-2 w-3/4" />
        
        <div className="space-y-2 mb-4 mt-4">
          <div className="h-4 skeleton w-1/2" />
          <div className="h-4 skeleton w-2/3" />
        </div>
        
        <div className="h-8 skeleton mb-4 w-1/3" />
        
        <div className="space-y-2">
          <div className="h-4 skeleton" />
          <div className="h-2 skeleton" />
        </div>
      </div>
    </div>
  )
}

export default EventCardSkeleton
