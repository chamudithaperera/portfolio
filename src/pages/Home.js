import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import withBase from '../utils/basePath';

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
  'React Developer',
];

const profile = {
  name: 'M. C. K. Perera',
  email: 'chamudithaperera.dev@gmail.com',
  phone: '+94719153552',
  address: 'No 83, Galle Road, Kalutara North',
  github: 'chamudithaperera',
  linkedin: 'chamudithaperera',
  portfolio: 'chamxdev.vercel.app',
};

const experience = [
  {
    period: '2026 Mar — Present',
    role: 'Associate Software Engineer',
    org: 'W3Inventor',
    current: true,
    detail:
      'Developing ride-hailing system using Flutter and Spring Boot, implementing real-time features, fare logic, JWT authentication, microservices integration, and optimizing performance, caching, and database consistency.',
    tags: ['Flutter', 'Spring Boot', 'Microservices', 'JWT', 'Redis'],
  },
  {
    period: '2025 Sep — 2026 Mar',
    role: 'Intern Mobile Application Developer',
    org: 'W3Inventor',
    detail:
      'Contributed to Flutter-based ride-hailing app development, implementing UI, API integration, authentication flows, and debugging features while collaborating with backend teams in a microservices-based architecture.',
    tags: ['Flutter', 'API Integration', 'Authentication', 'Microservices'],
  },
  {
    period: '2024 Dec — 2025 Sep',
    role: 'Intern UI/UX Designer',
    org: 'Kyranz IT',
    detail:
      'Worked remotely creating user-friendly web and mobile interfaces. Created wireframes and prototypes in Figma, assisted with user research, and ensured responsiveness across devices.',
    tags: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping'],
  },
  {
    period: '2024 Jun — 2024 Dec',
    role: 'Intern UI/UX Designer',
    org: 'Web99x',
    detail:
      'Crafted wireframes, mockups, and prototypes in Figma. Collaborated with developers to deliver clean, user-focused designs for web and mobile products.',
    tags: ['Figma', 'Mockups', 'UI Design', 'Collaboration'],
  },
  {
    period: '2021 Dec — 2022 Jun',
    role: 'Bank Trainee',
    org: "Peoples' Bank — International Banking",
    detail:
      'Worked in the Import Bills section. Assisted in processing import documentation, verifying trade documents, and supporting daily operations related to international trade finance.',
    tags: ['Trade Finance', 'Documentation', 'Banking'],
  },
];

const projects = [
  {
    title: 'Money Manager App',
    category: 'Flutter mobile system',
    image: '/assets/imgs/works/moneymanager.png',
    summary:
      'A local-first personal finance app with wallet tracking, savings goals, wishlist planning, budgets, charts, CSV export, and PDF generation.',
    tags: ['Flutter', 'Riverpod', 'SQLite', 'SharedPreferences'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_flutter-nodejs-mongodb-activity-7355636008446554112-3I2I?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'EduLink Peer Tutoring Platform',
    category: 'Web product',
    image: '/assets/imgs/works/edupro.jpeg',
    summary:
      'A full-stack tutoring platform with authentication, course enrollment, scheduling, messaging, admin tools, and analytics.',
    tags: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_edulink-finalyearproject-mernstack-activity-7313985622233255936-t0Iq?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'Weather App',
    category: 'Realtime mobile experience',
    image: '/assets/imgs/works/weatherApp.jpeg',
    summary:
      'A responsive Flutter weather app with real-time updates, hourly and daily forecasts, geolocation, and live city search.',
    tags: ['Flutter', 'Dart', 'OpenWeatherMap API', 'Geolocator'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_flutter-mobileapp-weatherapp-activity-7325197536418238464-_Ua0?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'Avurudu Nakath App',
    category: 'Cultural utility app',
    image: '/assets/imgs/works/avuruduApp.jpeg',
    summary:
      'A Sinhala and Tamil New Year app with Nakath schedules, ritual details, and push notifications for timely reminders.',
    tags: ['Flutter', 'Countdown Timer', 'Local Notifications'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_avurudunakath2025-mobileapp-playstore-activity-7309530321211822080-RZB2?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
];

const skillGroups = [
  { label: 'Languages', items: ['Dart', 'Java', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'PHP'] },
  {
    label: 'Frameworks',
    items: ['Flutter', 'React', 'Spring Boot', 'Express.js', 'Tailwind CSS', 'Node.js', 'React Native', 'Riverpod'],
  },
  {
    label: 'Backend / DB',
    items: ['Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'MQTT', 'RESTful APIs', 'JWT Auth'],
  },
  {
    label: 'DevOps',
    items: ['Git', 'GitHub', 'Docker', 'Postman', 'Kubernetes', 'Nginx', 'Figma', 'Adobe Photoshop'],
  },
];

const proficiencies = [
  { label: 'Flutter / Dart', value: 90 },
  { label: 'React / TypeScript', value: 85 },
  { label: 'Spring Boot / Java', value: 80 },
  { label: 'PostgreSQL / MySQL', value: 78 },
  { label: 'UI/UX — Figma', value: 75 },
  { label: 'Docker / Kubernetes', value: 70 },
];

const planets = [
  { label: 'Dart', radius: 84, size: 42, speed: 14, color: '#0ea5e9', start: 0 },
  { label: 'TypeScript', radius: 84, size: 42, speed: 14, color: '#3b82f6', start: 72 },
  { label: 'Java', radius: 84, size: 42, speed: 14, color: '#2563eb', start: 144 },
  { label: 'JS', radius: 84, size: 42, speed: 14, color: '#1d4ed8', start: 216 },
  { label: 'PHP', radius: 84, size: 42, speed: 14, color: '#1e40af', start: 288 },
  { label: 'Flutter', radius: 146, size: 48, speed: 20, color: '#0284c7', start: 30 },
  { label: 'React', radius: 146, size: 48, speed: 20, color: '#0369a1', start: 102 },
  { label: 'Spring', radius: 146, size: 48, speed: 20, color: '#075985', start: 174 },
  { label: 'Node.js', radius: 146, size: 48, speed: 20, color: '#0c4a6e', start: 246 },
  { label: 'Tailwind', radius: 146, size: 48, speed: 20, color: '#164e63', start: 318 },
  { label: 'Docker', radius: 208, size: 52, speed: 32, color: '#1e3a5f', start: 10 },
  { label: 'Kubernetes', radius: 208, size: 52, speed: 32, color: '#172554', start: 70 },
  { label: 'PostgreSQL', radius: 208, size: 52, speed: 32, color: '#0c2340', start: 130 },
  { label: 'Redis', radius: 208, size: 52, speed: 32, color: '#0f1f3d', start: 190 },
  { label: 'Firebase', radius: 208, size: 52, speed: 32, color: '#0a1628', start: 250 },
  { label: 'AWS', radius: 208, size: 52, speed: 32, color: '#060e1e', start: 310 },
];

const education = [
  {
    title: 'BSc in Information Technology',
    org: 'University of Jaffna',
    period: '2022 Oct — 2025 Jul',
    detail:
      'Programming, algorithms, web systems, database design, operating systems, networks, mobile computing, security, and project-based delivery.',
  },
  {
    title: 'Diploma in Information Technology',
    org: 'IMBS Green Campus',
    period: '2021 — 2022',
    badge: 'GPA 3.73',
    detail:
      '30-credit diploma with a 3.73 GPA covering hardware, networking, web engineering, software engineering, and a software development project.',
  },
  {
    title: 'A/L Technology Stream',
    org: 'Ananda Sastralaya, Matugama',
    period: '2020',
    detail: 'Science for Technology B, ICT C, Engineering Technology S.',
  },
  {
    title: 'O/L',
    org: 'Tissa Central College, Kalutara',
    period: '2017',
    detail:
      'Mathematics A, ICT A, Commerce A, Science B, Sinhala B, History B, Drama B, Buddhism B, English C.',
  },
];

const certifications = [
  { title: 'AI/ML Engineer — Stage 1', org: 'SLIIT', year: '2026' },
  { title: 'Dart & Flutter Development Course', org: 'Udemy', year: '2024' },
  { title: 'IT for Business Success', org: 'HP', year: '2021' },
];

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

function Starfield() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext?.('2d');
    if (!canvas || !context) return undefined;

    let frame;
    let particles = [];
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.45 + 0.1,
      }));
    };

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(37,99,235,${particle.alpha})`;
        context.fill();
      });

      particles.forEach((particle, index) => {
        particles.slice(index + 1).forEach((other) => {
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 110) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(37,99,235,${0.07 * (1 - distance / 110)})`;
            context.lineWidth = 0.5;
            context.stroke();
          }
        });
      });

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

function Reveal({ as: Tag = 'div', className = '', children, threshold = 0.1 }) {
  const [ref, visible] = useInView(threshold);
  return (
    <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}>
      {children}
    </Tag>
  );
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

function Brand({ small = false }) {
  return (
    <span className="brand">
      <span className={`brand-icon ${small ? 'brand-icon-small' : ''}`}>
        <Icon name="code" size={small ? 13 : 15} />
      </span>
      <span>chamxdev</span>
    </span>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

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
        <a href="#hero" aria-label="ChamXdev home">
          <Brand />
        </a>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={active === item.href ? 'active' : ''}
              href={item.href}
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
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
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

function Hero() {
  const role = useTypewriter(roles);
  return (
    <section id="hero" className="hero-section dot-grid">
      <Starfield />
      <div className="hero-glow hero-glow-a" aria-hidden="true" />
      <div className="hero-glow hero-glow-b" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-pill">
            <span />
            Open to new opportunities
          </div>

          <div>
            <p className="hero-eyebrow">Hello, I'm</p>
            <h1>
              <span>M. C. K.</span>
              <span className="gradient-text">Perera</span>
            </h1>
          </div>

          <div className="role-line">
            {role}
            <span className="cursor-blink">|</span>
          </div>

          <p className="hero-description">
            Mobile-focused engineer building <strong>end-to-end mobile, web & backend systems</strong>. Proficient in{' '}
            <span className="flutter-text">Flutter</span>, <span className="react-text">React</span>, and{' '}
            <span className="spring-text">Spring Boot</span> with production cloud experience.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#projects">
              View My Work
            </a>
            <a className="secondary-button" href="#contact">
              Get In Touch
            </a>
          </div>

          <div className="social-row" aria-label="Social links">
            <SocialLink icon="github" label="GitHub" href={`https://github.com/${profile.github}`} />
            <SocialLink icon="linkedin" label="LinkedIn" href={`https://linkedin.com/in/${profile.linkedin}`} />
            <SocialLink icon="mail" label="Email" href={`mailto:${profile.email}`} />
            <SocialLink icon="external" label="Portfolio" href={`https://${profile.portfolio}`} />
          </div>
        </div>

        <div className="hero-visual">
          <div className="profile-orbit">
            <div className="rotating-ring rotating-ring-a" aria-hidden="true" />
            <div className="rotating-ring rotating-ring-b" aria-hidden="true" />
            <div className="profile-card card-3d">
              <div className="profile-image">
                <img
                  src="https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Workspace"
                />
                <div className="profile-image-overlay" />
                <div className="avatar-badge">CK</div>
              </div>
              <div className="profile-content">
                <h3>{profile.name}</h3>
                <p>Software Engineer · Sri Lanka</p>
                <div className="availability-pill">
                  <span />
                  Available for work
                </div>
                <div className="profile-stats">
                  {[
                    ['4+', 'Projects'],
                    ['2y+', 'Experience'],
                    ['20+', 'Tech'],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <span className="floating-label floating-label-a">Flutter</span>
            <span className="floating-label floating-label-b">Spring Boot</span>
            <span className="floating-label floating-label-c">React</span>
            <span className="floating-label floating-label-d">Docker</span>
          </div>
        </div>
      </div>

      <a className="scroll-hint" href="#about">
        <span>Scroll</span>
        <span>↓</span>
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
  { icon: 'external', label: profile.portfolio, href: `https://${profile.portfolio}` },
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
                I'm a <strong>Mobile-focused Software Engineer</strong> with a BSc in Information Technology from the
                University of Jaffna. I specialise in building end-to-end mobile, web, and backend systems using
                full-stack and microservices architectures.
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
                ['4+', 'Projects'],
                ['2+', 'Yrs Experience'],
                ['20+', 'Technologies'],
                ['BSc', 'IT Degree'],
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

function Experience() {
  return (
    <section id="experience" className="section section-experience">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <SectionHeading index="02. Where I've Worked" title="Work" accent="Experience" />
        <div className="timeline">
          <div className="timeline-line" aria-hidden="true" />
          {experience.map((job, index) => (
            <article key={`${job.role}-${job.period}`} className={`timeline-row ${index % 2 ? 'timeline-row-right' : ''}`}>
              <span className={`timeline-dot ${job.current ? 'current' : ''}`} aria-hidden="true" />
              <div className="timeline-card card-3d">
                <div className="timeline-heading">
                  <span className="job-icon">
                    <Icon name="briefcase" size={13} />
                  </span>
                  <div>
                    <div className="job-title-line">
                      <h3>{job.role}</h3>
                      {job.current ? <span className="now-badge">Now</span> : null}
                    </div>
                    <p>{job.org}</p>
                  </div>
                </div>
                <div className="job-period">
                  <Icon name="calendar" size={10} /> {job.period}
                </div>
                <p className="job-description">{job.detail}</p>
                <div className="tag-row">
                  {job.tags.map((tag) => (
                    <span key={tag} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ProjectLinks({ project }) {
  return (
    <div className="project-links">
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        <Icon name="external" size={13} /> View Project
      </a>
      <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
        <Icon name="github" size={13} /> GitHub
      </a>
    </div>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <article className={`${featured ? 'featured-project' : 'project-card'} card-3d`}>
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
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section id="projects" className="section section-projects">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <div className="projects-heading">
          <SectionHeading index="03. What I've Built" title="Featured" accent="Projects" align="left" />
          <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
            <Icon name="github" size={15} />
            View all on GitHub
            <Icon name="external" size={13} />
          </a>
        </div>
        <ProjectCard project={projects[0]} featured />
        <div className="project-grid">
          {projects.slice(1).map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Planet({ planet, running, reducedMotion }) {
  const [angle, setAngle] = useState(planet.start);
  const frameRef = useRef();
  const previousRef = useRef();

  useEffect(() => {
    if (!running || reducedMotion) return undefined;
    const animate = (time) => {
      const elapsed = previousRef.current ? time - previousRef.current : 0;
      previousRef.current = time;
      setAngle((value) => (value + (360 / (planet.speed * 1000)) * elapsed) % 360);
      frameRef.current = window.requestAnimationFrame(animate);
    };
    frameRef.current = window.requestAnimationFrame(animate);
    return () => {
      previousRef.current = undefined;
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [planet.speed, reducedMotion, running]);

  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * planet.radius;
  const y = Math.sin(radians) * planet.radius;
  return (
    <span
      className="skill-planet"
      title={planet.label}
      style={{
        width: planet.size,
        height: planet.size,
        transform: `translate(${x - planet.size / 2}px, ${y - planet.size / 2}px)`,
        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,.18), ${planet.color})`,
        boxShadow: `0 0 14px 3px ${planet.color}55, inset 0 0 8px rgba(255,255,255,.06)`,
        borderColor: `${planet.color}66`,
      }}
    >
      {planet.label}
    </span>
  );
}

function SolarSystem({ running, setRunning }) {
  const reducedMotion = useReducedMotion();
  const stars = useMemo(
    () =>
      Array.from({ length: 55 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`,
      })),
    [],
  );

  return (
    <div
      className="solar-system"
      onMouseEnter={() => setRunning(false)}
      onMouseLeave={() => setRunning(true)}
      aria-label="Interactive solar system showing technical skills"
    >
      {stars.map((star) => (
        <span key={star.id} className="solar-star" style={star} />
      ))}
      {[84, 146, 208].map((radius) => (
        <span
          key={radius}
          className="orbit-line"
          style={{ width: radius * 2 + 4, height: radius * 2 + 4 }}
          aria-hidden="true"
        />
      ))}
      <div className="solar-core">
        <span className="pulse-ring pulse-ring-one" />
        <span className="pulse-ring pulse-ring-two" />
        <span className="pulse-ring pulse-ring-three" />
        <strong>DEV</strong>
      </div>
      {planets.map((planet) => (
        <Planet key={planet.label} planet={planet} running={running} reducedMotion={reducedMotion} />
      ))}
      <div className="orbit-legend">
        <span>Languages</span>
        <span>Frameworks</span>
        <span>Backend / DevOps</span>
      </div>
    </div>
  );
}

function Skills() {
  const [revealRef, visible] = useInView(0.1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (visible) setRunning(true);
  }, [visible]);

  return (
    <section id="skills" className="section section-skills">
      <div className="section-divider" />
      <div className="nebula nebula-a" aria-hidden="true" />
      <div className="nebula nebula-b" aria-hidden="true" />
      <div ref={revealRef} className={`section-inner reveal ${visible ? 'is-visible' : ''}`}>
        <SectionHeading
          index="04. What I Know"
          title="Technical"
          accent="Skills"
          description="An interactive solar system of my tech stack — hover any planet to explore."
        />
        <div className="skills-layout">
          <SolarSystem running={running} setRunning={setRunning} />
          <div className="skills-details">
            <div>
              <h3 className="subheading">
                <span /> Core Proficiencies
              </h3>
              <div className="proficiency-list">
                {proficiencies.map((item, index) => (
                  <div key={item.label}>
                    <div className="proficiency-label">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="progress-track">
                      <span
                        className="progress-fill"
                        style={{
                          width: visible ? `${item.value}%` : 0,
                          transitionDelay: `${index * 100 + 200}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="subheading">
                <span /> Full Stack
              </h3>
              <div className="stack-groups">
                {skillGroups.map((group) => (
                  <div key={group.label} className="stack-group">
                    <strong>{group.label}</strong>
                    <div className="tag-row">
                      {group.items.map((item) => (
                        <span key={item} className="tech-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section section-education">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <SectionHeading index="05. Where I Studied" title="Education &" accent="Certifications" />
        <div className="education-layout">
          <div>
            <p className="column-label">
              <Icon name="graduation" size={13} /> Academic Background
            </p>
            <div className="education-list">
              {education.map((item) => (
                <article key={`${item.title}-${item.period}`} className="education-card card-3d">
                  <span className="education-icon">
                    <Icon name="graduation" size={14} />
                  </span>
                  <div>
                    <div className="education-title">
                      <h3>{item.title}</h3>
                      {item.badge ? <span>{item.badge}</span> : null}
                    </div>
                    <p className="education-org">{item.org}</p>
                    <p className="education-period">
                      <Icon name="calendar" size={10} /> {item.period}
                    </p>
                    <p className="education-description">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="education-side">
            <div>
              <p className="column-label">
                <Icon name="award" size={13} /> Certifications
              </p>
              <div className="certification-list">
                {certifications.map((cert) => (
                  <article key={cert.title} className="certification-card card-3d">
                    <span className="certification-icon">
                      <Icon name="award" size={13} />
                    </span>
                    <div>
                      <h3>{cert.title}</h3>
                      <p>
                        {cert.org} <span>{cert.year}</span>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="references-panel">
              <div className="panel-title">References</div>
              <div className="references-list">
                <div>
                  <strong>Dr. T. Kartheeswaran</strong>
                  <span>Senior Lecturer Gr. II · University of Vavuniya</span>
                </div>
                <div>
                  <strong>Ms. H.A.I. Perera</strong>
                  <span>Chief Internal Auditor · Ministry of Digital Economy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const timerRef = useRef();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    setSending(true);
    timerRef.current = window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const reset = () => {
    setSent(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="section section-contact">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <SectionHeading
          index="06. Get In Touch"
          title="Let's"
          accent="Connect"
          description="Whether you have a project, want to collaborate, or just want to say hello — my inbox is always open."
        />
        <div className="contact-layout">
          <div className="contact-column">
            {contactItems.map((item) => (
              <ContactItem key={item.label} item={item} />
            ))}
            <div className="available-card">
              <div>
                <span />
                <strong>Available Now</strong>
              </div>
              <p>Open to full-time, freelance, and collaboration.</p>
            </div>
          </div>

          <div className="message-panel">
            <div className="panel-title">Send a Message</div>
            {sent ? (
              <div className="success-state" role="status">
                <span className="success-icon">
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
                <button className="submit-button" type="submit" disabled={sending}>
                  {sending ? <span className="spinner" aria-label="Sending" /> : <Icon name="send" size={15} />}
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a href="#hero" aria-label="Back to top">
        <Brand small />
      </a>
      <p>© 2026 {profile.name} · All rights reserved</p>
      <div className="footer-socials">
        <SocialLink icon="github" label="GitHub" href={`https://github.com/${profile.github}`} />
        <SocialLink icon="linkedin" label="LinkedIn" href={`https://linkedin.com/in/${profile.linkedin}`} />
        <SocialLink icon="mail" label="Email" href={`mailto:${profile.email}`} />
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="bolt-shell">
      <Helmet>
        <title>ChamXdev — Software Engineer Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Chamuditha Perera, a mobile-focused software engineer building modern mobile, web, and backend systems."
        />
        <meta name="theme-color" content="#00020a" />
        <link rel="icon" href={withBase('/assets/imgs/favicon.ico')} />
      </Helmet>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
