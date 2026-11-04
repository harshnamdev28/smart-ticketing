import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Ticket, XCircle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Modal from '../Modal'
import EmptyState from '../EmptyState'
import ErrorState from '../ErrorState'
import apiService from '../../api'
import { formatCurrency, formatDateTime, getPercentage } from '../../lib/utils'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getMyBookings()
      // Backend returns { data: [...] }
      setBookings(response.data || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleViewQR = (booking) => {
    setSelectedBooking(booking)
    setShowQR(true)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setCancelling(bookingId)
      await apiService.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking')
    } finally {
      setCancelling(null)
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
    return <ErrorState message={error} onRetry={fetchBookings} />
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        type="bookings"
        message="You haven't booked any tickets yet"
        action={{
          label: 'Browse Events',
          onClick: () => window.location.href = '/events'
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const event = booking.event
        const percentSold = getPercentage(event.ticketsSold, event.capacity)
        const isCancelled = booking.status === 'cancelled'
        const isPast = new Date(event.date) < new Date()

        return (
          <div
            key={booking.id}
            className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden ${
              isCancelled ? 'opacity-60' : ''
            }`}
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
                  <span className="inline-block bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {event.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDateTime(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Ticket className="w-4 h-4 mr-2" />
                    <span>
                      {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCancelled
                      ? 'bg-red-900/30 text-red-400'
                      : isPast
                      ? 'bg-gray-800 text-gray-400'
                      : 'bg-green-900/30 text-green-400'
                  }`}>
                    {isCancelled ? 'Cancelled' : isPast ? 'Completed' : 'Confirmed'}
                  </span>
                </div>
              </div>

              {/* Booking Info & Actions */}
              <div className="md:col-span-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatCurrency(booking.unitPrice)} × {booking.quantity}
                  </p>
                </div>

                {!isCancelled && (
                  <div className="space-y-2 mt-4">
                    <button
                      onClick={() => handleViewQR(booking)}
                      className="w-full btn-primary py-2 text-sm"
                    >
                      View QR Code
                    </button>
                    {!isPast && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelling === booking.id}
                        className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 font-semibold py-2 rounded-lg transition-all duration-300 disabled:opacity-50 text-sm"
                      >
                        {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* QR Code Modal */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="Your Ticket QR Code"
        size="sm"
      >
        {selectedBooking && (
          <div className="text-center space-y-4">
            <div className="bg-white p-6 rounded-lg inline-block">
              <QRCodeSVG
                value={selectedBooking.qrData}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                {selectedBooking.event.title}
              </h3>
              <p className="text-gray-400 text-sm">
                Show this QR code at the venue entrance
              </p>
              <p className="text-purple-400 font-mono text-xs mt-2">
                {selectedBooking.qrData}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MyBookings
