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
const {
  validateAdminCredentials,
  validateCertificatePayload,
  validateContactMessage,
  validateEducationPayload,
  validateProjectPayload,
} = require('./validation');
const {
  certificatePayload,
  deleteRow,
  educationPayload,
  getDashboardSummary,
  insertRow,
  listPortfolioContent,
  mapCertificate,
  mapEducation,
  mapProject,
  projectPayload,
  updateRow,
  TABLES,
} = require('./portfolioStore');

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

function parseNumericId(value) {
  const id = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

app.get('/api/content/portfolio', async (_req, res) => {
  try {
    const content = await listPortfolioContent();
    return res.json({
      ok: true,
      ...content,
    });
  } catch (error) {
    console.error('Portfolio content lookup failed:', error);
    return fail(res, 500, 'We could not load portfolio content right now.');
  }
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

app.get('/api/admin/dashboard', requireAdmin, async (_req, res) => {
  try {
    const summary = await getDashboardSummary();
    return res.json({ ok: true, summary });
  } catch (error) {
    console.error('Dashboard summary failed:', error);
    return fail(res, 500, 'We could not load the dashboard summary right now.');
  }
});

app.get('/api/admin/content', requireAdmin, async (_req, res) => {
  try {
    const content = await listPortfolioContent();
    return res.json({ ok: true, ...content });
  } catch (error) {
    console.error('Admin content load failed:', error);
    return fail(res, 500, 'We could not load the portfolio content right now.');
  }
});

app.get('/api/admin/projects', requireAdmin, async (_req, res) => {
  try {
    const content = await listPortfolioContent();
    return res.json({ ok: true, projects: content.projects });
  } catch (error) {
    console.error('Project load failed:', error);
    return fail(res, 500, 'We could not load projects right now.');
  }
});

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  const result = validateProjectPayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the project form fields.', result.errors);
  }

  try {
    const created = await insertRow(TABLES.projects, projectPayload(result.values), mapProject);
    return res.status(201).json({ ok: true, project: created });
  } catch (error) {
    console.error('Project create failed:', error);
    return fail(res, 500, 'We could not save that project right now.');
  }
});

app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid project id.');
  }

  const result = validateProjectPayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the project form fields.', result.errors);
  }

  try {
    const updated = await updateRow(TABLES.projects, id, projectPayload(result.values), mapProject);
    return res.json({ ok: true, project: updated });
  } catch (error) {
    console.error('Project update failed:', error);
    return fail(res, 500, 'We could not update that project right now.');
  }
});

app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid project id.');
  }

  try {
    await deleteRow(TABLES.projects, id);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Project delete failed:', error);
    return fail(res, 500, 'We could not delete that project right now.');
  }
});

app.get('/api/admin/education', requireAdmin, async (_req, res) => {
  try {
    const content = await listPortfolioContent();
    return res.json({ ok: true, education: content.education });
  } catch (error) {
    console.error('Education load failed:', error);
    return fail(res, 500, 'We could not load education entries right now.');
  }
});

app.post('/api/admin/education', requireAdmin, async (req, res) => {
  const result = validateEducationPayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the education form fields.', result.errors);
  }

  try {
    const created = await insertRow(TABLES.education, educationPayload(result.values), mapEducation);
    return res.status(201).json({ ok: true, education: created });
  } catch (error) {
    console.error('Education create failed:', error);
    return fail(res, 500, 'We could not save that education entry right now.');
  }
});

app.put('/api/admin/education/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid education id.');
  }

  const result = validateEducationPayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the education form fields.', result.errors);
  }

  try {
    const updated = await updateRow(TABLES.education, id, educationPayload(result.values), mapEducation);
    return res.json({ ok: true, education: updated });
  } catch (error) {
    console.error('Education update failed:', error);
    return fail(res, 500, 'We could not update that education entry right now.');
  }
});

app.delete('/api/admin/education/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid education id.');
  }

  try {
    await deleteRow(TABLES.education, id);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Education delete failed:', error);
    return fail(res, 500, 'We could not delete that education entry right now.');
  }
});

app.get('/api/admin/certificates', requireAdmin, async (_req, res) => {
  try {
    const content = await listPortfolioContent();
    return res.json({ ok: true, certificates: content.certificates });
  } catch (error) {
    console.error('Certificate load failed:', error);
    return fail(res, 500, 'We could not load certificates right now.');
  }
});

app.post('/api/admin/certificates', requireAdmin, async (req, res) => {
  const result = validateCertificatePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the certificate form fields.', result.errors);
  }

  try {
    const created = await insertRow(TABLES.certificates, certificatePayload(result.values), mapCertificate);
    return res.status(201).json({ ok: true, certificate: created });
  } catch (error) {
    console.error('Certificate create failed:', error);
    return fail(res, 500, 'We could not save that certificate right now.');
  }
});

app.put('/api/admin/certificates/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid certificate id.');
  }

  const result = validateCertificatePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the certificate form fields.', result.errors);
  }

  try {
    const updated = await updateRow(TABLES.certificates, id, certificatePayload(result.values), mapCertificate);
    return res.json({ ok: true, certificate: updated });
  } catch (error) {
    console.error('Certificate update failed:', error);
    return fail(res, 500, 'We could not update that certificate right now.');
  }
});

app.delete('/api/admin/certificates/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid certificate id.');
  }

  try {
    await deleteRow(TABLES.certificates, id);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Certificate delete failed:', error);
    return fail(res, 500, 'We could not delete that certificate right now.');
  }
});

if (hasBuild) {
  app.use(express.static(buildDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) {
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
