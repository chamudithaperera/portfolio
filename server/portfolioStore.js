const { supabase } = require('./supabase');
const { countVisits, listVisits } = require('./visitStore');

const TABLES = {
  certificates: 'portfolio_certificates',
  education: 'portfolio_education',
  messages: 'contact_messages',
  experience: 'portfolio_experience',
  reviews: 'portfolio_reviews',
  pricingPackages: 'portfolio_pricing_packages',
  pricingServices: 'portfolio_pricing_services',
  projects: 'portfolio_projects',
  techStacks: 'portfolio_tech_stacks',
  visits: 'site_visits',
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

function mapExperience(row) {
  return {
    id: row.id,
    period: row.period,
    role: row.role,
    org: row.org,
    current: Boolean(row.current),
    detail: row.detail,
    tags: Array.isArray(row.tags) ? row.tags : [],
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
    image: row.image || '',
    detail: row.detail,
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPricingService(row) {
  return {
    id: row.id,
    serviceKey: row.service_key,
    label: row.label,
    icon: row.icon || 'code',
    intro: row.intro,
    displayOrder: row.display_order ?? 0,
    active: row.active !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function decodeTechStackGlyphKey(rawValue) {
  const value = normalizeString(rawValue);

  if (!value) {
    return {
      iconKind: 'glyph',
      iconValue: '',
    };
  }

  if (value.startsWith('monogram:')) {
    return {
      iconKind: 'monogram',
      iconValue: value.slice('monogram:'.length),
    };
  }

  if (value.startsWith('mono:')) {
    return {
      iconKind: 'monogram',
      iconValue: value.slice('mono:'.length),
    };
  }

  if (value.startsWith('svg:')) {
    return {
      iconKind: 'svg',
      iconValue: value.slice('svg:'.length),
    };
  }

  return {
    iconKind: 'glyph',
    iconValue: value,
  };
}

function mapTechStack(row) {
  const decoded = decodeTechStackGlyphKey(row.glyph_key);
  return {
    id: row.id,
    category: row.category,
    label: row.label,
    summary: row.summary,
    iconKind: decoded.iconKind,
    iconValue: decoded.iconValue,
    glyphKey: decoded.iconValue,
    displayOrder: row.display_order ?? 0,
    active: row.active !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPricingPackage(row) {
  return {
    id: row.id,
    serviceId: row.service_id,
    tier: row.tier,
    title: row.title,
    price: row.price,
    originalPrice: row.original_price || '',
    discountPercent: row.discount_percent || '',
    description: row.description,
    delivery: row.delivery,
    badge: row.badge || '',
    button: row.button,
    features: Array.isArray(row.features) ? row.features : [],
    unavailable: Array.isArray(row.unavailable) ? row.unavailable : [],
    displayOrder: row.display_order ?? 0,
    active: row.active !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReview(row) {
  const status = normalizeString(row.status).toLowerCase();
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    projectName: row.project_name,
    service: row.service,
    rating: row.rating ?? 0,
    description: row.description,
    status: status || (row.approved_at ? 'approved' : 'pending'),
    approvedAt: row.approved_at || null,
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapVisit(row) {
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

function experiencePayload(input = {}) {
  return {
    period: normalizeString(input.period),
    role: normalizeString(input.role),
    org: normalizeString(input.org),
    current: toBoolean(input.current),
    detail: normalizeString(input.detail),
    tags: normalizeTextArray(input.tags),
    display_order: toInteger(input.displayOrder, 0),
  };
}

function certificatePayload(input = {}) {
  return {
    title: normalizeString(input.title),
    org: normalizeString(input.org),
    year: normalizeString(input.year),
    image: normalizeString(input.image),
    detail: normalizeString(input.detail),
    display_order: toInteger(input.displayOrder, 0),
  };
}

function pricingServicePayload(input = {}) {
  return {
    service_key: normalizeString(input.serviceKey).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
    label: normalizeString(input.label),
    icon: normalizeString(input.icon) || 'code',
    intro: normalizeString(input.intro),
    display_order: toInteger(input.displayOrder, 0),
    active: toBoolean(input.active),
  };
}

function techStackPayload(input = {}) {
  const iconKind = normalizeString(input.iconKind || input.icon_kind || 'glyph').toLowerCase() || 'glyph';
  const iconValue = normalizeString(input.iconValue || input.icon_value || input.glyphKey || input.glyph_key);
  const glyphKey = input.glyphKey || input.glyph_key || '';

  return {
    category: normalizeString(input.category),
    label: normalizeString(input.label),
    summary: normalizeString(input.summary),
    glyph_key: normalizeString(glyphKey || (iconKind === 'glyph' ? iconValue.toLowerCase() : iconKind === 'monogram' ? `monogram:${iconValue.toUpperCase()}` : `svg:${iconValue}`)),
    display_order: toInteger(input.displayOrder, 0),
    active: toBoolean(input.active),
  };
}

function pricingPackagePayload(input = {}) {
  const price = normalizeString(input.price);
  let originalPrice = normalizeString(input.originalPrice);
  let discountPercent = normalizeString(input.discountPercent);

  if (price && (!originalPrice || !discountPercent)) {
    const cleanedPrice = price.replace(/,/g, '');
    const numericMatch = cleanedPrice.match(/\d+/);
    if (numericMatch) {
      const currentPriceNum = parseFloat(numericMatch[0]);
      if (currentPriceNum > 0) {
        if (!discountPercent) {
          discountPercent = '25% off';
        }
        if (!originalPrice) {
          const originalPriceNum = Math.round(currentPriceNum / 0.75);
          const hasCommas = price.includes(',');
          let formattedOriginal = originalPriceNum.toString();
          if (hasCommas) {
            formattedOriginal = originalPriceNum.toLocaleString('en-US');
          }
          const rawNumIndex = price.search(/\d/);
          let prefix = '';
          let suffix = '';
          if (rawNumIndex !== -1) {
            prefix = price.substring(0, rawNumIndex);
            const suffixMatch = price.substring(rawNumIndex).match(/^[\d,]+/);
            if (suffixMatch) {
              suffix = price.substring(rawNumIndex + suffixMatch[0].length);
            }
          }
          originalPrice = `${prefix}${formattedOriginal}${suffix}`;
        }
      }
    }
  }

  return {
    service_id: toInteger(input.serviceId, 0),
    tier: normalizeString(input.tier),
    title: normalizeString(input.title),
    price: price,
    original_price: originalPrice,
    discount_percent: discountPercent,
    description: normalizeString(input.description),
    delivery: normalizeString(input.delivery),
    badge: normalizeString(input.badge),
    button: normalizeString(input.button),
    features: normalizeLineArray(input.features),
    unavailable: normalizeLineArray(input.unavailable),
    display_order: toInteger(input.displayOrder, 0),
    active: toBoolean(input.active),
  };
}

function reviewPayload(input = {}, options = {}) {
  const status = options.status || input.status || 'pending';
  const approvedAt = Object.prototype.hasOwnProperty.call(options, 'approvedAt')
    ? options.approvedAt
    : input.approvedAt || input.approved_at || null;

  return {
    name: normalizeString(input.name),
    email: normalizeString(input.email),
    project_name: normalizeString(input.projectName || input.project_name),
    service: normalizeString(input.service),
    rating: toInteger(input.rating, 0),
    description: normalizeString(input.description),
    status: normalizeString(status) || 'pending',
    approved_at: approvedAt,
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

async function safeListRows(table, mapper) {
  try {
    return await listRows(table, mapper);
  } catch (error) {
    console.error(`Unable to list rows for ${table}:`, error.message || error);
    return [];
  }
}

async function listVisitRows(limit = 200) {
  const { data, error } = await supabase
    .from(TABLES.visits)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data || []).map(mapVisit);
}

async function safeListVisitRows(limit = 200) {
  try {
    return await listVisitRows(limit);
  } catch (error) {
    console.error(`Unable to list rows for ${TABLES.visits}:`, error.message || error);
    return [];
  }
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
  const [projects, experience, education, certificates, pricingServices, techStacks, reviews] = await Promise.all([
    listRows(TABLES.projects, mapProject),
    safeListRows(TABLES.experience, mapExperience),
    listRows(TABLES.education, mapEducation),
    listRows(TABLES.certificates, mapCertificate),
    safeListPricingServices(false),
    safeListTechStacks(false),
    safeListReviews(false),
  ]);

  return { projects, experience, education, certificates, pricingServices, techStacks, reviews };
}

async function listPricingServices(admin = false) {
  let serviceQuery = supabase
    .from(TABLES.pricingServices)
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  let packageQuery = supabase
    .from(TABLES.pricingPackages)
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (!admin) {
    serviceQuery = serviceQuery.eq('active', true);
    packageQuery = packageQuery.eq('active', true);
  }

  const [{ data: serviceRows, error: serviceError }, { data: packageRows, error: packageError }] = await Promise.all([
    serviceQuery,
    packageQuery,
  ]);

  if (serviceError) throw serviceError;
  if (packageError) throw packageError;

  const packages = (packageRows || []).map(mapPricingPackage);
  return (serviceRows || []).map((row) => {
    const service = mapPricingService(row);
    return {
      ...service,
      id: service.serviceKey,
      recordId: service.id,
      packages: packages.filter((item) => Number(item.serviceId) === Number(service.id)),
    };
  });
}

async function safeListPricingServices(admin = false) {
  try {
    return await listPricingServices(admin);
  } catch (error) {
    console.error(`Unable to list pricing content:`, error.message || error);
    return [];
  }
}

async function listTechStacks(admin = false) {
  let query = supabase
    .from(TABLES.techStacks)
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (!admin) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data || []).map(mapTechStack);
}

async function safeListTechStacks(admin = false) {
  try {
    return await listTechStacks(admin);
  } catch (error) {
    console.error(`Unable to list tech stacks:`, error.message || error);
    return [];
  }
}

async function listReviews(admin = false) {
  let query = supabase
    .from(TABLES.reviews)
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  const reviews = (data || []).map(mapReview);
  if (admin) {
    return reviews;
  }

  return reviews.filter((review) => review.status === 'approved' || Boolean(review.approvedAt));
}

async function safeListReviews(admin = false) {
  try {
    return await listReviews(admin);
  } catch (error) {
    console.error(`Unable to list reviews:`, error.message || error);
    return [];
  }
}

async function getDashboardSummary() {
  const [messages, projects, experience, education, certificates, pricingPackages, techStacks, reviews, visitRows] = await Promise.all([
    safeCountRows(TABLES.messages),
    safeCountRows(TABLES.projects),
    safeCountRows(TABLES.experience),
    safeCountRows(TABLES.education),
    safeCountRows(TABLES.certificates),
    safeCountRows(TABLES.pricingPackages),
    safeCountRows(TABLES.techStacks),
    safeCountRows(TABLES.reviews),
    listVisits(1),
  ]);

  let pendingReviews = 0;
  try {
    const { count, error } = await supabase
      .from(TABLES.reviews)
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');
    if (error) {
      throw error;
    }
    pendingReviews = count || 0;
  } catch (error) {
    console.error(`Unable to load pending reviews:`, error.message || error);
  }

  let latestMessage = null;
  try {
    const { data } = await supabase
      .from(TABLES.messages)
      .select('id, name, subject, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    latestMessage = data || null;
  } catch (error) {
    console.error(`Unable to load latest message:`, error.message || error);
  }

  let latestReview = null;
  try {
    const { data } = await supabase
      .from(TABLES.reviews)
      .select('id, name, project_name, service, rating, status, created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();
    latestReview = data || null;
  } catch (error) {
    console.error(`Unable to load latest review:`, error.message || error);
  }

  let latestVisit = null;
  try {
    latestVisit = visitRows[0] || null;
  } catch (error) {
    console.error(`Unable to load latest visit:`, error.message || error);
  }

  const visits = await countVisits();

  return {
    messages,
    projects,
    experience,
    education,
    certificates,
    pricingPackages,
    techStacks,
    reviews,
    pendingReviews,
    visits,
    latestMessage: latestMessage || null,
    latestReview,
    latestVisit,
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

module.exports = {
  TABLES,
  certificatePayload,
  deleteRow,
  educationPayload,
  experiencePayload,
  getDashboardSummary,
  insertRow,
  listPortfolioContent,
  mapCertificate,
  mapEducation,
  mapExperience,
  mapPricingPackage,
  mapPricingService,
  mapReview,
  mapTechStack,
  mapProject,
  mapVisit,
  listPricingServices,
  listReviews,
  listTechStacks,
  listVisitRows,
  projectPayload,
  pricingPackagePayload,
  pricingServicePayload,
  reviewPayload,
  safeListReviews,
  safeListTechStacks,
  safeListVisitRows,
  techStackPayload,
  updateRow,
  safeCountRows,
  safeListPricingServices,
  safeListRows,
};
