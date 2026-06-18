import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
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

afterEach(() => {
  delete global.fetch;
  window.history.pushState({}, '', '/');
});

test('renders the full portfolio structure and navigation anchors', () => {
  render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: 'Chamuditha Perera' })).toBeInTheDocument();
  expect(screen.getByText('Open to new opportunities')).toBeInTheDocument();
  expect(screen.getAllByText('Kalutara, Sri Lanka').length).toBeGreaterThan(0);
  expect(screen.getByText('15+')).toBeInTheDocument();
  expect(screen.getAllByText('Technologies').length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Featured Projects' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Technical Skills' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Education & Certifications' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: "Let's Connect" })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: "2021 Dec Peoples' Bank" })).toBeInTheDocument();
  expect(screen.getByText('MQTT')).toBeInTheDocument();
  expect(screen.getByText('Adobe Photoshop')).toBeInTheDocument();
  expect(screen.getByLabelText('Dart')).toBeInTheDocument();
  expect(screen.getByLabelText('Kubernetes')).toBeInTheDocument();
  expect(screen.getByText('Replies within 24h')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Have a project in mind?' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Start a Conversation' })).toHaveAttribute('href', '#contact');
  expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#hero');

  const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(within(navigation).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  expect(within(navigation).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
  expect(within(navigation).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
});

test('opens and closes the accessible mobile navigation', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
  const mobileNavigation = document.getElementById('mobile-navigation');
  expect(mobileNavigation).toBeInTheDocument();
  expect(within(mobileNavigation).getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills');

  fireEvent.click(screen.getByRole('button', { name: 'Close navigation menu' }));
  expect(document.getElementById('mobile-navigation')).not.toBeInTheDocument();
});

test('navigates the interactive work experience carousel and wraps controls', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Associate Software Engineer' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '2024 Dec Kyranz IT' }));
  expect(screen.getByRole('heading', { name: 'Intern UI/UX Designer' })).toBeInTheDocument();
  expect(screen.getAllByText('Kyranz IT').length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
  expect(screen.getByText('API Integration')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '2026 Mar W3Inventor' }));
  fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
  expect(screen.getByRole('heading', { name: 'Bank Trainee' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByRole('heading', { name: 'Associate Software Engineer' })).toBeInTheDocument();
});

test('keeps local project content and safe external links', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Money Manager App' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'EduLink Peer Tutoring Platform' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Weather App' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Avurudu Nakath App' })).toBeInTheDocument();

  const githubLinks = screen.getAllByRole('link', { name: /github/i });
  const externalGithub = githubLinks.find((link) => link.getAttribute('target') === '_blank');
  expect(externalGithub).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

test('shows the simulated contact success state and can reset it', () => {
  const fetchMock = jest.fn().mockResolvedValue(mockJsonResponse({ ok: true, message: 'Saved' }, 201));
  global.fetch = fetchMock;
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Available for new opportunities' })).toBeInTheDocument();
  expect(screen.getByText("Let's build something together.")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } });
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

  expect(await screen.findByRole('heading', { name: 'ChamXdev Admin' })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('admin.chamuditha')).toBeInTheDocument();
});
