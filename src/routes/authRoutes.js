import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/mock-google', authLimiter, authController.mockGoogleLogin);
router.get('/me', authenticate, authController.getMe);

export default router;
