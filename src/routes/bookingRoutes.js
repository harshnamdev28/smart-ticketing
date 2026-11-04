import express from 'express';
import { bookingController } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

router.delete('/:id', bookingController.cancelBooking);
router.get('/:id/qr', bookingController.getBookingQR);

export default router;
