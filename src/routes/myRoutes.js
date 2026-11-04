import express from 'express';
import { bookingController } from '../controllers/bookingController.js';
import { eventController } from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All /my routes require authentication
router.use(authenticate);

router.get('/bookings', bookingController.getUserBookings);
router.get('/events', eventController.getOrganizerEvents);

export default router;
