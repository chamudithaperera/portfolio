import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HeroDeveloperAnimation from './HeroDeveloperAnimation';
import { mountDeveloperAnimation } from './developerAnimationScene';

jest.mock('./developerAnimationScene', () => ({ mountDeveloperAnimation: jest.fn() }));

const dispose = jest.fn();
const setPaused = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mountDeveloperAnimation.mockImplementation((stage, { onReady }) => {
    onReady();
    return { dispose, setPaused };
  });
});

test('allows visitors to pause and resume the device animation', async () => {
  render(<HeroDeveloperAnimation />);
  fireEvent.click(await screen.findByRole('button', { name: 'Pause animation' }));
  expect(setPaused).toHaveBeenLastCalledWith(true);
  fireEvent.click(screen.getByRole('button', { name: 'Play animation' }));
  expect(setPaused).toHaveBeenLastCalledWith(false);
});

test('releases the scene when the hero unmounts', async () => {
  const { unmount } = render(<HeroDeveloperAnimation />);
  await screen.findByRole('button', { name: 'Pause animation' });
  unmount();
  expect(dispose).toHaveBeenCalledTimes(1);
});

test('shows an image fallback when WebGL initialization fails', async () => {
  mountDeveloperAnimation.mockImplementation((stage, { onError }) => {
    onError(new Error('WebGL unavailable'));
    return { dispose, setPaused };
  });
  render(<HeroDeveloperAnimation />);
  expect(await screen.findByAltText('Website and mobile app development showcase')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Pause animation' })).not.toBeInTheDocument();
});
