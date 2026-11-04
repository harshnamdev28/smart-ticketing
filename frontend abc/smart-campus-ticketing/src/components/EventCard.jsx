import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate, getPercentage } from '../lib/utils'

const EventCard = ({ event }) => {
  const percentSold = getPercentage(event.ticketsSold, event.capacity)
  const isSoldOut = event.remaining === 0

  return (
    <Link
      to={`/events/${event.id}`}
      className="block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 card-hover"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full font-semibold">
              Sold Out
            </span>
          </div>
        )}
        {event.surgeActive && !isSoldOut && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
              <TrendingUp className="w-4 h-4" />
              <span>Price up +25%</span>
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          {event.surgeActive ? (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                {formatCurrency(event.currentPrice)}
              </span>
              <span className="text-gray-500 line-through text-sm">
                {formatCurrency(event.basePrice)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-white">
              {formatCurrency(event.currentPrice)}
            </span>
          )}
        </div>

        {/* Seats Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Seats
            </span>
            <span className={`font-semibold ${
              event.remaining < 10 ? 'text-red-400' : 'text-purple-400'
            }`}>
              {event.remaining} left
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentSold >= 80
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              style={{ width: `${percentSold}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
