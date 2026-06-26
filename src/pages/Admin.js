import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { apiRequest } from '../utils/api';
import './Admin.css';

const tabItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview of the site', icon: 'grid' },
  { id: 'messages', label: 'Messages', description: 'User inquiries', icon: 'messages' },
  { id: 'projects', label: 'Projects', description: 'CRUD portfolio projects', icon: 'project' },
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
  grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  inbox: ['M4 5h16v14H4z', 'M4 13h4l2 3h4l2-3h4'],
  lock: ['M8 11V8a4 4 0 0 1 8 0v3', 'M6 11h12v9H6z', 'M12 15v2'],
  mail: ['M4 5h16v14H4z', 'm4 7 8 6 8-6'],
  link: ['M10 14a4 4 0 0 1 0-6l2-2a4 4 0 1 1 6 6l-1 1', 'M14 10a4 4 0 0 1 0 6l-2 2a4 4 0 1 1-6-6l1-1'],
  messages: ['M4 5h16v11H9l-5 4z', 'M7 9h10', 'M7 12h6'],
  plus: ['M12 5v14', 'M5 12h14'],
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .6 2.9.7a2 2 0 0 1 1.7 2z'],
  project: ['M4 7h16v10H4z', 'M8 7V4h8v3', 'M4 11h16'],
  refresh: ['M21 12a9 9 0 1 1-3-6.7', 'M21 3v6h-6'],
  save: ['M5 5h11l3 3v11H5z', 'M8 5v6h8V5', 'M8 16h8'],
  search: ['M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z', 'm16 16 5 5'],
  spark: ['m12 3-1.1 3.2L8 7.4l2.9 1.3L12 12l1.1-3.3L16 7.4l-2.9-1.2L12 3z'],
  tag: ['M5 8V5h3', 'M4 4l7 7-6 6-7-7z'],
  trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 13h10l1-13', 'M9 7V4h6v3'],
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

function initials(value) {
  const parts = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '?';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
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

function TabButton({ active, badge, icon, label, description, onClick }) {
  return (
    <button type="button" className={`admin-tab-button ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span className="admin-tab-icon">
        <Icon name={icon} size={15} />
      </span>
      <span className="admin-tab-copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      {badge ? <span className="admin-tab-badge">{badge}</span> : null}
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

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState('');

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState('');
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

  const selectedMessage = useMemo(
    () => messages.find((message) => String(message.id) === String(selectedMessageId)) || messages[0] || null,
    [messages, selectedMessageId],
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

  const stats = useMemo(() => {
    const counts = dashboard || {};
    return {
      messages: counts.messages ?? messages.length,
      projects: counts.projects ?? projects.length,
      experience: counts.experience ?? experience.length,
      education: counts.education ?? education.length,
      certificates: counts.certificates ?? certificates.length,
      unread: messages.filter((item) => (item.status || 'new') === 'new').length,
    };
  }, [certificates.length, dashboard, education.length, experience.length, messages, projects.length]);

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
      setSelectedMessageId((current) => {
        if (current && loaded.some((item) => String(item.id) === String(current))) {
          return current;
        }
        return loaded[0] ? String(loaded[0].id) : '';
      });
    } catch (error) {
      setMessagesError(error.message || 'Unable to load messages.');
    } finally {
      setMessagesLoading(false);
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

  async function refreshDashboardTab() {
    await Promise.allSettled([
      loadDashboard(),
      loadMessages(messageSearch),
      loadProjects(),
      loadExperience(),
      loadEducation(),
      loadCertificates(),
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
      setProjects([]);
      setExperience([]);
      setEducation([]);
      setCertificates([]);
      setSelectedMessageId('');
      setSelectedProjectId('');
      setSelectedExperienceId('');
      setSelectedEducationId('');
      setSelectedCertificateId('');
      setProjectForm(emptyProjectForm);
      setExperienceForm(emptyExperienceForm);
      setEducationForm(emptyEducationForm);
      setCertificateForm(emptyCertificateForm);
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

  const handleProjectNew = () => {
    setSelectedProjectId('');
    setProjectError('');
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
    } catch (error) {
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
          <p>Sign in to manage messages, projects, education, and certificates.</p>
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
    { label: 'Projects', value: stats.projects, tone: 'indigo' },
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
                <span>Light workspace</span>
              </div>
            </div>

          <div className="admin-sidebar-note">
            <Icon name="circle" size={12} />
            Fast, clean workspace connected to your Supabase collections.
          </div>

          <label className="admin-sidebar-search">
            <Icon name="search" size={14} />
            <input type="search" placeholder="Search..." aria-label="Search admin sections" />
            <span className="admin-search-shortcut">⌘F</span>
          </label>

          <nav className="admin-tabs" aria-label="Admin sections">
            {tabItems.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                badge={
                  tab.id === 'projects'
                    ? String(stats.projects).padStart(2, '0')
                    : tab.id === 'messages'
                      ? String(stats.unread).padStart(2, '0')
                      : tab.id === 'content'
                        ? String(stats.experience + stats.education + stats.certificates).padStart(2, '0')
                        : null
                }
                icon={tab.icon}
                label={tab.label}
                description={tab.description}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-widget">
              <div className="admin-sidebar-widget-top">
                <div>
                  <p>Portfolio snapshot</p>
                  <strong>{String(stats.projects + stats.experience + stats.education + stats.certificates).padStart(2, '0')} records</strong>
                </div>
                <span className="admin-pill">Live</span>
              </div>
              <p>Projects, work experience, education, and certificates are synced from Supabase.</p>
              <a href="/" className="admin-primary-button admin-widget-button">
                <Icon name="arrowLeft" size={14} />
                Open public site
              </a>
            </div>
            <button type="button" className="admin-secondary-button" onClick={refreshDashboardTab} disabled={dashboardLoading || messagesLoading}>
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
                Clean admin workspace
              </p>
              <h1>
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'messages' && 'Messages'}
                {activeTab === 'projects' && 'Projects'}
                {activeTab === 'content' && 'Work Experience & Content'}
              </h1>
              <p>
                {activeTab === 'dashboard' && 'Summary of the website content and incoming activity.'}
                {activeTab === 'messages' && 'WhatsApp-style inbox for user submissions.'}
                {activeTab === 'projects' && 'Create, edit, and remove portfolio projects.'}
                {activeTab === 'content' && 'Manage work experience, education, and certificate entries from one place.'}
              </p>
            </div>

            <div className="admin-header-actions">
              <button type="button" className="admin-secondary-button" onClick={refreshDashboardTab} disabled={dashboardLoading || messagesLoading}>
                <Icon name="refresh" size={14} />
                Refresh Data
              </button>
              <a href="/" className="admin-secondary-button">
                <Icon name="arrowLeft" size={14} />
                Back to site
              </a>
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
            </section>
          ) : null}

          {activeTab === 'messages' ? (
            <section className="admin-message-workspace">
              <aside className="admin-card admin-message-list-panel">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Inbox</p>
                    <h2>User messages</h2>
                  </div>
                  <span className="admin-pill">{messages.length}</span>
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

                <div className="admin-message-list">
                  {messagesLoading ? (
                    <div className="admin-loading-panel">
                      <span className="admin-spinner" aria-hidden="true" />
                      Loading messages...
                    </div>
                  ) : messages.length ? (
                    messages.map((message) => {
                      const active = String(message.id) === String(selectedMessageId || messages[0]?.id);
                      const snippet = String(message.message || '').replace(/\s+/g, ' ').slice(0, 92);
                      return (
                        <button
                          key={message.id}
                          type="button"
                          className={`admin-message-item ${active ? 'is-active' : ''}`}
                          onClick={() => setSelectedMessageId(String(message.id))}
                        >
                          <span className="admin-message-avatar">{initials(message.name)}</span>
                          <div className="admin-message-copy">
                            <div className="admin-message-top">
                              <strong>{message.name}</strong>
                              <span>{formatShortDate(message.created_at)}</span>
                            </div>
                            <p>{message.subject}</p>
                            <small>{snippet}</small>
                          </div>
                          <span className={`admin-status-dot ${message.status === 'read' ? 'is-read' : 'is-new'}`} />
                        </button>
                      );
                    })
                  ) : (
                    <EmptyState
                      icon="inbox"
                      title="No messages found"
                      description={messageSearch ? 'Try another search term.' : 'Incoming contact submissions will show up here.'}
                    />
                  )}
                </div>
              </aside>

              <article className="admin-card admin-chat-panel">
                {selectedMessage ? (
                  <>
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Selected message</p>
                        <h2>{selectedMessage.subject}</h2>
                        <p className="admin-muted">
                          From {selectedMessage.name} on {formatDate(selectedMessage.created_at)}
                        </p>
                      </div>
                      <span className={`admin-status-badge ${selectedMessage.status === 'read' ? 'is-read' : 'is-new'}`}>
                        {selectedMessage.status || 'new'}
                      </span>
                    </div>

                    <div className="admin-chat-meta">
                      <span>
                        <Icon name="inbox" size={12} />
                        Portfolio contact form
                      </span>
                      <span>
                        <Icon name="calendar" size={12} />
                        {formatDate(selectedMessage.created_at)}
                      </span>
                    </div>

                    <div className="admin-chat-thread">
                      <div className="admin-chat-note">
                        <span className="admin-chat-note-label">Visitor</span>
                        <p>{selectedMessage.message}</p>
                        <small>{formatDate(selectedMessage.created_at)}</small>
                      </div>
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
                        <span className="admin-muted">{selectedMessage.status || 'new'}</span>
                      </div>
                    </div>

                    <div className="admin-action-row">
                      <a className="admin-primary-button" href={`mailto:${selectedMessage.email}`}>
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
                  </>
                ) : (
                  <EmptyState
                    icon="messages"
                    title="No message selected"
                    description="Pick a conversation from the list to see the full WhatsApp-style preview."
                  />
                )}
              </article>
            </section>
          ) : null}

          {activeTab === 'projects' ? (
            <section className="admin-dual-column">
              <aside className="admin-card admin-list-panel">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Projects</p>
                    <h2>Portfolio items</h2>
                  </div>
                  <span className="admin-pill">{projects.length}</span>
                </div>

                <div className="admin-list-actions">
                  <button type="button" className="admin-secondary-button" onClick={handleProjectNew}>
                    <Icon name="plus" size={14} />
                    New project
                  </button>
                  <button type="button" className="admin-secondary-button" onClick={loadProjects} disabled={projectsLoading}>
                    <Icon name="refresh" size={14} />
                    Refresh
                  </button>
                </div>

                {projectsError ? <div className="admin-inline-error">{projectsError}</div> : null}

                <div className="admin-item-list">
                  {projectsLoading ? (
                    <div className="admin-loading-panel">
                      <span className="admin-spinner" aria-hidden="true" />
                      Loading projects...
                    </div>
                  ) : projects.length ? (
                    projects.map((project) => {
                      const active = String(project.id) === String(selectedProjectId);
                      return (
                        <button
                          key={project.id}
                          type="button"
                          className={`admin-item-card ${active ? 'is-active' : ''}`}
                          onClick={() => setSelectedProjectId(String(project.id))}
                        >
                          <div className="admin-item-card-top">
                            <strong>{project.title}</strong>
                            {project.isFeatured ? <span className="admin-pill">Featured</span> : null}
                          </div>
                          <p>{project.category}</p>
                          <small>{project.summary}</small>
                        </button>
                      );
                    })
                  ) : (
                    <EmptyState
                      icon="project"
                      title="No projects yet"
                      description="Add your first portfolio project using the editor on the right."
                    />
                  )}
                </div>
              </aside>

              <article className="admin-card admin-editor-panel">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-card-label">Editor</p>
                    <h2>{selectedProjectId ? 'Edit project' : 'Create project'}</h2>
                  </div>
                  <span className="admin-pill">{selectedProjectId ? 'Edit mode' : 'New item'}</span>
                </div>

                <form className="admin-form" onSubmit={handleProjectSave}>
                  <div className="admin-grid-2">
                    <label>
                      <span>Title</span>
                      <input name="title" value={projectForm.title} onChange={updateProjectForm} placeholder="Money Manager App" required />
                    </label>
                    <label>
                      <span>Category</span>
                      <input name="category" value={projectForm.category} onChange={updateProjectForm} placeholder="Flutter mobile system" required />
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
                  </label>

                  <div className="admin-grid-2">
                    <label>
                      <span>Featured note</span>
                      <input name="featuredNote" value={projectForm.featuredNote} onChange={updateProjectForm} placeholder="Personal finance companion" />
                    </label>
                    <label>
                      <span>Sort order</span>
                      <input name="displayOrder" type="number" value={projectForm.displayOrder} onChange={updateProjectForm} placeholder="1" />
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
                  </label>

                  <div className="admin-grid-2">
                    <label>
                      <span>Project link</span>
                      <input name="link" value={projectForm.link} onChange={updateProjectForm} placeholder="https://..." required />
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
                      Reset
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
                <section className="admin-dual-column">
                  <aside className="admin-card admin-list-panel">
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Experience</p>
                        <h2>Work timeline</h2>
                      </div>
                      <span className="admin-pill">{experience.length}</span>
                    </div>

                    <div className="admin-list-actions">
                      <button type="button" className="admin-secondary-button" onClick={handleExperienceNew}>
                        <Icon name="plus" size={14} />
                        New role
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadExperience} disabled={experienceLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>

                    {experienceError ? <div className="admin-inline-error">{experienceError}</div> : null}

                    <div className="admin-item-list">
                      {experienceLoading ? (
                        <div className="admin-loading-panel">
                          <span className="admin-spinner" aria-hidden="true" />
                          Loading work experience...
                        </div>
                      ) : experience.length ? (
                        experience.map((item) => {
                          const active = String(item.id) === String(selectedExperienceId);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`admin-item-card ${active ? 'is-active' : ''}`}
                              onClick={() => setSelectedExperienceId(String(item.id))}
                            >
                              <div className="admin-item-card-top">
                                <strong>{item.role}</strong>
                                {item.current ? <span className="admin-pill">Current</span> : null}
                              </div>
                              <p>{item.org}</p>
                              <small>
                                {item.period}
                              </small>
                            </button>
                          );
                        })
                      ) : (
                        <EmptyState
                          icon="briefcase"
                          title="No work experience yet"
                          description="Add your roles from the editor to populate the public timeline."
                        />
                      )}
                    </div>
                  </aside>

                  <article className="admin-card admin-editor-panel">
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2>{selectedExperienceId ? 'Edit work experience' : 'Create work experience'}</h2>
                      </div>
                      <span className="admin-pill">{selectedExperienceId ? 'Edit mode' : 'New item'}</span>
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
                          Reset
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
                </section>
              ) : null}

              {contentMode === 'education' ? (
                <section className="admin-dual-column">
                  <aside className="admin-card admin-list-panel">
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Education</p>
                        <h2>Study timeline</h2>
                      </div>
                      <span className="admin-pill">{education.length}</span>
                    </div>

                    <div className="admin-list-actions">
                      <button type="button" className="admin-secondary-button" onClick={handleEducationNew}>
                        <Icon name="plus" size={14} />
                        New entry
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadEducation} disabled={educationLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>

                    {educationError ? <div className="admin-inline-error">{educationError}</div> : null}

                    <div className="admin-item-list">
                      {educationLoading ? (
                        <div className="admin-loading-panel">
                          <span className="admin-spinner" aria-hidden="true" />
                          Loading education...
                        </div>
                      ) : education.length ? (
                        education.map((item) => {
                          const active = String(item.id) === String(selectedEducationId);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`admin-item-card ${active ? 'is-active' : ''}`}
                              onClick={() => setSelectedEducationId(String(item.id))}
                            >
                              <div className="admin-item-card-top">
                                <strong>{item.title}</strong>
                                {item.badge ? <span className="admin-pill">{item.badge}</span> : null}
                              </div>
                              <p>{item.org}</p>
                              <small>
                                {item.track} • {item.period}
                              </small>
                            </button>
                          );
                        })
                      ) : (
                        <EmptyState
                          icon="education"
                          title="No education entries"
                          description="Create the study timeline cards from the editor."
                        />
                      )}
                    </div>
                  </aside>

                  <article className="admin-card admin-editor-panel">
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2>{selectedEducationId ? 'Edit education' : 'Create education'}</h2>
                      </div>
                      <span className="admin-pill">{selectedEducationId ? 'Edit mode' : 'New item'}</span>
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
                          Reset
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
                </section>
              ) : null}

              {contentMode === 'certificates' ? (
                <section className="admin-dual-column">
                  <aside className="admin-card admin-list-panel">
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Certificates</p>
                        <h2>Learning milestones</h2>
                      </div>
                      <span className="admin-pill">{certificates.length}</span>
                    </div>

                    <div className="admin-list-actions">
                      <button type="button" className="admin-secondary-button" onClick={handleCertificateNew}>
                        <Icon name="plus" size={14} />
                        New certificate
                      </button>
                      <button type="button" className="admin-secondary-button" onClick={loadCertificates} disabled={certificatesLoading}>
                        <Icon name="refresh" size={14} />
                        Refresh
                      </button>
                    </div>

                    {certificatesError ? <div className="admin-inline-error">{certificatesError}</div> : null}

                    <div className="admin-item-list">
                      {certificatesLoading ? (
                        <div className="admin-loading-panel">
                          <span className="admin-spinner" aria-hidden="true" />
                          Loading certificates...
                        </div>
                      ) : certificates.length ? (
                        certificates.map((item) => {
                          const active = String(item.id) === String(selectedCertificateId);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`admin-item-card ${active ? 'is-active' : ''}`}
                              onClick={() => setSelectedCertificateId(String(item.id))}
                            >
                              <div className="admin-item-card-top">
                                <strong>{item.title}</strong>
                                <span className="admin-pill">{item.year}</span>
                              </div>
                              <p>{item.org}</p>
                              <small>{item.detail}</small>
                            </button>
                          );
                        })
                      ) : (
                        <EmptyState
                          icon="certificate"
                          title="No certificates yet"
                          description="Add certificates to show learning progress in the portfolio."
                        />
                      )}
                    </div>
                  </aside>

                  <article className="admin-card admin-editor-panel">
                    <div className="admin-card-header">
                      <div>
                        <p className="admin-card-label">Editor</p>
                        <h2>{selectedCertificateId ? 'Edit certificate' : 'Create certificate'}</h2>
                      </div>
                      <span className="admin-pill">{selectedCertificateId ? 'Edit mode' : 'New item'}</span>
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
                          Reset
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
                </section>
              ) : null}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default Admin;
