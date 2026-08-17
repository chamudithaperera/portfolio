function normalizeText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeMessage(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim();
}

function validateEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length < 6 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(value) {
  if (value == null || value === '') return true;
  const phone = normalizeText(value);
  if (phone.length < 6 || phone.length > 24) return false;
  return /^[+()\-\d\s.]+$/.test(phone);
}

function validateContactMessage(body) {
  const errors = {};

  const name = normalizeText(body.name);
  const email = normalizeText(body.email);
  const phone = normalizeText(body.phone);
  const subject = normalizeText(body.subject);
  const message = normalizeMessage(body.message);

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 2 || name.length > 120) {
    errors.name = 'Name must be between 2 and 120 characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!validatePhone(phone)) {
    errors.phone = 'Enter a valid phone number or leave it blank.';
  }

  if (!subject) {
    errors.subject = 'Subject is required.';
  } else if (subject.length < 3 || subject.length > 140) {
    errors.subject = 'Subject must be between 3 and 140 characters.';
  }

  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < 10 || message.length > 4000) {
    errors.message = 'Message must be between 10 and 4000 characters.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      name,
      email,
      phone: phone || null,
      subject,
      message,
    },
  };
}

function validateChatbotMessage(body = {}) {
  const errors = {};

  const message = normalizeMessage(body.message);

  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < 1 || message.length > 1000) {
    errors.message = 'Message must be between 1 and 1000 characters.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      message,
    },
  };
}

function validateVisitPayload(body = {}) {
  const errors = {};

  const path = normalizeText(body.path);
  const referrer = normalizeText(body.referrer);
  const userAgent = normalizeText(body.userAgent);
  const language = normalizeText(body.language);
  const screen = normalizeText(body.screen);
  const viewport = normalizeText(body.viewport);
  const pageTitle = normalizeText(body.pageTitle);
  const country = normalizeText(body.country);
  const timezoneOffset = Number.parseInt(String(body.timezoneOffset ?? ''), 10);

  if (!path) {
    errors.path = 'Path is required.';
  } else if (path.length > 500) {
    errors.path = 'Path is too long.';
  }

  if (referrer.length > 1000) {
    errors.referrer = 'Referrer is too long.';
  }

  if (userAgent.length > 500) {
    errors.userAgent = 'User agent is too long.';
  }

  if (language.length > 100) {
    errors.language = 'Language is too long.';
  }

  if (screen.length > 120) {
    errors.screen = 'Screen is too long.';
  }

  if (viewport.length > 120) {
    errors.viewport = 'Viewport is too long.';
  }

  if (pageTitle.length > 180) {
    errors.pageTitle = 'Page title is too long.';
  }

  if (country.length > 80) {
    errors.country = 'Country is too long.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      path,
      referrer,
      userAgent,
      language,
      screen,
      viewport,
      pageTitle,
      country,
      timezoneOffset: Number.isFinite(timezoneOffset) ? timezoneOffset : null,
    },
  };
}

function validateAdminCredentials(username, password) {
  const safeUsername = normalizeText(username);
  const safePassword = String(password ?? '');

  return {
    ok: safeUsername.length > 0 && safePassword.length > 0,
    username: safeUsername,
    password: safePassword,
  };
}

function normalizeList(value, separator = ',') {
  if (Array.isArray(value)) {
    return value.map(normalizeText).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(separator)
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function validateCollectionOrder(value) {
  if (value == null || value === '') return 0;
  const order = Number.parseInt(String(value), 10);
  return Number.isFinite(order) ? order : 0;
}

const PROJECT_IMAGE_MAX_LENGTH = 1000;
const PROJECT_SUMMARY_MAX_LENGTH = 1200;

function validateProjectPayload(body = {}) {
  const errors = {};

  const title = normalizeText(body.title);
  const category = normalizeText(body.category);
  const image = normalizeText(body.image);
  const summary = normalizeText(body.summary);
  const featuredNote = normalizeText(body.featuredNote);
  const link = normalizeText(body.link);
  const tags = normalizeList(body.tags);
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.map(normalizeText).filter(Boolean)
    : String(body.highlights ?? '')
        .split('\n')
        .map((item) => normalizeText(item))
        .filter(Boolean);
  const displayOrder = validateCollectionOrder(body.displayOrder);
  const isFeatured = Boolean(body.isFeatured);

  if (!title) errors.title = 'Project title is required.';
  if (!category) errors.category = 'Project category is required.';
  if (!image) errors.image = 'Project image path or URL is required.';
  if (!summary) errors.summary = 'Project summary is required.';
  if (!link) errors.link = 'Project link is required.';

  if (title && (title.length < 2 || title.length > 140)) {
    errors.title = 'Project title must be between 2 and 140 characters.';
  }

  if (category && (category.length < 2 || category.length > 120)) {
    errors.category = 'Category must be between 2 and 120 characters.';
  }

  if (image && image.length > PROJECT_IMAGE_MAX_LENGTH) {
    errors.image = 'Image path or URL is too long.';
  }

  if (summary && (summary.length < 10 || summary.length > PROJECT_SUMMARY_MAX_LENGTH)) {
    errors.summary = `Summary must be between 10 and ${PROJECT_SUMMARY_MAX_LENGTH} characters.`;
  }

  if (featuredNote && featuredNote.length > 140) {
    errors.featuredNote = 'Featured note must be 140 characters or less.';
  }

  if (link && link.length > 500) {
    errors.link = 'Project link is too long.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      title,
      category,
      image,
      summary,
      featuredNote: featuredNote || null,
      link,
      tags,
      highlights,
      displayOrder,
      isFeatured,
    },
  };
}

function validateEducationPayload(body = {}) {
  const errors = {};

  const track = normalizeText(body.track);
  const title = normalizeText(body.title);
  const org = normalizeText(body.org);
  const period = normalizeText(body.period);
  const detail = normalizeText(body.detail);
  const badge = normalizeText(body.badge);
  const displayOrder = validateCollectionOrder(body.displayOrder);

  if (!track) errors.track = 'Education track is required.';
  if (!title) errors.title = 'Education title is required.';
  if (!org) errors.org = 'Institution is required.';
  if (!period) errors.period = 'Period is required.';
  if (!detail) errors.detail = 'Detail is required.';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      track,
      title,
      org,
      period,
      detail,
      badge: badge || null,
      displayOrder,
    },
  };
}

function validateExperiencePayload(body = {}) {
  const errors = {};

  const period = normalizeText(body.period);
  const role = normalizeText(body.role);
  const org = normalizeText(body.org);
  const detail = normalizeText(body.detail);
  const tags = normalizeList(body.tags);
  const displayOrder = validateCollectionOrder(body.displayOrder);
  const current = Boolean(body.current);

  if (!period) errors.period = 'Period is required.';
  if (!role) errors.role = 'Role is required.';
  if (!org) errors.org = 'Organization is required.';
  if (!detail) errors.detail = 'Detail is required.';

  if (period && (period.length < 3 || period.length > 80)) {
    errors.period = 'Period must be between 3 and 80 characters.';
  }

  if (role && (role.length < 2 || role.length > 140)) {
    errors.role = 'Role must be between 2 and 140 characters.';
  }

  if (org && (org.length < 2 || org.length > 140)) {
    errors.org = 'Organization must be between 2 and 140 characters.';
  }

  if (detail && (detail.length < 10 || detail.length > 4000)) {
    errors.detail = 'Detail must be between 10 and 4000 characters.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      period,
      role,
      org,
      current,
      detail,
      tags,
      displayOrder,
    },
  };
}

function validateCertificatePayload(body = {}) {
  const errors = {};

  const title = normalizeText(body.title);
  const org = normalizeText(body.org);
  const year = normalizeText(body.year);
  const image = normalizeText(body.image);
  const detail = normalizeText(body.detail);
  const displayOrder = validateCollectionOrder(body.displayOrder);

  if (!title) errors.title = 'Certificate title is required.';
  if (!org) errors.org = 'Issuer is required.';
  if (!year) errors.year = 'Year is required.';
  if (!detail) errors.detail = 'Detail is required.';
  if (image && image.length > 500) {
    errors.image = 'Image path or URL is too long.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      title,
      org,
      year,
      image,
      detail,
      displayOrder,
    },
  };
}

function validatePricingServicePayload(body = {}) {
  const errors = {};

  const serviceKey = normalizeText(body.serviceKey).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  const label = normalizeText(body.label);
  const icon = normalizeText(body.icon) || 'code';
  const intro = normalizeText(body.intro);
  const displayOrder = validateCollectionOrder(body.displayOrder);
  const active = body.active !== false;

  if (!serviceKey) errors.serviceKey = 'Service key is required.';
  if (!label) errors.label = 'Service label is required.';
  if (!intro) errors.intro = 'Service intro is required.';

  if (serviceKey && (serviceKey.length < 2 || serviceKey.length > 80)) {
    errors.serviceKey = 'Service key must be between 2 and 80 characters.';
  }

  if (label && (label.length < 2 || label.length > 80)) {
    errors.label = 'Service label must be between 2 and 80 characters.';
  }

  if (intro && (intro.length < 10 || intro.length > 400)) {
    errors.intro = 'Service intro must be between 10 and 400 characters.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      serviceKey,
      label,
      icon,
      intro,
      displayOrder,
      active,
    },
  };
}

const TECH_STACK_CATEGORIES = new Set([
  'Languages',
  'Frameworks & Libraries',
  'Backend & Database',
  'DevOps & Other Tools',
]);

const TECH_STACK_GLYPHS = new Set([
  'dart',
  'java',
  'typescript',
  'javascript',
  'html',
  'css',
  'php',
  'flutter',
  'react',
  'spring-boot',
  'express',
  'tailwind',
  'node',
  'firebase',
  'mongodb',
  'mysql',
  'postgresql',
  'sqlite',
  'redis',
  'mqtt',
  'jwt',
  'git',
  'github',
  'docker',
  'postman',
  'kubernetes',
  'nginx',
  'figma',
  'photoshop',
  'react-native',
  'riverpod',
  'api',
]);

const TECH_STACK_ICON_KINDS = new Set([
  'glyph',
  'monogram',
  'svg',
]);

function encodeTechStackGlyphKey(iconKind, iconValue) {
  const value = normalizeText(iconValue);

  if (iconKind === 'monogram') {
    return `monogram:${value.toUpperCase()}`;
  }

  if (iconKind === 'svg') {
    return `svg:${value}`;
  }

  return value.toLowerCase();
}

function validateTechStackPayload(body = {}) {
  const errors = {};

  const category = normalizeText(body.category);
  const label = normalizeText(body.label);
  const summary = normalizeText(body.summary);
  const iconKind = normalizeText(body.iconKind || body.icon_kind || 'glyph').toLowerCase() || 'glyph';
  const iconValue = normalizeText(body.iconValue || body.icon_value || body.glyphKey || body.glyph_key);
  const displayOrder = validateCollectionOrder(body.displayOrder);
  const active = body.active !== false;

  if (!category) errors.category = 'Category is required.';
  if (!label) errors.label = 'Tech stack label is required.';
  if (!summary) errors.summary = 'Summary is required.';
  if (!iconValue) errors.iconValue = 'Choose an icon, monogram, or custom SVG path.';

  if (category && !TECH_STACK_CATEGORIES.has(category)) {
    errors.category = 'Choose a valid category.';
  }

  if (iconKind && !TECH_STACK_ICON_KINDS.has(iconKind)) {
    errors.iconKind = 'Choose a valid icon mode.';
  }

  if (label && (label.length < 1 || label.length > 80)) {
    errors.label = 'Label must be between 1 and 80 characters.';
  }

  if (summary && (summary.length < 5 || summary.length > 220)) {
    errors.summary = 'Summary must be between 5 and 220 characters.';
  }

  if (iconKind === 'glyph' && iconValue && !TECH_STACK_GLYPHS.has(iconValue.toLowerCase())) {
    errors.iconValue = 'Choose a valid preset icon.';
  }

  if (iconKind === 'monogram') {
    const monogram = iconValue.toUpperCase();
    if (!/^[A-Z0-9]{1,4}$/.test(monogram)) {
      errors.iconValue = 'Monogram must be 1 to 4 letters or numbers.';
    }
  }

  if (iconKind === 'svg') {
    if (iconValue.length < 5 || iconValue.length > 800) {
      errors.iconValue = 'SVG path data must be between 5 and 800 characters.';
    }
  }

  const normalizedValue =
    iconKind === 'monogram'
      ? iconValue.toUpperCase()
      : iconKind === 'glyph'
        ? iconValue.toLowerCase()
        : iconValue;

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      category,
      label,
      summary,
      iconKind,
      iconValue: normalizedValue,
      glyphKey: encodeTechStackGlyphKey(iconKind, normalizedValue),
      displayOrder,
      active,
    },
  };
}

function normalizeLineList(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeText).filter(Boolean);
  }

  return String(value ?? '')
    .split('\n')
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function validatePricingPackagePayload(body = {}) {
  const errors = {};

  const serviceId = Number.parseInt(String(body.serviceId ?? ''), 10);
  const tier = normalizeText(body.tier);
  const title = normalizeText(body.title);
  const price = normalizeText(body.price);
  const originalPrice = normalizeText(body.originalPrice);
  const discountPercent = normalizeText(body.discountPercent);
  const description = normalizeText(body.description);
  const delivery = normalizeText(body.delivery);
  const badge = normalizeText(body.badge);
  const button = normalizeText(body.button);
  const features = normalizeLineList(body.features);
  const unavailable = normalizeLineList(body.unavailable);
  const displayOrder = validateCollectionOrder(body.displayOrder);
  const active = body.active !== false;

  if (!Number.isFinite(serviceId) || serviceId <= 0) errors.serviceId = 'Choose a pricing service.';
  if (!tier) errors.tier = 'Package tier is required.';
  if (!title) errors.title = 'Package title is required.';
  if (!price) errors.price = 'Package price is required.';
  if (!description) errors.description = 'Package description is required.';
  if (!delivery) errors.delivery = 'Delivery time is required.';
  if (!button) errors.button = 'Button text is required.';
  if (!features.length) errors.features = 'Add at least one available feature.';

  if (title && (title.length < 2 || title.length > 120)) {
    errors.title = 'Package title must be between 2 and 120 characters.';
  }

  if (description && (description.length < 10 || description.length > 400)) {
    errors.description = 'Description must be between 10 and 400 characters.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      serviceId,
      tier,
      title,
      price,
      originalPrice,
      discountPercent,
      description,
      delivery,
      badge,
      button,
      features,
      unavailable,
      displayOrder,
      active,
    },
  };
}

module.exports = {
  validateAdminCredentials,
  validateChatbotMessage,
  validateContactMessage,
  validateCertificatePayload,
  validateCollectionOrder,
  validateEducationPayload,
  validateExperiencePayload,
  validatePricingPackagePayload,
  validatePricingServicePayload,
  validateProjectPayload,
  validateTechStackPayload,
  validateVisitPayload,
};
