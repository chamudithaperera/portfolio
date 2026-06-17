import React from 'react';
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

const stats = [
  { value: '4+', label: 'Projects' },
  { value: '2y+', label: 'Experience' },
  { value: '20+', label: 'Tech' },
];

const skills = [
  {
    title: 'Languages',
    items: ['Dart', 'Java', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'PHP'],
  },
  {
    title: 'Frontend & Mobile',
    items: ['Flutter', 'React', 'React Native', 'Tailwind CSS', 'Riverpod'],
  },
  {
    title: 'Backend & Data',
    items: ['Spring Boot', 'Node.js', 'Express.js', 'Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'JWT', 'REST APIs'],
  },
  {
    title: 'DevOps & Design',
    items: ['Docker', 'Kubernetes', 'Helm', 'Nginx', 'AWS', 'GitHub Actions', 'Figma', 'Photoshop', 'Postman'],
  },
];

const experience = [
  {
    period: '2026 Mar - Present',
    role: 'Associate Software Engineer',
    org: 'W3Inventor',
    detail:
      'Building ride-hailing and pooling systems with Flutter, React/TypeScript, and Spring Boot microservices, including trip planning, live tracking, bookings, notifications, and deployment workflows.',
  },
  {
    period: '2025 Sep - 2026 Mar',
    role: 'Intern Mobile Application Developer',
    org: 'W3Inventor',
    detail:
      'Contributed to Flutter ride-hailing app development, API integration, authentication flows, and debugging in a microservices-based architecture.',
  },
  {
    period: '2024 Dec - 2025 Sep',
    role: 'Intern UI/UX Designer',
    org: 'Kyranz IT',
    detail:
      'Created user-friendly web and mobile interfaces, wireframes, and prototypes in Figma while supporting responsive product design.',
  },
  {
    period: '2024 Jun - 2024 Dec',
    role: 'Intern UI/UX Designer',
    org: 'Web99x',
    detail:
      'Crafted wireframes, mockups, and prototypes in Figma, collaborating with developers to ship cleaner user-focused interfaces.',
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

const education = [
  {
    title: 'BSc in Information Technology',
    org: 'University of Jaffna',
    period: '2022 Oct - 2025 Jul',
    detail:
      'Programming, algorithms, web systems, database design, operating systems, networks, mobile computing, security, and project-based delivery.',
  },
  {
    title: 'Diploma in Information Technology',
    org: 'IMBS Green Campus',
    period: '2021 - 2022',
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
  { title: 'AI/ML Engineer - Stage 1', org: 'SLIIT', year: '2026' },
  { title: 'Dart & Flutter Development Course', org: 'Udemy', year: '2024' },
  { title: 'IT for Business Success', org: 'HP', year: '2021' },
];

function SectionTitle({ kicker, title, description, centered = false }) {
  return (
    <div className={`section-title ${centered ? 'centered' : ''}`}>
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

function ContactRow({ label, value, href }) {
  const isLink = href && href !== '#';
  const content = (
    <>
      <div className="contact-row-label">{label}</div>
      <div className="contact-row-value">{value}</div>
    </>
  );

  if (!isLink) {
    return <div className="contact-row">{content}</div>;
  }

  return (
    <a className="contact-row" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {content}
    </a>
  );
}

function Home() {
  return (
    <div className="bolt-shell">
      <Helmet>
        <title>ChamXdev — Software Engineer Portfolio</title>
        <meta
          name="description"
          content="A modern dark portfolio for Chamuditha Perera, built with a Bolt-inspired 3D UI and CV-driven content."
        />
        <meta name="theme-color" content="#080b14" />
        <link rel="icon" href={withBase('/assets/imgs/favicon.ico')} />
        <link rel="shortcut icon" href={withBase('/assets/imgs/favicon.ico')} />
      </Helmet>

      <div className="noise" aria-hidden="true" />
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />

      <nav className="top-nav">
        <a className="brand-link" href="#hero" aria-label="ChamXdev home">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </span>
          <span className="brand-wordmark">chamxdev</span>
        </a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <a className="nav-button" href="#contact">
          Hire Me
        </a>
      </nav>

      <main>
        <section id="hero" className="hero-section dot-grid">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-pill">
                <span className="pill-dot" />
                Open to new opportunities
              </div>

              <p className="eyebrow">HELLO, I'M</p>
              <h1 className="hero-name">
                <span className="hero-name-top">M. C. K.</span>
                <span className="hero-name-bottom">Perera</span>
              </h1>

              <div className="role-line">
                Full Stack Developer<span className="cursor-blink">|</span>
              </div>

              <p className="hero-text">
                Mobile-focused engineer building <strong>end-to-end mobile, web & backend systems</strong>.
                Proficient in <span>Flutter</span>, <span>React</span>, and <span>Spring Boot</span> with
                production cloud experience.
              </p>

              <div className="hero-actions">
                <a className="primary-btn" href="#projects">
                  View My Work
                </a>
                <a className="secondary-btn" href="#contact">
                  Get In Touch
                </a>
              </div>

              <div className="social-links" aria-label="Social links">
                <a href="https://github.com/chamudithaperera" target="_blank" rel="noreferrer" aria-label="GitHub">
                  GH
                </a>
                <a href="https://linkedin.com/in/chamudithaperera" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  IN
                </a>
                <a href="mailto:chamudithaperera.dev@gmail.com" aria-label="Email">
                  @
                </a>
                <a href="https://chamxdev.vercel.app" target="_blank" rel="noreferrer" aria-label="Portfolio">
                  ↗
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-orbit">
                <div className="orb-ring orb-ring-a" />
                <div className="orb-ring orb-ring-b" />

                <div className="profile-card card-3d">
                  <div className="profile-hero-image">
                    <img src={withBase('/assets/imgs/hero/samurai-ai.png')} alt="Samurai AI theme" />
                    <div className="profile-hero-overlay" />
                    <div className="avatar-badge">CK</div>
                  </div>

                  <div className="profile-body">
                    <h3>M. C. K. Perera</h3>
                    <p>Software Engineer · Sri Lanka</p>

                    <div className="status-pill">
                      <span className="pill-dot" />
                      Available for work
                    </div>

                    <div className="mini-stats">
                      {stats.map((item) => (
                        <div key={item.label} className="mini-stat">
                          <strong>{item.value}</strong>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="float-chip float-chip-a">Flutter</span>
                <span className="float-chip float-chip-b">Spring Boot</span>
                <span className="float-chip float-chip-c">React</span>
                <span className="float-chip float-chip-d">Docker</span>
              </div>
            </div>
          </div>

          <a className="scroll-hint" href="#about">
            <span>Scroll</span>
            <span>↓</span>
          </a>
        </section>

        <section id="about" className="content-section">
          <div className="section-divider" />
          <div className="section-inner">
            <div className="section-head">
              <p className="section-index">01. Who I Am</p>
              <h2>
                About <span>Me</span>
              </h2>
            </div>

            <div className="about-grid">
              <div className="about-copy">
                <p>
                  I'm a <strong>mobile-focused software engineer</strong> with a BSc in Information Technology
                  from the University of Jaffna. I specialise in building end-to-end mobile, web, and backend
                  systems using full-stack and microservices architectures.
                </p>
                <p>
                  My core strengths are <strong>Flutter (Dart)</strong> for Android/iOS and <strong>React + TypeScript</strong>{' '}
                  for the web. On the backend I work with <strong>Java, Spring Boot</strong>, JWT auth, Redis,
                  WebSocket, and relational/NoSQL databases.
                </p>
                <p>
                  Skilled in Firebase, Google Maps APIs, MQTT, and AWS services including S3 and EKS. Hands-on with
                  <strong> Docker, Kubernetes, Helm, NGINX</strong>, and GitHub Actions CI/CD for production-grade
                  deployments.
                </p>

                <div className="metrics-grid">
                  <div className="metric-card">
                    <strong>4+</strong>
                    <span>Projects</span>
                  </div>
                  <div className="metric-card">
                    <strong>2+</strong>
                    <span>Yrs Experience</span>
                  </div>
                  <div className="metric-card">
                    <strong>20+</strong>
                    <span>Technologies</span>
                  </div>
                  <div className="metric-card">
                    <strong>BSc</strong>
                    <span>IT Degree</span>
                  </div>
                </div>
              </div>

              <aside className="contact-panel card-3d">
                <div className="contact-panel-header">Contact Information</div>
                <div className="contact-list">
                  <ContactRow label="Email" value="chamudithaperera.dev@gmail.com" href="mailto:chamudithaperera.dev@gmail.com" />
                  <ContactRow label="Phone" value="+94719153552" href="tel:+94719153552" />
                  <ContactRow label="Location" value="No 83, Galle Road, Kalutara North" href="#" />
                  <ContactRow label="GitHub" value="github.com/chamudithaperera" href="https://github.com/chamudithaperera" />
                  <ContactRow label="LinkedIn" value="linkedin.com/in/chamudithaperera" href="https://linkedin.com/in/chamudithaperera" />
                  <ContactRow label="Portfolio" value="chamxdev.vercel.app" href="https://chamxdev.vercel.app" />
                </div>
                <div className="availability-card">
                  <span className="pill-dot" />
                  <div>
                    <strong>Available Now</strong>
                    <p>Open to full-time, freelance, and collaboration.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="experience" className="content-section">
          <div className="section-divider" />
          <div className="section-inner">
            <SectionTitle
              kicker="02. Experience"
              title="Professional Timeline"
              description="A clean timeline of the engineering and design roles that shaped the portfolio."
            />

            <div className="timeline">
              {experience.map((item) => (
                <article key={`${item.role}-${item.period}`} className="timeline-card card-3d">
                  <div className="timeline-meta">
                    <span>{item.period}</span>
                    <span>{item.org}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="content-section">
          <div className="section-divider" />
          <div className="section-inner">
            <SectionTitle
              kicker="03. Projects"
              title="Selected Work"
              description="Featured projects pulled from your CV and existing assets."
            />

            <div className="projects-grid">
              {projects.map((project) => (
                <article key={project.title} className="project-card card-3d">
                  <div className="project-media">
                    <img src={withBase(project.image)} alt={project.title} />
                    <div className="project-media-overlay" />
                    <a className="project-open" href={project.link} target="_blank" rel="noreferrer">
                      OPEN
                    </a>
                  </div>

                  <div className="project-body">
                    <div className="project-kicker">{project.category}</div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="chip-row">
                      {project.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="content-section">
          <div className="section-divider" />
          <div className="section-inner">
            <SectionTitle
              kicker="04. Skills"
              title="Capabilities"
              description="The stack is shaped around the actual technologies used in your resume."
            />

            <div className="skills-grid">
              {skills.map((group) => (
                <article key={group.title} className="skill-card card-3d">
                  <h3>{group.title}</h3>
                  <div className="chip-row">
                    {group.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="content-section">
          <div className="section-divider" />
          <div className="section-inner">
            <SectionTitle
              kicker="05. Education"
              title="Education and Certifications"
              description="A polished summary of the academic path and credentials."
            />

            <div className="education-grid">
              <div className="education-list">
                {education.map((item) => (
                  <article key={`${item.title}-${item.period}`} className="education-card card-3d">
                    <div className="education-head">
                      <h3>{item.title}</h3>
                      <span>{item.period}</span>
                    </div>
                    <p className="education-org">{item.org}</p>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>

              <div className="education-side">
                <article className="cert-card card-3d">
                  <div className="side-title">Certifications</div>
                  <div className="cert-list">
                    {certifications.map((cert) => (
                      <div key={cert.title} className="cert-item">
                        <strong>{cert.title}</strong>
                        <span>
                          {cert.org} · {cert.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="refs-card card-3d">
                  <div className="side-title">References</div>
                  <div className="ref-item">
                    <strong>Dr. T. Kartheeswaran</strong>
                    <span>Senior Lecturer Gr. II, University of Vavuniya</span>
                  </div>
                  <div className="ref-item">
                    <strong>Ms. H.A.I. Perera</strong>
                    <span>Chief Internal Auditor, Ministry of Digital Economy</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="content-section">
          <div className="section-divider" />
          <div className="section-inner">
            <SectionTitle
              kicker="06. Get In Touch"
              title="Let's Connect"
              description="Whether you have a project, want to collaborate, or just want to say hello — my inbox is always open."
              centered
            />

            <div className="contact-grid">
              <div className="contact-links card-3d">
                <ContactRow label="Email" value="chamudithaperera.dev@gmail.com" href="mailto:chamudithaperera.dev@gmail.com" />
                <ContactRow label="Phone" value="+94719153552" href="tel:+94719153552" />
                <ContactRow label="Location" value="Kalutara, Sri Lanka" href="#" />
                <ContactRow label="GitHub" value="github.com/chamudithaperera" href="https://github.com/chamudithaperera" />
                <ContactRow label="LinkedIn" value="linkedin.com/in/chamudithaperera" href="https://linkedin.com/in/chamudithaperera" />
                <ContactRow label="Portfolio" value="chamxdev.vercel.app" href="https://chamxdev.vercel.app" />

                <div className="availability-card compact">
                  <span className="pill-dot" />
                  <div>
                    <strong>Available Now</strong>
                    <p>Open to full-time, freelance, and collaboration.</p>
                  </div>
                </div>
              </div>

              <div className="message-card card-3d">
                <div className="message-head">Send a Message</div>
                <form className="message-form" onSubmit={(event) => event.preventDefault()}>
                  <div className="form-row">
                    <label>
                      <span>Name</span>
                      <input type="text" placeholder="Your name" name="name" />
                    </label>
                    <label>
                      <span>Email</span>
                      <input type="email" placeholder="your@email.com" name="email" />
                    </label>
                  </div>
                  <label>
                    <span>Subject</span>
                    <input type="text" placeholder="What's this about?" name="subject" />
                  </label>
                  <label>
                    <span>Message</span>
                    <textarea rows="5" placeholder="Tell me about your project or opportunity..." name="message" />
                  </label>
                  <button type="submit" className="primary-btn submit-btn">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark small">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </span>
          <span>chamxdev</span>
        </div>
        <p>© 2026 M. C. K. Perera · All rights reserved</p>
        <div className="footer-socials">
          <a href="https://github.com/chamudithaperera" target="_blank" rel="noreferrer">
            GH
          </a>
          <a href="https://linkedin.com/in/chamudithaperera" target="_blank" rel="noreferrer">
            IN
          </a>
          <a href="mailto:chamudithaperera.dev@gmail.com">@</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
