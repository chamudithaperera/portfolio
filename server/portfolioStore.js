const { supabase } = require('./supabase');
const { defaultCertificates, defaultEducation, defaultProjects } = require('./portfolioData');

const TABLES = {
  certificates: 'portfolio_certificates',
  education: 'portfolio_education',
  messages: 'contact_messages',
  projects: 'portfolio_projects',
};

function normalizeString(value) {
  return String(value ?? '').trim();
}

function normalizeTextArray(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeString).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map((item) => normalizeString(item))
    .filter(Boolean);
}

function normalizeLineArray(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeString).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split('\n')
    .map((item) => normalizeString(item))
    .filter(Boolean);
}

function toInteger(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  return false;
}

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image,
    summary: row.summary,
    featuredNote: row.featured_note || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    link: row.link,
    displayOrder: row.display_order ?? 0,
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEducation(row) {
  return {
    id: row.id,
    track: row.track,
    title: row.title,
    org: row.org,
    period: row.period,
    detail: row.detail,
    badge: row.badge || '',
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCertificate(row) {
  return {
    id: row.id,
    title: row.title,
    org: row.org,
    year: row.year,
    detail: row.detail,
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function projectPayload(input = {}) {
  return {
    title: normalizeString(input.title),
    category: normalizeString(input.category),
    image: normalizeString(input.image),
    summary: normalizeString(input.summary),
    featured_note: normalizeString(input.featuredNote),
    tags: normalizeTextArray(input.tags),
    highlights: normalizeLineArray(input.highlights),
    link: normalizeString(input.link),
    display_order: toInteger(input.displayOrder, 0),
    is_featured: toBoolean(input.isFeatured),
  };
}

function educationPayload(input = {}) {
  return {
    track: normalizeString(input.track),
    title: normalizeString(input.title),
    org: normalizeString(input.org),
    period: normalizeString(input.period),
    detail: normalizeString(input.detail),
    badge: normalizeString(input.badge),
    display_order: toInteger(input.displayOrder, 0),
  };
}

function certificatePayload(input = {}) {
  return {
    title: normalizeString(input.title),
    org: normalizeString(input.org),
    year: normalizeString(input.year),
    detail: normalizeString(input.detail),
    display_order: toInteger(input.displayOrder, 0),
  };
}

async function listRows(table, mapper) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(mapper);
}

async function countRows(table) {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true });
  if (error) {
    throw error;
  }
  return count || 0;
}

async function safeCountRows(table) {
  try {
    return await countRows(table);
  } catch (error) {
    console.error(`Unable to count rows for ${table}:`, error.message || error);
    return 0;
  }
}

async function listPortfolioContent() {
  const [projects, education, certificates] = await Promise.all([
    listRows(TABLES.projects, mapProject),
    listRows(TABLES.education, mapEducation),
    listRows(TABLES.certificates, mapCertificate),
  ]);

  return { projects, education, certificates };
}

async function listPortfolioContentOrFallback() {
  try {
    return await listPortfolioContent();
  } catch (error) {
    console.error('Portfolio content lookup failed, using fallback content:', error.message || error);
    return {
      projects: defaultProjects.map((item, index) => ({ ...item, id: `fallback-project-${index + 1}` })),
      education: defaultEducation.map((item, index) => ({ ...item, id: `fallback-education-${index + 1}` })),
      certificates: defaultCertificates.map((item, index) => ({ ...item, id: `fallback-certificate-${index + 1}` })),
    };
  }
}

async function getDashboardSummary() {
  const [messages, projects, education, certificates] = await Promise.all([
    safeCountRows(TABLES.messages),
    safeCountRows(TABLES.projects),
    safeCountRows(TABLES.education),
    safeCountRows(TABLES.certificates),
  ]);

  const { data: latestMessage } = await supabase
    .from(TABLES.messages)
    .select('id, name, subject, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    messages,
    projects,
    education,
    certificates,
    latestMessage: latestMessage || null,
  };
}

async function insertRow(table, payload, mapper) {
  const { data, error } = await supabase.from(table).insert([payload]).select('*').single();
  if (error) {
    throw error;
  }
  return mapper(data);
}

async function updateRow(table, id, payload, mapper) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select('*').single();
  if (error) {
    throw error;
  }
  return mapper(data);
}

async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

async function ensureSeededContent() {
  const seeds = [
    [TABLES.projects, defaultProjects, projectPayload],
    [TABLES.education, defaultEducation, educationPayload],
    [TABLES.certificates, defaultCertificates, certificatePayload],
  ];

  for (const [table, items, toPayload] of seeds) {
    try {
      const count = await countRows(table);
      if (count > 0) continue;
      const rows = items.map((item) => toPayload(item));
      if (rows.length) {
        const { error } = await supabase.from(table).insert(rows);
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error(`Unable to seed ${table}:`, error.message || error);
    }
  }
}

module.exports = {
  TABLES,
  certificatePayload,
  deleteRow,
  educationPayload,
  ensureSeededContent,
  getDashboardSummary,
  insertRow,
  listPortfolioContent,
  listPortfolioContentOrFallback,
  mapCertificate,
  mapEducation,
  mapProject,
  projectPayload,
  updateRow,
  safeCountRows,
};
