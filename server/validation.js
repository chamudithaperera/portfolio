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

  if (image && image.length > 500) {
    errors.image = 'Image path or URL is too long.';
  }

  if (summary && (summary.length < 10 || summary.length > 400)) {
    errors.summary = 'Summary must be between 10 and 400 characters.';
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

module.exports = {
  validateAdminCredentials,
  validateContactMessage,
  validateCertificatePayload,
  validateCollectionOrder,
  validateEducationPayload,
  validateProjectPayload,
};
