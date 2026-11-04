# 🎓 Smart Campus Ticketing System

A full-stack event ticketing platform with **dynamic surge pricing** and **concurrency-safe booking** for campus events.

---

## 👥 Team Information

**Team Name:** Technoobs

**Team Members:**
- **Shray Gupta** - Full Stack Developer
- **Harsh Namdev** - Full Stack Developer

**Project Duration:** November 2026  
**Institution:** Campus Project

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Contributors](#contributors)

---

## 🎯 Overview

Smart Campus Ticketing is a modern, production-ready event management system designed for educational institutions. It enables students to discover and book tickets for campus events while providing organizers with powerful tools to manage their events.

### Key Highlights

- 💰 **Dynamic Pricing**: Automatic 25% price increase when < 20% tickets remain
- 🔒 **Concurrency Safe**: Database-level locks prevent double-booking
- 📱 **Responsive Design**: Mobile-first UI built with React and TailwindCSS
- 🎟️ **QR Tickets**: Unique QR codes for secure event entry
- 📊 **Real-time Analytics**: Live stats for event organizers
- 🔐 **Secure Auth**: JWT-based authentication with 7-day expiry

---

## ✨ Key Features

### For Students
- 📅 Browse upcoming events with search and filters
- 💳 Book tickets with real-time availability
- 📲 View QR codes for event entry
- 🎫 Manage bookings and cancellations
- 💰 See live pricing with surge indicators

### For Organizers
- ➕ Create and manage events
- 📊 View detailed analytics and statistics
- 💵 Track revenue and ticket sales
- 📈 Monitor surge pricing activation
- ✏️ Update event details

### Platform Features
- 🌙 Dark mode UI design
- 🔔 Real-time toast notifications
- 🛡️ Rate limiting and security hardening
- 📱 Fully responsive across devices
- ⚡ Fast page loads with optimized assets

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.0.8 | Build Tool & Dev Server |
| React Router | 6.20.0 | Client-side Routing |
| Axios | 1.6.2 | HTTP Client |
| TailwindCSS | 3.3.6 | Styling Framework |
| React Hot Toast | 2.4.1 | Notifications |
| QRCode.react | 3.1.0 | QR Code Generation |
| Lucide React | 0.294.0 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime Environment |
| Express | 4.18.2 | Web Framework |
| Supabase JS | 2.39.3 | Database Client |
| JSON Web Token | 9.0.2 | Authentication |
| Zod | 3.22.4 | Schema Validation |
| Helmet | 7.1.0 | Security Headers |
| CORS | 2.8.5 | Cross-Origin Requests |
| Morgan | 1.10.0 | HTTP Logger |
| QRCode | 1.5.3 | QR Code Generation |
| Express Rate Limit | 7.1.5 | Rate Limiting |

### Database & Infrastructure
| Technology | Purpose |
|------------|---------|
| Supabase (PostgreSQL) | Primary Database |
| PostgreSQL Views | Dynamic Price Calculation |
| RPC Functions | Concurrency Control |
| Docker | Containerization (optional) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│  React Frontend (Port 3000)                     │
│  - React Router for navigation                  │
│  - Axios interceptors for auth                  │
│  - Context API for state management             │
│  - TailwindCSS for responsive design            │
└─────────────────────────────────────────────────┘
                      ↓
              HTTP Requests
           (localhost:5000/api)
                      ↓
┌─────────────────────────────────────────────────┐
│  Node.js Backend (Port 5000)                    │
│  - Express REST API                             │
│  - JWT middleware for auth                      │
│  - Rate limiting & CORS                         │
│  - Zod validation                               │
│  - Centralized error handling                   │
└─────────────────────────────────────────────────┘
                      ↓
              Supabase Client
                      ↓
┌─────────────────────────────────────────────────┐
│  Supabase PostgreSQL Database                   │
│  - Tables: users, events, bookings              │
│  - View: events_with_price (surge logic)        │
│  - RPC: book_tickets (atomic booking)           │
│  - RPC: cancel_booking (rollback)               │
└─────────────────────────────────────────────────┘
```

---

## 📥 Installation & Setup

### Prerequisites

Before starting, ensure you have:
- **Node.js** 20 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([Sign up](https://supabase.com/))

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ABC
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory (if not already there)
cd d:\ABC

# Install dependencies
npm install
```

### Step 3: Backend Environment Configuration

Create a `.env` file in the root directory (`d:\ABC\.env`):

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_secure_random_secret_key
CLIENT_ORIGIN=http://localhost:3000
```

**Important Notes:**
- Replace `SUPABASE_URL` with your Supabase project URL
- Replace `SUPABASE_SERVICE_ROLE_KEY` with your service role key (found in Supabase Project Settings → API)
- Generate a strong random string for `JWT_SECRET` (at least 32 characters)
- `CLIENT_ORIGIN` should match your frontend URL

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory
cd "d:\ABC\frontend abc\smart-campus-ticketing"

# Install dependencies
npm install
```

### Step 5: Frontend Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK=false
```

**Important:** Set `VITE_USE_MOCK=false` to use the real backend (not mock data)

### Step 6: Database Setup

Your Supabase database should already have:
- ✅ Tables: `users`, `events`, `bookings`
- ✅ View: `events_with_price`
- ✅ RPC functions: `book_tickets`, `cancel_booking`

### Step 7: Seed Demo Data (Optional)

```bash
cd d:\ABC
npm run seed
```

This creates:
- 2 demo users (Alice Johnson, Bob Smith)
- 8 sample events with various categories and prices

---

## 🚀 Running the Application

### Option 1: Manual Start (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd d:\ABC
npm start
```
✅ Backend running at: **http://localhost:5000**

**Terminal 2 - Start Frontend:**
```bash
cd "d:\ABC\frontend abc\smart-campus-ticketing"
npm run dev
```
✅ Frontend running at: **http://localhost:3000**

**Open your browser:** http://localhost:3000

### Option 2: Using PowerShell Script

```powershell
cd d:\ABC
.\start-dev.ps1
```

This starts both servers automatically. Press `Ctrl+C` to stop both.

---

## 🧪 Testing

### Automated Tests

```bash
cd d:\ABC

# Test concurrency safety (10 users, 1 ticket)
npm run test:concurrency
# Expected: 1 success, 9 get 409 SOLD_OUT

# Test surge pricing logic
npm run test:price
# Expected: Price increases at <20% remaining
```

### Manual Testing Checklist

#### 1. Authentication Flow
- [ ] Open http://localhost:3000
- [ ] Click "Sign In"
- [ ] Enter email: `test@campus.edu`
- [ ] Should redirect to dashboard
- [ ] Check browser console for errors

#### 2. Browse Events
- [ ] Navigate to "Events" page
- [ ] Should see list of events from database
- [ ] Test search functionality
- [ ] Test category filters
- [ ] Test sorting options

#### 3. Book Tickets
- [ ] Click on any event
- [ ] Enter quantity (1-5)
- [ ] Click "Book Tickets"
- [ ] Should see success message
- [ ] Navigate to Dashboard → "My Bookings"
- [ ] Should see new booking with QR code

#### 4. View QR Code
- [ ] In "My Bookings", click "View QR Code"
- [ ] Should display QR code in modal
- [ ] QR code should be scannable

#### 5. Cancel Booking
- [ ] Click "Cancel Booking" on a ticket
- [ ] Confirm cancellation
- [ ] Booking status should change to "Cancelled"

#### 6. Organizer Features
- [ ] Navigate to Dashboard → "Create Event"
- [ ] Fill in event details
- [ ] Submit form
- [ ] Event should appear in "My Events"
- [ ] Click "View Stats" to see analytics

#### 7. Surge Pricing
- [ ] Find an event with < 20% tickets remaining
- [ ] Should show "Surge Pricing Active" badge
- [ ] Price should be 25% higher than base price

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a JWT token in the header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Overview

#### Public Endpoints

```http
GET  /api/health                    # Health check
GET  /api/events                    # List all events
GET  /api/events/:id                # Get event details
```

#### Authentication Endpoints

```http
POST /api/auth/mock-google          # Sign in (mock OAuth)
GET  /api/auth/me                   # Get current user
```

#### Protected Endpoints (Students)

```http
POST   /api/events/:id/book         # Book tickets
GET    /api/my/bookings             # View my bookings
DELETE /api/bookings/:id            # Cancel booking
GET    /api/bookings/:id/qr         # Get QR code
```

#### Protected Endpoints (Organizers)

```http
POST   /api/events                  # Create event
PATCH  /api/events/:id              # Update event
DELETE /api/events/:id              # Delete event
GET    /api/my/events               # View my events
GET    /api/events/:id/stats        # View event stats
```

For detailed request/response examples, see the `api.http` file.

---

## 🗄️ Database Schema

### Tables

#### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | User's full name |
| email | VARCHAR | Unique email address |
| avatar | VARCHAR | Profile image URL |

#### events
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| organizer_id | UUID | FK to users |
| title | VARCHAR | Event name |
| description | TEXT | Event details |
| category | VARCHAR | Event category |
| venue | VARCHAR | Location |
| image | VARCHAR | Event image URL |
| date | TIMESTAMP | Event date/time |
| base_price | NUMERIC | Original price |
| capacity | INTEGER | Total tickets |
| tickets_sold | INTEGER | Tickets booked |
| max_per_user | INTEGER | Booking limit per user |

#### bookings
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_id | UUID | FK to events |
| user_id | UUID | FK to users |
| quantity | INTEGER | Number of tickets |
| unit_price | NUMERIC | Price per ticket |
| total_price | NUMERIC | Total cost |
| qr_data | VARCHAR | QR code data |
| status | VARCHAR | confirmed/cancelled |
| created_at | TIMESTAMP | Booking time |

### Views

#### events_with_price
Extends `events` table with calculated fields:
- `remaining`: Available tickets (capacity - tickets_sold)
- `surge_active`: Boolean (remaining < capacity * 0.2)
- `current_price`: Base price or surge price (base * 1.25)

### RPC Functions

#### book_tickets(p_event, p_user, p_qty)
- Atomically books tickets with row-level lock
- Validates availability and user limits
- Calculates current price with surge logic
- Creates booking record with QR code
- Returns booking details or error

#### cancel_booking(p_booking, p_user)
- Verifies booking ownership
- Checks if already cancelled
- Returns tickets to available pool
- Updates booking status
- Returns success or error

---

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables:
   - `PORT=5000`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `CLIENT_ORIGIN` (your frontend URL)
   - `NODE_ENV=production`
4. Deploy

### Frontend Deployment (Netlify/Vercel)

1. Build the frontend:
   ```bash
   cd "d:\ABC\frontend abc\smart-campus-ticketing"
   npm run build
   ```

2. Deploy the `dist/` folder

3. Set environment variables:
   - `VITE_API_URL` (your backend URL)
   - `VITE_USE_MOCK=false`

4. Update backend `CLIENT_ORIGIN` to your frontend URL

For detailed deployment instructions, see `DEPLOYMENT.md`

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Server won't start
- **Solution**: Check all environment variables are set in `.env`
- Verify Supabase credentials are correct
- Ensure port 5000 is not in use

**Problem:** Database connection errors
- **Solution**: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project is active
- Ensure service role key (not anon key) is used

### Frontend Issues

**Problem:** Blank page or loading forever
- **Solution**: Check browser console for errors
- Verify backend is running on port 5000
- Ensure `VITE_USE_MOCK=false` in `.env`

**Problem:** CORS errors in console
- **Solution**: Ensure backend is running
- Check backend CORS allows `localhost:3000`
- Verify `CLIENT_ORIGIN` in backend `.env`

**Problem:** Dashboard not showing bookings/events
- **Solution**: This has been fixed! Refresh the page
- Sign out and sign in again
- Clear browser cache

### Authentication Issues

**Problem:** 401 Unauthorized errors
- **Solution**: Token expired (7 days)
- Sign in again
- Check `JWT_SECRET` is set in backend

**Problem:** Can't sign in
- **Solution**: Check backend logs for errors
- Verify Supabase connection
- Ensure users table exists

### Booking Issues

**Problem:** Booking fails with 500 error
- **Solution**: Verify `book_tickets` RPC function exists
- Check event has available tickets
- Ensure user is authenticated

---

## 📁 Project Structure

```
d:\ABC\
├── frontend abc/
│   └── smart-campus-ticketing/          ← Frontend Application
│       ├── src/
│       │   ├── components/              - Reusable UI components
│       │   │   ├── dashboard/           - Dashboard specific components
│       │   │   │   ├── MyBookings.jsx   - User bookings display
│       │   │   │   ├── MyEvents.jsx     - Organizer events
│       │   │   │   └── CreateEvent.jsx  - Event creation form
│       │   │   ├── Navbar.jsx           - Navigation bar
│       │   │   ├── EventCard.jsx        - Event preview card
│       │   │   ├── Modal.jsx            - Modal component
│       │   │   ├── EmptyState.jsx       - Empty state UI
│       │   │   └── ProtectedRoute.jsx   - Auth guard
│       │   ├── context/
│       │   │   ├── AuthContext.jsx      - Auth state management
│       │   │   └── ThemeContext.jsx     - Theme state
│       │   ├── pages/
│       │   │   ├── Landing.jsx          - Home page
│       │   │   ├── Events.jsx           - Event listing
│       │   │   ├── EventDetails.jsx     - Event details & booking
│       │   │   ├── SignIn.jsx           - Login page
│       │   │   ├── Dashboard.jsx        - User dashboard
│       │   │   └── NotFound.jsx         - 404 page
│       │   ├── lib/
│       │   │   ├── utils.js             - Helper functions
│       │   │   └── mockAPI.js           - Mock data (unused)
│       │   ├── api.js                   - API service layer
│       │   ├── App.jsx                  - Root component
│       │   └── main.jsx                 - Entry point
│       ├── public/                      - Static assets
│       ├── .env                         - Frontend config
│       ├── index.html                   - HTML template
│       ├── package.json                 - Dependencies
│       ├── tailwind.config.js           - TailwindCSS config
│       └── vite.config.js               - Vite config
│
├── src/                                 ← Backend Source Code
│   ├── config/
│   │   ├── env.js                       - Environment validation
│   │   └── supabase.js                  - Supabase client
│   ├── middleware/
│   │   ├── auth.js                      - JWT verification
│   │   ├── errorHandler.js              - Error handling
│   │   └── rateLimiter.js               - Rate limiting
│   ├── routes/
│   │   ├── authRoutes.js                - Auth endpoints
│   │   ├── eventRoutes.js               - Event CRUD
│   │   ├── bookingRoutes.js             - Booking management
│   │   └── myRoutes.js                  - User-specific routes
│   ├── controllers/
│   │   ├── authController.js            - Auth logic
│   │   ├── eventController.js           - Event logic
│   │   └── bookingController.js         - Booking logic
│   ├── services/
│   │   ├── authService.js               - User management
│   │   ├── eventService.js              - Event business logic
│   │   └── bookingService.js            - Booking & QR codes
│   └── utils/
│       ├── asyncHandler.js              - Async error wrapper
│       └── errorMapper.js               - Error code mapping
│
├── scripts/
│   ├── seed.js                          - Demo data seeder
│   ├── concurrency-test.js              - Concurrency test
│   └── price-test.js                    - Surge pricing test
│
├── .env                                 - Backend configuration
├── .env.example                         - Config template
├── .gitignore                           - Git ignore rules
├── server.js                            - Express app entry
├── package.json                         - Backend dependencies
├── Dockerfile                           - Docker configuration
├── start-dev.ps1                        - Development startup script
│
└── Documentation/
    ├── README.md                        - This file
    ├── QUICK_START.md                   - Quick start guide
    ├── INTEGRATION_GUIDE.md             - Integration details
    ├── DEPLOYMENT.md                    - Deployment guide
    ├── TEST_RESULTS.md                  - Test summary
    └── api.http                         - API examples
```

---

## 🎓 Learning Resources

### Technologies Used

- **React**: https://react.dev/
- **Node.js**: https://nodejs.org/
- **Express**: https://expressjs.com/
- **Supabase**: https://supabase.com/docs
- **TailwindCSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/

### Project Documentation

- `QUICK_START.md` - Get started in 5 minutes
- `INTEGRATION_GUIDE.md` - Frontend-backend integration
- `DEPLOYMENT.md` - Production deployment
- `TEST_RESULTS.md` - Test verification
- `api.http` - API endpoint examples

---

## 🤝 Contributing

### Team Members

**Shray Gupta**
- Role: Full Stack Developer
- Contributions: Backend API, Database Design, Testing

**Harsh Namdev**
- Role: Full Stack Developer
- Contributions: Frontend UI, Component Development, Integration

### Development Workflow

1. Create a feature branch
2. Make changes and test locally
3. Run tests: `npm run test:concurrency` and `npm run test:price`
4. Submit pull request
5. Code review by team
6. Merge to main

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Supabase** for the excellent database platform
- **React Team** for the amazing UI library
- **Vite** for lightning-fast development
- **TailwindCSS** for the utility-first CSS framework
- Campus community for testing and feedback

---

## 📞 Contact & Support

**Team Technoobs**

For questions or support:
- Create an issue in the repository
- Contact team members directly
- Check documentation files for solutions

---

## 🎯 Project Status

✅ **Backend API**: Fully functional  
✅ **Frontend UI**: Complete and responsive  
✅ **Database**: Schema and functions operational  
✅ **Integration**: Frontend ↔ Backend connected  
✅ **Security**: Production-grade hardening  
✅ **Testing**: Concurrency and pricing verified  
✅ **Documentation**: Comprehensive guides available  
✅ **Dashboard**: Fixed and working  

**Status: Production Ready** 🎉

---

**Built with ❤️ by Team Technoobs**

Shray Gupta • Harsh Namdev

November 2026
