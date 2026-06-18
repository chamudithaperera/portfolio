const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const { supabase } = require('./supabase');
const {
  clearSessionCookie,
  createSessionToken,
  readSession,
  requireAdmin,
  setSessionCookie,
} = require('./auth');
const { validateAdminCredentials, validateContactMessage } = require('./validation');

const app = express();
const buildDir = path.join(__dirname, '..', 'build');
const hasBuild = fs.existsSync(buildDir);
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = new Set(config.allowedOrigins.filter(Boolean));

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '25kb' }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
  }),
);

function fail(res, status, message, details) {
  return res.status(status).json({
    ok: false,
    error: message,
    ...(details ? { details } : {}),
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

app.post('/api/contact/messages', contactLimiter, async (req, res) => {
  const result = validateContactMessage(req.body);

  if (!result.ok) {
    return fail(res, 400, 'Please fix the highlighted fields.', result.errors);
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .insert([
      {
        name: result.values.name,
        email: result.values.email,
        phone: result.values.phone,
        subject: result.values.subject,
        message: result.values.message,
        status: 'new',
      },
    ])
    .select('id, created_at')
    .single();

  if (error) {
    console.error('Supabase insert failed:', error);
    return fail(res, 500, 'We could not save your message right now.');
  }

  return res.status(201).json({
    ok: true,
    message: 'Message saved successfully.',
    data,
  });
});

app.post('/api/admin/login', adminLimiter, async (req, res) => {
  const { username, password } = validateAdminCredentials(req.body?.username, req.body?.password);
  if (!username || !password) {
    return fail(res, 400, 'Username and password are required.');
  }

  if (username !== config.adminUsername || password !== config.adminPassword) {
    return fail(res, 401, 'Invalid username or password.');
  }

  const sessionToken = createSessionToken(username);
  setSessionCookie(res, sessionToken);

  return res.json({
    ok: true,
    message: 'Logged in successfully.',
    admin: { username },
  });
});

app.get('/api/admin/session', (req, res) => {
  const session = readSession(req);
  if (!session) {
    return res.json({ ok: true, authenticated: false });
  }

  return res.json({
    ok: true,
    authenticated: true,
    admin: {
      username: session.username,
      expiresAt: session.expiresAt,
    },
  });
});

app.post('/api/admin/logout', (req, res) => {
  clearSessionCookie(res);
  return res.json({ ok: true, message: 'Logged out successfully.' });
});

app.get('/api/admin/messages', requireAdmin, async (req, res) => {
  const search = String(req.query.search ?? '').trim().toLowerCase();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, phone, subject, message, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Supabase read failed:', error);
    return fail(res, 500, 'We could not load messages right now.');
  }

  const messages = (data || []).filter((message) => {
    if (!search) return true;
    const haystack = [message.name, message.email, message.phone || '', message.subject, message.message]
      .join(' ')
      .toLowerCase();
    return haystack.includes(search);
  });

  return res.json({
    ok: true,
    messages,
    total: messages.length,
  });
});

if (hasBuild) {
  app.use(express.static(buildDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }

    return res.sendFile(path.join(buildDir, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      ok: true,
      message: 'API is running. Build the React app with npm run build to serve the site from this server.',
    });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ ok: false, error: 'Unexpected server error.' });
});

app.listen(config.port, () => {
  console.log(`Portfolio server running on port ${config.port}`);
});
