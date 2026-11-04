# Frontend-Backend Integration Guide

## ✅ Integration Complete!

The React frontend has been successfully linked to the Node.js backend.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Frontend (React + Vite)                        │
│  Port: 3000                                     │
│  Location: d:\ABC\frontend abc\                 │
│                                                 │
│  - React Router for navigation                  │
│  - Axios for API calls                          │
│  - AuthContext for authentication               │
│  - TailwindCSS for styling                      │
│  - QR code generation                           │
└─────────────────────────────────────────────────┘
                      ↓
           API Calls via Axios
           http://localhost:5000/api/*
                      ↓
┌─────────────────────────────────────────────────┐
│  Backend (Node.js + Express)                    │
│  Port: 5000                                     │
│  Location: d:\ABC\                              │
│                                                 │
│  - JWT Authentication                           │
│  - RESTful API endpoints                        │
│  - Rate limiting & security                     │
│  - Error handling                               │
└─────────────────────────────────────────────────┘
                      ↓
           Supabase Client
                      ↓
┌─────────────────────────────────────────────────┐
│  Database (Supabase PostgreSQL)                 │
│                                                 │
│  - Tables: users, events, bookings              │
│  - View: events_with_price                      │
│  - RPC: book_tickets, cancel_booking            │
└─────────────────────────────────────────────────┘
```

---

## 🚀 How to Run

### 1. Start Backend (Terminal 1)
```bash
cd d:\ABC
npm start
```
Backend will run on **http://localhost:5000**

### 2. Start Frontend (Terminal 2)
```bash
cd "d:\ABC\frontend abc\smart-campus-ticketing"
npm run dev
```
Frontend will run on **http://localhost:3000**

### 3. Open Browser
Navigate to: **http://localhost:3000**

---

## 🔗 API Integration

### Frontend API Configuration

Location: `frontend abc/smart-campus-ticketing/src/api.js`

```javascript
const API_URL = 'http://localhost:5000'
const USE_MOCK = false  // Using real backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auto-adds JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-redirects to sign-in on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)
```

### API Service Methods

The frontend has pre-built methods for all backend endpoints:

```javascript
// Authentication
apiService.mockGoogleLogin({ email, name, avatar })
apiService.getMe()

// Events (Public)
apiService.getEvents({ q, category, upcoming, sort, page, limit })
apiService.getEvent(id)

// Events (Protected - Organizer)
apiService.createEvent(eventData)
apiService.updateEvent(id, eventData)
apiService.deleteEvent(id)
apiService.getMyEvents()
apiService.getEventStats(eventId)

// Bookings (Protected)
apiService.bookEvent(eventId, quantity)
apiService.getMyBookings()
apiService.cancelBooking(bookingId)
```

---

## 🔐 Authentication Flow

### 1. User Signs In
```
Frontend                     Backend                      Database
   |                           |                             |
   |-- POST /api/auth/        |                             |
   |   mock-google            |                             |
   |   {email, name, avatar}  |                             |
   |                          |-- Upsert user by email ---->|
   |                          |<---- User record -----------|
   |                          |-- Generate JWT token        |
   |<-- {token, user} --------|                             |
   |                          |                             |
   |-- Store in localStorage  |                             |
   |   - token                |                             |
   |   - user                 |                             |
```

### 2. Authenticated Requests
```
Frontend                     Backend                      
   |                           |                           
   |-- GET /api/my/bookings   |                           
   |   Authorization: Bearer  |                           
   |   <token>                |-- Verify JWT token        
   |                          |-- Extract userId          
   |                          |-- Fetch user's bookings   
   |<-- {data: [...]} --------|                           
```

### 3. Token Expiry / Logout
- JWT expires after **7 days**
- On 401 response, frontend auto-redirects to sign-in
- User can manually log out (clears localStorage)

---

## 📡 API Endpoints Used by Frontend

### Public Routes
| Method | Endpoint | Frontend Usage |
|--------|----------|----------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/events` | Browse events page |
| `GET` | `/api/events/:id` | Event details page |

### Authentication
| Method | Endpoint | Frontend Usage |
|--------|----------|----------------|
| `POST` | `/api/auth/mock-google` | Sign in page |
| `GET` | `/api/auth/me` | Load current user |

### User Actions (Protected)
| Method | Endpoint | Frontend Usage |
|--------|----------|----------------|
| `POST` | `/api/events` | Create event (organizers) |
| `PATCH` | `/api/events/:id` | Edit event (organizers) |
| `DELETE` | `/api/events/:id` | Delete event (organizers) |
| `POST` | `/api/events/:id/book` | Book tickets button |
| `GET` | `/api/my/bookings` | My bookings page |
| `DELETE` | `/api/bookings/:id` | Cancel booking button |
| `GET` | `/api/my/events` | Organizer dashboard |
| `GET` | `/api/events/:id/stats` | Event analytics |

---

## 🎨 Frontend Features

### Pages
1. **Landing Page** (`/`) - Hero section, featured events
2. **Events Page** (`/events`) - Browse all events with filters
3. **Event Details** (`/events/:id`) - View event, book tickets
4. **Sign In** (`/signin`) - Mock Google authentication
5. **Dashboard** (`/dashboard`) - User bookings & created events
6. **Not Found** (`/404`) - 404 error page

### Key Components
- **Navbar** - Navigation with auth state
- **EventCard** - Event preview with price info
- **BookingCard** - User's ticket with QR code
- **EventForm** - Create/edit event
- **ProtectedRoute** - Auth guard for private pages

### Context Providers
- **AuthContext** - User state, login/logout
- **ThemeContext** - Light/dark mode (if implemented)

---

## 🛡️ CORS Configuration

Backend allows requests from:
- `http://localhost:3000` ✅ (Frontend dev server)
- `http://localhost:5173` ✅ (Vite default)
- `CLIENT_ORIGIN` from `.env` (Production frontend)

```javascript
// Backend: server.js
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      config.clientOrigin,
      'http://localhost:5173',
      'http://localhost:3000'
    ]
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}
```

---

## 📦 Data Flow Examples

### Example 1: Booking a Ticket

```
User clicks "Book Ticket" on Event Details page
   ↓
Frontend: apiService.bookEvent(eventId, quantity)
   ↓
POST http://localhost:5000/api/events/{id}/book
Headers: Authorization: Bearer <token>
Body: { quantity: 2 }
   ↓
Backend: Verifies JWT, calls book_tickets RPC
   ↓
Database: Row lock, check availability, calculate price, create booking
   ↓
Backend returns: { id, eventId, quantity, unitPrice, totalPrice, qrData, ... }
   ↓
Frontend: Shows success toast, updates UI
```

### Example 2: Viewing My Bookings

```
User navigates to Dashboard
   ↓
Frontend: apiService.getMyBookings()
   ↓
GET http://localhost:5000/api/my/bookings
Headers: Authorization: Bearer <token>
   ↓
Backend: Verifies JWT, queries bookings for userId
   ↓
Database: Returns bookings with JOIN on events table
   ↓
Backend formats response with camelCase
   ↓
Frontend: Renders BookingCard components with QR codes
```

### Example 3: Real-time Price Updates

```
User views Event Details
   ↓
Frontend: apiService.getEvent(id)
   ↓
GET http://localhost:5000/api/events/{id}
   ↓
Backend: Queries events_with_price VIEW
   ↓
Database VIEW calculates:
- remaining = capacity - tickets_sold
- surge_active = remaining < (capacity * 0.2)
- current_price = surge_active ? base_price * 1.25 : base_price
   ↓
Backend returns event with currentPrice, surgeActive, remaining
   ↓
Frontend displays: "Price: $125 (Surge Pricing Active)"
```

---

## 🧪 Testing the Integration

### 1. Test Authentication
```bash
# Open browser: http://localhost:3000
# Click "Sign In"
# Enter any email (e.g., test@campus.edu)
# Should redirect to dashboard with user info displayed
```

### 2. Test Event Browsing
```bash
# Navigate to "Events" page
# Should see list of events from database
# Click on an event to view details
# Should show current price, surge status, remaining tickets
```

### 3. Test Booking Flow
```bash
# On Event Details page, enter quantity (1-5)
# Click "Book Tickets"
# Should see success message
# Navigate to Dashboard
# Should see new booking with QR code
```

### 4. Test Organizer Features
```bash
# Sign in (user becomes organizer)
# Click "Create Event" button
# Fill form, submit
# Should see new event in "My Events" section
# Click "Stats" to view analytics
```

### 5. Test Error Handling
```bash
# Try booking with quantity > maxPerUser
# Should see error toast: "Maximum X tickets per user"
# Try booking sold-out event
# Should see error: "Event is sold out"
```

---

## 🐛 Troubleshooting

### Issue: CORS Error in Browser Console
**Solution**: Ensure backend is running and allows `http://localhost:3000`

### Issue: 401 Unauthorized
**Solution**: 
- Check JWT token is stored in localStorage
- Token might be expired (7 days)
- Sign in again

### Issue: Events Not Loading
**Solution**:
- Check backend is running on port 5000
- Check `.env` has `VITE_USE_MOCK=false`
- Verify Supabase connection

### Issue: Booking Fails
**Solution**:
- Ensure RPC function `book_tickets` exists in database
- Check user is authenticated
- Verify event has available tickets

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
SUPABASE_URL=https://byxgdddchiqlhvaupecg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_secure_random_string
CLIENT_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK=false
```

---

## 🚀 Production Deployment

### Backend Deployment
1. Deploy backend to Render/Railway/Heroku
2. Set all environment variables
3. Note the production URL (e.g., `https://api.example.com`)

### Frontend Deployment
1. Update `.env.production`:
   ```env
   VITE_API_URL=https://api.example.com
   VITE_USE_MOCK=false
   ```
2. Build frontend: `npm run build`
3. Deploy `dist/` folder to Netlify/Vercel/Cloudflare

### Update Backend CORS
Update `CLIENT_ORIGIN` in backend `.env`:
```env
CLIENT_ORIGIN=https://your-frontend.netlify.app
```

---

## 🎉 Summary

✅ **Frontend**: React + Vite on port 3000  
✅ **Backend**: Node.js + Express on port 5000  
✅ **Database**: Supabase PostgreSQL  
✅ **CORS**: Configured for localhost:3000  
✅ **Auth**: JWT with localStorage  
✅ **API**: All endpoints connected  
✅ **Mock Mode**: Disabled (using real backend)  

**Both servers are running and integrated!**

Open **http://localhost:3000** to use the application.
