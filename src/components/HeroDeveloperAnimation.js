import React, { useEffect, useRef, useState } from 'react';
import withBase from '../utils/basePath';

export default function HeroDeveloperAnimation() {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    import('./developerAnimationScene')
      .then(({ mountDeveloperAnimation }) => {
        if (cancelled) return;
        sceneRef.current = mountDeveloperAnimation(stageRef.current, {
          onReady: () => setStatus('ready'),
          onError: () => setStatus('fallback'),
        });
      })
      .catch(() => { if (!cancelled) setStatus('fallback'); });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div className="hero-showcase hero-developer-animation">
      <div className="hero-showcase-aura hero-showcase-aura-a" aria-hidden="true" />
      <div className="hero-showcase-aura hero-showcase-aura-b" aria-hidden="true" />
      <div
        className="hero-animation-stage"
        ref={stageRef}
        role="img"
        aria-label="3D animation of a laptop building a website, transitioning to a mobile app"
      />
      {status === 'loading' && <span className="hero-animation-loading">Preparing the workspace…</span>}
      {status === 'fallback' && (
        <img className="hero-animation-fallback" src={withBase('/assets/imgs/header/coding-hero-v2.webp')} alt="Website and mobile app development showcase" />
      )}
    </div>
  );
}
