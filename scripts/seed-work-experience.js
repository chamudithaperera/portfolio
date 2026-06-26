const { supabase } = require('../server/supabase');
const { TABLES } = require('../server/portfolioStore');

const experienceRows = [
  {
    period: '2026 Mar — Present',
    role: 'Associate Software Engineer',
    org: 'W3Inventor',
    current: true,
    detail:
      'Developing ride-hailing system using Flutter and Spring Boot, implementing real-time features, fare logic, JWT authentication, microservices integration, and optimizing performance, caching, and database consistency.',
    tags: ['Flutter', 'Spring Boot', 'Microservices', 'JWT', 'Redis'],
    displayOrder: 1,
  },
  {
    period: '2025 Sep — 2026 Mar',
    role: 'Intern Mobile Application Developer',
    org: 'W3Inventor',
    current: false,
    detail:
      'Contributed to Flutter-based ride-hailing app development, implementing UI, API integration, authentication flows, and debugging features while collaborating with backend teams in a microservices-based architecture.',
    tags: ['Flutter', 'API Integration', 'Authentication', 'Microservices'],
    displayOrder: 2,
  },
  {
    period: '2024 Dec — 2025 Sep',
    role: 'Intern UI/UX Designer',
    org: 'Kyranz IT',
    current: false,
    detail:
      'Worked remotely creating user-friendly web and mobile interfaces. Created wireframes and prototypes in Figma, assisted with user research, and ensured responsiveness across devices.',
    tags: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping'],
    displayOrder: 3,
  },
  {
    period: '2024 Jun — 2024 Dec',
    role: 'Intern UI/UX Designer',
    org: 'Web99x',
    current: false,
    detail:
      'Crafted wireframes, mockups, and prototypes in Figma. Collaborated with developers to deliver clean, user-focused designs for web and mobile products.',
    tags: ['Figma', 'Mockups', 'UI Design', 'Collaboration'],
    displayOrder: 4,
  },
  {
    period: '2021 Dec — 2022 Jun',
    role: 'Bank Trainee',
    org: "Peoples' Bank — International Banking",
    current: false,
    detail:
      'Worked in the Import Bills section. Assisted in processing import documentation, verifying trade documents, and supporting daily operations related to international trade finance.',
    tags: ['Trade Finance', 'Documentation', 'Banking'],
    displayOrder: 5,
  },
];

async function main() {
  const { error } = await supabase.from(TABLES.experience).upsert(experienceRows, {
    onConflict: 'period,role,org',
  });

  if (error) {
    throw error;
  }

  console.log(`Seeded ${experienceRows.length} work experience rows into ${TABLES.experience}.`);
}

main().catch((error) => {
  console.error('Work experience seed failed:', error);
  process.exitCode = 1;
});
