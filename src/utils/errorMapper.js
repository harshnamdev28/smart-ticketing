/**
 * Maps Supabase RPC errors to HTTP status codes
 */
export const mapSupabaseError = (errorMessage) => {
  const errorMap = {
    'INVALID_QTY': { status: 400, message: 'Invalid quantity' },
    'EVENT_NOT_FOUND': { status: 404, message: 'Event not found' },
    'EVENT_PAST': { status: 400, message: 'Cannot book tickets for past events' },
    'SOLD_OUT': { status: 409, message: 'Event is sold out' },
    'LIMIT_REACHED': { status: 409, message: 'Ticket limit per user reached' },
    'NOT_FOUND': { status: 404, message: 'Resource not found' },
    'ALREADY_CANCELLED': { status: 409, message: 'Booking already cancelled' }
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // Default to 500 for unknown errors
  return { status: 500, message: 'Internal server error' };
};
