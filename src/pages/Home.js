import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
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

const locationUrl =
  'https://www.google.com/maps/search/?api=1&query=No+83%2C+Galle+Road%2C+Kalutara+North%2C+Sri+Lanka';

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
  { label: 'Dart', radius: 110, size: 44, speed: 14, color: '#0ea5e9', glow: '#0ea5e9', start: 0 },
  { label: 'TypeScript', radius: 110, size: 44, speed: 14, color: '#3b82f6', glow: '#3b82f6', start: 72 },
  { label: 'Java', radius: 110, size: 44, speed: 14, color: '#2563eb', glow: '#2563eb', start: 144 },
  { label: 'JS', radius: 110, size: 44, speed: 14, color: '#1d4ed8', glow: '#1d4ed8', start: 216 },
  { label: 'PHP', radius: 110, size: 44, speed: 14, color: '#1e40af', glow: '#1e40af', start: 288 },
  { label: 'Flutter', radius: 190, size: 50, speed: 20, color: '#0284c7', glow: '#0284c7', start: 30 },
  { label: 'React', radius: 190, size: 50, speed: 20, color: '#0369a1', glow: '#0369a1', start: 102 },
  { label: 'Spring', radius: 190, size: 50, speed: 20, color: '#075985', glow: '#075985', start: 174 },
  { label: 'Node.js', radius: 190, size: 50, speed: 20, color: '#0c4a6e', glow: '#0c4a6e', start: 246 },
  { label: 'Tailwind', radius: 190, size: 50, speed: 20, color: '#164e63', glow: '#164e63', start: 318 },
  { label: 'Docker', radius: 275, size: 54, speed: 32, color: '#1e3a5f', glow: '#2563eb', start: 10 },
  { label: 'Kubernetes', radius: 275, size: 54, speed: 32, color: '#172554', glow: '#1d4ed8', start: 70 },
  { label: 'PostgreSQL', radius: 275, size: 54, speed: 32, color: '#0c2340', glow: '#0284c7', start: 130 },
  { label: 'Redis', radius: 275, size: 54, speed: 32, color: '#0f1f3d', glow: '#0369a1', start: 190 },
  { label: 'Firebase', radius: 275, size: 54, speed: 32, color: '#0a1628', glow: '#0ea5e9', start: 250 },
  { label: 'AWS', radius: 275, size: 54, speed: 32, color: '#060e1e', glow: '#60a5fa', start: 310 },
];

const technologyIcons = {
  Dart: {
    path: 'M3.3 24l9.5-9.5 4.8 4.8L8.1 24H3.3zm0-24L20.7 17.4 24 14.1 8.3 0H3.3zM0 3.3L13.7 17 17 13.7 3.3 0H0v3.3z',
    color: '#0175C2',
  },
  TypeScript: {
    path: 'M3 3h18v18H3V3zm9.7 14.2c.3.6 1 1.1 2 1.1 1.6 0 2.6-.8 2.6-2.8v-5.4h-1.8v5.4c0 .9-.4 1.2-1 1.2s-1-.3-1.3-1l-1.5.9zm-4.2-.2c.3.5.7.9 1.4.9.7 0 1.1-.3 1.1-1.4V11h1.9v4.5c0 2-1.1 2.9-2.8 2.9-1.5 0-2.4-.8-2.9-1.8l1.5-.9z',
    color: '#3178C6',
  },
  Java: {
    path: 'M11.5 21l1.5-3s-5.5 1.8-8.5 1.3c1.7.7 7.5 1.7 7-1.5-.4-2.5-3-1.3-4.5-.5.6.3 1.2.6 1.7 1l-2 .9c-1.6-1.2-2-2.4.2-3.1 1.7-.5 3.5.2 3.5 2 0 1.6-1.4 3.1-2.9 3.1-.4 0-1-.3-1-.3l.5-1.1 4.3-4.8 3 1.5L9 21h2.5zM19 3s-3 1-3 3 2 2.5 2 2.5-.5-2-.5-2 1.5 1.8 1.5 3.5c0 1.8-2 2.5-2 2.5s2-1.2 4.5-1.2S25 11 25 11c0-4-2-7-6-8z',
    color: '#ED8B00',
  },
  JS: {
    path: 'M3 3h18v18H3V3zm9.7 14.2c.3.6 1 1.1 2 1.1 1.6 0 2.6-.8 2.6-2.8v-5.4h-1.8v5.4c0 .9-.4 1.2-1 1.2s-1-.3-1.3-1l-1.5.9zm-4.2-.2c.3.5.7.9 1.4.9.7 0 1.1-.3 1.1-1.4V11h1.9v4.5c0 2-1.1 2.9-2.8 2.9-1.5 0-2.4-.8-2.9-1.8l1.5-.9z',
    color: '#F7DF1E',
  },
  PHP: {
    path: 'M7.5 6.5h6.4c2.6 0 4.4 1.3 4.4 4 0 2.6-1.8 4-4.4 4h-2.4v3.5h-4V6.5zm3.9 2.4v3.4h1.7c1 0 1.6-.6 1.6-1.7s-.6-1.7-1.6-1.7h-1.7zM3 12c0 5 4 9 9 9s9-4 9-9-4-9-9-9-9 4-9 9z',
    color: '#777BB4',
  },
  Flutter: { path: 'M14.5 2L4 12.5l3 3L20.5 2h-6zM4 19.5L9.5 14l3 3L9.5 22 4 19.5z', color: '#02569B' },
  React: {
    path: 'M12 9.8a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM5 12c0 1.7-2.1 3.3-1.5 5 .8 2.2 4 .2 6.2 1 1.6.7 2.3 3 4.3 3s2.7-2.3 4.3-3c2.2-.8 5.4 1.2 6.2-1 .6-1.7-1.5-3.3-1.5-5s2.1-3.3 1.5-5c-.8-2.2-4-.2-6.2-1-1.6-.7-2.3-3-4.3-3s-2.7 2.3-4.3 3c-2.2.8-5.4-1.2-6.2 1-.6 1.7 1.5 3.3 1.5 5z',
    color: '#61DAFB',
  },
  Spring: {
    path: 'M12 2C8 2 4 6 4 10c0 3 2 5 5 5 2 0 3-1 3-3 0-1-1-1-1-2 0-1 1-2 2-2 1 0 1 0 1 1 0 2-1 3-1 4 0 1 1 2 2 2 2 0 3-2 3-4 0-3-3-7-6-7zm8 14c-1 2-3 3-5 3-3 0-5-2-5-5 0-2 1-3 2-4l-1-1c-2 1-3 3-3 5 0 4 3 7 7 7 3 0 5-2 6-4l-1-1z',
    color: '#6DB33F',
  },
  'Node.js': { path: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.7 3.7v7.5L12 19.3 5.3 15.5V8L12 4.3zM12 7c-2 0-3 2-3 5s1 5 3 5 3-2 3-5-1-5-3-5z', color: '#339933' },
  Tailwind: {
    path: 'M6.5 10c.8-3.2 2.6-4.8 5.5-4.8 4.3 0 4.8 3.2 7 3.7 1.5.4 2.8 0 4-1.2-.8 3.2-2.6 4.8-5.5 4.8-4.3 0-4.8-3.2-7-3.7-1.5-.4-2.8 0-4 1.2zm-4 7.5c.8-3.2 2.6-4.8 5.5-4.8 4.3 0 4.8 3.2 7 3.7 1.5.4 2.8 0 4-1.2-.8 3.2-2.6 4.8-5.5 4.8-4.3 0-4.8-3.2-7-3.7-1.5-.4-2.8 0-4 1.2z',
    color: '#06B6D4',
  },
  Docker: { path: 'M3 13h2.2v2H3v-2zm2.8 0h2.2v2H5.8v-2zm2.8 0h2.2v2H8.6v-2zm0-2.7h2.2v2H8.6v-2zm2.8 0h2.2v2h-2.2v-2zm0 2.7h2.2v2h-2.2v-2zm2.8 0h2.2v2h-2.2v-2zm0-2.7h2.2v2h-2.2v-2zm2.8 0h2.2v2h-2.2v-2zm0 2.7h2.2v2h-2.2v-2zm2.8 0h2.2v2h-2.2v-2z', color: '#2496ED' },
  Kubernetes: { path: 'M12 2L4 6v8l8 4 8-4V6l-8-4zm0 2.3l5.7 2.8v5.8L12 15.7 6.3 12.9V7.1L12 4.3zM12 7L9 12l3 5 3-5-3-5z', color: '#326CE5' },
  PostgreSQL: { path: 'M21 11c.3 2-.4 4-2 5.3-.6.5-1.5.7-2.3.7-.3 1-.8 2-1.7 2.6-.7.5-1.6.6-2.4.5h-.5c-.4.4-1 .8-1.7.8-1.6.2-3.2-.6-4-2-.9-1.6-1-3.4-.7-5 .2-1 .5-1.8.5-2.5 0-.6-.3-1.2-.3-1.8 0-1 .5-1.8 1.3-2.5.7-.6 1.8-1 3-1 1 0 1.8.2 2.5.5.5-.2 1.2-.3 1.8-.3 1 0 2 .3 2.7 1 .4.3.7.7.8 1.2 1 .3 1.8 1 2.2 1.8.4.6.5 1.4.3 2.2-.5.3-.9.5-1.4.5z', color: '#4169E1' },
  Redis: { path: 'M3 8.5l9-2.5 9 2.5-9 2.5-9-2.5zm0 4l9 2.5 9-2.5-9 2.5-9-2.5zm0 4l9 2.5 9-2.5-9 2.5-9-2.5z', color: '#DC382D' },
  Firebase: { path: 'M5 19l3-14 4 8-3 6H5zm5.5 0L8 7l3 6 9-2-9.5 8z', color: '#FFCA28' },
  AWS: { path: 'M12 4c-4.4 0-8.2 2.7-9.8 6.5C3.6 15.6 7.5 19 12 19V4zm.5 4.5L16 9v9l-3.5.5v-10zm-3 9L6 17V8l3.5-.5v10z', color: '#FF9900' },
};

const education = [
  {
    track: 'Degree',
    title: 'BSc in Information Technology',
    org: 'University of Jaffna',
    period: '2022 Oct — 2025 Jul',
    detail:
      'Programming, algorithms, web systems, database design, operating systems, networks, mobile computing, security, and project-based delivery.',
  },
  {
    track: 'Diploma',
    title: 'Diploma in Information Technology',
    org: 'IMBS Green Campus',
    period: '2021 — 2022',
    badge: 'GPA 3.73',
    detail:
      '30-credit diploma with a 3.73 GPA covering hardware, networking, web engineering, software engineering, and a software development project.',
  },
  {
    track: 'School',
    title: 'A/L Technology Stream',
    org: 'Ananda Sastralaya, Matugama',
    period: '2020',
    detail: 'Science for Technology B, ICT C, Engineering Technology S.',
  },
  {
    track: 'School',
    title: 'O/L',
    org: 'Tissa Central College, Kalutara',
    period: '2017',
    detail:
      'Mathematics A, ICT A, Commerce A, Science B, Sinhala B, History B, Drama B, Buddhism B, English C.',
  },
];

const certifications = [
  {
    title: 'AI/ML Engineer — Stage 1',
    org: 'SLIIT',
    year: '2026',
    detail: 'Hands-on learning around model building, experimentation, and practical AI workflows.',
  },
  {
    title: 'Dart & Flutter Development Course',
    org: 'Udemy',
    year: '2024',
    detail: 'Focused on mobile UI systems, state management, and clean app structure.',
  },
  {
    title: 'IT for Business Success',
    org: 'HP',
    year: '2021',
    detail: 'Covered digital productivity, business workflows, and everyday office systems.',
  },
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
        <a href="#hero" aria-label="ChamudithaPerera.Online home">
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
            Mobile-focused engineer crafting <strong>end-to-end mobile, web & backend systems</strong>. I turn ideas
            into production-ready software with <span className="flutter-text">Flutter</span>,{' '}
            <span className="react-text">React</span>, and <span className="spring-text">Spring Boot</span>.
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

function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeJob = experience[activeIndex];
  const showPrevious = () =>
    setActiveIndex((current) => (current - 1 + experience.length) % experience.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % experience.length);

  return (
    <section id="experience" className="section section-experience experience-reference">
      <div className="section-divider" />
      <Reveal className="section-inner">
        <SectionHeading index="02. Where I've Worked" title="Work" accent="Experience" />
        <div className="experience-shell">
          <div className="experience-steps" aria-label="Work experience timeline">
            <span className="experience-step-line" aria-hidden="true" />
            {experience.map((job, index) => {
              const selected = index === activeIndex;
              const completed = index < activeIndex;
              return (
                <button
                  key={`${job.role}-${job.period}`}
                  type="button"
                  className={`experience-step ${selected ? 'is-active' : ''} ${completed ? 'is-complete' : ''}`}
                  aria-pressed={selected}
                  aria-label={`${job.period.split('—')[0].trim()} ${job.org.split('—')[0].trim()}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="experience-step-dot">
                    {selected ? <Icon name="briefcase" size={14} /> : index + 1}
                  </span>
                  <span className="experience-step-label">
                    <strong>{job.period.split('—')[0].trim()}</strong>
                    <small>{job.org.split('—')[0].trim()}</small>
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
                  {activeJob.tags.map((tag) => (
                    <span key={tag} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="experience-card-footer">
                  <div className="experience-count">
                    <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
                    <span>/</span>
                    <small>{String(experience.length).padStart(2, '0')}</small>
                    <em>· {activeJob.org.split('—')[0].trim()}</em>
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
  const icon = technologyIcons[planet.label] || {
    path: 'M12 2l9 5v10l-9 5-9-5V7l9-5z',
    color: '#3b82f6',
  };
  const endAngle = planet.start + 360;

  return (
    <div
      className={`skill-planet ${!running || reducedMotion ? 'is-paused' : ''}`}
      title={planet.label}
      aria-label={planet.label}
      style={{
        width: planet.size,
        height: planet.size,
        marginTop: -planet.size / 2,
        marginLeft: -planet.size / 2,
        '--orbit-radius': `${planet.radius}px`,
        '--orbit-start': `${planet.start}deg`,
        '--orbit-start-reverse': `${-planet.start}deg`,
        '--orbit-end': `${endAngle}deg`,
        '--orbit-end-reverse': `${-endAngle}deg`,
        animationDuration: `${planet.speed}s`,
        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,.18), ${planet.color})`,
        boxShadow: `0 0 14px 3px ${planet.glow}55, inset 0 0 8px rgba(255,255,255,.06)`,
        borderColor: `${planet.glow}66`,
      }}
    >
      <svg className="technology-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d={icon.path} fill={icon.color} />
      </svg>
      <span className="planet-tooltip">{planet.label}</span>
    </div>
  );
}

function SolarSystem({ running, setRunning }) {
  const reducedMotion = useReducedMotion();
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, index) => ({
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
      >
        {stars.map((star) => (
          <span key={star.id} className="solar-star" style={star} />
        ))}
        {[110, 190, 275].map((radius) => (
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
    <section id="skills" className="section section-skills skills-reference">
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
  const [activeEducationIndex, setActiveEducationIndex] = useState(0);
  const certificationRailRef = useRef(null);

  const slideRail = (railRef, direction) => {
    if (!railRef.current) {
      return;
    }

    const distance = Math.max(320, Math.round(railRef.current.clientWidth * 0.84));
    railRef.current.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  const educationCount = education.length;

  const showPreviousEducation = () =>
    setActiveEducationIndex((current) => (current - 1 + educationCount) % educationCount);

  const showNextEducation = () => setActiveEducationIndex((current) => (current + 1) % educationCount);

  const activateEducation = (index) => setActiveEducationIndex(index);

  const getEducationOffset = (index) => {
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
                {education.map((item, index) => {
                  const offset = getEducationOffset(index);
                  const positionClass =
                    offset === 0 ? 'is-active' : offset === -1 ? 'is-prev' : offset === 1 ? 'is-next' : 'is-hidden';

                  return (
                    <article
                      key={`${item.title}-${item.period}`}
                      className={`experience-card education-carousel-card card-3d ${positionClass}`}
                      aria-hidden={positionClass === "is-hidden"}
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
                            <small>{String(education.length).padStart(2, '0')}</small>
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
              {education.map((item, index) => (
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
                {certifications.map((cert) => (
                  <article key={cert.title} className="experience-card certification-slider-card card-3d">
                    <span className="experience-card-accent" />
                    <div className="experience-card-body certification-card-body">
                      <div className="certification-card-top">
                        <span className="certification-badge">
                          <Icon name="award" size={12} />
                          Certification
                        </span>
                        <span className="experience-period certification-year">
                          <Icon name="calendar" size={12} /> {cert.year}
                        </span>
                      </div>

                      <div className="certification-card-main">
                        <span className="experience-role-icon certification-role-icon">
                          <Icon name="award" size={18} />
                        </span>
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
  return (
    <div className="bolt-shell">
      <Helmet>
        <title>ChamXdev by Chamuditha Perer</title>
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
