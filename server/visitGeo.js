const geoip = require('geoip-lite');

let regionDisplayNames = null;

function normalizeIp(value) {
  return String(value ?? '').trim().replace(/^::ffff:/, '');
}

function getRegionDisplayNames() {
  if (regionDisplayNames) {
    return regionDisplayNames;
  }

  if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
    try {
      regionDisplayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionDisplayNames;
    } catch (error) {
      // Ignore and fall back to raw codes.
    }
  }

  regionDisplayNames = null;
  return regionDisplayNames;
}

function toCountryName(code) {
  const countryCode = String(code ?? '').trim().toUpperCase();
  if (!countryCode || countryCode === 'XX' || countryCode === 'ZZ') {
    return '';
  }

  const displayNames = getRegionDisplayNames();
  if (displayNames) {
    try {
      return displayNames.of(countryCode) || countryCode;
    } catch (error) {
      // Ignore and fall back to the raw code.
    }
  }

  return countryCode;
}

function getRequestIp(req) {
  const candidates = [
    req.headers['cf-connecting-ip'],
    req.headers['true-client-ip'],
    req.headers['x-real-ip'],
    req.headers['x-forwarded-for'],
    req.ip,
    req.socket?.remoteAddress,
  ];

  for (const candidate of candidates) {
    const value = String(candidate ?? '').trim();
    if (!value) {
      continue;
    }

    const ip = value.split(',')[0].trim();
    if (ip) {
      return normalizeIp(ip);
    }
  }

  return '';
}

function lookupCountryFromIp(ip) {
  const normalizedIp = normalizeIp(ip);
  if (!normalizedIp) {
    return '';
  }

  const result = geoip.lookup(normalizedIp);
  if (!result || !result.country) {
    return '';
  }

  return toCountryName(result.country);
}

function resolveVisitCountry(req) {
  const headerCountry = String(req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || '').trim();
  if (headerCountry) {
    return toCountryName(headerCountry);
  }

  return lookupCountryFromIp(getRequestIp(req));
}

module.exports = {
  getRequestIp,
  lookupCountryFromIp,
  resolveVisitCountry,
  toCountryName,
};
