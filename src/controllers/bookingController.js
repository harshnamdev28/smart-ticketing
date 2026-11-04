import { z } from 'zod';
import { bookingService } from '../services/bookingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const bookTicketsSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(5, 'Maximum 5 tickets per booking')
});

export const bookingController = {
  bookTickets: asyncHandler(async (req, res) => {
    const { id: eventId } = req.params;
    const validated = bookTicketsSchema.parse(req.body);
    
    const booking = await bookingService.bookTickets(
      eventId,
      req.user.userId,
      validated.quantity
    );
    
    res.status(201).json(booking);
  }),

  getUserBookings: asyncHandler(async (req, res) => {
    const bookings = await bookingService.getUserBookings(req.user.userId);
    res.status(200).json({ data: bookings });
  }),

  cancelBooking: asyncHandler(async (req, res) => {
    await bookingService.cancelBooking(req.params.id, req.user.userId);
    res.status(200).json({ message: 'Booking cancelled successfully' });
  }),

  getBookingQR: asyncHandler(async (req, res) => {
    const result = await bookingService.getBookingQR(req.params.id, req.user.userId);
    res.status(200).json(result);
  })
};
