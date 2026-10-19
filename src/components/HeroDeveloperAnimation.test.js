import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HeroDeveloperAnimation from './HeroDeveloperAnimation';
import { mountDeveloperAnimation } from './developerAnimationScene';

jest.mock('./developerAnimationScene', () => ({ mountDeveloperAnimation: jest.fn() }));

const dispose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mountDeveloperAnimation.mockImplementation((stage, { onReady }) => {
    onReady();
    return { dispose };
  });
});

test('releases the scene when the hero unmounts', async () => {
  const { unmount } = render(<HeroDeveloperAnimation />);
  await waitFor(() => expect(mountDeveloperAnimation).toHaveBeenCalledTimes(1));
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  unmount();
  expect(dispose).toHaveBeenCalledTimes(1);
});

test('shows an image fallback when WebGL initialization fails', async () => {
  mountDeveloperAnimation.mockImplementation((stage, { onError }) => {
    onError(new Error('WebGL unavailable'));
    return { dispose };
  });
  render(<HeroDeveloperAnimation />);
  expect(await screen.findByAltText('Website and mobile app development showcase')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Pause animation' })).not.toBeInTheDocument();
});
