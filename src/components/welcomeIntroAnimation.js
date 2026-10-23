// The greeting uses CSS only and never waits for fonts, images, or a canvas.
export const INTRO_DURATION_MS = 900;

export function playWelcomeIntro(root, onComplete) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    onComplete();
  };
  const timer = window.setTimeout(finish, INTRO_DURATION_MS);
  const skipButton = root.querySelector('.skip');
  const keydown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      finish();
    }
    // The intro has one interactive control; keep keyboard focus within it.
    if (event.key === 'Tab') {
      event.preventDefault();
      skipButton?.focus();
    }
  };
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionChanged = () => { if (motion.matches) finish(); };
  skipButton?.addEventListener('click', finish);
  window.addEventListener('keydown', keydown);
  motion.addEventListener('change', motionChanged);

  return () => {
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener('keydown', keydown);
    motion.removeEventListener('change', motionChanged);
    skipButton?.removeEventListener('click', finish);
  };
}
