import { z } from 'zod';
import { eventService } from '../services/eventService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  venue: z.string().min(1, 'Venue is required'),
  image: z.string().url('Invalid image URL').nullable().optional(),
  date: z.string().refine((val) => {
    const eventDate = new Date(val);
    return eventDate > new Date();
  }, 'Event date must be in the future'),
  basePrice: z.number().min(0, 'Base price must be non-negative'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  maxPerUser: z.number().int().min(1).optional().default(5)
});

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  venue: z.string().min(1).optional(),
  image: z.string().url().nullable().optional(),
  date: z.string().refine((val) => {
    const eventDate = new Date(val);
    return eventDate > new Date();
  }, 'Event date must be in the future').optional(),
  basePrice: z.number().min(0).optional(),
  capacity: z.number().int().min(1).optional(),
  maxPerUser: z.number().int().min(1).optional()
});

const getEventsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  upcoming: z.string().transform(val => val === 'true').optional(),
  sort: z.enum(['date', 'title', 'price']).optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 20).optional()
});

export const eventController = {
  createEvent: asyncHandler(async (req, res) => {
    const validated = createEventSchema.parse(req.body);
    const event = await eventService.createEvent(req.user.userId, validated);
    
    res.status(201).json(event);
  }),

  getEvents: asyncHandler(async (req, res) => {
    const validated = getEventsSchema.parse(req.query);
    const result = await eventService.getEvents(validated);
    
    res.status(200).json(result);
  }),

  getEventById: asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json(event);
  }),

  updateEvent: asyncHandler(async (req, res) => {
    const validated = updateEventSchema.parse(req.body);
    const event = await eventService.updateEvent(req.params.id, req.user.userId, validated);
    
    res.status(200).json(event);
  }),

  deleteEvent: asyncHandler(async (req, res) => {
    await eventService.deleteEvent(req.params.id, req.user.userId);
    res.status(200).json({ message: 'Event deleted successfully' });
  }),

  getOrganizerEvents: asyncHandler(async (req, res) => {
    const events = await eventService.getOrganizerEvents(req.user.userId);
    res.status(200).json({ data: events });
  }),

  getEventStats: asyncHandler(async (req, res) => {
    const stats = await eventService.getEventStats(req.params.id, req.user.userId);
    res.status(200).json(stats);
  })
};
