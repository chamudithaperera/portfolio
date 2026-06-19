const defaultProjects = [
  {
    title: 'Money Manager App',
    category: 'Flutter mobile system',
    image: '/assets/imgs/works/moneymanager.png',
    summary:
      'A local-first personal finance app with wallet tracking, savings goals, wishlist planning, budgets, charts, CSV export, and PDF generation.',
    featuredNote: 'Personal finance companion',
    tags: ['Flutter', 'Riverpod', 'SQLite', 'SharedPreferences'],
    highlights: [
      'Offline-first finance tracking with clean wallet and balance views.',
      'Savings goals, wishlist planning, budgeting, charts, CSV export, and PDF reporting.',
      'Built to keep users in control of daily spending and long-term targets.',
    ],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_flutter-nodejs-mongodb-activity-7355636008446554112-3I2I?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
    display_order: 1,
    is_featured: true,
  },
  {
    title: 'EduLink Peer Tutoring Platform',
    category: 'Web product',
    image: '/assets/imgs/works/edupro.jpeg',
    summary:
      'A full-stack tutoring platform with authentication, course enrollment, scheduling, messaging, admin tools, and analytics.',
    featuredNote: 'Learning platform case study',
    tags: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    highlights: [
      'Full-stack tutoring workflow with authentication, course enrollment, and scheduling.',
      'Messaging, admin tools, and analytics to support tutors and students in one place.',
      'Designed for a clear, approachable learning experience across devices.',
    ],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_edulink-finalyearproject-mernstack-activity-7313985622233255936-t0Iq?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
    display_order: 2,
    is_featured: false,
  },
  {
    title: 'Weather App',
    category: 'Realtime mobile experience',
    image: '/assets/imgs/works/weatherApp.jpeg',
    summary:
      'A responsive Flutter weather app with real-time updates, hourly and daily forecasts, geolocation, and live city search.',
    featuredNote: 'Live weather companion',
    tags: ['Flutter', 'Dart', 'OpenWeatherMap API', 'Geolocator'],
    highlights: [
      'Responsive weather experience with live forecasts, hourly data, and geolocation.',
      'City search and location-aware views make it quick to check current conditions.',
      'Focuses on clarity, speed, and simple decision-making for users on the move.',
    ],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_flutter-mobileapp-weatherapp-activity-7325197536418238464-_Ua0?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
    display_order: 3,
    is_featured: false,
  },
  {
    title: 'Avurudu Nakath App',
    category: 'Cultural utility app',
    image: '/assets/imgs/works/avuruduApp.jpeg',
    summary:
      'A Sinhala and Tamil New Year app with Nakath schedules, ritual details, and push notifications for timely reminders.',
    featuredNote: 'Festival planning app',
    tags: ['Flutter', 'Countdown Timer', 'Local Notifications'],
    highlights: [
      'Nakath schedules, ritual details, and reminder-first timing for the New Year season.',
      'Push notifications help users stay on time for culturally important moments.',
      'Built to keep a traditional experience simple and accessible on mobile.',
    ],
    link:
      'https://www.linkedin.com/posts/chamudithaperera_avurudunakath2025-mobileapp-playstore-activity-7309530321211822080-RZB2?utm_source=share&utm_medium=member_desktop&rcm=ACoAADv_p4oBFtTlgvKKEnBZFbOOZSYkv0AiyxQ',
    display_order: 4,
    is_featured: false,
  },
];

const defaultEducation = [
  {
    track: 'Degree',
    title: 'BSc in Information Technology',
    org: 'University of Jaffna',
    period: '2022 Oct — 2025 Jul',
    detail:
      'Built a strong foundation in programming, algorithms, databases, operating systems, networking, mobile computing, and security. Focused on practical project delivery and clean technical problem-solving.',
    display_order: 1,
  },
  {
    track: 'Diploma',
    title: 'Diploma in Information Technology',
    org: 'IMBS Green Campus',
    period: '2021 — 2022',
    badge: 'GPA 3.73',
    detail:
      'Completed a 30-credit diploma with a 3.73 GPA covering hardware, networking, web engineering, and software engineering. Finished with a software development project and hands-on team work.',
    display_order: 2,
  },
  {
    track: 'School',
    title: 'A/L Technology Stream',
    org: 'Ananda Sastralaya, Matugama',
    period: '2020',
    detail:
      'Studied Science for Technology, ICT, and Engineering Technology, which strengthened analytical thinking and technical discipline. It created the academic bridge into software and systems work.',
    display_order: 3,
  },
  {
    track: 'School',
    title: 'O/L',
    org: 'Tissa Central College, Kalutara',
    period: '2017',
    detail:
      'Completed a broad academic base with strong results in Mathematics, ICT, Commerce, and Science. That foundation supported the later move into IT-focused study and career growth.',
    display_order: 4,
  },
];

const defaultCertificates = [
  {
    title: 'AI/ML Engineer — Stage 1',
    org: 'SLIIT',
    year: '2026',
    detail: 'Hands-on learning around model building, experimentation, and practical AI workflows.',
    display_order: 1,
  },
  {
    title: 'Dart & Flutter Development Course',
    org: 'Udemy',
    year: '2024',
    detail: 'Focused on mobile UI systems, state management, and clean app structure.',
    display_order: 2,
  },
  {
    title: 'IT for Business Success',
    org: 'HP',
    year: '2021',
    detail: 'Covered digital productivity, business workflows, and everyday office systems.',
    display_order: 3,
  },
];

module.exports = {
  defaultCertificates,
  defaultEducation,
  defaultProjects,
};
