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

module.exports = {
  validateAdminCredentials,
  validateContactMessage,
};
