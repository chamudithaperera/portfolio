import React, { act } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the full portfolio structure and navigation anchors', () => {
  render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: 'M. C. K. Perera' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Featured Projects' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Technical Skills' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Education & Certifications' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: "Let's Connect" })).toBeInTheDocument();

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
  jest.useFakeTimers();
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText("What's this about?"), { target: { value: 'Portfolio' } });
  fireEvent.change(screen.getByPlaceholderText('Tell me about your project or opportunity...'), {
    target: { value: 'Hello there' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
  expect(screen.getByRole('button', { name: /Sending/i })).toBeDisabled();

  act(() => {
    jest.advanceTimersByTime(1200);
  });

  expect(screen.getByRole('status')).toHaveTextContent('Message Sent!');
  fireEvent.click(screen.getByRole('button', { name: 'Send Another' }));
  expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
  jest.useRealTimers();
});
