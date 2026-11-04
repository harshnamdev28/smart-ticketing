# Quick Setup Guide

## Installation Steps

### 1. Install Dependencies

Open a terminal in the `smart-campus-ticketing` folder and run:

```bash
npm install
```

This will install all required packages:
- React and React DOM
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- QRCode.react for QR code generation
- Vite for development and building

### 2. Verify Environment

The `.env` file is already configured with:
```
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK=true
```

**VITE_USE_MOCK=true** means the app will use local mock data stored in localStorage. This lets you test the full application without a backend server.

### 3. Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### 4. Test the Application

#### As a Student:
1. Open `http://localhost:3000`
2. Browse events on the homepage
3. Click "Explore Events" to see all events
4. Click any event to view details
5. Click "Sign In with Google" (it's a mock - any click generates a test user)
6. After signing in, book tickets for an event
7. Go to Dashboard → My Bookings to see your tickets
8. Click "View QR Code" to see your ticket QR code

#### As an Organizer:
1. Sign in with the mock Google button
2. Go to Dashboard → Create Event tab
3. Fill in the event details:
   - Title: "My Test Event"
   - Description: "This is a test event for demonstration"
   - Category: Choose any
   - Venue: "Test Venue"
   - Image URL: Use any image URL (e.g., from Unsplash)
   - Date: Pick a future date
   - Base Price: 100
   - Capacity: 50
   - Max Per User: 5
4. Click "Create Event"
5. Go to "My Events" tab to see your event
6. Click "View Stats" to see detailed statistics

### 5. Test Dynamic Pricing

To see dynamic pricing in action:

1. Create or select an event with capacity of 100
2. Book tickets until fewer than 20 tickets remain
3. The price will automatically increase by 25%
4. The event card will show a "🔥 Price up +25%" badge

### 6. Build for Production

```bash
npm run build
```

This creates optimized files in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Features to Test

### ✅ Navigation
- Homepage with hero section and trending events
- Events page with search and filters
- Event details page with live polling (updates every 5 seconds)
- Sign in page
- Dashboard with three tabs
- 404 page for invalid routes

### ✅ Authentication
- Mock Google sign in (generates random user)
- Protected routes (dashboard requires login)
- Auto-logout on 401 errors
- User info in navbar

### ✅ Event Browsing
- Category filters (All, Tech, Cultural, Sports, Workshop)
- Search by title or description
- Sort by date
- Responsive grid layout
- Event cards with progress bars

### ✅ Event Details
- Live polling every 5 seconds
- Countdown timer ("Starts in 3d 4h")
- Quantity picker
- Real-time price updates
- Surge pricing indicator
- Seat availability progress bar

### ✅ Booking
- Add to cart with quantity
- Validation for sold out events
- Validation for max tickets per user
- Success/error toast notifications
- Redirect to dashboard after booking

### ✅ Dashboard
**My Bookings:**
- List all bookings
- View QR codes
- Cancel bookings
- Show booking status (confirmed/cancelled/completed)

**My Events:**
- List events created by user
- View statistics
- See current price and surge status
- Track revenue and sales

**Create Event:**
- Form validation
- Live preview of surge pricing
- Date/time picker
- Category selection
- Dynamic price calculation

### ✅ Design
- Dark theme by default
- Dark mode toggle in navbar
- Purple/blue gradient accents
- Smooth hover animations
- Rounded cards
- Loading skeletons
- Empty states
- Error states with retry
- Toast notifications
- Responsive on all screen sizes

### ✅ Accessibility
- Keyboard navigation
- ARIA labels
- Alt text on images
- Good color contrast
- Focus indicators

## Troubleshooting

### Port Already in Use

If port 3000 is taken, Vite will automatically use the next available port (3001, 3002, etc.)

### Clear Mock Data

To reset all mock data (events, bookings, user):

1. Open browser developer tools (F12)
2. Go to Application → Local Storage
3. Clear all items for `http://localhost:3000`
4. Refresh the page

### Styling Issues

If styles don't load properly:

1. Stop the dev server (Ctrl+C)
2. Delete `node_modules` folder
3. Run `npm install` again
4. Start dev server: `npm run dev`

## Project Structure Overview

```
src/
├── api.js                    # All API calls (mock + real)
├── App.jsx                   # Main app with routing
├── main.jsx                  # Entry point
├── index.css                 # Global Tailwind styles
│
├── components/
│   ├── dashboard/            # Dashboard components
│   │   ├── MyBookings.jsx   # Bookings tab
│   │   ├── MyEvents.jsx     # Organizer events tab
│   │   └── CreateEvent.jsx  # Create event form
│   ├── EventCard.jsx        # Event card component
│   ├── Navbar.jsx           # Top navigation
│   ├── Footer.jsx           # Footer component
│   ├── Modal.jsx            # Reusable modal
│   ├── ErrorState.jsx       # Error display
│   ├── EmptyState.jsx       # Empty state display
│   ├── EventCardSkeleton.jsx # Loading skeleton
│   └── ProtectedRoute.jsx   # Auth route guard
│
├── context/
│   ├── AuthContext.jsx      # Authentication state
│   └── ThemeContext.jsx     # Theme state (dark mode)
│
├── lib/
│   ├── mockAPI.js           # Mock backend implementation
│   └── utils.js             # Helper functions (formatCurrency, etc.)
│
└── pages/
    ├── Landing.jsx          # Homepage
    ├── Events.jsx           # Events listing
    ├── EventDetails.jsx     # Event details page
    ├── SignIn.jsx           # Sign in page
    ├── Dashboard.jsx        # Dashboard layout
    └── NotFound.jsx         # 404 page
```

## Next Steps

### Connect to Real Backend

1. Build a backend API with the endpoints listed in README.md
2. Update `.env`:
   ```
   VITE_API_URL=https://your-api.com
   VITE_USE_MOCK=false
   ```
3. Implement actual Google OAuth in the backend
4. Deploy both frontend and backend

### Additional Features to Add

- Payment integration (Razorpay, Stripe)
- Email notifications
- Event categories management
- User profiles
- Event reviews and ratings
- Social sharing
- Event reminders
- Attendance tracking
- Refund policies
- Admin panel

## Support

If you encounter any issues:

1. Check the browser console for errors (F12 → Console)
2. Check the terminal for build errors
3. Verify all files are in the correct locations
4. Make sure Node.js version is 16 or higher: `node --version`
5. Try clearing browser cache and localStorage

## Success Checklist

- [ ] `npm install` completed without errors
- [ ] Dev server starts successfully
- [ ] Homepage loads with 3 trending events
- [ ] Can navigate to Events page
- [ ] Can sign in with mock Google
- [ ] Can view event details
- [ ] Can book a ticket (after sign in)
- [ ] Can see booking in Dashboard
- [ ] Can view QR code
- [ ] Can create a new event
- [ ] Can see event stats
- [ ] Dark mode toggle works
- [ ] Mobile responsive (test by resizing browser)

---

**Enjoy building with Smart Campus Ticketing! 🎉**
