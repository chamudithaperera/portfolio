import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  phone: '+94719153552',
  address: 'No 83, Galle Road, Kalutara North',
  github: 'chamudithaperera',
  linkedin: 'chamudithaperera',
  portfolio: 'chamudithaperera.online',
};

const siteUrl = 'https://chamudithaperera.online';
const siteTitle = 'Chamuditha Perera | Software Engineer';
const siteDescription =
  "Chamuditha Perera's portfolio website showcasing Flutter, React, Spring Boot, UI/UX, and production-ready mobile and web projects from Sri Lanka.";
const projectsPageTitle = 'Projects | Chamuditha Perera';
const projectsPageDescription =
  "Selected projects by Chamuditha Perera, including Flutter apps, React web experiences, and Spring Boot systems.";
const socialImage = `${siteUrl}/assets/imgs/header/edited-photo-cropped-720.png`;

const locationUrl =
  'https://www.google.com/maps/search/?api=1&query=No+83%2C+Galle+Road%2C+Kalutara+North%2C+Sri+Lanka';

const emptyPortfolioContent = {
  projects: [],
  experience: [],
  education: [],
  certificates: [],
};

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

const TECH_STACK_ORBITS = [
  {
    label: 'Languages',
    legendLabel: 'Languages',
    orbitRadius: 96,
    planetSize: 38,
    speed: 16,
    startOffset: 10,
    surface: '#09182e',
    ringColor: 'rgba(56, 189, 248, 0.24)',
    accent: '#38bdf8',
    items: [
      {
        label: 'Dart',
        summary: 'Primary language for Flutter app logic and UI flows.',
        icon: siDart,
      },
      {
        label: 'Java',
        summary: 'Backend language for Spring Boot services and system work.',
        icon: siOpenjdk,
      },
      {
        label: 'TypeScript',
        summary: 'Typed frontend language for React dashboards and admin tools.',
        icon: siTypescript,
      },
      {
        label: 'JavaScript',
        summary: 'Used across React UI work and full-stack web projects.',
        icon: siJavascript,
      },
      {
        label: 'HTML',
        summary: 'Structure layer for responsive web layouts and content.',
        icon: siHtml5,
      },
      {
        label: 'CSS',
        summary: 'Styling layer for polished, responsive interfaces.',
        icon: siCss,
      },
      {
        label: 'PHP',
        summary: 'Legacy web scripting language from earlier project work.',
        icon: siPhp,
      },
    ],
  },
  {
    label: 'Frameworks & Libraries',
    legendLabel: 'Frameworks',
    orbitRadius: 166,
    planetSize: 42,
    speed: 20,
    startOffset: 24,
    surface: '#0a1427',
    ringColor: 'rgba(96, 165, 250, 0.24)',
    accent: '#60a5fa',
    items: [
      {
        label: 'Flutter',
        summary: 'Primary framework for Android and iOS app delivery.',
        icon: siFlutter,
      },
      {
        label: 'React',
        summary: 'Frontend library for web interfaces and admin panels.',
        icon: siReact,
      },
      {
        label: 'Spring Boot',
        summary: 'Backend framework for APIs and microservices.',
        icon: siSpringboot,
      },
      {
        label: 'Express.js',
        summary: 'Lightweight Node.js server layer for REST APIs.',
        icon: siExpress,
      },
      {
        label: 'Tailwind CSS',
        summary: 'Utility-first styling system for rapid UI work.',
        icon: siTailwindcss,
      },
      {
        label: 'Node.js',
        summary: 'JavaScript runtime for servers, APIs, and tooling.',
        icon: siNodedotjs,
      },
      {
        label: 'React Native',
        summary: 'Cross-platform mobile framework listed in the CV stack.',
        monogram: 'RN',
      },
      {
        label: 'Riverpod',
        summary: 'Flutter state management for predictable app flows.',
        monogram: 'RP',
      },
    ],
  },
  {
    label: 'Backend & Database',
    legendLabel: 'Backend',
    orbitRadius: 236,
    planetSize: 46,
    speed: 24,
    startOffset: 18,
    surface: '#102238',
    ringColor: 'rgba(34, 211, 238, 0.22)',
    accent: '#22d3ee',
    items: [
      {
        label: 'Firebase',
        summary: 'Backend services for auth, storage, and mobile support.',
        icon: siFirebase,
      },
      {
        label: 'MongoDB',
        summary: 'Document database for MERN-style web projects.',
        icon: siMongodb,
      },
      {
        label: 'MySQL',
        summary: 'Relational database for structured application data.',
        icon: siMysql,
      },
      {
        label: 'PostgreSQL',
        summary: 'Primary SQL store for scalable backend systems.',
        icon: siPostgresql,
      },
      {
        label: 'SQLite',
        summary: 'Local-first storage for offline mobile app data.',
        icon: siSqlite,
      },
      {
        label: 'Redis',
        summary: 'In-memory cache for low-latency app workflows.',
        icon: siRedis,
      },
      {
        label: 'MQTT',
        summary: 'Messaging protocol for real-time device and service updates.',
        icon: siMqtt,
      },
      {
        label: 'RESTful APIs',
        summary: 'Interface style used to connect clients and services.',
        monogram: 'API',
      },
      {
        label: 'JWT Auth',
        summary: 'Token-based authentication for secure role-aware access.',
        icon: siJsonwebtokens,
      },
    ],
  },
  {
    label: 'DevOps & Other Tools',
    legendLabel: 'DevOps',
    orbitRadius: 306,
    planetSize: 50,
    speed: 28,
    startOffset: 32,
    surface: '#111b33',
    ringColor: 'rgba(167, 139, 250, 0.22)',
    accent: '#a78bfa',
    items: [
      {
        label: 'Git',
        summary: 'Source control for branching and collaboration.',
        icon: siGit,
      },
      {
        label: 'GitHub',
        summary: 'Repository hosting and collaborative versioning.',
        icon: siGithub,
      },
      {
        label: 'Docker',
        summary: 'Containerization for consistent local and production builds.',
        icon: siDocker,
      },
      {
        label: 'Postman',
        summary: 'API testing and workflow validation tool.',
        icon: siPostman,
      },
      {
        label: 'Kubernetes',
        summary: 'Container orchestration for scalable deployments.',
        icon: siKubernetes,
      },
      {
        label: 'Nginx',
        summary: 'Web server and reverse proxy for production delivery.',
        icon: siNginx,
      },
      {
        label: 'Figma',
        summary: 'Interface design, wireframing, and prototyping tool.',
        icon: siFigma,
      },
      {
        label: 'Adobe Photoshop',
        summary: 'Visual editing and asset preparation tool.',
        monogram: 'PS',
      },
    ],
  },
];

const TECH_SYSTEM_BASE_SIZE = 680;

const TECH_STACK_PLANETS = TECH_STACK_ORBITS.flatMap((group, orbitIndex) => {
  const step = 360 / group.items.length;

  return group.items.map((item, itemIndex) => {
    const start = group.startOffset + itemIndex * step;
    const iconHex = item.icon?.hex ? `#${item.icon.hex}` : null;
    const glyphColor = getReadableIconColor(iconHex, group.accent);

    return {
      ...item,
      id: `${slugify(group.label)}-${slugify(item.label)}`,
      category: group.label,
      orbitLabel: group.legendLabel,
      orbitIndex,
      orbitRadius: group.orbitRadius,
      size: group.planetSize,
      speed: group.speed,
      start,
      surface: group.surface,
      ringColor: group.ringColor,
      accent: group.accent,
      iconHex,
      glyphColor,
    };
  });
});

const iconPaths = {
  code: ['M8 9l-4 3 4 3', 'M16 9l4 3-4 3', 'M14 5l-4 14'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  github: ['M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 3.7 5.2 5.2 0 0 0 19.2 0S18 0 15 1.5a13.4 13.4 0 0 0-7 0C5 0 3.8 0 3.8 0a5.2 5.2 0 0 0-.1 3.7A5.5 5.5 0 0 0 2.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4', 'M8 19c-3 .9-3-1.5-4-2'],
  linkedin: ['M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2', 'M2 9h4v12H2z', 'M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4'],
  mail: ['M4 4h16v16H4z', 'm4 6 8 6 8-6'],
  external: ['M14 3h7v7', 'M10 14 21 3', 'M21 14v7H3V3h7'],
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .6 2.9.7a2 2 0 0 1 1.7 2z'],
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

function useViewportWidth() {
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  return viewportWidth;
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
  const [ref, visible] = useInView(threshold);
  return (
    <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}>
      {children}
    </Tag>
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

function SectionHeading({ index, title, accent, description, align = 'center' }) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      <p>{index}</p>
      <h2>
        {title} <span className="gradient-text">{accent}</span>
      </h2>
      {description ? <div className="section-description">{description}</div> : null}
    </div>
  );
}

function Brand() {
  return (
    <span className="brand">
      <span>ChamudithaPerera.Online</span>
    </span>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  const sectionHref = (href) => (location.pathname === '/' ? href : `/${href}`);
  const homeHref = location.pathname === '/' ? '#hero' : '/#hero';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const sections = navItems
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
  }, []);

  return (
    <nav className={`top-nav ${scrolled ? 'top-nav-scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav-inner">
        <a href={homeHref} aria-label="ChamudithaPerera.Online home">
          <Brand />
        </a>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={active === item.href ? 'active' : ''}
              href={sectionHref(item.href)}
              onClick={() => setActive(item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a className="hire-button" href="#contact">
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
          {navItems.map((item) => (
            <a key={item.href} href={sectionHref(item.href)} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#contact" className="mobile-hire" onClick={() => setOpen(false)}>
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

function OrbitIdentity() {
  return (
    <div className="hero-orbit-identity" aria-hidden="true">
      <div className="hero-orbit-nebula" />
      <div className="hero-orbit-ring hero-orbit-ring-outer" />
      <div className="hero-orbit-ring hero-orbit-ring-middle" />
      <div className="hero-orbit-ring hero-orbit-ring-inner" />
      <div className="hero-orbit-core">
        <span className="hero-orbit-highlight" />
        <picture>
          <source srcSet={withBase('/assets/imgs/header/edited-photo-cropped-720.webp')} type="image/webp" />
          <img
            className="hero-orbit-photo"
            src={withBase('/assets/imgs/header/edited-photo-cropped-720.png')}
            alt=""
            loading="eager"
            decoding="async"
          />
        </picture>
        <span className="hero-orbit-spark">
          <Icon name="sparkles" size={14} />
        </span>
        <span className="hero-loop-ring" aria-hidden="true">
          <span />
        </span>
      </div>
      <span className="hero-orbit-dot hero-orbit-dot-a" />
      <span className="hero-orbit-dot hero-orbit-dot-b" />
    </div>
  );
}

function Hero() {
  const role = useTypewriter(roles);

  return (
    <section id="hero" className="hero-section hero-reference">
      <div className="hero-grid-mask" aria-hidden="true" />
      <div className="hero-glow hero-glow-a" aria-hidden="true" />
      <div className="hero-glow hero-glow-b" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
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
              <SocialLink icon="mail" label="Email" href={`mailto:${profile.email}`} />
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <OrbitIdentity />
          <span className="floating-label floating-label-a">
            <Icon name="code" size={12} /> Full-Stack
          </span>
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
        </div>
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

function ProjectCard({ project, featured = false, onOpen }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(project);
    }
  };

  return (
    <button
      type="button"
      className={`${featured ? 'featured-project' : 'project-card'} project-card-button card-3d`}
      aria-label={`Open details for ${project.title}`}
      onClick={() => onOpen(project)}
      onKeyDown={handleKeyDown}
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
          <div className="project-card-cta">
            <Icon name="sparkles" size={12} />
            <span>Click for details</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProjectModal({ project, onClose }) {
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
    <div className="project-modal-backdrop" role="presentation" onClick={onClose}>
      <article
        className="project-modal card-3d"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalId}
        onClick={(event) => event.stopPropagation()}
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
      </article>
    </div>
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
  const featuredProject = safeProjects[0];
  const projectItems = mode === 'page' ? safeProjects : safeProjects.slice(1);
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
        {mode === 'home' && featuredProject ? <ProjectCard project={featuredProject} featured onOpen={setActiveProject} /> : null}
        {projectItems.length ? (
          <div className={`project-grid ${mode === 'page' ? 'project-grid-page' : ''}`}>
            {projectItems.map((project) => (
              <ProjectCard key={project.id || project.title} project={project} onOpen={setActiveProject} />
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
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={`${siteUrl}/projects`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/projects`} />
        <meta property="og:title" content={projectsPageTitle} />
        <meta property="og:description" content={projectsPageDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:site_name" content="Chamuditha Portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={projectsPageTitle} />
        <meta name="twitter:description" content={projectsPageDescription} />
        <meta name="twitter:image" content={socialImage} />
      </Helmet>
      <Navigation />
      <main>
        <Projects mode="page" projectsData={portfolioContent.projects} />
      </main>
    </div>
  );
}

function StackGlyph({ stack, size = 24, decorative = false, className = '' }) {
  const ariaProps = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': `${stack.label} logo` };

  return (
    <span
      className={`stack-glyph ${stack.icon ? 'has-icon' : 'has-monogram'} ${className}`.trim()}
      style={{
        width: size,
        height: size,
        color: stack.glyphColor,
        '--stack-surface': stack.surface,
        boxShadow: `0 0 0 1px ${stack.glyphColor}22, 0 0 18px 3px ${stack.glyphColor}18`,
      }}
      {...ariaProps}
    >
      {stack.icon ? (
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

function TechPlanet({ stack, running, reducedMotion, selected, onSelect }) {
  const endAngle = stack.start + 360;

  return (
    <button
      type="button"
      className={`skill-planet ${!running || reducedMotion ? 'is-paused' : ''} ${selected ? 'is-selected' : ''}`}
      title={stack.label}
      aria-label={stack.label}
      aria-pressed={selected}
      onClick={() => onSelect(stack)}
      style={{
        width: stack.size,
        height: stack.size,
        marginTop: -stack.size / 2,
        marginLeft: -stack.size / 2,
        '--orbit-radius': `${stack.orbitRadius}px`,
        '--orbit-start': `${stack.start}deg`,
        '--orbit-start-reverse': `${-stack.start}deg`,
        '--orbit-end': `${endAngle}deg`,
        '--orbit-end-reverse': `${-endAngle}deg`,
        animationDuration: `${stack.speed}s`,
        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,.22), ${stack.surface})`,
        boxShadow: `0 0 18px 3px ${stack.glyphColor}44, inset 0 0 8px rgba(255,255,255,.08)`,
        borderColor: selected ? stack.glyphColor : stack.ringColor,
      }}
    >
      <StackGlyph stack={stack} size={Math.max(16, Math.round(stack.size * 0.6))} decorative className="stack-glyph--planet" />
      <span className="planet-tooltip" aria-hidden="true">
        {stack.label}
      </span>
    </button>
  );
}

function StackDetailModal({ stack, onClose }) {
  useEffect(() => {
    if (!stack) {
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
  }, [onClose, stack]);

  if (!stack || typeof document === 'undefined') {
    return null;
  }

  const modalId = `skill-modal-title-${stack.id}`;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="skill-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <motion.article
        initial={{ scale: 0.94, y: 18, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="skill-modal card-3d"
        style={{
          '--stack-accent': stack.glyphColor,
          borderColor: stack.glyphColor,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalId}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="skill-modal-close" aria-label={`Close ${stack.label} details`} onClick={onClose}>
          <Icon name="close" size={18} />
        </button>

        <div className="skill-modal-orb" aria-hidden="true" />

        <div className="skill-modal-header">
          <div className="skill-modal-copy">
            <p className="skill-modal-eyebrow">Selected planet</p>
            <h3 id={modalId}>{stack.label}</h3>
            <p className="skill-modal-category">{stack.category}</p>
          </div>
          <StackGlyph stack={stack} size={86} className="stack-glyph--modal" />
        </div>

        <p className="skill-modal-summary">{stack.summary}</p>

        <div className="skill-modal-meta">
          <span>{stack.orbitLabel}</span>
          <span>{stack.icon ? 'Official brand mark' : 'Fallback monogram'}</span>
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  );
}

function SolarSystem({ running, setRunning, selectedStack, onSelectStack }) {
  const reducedMotion = useReducedMotion();
  const viewportWidth = useViewportWidth();
  const canvasSize = Math.max(280, Math.min(TECH_SYSTEM_BASE_SIZE, viewportWidth - 72));
  const scale = canvasSize / TECH_SYSTEM_BASE_SIZE;

  const orbitGroups = useMemo(
    () =>
      TECH_STACK_ORBITS.map((group) => ({
        ...group,
        orbitRadius: Math.round(group.orbitRadius * scale),
        size: Math.round(group.planetSize * scale),
      })),
    [scale],
  );

  const planets = useMemo(
    () =>
      orbitGroups.flatMap((group, orbitIndex) => {
        const step = 360 / group.items.length;

        return group.items.map((item, itemIndex) => {
          const start = group.startOffset + itemIndex * step;
          const iconHex = item.icon?.hex ? `#${item.icon.hex}` : null;
          const glyphColor = getReadableIconColor(iconHex, group.accent);

          return {
            ...item,
            id: `${slugify(group.label)}-${slugify(item.label)}`,
            category: group.label,
            orbitLabel: group.legendLabel,
            orbitIndex,
            orbitRadius: group.orbitRadius,
            size: group.size,
            speed: group.speed,
            start,
            surface: group.surface,
            ringColor: group.ringColor,
            accent: group.accent,
            iconHex,
            glyphColor,
          };
        });
      }),
    [orbitGroups],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 96 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 61) % 100}%`,
        animationDelay: `${(index % 10) * 0.43}s`,
        animationDuration: `${2 + (index % 7) * 0.41}s`,
      })),
    [],
  );

  return (
    <div className="solar-stage">
      <div
        className="solar-system"
        onMouseEnter={() => setRunning(false)}
        onMouseLeave={() => setRunning(true)}
        onFocus={() => setRunning(false)}
        onBlur={() => setRunning(true)}
        aria-label="Interactive solar system showing technical skills"
        style={{ width: canvasSize, height: canvasSize }}
      >
        {stars.map((star) => (
          <span key={star.id} className="solar-star" style={star} />
        ))}
        {orbitGroups.map((group) => (
          <span
            key={group.label}
            className="orbit-line"
            style={{
              width: group.orbitRadius * 2 + 4,
              height: group.orbitRadius * 2 + 4,
              borderColor: group.ringColor,
            }}
            aria-hidden="true"
          />
        ))}
        <div className="solar-core">
          <span className="pulse-ring pulse-ring-one" />
          <span className="pulse-ring pulse-ring-two" />
          <span className="pulse-ring pulse-ring-three" />
          <strong>CV</strong>
        </div>
        {planets.map((planet) => (
          <TechPlanet
            key={planet.id}
            stack={planet}
            running={running}
            reducedMotion={reducedMotion}
            selected={selectedStack?.id === planet.id}
            onSelect={onSelectStack}
          />
        ))}
        <div className="orbit-legend" aria-hidden="true">
          {orbitGroups.map((group) => (
            <span key={group.label} style={{ '--orbit-accent': group.ringColor }}>
              {group.legendLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Skills() {
  const [revealRef, visible] = useInView(0.1);
  const [running, setRunning] = useState(false);
  const [selectedStack, setSelectedStack] = useState(() => TECH_STACK_PLANETS[0] ?? null);
  const [activeStack, setActiveStack] = useState(null);

  const handleSelectStack = (stack) => {
    setSelectedStack(stack);
    setActiveStack(stack);
  };

  useEffect(() => {
    if (visible) setRunning(true);
  }, [visible]);

  return (
    <section id="skills" className="section section-skills skills-reference">
      <div className="section-divider" />
      <div className="nebula nebula-a" aria-hidden="true" />
      <div className="nebula nebula-b" aria-hidden="true" />
      <div ref={revealRef} className={`section-inner reveal ${visible ? 'is-visible' : ''}`}>
        <SectionHeading
          index="04. What I Know"
          title="Technical"
          accent="Skills"
          description="A full solar system of my CV stack. Click any planet to open a popup detail card."
        />
        <div className="skills-layout">
          <SolarSystem
            running={running}
            setRunning={setRunning}
            selectedStack={selectedStack}
            onSelectStack={handleSelectStack}
          />
        </div>
        <AnimatePresence initial={false}>
          {activeStack && <StackDetailModal key={activeStack.id} stack={activeStack} onClose={() => setActiveStack(null)} />}
        </AnimatePresence>
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
    { icon: 'pin', label: 'Location', value: profile.address, href: locationUrl },
    { icon: 'external', label: 'Portfolio', value: profile.portfolio, href: profile.portfolio },
  ];

  const followItems = [
    { icon: 'github', label: 'GitHub', href: `https://github.com/${profile.github}` },
    { icon: 'linkedin', label: 'LinkedIn', href: `https://linkedin.com/in/${profile.linkedin}` },
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

function Footer() {
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
          <a href="#contact">
            Start a Conversation <Icon name="mail" size={15} />
          </a>
        </div>

        <div className="footer-grid">
          <div className="footer-brand-column">
            <a href="#hero" className="footer-brand">
              <span>
                <strong>
                  ChamudithaPerera.Online
                </strong>
                <small>/ Software Engineer</small>
              </span>
            </a>
            <p>Building performant, end-to-end mobile and web applications with Flutter, React, and Spring Boot.</p>
            <div className="footer-socials">
              <SocialLink icon="github" label="GitHub" href={`https://github.com/${profile.github}`} />
              <SocialLink icon="linkedin" label="LinkedIn" href={`https://linkedin.com/in/${profile.linkedin}`} />
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
                    <a href={href}>
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
                <a href={locationUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="pin" size={14} /> <span>Kalutara, Sri Lanka</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 ChamudithaPerera.Online by {profile.name}.
          </p>
          <div>
            <span>All rights reserved</span>
            <a href="#hero" aria-label="Back to top">
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
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:site_name" content="Chamuditha Portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="theme-color" content="#00020a" />
        <link rel="icon" href={withBase('/assets/imgs/favicon.ico')} />
      </Helmet>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience experienceItems={portfolioContent.experience} />
        <Projects projectsData={portfolioContent.projects} />
        <Skills />
        <Education educationItems={portfolioContent.education} certificateItems={portfolioContent.certificates} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export { ProjectsPage };
export default Home;
