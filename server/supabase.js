const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
const config = require('./config');

const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: ws,
  },
});

module.exports = { supabase };
