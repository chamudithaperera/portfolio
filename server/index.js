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
  deleteCertificateImage,
  deleteProjectImage,
  isCertificateImageUrl,
  isProjectImageUrl,
  uploadCertificateImage,
  uploadProjectImage,
} = require('./storage');
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
  validateExperiencePayload,
  validatePricingPackagePayload,
  validatePricingServicePayload,
  validateProjectPayload,
  validateVisitPayload,
} = require('./validation');
const {
  certificatePayload,
  deleteRow,
  educationPayload,
  experiencePayload,
  getDashboardSummary,
  insertRow,
  listPortfolioContent,
  listPricingServices,
  listVisitRows,
  mapCertificate,
  mapEducation,
  mapExperience,
  mapPricingPackage,
  mapPricingService,
  mapProject,
  mapVisit,
  pricingPackagePayload,
  pricingServicePayload,
  projectPayload,
  updateRow,
  TABLES,
} = require('./portfolioStore');

const app = express();
const buildDir = path.join(__dirname, '..', 'build');
const hasBuild = fs.existsSync(buildDir);
const siteOrigin =
  String(process.env.PUBLIC_SITE_ORIGIN || 'https://chamudithaperera.online')
    .split(',')[0]
    .trim()
    .replace(/\/+$/, '') || 'https://chamudithaperera.online';
const siteName = 'Chamuditha Perera';
const socialImage = `${siteOrigin}/assets/imgs/header/edited-photo-cropped-720.png`;
const siteLogo = `${siteOrigin}/favicon.png`;
const siteIcon = `${siteOrigin}/favicon.ico`;
const siteTouchIcon = `${siteOrigin}/site-icon-192.png`;
const structuredLogo = `${siteOrigin}/site-logo-512.png`;
const siteLogoWidth = 96;
const siteLogoHeight = 96;
const structuredLogoSize = 512;
const sameAsUrls = ['https://github.com/chamudithaperera', 'https://linkedin.com/in/chamudithaperera'];
const defaultDescription =
  'Chamuditha Perera (Chamuditha), software engineer in Sri Lanka building Flutter mobile apps, React websites, Spring Boot APIs, and full-stack products.';
const defaultKeywords =
  'Chamuditha, Chamuditha Perera, software engineer, Flutter developer, React developer, full-stack developer, mobile app developer, Sri Lanka software engineer';
const seoPages = {
  home: {
    title: 'Chamuditha Perera | Software Engineer',
    description: defaultDescription,
    keywords: defaultKeywords,
    canonicalPath: '/',
    fallbackHeading: 'Chamuditha Perera | Software Engineer',
    fallbackParagraphs: [
      defaultDescription,
      'Explore selected projects, work experience, technical skills, education, certificates, pricing packages, and contact details.',
    ],
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  },
  projects: {
    title: 'Projects | Chamuditha Perera',
    description:
      "Selected projects by Chamuditha Perera, software engineer: Flutter apps, React websites, Spring Boot APIs, dashboards, admin panels, and UI/UX product work.",
    keywords: `${defaultKeywords}, Chamuditha projects, software engineer portfolio, Flutter projects, React projects`,
    canonicalPath: '/projects',
    fallbackHeading: 'Projects by Chamuditha Perera',
    fallbackParagraphs: [
      "Selected projects by Chamuditha Perera, software engineer: Flutter apps, React websites, Spring Boot APIs, dashboards, admin panels, and UI/UX product work.",
      'Featured work includes mobile applications, responsive websites, backend APIs, admin panels, and product design experiments.',
    ],
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  },
  pricing: {
    title: 'Pricing | Chamuditha Perera',
    description:
      'Website and mobile app pricing packages from Chamuditha Perera, with options for portfolios, business websites, admin panels, and custom apps.',
    keywords: `${defaultKeywords}, website pricing, mobile app pricing, software engineer Sri Lanka`,
    canonicalPath: '/pricing',
    fallbackHeading: 'Website and Mobile App Pricing',
    fallbackParagraphs: [
      'Website and mobile app pricing packages from Chamuditha Perera, with options for portfolios, business websites, admin panels, and custom apps.',
      'Packages cover basic websites, standard business sites, premium platforms, mobile apps, revisions, support, and custom project scopes.',
    ],
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  },
  admin: {
    title: 'Admin Dashboard | Chamuditha Portfolio',
    description: 'Private administration area for Chamuditha Perera portfolio content.',
    keywords: '',
    canonicalPath: '/admin',
    fallbackHeading: 'Admin Dashboard',
    fallbackParagraphs: ['This private administration area is not intended to appear in search results.'],
    robots: 'noindex,nofollow',
  },
};
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
app.use(express.json({ limit: '15mb' }));
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

app.get('/robots.txt', (_req, res) => {
  res
    .type('text/plain')
    .send(['User-agent: *', 'Allow: /', '', `Sitemap: ${siteOrigin}/sitemap.xml`, ''].join('\n'));
});

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

function getRequestIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  return String(req.ip || req.socket?.remoteAddress || '').trim();
}

async function getProjectImageRecord(id) {
  const { data, error } = await supabase.from(TABLES.projects).select('id, image').eq('id', id).maybeSingle();
  if (error) {
    throw error;
  }
  return data || null;
}

async function getCertificateImageRecord(id) {
  const { data, error } = await supabase.from(TABLES.certificates).select('id, image').eq('id', id).maybeSingle();
  if (error) {
    throw error;
  }
  return data || null;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

function getSeoPage(requestPath) {
  const cleanPath = String(requestPath || '/').replace(/\/+$/, '') || '/';

  if (cleanPath === '/projects' || cleanPath.startsWith('/projects/')) {
    return seoPages.projects;
  }

  if (cleanPath === '/pricing' || cleanPath.startsWith('/pricing/')) {
    return seoPages.pricing;
  }

  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
    return seoPages.admin;
  }

  return seoPages.home;
}

function buildStructuredData(seo) {
  const canonical = `${siteOrigin}${seo.canonicalPath}`;
  const personId = `${siteOrigin}/#person`;
  const organizationId = `${siteOrigin}/#organization`;
  const websiteId = `${siteOrigin}/#website`;
  const logoId = `${siteOrigin}/#logo`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: siteName,
        alternateName: ['Chamuditha', 'ChamXdev'],
        url: siteOrigin,
        mainEntityOfPage: `${siteOrigin}/`,
        description: defaultDescription,
        image: socialImage,
        jobTitle: 'Software Engineer',
        worksFor: {
          '@id': organizationId,
        },
        sameAs: sameAsUrls,
        knowsAbout: [
          'Flutter',
          'React',
          'Spring Boot',
          'Software Engineering',
          'UI/UX Design',
          'Mobile App Development',
          'Full-Stack Development',
        ],
      },
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: siteName,
        alternateName: 'ChamXdev',
        url: siteOrigin,
        logo: {
          '@type': 'ImageObject',
          '@id': logoId,
          url: structuredLogo,
          contentUrl: structuredLogo,
          width: structuredLogoSize,
          height: structuredLogoSize,
          caption: `${siteName} logo`,
        },
        sameAs: sameAsUrls,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteOrigin,
        name: siteName,
        alternateName: ['Chamuditha', 'Chamuditha Perera Portfolio', 'ChamXdev'],
        description: defaultDescription,
        image: siteLogo,
        publisher: {
          '@id': personId,
        },
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': personId,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: socialImage,
          width: 720,
          height: 1136,
        },
        inLanguage: 'en',
      },
    ],
  };
}

function replaceOrInsertHeadTag(html, pattern, replacement) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace(/<\/head>/i, `${replacement}</head>`);
}

function renderFallbackContent(seo) {
  const paragraphs = seo.fallbackParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');

  return [
    '<main class="seo-fallback" data-seo-fallback>',
    `<h1>${escapeHtml(seo.fallbackHeading)}</h1>`,
    paragraphs,
    '<nav aria-label="Portfolio pages">',
    `<a href="${siteOrigin}/">Home</a> | `,
    `<a href="${siteOrigin}/projects">Projects</a> | `,
    `<a href="${siteOrigin}/pricing">Pricing</a>`,
    '</nav>',
    '</main>',
  ].join('');
}

function renderNoScriptContent(seo) {
  const paragraphs = seo.fallbackParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');

  return [
    '<noscript>',
    '<main>',
    `<h1>${escapeHtml(seo.fallbackHeading)}</h1>`,
    paragraphs,
    '<nav aria-label="Portfolio pages without JavaScript">',
    `<a href="${siteOrigin}/">Home</a> | `,
    `<a href="${siteOrigin}/projects">Projects</a> | `,
    `<a href="${siteOrigin}/pricing">Pricing</a>`,
    '</nav>',
    '</main>',
    '</noscript>',
  ].join('');
}

function renderSeoHtml(requestPath) {
  const indexPath = path.join(buildDir, 'index.html');
  const seo = getSeoPage(requestPath);
  const canonical = `${siteOrigin}${seo.canonicalPath}`;
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']icon["'][^>]*>/i,
    `<link rel="icon" type="image/png" sizes="${siteLogoWidth}x${siteLogoHeight}" href="${escapeHtml(siteLogo)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']shortcut icon["'][^>]*>/i,
    `<link rel="shortcut icon" type="image/x-icon" href="${escapeHtml(siteIcon)}" sizes="any"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']apple-touch-icon["'][^>]*>/i,
    `<link rel="apple-touch-icon" href="${escapeHtml(siteTouchIcon)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']keywords["'][^>]*>/i,
    `<meta name="keywords" content="${escapeHtml(seo.keywords || defaultKeywords)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']author["'][^>]*>/i,
    `<meta name="author" content="${escapeHtml(siteName)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']application-name["'][^>]*>/i,
    `<meta name="application-name" content="${escapeHtml(siteName)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']apple-mobile-web-app-title["'][^>]*>/i,
    `<meta name="apple-mobile-web-app-title" content="${escapeHtml(siteName)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="${escapeHtml(seo.robots)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']googlebot["'][^>]*>/i,
    `<meta name="googlebot" content="${escapeHtml(seo.robots)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(seo.title)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(seo.description)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${escapeHtml(socialImage)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:image:type["'][^>]*>/i,
    '<meta property="og:image:type" content="image/png"/>',
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:image:width["'][^>]*>/i,
    '<meta property="og:image:width" content="720"/>',
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:image:height["'][^>]*>/i,
    '<meta property="og:image:height" content="1136"/>',
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:image:alt["'][^>]*>/i,
    '<meta property="og:image:alt" content="Chamuditha Perera software engineer portfolio"/>',
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property=["']og:site_name["'][^>]*>/i,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${escapeHtml(socialImage)}"/>`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name=["']twitter:image:alt["'][^>]*>/i,
    '<meta name="twitter:image:alt" content="Chamuditha Perera software engineer portfolio"/>',
  );
  html = replaceOrInsertHeadTag(
    html,
    /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">${escapeJsonForHtml(buildStructuredData(seo))}</script>`,
  );
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, renderNoScriptContent(seo));
  html = html.replace(/<main\s+class=["']seo-fallback["'][^>]*data-seo-fallback[^>]*>[\s\S]*?<\/main>/i, renderFallbackContent(seo));

  return { html, seo };
}

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

app.get('/api/content/pricing', async (_req, res) => {
  try {
    const pricingServices = await listPricingServices(false);
    return res.json({
      ok: true,
      pricingServices,
    });
  } catch (error) {
    console.error('Pricing content lookup failed:', error);
    return fail(res, 500, 'We could not load pricing content right now.');
  }
});

app.post('/api/visit', async (req, res) => {
  const result = validateVisitPayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the visit payload.', result.errors);
  }

  const payload = {
    path: result.values.path,
    referrer: result.values.referrer,
    ip_address: getRequestIp(req),
    user_agent: result.values.userAgent || String(req.headers['user-agent'] || ''),
    language: result.values.language || String(req.headers['accept-language'] || ''),
    screen: result.values.screen,
    viewport: result.values.viewport,
    page_title: result.values.pageTitle,
    country: String(req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || '').trim(),
    timezone_offset: result.values.timezoneOffset,
  };

  try {
    const { error } = await supabase.from(TABLES.visits).insert([payload]);
    if (error) {
      throw error;
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Visit logging failed:', error);
    return fail(res, 500, 'We could not record that visit right now.');
  }
});

app.post('/api/admin/project-images/upload', requireAdmin, async (req, res) => {
  const fileName = String(req.body?.fileName || '').trim();
  const dataUrl = String(req.body?.dataUrl || '').trim();
  const mimeType = String(req.body?.mimeType || '').trim();
  const projectId = req.body?.projectId ? String(req.body.projectId).trim() : '';
  const projectTitle = String(req.body?.projectTitle || '').trim();

  if (!fileName || !dataUrl) {
    return fail(res, 400, 'Image file and data are required.');
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return fail(res, 400, 'The uploaded image data is invalid.');
  }

  try {
    const uploaded = await uploadProjectImage({
      bytes: Buffer.from(match[2], 'base64'),
      contentType: mimeType || match[1],
      fileName,
      projectId,
      projectTitle,
    });

    return res.status(201).json({
      ok: true,
      imageUrl: uploaded.publicUrl,
      objectPath: uploaded.objectPath,
    });
  } catch (error) {
    console.error('Project image upload failed:', error);
    return fail(res, 500, 'We could not upload that image right now.');
  }
});

app.delete('/api/admin/project-images', requireAdmin, async (req, res) => {
  const imageUrl = String(req.body?.imageUrl || '').trim();

  if (!imageUrl) {
    return fail(res, 400, 'Image URL is required.');
  }

  try {
    const deleted = await deleteProjectImage(imageUrl);
    return res.json({ ok: true, deleted: deleted.deleted });
  } catch (error) {
    console.error('Project image delete failed:', error);
    return fail(res, 500, 'We could not delete that image right now.');
  }
});

app.post('/api/admin/certificate-images/upload', requireAdmin, async (req, res) => {
  const fileName = String(req.body?.fileName || '').trim();
  const dataUrl = String(req.body?.dataUrl || '').trim();
  const mimeType = String(req.body?.mimeType || '').trim();
  const certificateId = req.body?.certificateId ? String(req.body.certificateId).trim() : '';
  const certificateTitle = String(req.body?.certificateTitle || '').trim();

  if (!fileName || !dataUrl) {
    return fail(res, 400, 'Image file and data are required.');
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return fail(res, 400, 'The uploaded image data is invalid.');
  }

  try {
    const uploaded = await uploadCertificateImage({
      bytes: Buffer.from(match[2], 'base64'),
      contentType: mimeType || match[1],
      fileName,
      certificateId,
      certificateTitle,
    });

    return res.status(201).json({
      ok: true,
      imageUrl: uploaded.publicUrl,
      objectPath: uploaded.objectPath,
    });
  } catch (error) {
    console.error('Certificate image upload failed:', error);
    return fail(res, 500, 'We could not upload that image right now.');
  }
});

app.delete('/api/admin/certificate-images', requireAdmin, async (req, res) => {
  const imageUrl = String(req.body?.imageUrl || '').trim();

  if (!imageUrl) {
    return fail(res, 400, 'Image URL is required.');
  }

  try {
    const deleted = await deleteCertificateImage(imageUrl);
    return res.json({ ok: true, deleted: deleted.deleted });
  } catch (error) {
    console.error('Certificate image delete failed:', error);
    return fail(res, 500, 'We could not delete that image right now.');
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

app.get('/api/admin/visits', requireAdmin, async (_req, res) => {
  try {
    const visits = await listVisitRows(200);
    return res.json({
      ok: true,
      visits,
      total: visits.length,
    });
  } catch (error) {
    console.error('Supabase visit read failed:', error);
    return fail(res, 500, 'We could not load visits right now.');
  }
});

app.patch('/api/admin/messages/:id/status', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  const status = String(req.body?.status || '').trim().toLowerCase();

  if (!id) {
    return fail(res, 400, 'A valid message id is required.');
  }

  if (!['new', 'read'].includes(status)) {
    return fail(res, 400, 'Message status must be read or new.');
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select('id, name, email, phone, subject, message, status, created_at')
    .single();

  if (error) {
    console.error('Supabase message status update failed:', error);
    return fail(res, 500, 'We could not update that message right now.');
  }

  return res.json({ ok: true, message: data });
});

app.delete('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);

  if (!id) {
    return fail(res, 400, 'A valid message id is required.');
  }

  const { error } = await supabase.from('contact_messages').delete().eq('id', id);

  if (error) {
    console.error('Supabase message delete failed:', error);
    return fail(res, 500, 'We could not delete that message right now.');
  }

  return res.json({ ok: true, deleted: true });
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

app.get('/api/admin/pricing', requireAdmin, async (_req, res) => {
  try {
    const pricingServices = await listPricingServices(true);
    const pricingPackages = pricingServices.flatMap((service) =>
      service.packages.map((item) => ({
        ...item,
        serviceLabel: service.label,
      })),
    );
    return res.json({ ok: true, pricingServices, pricingPackages });
  } catch (error) {
    console.error('Pricing admin load failed:', error);
    return fail(res, 500, 'We could not load pricing content right now.');
  }
});

app.post('/api/admin/pricing/services', requireAdmin, async (req, res) => {
  const result = validatePricingServicePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the pricing service form fields.', result.errors);
  }

  try {
    const created = await insertRow(TABLES.pricingServices, pricingServicePayload(result.values), mapPricingService);
    return res.status(201).json({ ok: true, pricingService: created });
  } catch (error) {
    console.error('Pricing service create failed:', error);
    return fail(res, 500, 'We could not save that pricing service right now.');
  }
});

app.put('/api/admin/pricing/services/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid pricing service id.');
  }

  const result = validatePricingServicePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the pricing service form fields.', result.errors);
  }

  try {
    const updated = await updateRow(TABLES.pricingServices, id, pricingServicePayload(result.values), mapPricingService);
    return res.json({ ok: true, pricingService: updated });
  } catch (error) {
    console.error('Pricing service update failed:', error);
    return fail(res, 500, 'We could not update that pricing service right now.');
  }
});

app.delete('/api/admin/pricing/services/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid pricing service id.');
  }

  try {
    await deleteRow(TABLES.pricingServices, id);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Pricing service delete failed:', error);
    return fail(res, 500, 'We could not delete that pricing service right now. Remove its packages first.');
  }
});

app.post('/api/admin/pricing/packages', requireAdmin, async (req, res) => {
  const result = validatePricingPackagePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the pricing package form fields.', result.errors);
  }

  try {
    const created = await insertRow(TABLES.pricingPackages, pricingPackagePayload(result.values), mapPricingPackage);
    return res.status(201).json({ ok: true, pricingPackage: created });
  } catch (error) {
    console.error('Pricing package create failed:', error);
    return fail(res, 500, 'We could not save that pricing package right now.');
  }
});

app.put('/api/admin/pricing/packages/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid pricing package id.');
  }

  const result = validatePricingPackagePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the pricing package form fields.', result.errors);
  }

  try {
    const updated = await updateRow(TABLES.pricingPackages, id, pricingPackagePayload(result.values), mapPricingPackage);
    return res.json({ ok: true, pricingPackage: updated });
  } catch (error) {
    console.error('Pricing package update failed:', error);
    return fail(res, 500, 'We could not update that pricing package right now.');
  }
});

app.delete('/api/admin/pricing/packages/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid pricing package id.');
  }

  try {
    await deleteRow(TABLES.pricingPackages, id);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Pricing package delete failed:', error);
    return fail(res, 500, 'We could not delete that pricing package right now.');
  }
});

app.get('/api/admin/experience', requireAdmin, async (_req, res) => {
  try {
    const content = await listPortfolioContent();
    return res.json({ ok: true, experience: content.experience });
  } catch (error) {
    console.error('Experience load failed:', error);
    return fail(res, 500, 'We could not load work experience right now.');
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

app.post('/api/admin/experience', requireAdmin, async (req, res) => {
  const result = validateExperiencePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the work experience form fields.', result.errors);
  }

  try {
    const created = await insertRow(TABLES.experience, experiencePayload(result.values), mapExperience);
    return res.status(201).json({ ok: true, experience: created });
  } catch (error) {
    console.error('Experience create failed:', error);
    return fail(res, 500, 'We could not save that work experience right now.');
  }
});

app.put('/api/admin/experience/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid experience id.');
  }

  const result = validateExperiencePayload(req.body);
  if (!result.ok) {
    return fail(res, 400, 'Please fix the work experience form fields.', result.errors);
  }

  try {
    const updated = await updateRow(TABLES.experience, id, experiencePayload(result.values), mapExperience);
    return res.json({ ok: true, experience: updated });
  } catch (error) {
    console.error('Experience update failed:', error);
    return fail(res, 500, 'We could not update that work experience right now.');
  }
});

app.delete('/api/admin/experience/:id', requireAdmin, async (req, res) => {
  const id = parseNumericId(req.params.id);
  if (!id) {
    return fail(res, 400, 'Invalid experience id.');
  }

  try {
    await deleteRow(TABLES.experience, id);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Experience delete failed:', error);
    return fail(res, 500, 'We could not delete that work experience right now.');
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
    const existing = await getProjectImageRecord(id);
    const updated = await updateRow(TABLES.projects, id, projectPayload(result.values), mapProject);

    if (existing?.image && existing.image !== updated.image && isProjectImageUrl(existing.image)) {
      deleteProjectImage(existing.image).catch((cleanupError) => {
        console.error('Project image cleanup failed:', cleanupError);
      });
    }

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
    const existing = await getProjectImageRecord(id);
    await deleteRow(TABLES.projects, id);

    if (existing?.image && isProjectImageUrl(existing.image)) {
      deleteProjectImage(existing.image).catch((cleanupError) => {
        console.error('Project image cleanup failed:', cleanupError);
      });
    }

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
    const existing = await getCertificateImageRecord(id);
    const updated = await updateRow(TABLES.certificates, id, certificatePayload(result.values), mapCertificate);

    if (existing?.image && existing.image !== updated.image && isCertificateImageUrl(existing.image)) {
      deleteCertificateImage(existing.image).catch((cleanupError) => {
        console.error('Certificate image cleanup failed:', cleanupError);
      });
    }

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
    const existing = await getCertificateImageRecord(id);
    await deleteRow(TABLES.certificates, id);

    if (existing?.image && isCertificateImageUrl(existing.image)) {
      deleteCertificateImage(existing.image).catch((cleanupError) => {
        console.error('Certificate image cleanup failed:', cleanupError);
      });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error('Certificate delete failed:', error);
    return fail(res, 500, 'We could not delete that certificate right now.');
  }
});

app.post('/api/admin/reorder', requireAdmin, async (req, res) => {
  const { table, items } = req.body;
  if (!table || !Array.isArray(items)) {
    return fail(res, 400, 'Invalid parameters.');
  }

  // Ensure table name matches allowed ones to prevent injection/unintended updates
  const allowedTables = Object.values(TABLES);
  if (!allowedTables.includes(table)) {
    return fail(res, 400, 'Invalid table name.');
  }

  try {
    const promises = items.map((item) =>
      supabase
        .from(table)
        .update({ display_order: item.displayOrder })
        .eq('id', item.id)
    );
    await Promise.all(promises);

    return res.json({ ok: true });
  } catch (error) {
    console.error('Bulk reorder failed:', error);
    return fail(res, 500, 'We could not reorder those items right now.');
  }
});

if (hasBuild) {
  app.use(express.static(buildDir, { index: false }));
  app.use((req, res, next) => {
    if (!['GET', 'HEAD'].includes(req.method) || req.path.startsWith('/api/')) {
      return next();
    }

    const indexPath = path.join(buildDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return next();
    }

    const { html, seo } = renderSeoHtml(req.path);
    res.set('X-Robots-Tag', seo.robots);

    return res.type('html').send(html);
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
