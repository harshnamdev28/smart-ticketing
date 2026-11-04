# Smart Campus Ticketing

A modern, production-quality, responsive web application for campus event ticketing with dynamic pricing. Built with React, Vite, and Tailwind CSS.

![Smart Campus Ticketing](https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200)

## ✨ Features

### For Students
- **Browse Events**: Discover campus events across different categories (Tech, Cultural, Sports, Workshop)
- **Smart Pricing**: Dynamic pricing that increases by 25% when fewer than 20% of tickets remain
- **Easy Booking**: Simple and secure ticket booking process
- **QR Tickets**: Digital tickets with QR codes for easy venue entry
- **Booking Management**: View and manage all your bookings in one place

### For Organizers
- **Create Events**: Easy-to-use form to create and publish events
- **Real-time Stats**: Track ticket sales, revenue, and attendance
- **Dynamic Pricing**: Automatic surge pricing based on availability
- **Event Analytics**: Detailed statistics and insights for each event

### Technical Features
- **Responsive Design**: Beautiful UI that works perfectly on mobile and desktop
- **Dark Mode**: Built-in dark mode with toggle
- **Live Updates**: Event details poll every 5 seconds to show real-time availability
- **Mock Mode**: Fully functional mock backend for development and testing
- **Production Ready**: Error handling, loading states, toast notifications, and more

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd smart-campus-ticketing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The project includes a `.env` file with default settings:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_USE_MOCK=true
   ```
   
   - `VITE_USE_MOCK=true` - Uses local mock data (recommended for development)
   - `VITE_USE_MOCK=false` - Connects to real backend API

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
smart-campus-ticketing/
├── public/              # Static assets
├── src/
│   ├── api.js          # API service layer (all API calls)
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   ├── index.css       # Global styles with Tailwind
│   ├── components/     # Reusable components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   │   ├── MyBookings.jsx
│   │   │   ├── MyEvents.jsx
│   │   │   └── CreateEvent.jsx
│   │   ├── EventCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Modal.jsx
│   │   ├── ErrorState.jsx
│   │   ├── EmptyState.jsx
│   │   ├── EventCardSkeleton.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/        # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── lib/           # Utility functions
│   │   ├── mockAPI.js # Mock backend implementation
│   │   └── utils.js   # Helper functions
│   └── pages/         # Page components
│       ├── Landing.jsx
│       ├── Events.jsx
│       ├── EventDetails.jsx
│       ├── SignIn.jsx
│       ├── Dashboard.jsx
│       └── NotFound.jsx
├── .env               # Environment variables
├── .env.example       # Example environment file
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── README.md          # This file
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Dark blue (#1e3a8a) to Purple (#581c87) gradient
- **Accent**: Blue (#6366f1) to Purple (#764ba2) gradient
- **Background**: Dark theme with gray-950 base
- **Cards**: Gray-900 with gray-800 borders

### Components
- Rounded cards with smooth hover animations
- Progress bars with gradient fills
- Toast notifications for user feedback
- Loading skeletons for better UX
- QR code generation for tickets

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Mock API Features

The mock API simulates a real backend with all the following features:

- **Persistent Storage**: Uses localStorage to maintain state
- **Dynamic Pricing**: Automatically calculates surge pricing at 20% threshold
- **Sold Out Handling**: Proper error responses when events are full
- **Booking Limits**: Enforces maximum tickets per user
- **8 Pre-loaded Events**: Sample events across all categories
- **User Management**: Mock Google authentication

### Mock API Rules

1. **Surge Pricing**: When remaining tickets < 20% of capacity, price increases by 25%
2. **Booking Limits**: Users cannot exceed maxPerUser tickets per event
3. **Sold Out**: Returns 409 SOLD_OUT error when no tickets remain
4. **Real-time Updates**: Event details refresh every 5 seconds

## 🌐 API Integration

To connect to a real backend, update the `.env` file:

```env
VITE_API_URL=https://your-backend-api.com
VITE_USE_MOCK=false
```

### Expected API Endpoints

All API calls are centralized in `src/api.js`:

#### Auth
- `POST /api/auth/mock-google` - Mock Google authentication
- `GET /api/auth/me` - Get current user

#### Events
- `GET /api/events` - List events (supports query params)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (protected)
- `PATCH /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

#### Bookings
- `POST /api/events/:id/book` - Book tickets (protected)
- `GET /api/my/bookings` - User's bookings (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

#### Organizer
- `GET /api/my/events` - Events created by user (protected)
- `GET /api/events/:id/stats` - Event statistics (protected)

## 🎯 Key Features Implemented

### Accessibility
✅ Proper ARIA labels and roles  
✅ Keyboard navigation support  
✅ Good color contrast ratios  
✅ Alt text for images  
✅ Focus indicators  

### User Experience
✅ Loading skeletons for better perceived performance  
✅ Empty states with helpful messages  
✅ Error states with retry buttons  
✅ Toast notifications for all actions  
✅ Disabled states for buttons during loading  
✅ Form validation with clear error messages  

### Performance
✅ Debounced search (500ms)  
✅ Efficient re-renders with React context  
✅ Optimized images  
✅ Code splitting with React Router  

### Security
✅ Protected routes for authenticated pages  
✅ Token-based authentication  
✅ Logout on 401 responses  
✅ Input validation and sanitization  

## 🎭 Usage

### As a Student

1. **Browse Events**: Visit the homepage or Events page
2. **View Details**: Click on any event to see full details
3. **Sign In**: Click "Sign In with Google" (mock authentication)
4. **Book Tickets**: Select quantity and click "Book Now"
5. **View Bookings**: Go to Dashboard → My Bookings
6. **Show QR Code**: Click "View QR Code" on any booking

### As an Organizer

1. **Sign In**: Use the mock Google sign-in
2. **Create Event**: Dashboard → Create Event tab
3. **Fill Details**: Complete the event form with all required information
4. **View Stats**: Dashboard → My Events → View Stats button
5. **Monitor Sales**: Real-time updates on ticket sales and revenue

## 🔥 Dynamic Pricing Example

**Base Price**: ₹500  
**Capacity**: 100 tickets  
**Surge Threshold**: 20 tickets (20% of capacity)  

- **81-100 tickets available**: ₹500 (base price)
- **1-20 tickets available**: ₹625 (base + 25%)
- **0 tickets available**: Sold Out

## 📱 Responsive Design

The application is fully responsive and tested on:

- **Mobile**: iPhone, Android phones (320px - 640px)
- **Tablet**: iPad, Android tablets (641px - 1024px)
- **Desktop**: Laptops, large screens (1025px+)

## 🎨 Theme Toggle

Built-in dark mode toggle in the navbar. The theme preference is saved in localStorage and persists across sessions.

## 🐛 Error Handling

Comprehensive error handling for:

- Network failures
- API errors (400, 401, 403, 404, 409)
- Form validation errors
- Booking conflicts (sold out, limit reached)
- Invalid routes (404 page)

## 📦 Dependencies

### Core
- `react` & `react-dom` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `react-hot-toast` - Toast notifications
- `qrcode.react` - QR code generation

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `autoprefixer` & `postcss` - CSS processing

## 📄 License

This project is created for educational purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify as needed.

## 📞 Support

For questions or issues, please open an issue on the repository.

---

**Built with ❤️ for Smart Campus**
