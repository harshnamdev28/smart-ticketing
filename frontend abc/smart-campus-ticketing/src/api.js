import axios from 'axios'
import { mockAPI } from './lib/mockAPI'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

// API functions
const apiService = {
  // Auth
  mockGoogleLogin: async (userData) => {
    if (USE_MOCK) return mockAPI.mockGoogleLogin(userData)
    const { data } = await api.post('/api/auth/mock-google', userData)
    return data
  },

  getMe: async () => {
    if (USE_MOCK) return mockAPI.getMe()
    const { data } = await api.get('/api/auth/me')
    return data
  },

  // Events
  getEvents: async (params = {}) => {
    if (USE_MOCK) return mockAPI.getEvents(params)
    const { data } = await api.get('/api/events', { params })
    return data
  },

  getEvent: async (id) => {
    if (USE_MOCK) return mockAPI.getEvent(id)
    const { data } = await api.get(`/api/events/${id}`)
    return data
  },

  createEvent: async (eventData) => {
    if (USE_MOCK) return mockAPI.createEvent(eventData)
    const { data } = await api.post('/api/events', eventData)
    return data
  },

  updateEvent: async (id, eventData) => {
    if (USE_MOCK) return mockAPI.updateEvent(id, eventData)
    const { data } = await api.patch(`/api/events/${id}`, eventData)
    return data
  },

  deleteEvent: async (id) => {
    if (USE_MOCK) return mockAPI.deleteEvent(id)
    const { data } = await api.delete(`/api/events/${id}`)
    return data
  },

  // Bookings
  bookEvent: async (eventId, quantity) => {
    if (USE_MOCK) return mockAPI.bookEvent(eventId, quantity)
    const { data } = await api.post(`/api/events/${eventId}/book`, { quantity })
    return data
  },

  getMyBookings: async () => {
    if (USE_MOCK) return mockAPI.getMyBookings()
    const { data } = await api.get('/api/my/bookings')
    return data
  },

  cancelBooking: async (bookingId) => {
    if (USE_MOCK) return mockAPI.cancelBooking(bookingId)
    const { data } = await api.delete(`/api/bookings/${bookingId}`)
    return data
  },

  // Organizer
  getMyEvents: async () => {
    if (USE_MOCK) return mockAPI.getMyEvents()
    const { data } = await api.get('/api/my/events')
    return data
  },

  getEventStats: async (eventId) => {
    if (USE_MOCK) return mockAPI.getEventStats(eventId)
    const { data } = await api.get(`/api/events/${eventId}/stats`)
    return data
  },
}

export default apiService
