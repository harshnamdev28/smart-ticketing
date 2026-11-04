import React, { useState } from 'react'
import { Calendar, MapPin, DollarSign, Users, Image as ImageIcon, FileText, Tag, AlertCircle } from 'lucide-react'
import apiService from '../../api'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Workshop']

const CreateEvent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech',
    venue: '',
    image: '',
    date: '',
    basePrice: '',
    capacity: '',
    maxPerUser: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required'
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required'
    } else if (!formData.image.match(/^https?:\/\/.+/)) {
      newErrors.image = 'Please enter a valid URL'
    }

    if (!formData.date) {
      newErrors.date = 'Date and time are required'
    } else {
      const eventDate = new Date(formData.date)
      const now = new Date()
      if (eventDate <= now) {
        newErrors.date = 'Event date must be in the future'
      }
    }

    const basePrice = parseInt(formData.basePrice)
    if (!formData.basePrice || isNaN(basePrice)) {
      newErrors.basePrice = 'Price is required'
    } else if (basePrice < 0) {
      newErrors.basePrice = 'Price cannot be negative'
    }

    const capacity = parseInt(formData.capacity)
    if (!formData.capacity || isNaN(capacity)) {
      newErrors.capacity = 'Capacity is required'
    } else if (capacity < 10) {
      newErrors.capacity = 'Capacity must be at least 10'
    } else if (capacity > 10000) {
      newErrors.capacity = 'Capacity cannot exceed 10,000'
    }

    const maxPerUser = parseInt(formData.maxPerUser)
    if (!formData.maxPerUser || isNaN(maxPerUser)) {
      newErrors.maxPerUser = 'Max tickets per user is required'
    } else if (maxPerUser < 1) {
      newErrors.maxPerUser = 'Must be at least 1'
    } else if (maxPerUser > capacity) {
      newErrors.maxPerUser = 'Cannot exceed total capacity'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setLoading(true)

      const eventData = {
        ...formData,
        basePrice: parseInt(formData.basePrice),
        capacity: parseInt(formData.capacity),
        maxPerUser: parseInt(formData.maxPerUser),
      }

      const newEvent = await apiService.createEvent(eventData)
      toast.success('Event created successfully! 🎉')
      navigate(`/events/${newEvent.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  // Calculate preview values
  const capacity = parseInt(formData.capacity) || 0
  const basePrice = parseInt(formData.basePrice) || 0
  const surgePrice = Math.round(basePrice * 1.25)
  const surgeThreshold = Math.ceil(capacity * 0.2)

  return (
    <div className="max-w-4xl">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., Tech Summit 2026"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe your event in detail..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Venue *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className={`input-field ${errors.venue ? 'border-red-500' : ''}`}
                placeholder="e.g., Main Auditorium"
              />
              {errors.venue && (
                <p className="text-red-400 text-sm mt-1">{errors.venue}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Image URL *
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`input-field ${errors.image ? 'border-red-500' : ''}`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="text-red-400 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date & Time *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`input-field ${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && (
              <p className="text-red-400 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Price, Capacity, Max Per User */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Base Price (₹) *
              </label>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                min="0"
                className={`input-field ${errors.basePrice ? 'border-red-500' : ''}`}
                placeholder="500"
              />
              {errors.basePrice && (
                <p className="text-red-400 text-sm mt-1">{errors.basePrice}</p>
              )}
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Max Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="10"
                max="10000"
                className={`input-field ${errors.capacity ? 'border-red-500' : ''}`}
                placeholder="100"
              />
              {errors.capacity && (
                <p className="text-red-400 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>

            <div>
              <label htmlFor="maxPerUser" className="block text-sm font-medium text-gray-300 mb-2">
                Max Per User *
              </label>
              <input
                type="number"
                id="maxPerUser"
                name="maxPerUser"
                value={formData.maxPerUser}
                onChange={handleChange}
                min="1"
                className={`input-field ${errors.maxPerUser ? 'border-red-500' : ''}`}
                placeholder="5"
              />
              {errors.maxPerUser && (
                <p className="text-red-400 text-sm mt-1">{errors.maxPerUser}</p>
              )}
            </div>
          </div>

          {/* Dynamic Pricing Preview */}
          {basePrice > 0 && capacity > 0 && (
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-300 font-medium mb-2">
                    Dynamic Pricing Preview
                  </p>
                  <p className="text-blue-400 text-sm">
                    Price rises to <span className="font-bold">{formatCurrency(surgePrice)}</span> when fewer than <span className="font-bold">{surgeThreshold} tickets</span> remain (20% of capacity)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent
