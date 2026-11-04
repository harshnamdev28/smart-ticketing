import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { config } from '../config/env.js';

export const authService = {
  async mockGoogleLogin(userData) {
    const { name = 'Anonymous User', email, avatar = null } = userData;

    if (!email) {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    // Upsert user by email
    const { data: user, error: dbError } = await supabase
      .from('users')
      .upsert(
        { email, name, avatar },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      const error = new Error('Failed to authenticate user');
      error.status = 500;
      throw error;
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    };
  },

  async getUserById(userId) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, avatar')
      .eq('id', userId)
      .single();

    if (error || !user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    };
  }
};
