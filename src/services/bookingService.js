import { supabase } from '../config/supabase.js';
import { mapSupabaseError } from '../utils/errorMapper.js';
import QRCode from 'qrcode';

export const bookingService = {
  async bookTickets(eventId, userId, quantity) {
    // Call the database function to handle concurrency-safe booking
    const { data, error } = await supabase.rpc('book_tickets', {
      p_event: eventId,
      p_user: userId,
      p_qty: quantity
    });

    if (error) {
      console.error('RPC error details:', JSON.stringify(error, null, 2));
      const mapped = mapSupabaseError(error.message);
      const err = new Error(mapped.message);
      err.status = mapped.status;
      throw err;
    }

    if (!data) {
      const err = new Error('Failed to create booking');
      err.status = 500;
      throw err;
    }

    // The RPC returns a single object, not an array
    const booking = data;

    return {
      id: booking.id,
      eventId: booking.event_id,
      quantity: booking.quantity,
      unitPrice: booking.unit_price,
      totalPrice: booking.total_price,
      qrData: booking.qr_data,
      status: booking.status,
      createdAt: booking.created_at
    };
  },

  async getUserBookings(userId) {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        event_id,
        quantity,
        unit_price,
        total_price,
        qr_data,
        status,
        created_at,
        event:event_id(
          id,
          title,
          description,
          category,
          venue,
          image,
          date,
          base_price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      const err = new Error('Failed to fetch bookings');
      err.status = 500;
      throw err;
    }

    return bookings.map(b => ({
      id: b.id,
      eventId: b.event_id,
      quantity: b.quantity,
      unitPrice: b.unit_price,
      totalPrice: b.total_price,
      qrData: b.qr_data,
      status: b.status,
      createdAt: b.created_at,
      event: b.event ? {
        id: b.event.id,
        title: b.event.title,
        description: b.event.description,
        category: b.event.category,
        venue: b.event.venue,
        image: b.event.image,
        date: b.event.date,
        basePrice: b.event.base_price
      } : null
    }));
  },

  async cancelBooking(bookingId, userId) {
    // Call the database function to handle cancellation
    const { data, error } = await supabase.rpc('cancel_booking', {
      p_booking: bookingId,
      p_user: userId
    });

    if (error) {
      console.error('RPC error:', error);
      const mapped = mapSupabaseError(error.message);
      const err = new Error(mapped.message);
      err.status = mapped.status;
      throw err;
    }

    return { success: true };
  },

  async getBookingQR(bookingId, userId) {
    // Verify ownership
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('qr_data, user_id')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      const err = new Error('Booking not found');
      err.status = 404;
      throw err;
    }

    if (booking.user_id !== userId) {
      const err = new Error('Not authorized to view this QR code');
      err.status = 403;
      throw err;
    }

    // Generate QR code as data URL
    try {
      const qrDataUrl = await QRCode.toDataURL(booking.qr_data);
      return { qrCode: qrDataUrl };
    } catch (err) {
      console.error('QR generation error:', err);
      const error = new Error('Failed to generate QR code');
      error.status = 500;
      throw error;
    }
  }
};
