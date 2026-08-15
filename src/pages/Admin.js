import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { apiRequest } from '../utils/api';
import './Admin.css';

const tabItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview of the site', icon: 'grid' },
  { id: 'messages', label: 'Messages', description: 'User inquiries', icon: 'messages' },
  { id: 'visits', label: 'Visits', description: 'Visitor analytics', icon: 'globe' },
  { id: 'projects', label: 'Projects', description: 'CRUD portfolio projects', icon: 'project' },
  { id: 'pricing', label: 'Pricing', description: 'Edit services and packages', icon: 'pricing' },
  { id: 'techStacks', label: 'Tech Stacks', description: 'Manage the galaxy items', icon: 'spark' },
  { id: 'content', label: 'Content', description: 'Manage experience and education', icon: 'education' },
];

const emptyProjectForm = {
  title: '',
  category: '',
  image: '',
  summary: '',
  featuredNote: '',
  tags: '',
  highlights: '',
  link: '',
  displayOrder: '',
  isFeatured: false,
};

const emptyEducationForm = {
  track: '',
  title: '',
  org: '',
  period: '',
  detail: '',
  badge: '',
  displayOrder: '',
};

const emptyExperienceForm = {
  period: '',
  role: '',
  org: '',
  current: false,
  detail: '',
  tags: '',
  displayOrder: '',
};

const emptyCertificateForm = {
  title: '',
  org: '',
  year: '',
  image: '',
  detail: '',
  displayOrder: '',
};

const emptyPricingServiceForm = {
  serviceKey: '',
  label: '',
  icon: 'code',
  intro: '',
  displayOrder: '',
  active: true,
};

const emptyPricingPackageForm = {
  serviceId: '',
  tier: '',
  title: '',
  price: '',
  originalPrice: '',
  discountPercent: '',
  description: '',
  delivery: '',
  badge: '',
  button: '',
  features: '',
  unavailable: '',
  displayOrder: '',
  active: true,
};

const techStackCategoryOptions = [
  { value: 'Languages', label: 'Languages' },
  { value: 'Frameworks & Libraries', label: 'Frameworks & Libraries' },
  { value: 'Backend & Database', label: 'Backend & Database' },
  { value: 'DevOps & Other Tools', label: 'DevOps & Other Tools' },
];

const techStackGlyphOptions = [
  { value: 'dart', label: 'Dart' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'php', label: 'PHP' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'react', label: 'React' },
  { value: 'spring-boot', label: 'Spring Boot' },
  { value: 'express', label: 'Express.js' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'node', label: 'Node.js' },
  { value: 'firebase', label: 'Firebase' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'redis', label: 'Redis' },
  { value: 'mqtt', label: 'MQTT' },
  { value: 'jwt', label: 'JWT Auth' },
  { value: 'git', label: 'Git' },
  { value: 'github', label: 'GitHub' },
  { value: 'docker', label: 'Docker' },
  { value: 'postman', label: 'Postman' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'figma', label: 'Figma' },
  { value: 'photoshop', label: 'Adobe Photoshop' },
  { value: 'react-native', label: 'React Native' },
  { value: 'riverpod', label: 'Riverpod' },
  { value: 'api', label: 'RESTful APIs' },
];

const emptyTechStackForm = {
  category: '',
  label: '',
  summary: '',
  glyphKey: '',
  displayOrder: '',
  active: true,
};

const iconPaths = {
  arrowLeft: ['M20 12H4', 'm10 6-6-6 6-6'],
  arrowRight: ['M4 12h16', 'm10-6 6 6-6 6'],
  calendar: ['M4 6h16v14H4z', 'M8 4v4', 'M16 4v4', 'M4 10h16'],
  check: ['m5 13 4 4L19 7'],
  circle: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  certificate: ['M6 4h12v16H6z', 'M8 8h8', 'M8 12h8', 'M10 20l2-3 2 3'],
  dashboard: ['M4 4h7v7H4z', 'M13 4h7v4h-7z', 'M13 10h7v10h-7z', 'M4 13h7v7H4z'],
  education: ['M12 4 3 8l9 4 9-4-9-4z', 'M6 10v4c0 2 3 4 6 4s6-2 6-4v-4'],
  delete: ['M6 7h12', 'M9 7V5h6v2', 'M8 7v12h8V7', 'M10 11v5', 'M14 11v5'],
  edit: ['M4 20h4l10-10-4-4L4 16v4z', 'M13 7l4 4'],
  eye: ['M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  bell: ['M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8', 'M10 20h4'],
  home: ['M3 11l9-7 9 7', 'M5 10v10h14V10', 'M9 20v-6h6v6'],
  globe: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2c3 3 3.5 7 3.5 10s-.5 7-3.5 10', 'M12 2c-3 3-3.5 7-3.5 10s.5 7 3.5 10'],
  inbox: ['M4 5h16v14H4z', 'M4 13h4l2 3h4l2-3h4'],
  lock: ['M8 11V8a4 4 0 0 1 8 0v3', 'M6 11h12v9H6z', 'M12 15v2'],
  mail: ['M4 5h16v14H4z', 'm4 7 8 6 8-6'],
  link: ['M10 14a4 4 0 0 1 0-6l2-2a4 4 0 1 1 6 6l-1 1', 'M14 10a4 4 0 0 1 0 6l-2 2a4 4 0 1 1-6-6l1-1'],
  messages: ['M4 5h16v11H9l-5 4z', 'M7 9h10', 'M7 12h6'],
  plus: ['M12 5v14', 'M5 12h14'],
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .6 2.9.7a2 2 0 0 1 1.7 2z'],
  pricing: ['M12 2v20', 'M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6'],
  project: ['M4 7h16v10H4z', 'M8 7V4h8v3', 'M4 11h16'],
  refresh: ['M21 12a9 9 0 1 1-3-6.7', 'M21 3v6h-6'],
  save: ['M5 5h11l3 3v11H5z', 'M8 5v6h8V5', 'M8 16h8'],
  search: ['M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z', 'm16 16 5 5'],
  spark: ['m12 3-1.1 3.2L8 7.4l2.9 1.3L12 12l1.1-3.3L16 7.4l-2.9-1.2L12 3z'],
  tag: ['M5 8V5h3', 'M4 4l7 7-6 6-7-7z'],
  trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 13h10l1-13', 'M9 7V4h6v3'],
  drag: ['M4 8h16', 'M4 12h16', 'M4 16h16'],
};

function Icon({ name, size = 16, className = '' }) {
  const paths = iconPaths[name] || iconPaths.spark;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

function formatDate(value) {
  if (!value) return 'Unknown time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatShortDate(value) {
  if (!value) return 'Unknown date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatTimezoneOffset(value) {
  if (value === null || value === undefined || value === '') return 'Unknown';
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) return 'Unknown';
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0');
  const mins = String(absolute % 60).padStart(2, '0');
  const sign = minutes > 0 ? '-' : '+';
  return `UTC${sign}${hours}:${mins}`;
}

function formatVisitLocation(visit = {}) {
  const parts = [visit.city, visit.region, visit.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Unknown';
}

function formatCoordinates(visit = {}) {
  const latitude = Number(visit.latitude);
  const longitude = Number(visit.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return 'Unknown';
  }
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

function truncateText(value, maxLength = 48) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function splitCommaList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLineList(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinCommaList(value) {
  return Array.isArray(value) ? value.join(', ') : '';
}

function joinLineList(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

function projectToForm(project) {
  if (!project) return emptyProjectForm;
  return {
    title: project.title || '',
    category: project.category || '',
    image: project.image || '',
    summary: project.summary || '',
    featuredNote: project.featuredNote || '',
    tags: joinCommaList(project.tags),
    highlights: joinLineList(project.highlights),
    link: project.link || '',
    displayOrder: project.displayOrder ?? '',
    isFeatured: Boolean(project.isFeatured),
  };
}

function educationToForm(item) {
  if (!item) return emptyEducationForm;
  return {
    track: item.track || '',
    title: item.title || '',
    org: item.org || '',
    period: item.period || '',
    detail: item.detail || '',
    badge: item.badge || '',
    displayOrder: item.displayOrder ?? '',
  };
}

function experienceToForm(item) {
  if (!item) return emptyExperienceForm;
  return {
    period: item.period || '',
    role: item.role || '',
    org: item.org || '',
    current: Boolean(item.current),
    detail: item.detail || '',
    tags: joinCommaList(item.tags),
    displayOrder: item.displayOrder ?? '',
  };
}

function certificateToForm(item) {
  if (!item) return emptyCertificateForm;
  return {
    title: item.title || '',
    org: item.org || '',
    year: item.year || '',
    image: item.image || '',
    detail: item.detail || '',
    displayOrder: item.displayOrder ?? '',
  };
}

function pricingServiceToForm(item) {
  if (!item) return emptyPricingServiceForm;
  return {
    serviceKey: item.serviceKey || item.id || '',
    label: item.label || '',
    icon: item.icon || 'code',
    intro: item.intro || '',
    displayOrder: item.displayOrder ?? '',
    active: item.active !== false,
  };
}

function pricingPackageToForm(item, defaultServiceId = '') {
  if (!item) return { ...emptyPricingPackageForm, serviceId: defaultServiceId };
  return {
    serviceId: item.serviceId ?? defaultServiceId,
    tier: item.tier || '',
    title: item.title || '',
    price: item.price || '',
    originalPrice: item.originalPrice || '',
    discountPercent: item.discountPercent || '',
    description: item.description || '',
    delivery: item.delivery || '',
    badge: item.badge || '',
    button: item.button || '',
    features: joinLineList(item.features),
    unavailable: joinLineList(item.unavailable),
    displayOrder: item.displayOrder ?? '',
    active: item.active !== false,
  };
}

function projectFormToBody(form) {
  return {
    title: form.title,
    category: form.category,
    image: form.image,
    summary: form.summary,
    featuredNote: form.featuredNote,
    tags: splitCommaList(form.tags),
    highlights: splitLineList(form.highlights),
    link: form.link,
    displayOrder: form.displayOrder,
    isFeatured: Boolean(form.isFeatured),
  };
}

function getApiFieldErrors(error) {
  const details = error?.data?.details;
  if (!details || typeof details !== 'object' || Array.isArray(details)) return {};

  return Object.entries(details).reduce((errors, [field, message]) => {
    if (typeof message === 'string' && message.trim()) {
      errors[field] = message;
    }
    return errors;
  }, {});
}

function educationFormToBody(form) {
  return {
    track: form.track,
    title: form.title,
    org: form.org,
    period: form.period,
    detail: form.detail,
    badge: form.badge,
    displayOrder: form.displayOrder,
  };
}

function experienceFormToBody(form) {
  return {
    period: form.period,
    role: form.role,
    org: form.org,
    current: Boolean(form.current),
    detail: form.detail,
    tags: splitCommaList(form.tags),
    displayOrder: form.displayOrder,
  };
}

function certificateFormToBody(form) {
  return {
    title: form.title,
    org: form.org,
    year: form.year,
    image: form.image,
    detail: form.detail,
    displayOrder: form.displayOrder,
  };
}

function pricingServiceFormToBody(form) {
  return {
    serviceKey: form.serviceKey,
    label: form.label,
    icon: form.icon,
    intro: form.intro,
    displayOrder: form.displayOrder,
    active: Boolean(form.active),
  };
}

function pricingPackageFormToBody(form) {
  return {
    serviceId: form.serviceId,
    tier: form.tier,
    title: form.title,
    price: form.price,
    originalPrice: form.originalPrice,
    discountPercent: form.discountPercent,
    description: form.description,
    delivery: form.delivery,
    badge: form.badge,
    button: form.button,
    features: splitLineList(form.features),
    unavailable: splitLineList(form.unavailable),
    displayOrder: form.displayOrder,
    active: Boolean(form.active),
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.readAsDataURL(file);
  });
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="admin-empty-state">
      <span className="admin-empty-icon">
        <Icon name={icon} size={18} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action ? <div className="admin-empty-action">{action}</div> : null}
    </div>
  );
}

function FieldError({ message }) {
  return message ? <small className="admin-field-error">{message}</small> : null;
}

function TabButton({ active, icon, label, description, onClick }) {
  return (
    <button type="button" className={`admin-tab-button ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span className="admin-tab-icon">
        <Icon name={icon} size={15} />
      </span>
      <span className="admin-tab-copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}

function StatCard({ label, value, tone = 'blue' }) {
  return (
    <article className={`admin-stat-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{String(value ?? 0).padStart(2, '0')}</strong>
    </article>
  );
}

function Admin() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingPricingPackage, setIsEditingPricingPackage] = useState(false);
  const [isEditingPricingService, setIsEditingPricingService] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [messageActionPending, setMessageActionPending] = useState('');

  const [visits, setVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitsError, setVisitsError] = useState('');
  const [selectedVisitId, setSelectedVisitId] = useState('');

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState('');
  const [projectFieldErrors, setProjectFieldErrors] = useState({});
  const [projectStatus, setProjectStatus] = useState('');
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const [projectImageActionPending, setProjectImageActionPending] = useState(false);
  const [projectImageStatus, setProjectImageStatus] = useState('');
  const [projectImageError, setProjectImageError] = useState('');
  const [projectImagePreview, setProjectImagePreview] = useState('');

  const [experience, setExperience] = useState([]);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceError, setExperienceError] = useState('');
  const [selectedExperienceId, setSelectedExperienceId] = useState('');
  const [experienceForm, setExperienceForm] = useState(emptyExperienceForm);
  const [experienceSaving, setExperienceSaving] = useState(false);
  const [experienceStatus, setExperienceStatus] = useState('');

  const [contentMode, setContentMode] = useState('experience');

  const [education, setEducation] = useState([]);
  const [educationLoading, setEducationLoading] = useState(false);
  const [educationError, setEducationError] = useState('');
  const [selectedEducationId, setSelectedEducationId] = useState('');
  const [educationForm, setEducationForm] = useState(emptyEducationForm);
  const [educationSaving, setEducationSaving] = useState(false);
  const [educationStatus, setEducationStatus] = useState('');

  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesError, setCertificatesError] = useState('');
  const [selectedCertificateId, setSelectedCertificateId] = useState('');
  const [certificateForm, setCertificateForm] = useState(emptyCertificateForm);
  const [certificateSaving, setCertificateSaving] = useState(false);
  const [certificateStatus, setCertificateStatus] = useState('');
  const [certificateImageFile, setCertificateImageFile] = useState(null);
  const [certificateImageUploading, setCertificateImageUploading] = useState(false);
  const [certificateImageActionPending, setCertificateImageActionPending] = useState(false);
  const [certificateImageStatus, setCertificateImageStatus] = useState('');
  const [certificateImageError, setCertificateImageError] = useState('');
  const [certificateImagePreview, setCertificateImagePreview] = useState('');

  const [pricingServices, setPricingServices] = useState([]);
  const [pricingPackages, setPricingPackages] = useState([]);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState('');
  const [pricingStatus, setPricingStatus] = useState('');
  const [pricingMode, setPricingMode] = useState('packages');
  const [selectedPricingServiceId, setSelectedPricingServiceId] = useState('');
  const [selectedPricingPackageId, setSelectedPricingPackageId] = useState('');
  const [pricingServiceForm, setPricingServiceForm] = useState(emptyPricingServiceForm);
  const [pricingPackageForm, setPricingPackageForm] = useState(emptyPricingPackageForm);
  const [pricingSaving, setPricingSaving] = useState(false);

  const selectedMessage = useMemo(
    () => messages.find((message) => String(message.id) === String(selectedMessageId)) || null,
    [messages, selectedMessageId],
  );

  const selectedVisit = useMemo(
    () => visits.find((visit) => String(visit.id) === String(selectedVisitId)) || null,
    [selectedVisitId, visits],
  );

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === String(selectedProjectId)) || null,
    [projects, selectedProjectId],
  );

  const selectedExperience = useMemo(
    () => experience.find((item) => String(item.id) === String(selectedExperienceId)) || null,
    [experience, selectedExperienceId],
  );

  const selectedEducation = useMemo(
    () => education.find((item) => String(item.id) === String(selectedEducationId)) || null,
    [education, selectedEducationId],
  );

  const selectedCertificate = useMemo(
    () => certificates.find((item) => String(item.id) === String(selectedCertificateId)) || null,
    [certificates, selectedCertificateId],
  );

  const selectedPricingService = useMemo(
    () => pricingServices.find((item) => String(item.recordId || item.id) === String(selectedPricingServiceId)) || null,
    [pricingServices, selectedPricingServiceId],
  );

  const selectedPricingPackage = useMemo(
    () => pricingPackages.find((item) => String(item.id) === String(selectedPricingPackageId)) || null,
    [pricingPackages, selectedPricingPackageId],
  );

  const stats = useMemo(() => {
    const counts = dashboard || {};
    return {
      messages: counts.messages ?? messages.length,
      visits: counts.visits ?? visits.length,
      projects: counts.projects ?? projects.length,
      experience: counts.experience ?? experience.length,
      education: counts.education ?? education.length,
      certificates: counts.certificates ?? certificates.length,
      pricingPackages: counts.pricingPackages ?? pricingPackages.length,
      unread: messages.filter((item) => (item.status || 'new') === 'new').length,
    };
  }, [certificates.length, dashboard, education.length, experience.length, messages, pricingPackages.length, projects.length, visits.length]);

  async function loadDashboard() {
    setDashboardLoading(true);
    setDashboardError('');
    try {
      const response = await apiRequest('/api/admin/dashboard');
      setDashboard(response.summary || null);
    } catch (error) {
      setDashboardError(error.message || 'Unable to load dashboard summary.');
    } finally {
      setDashboardLoading(false);
    }
  }

  async function loadMessages(query = messageSearch) {
    setMessagesLoading(true);
    setMessagesError('');
    try {
      const response = await apiRequest(`/api/admin/messages?search=${encodeURIComponent(query)}`);
      const loaded = response.messages || [];
      setMessages(loaded);
      setSelectedMessageId((current) => (current && loaded.some((item) => String(item.id) === String(current)) ? current : ''));
    } catch (error) {
      setMessagesError(error.message || 'Unable to load messages.');
    } finally {
      setMessagesLoading(false);
    }
  }

  async function loadVisits() {
    setVisitsLoading(true);
    setVisitsError('');
    try {
      const response = await apiRequest('/api/admin/visits');
      const loaded = response.visits || [];
      setVisits(loaded);
      setSelectedVisitId((current) => (current && loaded.some((item) => String(item.id) === String(current)) ? current : ''));
    } catch (error) {
      setVisitsError(error.message || 'Unable to load website visits.');
      setVisits([]);
      setSelectedVisitId('');
    } finally {
      setVisitsLoading(false);
    }
  }

  async function loadProjects() {
    setProjectsLoading(true);
    setProjectsError('');
    try {
      const response = await apiRequest('/api/admin/projects');
      const loaded = response.projects || [];
      setProjects(loaded);
      setSelectedProjectId((current) => {
        if (current && loaded.some((item) => String(item.id) === String(current))) {
          return current;
        }
        return loaded[0] ? String(loaded[0].id) : '';
      });
    } catch (error) {
      setProjectsError(error.message || 'Unable to load projects.');
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }

  async function loadExperience() {
    setExperienceLoading(true);
    setExperienceError('');
    try {
      const response = await apiRequest('/api/admin/experience');
      const loaded = response.experience || [];
      setExperience(loaded);
      setSelectedExperienceId((current) => {
        if (current && loaded.some((item) => String(item.id) === String(current))) {
          return current;
        }
        return loaded[0] ? String(loaded[0].id) : '';
      });
    } catch (error) {
      setExperienceError(error.message || 'Unable to load work experience entries.');
      setExperience([]);
    } finally {
      setExperienceLoading(false);
    }
  }

  async function loadEducation() {
    setEducationLoading(true);
    setEducationError('');
    try {
      const response = await apiRequest('/api/admin/education');
      const loaded = response.education || [];
      setEducation(loaded);
      setSelectedEducationId((current) => {
        if (current && loaded.some((item) => String(item.id) === String(current))) {
          return current;
        }
        return loaded[0] ? String(loaded[0].id) : '';
      });
    } catch (error) {
      setEducationError(error.message || 'Unable to load education entries.');
      setEducation([]);
    } finally {
      setEducationLoading(false);
    }
  }

  async function loadCertificates() {
    setCertificatesLoading(true);
    setCertificatesError('');
    try {
      const response = await apiRequest('/api/admin/certificates');
      const loaded = response.certificates || [];
      setCertificates(loaded);
      setSelectedCertificateId((current) => {
        if (current && loaded.some((item) => String(item.id) === String(current))) {
          return current;
        }
        return loaded[0] ? String(loaded[0].id) : '';
      });
    } catch (error) {
      setCertificatesError(error.message || 'Unable to load certificates.');
      setCertificates([]);
    } finally {
      setCertificatesLoading(false);
    }
  }

  async function loadPricing() {
    setPricingLoading(true);
    setPricingError('');
    try {
      const response = await apiRequest('/api/admin/pricing');
      const loadedServices = response.pricingServices || [];
      const loadedPackages = response.pricingPackages || [];
      setPricingServices(loadedServices);
      setPricingPackages(loadedPackages);
      setSelectedPricingServiceId((current) => {
        if (current && loadedServices.some((item) => String(item.recordId || item.id) === String(current))) {
          return current;
        }
        return loadedServices[0] ? String(loadedServices[0].recordId || loadedServices[0].id) : '';
      });
      setSelectedPricingPackageId((current) => {
        if (current && loadedPackages.some((item) => String(item.id) === String(current))) {
          return current;
        }
        return loadedPackages[0] ? String(loadedPackages[0].id) : '';
      });
    } catch (error) {
      setPricingError(error.message || 'Unable to load pricing content.');
      setPricingServices([]);
      setPricingPackages([]);
    } finally {
      setPricingLoading(false);
    }
  }

  async function refreshDashboardTab() {
    await Promise.allSettled([
      loadDashboard(),
      loadMessages(messageSearch),
      loadVisits(),
      loadProjects(),
      loadExperience(),
      loadEducation(),
      loadCertificates(),
      loadPricing(),
    ]);
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const response = await apiRequest('/api/admin/session');
        if (!active) return;
        if (response.authenticated) {
          setAuthenticated(true);
          await refreshDashboardTab();
        } else {
          setAuthenticated(false);
        }
      } catch {
        if (active) {
          setAuthenticated(false);
        }
      } finally {
        if (active) {
          setBootstrapping(false);
        }
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authenticated) return undefined;

    const timer = window.setTimeout(() => {
      loadMessages(messageSearch);
    }, 250);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageSearch, authenticated]);

  useEffect(() => {
    if (selectedProject) {
      setProjectForm(projectToForm(selectedProject));
    } else {
      setProjectForm(emptyProjectForm);
    }
    setProjectFieldErrors({});
    setProjectImageFile(null);
    setProjectImageStatus('');
    setProjectImageError('');
  }, [selectedProject]);

  useEffect(() => {
    if (!projectImageFile) {
      setProjectImagePreview('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(projectImageFile);
    setProjectImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [projectImageFile]);

  useEffect(() => {
    if (selectedExperience) {
      setExperienceForm(experienceToForm(selectedExperience));
    } else {
      setExperienceForm(emptyExperienceForm);
    }
  }, [selectedExperience]);

  useEffect(() => {
    if (selectedEducation) {
      setEducationForm(educationToForm(selectedEducation));
    } else {
      setEducationForm(emptyEducationForm);
    }
  }, [selectedEducation]);

  useEffect(() => {
    if (selectedCertificate) {
      setCertificateForm(certificateToForm(selectedCertificate));
    } else {
      setCertificateForm(emptyCertificateForm);
    }
    setCertificateImageFile(null);
    setCertificateImageStatus('');
    setCertificateImageError('');
    setCertificateImagePreview('');
    setCertificateImageUploading(false);
    setCertificateImageActionPending(false);
  }, [selectedCertificate]);

  useEffect(() => {
    setPricingServiceForm(pricingServiceToForm(selectedPricingService));
  }, [selectedPricingService]);

  useEffect(() => {
    const defaultServiceId = selectedPricingServiceId || (pricingServices[0]?.recordId ? String(pricingServices[0].recordId) : '');
    setPricingPackageForm(pricingPackageToForm(selectedPricingPackage, defaultServiceId));
  }, [pricingServices, selectedPricingPackage, selectedPricingServiceId]);

  useEffect(() => {
    if (!certificateImageFile) {
      setCertificateImagePreview('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(certificateImageFile);
    setCertificateImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [certificateImageFile]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoginPending(true);

    try {
      await apiRequest('/api/admin/login', {
        method: 'POST',
        body: loginForm,
      });
      setAuthenticated(true);
      setActiveTab('dashboard');
      setMessageSearch('');
      await refreshDashboardTab();
    } catch (error) {
      setLoginError(error.message || 'Login failed.');
    } finally {
      setLoginPending(false);
    }
  };

  const handleLogout = async () => {
    setLogoutPending(true);
    try {
      await apiRequest('/api/admin/logout', { method: 'POST' });
      setAuthenticated(false);
      setDashboard(null);
      setMessages([]);
      setVisits([]);
      setProjects([]);
      setExperience([]);
      setEducation([]);
      setCertificates([]);
      setPricingServices([]);
      setPricingPackages([]);
      setSelectedMessageId('');
      setSelectedProjectId('');
      setSelectedExperienceId('');
      setSelectedEducationId('');
      setSelectedCertificateId('');
      setSelectedPricingServiceId('');
      setSelectedPricingPackageId('');
      setProjectForm(emptyProjectForm);
      setExperienceForm(emptyExperienceForm);
      setEducationForm(emptyEducationForm);
      setCertificateForm(emptyCertificateForm);
      setPricingServiceForm(emptyPricingServiceForm);
      setPricingPackageForm(emptyPricingPackageForm);
      setProjectImageFile(null);
      setProjectImageStatus('');
      setProjectImageError('');
      setProjectImagePreview('');
      setProjectImageUploading(false);
      setProjectImageActionPending(false);
      setExperienceLoading(false);
      setExperienceSaving(false);
      setExperienceStatus('');
      setExperienceError('');
      setCertificateImageFile(null);
      setCertificateImageStatus('');
      setCertificateImageError('');
      setCertificateImagePreview('');
      setCertificateImageUploading(false);
      setCertificateImageActionPending(false);
      setMessageSearch('');
      setContentMode('experience');
      setMessageActionPending('');
      setVisitsLoading(false);
      setVisitsError('');
      setPricingMode('packages');
      setPricingLoading(false);
      setPricingSaving(false);
      setPricingStatus('');
      setPricingError('');
      setLoginForm((current) => ({ ...current, password: '' }));
    } catch (error) {
      setDashboardError(error.message || 'Logout failed.');
    } finally {
      setLogoutPending(false);
    }
  };

  const updateProjectForm = (event) => {
    const { name, type, value, checked } = event.target;
    setProjectForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setProjectFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const updatePricingServiceForm = (event) => {
    const { name, type, value, checked } = event.target;
    setPricingServiceForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const updatePricingPackageForm = (event) => {
    const { name, type, value, checked } = event.target;
    setPricingPackageForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePricingServiceNew = () => {
    setSelectedPricingServiceId('');
    setPricingServiceForm(emptyPricingServiceForm);
    setPricingStatus('');
    setPricingError('');
  };

  const handlePricingPackageNew = () => {
    const defaultServiceId = selectedPricingServiceId || (pricingServices[0]?.recordId ? String(pricingServices[0].recordId) : '');
    setSelectedPricingPackageId('');
    setPricingPackageForm({ ...emptyPricingPackageForm, serviceId: defaultServiceId });
    setPricingStatus('');
    setPricingError('');
  };

  const handlePricingServiceSave = async (event) => {
    event.preventDefault();
    setPricingSaving(true);
    setPricingError('');
    setPricingStatus('');

    try {
      const body = pricingServiceFormToBody(pricingServiceForm);
      const response = selectedPricingServiceId
        ? await apiRequest(`/api/admin/pricing/services/${selectedPricingServiceId}`, {
            method: 'PUT',
            body,
          })
        : await apiRequest('/api/admin/pricing/services', {
            method: 'POST',
            body,
          });

      setPricingStatus(selectedPricingServiceId ? 'Pricing service updated.' : 'Pricing service created.');
      setSelectedPricingServiceId(String(response.pricingService.id));
      await loadPricing();
      await loadDashboard();
      setIsEditingPricingService(false);
    } catch (error) {
      setPricingError(error.message || 'Unable to save this pricing service.');
    } finally {
      setPricingSaving(false);
    }
  };

  const handlePricingPackageSave = async (event) => {
    event.preventDefault();
    setPricingSaving(true);
    setPricingError('');
    setPricingStatus('');

    try {
      const body = pricingPackageFormToBody(pricingPackageForm);
      const response = selectedPricingPackageId
        ? await apiRequest(`/api/admin/pricing/packages/${selectedPricingPackageId}`, {
            method: 'PUT',
            body,
          })
        : await apiRequest('/api/admin/pricing/packages', {
            method: 'POST',
            body,
          });

      setPricingStatus(selectedPricingPackageId ? 'Pricing package updated.' : 'Pricing package created.');
      setSelectedPricingPackageId(String(response.pricingPackage.id));
      await loadPricing();
      await loadDashboard();
      setIsEditingPricingPackage(false);
    } catch (error) {
      setPricingError(error.message || 'Unable to save this pricing package.');
    } finally {
      setPricingSaving(false);
    }
  };

  const handlePricingServiceDelete = async () => {
    if (!selectedPricingServiceId) return;
    if (!window.confirm('Delete this pricing service? Remove its packages first.')) return;

    setPricingSaving(true);
    setPricingError('');
    setPricingStatus('');

    try {
      await apiRequest(`/api/admin/pricing/services/${selectedPricingServiceId}`, { method: 'DELETE' });
      setPricingStatus('Pricing service removed.');
      setSelectedPricingServiceId('');
      await loadPricing();
      await loadDashboard();
      setIsEditingPricingService(false);
    } catch (error) {
      setPricingError(error.message || 'Unable to delete this pricing service.');
    } finally {
      setPricingSaving(false);
    }
  };

  const handlePricingPackageDelete = async () => {
    if (!selectedPricingPackageId) return;
    if (!window.confirm('Delete this pricing package?')) return;

    setPricingSaving(true);
    setPricingError('');
    setPricingStatus('');

    try {
      await apiRequest(`/api/admin/pricing/packages/${selectedPricingPackageId}`, { method: 'DELETE' });
      setPricingStatus('Pricing package removed.');
      setSelectedPricingPackageId('');
      await loadPricing();
      await loadDashboard();
      setIsEditingPricingPackage(false);
    } catch (error) {
      setPricingError(error.message || 'Unable to delete this pricing package.');
    } finally {
      setPricingSaving(false);
    }
  };

  const handleMessageStatusToggle = async (message) => {
    if (!message?.id) return;
    const nextStatus = message.status === 'read' ? 'new' : 'read';
    const pendingKey = `status-${message.id}`;
    setMessageActionPending(pendingKey);
    setMessagesError('');

    try {
      const response = await apiRequest(`/api/admin/messages/${message.id}/status`, {
        method: 'PATCH',
        body: { status: nextStatus },
      });
      const updated = response.message;
      setMessages((current) => current.map((item) => (String(item.id) === String(message.id) ? { ...item, ...updated } : item)));
      await loadDashboard();
    } catch (error) {
      setMessagesError(error.message || 'Unable to update this message.');
    } finally {
      setMessageActionPending('');
    }
  };

  const handleMessageDelete = async (message) => {
    if (!message?.id) return;
    const confirmed = window.confirm(`Delete message from ${message.name}?`);
    if (!confirmed) return;

    const pendingKey = `delete-${message.id}`;
    setMessageActionPending(pendingKey);
    setMessagesError('');

    try {
      await apiRequest(`/api/admin/messages/${message.id}`, { method: 'DELETE' });
      setMessages((current) => current.filter((item) => String(item.id) !== String(message.id)));
      setSelectedMessageId((current) => (String(current) === String(message.id) ? '' : current));
      await loadDashboard();
    } catch (error) {
      setMessagesError(error.message || 'Unable to delete this message.');
    } finally {
      setMessageActionPending('');
    }
  };

  const updateEducationForm = (event) => {
    const { name, value } = event.target;
    setEducationForm((current) => ({ ...current, [name]: value }));
  };

  const updateExperienceForm = (event) => {
    const { name, type, value, checked } = event.target;
    setExperienceForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const updateCertificateForm = (event) => {
    const { name, value } = event.target;
    setCertificateForm((current) => ({ ...current, [name]: value }));
  };

  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (listType, index) => (e) => {
    setDraggedItem({ listType, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index) => (e) => {
    e.preventDefault();
  };

  const handleDrop = (listType, targetIndex) => async (e) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.listType !== listType || draggedItem.index === targetIndex) {
      return;
    }

    let list;
    let setList;
    let dbTable;

    if (listType === 'projects') {
      list = [...projects];
      setList = setProjects;
      dbTable = 'portfolio_projects';
    } else if (listType === 'experience') {
      list = [...experience];
      setList = setExperience;
      dbTable = 'portfolio_experience';
    } else if (listType === 'education') {
      list = [...education];
      setList = setEducation;
      dbTable = 'portfolio_education';
    } else if (listType === 'certificates') {
      list = [...certificates];
      setList = setCertificates;
      dbTable = 'portfolio_certificates';
    } else if (listType === 'pricingPackages') {
      list = [...pricingPackages];
      setList = setPricingPackages;
      dbTable = 'portfolio_pricing_packages';
    } else if (listType === 'pricingServices') {
      list = [...pricingServices];
      setList = setPricingServices;
      dbTable = 'portfolio_pricing_services';
    }

    if (!list) return;

    const draggedIdx = draggedItem.index;
    const item = list[draggedIdx];
    list.splice(draggedIdx, 1);
    list.splice(targetIndex, 0, item);

    const updatedList = list.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setList(updatedList);
    setDraggedItem(null);

    try {
      const response = await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          table: dbTable,
          items: updatedList.map((item) => ({
            id: item.id,
            displayOrder: item.displayOrder,
          })),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
    } catch (err) {
      console.error('Reordering failed:', err);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleProjectNew = () => {
    setSelectedProjectId('');
    setProjectError('');
    setProjectFieldErrors({});
    setProjectStatus('');
    setProjectForm(emptyProjectForm);
    setProjectImageFile(null);
    setProjectImageStatus('');
    setProjectImageError('');
    setProjectImagePreview('');
    setProjectImageUploading(false);
    setProjectImageActionPending(false);
  };

  const handleExperienceNew = () => {
    setSelectedExperienceId('');
    setExperienceError('');
    setExperienceStatus('');
    setExperienceForm(emptyExperienceForm);
  };

  const handleExperienceSave = async (event) => {
    event.preventDefault();
    setExperienceSaving(true);
    setExperienceError('');
    setExperienceStatus('');

    try {
      const body = experienceFormToBody(experienceForm);
      const response = selectedExperienceId
        ? await apiRequest(`/api/admin/experience/${selectedExperienceId}`, {
            method: 'PUT',
            body,
          })
        : await apiRequest('/api/admin/experience', {
            method: 'POST',
            body,
          });

      setExperienceStatus(selectedExperienceId ? 'Work experience updated.' : 'Work experience created.');
      setSelectedExperienceId(String(response.experience.id));
      await Promise.allSettled([loadExperience(), loadDashboard()]);
      setIsEditingExperience(false);
    } catch (error) {
      setExperienceError(error.message || 'Unable to save this work experience entry.');
    } finally {
      setExperienceSaving(false);
    }
  };

  const handleExperienceDelete = async () => {
    if (!selectedExperienceId) return;
    if (!window.confirm('Delete this work experience entry? This cannot be undone.')) return;

    setExperienceSaving(true);
    setExperienceError('');
    setExperienceStatus('');

    try {
      await apiRequest(`/api/admin/experience/${selectedExperienceId}`, { method: 'DELETE' });
      setExperienceStatus('Work experience removed.');
      setSelectedExperienceId('');
      setExperienceForm(emptyExperienceForm);
      await Promise.allSettled([loadExperience(), loadDashboard()]);
      setIsEditingExperience(false);
    } catch (error) {
      setExperienceError(error.message || 'Unable to delete this work experience entry.');
    } finally {
      setExperienceSaving(false);
    }
  };

  const handleProjectImageChange = (event) => {
    const [file] = event.target.files || [];
    setProjectImageFile(file || null);
    setProjectImageError('');
    setProjectImageStatus('');
  };

  const handleProjectImageUpload = async () => {
    if (!projectImageFile) {
      setProjectImageError('Choose an image file first.');
      return;
    }

    setProjectImageUploading(true);
    setProjectImageError('');
    setProjectImageStatus('');

    try {
      const dataUrl = await fileToDataUrl(projectImageFile);
      const response = await apiRequest('/api/admin/project-images/upload', {
        method: 'POST',
        body: {
          fileName: projectImageFile.name,
          mimeType: projectImageFile.type,
          dataUrl,
          projectId: selectedProjectId,
          projectTitle: projectForm.title,
        },
      });

      setProjectForm((current) => ({ ...current, image: response.imageUrl }));
      setProjectImageFile(null);
      setProjectImagePreview('');
      setProjectImageStatus('Image uploaded to Supabase Storage.');
    } catch (error) {
      setProjectImageError(error.message || 'Unable to upload this image.');
    } finally {
      setProjectImageUploading(false);
    }
  };

  const handleProjectImageDelete = async () => {
    if (!projectForm.image) {
      setProjectImageError('There is no image to delete.');
      return;
    }

    if (!projectForm.image.includes('/storage/v1/object/public/')) {
      setProjectImageError('Only images stored in Supabase Storage can be deleted from here.');
      return;
    }

    if (!window.confirm('Delete this stored image from Supabase?')) {
      return;
    }

    setProjectImageActionPending(true);
    setProjectImageError('');
    setProjectImageStatus('');

    try {
      await apiRequest('/api/admin/project-images', {
        method: 'DELETE',
        body: { imageUrl: projectForm.image },
      });

      setProjectForm((current) => ({ ...current, image: '' }));
      setProjectImageFile(null);
      setProjectImagePreview('');
      setProjectImageStatus('Image deleted from Supabase Storage.');
    } catch (error) {
      setProjectImageError(error.message || 'Unable to delete this image.');
    } finally {
      setProjectImageActionPending(false);
    }
  };

  const handleProjectSave = async (event) => {
    event.preventDefault();
    setProjectSaving(true);
    setProjectError('');
    setProjectFieldErrors({});
    setProjectStatus('');

    try {
      const body = projectFormToBody(projectForm);
      const response = selectedProjectId
        ? await apiRequest(`/api/admin/projects/${selectedProjectId}`, {
            method: 'PUT',
            body,
          })
        : await apiRequest('/api/admin/projects', {
            method: 'POST',
            body,
          });

      setProjectStatus(selectedProjectId ? 'Project updated successfully.' : 'Project created successfully.');
      setSelectedProjectId(String(response.project.id));
      setProjectImageFile(null);
      setProjectImagePreview('');
      setProjectImageUploading(false);
      setProjectImageActionPending(false);
      await Promise.allSettled([loadProjects(), loadDashboard()]);
      setIsEditingProject(false);
    } catch (error) {
      setProjectFieldErrors(getApiFieldErrors(error));
      setProjectError(error.message || 'Unable to save this project.');
    } finally {
      setProjectSaving(false);
    }
  };

  const handleProjectDelete = async () => {
    if (!selectedProjectId) return;
    if (!window.confirm('Delete this project? This cannot be undone.')) return;

    setProjectSaving(true);
    setProjectError('');
    setProjectFieldErrors({});
    setProjectStatus('');

    try {
      await apiRequest(`/api/admin/projects/${selectedProjectId}`, { method: 'DELETE' });
      setProjectStatus('Project removed.');
      setSelectedProjectId('');
      setProjectForm(emptyProjectForm);
      setProjectImageFile(null);
      setProjectImagePreview('');
      setProjectImageUploading(false);
      setProjectImageActionPending(false);
      await Promise.allSettled([loadProjects(), loadDashboard()]);
      setIsEditingProject(false);
    } catch (error) {
      setProjectError(error.message || 'Unable to delete this project.');
    } finally {
      setProjectSaving(false);
    }
  };

  const handleEducationNew = () => {
    setSelectedEducationId('');
    setEducationStatus('');
    setEducationError('');
    setEducationForm(emptyEducationForm);
  };

  const handleEducationSave = async (event) => {
    event.preventDefault();
    setEducationSaving(true);
    setEducationError('');
    setEducationStatus('');

    try {
      const body = educationFormToBody(educationForm);
      const response = selectedEducationId
        ? await apiRequest(`/api/admin/education/${selectedEducationId}`, {
            method: 'PUT',
            body,
          })
        : await apiRequest('/api/admin/education', {
            method: 'POST',
            body,
          });

      setEducationStatus(selectedEducationId ? 'Education entry updated.' : 'Education entry created.');
      setSelectedEducationId(String(response.education.id));
      await Promise.allSettled([loadEducation(), loadDashboard()]);
      setIsEditingEducation(false);
    } catch (error) {
      setEducationError(error.message || 'Unable to save this education entry.');
    } finally {
      setEducationSaving(false);
    }
  };

  const handleEducationDelete = async () => {
    if (!selectedEducationId) return;
    if (!window.confirm('Delete this education entry? This cannot be undone.')) return;

    setEducationSaving(true);
    setEducationError('');
    setEducationStatus('');

    try {
      await apiRequest(`/api/admin/education/${selectedEducationId}`, { method: 'DELETE' });
      setEducationStatus('Education entry removed.');
      setSelectedEducationId('');
      setEducationForm(emptyEducationForm);
      await Promise.allSettled([loadEducation(), loadDashboard()]);
      setIsEditingEducation(false);
    } catch (error) {
      setEducationError(error.message || 'Unable to delete this education entry.');
    } finally {
      setEducationSaving(false);
    }
  };

  const handleCertificateNew = () => {
    setSelectedCertificateId('');
    setCertificateStatus('');
    setCertificatesError('');
    setCertificateForm(emptyCertificateForm);
    setCertificateImageFile(null);
    setCertificateImageStatus('');
    setCertificateImageError('');
    setCertificateImagePreview('');
    setCertificateImageUploading(false);
    setCertificateImageActionPending(false);
  };

  const handleCertificateImageChange = (event) => {
    const [file] = event.target.files || [];
    setCertificateImageFile(file || null);
    setCertificateImageError('');
    setCertificateImageStatus('');
  };

  const handleCertificateImageUpload = async () => {
    if (!certificateImageFile) {
      setCertificateImageError('Choose an image file first.');
      return;
    }

    setCertificateImageUploading(true);
    setCertificateImageError('');
    setCertificateImageStatus('');

    try {
      const dataUrl = await fileToDataUrl(certificateImageFile);
      const response = await apiRequest('/api/admin/certificate-images/upload', {
        method: 'POST',
        body: {
          fileName: certificateImageFile.name,
          mimeType: certificateImageFile.type,
          dataUrl,
          certificateId: selectedCertificateId,
          certificateTitle: certificateForm.title,
        },
      });

      setCertificateForm((current) => ({ ...current, image: response.imageUrl }));
      setCertificateImageFile(null);
      setCertificateImagePreview('');
      setCertificateImageStatus('Image uploaded to Supabase Storage.');
    } catch (error) {
      setCertificateImageError(error.message || 'Unable to upload this image.');
    } finally {
      setCertificateImageUploading(false);
    }
  };

  const handleCertificateImageDelete = async () => {
    if (!certificateForm.image) {
      setCertificateImageError('There is no image to delete.');
      return;
    }

    if (!certificateForm.image.includes('/storage/v1/object/public/')) {
      setCertificateImageError('Only images stored in Supabase Storage can be deleted from here.');
      return;
    }

    if (!window.confirm('Delete this stored image from Supabase?')) {
      return;
    }

    setCertificateImageActionPending(true);
    setCertificateImageError('');
    setCertificateImageStatus('');

    try {
      await apiRequest('/api/admin/certificate-images', {
        method: 'DELETE',
        body: { imageUrl: certificateForm.image },
      });

      setCertificateForm((current) => ({ ...current, image: '' }));
      setCertificateImageFile(null);
      setCertificateImagePreview('');
      setCertificateImageStatus('Image deleted from Supabase Storage.');
    } catch (error) {
      setCertificateImageError(error.message || 'Unable to delete this image.');
    } finally {
      setCertificateImageActionPending(false);
    }
  };

  const handleCertificateSave = async (event) => {
    event.preventDefault();
    setCertificateSaving(true);
    setCertificatesError('');
    setCertificateStatus('');

    try {
      const body = certificateFormToBody(certificateForm);
      const response = selectedCertificateId
        ? await apiRequest(`/api/admin/certificates/${selectedCertificateId}`, {
            method: 'PUT',
            body,
          })
        : await apiRequest('/api/admin/certificates', {
            method: 'POST',
            body,
          });

      setCertificateStatus(selectedCertificateId ? 'Certificate updated.' : 'Certificate created.');
      setSelectedCertificateId(String(response.certificate.id));
      setCertificateImageFile(null);
      setCertificateImagePreview('');
      setCertificateImageUploading(false);
      setCertificateImageActionPending(false);
      await Promise.allSettled([loadCertificates(), loadDashboard()]);
      setIsEditingCertificate(false);
    } catch (error) {
      setCertificatesError(error.message || 'Unable to save this certificate.');
    } finally {
      setCertificateSaving(false);
    }
  };

  const handleCertificateDelete = async () => {
    if (!selectedCertificateId) return;
    if (!window.confirm('Delete this certificate? This cannot be undone.')) return;

    setCertificateSaving(true);
    setCertificatesError('');
    setCertificateStatus('');

    try {
      await apiRequest(`/api/admin/certificates/${selectedCertificateId}`, { method: 'DELETE' });
      setCertificateStatus('Certificate removed.');
      setSelectedCertificateId('');
      setCertificateForm(emptyCertificateForm);
      setCertificateImageFile(null);
      setCertificateImagePreview('');
      setCertificateImageUploading(false);
      setCertificateImageActionPending(false);
      await Promise.allSettled([loadCertificates(), loadDashboard()]);
      setIsEditingCertificate(false);
    } catch (error) {
      setCertificatesError(error.message || 'Unable to delete this certificate.');
    } finally {
      setCertificateSaving(false);
    }
  };

  if (bootstrapping) {
    return (
      <div className="admin-shell">
        <div className="admin-loading">
          <span className="admin-spinner" aria-hidden="true" />
          <p>Checking admin session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-shell admin-auth-shell">
        <Helmet>
          <title>Admin Login | Chamuditha Portfolio</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="admin-auth-card">
          <div className="admin-auth-badge">
            <Icon name="lock" size={14} />
            Secure Admin Access
          </div>
          <h1>Portfolio Admin</h1>
          <p>Sign in to manage messages, visits, projects, education, and certificates.</p>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <label>
              <span>Username</span>
              <input
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                autoComplete="username"
                placeholder="admin.chamuditha"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </label>
            {loginError ? <div className="admin-form-error">{loginError}</div> : null}
            <button className="admin-primary-button" type="submit" disabled={loginPending}>
              {loginPending ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="lock" size={15} />}
              {loginPending ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="admin-auth-footer">
            <a href="/" className="admin-link">
              <Icon name="arrowLeft" size={14} />
              Back to portfolio
            </a>
            <span>https://chamudithaperera.online/admin</span>
          </div>
        </div>
      </div>
    );
  }

  const summaryCards = [
    { label: 'Messages', value: stats.messages, tone: 'blue' },
    { label: 'Unread', value: stats.unread, tone: 'cyan' },
    { label: 'Visits', value: stats.visits, tone: 'teal' },
    { label: 'Projects', value: stats.projects, tone: 'indigo' },
    { label: 'Pricing', value: stats.pricingPackages, tone: 'blue' },
    { label: 'Experience', value: stats.experience, tone: 'sky' },
    { label: 'Education', value: stats.education, tone: 'slate' },
    { label: 'Certificates', value: stats.certificates, tone: 'teal' },
  ];

  return (
    <div className="admin-shell">
      <Helmet>
        <title>Admin Dashboard | Chamuditha Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-mark">
              <Icon name="dashboard" size={16} />
            </div>
            <div>
              <strong>Portfolio Admin</strong>
              <span>Website management</span>
            </div>
          </div>

          <div className="admin-sidebar-note">
            <Icon name="circle" size={12} />
            Live dashboard connected to your content collections.
          </div>

          <nav className="admin-tabs" aria-label="Admin sections">
            {tabItems.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                icon={tab.icon}
                label={tab.label}
                description={tab.description}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button type="button" className="admin-secondary-button" onClick={refreshDashboardTab} disabled={dashboardLoading || messagesLoading || visitsLoading}>
              <Icon name="refresh" size={14} />
              Refresh
            </button>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={handleLogout}
              disabled={logoutPending}
            >
              <Icon name="arrowLeft" size={14} />
              {logoutPending ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <div>
              <p className="admin-kicker">
                <Icon name="spark" size={12} />
                Editable website content
              </p>
              <h1>
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'messages' && 'Messages'}
                {activeTab === 'visits' && 'Visits'}
                {activeTab === 'projects' && 'Projects'}
                {activeTab === 'pricing' && 'Pricing'}
                {activeTab === 'content' && 'Work Experience & Content'}
              </h1>
              <p>
                {activeTab === 'dashboard' && 'Summary of the website content and incoming activity.'}
                {activeTab === 'messages' && 'WhatsApp-style inbox for user submissions.'}
                {activeTab === 'visits' && 'Table of website visit records captured from public page loads.'}
                {activeTab === 'projects' && 'Create, edit, and remove portfolio projects.'}
                {activeTab === 'pricing' && 'Manage website and mobile app services, packages, prices, and feature lists.'}
                {activeTab === 'content' && 'Manage work experience, education, and certificate entries from one place.'}
              </p>
            </div>

            <div className="admin-header-actions">
              <a href="/" className="admin-secondary-button">
                <Icon name="home" size={14} />
                Public site
              </a>
              <button type="button" className="admin-secondary-button admin-notification-button" onClick={refreshDashboardTab} disabled={dashboardLoading || messagesLoading || visitsLoading}>
                <Icon name="bell" size={14} />
                {stats.unread}
              </button>
            </div>
          </header>

          {activeTab === 'dashboard' ? (
            <section className="admin-section-grid">
              <div className="admin-card admin-summary-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Summary</p>
                    <h2>Website overview</h2>
                  </div>
                  <span className="admin-pill">Updated live</span>
                </div>

                <div className="admin-summary-grid">
                  {summaryCards.map((card) => (
                    <StatCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
                  ))}
                </div>

                {dashboardError ? <div className="admin-inline-error">{dashboardError}</div> : null}
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Recent activity</p>
                    <h2>Latest submission</h2>
                  </div>
                </div>

                {dashboardLoading ? (
                  <div className="admin-loading-panel">
                    <span className="admin-spinner" aria-hidden="true" />
                    Loading dashboard...
                  </div>
                ) : dashboard?.latestMessage ? (
                  <div className="admin-activity-card">
                    <strong>{dashboard.latestMessage.name}</strong>
                    <p>{dashboard.latestMessage.subject}</p>
                    <small>{formatShortDate(dashboard.latestMessage.created_at)}</small>
                  </div>
                ) : (
                  <EmptyState
                    icon="inbox"
                    title="No recent messages"
                    description="When someone submits the contact form, the latest message will appear here."
                  />
                )}
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Content health</p>
                    <h2>Portfolio collections</h2>
                  </div>
                </div>

                <div className="admin-collection-list">
                  <div>
                    <span>Projects</span>
                    <strong>{stats.projects}</strong>
                  </div>
                  <div>
                    <span>Education</span>
                    <strong>{stats.education}</strong>
                  </div>
                  <div>
                    <span>Certificates</span>
                    <strong>{stats.certificates}</strong>
                  </div>
                </div>
              </div>

              <div className="admin-card admin-dashboard-wide-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Recent activity</p>
                    <h2>Latest visit</h2>
                  </div>
                </div>

                {dashboardLoading ? (
                  <div className="admin-loading-panel">
                    <span className="admin-spinner" aria-hidden="true" />
                    Loading visits...
                  </div>
                ) : dashboard?.latestVisit ? (
                  <div className="admin-activity-card">
                    <strong>{dashboard.latestVisit.pageTitle || dashboard.latestVisit.path}</strong>
                    <p>{dashboard.latestVisit.path}</p>
                    <small>{formatVisitLocation(dashboard.latestVisit)}</small>
                    <small>
                      {dashboard.latestVisit.referrer ? truncateText(dashboard.latestVisit.referrer, 60) : 'Direct visit'}
                    </small>
                    <small>{formatShortDate(dashboard.latestVisit.createdAt)}</small>
                  </div>
                ) : (
                  <EmptyState
                    icon="globe"
                    title="No visit records yet"
                    description="Once the public site records a page view, the latest visit will appear here."
                  />
                )}
              </div>
            </section>
          ) : null}

          {activeTab === 'messages' ? (
            <section className="admin-message-workspace">
              <div className="admin-card admin-message-table-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Read and clear</p>
                    <h2>Website messages</h2>
                  </div>
                  <button type="button" className="admin-secondary-button" onClick={() => loadMessages(messageSearch)} disabled={messagesLoading}>
                    <Icon name="refresh" size={14} />
                    Refresh
                  </button>
                </div>

                <label className="admin-search">
                  <Icon name="search" size={14} />
                  <input
                    value={messageSearch}
                    onChange={(event) => setMessageSearch(event.target.value)}
                    placeholder="Search name, email, or subject"
                  />
                </label>

                {messagesError ? <div className="admin-inline-error">{messagesError}</div> : null}

                {messagesLoading ? (
                  <div className="admin-loading-panel">
                    <span className="admin-spinner" aria-hidden="true" />
                    Loading messages...
                  </div>
                ) : messages.length ? (
                  <div className="admin-table-scroll">
                    <table className="admin-message-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Event</th>
                          <th>Message</th>
                          <th>Received</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((message) => {
                          const status = message.status === 'read' ? 'read' : 'new';
                          const isRead = status === 'read';
                          const statusPending = messageActionPending === `status-${message.id}`;
                          const deletePending = messageActionPending === `delete-${message.id}`;
                          const snippet = String(message.message || '').replace(/\s+/g, ' ').slice(0, 86);

                          return (
                            <tr key={message.id}>
                              <td>
                                <span className={`admin-status-badge ${isRead ? 'is-read' : 'is-new'}`}>
                                  {isRead ? 'Read' : 'Unread'}
                                </span>
                              </td>
                              <td>
                                <strong>{message.name}</strong>
                              </td>
                              <td>{message.phone || 'Not provided'}</td>
                              <td>{message.subject || 'Website inquiry'}</td>
                              <td className="admin-message-preview">{snippet}</td>
                              <td>{formatDate(message.created_at)}</td>
                              <td>
                                <div className="admin-table-actions">
                                  <button
                                    type="button"
                                    className="admin-secondary-button admin-compact-button"
                                    onClick={() => setSelectedMessageId(String(message.id))}
                                  >
                                    <Icon name="eye" size={14} />
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-secondary-button admin-compact-button admin-status-action"
                                    onClick={() => handleMessageStatusToggle(message)}
                                    disabled={statusPending}
                                  >
                                    {statusPending ? 'Saving...' : isRead ? 'Unread' : 'Read'}
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-danger-button admin-icon-button"
                                    onClick={() => handleMessageDelete(message)}
                                    disabled={deletePending}
                                    aria-label={`Delete message from ${message.name}`}
                                  >
                                    {deletePending ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="trash" size={14} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                    <EmptyState
                      icon="inbox"
                      title="No messages found"
                      description={messageSearch ? 'Try another search term.' : 'Incoming contact submissions will show up here.'}
                    />
                  )}
              </div>

              {selectedMessage ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => setSelectedMessageId('')}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-message-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Message details</p>
                        <h2 id="admin-message-modal-title">{selectedMessage.subject || 'Website inquiry'}</h2>
                        <p className="admin-muted">
                          From {selectedMessage.name} on {formatDate(selectedMessage.created_at)}
                        </p>
                      </div>
                      <button type="button" className="admin-secondary-button admin-icon-button" onClick={() => setSelectedMessageId('')} aria-label="Close message details">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <div className="admin-contact-grid">
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="mail" size={12} />
                          Email
                        </span>
                        <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="phone" size={12} />
                          Phone
                        </span>
                        {selectedMessage.phone ? (
                          <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>
                        ) : (
                          <span className="admin-muted">Not provided</span>
                        )}
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="tag" size={12} />
                          Status
                        </span>
                        <span className={`admin-status-badge ${selectedMessage.status === 'read' ? 'is-read' : 'is-new'}`}>
                          {selectedMessage.status === 'read' ? 'Read' : 'Unread'}
                        </span>
                      </div>
                    </div>

                    <div className="admin-chat-thread">
                      <div className="admin-chat-note">
                        <span className="admin-chat-note-label">Visitor message</span>
                        <p>{selectedMessage.message}</p>
                        <small>{formatDate(selectedMessage.created_at)}</small>
                      </div>
                    </div>

                    <div className="admin-action-row">
                      <button type="button" className="admin-primary-button" onClick={() => handleMessageStatusToggle(selectedMessage)} disabled={messageActionPending === `status-${selectedMessage.id}`}>
                        <Icon name="check" size={14} />
                        {messageActionPending === `status-${selectedMessage.id}` ? 'Saving...' : selectedMessage.status === 'read' ? 'Mark unread' : 'Mark read'}
                      </button>
                      <a className="admin-secondary-button" href={`mailto:${selectedMessage.email}`}>
                        <Icon name="mail" size={14} />
                        Reply by email
                      </a>
                      {selectedMessage.phone ? (
                        <a className="admin-secondary-button" href={`tel:${selectedMessage.phone}`}>
                          <Icon name="phone" size={14} />
                          Call sender
                        </a>
                      ) : null}
                    </div>
                  </article>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeTab === 'visits' ? (
            <section className="admin-message-workspace">
              <div className="admin-card admin-message-table-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Public page loads</p>
                    <h2>Website visits</h2>
                  </div>
                  <button type="button" className="admin-secondary-button" onClick={loadVisits} disabled={visitsLoading}>
                    <Icon name="refresh" size={14} />
                    Refresh
                  </button>
                </div>

                {visitsError ? <div className="admin-inline-error">{visitsError}</div> : null}

                {visitsLoading ? (
                  <div className="admin-loading-panel">
                    <span className="admin-spinner" aria-hidden="true" />
                    Loading visits...
                  </div>
                ) : visits.length ? (
                  <div className="admin-table-scroll">
                    <table className="admin-visit-table">
                      <thead>
                        <tr>
                          <th>Page</th>
                          <th>Referrer</th>
                          <th>IP</th>
                          <th>Location</th>
                          <th>Device</th>
                          <th>Screen</th>
                          <th>Visited</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visits.map((visit) => (
                          <tr key={visit.id}>
                            <td>
                              <strong>{visit.pageTitle || visit.path}</strong>
                              <div className="admin-visit-path">{visit.path}</div>
                            </td>
                            <td className="admin-visit-muted">{truncateText(visit.referrer || 'Direct', 42)}</td>
                            <td className="admin-visit-muted">{visit.ipAddress || 'Unknown'}</td>
                            <td>{formatVisitLocation(visit)}</td>
                            <td className="admin-visit-muted">{truncateText(visit.userAgent || 'Unknown', 54)}</td>
                            <td>{visit.screen || visit.viewport || 'Unknown'}</td>
                            <td>{formatDate(visit.createdAt)}</td>
                            <td>
                              <div className="admin-table-actions">
                                <button
                                  type="button"
                                  className="admin-secondary-button admin-compact-button"
                                  onClick={() => setSelectedVisitId(String(visit.id))}
                                >
                                  <Icon name="eye" size={14} />
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    icon="globe"
                    title="No visits found"
                    description="Public page loads will appear here once the visit logger is active."
                  />
                )}
              </div>

              {selectedVisit ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => setSelectedVisitId('')}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-visit-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Visit details</p>
                        <h2 id="admin-visit-modal-title">{selectedVisit.pageTitle || selectedVisit.path}</h2>
                        <p className="admin-muted">Recorded on {formatDate(selectedVisit.createdAt)}</p>
                      </div>
                      <button type="button" className="admin-secondary-button admin-icon-button" onClick={() => setSelectedVisitId('')} aria-label="Close visit details">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <div className="admin-contact-grid admin-visit-detail-grid">
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="home" size={12} />
                          Page
                        </span>
                        <span>{selectedVisit.path || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="link" size={12} />
                          Referrer
                        </span>
                        <span>{selectedVisit.referrer || 'Direct visit'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="globe" size={12} />
                          Country
                        </span>
                        <span>{selectedVisit.country || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="tag" size={12} />
                          Country code
                        </span>
                        <span>{selectedVisit.countryCode || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="home" size={12} />
                          City / town
                        </span>
                        <span>{selectedVisit.city || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="grid" size={12} />
                          Region / district
                        </span>
                        <span>{selectedVisit.region || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="tag" size={12} />
                          IP address
                        </span>
                        <span>{selectedVisit.ipAddress || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="spark" size={12} />
                          Language
                        </span>
                        <span>{selectedVisit.language || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="calendar" size={12} />
                          Visitor time zone
                        </span>
                        <span>{formatTimezoneOffset(selectedVisit.timezoneOffset)}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="calendar" size={12} />
                          IP time zone
                        </span>
                        <span>{selectedVisit.timezone || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="globe" size={12} />
                          Coordinates
                        </span>
                        <span>{formatCoordinates(selectedVisit)}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="dashboard" size={12} />
                          Screen
                        </span>
                        <span>{selectedVisit.screen || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="grid" size={12} />
                          Viewport
                        </span>
                        <span>{selectedVisit.viewport || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="admin-contact-label">
                          <Icon name="edit" size={12} />
                          User agent
                        </span>
                        <span>{selectedVisit.userAgent || 'Unknown'}</span>
                      </div>
                    </div>

                    <div className="admin-chat-thread">
                      <div className="admin-chat-note">
                        <span className="admin-chat-note-label">Full page title</span>
                        <p>{selectedVisit.pageTitle || 'Untitled page'}</p>
                        <small>Visit ID: {selectedVisit.id}</small>
                      </div>
                    </div>
                  </article>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeTab === 'projects' ? (
            <section className="admin-content-workspace">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Projects</p>
                    <h2>Portfolio items</h2>
                  </div>
                  <div className="admin-list-actions">
                    <button type="button" className="admin-primary-button" onClick={() => { handleProjectNew(); setIsEditingProject(true); }}>
                      <Icon name="plus" size={14} />
                      New project
                    </button>
                    <button type="button" className="admin-secondary-button" onClick={loadProjects} disabled={projectsLoading}>
                      <Icon name="refresh" size={14} />
                      Refresh
                    </button>
                  </div>
                </div>

                {projectsError ? <div className="admin-inline-error">{projectsError}</div> : null}

                {projectsLoading ? (
                  <div className="admin-loading-panel">
                    <span className="admin-spinner" aria-hidden="true" />
                    Loading projects...
                  </div>
                ) : projects.length ? (
                  <div className="admin-cards-row-list">
                    {projects.map((project, index) => (
                      <div
                        key={project.id}
                        className={`admin-item-row-card ${(draggedItem && draggedItem.listType === 'projects' && draggedItem.index === index) ? 'is-dragging' : ''}`}
                        draggable="true"
                        onDragStart={handleDragStart('projects', index)}
                        onDragOver={handleDragOver(index)}
                        onDrop={handleDrop('projects', index)}
                        onDragEnd={handleDragEnd}
                        onClick={() => {
                          setSelectedProjectId(String(project.id));
                          setIsEditingProject(true);
                        }}
                      >
                        <div className="admin-drag-handle" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
                          <Icon name="drag" size={14} />
                        </div>
                        {project.image ? (
                          <div className="admin-item-row-image">
                            <img src={project.image} alt={project.title} />
                          </div>
                        ) : null}
                        <div className="admin-item-row-info">
                          <div className="admin-item-row-header">
                            <h3>{project.title}</h3>
                            <div className="admin-row-badges">
                              {project.isFeatured ? <span className="admin-pill">Featured</span> : null}
                              <span className="admin-pill-secondary">{project.category}</span>
                            </div>
                          </div>
                          <p className="admin-item-row-summary">{project.summary}</p>
                          {project.tags ? (
                            <div className="admin-row-tags">
                              {String(project.tags).split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                                <span key={tag} className="admin-tag-badge">{tag}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="admin-item-row-actions">
                          <button
                            type="button"
                            className="admin-secondary-button admin-compact-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProjectId(String(project.id));
                              setIsEditingProject(true);
                            }}
                          >
                            <Icon name="edit" size={14} />
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="project"
                    title="No projects yet"
                    description="Create your first portfolio project by clicking 'New project' above."
                  />
                )}
              </div>

              {isEditingProject ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => { setIsEditingProject(false); setSelectedProjectId(''); }}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-project-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2 id="admin-project-modal-title">{selectedProjectId ? 'Edit project' : 'Create project'}</h2>
                      </div>
                      <button type="button" className="admin-secondary-button admin-icon-button" onClick={() => { setIsEditingProject(false); setSelectedProjectId(''); }} aria-label="Close editor">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <form className="admin-form" onSubmit={handleProjectSave}>
                      <div className="admin-grid-2">
                        <label>
                          <span>Title</span>
                          <input name="title" value={projectForm.title} onChange={updateProjectForm} placeholder="Money Manager App" required />
                          <FieldError message={projectFieldErrors.title} />
                        </label>
                        <label>
                          <span>Category</span>
                          <input name="category" value={projectForm.category} onChange={updateProjectForm} placeholder="Flutter mobile system" required />
                          <FieldError message={projectFieldErrors.category} />
                        </label>
                      </div>

                      <label>
                        <span>Image path or URL</span>
                        <input
                          name="image"
                          value={projectForm.image}
                          onChange={updateProjectForm}
                          placeholder="Supabase Storage URL or /assets/imgs/works/example.png"
                          required
                        />
                        <FieldError message={projectFieldErrors.image} />
                      </label>

                      <div className="admin-image-panel">
                        <div className="admin-image-preview">
                          {projectImagePreview || projectForm.image ? (
                            <img src={projectImagePreview || projectForm.image} alt={projectForm.title || 'Project preview'} />
                          ) : (
                            <div className="admin-image-empty">
                              <Icon name="project" size={18} />
                              <span>No image selected yet</span>
                            </div>
                          )}
                        </div>

                        <div className="admin-image-tools">
                          <label className="admin-file-picker">
                            <span>Choose an image file</span>
                            <input type="file" accept="image/*" onChange={handleProjectImageChange} />
                          </label>

                          <div className="admin-action-row">
                            <button
                              type="button"
                              className="admin-primary-button"
                              onClick={handleProjectImageUpload}
                              disabled={!projectImageFile || projectImageUploading}
                            >
                              {projectImageUploading ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="save" size={14} />}
                              {projectImageUploading ? 'Uploading...' : 'Upload to Supabase'}
                            </button>
                            <button
                              type="button"
                              className="admin-danger-button"
                              onClick={handleProjectImageDelete}
                              disabled={!projectForm.image || projectImageActionPending}
                            >
                              <Icon name="trash" size={14} />
                              {projectImageActionPending ? 'Deleting...' : 'Delete image'}
                            </button>
                          </div>

                          <p className="admin-image-note">
                            Uploaded images are stored in Supabase Storage. When you save a project with a new image, the old storage file is cleaned up automatically.
                          </p>
                          {projectImageError ? <div className="admin-inline-error">{projectImageError}</div> : null}
                          {projectImageStatus ? <div className="admin-inline-success">{projectImageStatus}</div> : null}
                        </div>
                      </div>

                      <label>
                        <span>Summary</span>
                        <textarea name="summary" rows="3" value={projectForm.summary} onChange={updateProjectForm} placeholder="Short summary of the project" required />
                        <FieldError message={projectFieldErrors.summary} />
                      </label>

                      <div className="admin-grid-2">
                        <label>
                          <span>Featured note</span>
                          <input name="featuredNote" value={projectForm.featuredNote} onChange={updateProjectForm} placeholder="Personal finance companion" />
                          <FieldError message={projectFieldErrors.featuredNote} />
                        </label>
                        <label>
                          <span>Sort order</span>
                          <input name="displayOrder" type="number" value={projectForm.displayOrder} onChange={updateProjectForm} placeholder="1" />
                          <FieldError message={projectFieldErrors.displayOrder} />
                        </label>
                      </div>

                      <label>
                        <span>Tags</span>
                        <textarea
                          name="tags"
                          rows="2"
                          value={projectForm.tags}
                          onChange={updateProjectForm}
                          placeholder="Flutter, Riverpod, SQLite"
                        />
                        <FieldError message={projectFieldErrors.tags} />
                      </label>

                      <label>
                        <span>Highlights</span>
                        <textarea
                          name="highlights"
                          rows="4"
                          value={projectForm.highlights}
                          onChange={updateProjectForm}
                          placeholder="One highlight per line"
                        />
                        <FieldError message={projectFieldErrors.highlights} />
                      </label>

                      <div className="admin-grid-2">
                        <label>
                          <span>Project link</span>
                          <input name="link" value={projectForm.link} onChange={updateProjectForm} placeholder="https://..." required />
                          <FieldError message={projectFieldErrors.link} />
                        </label>
                        <label className="admin-checkbox">
                          <input name="isFeatured" type="checkbox" checked={projectForm.isFeatured} onChange={updateProjectForm} />
                          <span>Mark as featured</span>
                        </label>
                      </div>

                      {projectError ? <div className="admin-inline-error">{projectError}</div> : null}
                      {projectStatus ? <div className="admin-inline-success">{projectStatus}</div> : null}

                      <div className="admin-action-row">
                        <button className="admin-primary-button" type="submit" disabled={projectSaving}>
                          {projectSaving ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="save" size={14} />}
                          {selectedProjectId ? 'Save changes' : 'Create project'}
                        </button>
                        <button type="button" className="admin-secondary-button" onClick={handleProjectNew}>
                          <Icon name="plus" size={14} />
                          Reset Form
                        </button>
                        {selectedProjectId ? (
                          <button type="button" className="admin-danger-button" onClick={handleProjectDelete} disabled={projectSaving}>
                            <Icon name="trash" size={14} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </form>
                  </article>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeTab === 'pricing' ? (
            <section className="admin-content-workspace">
              <div className="admin-subtabs">
                <button
                  type="button"
                  className={pricingMode === 'packages' ? 'is-active' : ''}
                  onClick={() => setPricingMode('packages')}
                >
                  <Icon name="pricing" size={14} />
                  Packages
                </button>
                <button
                  type="button"
                  className={pricingMode === 'services' ? 'is-active' : ''}
                  onClick={() => setPricingMode('services')}
                >
                  <Icon name="grid" size={14} />
                  Services
                </button>
              </div>

              {pricingMode === 'packages' ? (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <p className="admin-card-label">Pricing</p>
                      <h2>Packages</h2>
                    </div>
                    <div className="admin-list-actions">
                      <button type="button" className="admin-primary-button" onClick={() => { handlePricingPackageNew(); setIsEditingPricingPackage(true); }}>
                        <Icon name="plus" size={14} />
                        New package
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadPricing} disabled={pricingLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {pricingError ? <div className="admin-inline-error">{pricingError}</div> : null}

                  {pricingLoading ? (
                    <div className="admin-loading-panel">
                      <span className="admin-spinner" aria-hidden="true" />
                      Loading pricing packages...
                    </div>
                  ) : pricingPackages.length ? (
                    <div className="admin-cards-row-list">
                      {pricingPackages.map((item, index) => (
                        <div
                          key={item.id}
                          className={`admin-item-row-card ${(draggedItem && draggedItem.listType === 'pricingPackages' && draggedItem.index === index) ? 'is-dragging' : ''}`}
                          draggable="true"
                          onDragStart={handleDragStart('pricingPackages', index)}
                          onDragOver={handleDragOver(index)}
                          onDrop={handleDrop('pricingPackages', index)}
                          onDragEnd={handleDragEnd}
                          onClick={() => {
                            setSelectedPricingPackageId(String(item.id));
                            setIsEditingPricingPackage(true);
                          }}
                        >
                          <div className="admin-drag-handle" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
                            <Icon name="drag" size={14} />
                          </div>
                          <div className="admin-item-row-info">
                            <div className="admin-item-row-header">
                              <h3>{item.title}</h3>
                              <div className="admin-row-badges">
                                {item.active ? null : <span className="admin-pill-danger">Hidden</span>}
                                <span className="admin-pill">{item.tier}</span>
                                <span className="admin-pill-secondary">{item.serviceLabel || 'Pricing service'}</span>
                              </div>
                            </div>
                            <p className="admin-item-row-summary">{item.description}</p>
                            <small className="admin-row-meta">
                              <strong>Price:</strong> {item.price} {item.originalPrice ? `(was ${item.originalPrice})` : ''} • <strong>Delivery:</strong> {item.delivery}
                            </small>
                          </div>
                          <div className="admin-item-row-actions">
                            <button
                              type="button"
                              className="admin-secondary-button admin-compact-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPricingPackageId(String(item.id));
                                setIsEditingPricingPackage(true);
                              }}
                            >
                              <Icon name="edit" size={14} />
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon="pricing"
                      title="No pricing packages"
                      description="Create your first package by clicking 'New package' above."
                    />
                  )}
                </div>
              ) : null}

              {pricingMode === 'services' ? (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <p className="admin-card-label">Pricing</p>
                      <h2>Service tabs</h2>
                    </div>
                    <div className="admin-list-actions">
                      <button type="button" className="admin-primary-button" onClick={() => { handlePricingServiceNew(); setIsEditingPricingService(true); }}>
                        <Icon name="plus" size={14} />
                        New service
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadPricing} disabled={pricingLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {pricingError ? <div className="admin-inline-error">{pricingError}</div> : null}

                  {pricingLoading ? (
                    <div className="admin-loading-panel">
                      <span className="admin-spinner" aria-hidden="true" />
                      Loading pricing services...
                    </div>
                  ) : pricingServices.length ? (
                    <div className="admin-cards-row-list">
                      {pricingServices.map((item, index) => {
                        const recordId = item.recordId || item.id;
                        return (
                          <div
                            key={recordId}
                            className={`admin-item-row-card ${(draggedItem && draggedItem.listType === 'pricingServices' && draggedItem.index === index) ? 'is-dragging' : ''}`}
                            draggable="true"
                            onDragStart={handleDragStart('pricingServices', index)}
                            onDragOver={handleDragOver(index)}
                            onDrop={handleDrop('pricingServices', index)}
                            onDragEnd={handleDragEnd}
                            onClick={() => {
                              setSelectedPricingServiceId(String(recordId));
                              setIsEditingPricingService(true);
                            }}
                          >
                            <div className="admin-drag-handle" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
                              <Icon name="drag" size={14} />
                            </div>
                            <div className="admin-item-row-info">
                              <div className="admin-item-row-header">
                                <h3>{item.label}</h3>
                                <div className="admin-row-badges">
                                  {item.active ? null : <span className="admin-pill-danger">Hidden</span>}
                                  <span className="admin-pill-secondary">Key: {item.serviceKey || item.id}</span>
                                </div>
                              </div>
                              <p className="admin-item-row-summary">{item.intro}</p>
                            </div>
                            <div className="admin-item-row-actions">
                              <button
                                type="button"
                                className="admin-secondary-button admin-compact-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPricingServiceId(String(recordId));
                                  setIsEditingPricingService(true);
                                }}
                              >
                                <Icon name="edit" size={14} />
                                Edit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      icon="pricing"
                      title="No pricing services"
                      description="Create your first pricing service tab by clicking 'New service' above."
                    />
                  )}
                </div>
              ) : null}

              {isEditingPricingPackage ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => { setIsEditingPricingPackage(false); setSelectedPricingPackageId(''); }}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-package-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2 id="admin-package-modal-title">{selectedPricingPackageId ? 'Edit pricing package' : 'Create pricing package'}</h2>
                      </div>
                      <button type="button" className="admin-secondary-button admin-icon-button" onClick={() => { setIsEditingPricingPackage(false); setSelectedPricingPackageId(''); }} aria-label="Close editor">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <form className="admin-form" onSubmit={handlePricingPackageSave}>
                      <div className="admin-grid-2">
                        <label>
                          <span>Service</span>
                          <select name="serviceId" value={pricingPackageForm.serviceId} onChange={updatePricingPackageForm} required>
                            <option value="">Choose service</option>
                            {pricingServices.map((service) => (
                              <option key={service.recordId || service.id} value={service.recordId || service.id}>
                                {service.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>Display order</span>
                          <input name="displayOrder" type="number" value={pricingPackageForm.displayOrder} onChange={updatePricingPackageForm} placeholder="1" />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Tier</span>
                          <input name="tier" value={pricingPackageForm.tier} onChange={updatePricingPackageForm} placeholder="Basic" required />
                        </label>
                        <label>
                          <span>Title</span>
                          <input name="title" value={pricingPackageForm.title} onChange={updatePricingPackageForm} placeholder="Basic Website" required />
                        </label>
                      </div>

                      <div className="admin-grid-3">
                        <label>
                          <span>Original Price (Old Price)</span>
                          <input name="originalPrice" value={pricingPackageForm.originalPrice} onChange={updatePricingPackageForm} placeholder="Rs. 60,000" />
                        </label>
                        <label>
                          <span>Discount (e.g. 25% off)</span>
                          <input name="discountPercent" value={pricingPackageForm.discountPercent} onChange={updatePricingPackageForm} placeholder="25% off" />
                        </label>
                        <label>
                          <span>Current Price (New Price)</span>
                          <input name="price" value={pricingPackageForm.price} onChange={updatePricingPackageForm} placeholder="Rs. 45,000" required />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Delivery</span>
                          <input name="delivery" value={pricingPackageForm.delivery} onChange={updatePricingPackageForm} placeholder="7-10 working days" required />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Badge</span>
                          <input name="badge" value={pricingPackageForm.badge} onChange={updatePricingPackageForm} placeholder="Most Popular" />
                        </label>
                        <label>
                          <span>Button text</span>
                          <input name="button" value={pricingPackageForm.button} onChange={updatePricingPackageForm} placeholder="Choose Basic" required />
                        </label>
                      </div>

                      <label>
                        <span>Description</span>
                        <textarea name="description" rows="3" value={pricingPackageForm.description} onChange={updatePricingPackageForm} placeholder="Describe who this package is for" required />
                      </label>

                      <label>
                        <span>Included features</span>
                        <textarea name="features" rows="8" value={pricingPackageForm.features} onChange={updatePricingPackageForm} placeholder="One feature per line" required />
                      </label>

                      <label>
                        <span>Not included</span>
                        <textarea name="unavailable" rows="5" value={pricingPackageForm.unavailable} onChange={updatePricingPackageForm} placeholder="One item per line" />
                      </label>

                      <label className="admin-checkbox">
                        <input name="active" type="checkbox" checked={pricingPackageForm.active} onChange={updatePricingPackageForm} />
                        <span>Show on public pricing page</span>
                      </label>

                      {pricingStatus ? <div className="admin-inline-success">{pricingStatus}</div> : null}
                      {pricingError ? <div className="admin-inline-error">{pricingError}</div> : null}

                      <div className="admin-action-row">
                        <button className="admin-primary-button" type="submit" disabled={pricingSaving || !pricingServices.length}>
                          {pricingSaving ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="save" size={14} />}
                          {selectedPricingPackageId ? 'Save changes' : 'Create package'}
                        </button>
                        <button type="button" className="admin-secondary-button" onClick={handlePricingPackageNew}>
                          <Icon name="plus" size={14} />
                          Reset Form
                        </button>
                        {selectedPricingPackageId ? (
                          <button type="button" className="admin-danger-button" onClick={handlePricingPackageDelete} disabled={pricingSaving}>
                            <Icon name="trash" size={14} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </form>
                  </article>
                </div>
              ) : null}

              {isEditingPricingService ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => { setIsEditingPricingService(false); setSelectedPricingServiceId(''); }}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-service-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2 id="admin-service-modal-title">{selectedPricingServiceId ? 'Edit service tab' : 'Create service tab'}</h2>
                      </div>
                      <button type="button" className="admin-secondary-button" onClick={() => { setIsEditingPricingService(false); setSelectedPricingServiceId(''); }} aria-label="Close editor">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <form className="admin-form" onSubmit={handlePricingServiceSave}>
                      <div className="admin-grid-2">
                        <label>
                          <span>Service key</span>
                          <input name="serviceKey" value={pricingServiceForm.serviceKey} onChange={updatePricingServiceForm} placeholder="websites" required />
                        </label>
                        <label>
                          <span>Label</span>
                          <input name="label" value={pricingServiceForm.label} onChange={updatePricingServiceForm} placeholder="Websites" required />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Icon name</span>
                          <input name="icon" value={pricingServiceForm.icon} onChange={updatePricingServiceForm} placeholder="code" required />
                        </label>
                        <label>
                          <span>Display order</span>
                          <input name="displayOrder" type="number" value={pricingServiceForm.displayOrder} onChange={updatePricingServiceForm} placeholder="1" />
                        </label>
                      </div>

                      <label>
                        <span>Intro text</span>
                        <textarea name="intro" rows="4" value={pricingServiceForm.intro} onChange={updatePricingServiceForm} placeholder="Describe this pricing service tab" required />
                      </label>

                      <label className="admin-checkbox">
                        <input name="active" type="checkbox" checked={pricingServiceForm.active} onChange={updatePricingServiceForm} />
                        <span>Show this service tab</span>
                      </label>

                      {pricingStatus ? <div className="admin-inline-success">{pricingStatus}</div> : null}
                      {pricingError ? <div className="admin-inline-error">{pricingError}</div> : null}

                      <div className="admin-action-row">
                        <button className="admin-primary-button" type="submit" disabled={pricingSaving}>
                          {pricingSaving ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="save" size={14} />}
                          {selectedPricingServiceId ? 'Save changes' : 'Create service'}
                        </button>
                        <button type="button" className="admin-secondary-button" onClick={handlePricingServiceNew}>
                          <Icon name="plus" size={14} />
                          Reset Form
                        </button>
                        {selectedPricingServiceId ? (
                          <button type="button" className="admin-danger-button" onClick={handlePricingServiceDelete} disabled={pricingSaving}>
                            <Icon name="trash" size={14} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </form>
                  </article>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeTab === 'content' ? (
            <section className="admin-content-workspace">
              <div className="admin-subtabs">
                <button
                  type="button"
                  className={contentMode === 'experience' ? 'is-active' : ''}
                  onClick={() => setContentMode('experience')}
                >
                  <Icon name="briefcase" size={14} />
                  Experience
                </button>
                <button
                  type="button"
                  className={contentMode === 'education' ? 'is-active' : ''}
                  onClick={() => setContentMode('education')}
                >
                  <Icon name="education" size={14} />
                  Education
                </button>
                <button
                  type="button"
                  className={contentMode === 'certificates' ? 'is-active' : ''}
                  onClick={() => setContentMode('certificates')}
                >
                  <Icon name="certificate" size={14} />
                  Certificates
                </button>
              </div>

              {contentMode === 'experience' ? (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <p className="admin-card-label">Experience</p>
                      <h2>Work timeline</h2>
                    </div>
                    <div className="admin-list-actions">
                      <button type="button" className="admin-primary-button" onClick={() => { handleExperienceNew(); setIsEditingExperience(true); }}>
                        <Icon name="plus" size={14} />
                        New role
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadExperience} disabled={experienceLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {experienceError ? <div className="admin-inline-error">{experienceError}</div> : null}

                  {experienceLoading ? (
                    <div className="admin-loading-panel">
                      <span className="admin-spinner" aria-hidden="true" />
                      Loading work experience...
                    </div>
                  ) : experience.length ? (
                    <div className="admin-cards-row-list">
                      {experience.map((item, index) => (
                        <div
                          key={item.id}
                          className={`admin-item-row-card ${(draggedItem && draggedItem.listType === 'experience' && draggedItem.index === index) ? 'is-dragging' : ''}`}
                          draggable="true"
                          onDragStart={handleDragStart('experience', index)}
                          onDragOver={handleDragOver(index)}
                          onDrop={handleDrop('experience', index)}
                          onDragEnd={handleDragEnd}
                          onClick={() => {
                            setSelectedExperienceId(String(item.id));
                            setIsEditingExperience(true);
                          }}
                        >
                          <div className="admin-drag-handle" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
                            <Icon name="drag" size={14} />
                          </div>
                          <div className="admin-item-row-info">
                            <div className="admin-item-row-header">
                              <h3>{item.role}</h3>
                              <div className="admin-row-badges">
                                {item.current ? <span className="admin-pill">Current</span> : null}
                                <span className="admin-pill-secondary">{item.org}</span>
                              </div>
                            </div>
                            <p className="admin-item-row-summary">{item.detail}</p>
                            <small className="admin-row-meta">
                              <strong>Period:</strong> {item.period}
                            </small>
                            {item.tags ? (
                              <div className="admin-row-tags">
                                {String(item.tags).split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                                  <span key={tag} className="admin-tag-badge">{tag}</span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <div className="admin-item-row-actions">
                            <button
                              type="button"
                              className="admin-secondary-button admin-compact-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedExperienceId(String(item.id));
                                setIsEditingExperience(true);
                              }}
                            >
                              <Icon name="edit" size={14} />
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon="briefcase"
                      title="No work experience yet"
                      description="Create your first role by clicking 'New role' above."
                    />
                  )}
                </div>
              ) : null}

              {contentMode === 'education' ? (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <p className="admin-card-label">Education</p>
                      <h2>Study timeline</h2>
                    </div>
                    <div className="admin-list-actions">
                      <button type="button" className="admin-primary-button" onClick={() => { handleEducationNew(); setIsEditingEducation(true); }}>
                        <Icon name="plus" size={14} />
                        New entry
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadEducation} disabled={educationLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {educationError ? <div className="admin-inline-error">{educationError}</div> : null}

                  {educationLoading ? (
                    <div className="admin-loading-panel">
                      <span className="admin-spinner" aria-hidden="true" />
                      Loading education...
                    </div>
                  ) : education.length ? (
                    <div className="admin-cards-row-list">
                      {education.map((item, index) => (
                        <div
                          key={item.id}
                          className={`admin-item-row-card ${(draggedItem && draggedItem.listType === 'education' && draggedItem.index === index) ? 'is-dragging' : ''}`}
                          draggable="true"
                          onDragStart={handleDragStart('education', index)}
                          onDragOver={handleDragOver(index)}
                          onDrop={handleDrop('education', index)}
                          onDragEnd={handleDragEnd}
                          onClick={() => {
                            setSelectedEducationId(String(item.id));
                            setIsEditingEducation(true);
                          }}
                        >
                          <div className="admin-drag-handle" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
                            <Icon name="drag" size={14} />
                          </div>
                          <div className="admin-item-row-info">
                            <div className="admin-item-row-header">
                              <h3>{item.title}</h3>
                              <div className="admin-row-badges">
                                {item.badge ? <span className="admin-pill">{item.badge}</span> : null}
                                <span className="admin-pill-secondary">{item.org}</span>
                              </div>
                            </div>
                            <p className="admin-item-row-summary">{item.detail}</p>
                            <small className="admin-row-meta">
                              <strong>Track:</strong> {item.track} • <strong>Period:</strong> {item.period}
                            </small>
                          </div>
                          <div className="admin-item-row-actions">
                            <button
                              type="button"
                              className="admin-secondary-button admin-compact-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEducationId(String(item.id));
                                setIsEditingEducation(true);
                              }}
                            >
                              <Icon name="edit" size={14} />
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon="education"
                      title="No education entries"
                      description="Create your first education entry by clicking 'New entry' above."
                    />
                  )}
                </div>
              ) : null}

              {contentMode === 'certificates' ? (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <p className="admin-card-label">Certificates</p>
                      <h2>Learning milestones</h2>
                    </div>
                    <div className="admin-list-actions">
                      <button type="button" className="admin-primary-button" onClick={() => { handleCertificateNew(); setIsEditingCertificate(true); }}>
                        <Icon name="plus" size={14} />
                        New certificate
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadCertificates} disabled={certificatesLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {certificatesError ? <div className="admin-inline-error">{certificatesError}</div> : null}

                  {certificatesLoading ? (
                    <div className="admin-loading-panel">
                      <span className="admin-spinner" aria-hidden="true" />
                      Loading certificates...
                    </div>
                  ) : certificates.length ? (
                    <div className="admin-cards-row-list">
                      {certificates.map((item, index) => (
                        <div
                          key={item.id}
                          className={`admin-item-row-card ${(draggedItem && draggedItem.listType === 'certificates' && draggedItem.index === index) ? 'is-dragging' : ''}`}
                          draggable="true"
                          onDragStart={handleDragStart('certificates', index)}
                          onDragOver={handleDragOver(index)}
                          onDrop={handleDrop('certificates', index)}
                          onDragEnd={handleDragEnd}
                          onClick={() => {
                            setSelectedCertificateId(String(item.id));
                            setIsEditingCertificate(true);
                          }}
                        >
                          <div className="admin-drag-handle" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
                            <Icon name="drag" size={14} />
                          </div>
                          {item.image ? (
                            <div className="admin-item-row-image">
                              <img src={item.image} alt={item.title} />
                            </div>
                          ) : null}
                          <div className="admin-item-row-info">
                            <div className="admin-item-row-header">
                              <h3>{item.title}</h3>
                              <div className="admin-row-badges">
                                <span className="admin-pill">{item.year}</span>
                                <span className="admin-pill-secondary">{item.org}</span>
                              </div>
                            </div>
                            <p className="admin-item-row-summary">{item.detail}</p>
                          </div>
                          <div className="admin-item-row-actions">
                            <button
                              type="button"
                              className="admin-secondary-button admin-compact-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCertificateId(String(item.id));
                                setIsEditingCertificate(true);
                              }}
                            >
                              <Icon name="edit" size={14} />
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon="certificate"
                      title="No certificates yet"
                      description="Create your first certificate by clicking 'New certificate' above."
                    />
                  )}
                </div>
              ) : null}

              {isEditingExperience ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => { setIsEditingExperience(false); setSelectedExperienceId(''); }}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-experience-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2 id="admin-experience-modal-title">{selectedExperienceId ? 'Edit work experience' : 'Create work experience'}</h2>
                      </div>
                      <button type="button" className="admin-secondary-button admin-icon-button" onClick={() => { setIsEditingExperience(false); setSelectedExperienceId(''); }} aria-label="Close editor">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <form className="admin-form" onSubmit={handleExperienceSave}>
                      <div className="admin-grid-2">
                        <label>
                          <span>Role</span>
                          <input name="role" value={experienceForm.role} onChange={updateExperienceForm} placeholder="Associate Software Engineer" required />
                        </label>
                        <label>
                          <span>Display order</span>
                          <input name="displayOrder" type="number" value={experienceForm.displayOrder} onChange={updateExperienceForm} placeholder="1" />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Organization</span>
                          <input name="org" value={experienceForm.org} onChange={updateExperienceForm} placeholder="W3Inventor" required />
                        </label>
                        <label>
                          <span>Period</span>
                          <input name="period" value={experienceForm.period} onChange={updateExperienceForm} placeholder="2026 Mar — Present" required />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label className="admin-checkbox">
                          <input name="current" type="checkbox" checked={experienceForm.current} onChange={updateExperienceForm} />
                          <span>Current role</span>
                        </label>
                        <label>
                          <span>Tags</span>
                          <textarea
                            name="tags"
                            rows="2"
                            value={experienceForm.tags}
                            onChange={updateExperienceForm}
                            placeholder="Flutter, Spring Boot, Redis"
                          />
                        </label>
                      </div>

                      <label>
                        <span>Detail</span>
                        <textarea
                          name="detail"
                          rows="5"
                          value={experienceForm.detail}
                          onChange={updateExperienceForm}
                          placeholder="Describe the role and your responsibilities"
                          required
                        />
                      </label>

                      {experienceStatus ? <div className="admin-inline-success">{experienceStatus}</div> : null}
                      {experienceError ? <div className="admin-inline-error">{experienceError}</div> : null}

                      <div className="admin-action-row">
                        <button className="admin-primary-button" type="submit" disabled={experienceSaving}>
                          {experienceSaving ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="save" size={14} />}
                          {selectedExperienceId ? 'Save changes' : 'Create role'}
                        </button>
                        <button type="button" className="admin-secondary-button" onClick={handleExperienceNew}>
                          <Icon name="plus" size={14} />
                          Reset Form
                        </button>
                        {selectedExperienceId ? (
                          <button type="button" className="admin-danger-button" onClick={handleExperienceDelete} disabled={experienceSaving}>
                            <Icon name="trash" size={14} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </form>
                  </article>
                </div>
              ) : null}

              {isEditingEducation ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => { setIsEditingEducation(false); setSelectedEducationId(''); }}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-education-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2 id="admin-education-modal-title">{selectedEducationId ? 'Edit education' : 'Create education'}</h2>
                      </div>
                      <button type="button" className="admin-secondary-button admin-icon-button" onClick={() => { setIsEditingEducation(false); setSelectedEducationId(''); }} aria-label="Close editor">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <form className="admin-form" onSubmit={handleEducationSave}>
                      <div className="admin-grid-2">
                        <label>
                          <span>Track</span>
                          <input name="track" value={educationForm.track} onChange={updateEducationForm} placeholder="Degree" required />
                        </label>
                        <label>
                          <span>Display order</span>
                          <input name="displayOrder" type="number" value={educationForm.displayOrder} onChange={updateEducationForm} />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Title</span>
                          <input name="title" value={educationForm.title} onChange={updateEducationForm} placeholder="BSc in Information Technology" required />
                        </label>
                        <label>
                          <span>Institution</span>
                          <input name="org" value={educationForm.org} onChange={updateEducationForm} placeholder="University of Jaffna" required />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Period</span>
                          <input name="period" value={educationForm.period} onChange={updateEducationForm} placeholder="2022 Oct — 2025 Jul" required />
                        </label>
                        <label>
                          <span>Badge</span>
                          <input name="badge" value={educationForm.badge} onChange={updateEducationForm} placeholder="GPA 3.73" />
                        </label>
                      </div>

                      <label>
                        <span>Detail</span>
                        <textarea name="detail" rows="5" value={educationForm.detail} onChange={updateEducationForm} placeholder="Describe the education entry" required />
                      </label>

                      {educationStatus ? <div className="admin-inline-success">{educationStatus}</div> : null}
                      {educationError ? <div className="admin-inline-error">{educationError}</div> : null}

                      <div className="admin-action-row">
                        <button className="admin-primary-button" type="submit" disabled={educationSaving}>
                          {educationSaving ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="save" size={14} />}
                          {selectedEducationId ? 'Save changes' : 'Create entry'}
                        </button>
                        <button type="button" className="admin-secondary-button" onClick={handleEducationNew}>
                          <Icon name="plus" size={14} />
                          Reset Form
                        </button>
                        {selectedEducationId ? (
                          <button type="button" className="admin-danger-button" onClick={handleEducationDelete} disabled={educationSaving}>
                            <Icon name="trash" size={14} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </form>
                  </article>
                </div>
              ) : null}

              {isEditingCertificate ? (
                <div className="admin-modal-backdrop" role="presentation" onClick={() => { setIsEditingCertificate(false); setSelectedCertificateId(''); }}>
                  <article className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-certificate-modal-title" onClick={(event) => event.stopPropagation()}>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2 id="admin-certificate-modal-title">{selectedCertificateId ? 'Edit certificate' : 'Create certificate'}</h2>
                      </div>
                      <button type="button" className="admin-secondary-button admin-icon-button" onClick={() => { setIsEditingCertificate(false); setSelectedCertificateId(''); }} aria-label="Close editor">
                        <Icon name="close" size={15} />
                      </button>
                    </div>

                    <form className="admin-form" onSubmit={handleCertificateSave}>
                      <div className="admin-grid-2">
                        <label>
                          <span>Title</span>
                          <input name="title" value={certificateForm.title} onChange={updateCertificateForm} placeholder="AI/ML Engineer — Stage 1" required />
                        </label>
                        <label>
                          <span>Display order</span>
                          <input name="displayOrder" type="number" value={certificateForm.displayOrder} onChange={updateCertificateForm} />
                        </label>
                      </div>

                      <div className="admin-grid-2">
                        <label>
                          <span>Issuer</span>
                          <input name="org" value={certificateForm.org} onChange={updateCertificateForm} placeholder="SLIIT" required />
                        </label>
                        <label>
                          <span>Year</span>
                          <input name="year" value={certificateForm.year} onChange={updateCertificateForm} placeholder="2026" required />
                        </label>
                      </div>

                      <label>
                        <span>Image path or URL</span>
                        <input
                          name="image"
                          value={certificateForm.image}
                          onChange={updateCertificateForm}
                          placeholder="Supabase Storage URL or /assets/imgs/certificates/example.png"
                        />
                      </label>

                      <div className="admin-image-panel">
                        <div className="admin-image-preview">
                          {certificateImagePreview || certificateForm.image ? (
                            <img
                              src={certificateImagePreview || certificateForm.image}
                              alt={certificateForm.title || 'Certificate preview'}
                            />
                          ) : (
                            <div className="admin-image-empty">
                              <Icon name="certificate" size={18} />
                              <span>No image selected yet</span>
                            </div>
                          )}
                        </div>

                        <div className="admin-image-tools">
                          <label className="admin-file-picker">
                            <span>Choose an image file</span>
                            <input type="file" accept="image/*" onChange={handleCertificateImageChange} />
                          </label>

                          <div className="admin-action-row">
                            <button
                              type="button"
                              className="admin-primary-button"
                              onClick={handleCertificateImageUpload}
                              disabled={!certificateImageFile || certificateImageUploading}
                            >
                              {certificateImageUploading ? (
                                <span className="admin-spinner" aria-hidden="true" />
                              ) : (
                                <Icon name="save" size={14} />
                              )}
                              {certificateImageUploading ? 'Uploading...' : 'Upload to Supabase'}
                            </button>
                            <button
                              type="button"
                              className="admin-danger-button"
                              onClick={handleCertificateImageDelete}
                              disabled={!certificateForm.image || certificateImageActionPending}
                            >
                              <Icon name="trash" size={14} />
                              {certificateImageActionPending ? 'Deleting...' : 'Delete image'}
                            </button>
                          </div>

                          <p className="admin-image-note">
                            Uploaded images are stored in Supabase Storage. The certificate image is kept in sync with the saved record.
                          </p>
                          {certificateImageError ? <div className="admin-inline-error">{certificateImageError}</div> : null}
                          {certificateImageStatus ? <div className="admin-inline-success">{certificateImageStatus}</div> : null}
                        </div>
                      </div>

                      <label>
                        <span>Detail</span>
                        <textarea name="detail" rows="5" value={certificateForm.detail} onChange={updateCertificateForm} placeholder="Describe the certificate" required />
                      </label>

                      {certificateStatus ? <div className="admin-inline-success">{certificateStatus}</div> : null}
                      {certificatesError ? <div className="admin-inline-error">{certificatesError}</div> : null}

                      <div className="admin-action-row">
                        <button className="admin-primary-button" type="submit" disabled={certificateSaving}>
                          {certificateSaving ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="save" size={14} />}
                          {selectedCertificateId ? 'Save changes' : 'Create certificate'}
                        </button>
                        <button type="button" className="admin-secondary-button" onClick={handleCertificateNew}>
                          <Icon name="plus" size={14} />
                          Reset Form
                        </button>
                        {selectedCertificateId ? (
                          <button type="button" className="admin-danger-button" onClick={handleCertificateDelete} disabled={certificateSaving}>
                            <Icon name="trash" size={14} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </form>
                  </article>
                </div>
              ) : null}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default Admin;
