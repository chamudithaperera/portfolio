import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { playWelcomeIntro } from './welcomeIntroAnimation';
import './WelcomeIntro.css';

const SESSION_KEY = 'portfolio-welcome-intro-played';
const BRAND = 'ChamudithaPerera.Online';
const SUBTITLE = 'Crafting digital experiences that matter.';

export default function WelcomeIntro({ children }) {
  const { pathname, search } = useLocation();
  const [active, setActive] = useState(() => {
    if (pathname.startsWith('/admin') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (new URLSearchParams(search).get('previewIntro') === '1') return true;
    try { return sessionStorage.getItem(SESSION_KEY) !== '1'; } catch { return true; }
  });
  const introRef = useRef(null);
  const siteRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement;
    let completed = false;
    document.documentElement.style.overflow = 'hidden';
    introRef.current.querySelector('.skip').focus({ preventScroll: true });
    const dispose = playWelcomeIntro(introRef.current, () => {
      completed = true;
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* Storage may be disabled. */ }
      setActive(false);
    });
    const site = siteRef.current;
    return () => {
      dispose();
      document.documentElement.style.overflow = previousOverflow;
      if (completed) {
        site.removeAttribute('inert');
        site.removeAttribute('aria-hidden');
        const heading = site.querySelector('h1');
        if (heading) {
          const previousTabIndex = heading.getAttribute('tabindex');
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
          if (previousTabIndex === null) heading.removeAttribute('tabindex');
          else heading.setAttribute('tabindex', previousTabIndex);
        }
      } else if (previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [active]);

  return (
    <>
      <div ref={siteRef} inert={active ? '' : undefined} aria-hidden={active ? true : undefined}>{typeof children === 'function' ? children(active) : children}</div>
      {active && (
        <div ref={introRef} className="welcome-intro" role="dialog" aria-label="Welcome" aria-modal="true" aria-describedby="welcome-intro-description">
          <div className="bgglow" aria-hidden="true" />
          <div className="stage" aria-hidden="true">
            <p className="center welcome">WELCOME</p>
            <canvas />
            <p className="center brand">{[...BRAND].map((letter, index) => <span className="c" key={index}>{letter}</span>)}</p>
            <p className="sub">{SUBTITLE}</p>
          </div>
          <span className="sr" id="welcome-intro-description">Welcome to {BRAND}. {SUBTITLE}</span>
          <button className="skip" type="button">Skip Intro</button>
        </div>
      )}
    </>
  );
}
