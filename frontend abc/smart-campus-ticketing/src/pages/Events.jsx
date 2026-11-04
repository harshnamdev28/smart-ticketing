import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
import EventCardSkeleton from '../components/EventCardSkeleton'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import apiService from '../api'
import { debounce } from '../lib/utils'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Workshop']

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchEvents()
  }, [selectedCategory, sortBy])

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      fetchEvents()
    }, 500)

    debouncedSearch()
  }, [searchQuery])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiService.getEvents({
        q: searchQuery,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        upcoming: 'true',
        sort: sortBy,
        limit: 50
      })
      
      setEvents(data.data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    fetchEvents()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover Campus Events
          </h1>
          <p className="text-gray-400 text-lg">
            Find and book tickets for exciting events happening on campus
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Category Chips & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-400">
              {events.length} {events.length === 1 ? 'event' : 'events'} found
            </p>
          </div>
        )}

        {/* Content */}
        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            type="events"
            message={
              searchQuery
                ? `No events found matching "${searchQuery}"`
                : 'No events available at the moment'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Events
