import { config } from '../config/env.js';
import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  // Log error (but never log secrets or sensitive data)
  console.error('Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    ...(config.isProduction ? {} : { stack: err.stack })
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: err.errors[0]?.message || 'Validation failed'
    });
  }

  // Custom application errors with status
  if (err.status) {
    return res.status(err.status).json({
      error: err.message
    });
  }

  // Default 500 error - never leak stack traces in production
  res.status(500).json({
    error: 'Internal server error'
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
};
