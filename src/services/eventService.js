import { supabase } from '../config/supabase.js';

export const eventService = {
  async createEvent(organizerId, eventData) {
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organizer_id: organizerId,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        venue: eventData.venue,
        image: eventData.image,
        date: eventData.date,
        base_price: eventData.basePrice,
        capacity: eventData.capacity,
        max_per_user: eventData.maxPerUser,
        tickets_sold: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      const err = new Error('Failed to create event');
      err.status = 500;
      throw err;
    }

    return this.formatEvent(event);
  },

  async getEvents(filters = {}) {
    const {
      q = '',
      category = '',
      upcoming = false,
      sort = 'date',
      page = 1,
      limit = 20
    } = filters;

    const actualLimit = Math.min(Math.max(1, limit), 50); // Max 50 per page
    const offset = (page - 1) * actualLimit;

    let query = supabase
      .from('events_with_price')
      .select('*, organizer:organizer_id(id, name, avatar)', { count: 'exact' });

    // Search filter
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,venue.ilike.%${q}%`);
    }

    // Category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Upcoming filter
    if (upcoming) {
      query = query.gte('date', new Date().toISOString());
    }

    // Sorting
    const sortMap = {
      date: 'date',
      title: 'title',
      price: 'current_price'
    };
    const sortField = sortMap[sort] || 'date';
    query = query.order(sortField, { ascending: sort === 'title' });

    // Pagination
    query = query.range(offset, offset + actualLimit - 1);

    const { data: events, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      const err = new Error('Failed to fetch events');
      err.status = 500;
      throw err;
    }

    return {
      data: events.map(e => this.formatEventWithPrice(e)),
      page: parseInt(page),
      limit: actualLimit,
      total: count || 0
    };
  },

  async getEventById(eventId) {
    const { data: event, error } = await supabase
      .from('events_with_price')
      .select('*, organizer:organizer_id(id, name, avatar)')
      .eq('id', eventId)
      .single();

    if (error || !event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }

    return this.formatEventWithPrice(event);
  },

  async updateEvent(eventId, userId, updates) {
    // First check ownership
    const { data: existing } = await supabase
      .from('events')
      .select('organizer_id, tickets_sold, capacity')
      .eq('id', eventId)
      .single();

    if (!existing) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }

    if (existing.organizer_id !== userId) {
      const err = new Error('Only the organizer can update this event');
      err.status = 403;
      throw err;
    }

    // Validate capacity constraint
    if (updates.capacity !== undefined && updates.capacity < existing.tickets_sold) {
      const err = new Error('Capacity cannot be less than tickets already sold');
      err.status = 400;
      throw err;
    }

    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.venue !== undefined) updateData.venue = updates.venue;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.basePrice !== undefined) updateData.base_price = updates.basePrice;
    if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
    if (updates.maxPerUser !== undefined) updateData.max_per_user = updates.maxPerUser;

    const { data: event, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      const err = new Error('Failed to update event');
      err.status = 500;
      throw err;
    }

    return this.formatEvent(event);
  },

  async deleteEvent(eventId, userId) {
    // Check ownership
    const { data: existing } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', eventId)
      .single();

    if (!existing) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }

    if (existing.organizer_id !== userId) {
      const err = new Error('Only the organizer can delete this event');
      err.status = 403;
      throw err;
    }

    // Check for confirmed bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('event_id', eventId)
      .eq('status', 'confirmed')
      .limit(1);

    if (bookings && bookings.length > 0) {
      const err = new Error('Cannot delete event with confirmed bookings');
      err.status = 409;
      throw err;
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Database error:', error);
      const err = new Error('Failed to delete event');
      err.status = 500;
      throw err;
    }

    return { success: true };
  },

  async getOrganizerEvents(organizerId) {
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, description, category, venue, image, date, base_price, capacity, tickets_sold, max_per_user')
      .eq('organizer_id', organizerId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      const err = new Error('Failed to fetch organizer events');
      err.status = 500;
      throw err;
    }

    return events.map(e => ({
      ...this.formatEvent(e),
      ticketsSold: e.tickets_sold,
      revenue: e.tickets_sold * e.base_price // Approximation for organizer view
    }));
  },

  async getEventStats(eventId, userId) {
    // Check ownership
    const { data: event } = await supabase
      .from('events_with_price')
      .select('organizer_id, tickets_sold, remaining, current_price, surge_active, base_price')
      .eq('id', eventId)
      .single();

    if (!event) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }

    if (event.organizer_id !== userId) {
      const err = new Error('Only the organizer can view event stats');
      err.status = 403;
      throw err;
    }

    // Get bookings count
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    // Calculate revenue from actual bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    const revenue = bookings?.reduce((sum, b) => sum + b.total_price, 0) || 0;

    return {
      ticketsSold: event.tickets_sold,
      remaining: event.remaining,
      revenue,
      bookingsCount: bookingsCount || 0,
      surgeActive: event.surge_active,
      currentPrice: event.current_price
    };
  },

  formatEvent(event) {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      image: event.image,
      date: event.date,
      basePrice: event.base_price,
      capacity: event.capacity,
      ticketsSold: event.tickets_sold,
      maxPerUser: event.max_per_user
    };
  },

  formatEventWithPrice(event) {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      image: event.image,
      date: event.date,
      basePrice: event.base_price,
      currentPrice: event.current_price,
      capacity: event.capacity,
      ticketsSold: event.tickets_sold,
      remaining: event.remaining,
      surgeActive: event.surge_active,
      maxPerUser: event.max_per_user,
      organizer: event.organizer ? {
        id: event.organizer.id,
        name: event.organizer.name,
        avatar: event.organizer.avatar
      } : null
    };
  }
};
