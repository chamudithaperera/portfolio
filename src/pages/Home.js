import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import withBase from '../utils/basePath';

const navItems = [
  { label: 'Systems', href: '#systems' },
  { label: 'Stack', href: '#stack' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const stats = [
  { value: 'Flutter + React', label: 'Mobile and web delivery' },
  { value: 'Spring Boot + AWS', label: 'Scalable backend systems' },
  { value: 'UI/UX + Figma', label: 'Product thinking and prototyping' },
  { value: 'BSc IT', label: 'University of Jaffna' },
];

const systems = [
  {
    title: 'Mobile intelligence',
    text:
      'Flutter-first product builds for Android and iOS with fast iteration, polished UI, and local-first experiences.',
  },
  {
    title: 'Web control surfaces',
    text:
      'React and TypeScript interfaces for dashboards, admin portals, and customer-facing products with clean information hierarchy.',
  },
  {
    title: 'Backend orchestration',
    text:
      'Spring Boot and Node.js services with JWT, REST APIs, caching, WebSockets, and database design for production workflows.',
  },
];

const stackGroups = [
  {
    title: 'Languages',
    items: ['Dart', 'Java', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'PHP'],
  },
  {
    title: 'Frontend and Mobile',
    items: ['Flutter', 'React', 'React Native', 'Tailwind CSS', 'Riverpod'],
  },
  {
    title: 'Backend and Data',
    items: ['Spring Boot', 'Node.js', 'Express.js', 'Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'JWT', 'REST APIs'],
  },
  {
    title: 'DevOps and Design',
    items: ['Docker', 'Kubernetes', 'Helm', 'Nginx', 'AWS', 'GitHub Actions', 'Figma', 'Photoshop', 'Postman'],
  },
];

const experience = [
  {
    role: 'Associate Software Engineer',
    org: 'W3Inventor',
    period: '2026 Mar - Present',
    detail:
      'Building ride-hailing and pooling systems with Flutter, React/TypeScript, and Spring Boot microservices, including trip planning, live tracking, bookings, notifications, and deployment workflows.',
  },
  {
    role: 'Intern Mobile Application Developer',
    org: 'W3Inventor',
    period: '2025 Sep - 2026 Mar',
    detail:
      'Contributed to Flutter ride-hailing app development, API integration, authentication flows, and debugging in a microservices-based architecture.',
  },
  {
    role: 'Intern UI/UX Designer',
    org: 'Kyranz IT',
    period: '2024 Dec - 2025 Sep',
    detail:
      'Created user-friendly web and mobile interfaces, wireframes, and prototypes in Figma while supporting responsive product design.',
  },
  {
    role: 'Intern UI/UX Designer',
    org: 'Web99x',
    period: '2024 Jun - 2024 Dec',
    detail:
      'Crafted wireframes, mockups, and prototypes in Figma, collaborating with developers to ship cleaner user-focused interfaces.',
  },
  {
    role: 'Bank Trainee',
    org: 'Peoples\' Bank, International Banking Division',
    period: '2021 Dec - 2022 Jun',
    detail:
      'Supported import bills processing, document verification, and daily operations in international trade finance.',
  },
];

const projects = [
  {
    title: 'Money Manager App',
    kind: 'Flutter mobile system',
    image: '/assets/imgs/works/moneymanager.png',
    summary:
      'A local-first personal finance app with wallet tracking, savings goals, wishlist planning, budgets, charts, CSV export, and PDF generation.',
    tech: ['Flutter', 'Riverpod', 'SQLite', 'SharedPreferences', 'Charts'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_flutter-nodejs-mongodb-activity-7355636008446554112-3I2I?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'EduLink Peer Tutoring Platform',
    kind: 'Web product',
    image: '/assets/imgs/works/edupro.jpeg',
    summary:
      'A full-stack student tutoring platform with authentication, course enrollment, scheduling, messaging, admin tools, and analytics.',
    tech: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_edulink-finalyearproject-mernstack-activity-7313985622233255936-t0Iq?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'Weather App',
    kind: 'Realtime mobile experience',
    image: '/assets/imgs/works/weatherApp.jpeg',
    summary:
      'A responsive Flutter weather app with real-time updates, hourly and daily forecasts, geolocation, and live city search.',
    tech: ['Flutter', 'Dart', 'OpenWeatherMap API', 'Geolocator'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_flutter-mobileapp-weatherapp-activity-7325197536418238464-_Ua0?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'Avurudu Nakath App',
    kind: 'Cultural utility app',
    image: '/assets/imgs/works/avuruduApp.jpeg',
    summary:
      'A Sinhala and Tamil New Year app with Nakath schedules, ritual details, and push notifications for timely reminders.',
    tech: ['Flutter', 'Countdown Timer', 'Local Notifications'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_avurudunakath2025-mobileapp-playstore-activity-7309530321211822080-RZB2?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'Resume Maker',
    kind: 'Productivity tool',
    image: '/assets/imgs/works/resumeMaker.jpeg',
    summary:
      'A modern resume builder with four templates, live previews, guided forms, social sharing, and high-quality PDF export.',
    tech: ['Flutter', 'Google Fonts', 'Path Provider', 'Image Picker', 'PDF'],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_flutter-dart-resumemaker-activity-7319021500181753856-K47X?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
  },
  {
    title: 'Ride-hailing Platform',
    kind: 'Current production work',
    image: null,
    summary:
      'A live ride-hailing and pooling platform with passenger and driver apps, admin web panels, Spring Boot services, Redis, MQTT, Firebase, and AWS deployment.',
    tech: ['Flutter', 'React', 'Spring Boot', 'PostgreSQL', 'Redis', 'MQTT', 'AWS'],
    link: '',
  },
];

const education = [
  {
    title: 'BSc in Information Technology',
    org: 'University of Jaffna',
    period: '2022 Oct - 2025 Jul',
    detail:
      'Focused on programming, algorithms, web systems, database design, operating systems, networks, mobile computing, security, and project-based software delivery.',
  },
  {
    title: 'Diploma in Information Technology',
    org: 'IMBS Green Campus',
    period: '2021 - 2022',
    detail:
      'Completed a 30-credit diploma with a 3.73 GPA, covering hardware, networking, web engineering, software engineering, and a software development project.',
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
  'AI/ML Engineer - Stage 1, SLIIT (2026)',
  'Dart & Flutter Development Course, Udemy (2024)',
  'IT for Business Success, HP (2021)',
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

function SectionTitle({ kicker, title, description }) {
  return (
    <div className="section-title">
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}

function Chip({ children }) {
  return <span className="chip">{children}</span>;
}

function Home() {
  return (
    <div className="site-shell">
      <Helmet>
        <title>ChamXdev | Software Engineer Portfolio</title>
        <meta
          name="description"
          content="Modern dark portfolio website for Chamuditha Perera, a software engineer focused on Flutter, React, Spring Boot, and production-ready mobile and web systems."
        />
        <meta name="theme-color" content="#050816" />
        <link rel="icon" href={withBase('/assets/imgs/favicon.ico')} />
        <link rel="shortcut icon" href={withBase('/assets/imgs/favicon.ico')} />
      </Helmet>

      <div className="background-layer" aria-hidden="true">
        <span className="orb orb-cyan" />
        <span className="orb orb-violet" />
        <span className="orb orb-orange" />
        <span className="grid-overlay" />
        <span className="noise-overlay" />
      </div>

      <header className="topbar">
        <a className="brand" href="#home" aria-label="ChamXdev home">
          <span className="brand-mark">CX</span>
          <span className="brand-text">
            <strong>ChamXdev</strong>
            <small>Software engineer portfolio</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href={withBase('/ChamudithaPereraCV1.pdf')} target="_blank" rel="noreferrer">
          Download CV
        </a>
      </header>

      <main className="page" id="home">
        <motion.section
          className="hero section-grid"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div className="hero-copy" variants={fadeUp}>
            <p className="eyebrow">AI samurai interface | Mobile | Web | Backend</p>
            <h1>
              Steel-forged software for modern mobile and web products.
            </h1>
            <p className="hero-text">
              I am Chamuditha Perera, a software engineer with a BSc in Information Technology
              from the University of Jaffna. I build polished mobile apps, web interfaces, and
              scalable backend systems with a darker, more futuristic product language.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                Explore Projects
              </a>
              <a className="btn btn-secondary" href="#contact">
                Contact Me
              </a>
            </div>

            <div className="hero-tags" aria-label="Core stack">
              <Chip>Flutter</Chip>
              <Chip>React</Chip>
              <Chip>Spring Boot</Chip>
              <Chip>TypeScript</Chip>
              <Chip>AWS</Chip>
              <Chip>Figma</Chip>
            </div>

            <div className="hero-feature-strip">
              <article className="glass-card hero-feature-card">
                <span className="panel-label">Mode</span>
                <strong>Product engineering with a cinematic finish</strong>
              </article>
              <article className="glass-card hero-feature-card">
                <span className="panel-label">Style</span>
                <strong>Dark metal, cyan glow, precise spacing</strong>
              </article>
            </div>
          </motion.div>

          <motion.div className="hero-visual" variants={fadeUp}>
            <div className="hero-orbit">
              <div className="samurai-stage glass-card">
                <div className="samurai-plate" aria-hidden="true" />
                <img
                  src={withBase('/assets/imgs/hero/samurai-ai.png')}
                  alt="Futuristic samurai AI artwork"
                  className="samurai-image"
                />
                <div className="samurai-scan" />
                <div className="floating-panel samurai-badge badge-top">
                  <span className="panel-label">Reference Mood</span>
                  <strong>Samurai AI / Dark metal</strong>
                </div>
                <div className="floating-panel samurai-badge badge-left">
                  <span className="panel-label">Design DNA</span>
                  <strong>3D depth, clean panels, blue glow</strong>
                </div>
                <div className="floating-panel samurai-badge badge-right">
                  <span className="panel-label">System</span>
                  <strong>Focused, futuristic, premium</strong>
                </div>
              </div>

              <div className="hero-metric-row">
                <article className="glass-card hero-metric-card">
                  <span className="panel-label">Stack</span>
                  <strong>Flutter • React • Spring Boot</strong>
                </article>
                <article className="glass-card hero-metric-card">
                  <span className="panel-label">Role</span>
                  <strong>Associate Software Engineer</strong>
                </article>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="stats-grid"
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {stats.map((stat) => (
            <motion.article className="stat-card" key={stat.label} variants={fadeUp}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </motion.article>
          ))}
        </motion.section>

        <motion.section
          className="content-section"
          id="systems"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <SectionTitle
            kicker="Systems"
            title="A portfolio built like a product surface"
            description="The layout is organized around the kinds of systems I actually build: mobile apps, web control panels, and backend services that behave like one cohesive platform."
          />

          <div className="systems-grid">
            {systems.map((item, index) => (
              <article className="glass-card system-card" key={item.title}>
                <div className="card-index">0{index + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          id="stack"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <SectionTitle
            kicker="Stack"
            title="Capabilities shaped for mobile-first, full-stack delivery"
            description="The skill system below reflects your CV and current work: Flutter and React at the front, Spring Boot and Node.js in the middle, and Docker, AWS, and Kubernetes around the edges."
          />

          <div className="stack-grid">
            {stackGroups.map((group) => (
              <article className="glass-card stack-card" key={group.title}>
                <h3>{group.title}</h3>
                <div className="stack-chips">
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          id="experience"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <SectionTitle
            kicker="Experience"
            title="Built across product, design, and engineering roles"
            description="This timeline uses your resume details and keeps the focus on progression: from UI/UX work into mobile development and now into full-stack systems."
          />

          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item glass-card" key={`${item.role}-${item.period}`}>
                <div className="timeline-meta">
                  <span className="timeline-period">{item.period}</span>
                  <span className="timeline-org">{item.org}</span>
                </div>
                <h3>{item.role}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          id="projects"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <SectionTitle
            kicker="Projects"
            title="Selected work with strong visual presence"
            description="These featured projects are pulled from the CV and your existing assets so the portfolio feels grounded in real work, not placeholder content."
          />

          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card glass-card" key={project.title}>
                <div className="project-media">
                  {project.image ? (
                    <img src={withBase(project.image)} alt={project.title} />
                  ) : (
                    <div className="project-placeholder">
                      <span className="placeholder-mark">CX</span>
                      <p>Architecture-first system design</p>
                    </div>
                  )}
                </div>

                <div className="project-body">
                  <div className="project-topline">
                    <span>{project.kind}</span>
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      <span className="project-live">In progress</span>
                    )}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="stack-chips project-chips">
                    {project.tech.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="content-section split-section"
          id="education"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <SectionTitle
            kicker="Education and Certifications"
            title="The foundation behind the portfolio"
            description="A compact view of the degrees, coursework, and certifications that back the engineering and product work."
          />

          <div className="education-grid">
            <div className="stack-card glass-card">
              <h3>Education</h3>
              <div className="vertical-list">
                {education.map((item) => (
                  <article key={`${item.title}-${item.period}`} className="mini-entry">
                    <div className="mini-entry-head">
                      <strong>{item.title}</strong>
                      <span>{item.period}</span>
                    </div>
                    <p>
                      {item.org}
                      <br />
                      {item.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="stack-card glass-card">
              <h3>Certifications</h3>
              <div className="vertical-list">
                {certifications.map((item) => (
                  <div className="mini-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="content-section contact-section"
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <SectionTitle
            kicker="Contact"
            title="Ready to build the next interface"
            description="If you want this site to become a product page, a hiring portfolio, or a personal brand landing page, this is the right place to start the conversation."
          />

          <div className="contact-panel glass-card">
            <div>
              <p className="contact-label">Email</p>
              <a href="mailto:chamudithaperera.dev@gmail.com">chamudithaperera.dev@gmail.com</a>
            </div>
            <div>
              <p className="contact-label">Portfolio</p>
              <a href="https://chamxdev.vercel.app" target="_blank" rel="noreferrer">
                chamxdev.vercel.app
              </a>
            </div>
            <div>
              <p className="contact-label">GitHub</p>
              <a href="https://github.com/chamudithaperera" target="_blank" rel="noreferrer">
                github.com/chamudithaperera
              </a>
            </div>
            <div>
              <p className="contact-label">LinkedIn</p>
              <a href="https://www.linkedin.com/in/chamudithaperera/" target="_blank" rel="noreferrer">
                linkedin.com/in/chamudithaperera
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="site-footer">
        <span>ChamXdev</span>
        <span>Dark portfolio system, rebuilt from your CV.</span>
      </footer>
    </div>
  );
}

export default Home;
