import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useReducedMotion as useFramerReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  siDart,
  siDocker,
  siExpress,
  siFirebase,
  siFigma,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siKubernetes,
  siMongodb,
  siMqtt,
  siMysql,
  siNginx,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPostman,
  siReact,
  siRedis,
  siSqlite,
  siOpenjdk,
  siSpringboot,
  siTailwindcss,
  siTypescript,
  siFlutter,
  siCss,
} from 'simple-icons';
import withBase from '../utils/basePath';
import { apiRequest } from '../utils/api';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '#contact' },
];

const roles = [
  'Software Engineer',
  'Flutter Developer',
  'Full Stack Developer',
  'Mobile App Developer',
];

const heroTechnologies = [
  'Flutter',
  'Dart',
  'React',
  'TypeScript',
  'Spring Boot',
  'Node.js',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'MongoDB',
  'Tailwind',
];

const profile = {
  name: 'Chamuditha Perera',
  email: 'chamudithaperera.dev@gmail.com',
  phone: '+94787250549',
  address: 'No 83, Galle Road, Kalutara North',
  github: 'chamudithaperera',
  linkedin: 'chamudithaperera',
  portfolio: 'https://chamudithaperera.online',
};

const whatsappNumber = profile.phone.replace(/\D/g, '');
const whatsappMessage = encodeURIComponent(
  'Hi Chamuditha, I found your portfolio and would like to discuss a project.'
);
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

const siteUrl = 'https://chamudithaperera.online';
const siteName = 'Chamuditha Perera';
const siteTitle = 'Chamuditha Perera | Software Engineer';
const siteDescription =
  'Chamuditha Perera (Chamuditha), software engineer in Sri Lanka building Flutter mobile apps, React websites, Spring Boot APIs, and full-stack products.';
const siteKeywords =
  'Chamuditha, Chamuditha Perera, software engineer, Flutter developer, React developer, full-stack developer, mobile app developer, Sri Lanka software engineer';
const projectsPageTitle = 'Projects | Chamuditha Perera';
const projectsPageDescription =
  "Selected projects by Chamuditha Perera, software engineer: Flutter apps, React websites, Spring Boot APIs, dashboards, admin panels, and UI/UX product work.";
const pricingPageTitle = 'Pricing | Chamuditha Perera';
const pricingPageDescription =
  'Website and mobile app pricing packages from Chamuditha Perera, with options for portfolios, business websites, admin panels, and custom apps.';
const socialImage = `${siteUrl}/assets/imgs/header/coding-hero-v2.png`;
const socialImageAlt = 'Chamuditha Perera portfolio showcase with Flutter, React, Spring Boot, and TypeScript';
const siteLogo = `${siteUrl}/favicon.png`;
const siteIcon = `${siteUrl}/favicon.ico`;
const siteTouchIcon = `${siteUrl}/site-icon-192.png`;

const locationUrl =
  'https://www.google.com/maps/search/?api=1&query=No+83%2C+Galle+Road%2C+Kalutara+North%2C+Sri+Lanka';

const emptyPricingServices = [];

const pricingImportantInfo = [
  'Prices are starting prices.',
  'Final cost depends on features and project complexity.',
  'Domain, hosting and third-party service charges are not included.',
  'A deposit is required before starting.',
  'Additional revisions may have extra charges.',
  'Clients must provide text, images and business information unless content creation is included.',
];

const pricingFaqs = [
  {
    question: 'How long will my project take?',
    answer:
      'Each package includes an estimated delivery range. The final timeline depends on content readiness, feature complexity, feedback speed, and integrations.',
  },
  {
    question: 'Do you provide maintenance?',
    answer:
      'Yes. Each package includes technical support after delivery, and ongoing maintenance can be arranged separately when the project needs long-term care.',
  },
  {
    question: 'Can I upgrade my package later?',
    answer:
      'Yes. You can start with a smaller package and upgrade later as your business needs grow or new features become clear.',
  },
  {
    question: 'Are domain and hosting included?',
    answer:
      'Domain, hosting, payment gateway, app store, and third-party service charges are not included in the starting prices.',
  },
  {
    question: 'Do you publish mobile apps to the stores?',
    answer:
      'I can assist with Play Store and App Store submission. Store account fees, approvals, and required business documentation remain the client responsibility.',
  },
  {
    question: 'What payment methods are available?',
    answer:
      'Payment options can be confirmed during quotation. A deposit is required before starting, with remaining payments usually tied to project milestones.',
  },
];

const emptyPortfolioContent = {
  projects: [],
  experience: [],
  education: [],
  certificates: [],
  techStacks: [],
};

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const revealMotion = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const sectionHeadingItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

function getReadableIconColor(hex, fallback) {
  if (!hex) {
    return fallback;
  }

  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return fallback;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;

  return luminance < 0.42 ? '#f8fafc' : hex;
}

const TECH_STACK_ORBIT_LAYOUT = [
  {
    label: 'Languages',
    legendLabel: 'Languages',
    orbitRadius: 96,
    planetSize: 32,
    speed: 16,
    startOffset: 10,
    surface: '#09182e',
    ringColor: 'rgba(56, 189, 248, 0.24)',
    accent: '#38bdf8',
  },
  {
    label: 'Frameworks & Libraries',
    legendLabel: 'Frameworks',
    orbitRadius: 166,
    planetSize: 36,
    speed: 20,
    startOffset: 24,
    surface: '#0a1427',
    ringColor: 'rgba(96, 165, 250, 0.24)',
    accent: '#60a5fa',
  },
  {
    label: 'Backend & Database',
    legendLabel: 'Backend',
    orbitRadius: 236,
    planetSize: 40,
    speed: 24,
    startOffset: 18,
    surface: '#102238',
    ringColor: 'rgba(34, 211, 238, 0.22)',
    accent: '#22d3ee',
  },
  {
    label: 'DevOps & Other Tools',
    legendLabel: 'DevOps',
    orbitRadius: 306,
    planetSize: 44,
    speed: 28,
    startOffset: 32,
    surface: '#111b33',
    ringColor: 'rgba(167, 139, 250, 0.22)',
    accent: '#a78bfa',
  },
];

const TECH_STACK_GLYPH_LIBRARY = {
  dart: { label: 'Dart', icon: siDart },
  java: { label: 'Java', icon: siOpenjdk },
  typescript: { label: 'TypeScript', icon: siTypescript },
  javascript: { label: 'JavaScript', icon: siJavascript },
  html: { label: 'HTML', icon: siHtml5 },
  css: { label: 'CSS', icon: siCss },
  php: { label: 'PHP', icon: siPhp },
  flutter: { label: 'Flutter', icon: siFlutter },
  react: { label: 'React', icon: siReact },
  'spring-boot': { label: 'Spring Boot', icon: siSpringboot },
  express: { label: 'Express.js', icon: siExpress },
  tailwind: { label: 'Tailwind CSS', icon: siTailwindcss },
  node: { label: 'Node.js', icon: siNodedotjs },
  firebase: { label: 'Firebase', icon: siFirebase },
  mongodb: { label: 'MongoDB', icon: siMongodb },
  mysql: { label: 'MySQL', icon: siMysql },
  postgresql: { label: 'PostgreSQL', icon: siPostgresql },
  sqlite: { label: 'SQLite', icon: siSqlite },
  redis: { label: 'Redis', icon: siRedis },
  mqtt: { label: 'MQTT', icon: siMqtt },
  jwt: { label: 'JWT Auth', icon: siJsonwebtokens },
  git: { label: 'Git', icon: siGit },
  github: { label: 'GitHub', icon: siGithub },
  docker: { label: 'Docker', icon: siDocker },
  postman: { label: 'Postman', icon: siPostman },
  kubernetes: { label: 'Kubernetes', icon: siKubernetes },
  nginx: { label: 'Nginx', icon: siNginx },
  figma: { label: 'Figma', icon: siFigma },
  photoshop: { label: 'Adobe Photoshop', monogram: 'PS' },
  'react-native': { label: 'React Native', monogram: 'RN' },
  riverpod: { label: 'Riverpod', monogram: 'RP' },
  api: { label: 'RESTful APIs', monogram: 'API' },
};

function resolveTechStackGlyph(glyphKey) {
  const fallback = TECH_STACK_GLYPH_LIBRARY.api;
  return TECH_STACK_GLYPH_LIBRARY[glyphKey] || fallback;
}

function normalizeTechStackItem(item, categoryMeta, index = 0) {
  const iconKind = item.iconKind || 'glyph';
  const iconValue = item.iconValue || item.glyphKey || '';
  const glyph = iconKind === 'glyph' ? resolveTechStackGlyph(iconValue) : null;
  const iconHex = glyph?.icon?.hex ? `#${glyph.icon.hex}` : null;
  return {
    id: item.id ?? `${slugify(item.category || categoryMeta.label)}-${slugify(item.label)}`,
    category: item.category || categoryMeta.label,
    orbitLabel: categoryMeta.legendLabel,
    orbitIndex: categoryMeta.orbitIndex ?? 0,
    orbitRadius: categoryMeta.orbitRadius,
    size: categoryMeta.planetSize,
    speed: categoryMeta.speed,
    startOffset: categoryMeta.startOffset,
    surface: categoryMeta.surface,
    ringColor: categoryMeta.ringColor,
    accent: categoryMeta.accent,
    label: item.label,
    summary: item.summary,
    iconKind,
    iconValue,
    icon: item.icon || glyph?.icon || null,
    monogram: item.monogram || (iconKind === 'monogram' ? iconValue : glyph?.monogram || ''),
    customSvgPath: item.customSvgPath || (iconKind === 'svg' ? iconValue : ''),
    glyphKey: iconValue,
    glyphColor: getReadableIconColor(item.glyphColor || iconHex, categoryMeta.accent),
    displayOrder: item.displayOrder ?? index,
    active: item.active !== false,
  };
}

function buildTechStackOrbits(stacks) {
  const activeStacks = Array.isArray(stacks)
    ? stacks.filter((stack) => stack && stack.active !== false && stack.category && stack.label && stack.summary)
    : [];

  return TECH_STACK_ORBIT_LAYOUT.map((group, orbitIndex) => {
    const items = activeStacks
      .filter((stack) => stack.category === group.label)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || String(a.label).localeCompare(String(b.label)))
      .map((stack, index) => normalizeTechStackItem(stack, group, index));

    return {
      ...group,
      orbitIndex,
      items,
    };
  });
}

const heroFloatingTechBadges = [
  {
    key: 'flutter',
    className: 'hero-tech-badge-flutter',
    stack: {
      ...TECH_STACK_GLYPH_LIBRARY.flutter,
      glyphColor: '#7dd3fc',
      surface: '#071d33',
    },
    motion: { duration: 8.5, delay: 0.1 },
    style: { top: '6%', left: '-2.5%' },
  },
  {
    key: 'react',
    className: 'hero-tech-badge-react',
    stack: {
      ...TECH_STACK_GLYPH_LIBRARY.react,
      glyphColor: '#67e8f9',
      surface: '#071a2e',
    },
    motion: { duration: 9.5, delay: 0.7 },
    style: { top: '3%', right: '-1.5%' },
  },
  {
    key: 'spring-boot',
    className: 'hero-tech-badge-spring',
    stack: {
      ...TECH_STACK_GLYPH_LIBRARY['spring-boot'],
      glyphColor: '#6ee7b7',
      surface: '#071f1a',
    },
    motion: { duration: 10.5, delay: 1.15 },
    style: { top: '44%', left: '-5%' },
  },
  {
    key: 'node',
    className: 'hero-tech-badge-node',
    stack: {
      ...TECH_STACK_GLYPH_LIBRARY.node,
      glyphColor: '#86efac',
      surface: '#0a2015',
    },
    motion: { duration: 11.5, delay: 0.4 },
    style: { bottom: '17%', left: '4%' },
  },
  {
    key: 'mysql',
    className: 'hero-tech-badge-mysql',
    stack: {
      ...TECH_STACK_GLYPH_LIBRARY.mysql,
      glyphColor: '#60a5fa',
      surface: '#07182b',
    },
    motion: { duration: 12.5, delay: 1.5 },
    style: { bottom: '12%', right: '-1%' },
  },
];

const GALAXY_PARTICLE_COUNT = 1400;
const GALAXY_ARMS = 4;

const iconPaths = {
  code: ['M8 9l-4 3 4 3', 'M16 9l4 3-4 3', 'M14 5l-4 14'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  github: ['M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 3.7 5.2 5.2 0 0 0 19.2 0S18 0 15 1.5a13.4 13.4 0 0 0-7 0C5 0 3.8 0 3.8 0a5.2 5.2 0 0 0-.1 3.7A5.5 5.5 0 0 0 2.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4', 'M8 19c-3 .9-3-1.5-4-2'],
  linkedin: ['M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2', 'M2 9h4v12H2z', 'M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4'],
  mail: ['M4 4h16v16H4z', 'm4 6 8 6 8-6'],
  external: ['M14 3h7v7', 'M10 14 21 3', 'M21 14v7H3V3h7'],
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .6 2.9.7a2 2 0 0 1 1.7 2z'],
  support: [
    'M4 13v-1a8 8 0 0 1 16 0v1',
    'M6 13h2v5H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z',
    'M16 13h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2z',
    'M18 18c0 2-2 3-5 3h-1',
  ],
  whatsapp: [
    'M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5z',
    'M8.8 8.9c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.5 1.2c.1.3.1.5-.1.7l-.4.5c.8 1.4 1.9 2.3 3.3 2.8l.5-.5c.2-.2.5-.2.7-.1l1.2.6c.3.1.4.3.4.6v.5c0 .4-.2.6-.5.8-.5.2-1 .3-1.6.2-2.9-.5-5.1-2.4-6.2-5.1-.2-.6-.1-1.3.2-2.1z',
  ],
  pin: ['M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z', 'M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5'],
  briefcase: ['M4 7h16v13H4z', 'M9 7V4h6v3', 'M4 12h16'],
  calendar: ['M3 5h18v16H3z', 'M16 3v4', 'M8 3v4', 'M3 10h18'],
  graduation: ['m2 10 10-5 10 5-10 5z', 'M6 12v5c3 2 9 2 12 0v-5'],
  award: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.5 13-1 9 4.5-2 4.5 2-1-9'],
  send: ['m22 2-7 20-4-9-9-4z', 'M22 2 11 13'],
  check: ['m5 12 4 4L19 6'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  arrowLeft: ['M19 12H5', 'm11 18-6-6 6-6'],
  arrowRight: ['M5 12h14', 'm13 6 6 6-6 6'],
  arrowDown: ['M12 5v14', 'm6 13 6 6 6-6'],
  arrowUp: ['M12 19V5', 'm6 11 6-6 6 6'],
  arrowUpRight: ['M7 17 17 7', 'M7 7h10v10'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  sparkles: ['m12 3-1.2 3.2L8 7.5l2.8 1.3L12 12l1.2-3.2L16 7.5l-2.8-1.3L12 3z', 'm19 13-.8 2.2L16 16l2.2.8L19 19l.8-2.2L22 16l-2.2-.8L19 13z'],
  heart: ['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8z'],
};

function Icon({ name, size = 16, className = '' }) {
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
      {(iconPaths[name] || iconPaths.code).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

const chatbotQuickPrompts = [
  { id: 'services', label: 'What services do you offer?', intent: 'services' },
  { id: 'website-pricing', label: 'What is the pricing for a website?', intent: 'website-pricing' },
  { id: 'mobile-pricing', label: 'What is the pricing for a mobile app?', intent: 'mobile-pricing' },
  { id: 'projects', label: 'Show me your projects', intent: 'projects' },
  { id: 'contact', label: 'How can I contact you?', intent: 'contact' },
];

const chatbotWelcomeText =
  'Hello, welcome to the ChamudithaPerera.Online Software Solutions. I am your AI assistant. How can I help you? Use the quick messages below to get started.';

function createChatbotMessage(role, text, extra = {}) {
  return {
    id: `${role}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    ...extra,
  };
}

function normalizeChatbotInput(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectChatbotIntent(message) {
  const text = normalizeChatbotInput(message);
  const hasPricingLanguage = /(price|pricing|cost|quote|charges|estimate|package)/.test(text);

  if (/(service|services|offer|do you build|what can you make|what do you do)/.test(text)) {
    return 'services';
  }

  if (hasPricingLanguage && /(website|web|site|portfolio)/.test(text)) {
    return 'website-pricing';
  }

  if (hasPricingLanguage && /(mobile|app|android|ios|flutter)/.test(text)) {
    return 'mobile-pricing';
  }

  if (/(project|projects|portfolio|work samples|show me)/.test(text)) {
    return 'projects';
  }

  if (/(contact|email|whatsapp|call|phone|get in touch|reach you)/.test(text)) {
    return 'contact';
  }

  return null;
}

function buildLocalChatbotReply(intent) {
  const replies = {
    services: {
      reply:
        'I build Flutter mobile apps, React websites, full-stack systems, APIs, dashboards, and polished UI experiences. I can also help with admin panels and product implementation.',
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Contact Me', href: '/#contact' },
      ],
    },
    'website-pricing': {
      reply: 'You can check my website pricing on the pricing page. I am opening it now.',
      autoNavigate: '/pricing',
    },
    'mobile-pricing': {
      reply: 'You can check my mobile app pricing on the pricing page. I am opening it now.',
      autoNavigate: '/pricing',
    },
    projects: {
      reply: 'You can browse my selected projects now. I am opening the projects page.',
      autoNavigate: '/projects',
    },
    contact: {
      reply: 'You can reach me by email or WhatsApp. I am opening the contact section now.',
      actions: [
        { label: 'Email', href: `mailto:${profile.email}` },
        { label: 'WhatsApp', href: whatsappUrl },
      ],
      autoNavigate: '/#contact',
    },
    fallback: {
      reply:
        'I can help with services, pricing, projects, and contact details. Try one of the quick messages below.',
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
  };

  return replies[intent] || replies.fallback;
}

function FloatingAiAgent() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useFramerReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [createChatbotMessage('assistant', chatbotWelcomeText, { chips: chatbotQuickPrompts })]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const panelRef = useRef(null);
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const autoNavigateTimerRef = useRef(null);

  const scrollToLatestMessage = () => {
    const container = messageListRef.current;
    if (!container) {
      return;
    }

    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    window.requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior });
    });
  };

  const clearAutoNavigateTimer = () => {
    if (autoNavigateTimerRef.current) {
      window.clearTimeout(autoNavigateTimerRef.current);
      autoNavigateTimerRef.current = null;
    }
  };

  const closeChat = () => {
    clearAutoNavigateTimer();
    setOpen(false);
  };

  const openChat = () => {
    if (!open) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    }
  };

  const appendMessage = (message) => {
    setMessages((current) => [...current, message]);
  };

  const handleNavigate = (href) => {
    if (!href) {
      return;
    }

    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.location.href = href;
      return;
    }

    navigate(href);
  };

  const handleIntentResponse = (intent, userText) => {
    const response = buildLocalChatbotReply(intent);
    const userMessage = createChatbotMessage('user', userText);
    appendMessage(userMessage);
    setDraft('');
    setIsSending(true);
    clearAutoNavigateTimer();

    window.setTimeout(() => {
      appendMessage(createChatbotMessage('assistant', response.reply, { actions: response.actions || [] }));
      setIsSending(false);
      if (response.autoNavigate) {
        autoNavigateTimerRef.current = window.setTimeout(() => {
          handleNavigate(response.autoNavigate);
        }, prefersReducedMotion ? 0 : 650);
      }
    }, prefersReducedMotion ? 0 : 280);
  };

  const handleQuickPrompt = (prompt) => {
    if (!prompt) {
      return;
    }

    openChat();
    handleIntentResponse(prompt.intent, prompt.label);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = draft.trim();

    if (!value || isSending) {
      return;
    }

    const localIntent = detectChatbotIntent(value);
    if (localIntent) {
      handleIntentResponse(localIntent, value);
      return;
    }

    appendMessage(createChatbotMessage('user', value));
    setDraft('');
    setIsSending(true);
    clearAutoNavigateTimer();

    const typingDelay = prefersReducedMotion ? 0 : 240;
    window.setTimeout(async () => {
      try {
        const response = await apiRequest('/api/chatbot/message', {
          method: 'POST',
          body: { message: value },
        });

        const reply = response?.reply || buildLocalChatbotReply('fallback').reply;
        appendMessage(createChatbotMessage('assistant', reply, { actions: response?.actions || [] }));
      } catch (error) {
        void error;
        const fallback = buildLocalChatbotReply('fallback');
        appendMessage(createChatbotMessage('assistant', fallback.reply, { actions: fallback.actions || [] }));
      } finally {
        setIsSending(false);
      }
    }, typingDelay);
  };

  const handleMessageAction = (href) => {
    handleNavigate(href);
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousFocus = restoreFocusRef.current;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, prefersReducedMotion ? 0 : 100);

    return () => {
      window.clearTimeout(timer);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    };
  }, [open, prefersReducedMotion]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const lock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = lock;
    };
  }, [open]);

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages, isSending, open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeChat();
        launcherRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const selectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];
      const focusable = Array.from(panelRef.current.querySelectorAll(selectors.join(','))).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash === '#contact') {
      const timer = window.setTimeout(() => {
        const target = document.getElementById('contact');
        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }, prefersReducedMotion ? 0 : 180);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [location.pathname, location.hash, prefersReducedMotion]);

  useEffect(() => () => clearAutoNavigateTimer(), []);

  const panel = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="ai-agent-backdrop"
            aria-label="Close AI assistant"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={closeChat}
          />
          <motion.section
            ref={panelRef}
            className="ai-agent-panel card-3d"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-agent-title"
            aria-describedby="ai-agent-description"
            initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ai-agent-panel-shell">
              <div className="ai-agent-header">
                <div className="ai-agent-title-wrap">
                  <span className="ai-agent-orb" aria-hidden="true">
                    <Icon name="sparkles" size={13} />
                  </span>
                  <div>
                    <p className="ai-agent-eyebrow">AI Agent</p>
                    <h3 id="ai-agent-title">Portfolio Assistant</h3>
                  </div>
                </div>
                <div className="ai-agent-status">
                  <span className="ai-agent-status-dot" />
                  <span>Online</span>
                </div>
                <button
                  type="button"
                  className="ai-agent-close"
                  onClick={closeChat}
                  aria-label="Close AI assistant"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>

              <div className="ai-agent-body">
                <div className="ai-agent-messages" ref={messageListRef} aria-live="polite" id="ai-agent-description">
                  {messages.map((message) => {
                    const isUser = message.role === 'user';
                    return (
                      <motion.div
                        key={message.id}
                        className={`ai-agent-message ${isUser ? 'is-user' : 'is-assistant'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                      >
                        {!isUser ? (
                          <span className="ai-agent-avatar" aria-hidden="true">
                            CP
                          </span>
                        ) : null}
                        <div className="ai-agent-bubble">
                          <p>{message.text}</p>
                          {Array.isArray(message.actions) && message.actions.length ? (
                            <div className="ai-agent-actions">
                              {message.actions.map((action) => (
                                <button
                                  key={action.label}
                                  type="button"
                                  className="ai-agent-action"
                                  onClick={() => handleMessageAction(action.href)}
                                >
                                  <Icon
                                    name={action.href.startsWith('mailto:') || action.href.startsWith('tel:') ? 'mail' : 'arrowUpRight'}
                                    size={12}
                                  />
                                  <span>{action.label}</span>
                                </button>
                              ))}
                            </div>
                          ) : null}
                          {!isUser && Array.isArray(message.chips) && message.chips.length ? (
                            <div className="ai-agent-chips">
                              {message.chips.map((prompt) => (
                                <button
                                  key={prompt.id}
                                  type="button"
                                  className="ai-agent-chip"
                                  onClick={() => handleQuickPrompt(prompt)}
                                >
                                  {prompt.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}

                  {isSending ? (
                    <motion.div
                      className="ai-agent-message is-assistant"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    >
                      <span className="ai-agent-avatar" aria-hidden="true">
                        CP
                      </span>
                      <div className="ai-agent-bubble ai-agent-bubble-typing" aria-label="Assistant is typing">
                        <span className="ai-agent-typing">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </div>

                <form className="ai-agent-composer" onSubmit={handleSubmit}>
                  <label className="sr-only" htmlFor="ai-agent-input">
                    Ask the AI assistant
                  </label>
                  <input
                    ref={inputRef}
                    id="ai-agent-input"
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about services, pricing, projects, or contact..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <button type="submit" className="ai-agent-send" disabled={!draft.trim() || isSending}>
                    <Icon name="send" size={15} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(
    <div className={`ai-agent-launcher-shell ${open ? 'is-open' : ''}`}>
      {panel}
      <button
        ref={launcherRef}
        type="button"
        className="ai-agent-launcher"
        onClick={open ? closeChat : openChat}
        aria-expanded={open}
        aria-controls="ai-agent-title"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      >
        <span className="ai-agent-launcher-glow" aria-hidden="true" />
        <span className="ai-agent-launcher-icon" aria-hidden="true">
          <Icon name={open ? 'close' : 'sparkles'} size={22} />
        </span>
        <span className="ai-agent-launcher-copy">
          <strong>AI Agent</strong>
          <small>{open ? 'Close chat' : 'Ask me anything'}</small>
        </span>
      </button>
    </div>,
    document.body,
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function useTypewriter(items, typingSpeed = 75, pause = 2200) {
  const [itemIndex, setItemIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const word = items[itemIndex];
    let delay = typingSpeed;

    if (!deleting && characterIndex === word.length) delay = pause;
    if (deleting) delay = typingSpeed / 2;

    const timer = window.setTimeout(() => {
      if (!deleting && characterIndex < word.length) {
        setCharacterIndex((value) => value + 1);
      } else if (!deleting && characterIndex === word.length) {
        setDeleting(true);
      } else if (deleting && characterIndex > 0) {
        setCharacterIndex((value) => value - 1);
      } else {
        setDeleting(false);
        setItemIndex((value) => (value + 1) % items.length);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [characterIndex, deleting, itemIndex, items, pause, reducedMotion, typingSpeed]);

  return reducedMotion ? items[0] : items[itemIndex].slice(0, characterIndex);
}

function Reveal({ as: Tag = 'div', className = '', children, threshold = 0.1 }) {
  const prefersReducedMotion = useFramerReducedMotion();
  const MotionTag = Tag === 'section' ? motion.section : Tag === 'article' ? motion.article : motion.div;

  return (
    <MotionTag
      className={`reveal ${className}`.trim()}
      style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={revealMotion}
    >
      {children}
    </MotionTag>
  );
}

function usePortfolioContent() {
  const [content, setContent] = useState(emptyPortfolioContent);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await apiRequest('/api/content/portfolio');
        if (!active || !response?.ok) return;
        setContent({
          projects: response.projects ?? [],
          experience: response.experience ?? [],
          education: response.education ?? [],
          certificates: response.certificates ?? [],
          techStacks: response.techStacks ?? [],
        });
      } catch (error) {
        void error;
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return content;
}

function usePricingContent() {
  const [services, setServices] = useState(emptyPricingServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await apiRequest('/api/content/pricing');
        if (!active || !response?.ok) return;
        setServices(Array.isArray(response.pricingServices) ? response.pricingServices : []);
      } catch (error) {
        void error;
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { services, loading };
}

function SectionHeading({ index, title, accent, description, align = 'center' }) {
  return (
    <motion.div
      className={`section-heading section-heading-${align}`}
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
    >
      <motion.p variants={sectionHeadingItem}>{index}</motion.p>
      <motion.h2 variants={sectionHeadingItem}>
        {title} <span className="gradient-text">{accent}</span>
      </motion.h2>
      {description ? (
        <motion.div className="section-description" variants={sectionHeadingItem}>
          {description}
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function Brand() {
  return (
    <span className="brand">
      <span>Chamuditha Perera</span>
    </span>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  const getNavHref = (href) => (href.startsWith('#') && location.pathname !== '/' ? `/${href}` : href);
  const homeHref = location.pathname === '/' ? '#hero' : '/#hero';
  const contactHref = getNavHref('#contact');
  const isActiveItem = (item) =>
    item.href.startsWith('#') ? location.pathname === '/' && active === item.href : location.pathname === item.href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActive('');
      return undefined;
    }

    if (!('IntersectionObserver' in window)) return undefined;
    const sections = navItems
      .filter((item) => item.href.startsWith('#'))
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-20% 0px -65%', threshold: [0.05, 0.25] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  const renderNavItem = (item, className = '') => {
    const resolvedHref = getNavHref(item.href);
    const activeClass = isActiveItem(item) ? 'active' : '';
    const combinedClassName = `${className} ${activeClass}`.trim();

    if (item.href.startsWith('/')) {
      return (
        <Link
          key={item.href}
          className={combinedClassName}
          to={item.href}
          onClick={() => {
            setActive('');
            setOpen(false);
          }}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <a
        key={item.href}
        className={combinedClassName}
        href={resolvedHref}
        onClick={() => {
          setActive(item.href);
          setOpen(false);
        }}
      >
        {item.label}
      </a>
    );
  };

  return (
    <nav className={`top-nav ${scrolled ? 'top-nav-scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav-inner">
        <a href={homeHref} aria-label="Chamuditha Perera home">
          <Brand />
        </a>

        <div className="desktop-nav">
          {navItems.map((item) => renderNavItem(item))}
        </div>

        <a className="hire-button" href={contactHref}>
          Hire Me
        </a>

        <button
          type="button"
          className="menu-button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'close' : 'menu'} size={18} />
        </button>
      </div>

      {open ? (
        <div id="mobile-navigation" className="mobile-nav">
          {navItems.map((item) => renderNavItem(item))}
          <a href={contactHref} className="mobile-hire" onClick={() => setOpen(false)}>
            Hire Me
          </a>
        </div>
      ) : null}
    </nav>
  );
}

function SocialLink({ icon, label, href }) {
  const external = href.startsWith('http');
  return (
    <a
      className="social-button"
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <Icon name={icon} size={17} />
    </a>
  );
}

function ShowcaseIdentity() {
  return (
    <div className="hero-showcase" aria-hidden="true">
      <div className="hero-showcase-aura hero-showcase-aura-a" />
      <div className="hero-showcase-aura hero-showcase-aura-b" />
      <div className="hero-showcase-panel">
        <picture>
          <source srcSet={withBase('/assets/imgs/header/coding-hero-v2.webp')} type="image/webp" />
          <img
            className="hero-showcase-image"
            src={withBase('/assets/imgs/header/coding-hero-v2.png')}
            alt=""
            loading="eager"
            decoding="async"
          />
        </picture>
        <span className="hero-showcase-sheen" />
      </div>
      <span className="hero-showcase-orb hero-showcase-orb-a" />
      <span className="hero-showcase-orb hero-showcase-orb-b" />
      <span className="hero-showcase-grid" />
    </div>
  );
}

function FloatingTechBadge({ badge }) {
  const prefersReducedMotion = useFramerReducedMotion();
  const badgeMotion = prefersReducedMotion
    ? undefined
    : {
        x: [0, 8, 0, -6, 0],
        y: [0, -12, 0, 10, 0],
        rotate: [-3, 4, -2, 5, -3],
        scale: [1, 1.04, 1, 1.02, 1],
      };

  const BadgeTag = prefersReducedMotion ? 'div' : motion.div;

  return (
    <BadgeTag
      className={`hero-tech-badge ${badge.className}`.trim()}
      style={badge.style}
      aria-hidden="true"
      {...(prefersReducedMotion
        ? {}
        : {
            animate: badgeMotion,
            transition: {
              duration: badge.motion.duration,
              delay: badge.motion.delay,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            },
          })}
    >
      <span className="hero-tech-badge-shell">
        <StackGlyph stack={badge.stack} size={14} decorative className="hero-tech-badge-glyph" />
      </span>
    </BadgeTag>
  );
}

function Hero() {
  const prefersReducedMotion = useFramerReducedMotion();
  const { scrollY } = useScroll();
  const role = useTypewriter(roles);
  const copyYOffset = useSpring(useTransform(scrollY, [0, 700], [0, -20]), {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });
  const visualYOffset = useSpring(useTransform(scrollY, [0, 700], [0, -46]), {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  return (
    <section id="hero" className="hero-section hero-reference">
      <div className="hero-grid-mask" aria-hidden="true" />
      <div className="hero-glow hero-glow-a" aria-hidden="true" />
      <div className="hero-glow hero-glow-b" aria-hidden="true" />

      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={prefersReducedMotion ? undefined : { y: copyYOffset }}
        >
          <div>
            <p className="hero-eyebrow">Hello, I'm</p>
            <h1>
              <span>Chamuditha</span>
              <span>Perera</span>
            </h1>

            <div className="role-line" aria-live="polite">
              {role}
              <span className="cursor-blink">|</span>
            </div>
          </div>

          <p className="hero-description">
            Chamuditha Perera is a mobile-focused software engineer in Sri Lanka crafting{' '}
            <strong>end-to-end mobile, web & backend systems</strong>. I turn ideas into production-ready software
            with <span className="flutter-text">Flutter</span>, <span className="react-text">React</span>, and{' '}
            <span className="spring-text">Spring Boot</span>, with a strong eye for UI/UX and performance.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#projects">
              View My Work <Icon name="arrowDown" size={15} />
            </a>
            <a className="secondary-button" href="#contact">
              Get In Touch <Icon name="arrowUpRight" size={15} />
            </a>
          </div>

          <div className="hero-meta-row">
            <div className="social-row" aria-label="Social links">
              <SocialLink icon="github" label="GitHub" href={`https://github.com/${profile.github}`} />
              <SocialLink icon="linkedin" label="LinkedIn" href={`https://linkedin.com/in/${profile.linkedin}`} />
              <SocialLink icon="whatsapp" label="WhatsApp" href={whatsappUrl} />
              <SocialLink icon="mail" label="Email" href={`mailto:${profile.email}`} />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.985 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={prefersReducedMotion ? undefined : { y: visualYOffset }}
        >
          <div className="hero-tech-badges" aria-hidden="true">
            {heroFloatingTechBadges.map((badge) => (
              <FloatingTechBadge key={badge.key} badge={badge} />
            ))}
          </div>
          <ShowcaseIdentity />
          <span className="floating-label floating-label-b">
            <Icon name="sparkles" size={12} /> Available
          </span>
          <div className="hero-stats">
            {[
              ['35+', 'Projects'],
              ['3y+', 'Experience'],
              ['20+', 'Technologies'],
            ].map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="hero-marquee" aria-label="Technology stack">
        <div className="hero-marquee-track">
          {[...heroTechnologies, ...heroTechnologies].map((technology, index) => (
            <span key={`${technology}-${index}`}>
              {technology} <i>/</i>
            </span>
          ))}
        </div>
      </div>

      <a className="scroll-hint" href="#about">
        <span>Scroll</span>
        <span className="scroll-mouse">
          <i />
        </span>
      </a>
    </section>
  );
}

const contactItems = [
  { icon: 'mail', label: profile.email, href: `mailto:${profile.email}` },
  { icon: 'phone', label: profile.phone, href: `tel:${profile.phone}` },
  { icon: 'whatsapp', label: 'WhatsApp', href: whatsappUrl },
  { icon: 'pin', label: profile.address },
  { icon: 'github', label: `github/${profile.github}`, href: `https://github.com/${profile.github}` },
  { icon: 'linkedin', label: `in/${profile.linkedin}`, href: `https://linkedin.com/in/${profile.linkedin}` },
  { icon: 'external', label: profile.portfolio, href: profile.portfolio },
];

function ContactItem({ item }) {
  const content = (
    <>
      <span className="contact-icon">
        <Icon name={item.icon} size={15} />
      </span>
      <span>{item.label}</span>
    </>
  );
  if (!item.href) return <div className="contact-item">{content}</div>;
  const external = item.href.startsWith('http');
  return (
    <a
      className="contact-item"
      href={item.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  );
}

function About() {
  return (
    <section id="about" className="section section-about">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <SectionHeading index="01. Who I Am" title="About" accent="Me" />
        <div className="about-grid">
          <div className="about-main">
            <div className="about-copy">
              <p>
                I'm <strong>Chamuditha Perera</strong>, a mobile-focused Software Engineer with a BSc in Information
                Technology from the University of Jaffna. I specialise in building end-to-end mobile, web, and
                backend systems using full-stack and microservices architectures.
              </p>
              <p>
                My core strengths are <span className="flutter-text">Flutter (Dart)</span> for Android/iOS and{' '}
                <span className="react-text">React + TypeScript</span> for the web. On the backend I work extensively
                with <span className="spring-text">Java, Spring Boot</span>, JWT auth, Redis, WebSocket, and
                relational/NoSQL databases.
              </p>
              <p>
                Skilled in Firebase, Google Maps APIs, MQTT, and AWS (S3, EKS). Hands-on with{' '}
                <strong>Docker, Kubernetes, Helm, NGINX</strong>, and GitHub Actions CI/CD for production-grade
                deployments.
              </p>
            </div>

            <div className="metric-grid">
              {[
                ['35+', 'Projects'],
                ['3y+', 'Yrs Experience'],
                ['20+', 'Technologies'],
              ].map(([value, label]) => (
                <div key={label} className="metric card-3d">
                  <strong className="gradient-text">{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="info-panel">
            <div className="panel-title">Contact Information</div>
            <div className="info-list">
              {contactItems.map((item) => (
                <ContactItem key={item.label} item={item} />
              ))}
            </div>
          </aside>
        </div>
      </Reveal>
    </section>
  );
}

function Experience({ experienceItems = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeExperience = Array.isArray(experienceItems) ? experienceItems : [];
  const hasExperience = safeExperience.length > 0;

  useEffect(() => {
    if (!hasExperience) {
      if (activeIndex !== 0) {
        setActiveIndex(0);
      }
      return;
    }

    if (activeIndex >= safeExperience.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, hasExperience, safeExperience.length]);

  const activeJob = hasExperience ? safeExperience[activeIndex] : null;
  const showPrevious = () => {
    if (!hasExperience) return;
    setActiveIndex((current) => (current - 1 + safeExperience.length) % safeExperience.length);
  };
  const showNext = () => {
    if (!hasExperience) return;
    setActiveIndex((current) => (current + 1) % safeExperience.length);
  };

  return (
    <section id="experience" className="section section-experience experience-reference">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <SectionHeading index="02. Where I've Worked" title="Work" accent="Experience" />
        <div className="experience-shell">
          {hasExperience ? (
            <>
              <div className="experience-steps" aria-label="Work experience timeline">
                <span className="experience-step-line" aria-hidden="true" />
                {safeExperience.map((job, index) => {
                  const selected = index === activeIndex;
                  const completed = index < activeIndex;
                  return (
                    <button
                      key={`${job.role}-${job.period}`}
                      type="button"
                      className={`experience-step ${selected ? 'is-active' : ''} ${completed ? 'is-complete' : ''}`}
                      aria-pressed={selected}
                      aria-label={`${String(job.period || '').split('—')[0].trim()} ${String(job.org || '').split('—')[0].trim()}`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <span className="experience-step-dot">
                        {selected ? <Icon name="briefcase" size={14} /> : index + 1}
                      </span>
                      <span className="experience-step-label">
                        <strong>{String(job.period || '').split('—')[0].trim()}</strong>
                        <small>{String(job.org || '').split('—')[0].trim()}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="experience-card-glow">
                <article key={activeIndex} className="experience-card card-3d" aria-live="polite">
                  <span className="experience-card-accent" />
                  <div className="experience-card-body">
                    <div className="experience-card-header">
                      <div className="experience-role">
                        <span className="experience-role-icon">
                          <Icon name="briefcase" size={18} />
                        </span>
                        <div>
                          <div className="experience-title-line">
                            <h3>{activeJob.role}</h3>
                            {activeJob.current ? (
                              <span className="current-badge">
                                <i /> Current
                              </span>
                            ) : null}
                          </div>
                          <p>{activeJob.org}</p>
                        </div>
                      </div>
                      <span className="experience-period">
                        <Icon name="calendar" size={12} /> {activeJob.period}
                      </span>
                    </div>

                    <p className="experience-description">{activeJob.detail}</p>

                    <div className="tag-row experience-tags">
                      {(Array.isArray(activeJob.tags) ? activeJob.tags : []).map((tag) => (
                        <span key={tag} className="tech-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="experience-card-footer">
                      <div className="experience-count">
                        <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
                        <span>/</span>
                        <small>{String(safeExperience.length).padStart(2, '0')}</small>
                        <em>· {String(activeJob.org || '').split('—')[0].trim()}</em>
                      </div>
                      <div className="experience-controls">
                        <button type="button" aria-label="Previous" onClick={showPrevious}>
                          <Icon name="arrowLeft" size={15} />
                        </button>
                        <button type="button" aria-label="Next" onClick={showNext}>
                          <Icon name="arrowRight" size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <p className="experience-help">
                <Icon name="pin" size={11} /> Click any step above to navigate through roles
              </p>
            </>
          ) : (
            <div className="experience-card-glow">
              <article className="experience-card card-3d" aria-live="polite">
                <span className="experience-card-accent" />
                <div className="experience-card-body">
                  <div className="experience-card-header">
                    <div className="experience-role">
                      <span className="experience-role-icon">
                        <Icon name="briefcase" size={18} />
                      </span>
                      <div>
                        <div className="experience-title-line">
                          <h3>Work experience will appear here</h3>
                        </div>
                        <p>Add your roles from the admin dashboard.</p>
                      </div>
                    </div>
                  </div>

                  <p className="experience-description">
                    The timeline is now powered by Supabase. Once you add your experience rows in the admin UI, they will show up here automatically.
                  </p>
                </div>
              </article>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function ProjectCard({ project, featured = false, onOpen, index = 0 }) {
  const prefersReducedMotion = useFramerReducedMotion();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(project);
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      className={`${featured ? 'featured-project' : 'project-card'} project-card-button card-3d`}
      aria-label={`Open details for ${project.title}`}
      onClick={() => onOpen(project)}
      onKeyDown={handleKeyDown}
      initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.985 }}
      whileInView={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? undefined : { y: -8 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
    >
      <div className="project-image">
        <img src={withBase(project.image)} alt={project.title} />
        <div className="project-image-wash" />
        <span className="project-status">
          <span /> Completed
        </span>
      </div>
      <div className="project-copy">
        <div>
          <p className="project-overline">Portfolio Project</p>
          <h3>{project.title}</h3>
          <p className="project-role">{project.category}</p>
        </div>
        <p className="project-summary">{project.summary}</p>
        <div className="project-bottom">
          <div className="tag-row">
            {project.tags.map((tag) => (
              <span key={tag} className="tech-tag colorful-tag">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card-cta"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Icon name="sparkles" size={12} />
            <span>View project</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  const prefersReducedMotion = useFramerReducedMotion();
  useEffect(() => {
    if (!project) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, project]);

  if (!project) {
    return null;
  }

  const modalId = `project-modal-title-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <motion.div
      className="project-modal-backdrop"
      role="presentation"
      onClick={onClose}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
      exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <motion.article
        className="project-modal card-3d"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalId}
        onClick={(event) => event.stopPropagation()}
        initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      >
        <button type="button" className="project-modal-close" aria-label="Close project details" onClick={onClose}>
          <Icon name="close" size={18} />
        </button>

        <div className="project-modal-visual">
          <img src={withBase(project.image)} alt={project.title} />
          <div className="project-image-wash" />
          <span className="project-status">
            <span /> Detailed preview
          </span>
        </div>

        <div className="project-modal-copy">
          <p className="project-overline">Project Detail</p>
          <div className="project-modal-title-row">
            <div>
              <h3 id={modalId}>{project.title}</h3>
              <p className="project-role">{project.category}</p>
            </div>
            <span className="project-modal-pill">{project.featuredNote}</span>
          </div>

          <p className="project-modal-summary">{project.summary}</p>

          <div className="project-modal-grid">
            <div className="project-modal-block">
              <h4>Highlights</h4>
              <ul>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="project-modal-block">
              <h4>Stack</h4>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag} className="tech-tag colorful-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <h4>Links</h4>
              <div className="project-modal-links">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <Icon name="external" size={13} /> Open project post
                </a>
                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                  <Icon name="github" size={13} /> GitHub profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
    ,
    document.body,
  );
}

function CertificationModal({ certificate, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const modalId = `cert-modal-title-${certificate.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] grid place-items-center p-6 bg-black/80 backdrop-blur-md"
      role="presentation"
      onClick={onClose}
    >
      <motion.article
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] card-3d"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-3 right-3 z-10 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-full border border-slate-800 transition-colors"
          aria-label="Close certification details"
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>

        <div className="relative h-56 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {certificate.image ? (
            <img src={withBase(certificate.image)} alt={certificate.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Icon name="certificate" size={24} />
              <span className="text-sm">No certificate image yet</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">Certification Detail</p>
            <div className="flex items-start justify-between gap-4 mt-1">
              <div>
                <h3 id={modalId} className="text-lg font-bold text-white leading-snug">{certificate.title}</h3>
                <p className="text-sm text-slate-400 mt-0.5">{certificate.org}</p>
              </div>
              <span className="flex-shrink-0 px-2.5 py-1 text-[10px] font-mono text-blue-300 bg-blue-950/40 border border-blue-900/30 rounded-full">
                {certificate.year}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{certificate.detail}</p>

          <div className="pt-2 border-t border-slate-800/60">
            <span className="inline-block px-3 py-1 text-xs font-medium text-blue-400 bg-blue-950/20 border border-blue-900/20 rounded-full">
              Learning milestone
            </span>
          </div>
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  );
}

function Projects({ mode = 'home', projectsData = [] }) {
  const [activeProject, setActiveProject] = useState(null);
  const safeProjects = Array.isArray(projectsData) ? projectsData : [];
  const projectItems = mode === 'page' ? safeProjects : safeProjects.slice(0, 6);
  const headingTitle = mode === 'page' ? 'All' : 'Featured';
  const sectionClassName = `section section-projects ${mode === 'page' ? 'projects-page-grid' : ''}`.trim();

  return (
    <section id="projects" className={sectionClassName}>
      <div className="section-divider" />
      <Reveal className="section-inner">
        {mode === 'page' ? (
          <div className="projects-page-header">
            <SectionHeading
              index="03. What I've Built"
              title={headingTitle}
              accent="Projects"
              align="left"
              description="Browse every project featured on the portfolio. Click any card to open a detailed preview."
            />
            <Link className="projects-back-button" to="/">
              <Icon name="arrowLeft" size={14} />
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="projects-heading">
            <SectionHeading index="03. What I've Built" title={headingTitle} accent="Projects" align="left" />
            <Link className="projects-more-button" to="/projects">
              More Projects
              <Icon name="arrowRight" size={14} />
            </Link>
          </div>
        )}
        {projectItems.length ? (
          <div className={`project-grid ${mode === 'page' ? 'project-grid-page' : ''}`}>
            {projectItems.map((project, index) => (
              <ProjectCard key={project.id || project.title} project={project} onOpen={setActiveProject} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-content-state">
            <h3>No projects yet</h3>
            <p>Add a project in the admin panel to populate this section.</p>
          </div>
        )}
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      </Reveal>
    </section>
  );
}

function ProjectsPage() {
  const portfolioContent = usePortfolioContent();

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    try {
      window.scrollTo(0, 0);
    } catch (error) {
      void error;
    }
  }, []);

  return (
    <div className="bolt-shell projects-page-shell">
      <Helmet>
        <title>{projectsPageTitle}</title>
        <meta name="description" content={projectsPageDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="author" content={siteName} />
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href={`${siteUrl}/projects`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/projects`} />
        <meta property="og:title" content={projectsPageTitle} />
        <meta property="og:description" content={projectsPageDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1536" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:alt" content={socialImageAlt} />
        <meta property="og:site_name" content={siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={projectsPageTitle} />
        <meta name="twitter:description" content={projectsPageDescription} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="twitter:image:alt" content={socialImageAlt} />
        <meta name="theme-color" content="#00020a" />
        <link rel="icon" type="image/png" sizes="96x96" href={siteLogo} />
        <link rel="shortcut icon" type="image/x-icon" href={siteIcon} sizes="any" />
        <link rel="apple-touch-icon" href={siteTouchIcon} />
      </Helmet>
      <Navigation />
      <main>
        <Projects mode="page" projectsData={portfolioContent.projects} />
      </main>
      <FloatingContactMenu />
    </div>
  );
}

function GalaxyCanvas({ variant = 'disc' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return undefined;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext?.('2d');

    if (!canvas || !context) {
      return undefined;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frameId = 0;
    let tick = 0;
    const particles = [];
    const stars = [];

    const build = () => {
      particles.length = 0;

      for (let index = 0; index < GALAXY_PARTICLE_COUNT; index += 1) {
        const arm = index % GALAXY_ARMS;
        const distance = Math.random() ** 0.6;
        const spread = (Math.random() - 0.5) * (0.35 + distance * 0.5);
        const angle = (arm / GALAXY_ARMS) * Math.PI * 2 + distance * 3.4 + spread;

        particles.push({
          radius: 0.08 + distance * 0.92,
          angle,
          z: (Math.random() - 0.5) * (0.1 - distance * 0.06),
          size: Math.random() * 2.4 + 0.7,
          hue: 205 + Math.random() * 60,
          speed: 0.22 / (0.25 + distance),
        });
      }

      stars.length = 0;
      const starCount = variant === 'stars' ? Math.round((width * height) / 5000) : 0;

      for (let index = 0; index < starCount; index += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = () => {
      tick += 0.0016;
      context.clearRect(0, 0, width, height);

      if (variant === 'stars') {
        stars.forEach((star) => {
          star.phase += 0.02;
          context.globalAlpha = 0.2 + 0.5 * (0.5 + 0.5 * Math.sin(star.phase));
          context.fillStyle = '#cfe4ff';
          context.beginPath();
          context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          context.fill();
        });

        context.globalAlpha = 1;
        frameId = window.requestAnimationFrame(draw);
        return;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const galaxyRadius = Math.min(width * 0.46, height * 0.85);
      const tilt = 1.05;
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);
      const perspective = 1400;
      const coreGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, galaxyRadius * 0.5);

      coreGradient.addColorStop(0, 'rgba(200, 230, 255, 0.9)');
      coreGradient.addColorStop(0.25, 'rgba(110, 160, 255, 0.45)');
      coreGradient.addColorStop(1, 'rgba(20, 40, 110, 0)');

      context.fillStyle = coreGradient;
      context.beginPath();
      context.arc(centerX, centerY, galaxyRadius * 0.5, 0, Math.PI * 2);
      context.fill();

      context.globalCompositeOperation = 'lighter';

      particles.forEach((particle) => {
        const angle = particle.angle + tick * particle.speed * 6;
        const x = Math.cos(angle) * particle.radius * galaxyRadius;
        const flatZ = Math.sin(angle) * particle.radius * galaxyRadius;
        const flatY = particle.z * galaxyRadius;
        const y = flatY * cosTilt - flatZ * sinTilt;
        const z = flatY * sinTilt + flatZ * cosTilt;
        const scale = perspective / (perspective - z);
        const depth = (z / galaxyRadius + 1) / 2;
        const pointX = centerX + x * scale;
        const pointY = centerY + y * scale;

        context.fillStyle = `hsla(${particle.hue}, 90%, ${62 + depth * 18}%, ${0.35 + depth * 0.65})`;
        context.beginPath();
        context.arc(pointX, pointY, particle.size * scale, 0, Math.PI * 2);
        context.fill();
      });

      context.globalCompositeOperation = 'source-over';
      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className="galaxy-canvas" aria-hidden="true" />;
}

function useGalaxyPoints(count) {
  return useMemo(() => {
    if (count <= 0) {
      return [];
    }

    const points = [];
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < count; index += 1) {
      const y = index * offset - 1 + offset / 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = index * increment;
      points.push({ x: Math.cos(phi) * radius, y, z: Math.sin(phi) * radius });
    }

    return points;
  }, [count]);
}

function StackGlyph({ stack, size = 24, decorative = false, className = '' }) {
  const ariaProps = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': `${stack.label} logo` };
  const hasCustomSvg = Boolean(stack.customSvgPath);

  return (
    <span
      className={`stack-glyph ${hasCustomSvg ? 'has-svg' : stack.icon ? 'has-icon' : 'has-monogram'} ${className}`.trim()}
      style={{
        width: size,
        height: size,
        color: stack.glyphColor,
        '--stack-surface': stack.surface,
        boxShadow: `0 0 0 1px ${stack.glyphColor}22, 0 0 18px 3px ${stack.glyphColor}18`,
      }}
      {...ariaProps}
    >
      {hasCustomSvg ? (
        <svg className="stack-glyph-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={stack.customSvgPath} fill="currentColor" />
        </svg>
      ) : stack.icon ? (
        <svg className="stack-glyph-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={stack.icon.path} fill="currentColor" />
        </svg>
      ) : (
        <span className="stack-monogram" aria-hidden="true">
          {stack.monogram}
        </span>
      )}
    </span>
  );
}

function TechPlanet({ stack, nodeRef, onHover, onLeave }) {
  const glyphSize = Math.max(20, Math.round(stack.size * 0.54));

  return (
    <button
      type="button"
      ref={nodeRef}
      className="skill-planet"
      title={stack.label}
      aria-label={stack.label}
      onMouseEnter={() => onHover(stack)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(stack)}
      onBlur={onLeave}
      style={{
        '--stack-accent': stack.glyphColor,
        '--node-surface': stack.surface,
        '--node-border': stack.ringColor,
      }}
    >
      <span className="skill-node-card" aria-hidden="true">
        <span className="skill-planet-glow" />
        <StackGlyph stack={stack} size={glyphSize} decorative className="stack-glyph--planet" />
      </span>
      <span className="planet-label" aria-hidden="true">
        {stack.label}
      </span>
    </button>
  );
}

function SolarSystem({ running, orbitGroups = [] }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const motionState = useRef({ rotationX: -0.2, rotationY: 0, velocityX: 0, velocityY: 0.0022, dragging: false, x: 0, y: 0 });
  const [activeLabel, setActiveLabel] = useState(null);
  const [radius, setRadius] = useState(220);

  const planets = useMemo(
    () =>
      orbitGroups.flatMap((group, orbitIndex) =>
        group.items.map((item, itemIndex) => {
          const iconHex = item.icon?.hex ? `#${item.icon.hex}` : null;
          const glyphColor = item.glyphColor || getReadableIconColor(iconHex, group.accent);

          return {
            ...item,
            id: item.id || `${slugify(group.label)}-${slugify(item.label)}-${itemIndex}`,
            category: group.label,
            orbitLabel: group.legendLabel,
            orbitIndex,
            orbitRadius: group.orbitRadius,
            size: group.planetSize,
            speed: group.speed,
            startOffset: group.startOffset,
            surface: group.surface,
            ringColor: group.ringColor,
            accent: group.accent,
            iconHex,
            glyphColor,
          };
        }),
      ),
    [orbitGroups],
  );

  const points = useGalaxyPoints(planets.length);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    const measure = () => setRadius(Math.min(node.clientWidth, node.clientHeight) * 0.38);
    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return undefined;
    }

    let frameId = 0;
    let time = 0;
    const perspective = 900;
    const targetVelocity = 0.0022;

    const updateNodes = () => {
      const state = motionState.current;

      if (running && !state.dragging) {
        state.rotationY += state.velocityY;
        state.rotationX += state.velocityX;
        state.velocityX *= 0.95;
        state.velocityY += (targetVelocity - state.velocityY) * 0.03;
      }

      state.rotationX = Math.max(-0.9, Math.min(0.9, state.rotationX));
      time += running ? 0.01 : 0;

      const wobble = Math.sin(time * 0.4) * 0.18;
      const cosY = Math.cos(state.rotationY);
      const sinY = Math.sin(state.rotationY);
      const cosX = Math.cos(state.rotationX + wobble);
      const sinX = Math.sin(state.rotationX + wobble);

      points.forEach((point, index) => {
        const node = nodeRefs.current[index];
        const planet = planets[index];

        if (!node || !planet) {
          return;
        }

        const x1 = point.x * cosY - point.z * sinY;
        const z1 = point.x * sinY + point.z * cosY;
        const y2 = point.y * cosX - z1 * sinX;
        const z2 = point.y * sinX + z1 * cosX;
        const x = x1 * radius;
        const y = y2 * radius;
        const z = z2 * radius;
        const nodeScale = perspective / (perspective - z);
        const depth = (z2 + 1) / 2;
        const bob = Math.sin(time * 1.2 + index) * 3;

        node.style.transform = `translate3d(calc(${x}px - 50%), calc(${y + bob}px - 50%), 0) scale(${nodeScale})`;
        node.style.opacity = String(0.22 + depth * 0.78);
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.filter = `blur(${(1 - depth) * 2.2}px) saturate(${0.5 + depth}) brightness(${0.7 + depth * 0.6})`;
      });

      frameId = window.requestAnimationFrame(updateNodes);
    };

    frameId = window.requestAnimationFrame(updateNodes);

    return () => window.cancelAnimationFrame(frameId);
  }, [planets, points, radius, running]);

  const handlePointerDown = (event) => {
    const state = motionState.current;
    state.dragging = true;
    state.x = event.clientX;
    state.y = event.clientY;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const state = motionState.current;

    if (!state.dragging) {
      return;
    }

    const deltaX = event.clientX - state.x;
    const deltaY = event.clientY - state.y;
    state.x = event.clientX;
    state.y = event.clientY;
    state.rotationY += deltaX * 0.006;
    state.rotationX -= deltaY * 0.005;
    state.velocityY = deltaX * 0.006;
    state.velocityX = -deltaY * 0.005;
  };

  const endDrag = () => {
    motionState.current.dragging = false;
  };

  return (
    <div className="solar-stage">
      <div
        ref={containerRef}
        className="solar-system"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        aria-label="Interactive 3D galaxy showing technical skills"
      >
        <GalaxyCanvas variant="disc" />
        <div className="galaxy-core galaxy-core-large" aria-hidden="true" />
        <div className="galaxy-core galaxy-core-small" aria-hidden="true" />
        <div className="galaxy-rings" aria-hidden="true">
          {orbitGroups.map((group, index) => (
            <span
              key={`${group.label}-${index}`}
              className={`orbit-line orbit-line-${index === 0 ? 'slow' : index === 1 ? 'mid' : 'fast'}`}
              style={{
                width: `${Math.max(36, 100 - index * 24)}%`,
                height: `${Math.max(36, 100 - index * 24)}%`,
                borderColor: group.ringColor,
              }}
            />
          ))}
        </div>
        <div className="solar-core" />
        <div className="galaxy-node-layer">
          {planets.map((planet, index) => (
          <TechPlanet
            key={planet.id}
            nodeRef={(node) => {
              nodeRefs.current[index] = node;
            }}
            stack={planet}
            onHover={(stack) => setActiveLabel(stack.label)}
            onLeave={() => setActiveLabel(null)}
          />
          ))}
        </div>
        <p className="galaxy-status" aria-live="polite">
          {activeLabel ?? 'Drag to spin the galaxy'}
        </p>
      </div>
    </div>
  );
}

function Skills({ techStacks = [] }) {
  const [revealRef, visible] = useInView(0.1);
  const [running, setRunning] = useState(false);
  const orbitGroups = useMemo(() => buildTechStackOrbits(techStacks), [techStacks]);
  const hasTechStacks = orbitGroups.some((group) => Array.isArray(group.items) && group.items.length > 0);

  useEffect(() => {
    if (visible) setRunning(true);
  }, [visible]);

  return (
    <section id="skills" className="section section-skills skills-reference">
      <div className="section-divider" />
      <div className="nebula nebula-a" aria-hidden="true" />
      <div className="nebula nebula-b" aria-hidden="true" />
      <GalaxyCanvas variant="stars" />
      <div ref={revealRef} className={`section-inner reveal ${visible ? 'is-visible' : ''}`}>
        <SectionHeading
          index="04. What I Know"
          title="Technical"
          accent="Skills"
        />
        <div className="skills-layout">
          {hasTechStacks ? (
            <SolarSystem running={running} orbitGroups={orbitGroups} />
          ) : (
            <div className="empty-content-state">
              <h3>No tech stacks yet</h3>
              <p>Add tech stacks in the admin panel to show them here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Education({ educationItems = [], certificateItems = [] }) {
  const [activeEducationIndex, setActiveEducationIndex] = useState(0);
  const [activeCertificate, setActiveCertificate] = useState(null);

  const handleCertKeyDown = (event, cert) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveCertificate(cert);
    }
  };
  const certificationRailRef = useRef(null);

  const slideRail = (railRef, direction) => {
    if (!railRef.current) {
      return;
    }

    const distance = Math.max(320, Math.round(railRef.current.clientWidth * 0.84));
    railRef.current.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  const safeEducation = Array.isArray(educationItems) ? educationItems : [];
  const safeCertificates = Array.isArray(certificateItems) ? certificateItems : [];
  const educationCount = safeEducation.length;

  const showPreviousEducation = () => {
    if (!educationCount) return;
    setActiveEducationIndex((current) => (current - 1 + educationCount) % educationCount);
  };

  const showNextEducation = () => {
    if (!educationCount) return;
    setActiveEducationIndex((current) => (current + 1) % educationCount);
  };

  const activateEducation = (index) => setActiveEducationIndex(index);

  const getEducationOffset = (index) => {
    if (!educationCount) return 0;
    const rawOffset = index - activeEducationIndex;
    if (rawOffset > educationCount / 2) {
      return rawOffset - educationCount;
    }
    if (rawOffset < -educationCount / 2) {
      return rawOffset + educationCount;
    }
    return rawOffset;
  };

  return (
    <section id="education" className="section section-education">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <SectionHeading index="05. Where I Studied" title="Education &" accent="Certifications" />
        <div className="education-shell">
          <div className="slider-section slider-section--education">
            <div className="slider-heading-row">
              <div>
                <p className="column-label">
                  <Icon name="graduation" size={13} /> Education
                </p>
                <h3>Education timeline</h3>
              </div>
              <div className="slider-controls">
                <button type="button" className="slider-button" aria-label="Previous education card" onClick={showPreviousEducation}>
                  <Icon name="arrowLeft" size={15} />
                </button>
                <button type="button" className="slider-button" aria-label="Next education card" onClick={showNextEducation}>
                  <Icon name="arrowRight" size={15} />
                </button>
              </div>
            </div>

            <div className="education-carousel" aria-label="Education cards slider">
              <div className="education-carousel-stage">
                {safeEducation.map((item, index) => {
                  const offset = getEducationOffset(index);
                  const positionClass =
                    offset === 0 ? 'is-active' : offset === -1 ? 'is-prev' : offset === 1 ? 'is-next' : 'is-hidden';

                  return (
                    <article
                      key={`${item.title}-${item.period}`}
                      className={`experience-card education-carousel-card card-3d ${positionClass}`}
                      aria-hidden={positionClass === 'is-hidden'}
                      onClick={() => activateEducation(index)}
                    >
                      <span className="experience-card-accent" />
                      <div className="experience-card-body">
                        <div className="experience-card-header">
                          <div className="experience-role">
                            <span className="experience-role-icon">
                              <Icon name="graduation" size={18} />
                            </span>
                            <div>
                              <div className="experience-title-line">
                                <h3>{item.title}</h3>
                                {item.badge ? <span className="current-badge">{item.badge}</span> : null}
                              </div>
                              <p>{item.org}</p>
                            </div>
                          </div>
                          <span className="experience-period">
                            <Icon name="calendar" size={12} /> {item.period}
                          </span>
                        </div>

                        <p className="experience-description">{item.detail}</p>

                        <div className="tag-row experience-tags">
                          <span className="tech-tag">Education</span>
                          <span className="tech-tag colorful-tag">{item.track}</span>
                        </div>

                        <div className="experience-card-footer education-footer">
                          <div className="experience-count">
                            <strong>{String(index + 1).padStart(2, '0')}</strong>
                            <span>/</span>
                            <small>{String(safeEducation.length).padStart(2, '0')}</small>
                            <em>· {item.org.split('—')[0].trim()}</em>
                          </div>
                          <div className="slider-pulse" aria-hidden="true" />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="education-carousel-dots" aria-label="Education carousel pagination">
              {safeEducation.map((item, index) => (
                <button
                  key={`${item.title}-dot`}
                  type="button"
                  className={`education-carousel-dot ${index === activeEducationIndex ? 'is-active' : ''}`}
                  aria-label={`Show ${item.title}`}
                  aria-pressed={index === activeEducationIndex}
                  onClick={() => activateEducation(index)}
                />
              ))}
            </div>
          </div>

          <div className="slider-section slider-section--certifications">
            <div className="slider-heading-row">
              <div>
                <p className="column-label">
                  <Icon name="award" size={13} /> Certifications
                </p>
                <h3>Compact certifications</h3>
              </div>
              <div className="slider-controls">
                <button type="button" className="slider-button" aria-label="Scroll certification cards left" onClick={() => slideRail(certificationRailRef, -1)}>
                  <Icon name="arrowLeft" size={15} />
                </button>
                <button type="button" className="slider-button" aria-label="Scroll certification cards right" onClick={() => slideRail(certificationRailRef, 1)}>
                  <Icon name="arrowRight" size={15} />
                </button>
              </div>
            </div>

              <div className="slider-viewport slider-viewport--certifications" ref={certificationRailRef} aria-label="Certification cards slider">
                {safeCertificates.map((cert) => (
                  <article
                    key={cert.title}
                    className="experience-card certification-slider-card card-3d"
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveCertificate(cert)}
                    onKeyDown={(e) => handleCertKeyDown(e, cert)}
                  >
                    <div className="certification-card-media">
                      {cert.image ? (
                        <img src={withBase(cert.image)} alt={cert.title} loading="lazy" decoding="async" />
                      ) : (
                        <div className="certification-card-media-empty">
                          <Icon name="certificate" size={18} />
                          <span>No certificate image yet</span>
                        </div>
                      )}
                      <div className="certification-card-media-wash" />
                    </div>
                    <div className="experience-card-body certification-card-body">
                      <div className="certification-card-top">
                        <span className="experience-period certification-year">
                          <Icon name="calendar" size={12} /> {cert.year}
                        </span>
                      </div>

                      <div className="certification-card-main">
                        <div className="certification-copy">
                          <div className="experience-title-line">
                            <h3>{cert.title}</h3>
                          </div>
                          <p className="certification-org">{cert.org}</p>
                          <p className="certification-detail">{cert.detail}</p>
                        </div>
                      </div>

                      <div className="certification-card-footer">
                        <span className="certification-chip">Learning milestone</span>
                        <div className="slider-pulse certification-pulse" aria-hidden="true" />
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {activeCertificate && (
            <CertificationModal certificate={activeCertificate} onClose={() => setActiveCertificate(null)} />
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const sending = status === 'sending';
  const sent = status === 'success';

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      await apiRequest('/api/contact/messages', {
        method: 'POST',
        body: form,
      });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (submissionError) {
      setStatus('error');
      setError(submissionError.message || 'Something went wrong. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setError('');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const directItems = [
    { icon: 'mail', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: 'phone', label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: 'whatsapp', label: 'WhatsApp', value: profile.phone, href: whatsappUrl },
    { icon: 'pin', label: 'Location', value: profile.address, href: locationUrl },
    { icon: 'external', label: 'Portfolio', value: profile.portfolio, href: profile.portfolio },
  ];

  const followItems = [
    { icon: 'github', label: 'GitHub', href: `https://github.com/${profile.github}` },
    { icon: 'linkedin', label: 'LinkedIn', href: `https://linkedin.com/in/${profile.linkedin}` },
    { icon: 'whatsapp', label: 'WhatsApp', href: whatsappUrl },
    { icon: 'external', label: 'Website', href: profile.portfolio },
  ];

  return (
    <section id="contact" className="section section-contact contact-reference">
      <div className="section-divider" />
      <div className="contact-glow contact-glow-a" aria-hidden="true" />
      <div className="contact-glow contact-glow-b" aria-hidden="true" />
      <Reveal className="section-inner">
        <SectionHeading
          index="06. Get In Touch"
          title="Let's"
          accent="Connect"
          description="Whether you have a project, want to collaborate, or just want to say hello — my inbox is always open."
        />

        <div className="availability-banner">
          <div className="availability-copy">
            <span className="availability-signal">
              <i />
            </span>
            <div>
              <h3>
                Available for new opportunities <Icon name="sparkles" size={14} />
              </h3>
              <p>Open to full-time roles, freelance work, and collaborations.</p>
            </div>
          </div>
          <span className="reply-pill">
            <Icon name="clock" size={12} /> Replies within 24h
          </span>
        </div>

        <div className="contact-layout">
          <div className="contact-side">
            <div className="direct-panel card-3d">
              <p className="contact-panel-label">Direct</p>
              {directItems.map((item) => {
                const external = item.href.startsWith('http');
                return (
                  <a
                    key={item.label}
                    className="direct-item"
                    href={item.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={`${item.label} ${item.value}`}
                  >
                    <span className="direct-icon">
                      <Icon name={item.icon} size={14} />
                    </span>
                    <span className="direct-copy">
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </span>
                    <Icon name="arrowUpRight" size={13} className="direct-arrow" />
                  </a>
                );
              })}
            </div>

            <div className="follow-panel card-3d">
              <p className="contact-panel-label">Follow</p>
              <div>
                {followItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <Icon name={item.icon} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="message-panel">
            <span className="message-panel-accent" />
            <div className="message-panel-header">
              <div>
                <h3>Send a Message</h3>
                <p>Let's build something together.</p>
              </div>
              <span>
                <Icon name="send" size={13} />
              </span>
            </div>
            <div className="message-panel-body">
              {sent ? (
                <div className="success-state" role="status">
                  <span className="success-icon">
                    <i />
                    <Icon name="check" size={26} />
                  </span>
                  <div>
                    <h3>Message Sent!</h3>
                    <p>Thanks for reaching out. I'll get back to you shortly.</p>
                  </div>
                  <button type="button" onClick={reset}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form className="message-form" onSubmit={submit}>
                  <div className="form-row">
                    <label>
                      <span>Name</span>
                      <input name="name" value={form.name} onChange={update} required placeholder="Your name" />
                    </label>
                    <label>
                      <span>Email</span>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={update}
                        required
                        placeholder="your@email.com"
                      />
                    </label>
                  </div>
                  <label>
                    <span>Phone <small>(Optional)</small></span>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={update}
                      placeholder="+94 12 345 6789"
                    />
                  </label>
                  <label>
                    <span>Subject</span>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={update}
                      required
                      placeholder="What's this about?"
                    />
                  </label>
                  <label>
                    <span>Message</span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={update}
                      required
                      rows="5"
                      placeholder="Tell me about your project or opportunity..."
                    />
                  </label>
                  {error ? (
                    <div className="contact-form-error" role="alert">
                      {error}
                    </div>
                  ) : null}
                  <button className="submit-button" type="submit" disabled={sending}>
                    {sending ? <span className="spinner" aria-label="Sending" /> : <Icon name="send" size={15} />}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function PricingTabs({ services, activeServiceId, onChange }) {
  const prefersReducedMotion = useFramerReducedMotion();
  return (
    <div className="pricing-tabs" role="tablist" aria-label="Pricing service type">
      {services.map((service) => {
        const selected = service.id === activeServiceId;
        return (
          <motion.button
            key={service.id}
            id={`pricing-tab-${service.id}`}
            type="button"
            className={`pricing-tab ${selected ? 'is-active' : ''}`}
            role="tab"
            aria-selected={selected}
            aria-controls={`pricing-panel-${service.id}`}
            onClick={() => onChange(service.id)}
            whileHover={prefersReducedMotion ? undefined : { y: -2 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          >
            <Icon name={service.icon} size={15} />
            <span>{service.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function PricingCard({ plan, index = 0 }) {
  const prefersReducedMotion = useFramerReducedMotion();
  const featured = Boolean(plan.badge);
  const unavailable = Array.isArray(plan.unavailable) ? plan.unavailable : [];

  return (
    <motion.article
      className={`pricing-card card-3d ${featured ? 'pricing-card-featured' : ''}`}
      initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.985 }}
      whileInView={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.68, delay: Math.min(index, 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
    >
      <span className="pricing-card-accent" aria-hidden="true" />
      <div className="pricing-card-header">
        <div>
          <p className="pricing-tier">{plan.tier}</p>
          <h3>{plan.title}</h3>
        </div>
        {plan.badge ? <span className="pricing-badge">{plan.badge}</span> : null}
      </div>

      <div className="pricing-price">
        <span>Starting from</span>
        {plan.originalPrice ? (
          <div className="pricing-price-discounted">
            <span className="pricing-original-price">{plan.originalPrice}</span>
            {plan.discountPercent ? (
              <span className="pricing-discount-badge">{plan.discountPercent}</span>
            ) : null}
          </div>
        ) : null}
        <strong>{plan.price}</strong>
      </div>

      <p className="pricing-card-description">{plan.description}</p>

      <div className="pricing-feature-group">
        <p className="pricing-feature-heading">Included</p>
        <ul className="pricing-feature-list">
          {plan.features.map((feature) => (
            <li key={feature}>
              <Icon name="check" size={13} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pricing-feature-group pricing-feature-group-muted">
        <p className="pricing-feature-heading">Not Included</p>
        <ul className="pricing-feature-list pricing-feature-list-unavailable">
          {unavailable.length ? unavailable.map((feature) => (
            <li key={feature}>
              <Icon name="close" size={13} />
              <span>{feature}</span>
            </li>
          )) : (
            <li>
              <Icon name="close" size={13} />
              <span>No exclusions listed for this package.</span>
            </li>
          )}
        </ul>
      </div>

      <div className="pricing-card-footer">
        <span className="pricing-delivery">
          <Icon name="clock" size={12} /> {plan.delivery}
        </span>
        <a className="pricing-select-button" href="#pricing-contact">
          {plan.button} <Icon name="arrowUpRight" size={14} />
        </a>
      </div>
    </motion.article>
  );
}

function PricingContact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Website project',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const sending = status === 'sending';
  const sent = status === 'success';

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      await apiRequest('/api/contact/messages', {
        method: 'POST',
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `Pricing quote - ${form.projectType}`,
          message: [
            `Project type: ${form.projectType}`,
            form.budget ? `Budget: ${form.budget}` : null,
            '',
            form.message,
          ]
            .filter(Boolean)
            .join('\n'),
        },
      });
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        projectType: 'Website project',
        budget: '',
        message: '',
      });
    } catch (submissionError) {
      setStatus('error');
      setError(submissionError.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="pricing-contact" className="section pricing-contact-section">
      <div className="section-divider" />
      <Reveal className="section-inner pricing-contact-layout">
        <div className="pricing-contact-copy">
          <p className="pricing-tier">Request a Quote</p>
          <h2>Tell me what you want to build.</h2>
          <p>
            Share the project type, timeline, and important features. I will reply with the best package or a custom
            quotation.
          </p>
          <div className="pricing-contact-direct">
            <a href={`mailto:${profile.email}`}>
              <Icon name="mail" size={14} />
              {profile.email}
            </a>
            <a href={`tel:${profile.phone}`}>
              <Icon name="phone" size={14} />
              {profile.phone}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={14} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="pricing-contact-panel">
          {sent ? (
            <div className="pricing-contact-success" role="status">
              <span className="success-icon">
                <Icon name="check" size={24} />
              </span>
              <h3>Quote request sent</h3>
              <p>Thanks. I will review your details and get back to you shortly.</p>
              <button type="button" onClick={() => setStatus('idle')}>
                Send another request
              </button>
            </div>
          ) : (
            <form className="pricing-contact-form" onSubmit={submit}>
              <div className="form-row">
                <label>
                  <span>Name</span>
                  <input name="name" value={form.name} onChange={update} required placeholder="Your name" />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    required
                    placeholder="your@email.com"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" value={form.phone} onChange={update} placeholder="+94 12 345 6789" />
                </label>
                <label>
                  <span>Project type</span>
                  <select name="projectType" value={form.projectType} onChange={update}>
                    <option>Website project</option>
                    <option>Mobile app project</option>
                    <option>Custom platform</option>
                    <option>Maintenance or upgrade</option>
                  </select>
                </label>
              </div>
              <label>
                <span>Budget range</span>
                <input name="budget" value={form.budget} onChange={update} placeholder="Example: Rs. 85,000 - 150,000" />
              </label>
              <label>
                <span>Project details</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={update}
                  required
                  rows="5"
                  placeholder="Tell me about your pages, screens, features, deadline, and business goals."
                />
              </label>
              {error ? (
                <div className="contact-form-error" role="alert">
                  {error}
                </div>
              ) : null}
              <button className="submit-button" type="submit" disabled={sending}>
                {sending ? <span className="spinner" aria-label="Sending" /> : <Icon name="send" size={15} />}
                {sending ? 'Sending...' : 'Send Quote Request'}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function PricingPage() {
  const { services: pricingServices, loading: pricingLoading } = usePricingContent();
  const [activeServiceId, setActiveServiceId] = useState('');
  const prefersReducedMotion = useFramerReducedMotion();
  const activeService = pricingServices.find((service) => service.id === activeServiceId) || pricingServices[0] || null;
  const websiteService = pricingServices.find((service) => service.id === 'websites') || pricingServices[0];
  const mobileService = pricingServices.find((service) => service.id === 'mobile-apps') || pricingServices[1];
  const pricingHighlights = [
    websiteService?.packages?.[0] ? `${websiteService.label} from ${websiteService.packages[0].price}` : '',
    mobileService?.packages?.[0] ? `${mobileService.label} from ${mobileService.packages[0].price}` : '',
    pricingServices.length ? 'Support included' : '',
  ].filter(Boolean);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    try {
      window.scrollTo(0, 0);
    } catch (error) {
      void error;
    }
  }, []);

  useEffect(() => {
    if (!pricingServices.length) {
      setActiveServiceId('');
      return;
    }

    setActiveServiceId((current) => (pricingServices.some((service) => service.id === current) ? current : pricingServices[0].id));
  }, [pricingServices]);

  return (
    <div className="bolt-shell pricing-page-shell">
      <Helmet>
        <title>{pricingPageTitle}</title>
        <meta name="description" content={pricingPageDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="author" content={siteName} />
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href={`${siteUrl}/pricing`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/pricing`} />
        <meta property="og:title" content={pricingPageTitle} />
        <meta property="og:description" content={pricingPageDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1536" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:alt" content={socialImageAlt} />
        <meta property="og:site_name" content={siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pricingPageTitle} />
        <meta name="twitter:description" content={pricingPageDescription} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="twitter:image:alt" content={socialImageAlt} />
        <meta name="theme-color" content="#00020a" />
        <link rel="icon" type="image/png" sizes="96x96" href={siteLogo} />
        <link rel="shortcut icon" type="image/x-icon" href={siteIcon} sizes="any" />
        <link rel="apple-touch-icon" href={siteTouchIcon} />
      </Helmet>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main className="pricing-main">
        <section className="pricing-hero">
          <div className="hero-grid-mask" aria-hidden="true" />
          <div className="hero-glow hero-glow-a" aria-hidden="true" />
          <div className="hero-glow hero-glow-b" aria-hidden="true" />
          <div className="section-inner pricing-hero-inner">
            <motion.div
              className="pricing-hero-copy"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="hero-eyebrow">Pricing</p>
              <h1>Simple Pricing for Websites and Apps</h1>
              <p>
                Pick a starting package, then request a quote with your exact features, deadline, and budget.
              </p>
              <div className="pricing-hero-actions">
                <a className="primary-button" href="#pricing-options">
                  Explore Packages <Icon name="arrowDown" size={15} />
                </a>
                <a className="secondary-button" href="#pricing-contact">
                  Request a Quote <Icon name="arrowUpRight" size={15} />
                </a>
              </div>
              <div className="pricing-hero-points" aria-label="Pricing summary">
                {pricingHighlights.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="pricing-options" className="section pricing-packages-section">
          <div className="section-divider" />
          <Reveal className="section-inner">
            <SectionHeading
              index="01. Choose Your Service"
              title="Flexible"
              accent="Packages"
              description={activeService?.intro || 'Pricing packages can be added and edited from the admin panel.'}
            />
            {pricingServices.length ? (
              <>
                <PricingTabs services={pricingServices} activeServiceId={activeServiceId} onChange={setActiveServiceId} />
                <div
                  id={`pricing-panel-${activeService.id}`}
                  className="pricing-grid"
                  role="tabpanel"
                  aria-labelledby={`pricing-tab-${activeService.id}`}
                >
                  {activeService.packages.map((plan, index) => (
                    <PricingCard key={plan.id || plan.title} plan={plan} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <div className="pricing-empty-panel">
                {pricingLoading ? 'Loading pricing packages...' : 'Pricing packages are not available yet.'}
              </div>
            )}
          </Reveal>
        </section>

        <section className="section pricing-custom-section">
          <div className="section-divider" />
          <Reveal className="section-inner">
            <div className="pricing-custom-panel card-3d">
              <div>
                <p className="pricing-tier">Custom Project</p>
                <h2>Need Something More Custom?</h2>
                <p>
                  Every project is different. Contact me for a personalized quotation based on your exact
                  requirements.
                </p>
              </div>
              <a className="primary-button" href="#pricing-contact">
                Request a Custom Quote <Icon name="send" size={15} />
              </a>
            </div>
          </Reveal>
        </section>

        <section className="section pricing-info-section">
          <div className="section-divider" />
          <Reveal className="section-inner pricing-info-layout">
            <div className="pricing-info-copy">
              <SectionHeading
                index="02. Important Information"
                title="Before You"
                accent="Start"
                align="left"
                description="A few practical details that keep quotations clear and project scope realistic."
              />
              <ul className="pricing-info-list">
                {pricingImportantInfo.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={13} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pricing-faq-panel">
              <p className="pricing-tier">Frequently Asked Questions</p>
              <div className="pricing-faq-list">
                {pricingFaqs.map((item) => (
                  <details key={item.question} className="pricing-faq-item">
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
        <PricingContact />
      </main>
      <FloatingContactMenu />
      <Footer />
    </div>
  );
}

function Footer() {
  const location = useLocation();
  const resolveFooterHref = (href) => (href.startsWith('#') && location.pathname !== '/' ? `/${href}` : href);
  const homeHref = resolveFooterHref('#hero');
  const contactHref = resolveFooterHref('#contact');
  const footerGroups = [
    {
      title: 'Navigate',
      links: [
        ['About', '#about'],
        ['Experience', '#experience'],
        ['Projects', '#projects'],
        ['Skills', '#skills'],
      ],
    },
    {
      title: 'More',
      links: [
        ['Education', '#education'],
        ['Certifications', '#education'],
        ['Pricing', '/pricing'],
        ['Contact', '#contact'],
        ['Hire Me', '#contact'],
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top-line" aria-hidden="true" />
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-cta">
          <div>
            <p>Let's build together</p>
            <h3>Have a project in mind?</h3>
            <span>Always open to discussing new opportunities, collaborations, or just a friendly chat.</span>
          </div>
          <a href={contactHref}>
            Start a Conversation <Icon name="mail" size={15} />
          </a>
        </div>

        <div className="footer-grid">
          <div className="footer-brand-column">
            <a href={homeHref} className="footer-brand">
              <span>
                <strong>
                  Chamuditha Perera
                </strong>
                <small>/ Software Engineer</small>
              </span>
            </a>
            <p>Building performant, end-to-end mobile and web applications with Flutter, React, and Spring Boot.</p>
            <div className="footer-socials">
              <SocialLink icon="github" label="GitHub" href={`https://github.com/${profile.github}`} />
              <SocialLink icon="linkedin" label="LinkedIn" href={`https://linkedin.com/in/${profile.linkedin}`} />
              <SocialLink icon="whatsapp" label="WhatsApp" href={whatsappUrl} />
              <SocialLink icon="mail" label="Email" href={`mailto:${profile.email}`} />
              <SocialLink icon="external" label="Website" href={profile.portfolio} />
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="footer-link-column">
              <h4>{group.title}</h4>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={resolveFooterHref(href)}>
                      <i /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-contact-column">
            <h4>Get In Touch</h4>
            <ul>
              <li>
                <a href={`mailto:${profile.email}`}>
                  <Icon name="mail" size={14} /> <span>{profile.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${profile.phone}`}>
                  <Icon name="phone" size={14} /> <span>{profile.phone}</span>
                </a>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={14} /> <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href={locationUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="pin" size={14} /> <span>Kalutara, Sri Lanka</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            All rights reserved © 2026 ChamudithaPerera.Online
          </p>
          <div>
            <a href={homeHref} aria-label="Back to top">
              <Icon name="arrowUp" size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  const portfolioContent = usePortfolioContent();

  return (
    <div className="bolt-shell">
      <Helmet>
        <title>{siteTitle}</title>
        <meta
          name="description"
          content={siteDescription}
        />
        <meta name="keywords" content={siteKeywords} />
        <meta name="author" content={siteName} />
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1536" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:alt" content={socialImageAlt} />
        <meta property="og:site_name" content={siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="twitter:image:alt" content={socialImageAlt} />
        <meta name="theme-color" content="#00020a" />
        <link rel="icon" type="image/png" sizes="96x96" href={siteLogo} />
        <link rel="shortcut icon" type="image/x-icon" href={siteIcon} sizes="any" />
        <link rel="apple-touch-icon" href={siteTouchIcon} />
      </Helmet>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience experienceItems={portfolioContent.experience} />
        <Projects projectsData={portfolioContent.projects} />
        <Skills techStacks={portfolioContent.techStacks} />
        <Education educationItems={portfolioContent.education} certificateItems={portfolioContent.certificates} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export { FloatingAiAgent, PricingPage, ProjectsPage };
export default Home;
