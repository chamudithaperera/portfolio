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

function normalizeHeaderText(value) {
  const text = String(value ?? '').trim();
  if (!text) {
    return '';
  }

  try {
    return decodeURIComponent(text).trim();
  } catch (error) {
    return text;
  }
}

function toCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
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

function lookupLocationFromIp(ip) {
  const normalizedIp = normalizeIp(ip);
  if (!normalizedIp) {
    return {};
  }

  const result = geoip.lookup(normalizedIp);
  if (!result) {
    return {};
  }

  const [latitude, longitude] = Array.isArray(result.ll) ? result.ll : [];

  return {
    country: toCountryName(result.country),
    countryCode: normalizeText(result.country).toUpperCase(),
    region: normalizeText(result.region),
    city: normalizeText(result.city),
    timezone: normalizeText(result.timezone),
    latitude: toCoordinate(latitude),
    longitude: toCoordinate(longitude),
  };
}

function lookupCountryFromIp(ip) {
  return lookupLocationFromIp(ip).country || '';
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function resolveVisitLocation(req) {
  const ipLocation = lookupLocationFromIp(getRequestIp(req));
  const headerCountry = normalizeHeaderText(req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country']);
  const headerCountryCode = headerCountry.toUpperCase();
  const headerRegion = normalizeHeaderText(req.headers['x-vercel-ip-country-region']);
  const headerCity = normalizeHeaderText(req.headers['x-vercel-ip-city']);
  const headerTimezone = normalizeHeaderText(req.headers['x-vercel-ip-timezone']);
  const headerLatitude = normalizeHeaderText(req.headers['x-vercel-ip-latitude']);
  const headerLongitude = normalizeHeaderText(req.headers['x-vercel-ip-longitude']);

  return {
    country: headerCountry ? toCountryName(headerCountry) : ipLocation.country || '',
    countryCode: headerCountryCode && !['XX', 'ZZ'].includes(headerCountryCode) ? headerCountryCode : ipLocation.countryCode || '',
    region: headerRegion || ipLocation.region || '',
    city: headerCity || ipLocation.city || '',
    timezone: headerTimezone || ipLocation.timezone || '',
    latitude: toCoordinate(headerLatitude) ?? ipLocation.latitude ?? null,
    longitude: toCoordinate(headerLongitude) ?? ipLocation.longitude ?? null,
  };
}

function resolveVisitCountry(req) {
  return resolveVisitLocation(req).country || '';
}

module.exports = {
  getRequestIp,
  lookupCountryFromIp,
  lookupLocationFromIp,
  resolveVisitCountry,
  resolveVisitLocation,
  toCountryName,
};
