const crypto = require('crypto');
const config = require('./config');

const COOKIE_NAME = 'chamx_admin_session';

function toBase64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function fromBase64Url(input) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function timingSafeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload) {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', config.sessionSecret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [body, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', config.sessionSecret).update(body).digest('base64url');

  if (!timingSafeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(body));
    if (!payload?.username || !payload?.expiresAt) return null;
    if (Date.now() > payload.expiresAt) return null;
    if (payload.username !== config.adminUsername) return null;
    return payload;
  } catch {
    return null;
  }
}

function createSessionToken(username) {
  return sign({
    username,
    issuedAt: Date.now(),
    expiresAt: Date.now() + config.sessionTtlMs,
  });
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.env === 'production',
    maxAge: config.sessionTtlMs,
    path: '/',
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.env === 'production',
    path: '/',
  });
}

function readSession(req) {
  return verify(req.cookies?.[COOKIE_NAME]);
}

function requireAdmin(req, res, next) {
  const session = readSession(req);
  if (!session) {
    return res.status(401).json({ ok: false, error: 'Not authenticated' });
  }

  req.adminSession = session;
  return next();
}

module.exports = {
  clearSessionCookie,
  createSessionToken,
  readSession,
  requireAdmin,
  setSessionCookie,
};
