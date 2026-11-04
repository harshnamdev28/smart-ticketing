// Mock API for development
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Tech Summit 2026',
    description: 'Annual technology conference featuring the latest in AI, Web3, and Cloud Computing. Join industry leaders and innovators for a day of learning and networking.',
    category: 'Tech',
    venue: 'Main Auditorium',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    date: '2026-11-20T09:00:00Z',
    basePrice: 500,
    capacity: 100,
    ticketsSold: 0,
    maxPerUser: 5,
    organizer: {
      id: 'org1',
      name: 'Tech Club',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TC'
    }
  },
  {
    id: '2',
    title: 'Cultural Night',
    description: 'A mesmerizing evening of traditional and contemporary performances celebrating diverse cultures from around the world.',
    category: 'Cultural',
    venue: 'Open Air Theatre',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    date: '2026-11-15T18:00:00Z',
    basePrice: 200,
    capacity: 200,
    ticketsSold: 0,
    maxPerUser: 4,
    organizer: {
      id: 'org2',
      name: 'Cultural Society',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CS'
    }
  },
  {
    id: '3',
    title: 'Basketball Championship',
    description: 'Inter-college basketball tournament. Watch the best teams compete for glory!',
    category: 'Sports',
    venue: 'Sports Complex',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    date: '2026-11-12T15:00:00Z',
    basePrice: 100,
    capacity: 150,
    ticketsSold: 0,
    maxPerUser: 10,
    organizer: {
      id: 'org3',
      name: 'Sports Club',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC'
    }
  },
  {
    id: '4',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering fundamentals of AI/ML with practical examples. Bring your laptop!',
    category: 'Workshop',
    venue: 'Computer Lab 3',
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800',
    date: '2026-11-18T14:00:00Z',
    basePrice: 300,
    capacity: 50,
    ticketsSold: 0,
    maxPerUser: 2,
    organizer: {
      id: 'org1',
      name: 'Tech Club',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TC'
    }
  },
  {
    id: '5',
    title: 'Rock Band Night',
    description: 'Live performances by campus rock bands. Get ready to headbang!',
    category: 'Cultural',
    venue: 'Central Lawn',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    date: '2026-11-25T19:00:00Z',
    basePrice: 150,
    capacity: 300,
    ticketsSold: 0,
    maxPerUser: 6,
    organizer: {
      id: 'org2',
      name: 'Cultural Society',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CS'
    }
  },
  {
    id: '6',
    title: 'Startup Pitch Competition',
    description: 'Watch budding entrepreneurs pitch their innovative startup ideas to investors and win prizes.',
    category: 'Tech',
    venue: 'Seminar Hall',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    date: '2026-11-22T10:00:00Z',
    basePrice: 0,
    capacity: 120,
    ticketsSold: 0,
    maxPerUser: 3,
    organizer: {
      id: 'org4',
      name: 'E-Cell',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EC'
    }
  },
  {
    id: '7',
    title: 'Football Finals',
    description: 'The ultimate showdown! Championship finals between top two teams.',
    category: 'Sports',
    venue: 'Main Ground',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    date: '2026-11-28T16:00:00Z',
    basePrice: 150,
    capacity: 250,
    ticketsSold: 0,
    maxPerUser: 8,
    organizer: {
      id: 'org3',
      name: 'Sports Club',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC'
    }
  },
  {
    id: '8',
    title: 'Web Development Bootcamp',
    description: '3-day intensive bootcamp on modern web development. HTML, CSS, JavaScript, React and more!',
    category: 'Workshop',
    venue: 'Innovation Lab',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    date: '2026-12-01T09:00:00Z',
    basePrice: 800,
    capacity: 40,
    ticketsSold: 0,
    maxPerUser: 1,
    organizer: {
      id: 'org1',
      name: 'Tech Club',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TC'
    }
  }
]

// Initialize localStorage
const initStorage = () => {
  if (!localStorage.getItem('mockEvents')) {
    localStorage.setItem('mockEvents', JSON.stringify(MOCK_EVENTS))
  }
  if (!localStorage.getItem('mockBookings')) {
    localStorage.setItem('mockBookings', JSON.stringify([]))
  }
}

const calculateEventPrice = (event) => {
  const remaining = event.capacity - event.ticketsSold
  const percentRemaining = (remaining / event.capacity) * 100
  const surgeActive = percentRemaining < 20 && percentRemaining > 0
  const currentPrice = surgeActive ? Math.round(event.basePrice * 1.25) : event.basePrice
  
  return {
    ...event,
    remaining,
    surgeActive,
    currentPrice
  }
}

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAPI = {
  mockGoogleLogin: async (userData) => {
    await delay()
    const token = 'mock-jwt-token-' + Date.now()
    const user = {
      id: 'user-' + Date.now(),
      ...userData
    }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { token, user }
  },

  getMe: async () => {
    await delay()
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) throw new Error('Not authenticated')
    return user
  },

  getEvents: async (params = {}) => {
    await delay()
    initStorage()
    let events = JSON.parse(localStorage.getItem('mockEvents'))
    
    // Apply filters
    if (params.q) {
      const query = params.q.toLowerCase()
      events = events.filter(e => 
        e.title.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query)
      )
    }
    
    if (params.category && params.category !== 'All') {
      events = events.filter(e => e.category === params.category)
    }
    
    if (params.upcoming === 'true') {
      const now = new Date()
      events = events.filter(e => new Date(e.date) > now)
    }
    
    // Sort
    if (params.sort === 'date') {
      events.sort((a, b) => new Date(a.date) - new Date(b.date))
    }
    
    // Add calculated fields
    events = events.map(calculateEventPrice)
    
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 20
    const start = (page - 1) * limit
    const end = start + limit
    
    return {
      data: events.slice(start, end),
      page,
      limit,
      total: events.length
    }
  },

  getEvent: async (id) => {
    await delay()
    initStorage()
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const event = events.find(e => e.id === id)
    if (!event) throw new Error('Event not found')
    return calculateEventPrice(event)
  },

  createEvent: async (eventData) => {
    await delay()
    initStorage()
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const user = JSON.parse(localStorage.getItem('user'))
    
    const newEvent = {
      id: 'event-' + Date.now(),
      ...eventData,
      ticketsSold: 0,
      organizer: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    }
    
    events.push(newEvent)
    localStorage.setItem('mockEvents', JSON.stringify(events))
    return calculateEventPrice(newEvent)
  },

  updateEvent: async (id, eventData) => {
    await delay()
    initStorage()
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const index = events.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Event not found')
    
    events[index] = { ...events[index], ...eventData }
    localStorage.setItem('mockEvents', JSON.stringify(events))
    return calculateEventPrice(events[index])
  },

  deleteEvent: async (id) => {
    await delay()
    initStorage()
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const filtered = events.filter(e => e.id !== id)
    localStorage.setItem('mockEvents', JSON.stringify(filtered))
    return { success: true }
  },

  bookEvent: async (eventId, quantity) => {
    await delay(500)
    initStorage()
    
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const bookings = JSON.parse(localStorage.getItem('mockBookings'))
    const user = JSON.parse(localStorage.getItem('user'))
    
    const eventIndex = events.findIndex(e => e.id === eventId)
    if (eventIndex === -1) throw new Error('Event not found')
    
    const event = events[eventIndex]
    const remaining = event.capacity - event.ticketsSold
    
    // Check if sold out
    if (remaining <= 0) {
      const error = new Error('Event is sold out')
      error.response = { status: 409, data: { error: 'SOLD_OUT' } }
      throw error
    }
    
    // Check if enough tickets
    if (quantity > remaining) {
      throw new Error('Not enough tickets available')
    }
    
    // Check user's existing bookings for this event
    const userBookings = bookings.filter(
      b => b.userId === user.id && b.eventId === eventId && b.status === 'confirmed'
    )
    const totalBooked = userBookings.reduce((sum, b) => sum + b.quantity, 0)
    
    if (totalBooked + quantity > event.maxPerUser) {
      const error = new Error('Maximum tickets per user reached')
      error.response = { status: 409, data: { error: 'LIMIT_REACHED' } }
      throw error
    }
    
    // Calculate price with surge
    const eventWithPrice = calculateEventPrice(event)
    const unitPrice = eventWithPrice.currentPrice
    const totalPrice = unitPrice * quantity
    
    // Create booking
    const booking = {
      id: 'booking-' + Date.now(),
      eventId,
      userId: user.id,
      quantity,
      unitPrice,
      totalPrice,
      status: 'confirmed',
      qrData: `BOOKING-${Date.now()}-${eventId}-${user.id}`,
      createdAt: new Date().toISOString()
    }
    
    // Update event and save
    events[eventIndex].ticketsSold += quantity
    bookings.push(booking)
    
    localStorage.setItem('mockEvents', JSON.stringify(events))
    localStorage.setItem('mockBookings', JSON.stringify(bookings))
    
    return booking
  },

  getMyBookings: async () => {
    await delay()
    initStorage()
    const bookings = JSON.parse(localStorage.getItem('mockBookings'))
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const user = JSON.parse(localStorage.getItem('user'))
    
    const userBookings = bookings
      .filter(b => b.userId === user.id)
      .map(booking => {
        const event = events.find(e => e.id === booking.eventId)
        return {
          ...booking,
          event: event ? calculateEventPrice(event) : null
        }
      })
      .filter(b => b.event !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return userBookings
  },

  cancelBooking: async (bookingId) => {
    await delay()
    initStorage()
    const bookings = JSON.parse(localStorage.getItem('mockBookings'))
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    
    const bookingIndex = bookings.findIndex(b => b.id === bookingId)
    if (bookingIndex === -1) throw new Error('Booking not found')
    
    const booking = bookings[bookingIndex]
    const eventIndex = events.findIndex(e => e.id === booking.eventId)
    
    if (eventIndex !== -1) {
      events[eventIndex].ticketsSold -= booking.quantity
    }
    
    bookings[bookingIndex].status = 'cancelled'
    
    localStorage.setItem('mockEvents', JSON.stringify(events))
    localStorage.setItem('mockBookings', JSON.stringify(bookings))
    
    return { success: true }
  },

  getMyEvents: async () => {
    await delay()
    initStorage()
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const user = JSON.parse(localStorage.getItem('user'))
    
    return events
      .filter(e => e.organizer.id === user.id)
      .map(calculateEventPrice)
  },

  getEventStats: async (eventId) => {
    await delay()
    initStorage()
    const events = JSON.parse(localStorage.getItem('mockEvents'))
    const bookings = JSON.parse(localStorage.getItem('mockBookings'))
    
    const event = events.find(e => e.id === eventId)
    if (!event) throw new Error('Event not found')
    
    const eventBookings = bookings.filter(
      b => b.eventId === eventId && b.status === 'confirmed'
    )
    
    const revenue = eventBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const eventWithPrice = calculateEventPrice(event)
    
    return {
      ticketsSold: event.ticketsSold,
      remaining: eventWithPrice.remaining,
      revenue,
      bookingsCount: eventBookings.length,
      surgeActive: eventWithPrice.surgeActive,
      currentPrice: eventWithPrice.currentPrice
    }
  }
}
