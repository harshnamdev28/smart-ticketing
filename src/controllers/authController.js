import { z } from 'zod';
import { authService } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const mockGoogleSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  avatar: z.string().url().nullable().optional()
});

export const authController = {
  mockGoogleLogin: asyncHandler(async (req, res) => {
    const validated = mockGoogleSchema.parse(req.body);
    const result = await authService.mockGoogleLogin(validated);
    
    res.status(200).json(result);
  }),

  getMe: asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.user.userId);
    res.status(200).json({ user });
  })
};
