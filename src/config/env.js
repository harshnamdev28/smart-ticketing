import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'PORT',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'CLIENT_ORIGIN'
];

// Validate all required environment variables exist
const missing = requiredEnvVars.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

export const config = {
  port: process.env.PORT,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  clientOrigin: process.env.CLIENT_ORIGIN,
  isProduction: process.env.NODE_ENV === 'production'
};
