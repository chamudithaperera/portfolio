const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const { supabase } = require('./supabase');

const visitsFile = path.join(__dirname, 'data', 'site-visits.json');
const localVisitLimit = 2000;
const visitsTable = 'site_visits';

function normalizeText(value) {
  return String(value ?? '').trim();
}

function mapVisit(row = {}) {
  return {
    id: row.id,
    path: row.path,
    referrer: row.referrer || '',
    ipAddress: row.ip_address || '',
    userAgent: row.user_agent || '',
    language: row.language || '',
    screen: row.screen || '',
    viewport: row.viewport || '',
    pageTitle: row.page_title || '',
    country: row.country || '',
    countryCode: row.country_code || '',
    region: row.region || '',
    city: row.city || '',
    timezone: row.timezone || '',
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    timezoneOffset: row.timezone_offset ?? null,
    createdAt: row.created_at,
  };
}

function normalizeVisitRow(row = {}) {
  return {
    id: row.id || `visit-${Date.now()}-${crypto.randomUUID()}`,
    path: normalizeText(row.path),
    referrer: normalizeText(row.referrer),
    ip_address: normalizeText(row.ip_address),
    user_agent: normalizeText(row.user_agent),
    language: normalizeText(row.language),
    screen: normalizeText(row.screen),
    viewport: normalizeText(row.viewport),
    page_title: normalizeText(row.page_title),
    country: normalizeText(row.country),
    country_code: normalizeText(row.country_code),
    region: normalizeText(row.region),
    city: normalizeText(row.city),
    timezone: normalizeText(row.timezone),
    latitude: Number.isFinite(row.latitude) ? row.latitude : null,
    longitude: Number.isFinite(row.longitude) ? row.longitude : null,
    timezone_offset: Number.isFinite(row.timezone_offset) ? row.timezone_offset : null,
    created_at: row.created_at || new Date().toISOString(),
  };
}

function toSupabaseVisitPayload(row = {}) {
  const normalized = normalizeVisitRow(row);
  const { id, ...payload } = normalized;
  return payload;
}

function toBasicSupabaseVisitPayload(row = {}) {
  const payload = toSupabaseVisitPayload(row);
  const { country_code, region, city, timezone, latitude, longitude, ...basicPayload } = payload;
  return basicPayload;
}

async function readLocalVisitRows() {
  try {
    const raw = await fs.readFile(visitsFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeVisitRow) : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Unable to read local visit store:', error.message || error);
    return [];
  }
}

async function writeLocalVisitRows(rows) {
  await fs.mkdir(path.dirname(visitsFile), { recursive: true });
  await fs.writeFile(visitsFile, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
}

async function appendLocalVisitRow(row) {
  const rows = await readLocalVisitRows();
  rows.unshift(normalizeVisitRow(row));
  await writeLocalVisitRows(rows.slice(0, localVisitLimit));
}

async function listLocalVisits(limit = 200) {
  const rows = await readLocalVisitRows();
  return rows.slice(0, limit).map(mapVisit);
}

async function recordVisit(row) {
  const payload = normalizeVisitRow(row);
  const dbPayload = toSupabaseVisitPayload(row);

  try {
    const { error } = await supabase.from(visitsTable).insert([dbPayload]);
    if (!error) {
      return { stored: true, source: 'supabase', visit: mapVisit(payload) };
    }

    if (String(error.message || '').includes('column')) {
      const { error: retryError } = await supabase.from(visitsTable).insert([toBasicSupabaseVisitPayload(row)]);
      if (!retryError) {
        return { stored: true, source: 'supabase', visit: mapVisit(payload) };
      }
    }

    console.error('Supabase visit insert failed:', error);
  } catch (error) {
    console.error('Supabase visit insert failed:', error.message || error);
  }

  await appendLocalVisitRow(payload);
  return { stored: true, source: 'local', visit: mapVisit(payload) };
}

async function listVisits(limit = 200) {
  const { data, error } = await supabase
    .from(visitsTable)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!error) {
    return (data || []).map(mapVisit);
  }

  console.error('Supabase visit read failed:', error);
  return listLocalVisits(limit);
}

async function countVisits() {
  const { count, error } = await supabase.from(visitsTable).select('id', { count: 'exact', head: true });
  if (!error) {
    return count || 0;
  }

  console.error('Supabase visit count failed:', error);
  const localRows = await readLocalVisitRows();
  return localRows.length;
}

module.exports = {
  appendLocalVisitRow,
  countVisits,
  listLocalVisits,
  listVisits,
  recordVisit,
  readLocalVisitRows,
  writeLocalVisitRows,
};
