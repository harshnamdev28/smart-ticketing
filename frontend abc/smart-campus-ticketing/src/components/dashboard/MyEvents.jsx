import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'
import Modal from '../Modal'
import EmptyState from '../EmptyState'
import ErrorState from '../ErrorState'
import apiService from '../../api'
import { formatCurrency, formatDate, getPercentage } from '../../lib/utils'
import toast from 'react-hot-toast'

const MyEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [stats, setStats] = useState(null)
  const [showStats, setShowStats] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getMyEvents()
      // Backend returns { data: [...] }
      setEvents(response.data || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleViewStats = async (event) => {
    setSelectedEvent(event)
    setShowStats(true)
    setLoadingStats(true)

    try {
      const data = await apiService.getEventStats(event.id)
      setStats(data)
    } catch (err) {
      toast.error('Failed to load stats')
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchMyEvents} />
  }

  if (events.length === 0) {
    return (
      <EmptyState
        type="events"
        message="You haven't created any events yet"
        action={{
          label: 'Create Your First Event',
          onClick: () => window.location.href = '/dashboard?tab=create'
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const percentSold = getPercentage(event.ticketsSold, event.capacity)
        const revenue = event.currentPrice * event.ticketsSold

        return (
          <div
            key={event.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
              {/* Event Image */}
              <div className="md:col-span-1">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 md:h-full object-cover rounded-lg"
                />
              </div>

              {/* Event Details */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                      {event.category}
                    </span>
                    {event.surgeActive && (
                      <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        <span>Surge Active</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">
                      {event.ticketsSold} / {event.capacity} tickets sold
                    </span>
                    <span className="text-purple-400 font-semibold">
                      {percentSold}%
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

              {/* Stats & Actions */}
              <div className="md:col-span-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Current Price</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(event.currentPrice)}
                    </p>
                    {event.surgeActive && (
                      <p className="text-orange-400 text-xs">
                        Base: {formatCurrency(event.basePrice)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Est. Revenue</p>
                    <p className="text-lg font-bold text-green-400">
                      {formatCurrency(revenue)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewStats(event)}
                  className="w-full btn-primary py-2 text-sm mt-4 flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Stats</span>
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Stats Modal */}
      <Modal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="Event Statistics"
        size="md"
      >
        {loadingStats ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : stats && selectedEvent ? (
          <div className="space-y-6">
            {/* Event Header */}
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedEvent.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {selectedEvent.category}
                </span>
                {stats.surgeActive && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🔥 Surge Pricing Active
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <p className="text-gray-400 text-sm">Tickets Sold</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats.ticketsSold}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {stats.remaining} remaining
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  {formatCurrency(stats.revenue)}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <p className="text-gray-400 text-sm">Bookings</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats.bookingsCount}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  <p className="text-gray-400 text-sm">Current Price</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(stats.currentPrice)}
                </p>
                {stats.surgeActive && (
                  <p className="text-orange-400 text-xs mt-1">+25% surge</p>
                )}
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Capacity</span>
                <span className="text-purple-400 font-semibold">
                  {getPercentage(stats.ticketsSold, selectedEvent.capacity)}% sold
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{
                    width: `${getPercentage(stats.ticketsSold, selectedEvent.capacity)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default MyEvents
