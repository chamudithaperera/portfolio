const dotenv = require('dotenv');

dotenv.config();

function parseCsv(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  adminUsername: requireEnv('ADMIN_USERNAME'),
  adminPassword: requireEnv('ADMIN_PASSWORD'),
  sessionSecret: requireEnv('ADMIN_SESSION_SECRET'),
  sessionTtlMs: Number(process.env.ADMIN_SESSION_TTL_MS || 7 * 24 * 60 * 60 * 1000),
  allowedOrigins: [
    ...parseCsv(process.env.CORS_ORIGIN),
    ...parseCsv(process.env.PUBLIC_SITE_ORIGIN),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
};

module.exports = config;
