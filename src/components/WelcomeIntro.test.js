import React, { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomeIntro from './WelcomeIntro';

const sessionKey = 'portfolio-welcome-intro-played';
const originalMatchMedia = window.matchMedia;
const show = (path = '/') => render(
  <StrictMode><MemoryRouter initialEntries={[path]}><WelcomeIntro><h1>Portfolio</h1><a href="#work">Work</a></WelcomeIntro></MemoryRouter></StrictMode>
);

beforeEach(() => {
  jest.useFakeTimers();
  sessionStorage.clear();
  window.matchMedia = originalMatchMedia;
});
afterEach(() => {
  jest.useRealTimers();
  sessionStorage.clear();
  document.documentElement.style.overflow = '';
  window.matchMedia = originalMatchMedia;
});

test('releases the site after 900ms, including in StrictMode', () => {
  show();
  expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Portfolio' })).not.toBeInTheDocument();
  expect(document.querySelector('[inert]')).toBeInTheDocument();
  expect(document.documentElement.style.overflow).toBe('hidden');
  act(() => { jest.advanceTimersByTime(899); });
  expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument();
  act(() => { jest.advanceTimersByTime(1); });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Portfolio' })).toHaveFocus();
  expect(document.querySelector('[inert]')).not.toBeInTheDocument();
  expect(document.documentElement.style.overflow).toBe('');
  expect(sessionStorage.getItem(sessionKey)).toBe('1');
});

test.each(['click', 'Escape'])('immediately dismisses the intro with %s', method => {
  show();
  if (method === 'click') fireEvent.click(screen.getByRole('button', { name: 'Skip Intro' }));
  else fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeInTheDocument();
});

test('does not replay in the same session unless preview is requested', () => {
  sessionStorage.setItem(sessionKey, '1');
  const { unmount } = show();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  unmount();
  show('/?previewIntro=1');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('bypasses the intro for reduced motion and the admin route', () => {
  window.matchMedia = query => ({ ...originalMatchMedia(query), matches: true });
  const { unmount } = show();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  unmount();
  window.matchMedia = originalMatchMedia;
  show('/admin');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('finishes within 900ms even if font loading stalls', () => {
  const previousFonts = document.fonts;
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: new Promise(() => {}) } });
  show();
  act(() => { jest.advanceTimersByTime(900); });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeInTheDocument();
  Object.defineProperty(document, 'fonts', { configurable: true, value: previousFonts });
});
