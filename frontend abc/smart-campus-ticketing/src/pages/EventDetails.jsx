import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, User, Clock, TrendingUp, Minus, Plus, Ticket, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ErrorState from '../components/ErrorState'
import { useAuth } from '../context/AuthContext'
import apiService from '../api'
import { formatCurrency, formatDateTime, getCountdown, getPercentage } from '../lib/utils'
import toast from 'react-hot-toast'

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    fetchEvent()
    
    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchEvent(true)
    }, 5000)

    return () => clearInterval(interval)
  }, [id])

  const fetchEvent = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError(null)
      
      const data = await apiService.getEvent(id)
      setEvent(data)
      
      // Adjust quantity if it exceeds remaining
      if (quantity > data.remaining) {
        setQuantity(Math.max(1, data.remaining))
      }
    } catch (err) {
      setError(err.message)
      if (!silent) toast.error('Failed to load event')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/events/${id}` } })
      return
    }

    if (event.remaining === 0) {
      toast.error('This event is sold out')
      return
    }

    try {
      setBooking(true)
      await apiService.bookEvent(id, quantity)
      
      toast.success('Booking successful! 🎉')
      navigate('/dashboard')
    } catch (err) {
      // Handle specific error codes
      if (err.response?.data?.error === 'SOLD_OUT') {
        toast.error('Someone just booked the last ticket. Sorry!')
        fetchEvent(true) // Refresh event data
      } else if (err.response?.data?.error === 'LIMIT_REACHED') {
        toast.error('You reached the max tickets for this event.')
      } else {
        toast.error(err.message || 'Failed to book ticket')
      }
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <ErrorState message={error} onRetry={fetchEvent} />
        </div>
      </div>
    )
  }

  const percentSold = getPercentage(event.ticketsSold, event.capacity)
  const totalPrice = event.currentPrice * quantity
  const isSoldOut = event.remaining === 0
  const countdown = getCountdown(event.date)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="bg-gray-700 text-gray-300 px-6 py-3 rounded-full font-bold text-lg">
                    Sold Out
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-medium">
                  {event.category}
                </span>
              </div>
              {event.surgeActive && !isSoldOut && (
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2 shadow-lg">
                    <TrendingUp className="w-5 h-5" />
                    <span>🔥 Price up +25%</span>
                  </span>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {event.title}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Event Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Date & Time</p>
                    <p className="text-white font-medium">{formatDateTime(event.date)}</p>
                    <p className="text-purple-400 text-sm mt-1">{countdown}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Venue</p>
                    <p className="text-white font-medium">{event.venue}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Organized by</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <img
                        src={event.organizer.avatar}
                        alt={event.organizer.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="text-white font-medium">{event.organizer.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Ticket Price</p>
                {event.surgeActive ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl font-bold text-white">
                      {formatCurrency(event.currentPrice)}
                    </span>
                    <div className="text-right">
                      <span className="text-gray-500 line-through block">
                        {formatCurrency(event.basePrice)}
                      </span>
                      <span className="text-orange-400 text-sm font-semibold">
                        +25% surge
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {formatCurrency(event.currentPrice)}
                  </span>
                )}
              </div>

              {/* Seats Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Seats Available</span>
                  <span className={`font-semibold ${
                    event.remaining < 10 ? 'text-red-400' : 'text-purple-400'
                  }`}>
                    {event.remaining} / {event.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
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

              {/* Surge Warning */}
              {!event.surgeActive && event.remaining > 0 && (
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-300 text-sm font-medium mb-1">
                        Price Alert
                      </p>
                      <p className="text-blue-400 text-xs">
                        Price rises to {formatCurrency(Math.round(event.basePrice * 1.25))} when fewer than {Math.ceil(event.capacity * 0.2)} tickets remain
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Picker */}
              {!isSoldOut && (
                <>
                  <div className="mb-6">
                    <label className="text-gray-400 text-sm mb-2 block">
                      Quantity (Max {event.maxPerUser} per person)
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-2xl font-bold text-white w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(event.maxPerUser, event.remaining, quantity + 1))}
                        disabled={quantity >= event.maxPerUser || quantity >= event.remaining}
                        className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-800 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total</span>
                      <span className="text-3xl font-bold text-gradient">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={booking || isSoldOut}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4"
              >
                {booking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : isSoldOut ? (
                  <span>Sold Out</span>
                ) : isAuthenticated ? (
                  <>
                    <Ticket className="w-5 h-5" />
                    <span>Book Now</span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span>Sign In to Book</span>
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-gray-400 text-sm mt-3 text-center">
                  Sign in to book tickets
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default EventDetails
