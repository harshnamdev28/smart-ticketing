import React from 'react'
import { SearchX, Calendar, Ticket } from 'lucide-react'

const EmptyState = ({ type = 'search', message, action }) => {
  const icons = {
    search: SearchX,
    events: Calendar,
    bookings: Ticket,
  }

  const Icon = icons[type] || SearchX

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-800/50 p-6 rounded-full mb-6">
        <Icon className="w-16 h-16 text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-400 mb-2">
        {message || 'No results found'}
      </h3>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
