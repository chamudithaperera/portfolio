import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

function mockJsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: () => 'application/json',
    },
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

const portfolioContent = {
  ok: true,
  projects: [
    {
      id: 1,
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
    },
    {
      id: 2,
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
    },
    {
      id: 3,
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
    },
    {
      id: 4,
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
    },
  ],
  experience: [
    {
      id: 1,
      period: '2026 Mar — Present',
      role: 'Associate Software Engineer',
      org: 'W3Inventor',
      current: true,
      detail:
        'Developing ride-hailing system using Flutter and Spring Boot, implementing real-time features, fare logic, JWT authentication, microservices integration, and optimizing performance, caching, and database consistency.',
      tags: ['Flutter', 'Spring Boot', 'Microservices', 'JWT', 'Redis'],
    },
    {
      id: 2,
      period: '2025 Sep — 2026 Mar',
      role: 'Intern Mobile Application Developer',
      org: 'W3Inventor',
      current: false,
      detail:
        'Contributed to Flutter-based ride-hailing app development, implementing UI, API integration, authentication flows, and debugging features while collaborating with backend teams in a microservices-based architecture.',
      tags: ['Flutter', 'API Integration', 'Authentication', 'Microservices'],
    },
    {
      id: 3,
      period: '2024 Dec — 2025 Sep',
      role: 'Intern UI/UX Designer',
      org: 'Kyranz IT',
      current: false,
      detail:
        'Worked remotely creating user-friendly web and mobile interfaces. Created wireframes and prototypes in Figma, assisted with user research, and ensured responsiveness across devices.',
      tags: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping'],
    },
    {
      id: 4,
      period: '2024 Jun — 2024 Dec',
      role: 'Intern UI/UX Designer',
      org: 'Web99x',
      current: false,
      detail:
        'Crafted wireframes, mockups, and prototypes in Figma. Collaborated with developers to deliver clean, user-focused designs for web and mobile products.',
      tags: ['Figma', 'Mockups', 'UI Design', 'Collaboration'],
    },
    {
      id: 5,
      period: '2021 Dec — 2022 Jun',
      role: 'Bank Trainee',
      org: "Peoples' Bank — International Banking",
      current: false,
      detail:
        'Worked in the Import Bills section. Assisted in processing import documentation, verifying trade documents, and supporting daily operations related to international trade finance.',
      tags: ['Trade Finance', 'Documentation', 'Banking'],
    },
  ],
  education: [
    {
      id: 1,
      track: 'Degree',
      title: 'BSc in Information Technology',
      org: 'University of Jaffna',
      period: '2022 Oct — 2025 Jul',
      detail:
        'Built a strong foundation in programming, algorithms, databases, operating systems, networking, mobile computing, and security. Focused on practical project delivery and clean technical problem-solving.',
    },
    {
      id: 2,
      track: 'Diploma',
      title: 'Diploma in Information Technology',
      org: 'IMBS Green Campus',
      period: '2021 — 2022',
      badge: 'GPA 3.73',
      detail:
        'Completed a 30-credit diploma with a 3.73 GPA covering hardware, networking, web engineering, and software engineering. Finished with a software development project and hands-on team work.',
    },
    {
      id: 3,
      track: 'School',
      title: 'A/L Technology Stream',
      org: 'Ananda Sastralaya, Matugama',
      period: '2020',
      detail:
        'Studied Science for Technology, ICT, and Engineering Technology, which strengthened analytical thinking and technical discipline. It created the academic bridge into software and systems work.',
    },
    {
      id: 4,
      track: 'School',
      title: 'O/L',
      org: 'Tissa Central College, Kalutara',
      period: '2017',
      detail:
        'Completed a broad academic base with strong results in Mathematics, ICT, Commerce, and Science. That foundation supported the later move into IT-focused study and career growth.',
    },
  ],
  certificates: [
    {
      id: 1,
      title: 'AI/ML Engineer — Stage 1',
      org: 'SLIIT',
      year: '2026',
      image: '/assets/imgs/works/moneymanager.png',
      detail: 'Hands-on learning around model building, experimentation, and practical AI workflows.',
    },
    {
      id: 2,
      title: 'Dart & Flutter Development Course',
      org: 'Udemy',
      year: '2024',
      image: '/assets/imgs/works/edupro.jpeg',
      detail: 'Focused on mobile UI systems, state management, and clean app structure.',
    },
    {
      id: 3,
      title: 'IT for Business Success',
      org: 'HP',
      year: '2021',
      image: '/assets/imgs/works/weatherApp.jpeg',
      detail: 'Covered digital productivity, business workflows, and everyday office systems.',
    },
  ],
};

beforeEach(() => {
  global.fetch = jest.fn(async (url) => {
    if (url === '/api/content/portfolio') {
      return mockJsonResponse(portfolioContent);
    }

    if (url === '/api/admin/session') {
      return mockJsonResponse({ ok: true, authenticated: false });
    }

    return mockJsonResponse({ ok: false, error: `Unhandled fetch: ${url}` }, 404);
  });
});

afterEach(() => {
  delete global.fetch;
  window.history.pushState({}, '', '/');
});

test('renders the full portfolio structure and navigation anchors', async () => {
  render(<App />);
  const hero = document.getElementById('hero');
  await screen.findByText('BSc in Information Technology');

  expect(screen.getByRole('heading', { level: 1, name: 'Chamuditha Perera' })).toBeInTheDocument();
  expect(screen.queryByText('Open to new opportunities')).not.toBeInTheDocument();
  expect(hero).not.toHaveTextContent('Kalutara, Sri Lanka');
  expect(within(hero).getByText('35+')).toBeInTheDocument();
  expect(within(hero).getByText('3y+')).toBeInTheDocument();
  expect(screen.getAllByText('Technologies').length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Associate Software Engineer' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Featured Projects' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Technical Skills' })).toBeInTheDocument();
  expect(screen.queryByText('Core Proficiencies')).not.toBeInTheDocument();
  expect(screen.queryByText('Full Stack')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Education & Certifications' })).toBeInTheDocument();
  expect(screen.getByText('BSc in Information Technology')).toBeInTheDocument();
  expect(screen.getByText('AI/ML Engineer — Stage 1')).toBeInTheDocument();
  expect(screen.getByAltText('AI/ML Engineer — Stage 1')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: "Let's Connect" })).toBeInTheDocument();
  expect(screen.getByText('MQTT')).toBeInTheDocument();
  expect(screen.getByText('Adobe Photoshop')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Dart' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Kubernetes' })).toBeInTheDocument();
  expect(screen.getByText('Replies within 24h')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Have a project in mind?' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Start a Conversation' })).toHaveAttribute('href', '#contact');
  expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#hero');

  const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(within(navigation).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  expect(within(navigation).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
  expect(within(navigation).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
});

test('clicking a skill planet updates the selected detail card', async () => {
  render(<App />);
  await screen.findByText('BSc in Information Technology');

  fireEvent.click(screen.getByRole('button', { name: 'React' }));

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'React logo' })).toBeInTheDocument();
    expect(screen.getByText('Frameworks & Libraries')).toBeInTheDocument();
    expect(screen.getByText('Frontend library for web interfaces and admin panels.')).toBeInTheDocument();
  });
});

test('opens and closes the accessible mobile navigation', async () => {
  render(<App />);
  await screen.findByText('BSc in Information Technology');

  fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
  const mobileNavigation = document.getElementById('mobile-navigation');
  expect(mobileNavigation).toBeInTheDocument();
  expect(within(mobileNavigation).getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills');

  fireEvent.click(screen.getByRole('button', { name: 'Close navigation menu' }));
  expect(document.getElementById('mobile-navigation')).not.toBeInTheDocument();
});

test('renders the alternating education cards and certification stack', async () => {
  render(<App />);
  await screen.findByText('BSc in Information Technology');

  expect(screen.getByText('BSc in Information Technology')).toBeInTheDocument();
  expect(screen.getByText('Diploma in Information Technology')).toBeInTheDocument();
  expect(screen.getByText('A/L Technology Stream')).toBeInTheDocument();
  expect(screen.getByText('O/L')).toBeInTheDocument();
  expect(screen.getByText('AI/ML Engineer — Stage 1')).toBeInTheDocument();
  expect(screen.getByText('Dart & Flutter Development Course')).toBeInTheDocument();
  expect(screen.getByText('IT for Business Success')).toBeInTheDocument();
});

test('shows the seeded project content and safe external links', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Money Manager App' });

  expect(screen.getByRole('heading', { name: 'Money Manager App' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'EduLink Peer Tutoring Platform' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Weather App' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Avurudu Nakath App' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'More Projects' })).toHaveAttribute('href', '/projects');

  const githubLinks = screen.getAllByRole('link', { name: /github/i });
  const externalGithub = githubLinks.find((link) => link.getAttribute('target') === '_blank');
  expect(externalGithub).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

test('opens a project detail modal and the projects page route', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Money Manager App' });

  fireEvent.click(screen.getByRole('button', { name: 'Open details for Money Manager App' }));
  const modal = await screen.findByRole('dialog', { name: 'Money Manager App' });
  expect(modal).toBeInTheDocument();
  expect(within(modal).getByRole('heading', { name: 'Money Manager App' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Close project details' }));
  expect(screen.queryByRole('dialog', { name: 'Money Manager App' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: 'More Projects' }));
  expect(await screen.findByRole('heading', { name: 'All Projects' })).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: 'Open details for Money Manager App' })).toBeInTheDocument();
});

test('routes project-page navigation links back to the home page anchors', async () => {
  window.history.pushState({}, '', '/projects');
  render(<App />);
  await screen.findByRole('heading', { name: 'All Projects' });

  const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(within(navigation).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about');
  expect(within(navigation).getByRole('link', { name: 'ChamudithaPerera.Online home' })).toHaveAttribute(
    'href',
    '/#hero',
  );
});

test('shows the simulated contact success state and can reset it', () => {
  const fetchMock = jest.fn().mockResolvedValue(mockJsonResponse({ ok: true, message: 'Saved' }, 201));
  global.fetch = fetchMock;
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Available for new opportunities' })).toBeInTheDocument();
  expect(screen.getByText("Let's build something together.")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('+94 12 345 6789'), { target: { value: '+94771234567' } });
  fireEvent.change(screen.getByPlaceholderText("What's this about?"), { target: { value: 'Portfolio' } });
  fireEvent.change(screen.getByPlaceholderText('Tell me about your project or opportunity...'), {
    target: { value: 'Hello there' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
  expect(screen.getByRole('button', { name: /Sending/i })).toBeDisabled();

  return screen.findByRole('status').then((successState) => {
    expect(successState).toHaveTextContent('Message Sent!');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact/messages',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Send Another' }));
    expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
  });
});

test('shows the admin login screen on the /admin route', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce(mockJsonResponse({ ok: true, authenticated: false }));

  window.history.pushState({}, '', '/admin');
  render(<App />);

  expect(await screen.findByRole('heading', { name: 'Portfolio Admin' })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('admin.chamuditha')).toBeInTheDocument();
});
