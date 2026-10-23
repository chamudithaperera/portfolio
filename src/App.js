import './App.css';
import './utils/basePath';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Home, { FloatingAiAgent, GamesPage, PricingPage, ProjectsPage, ReviewPage } from './pages/Home';
import { ThemeProvider } from './theme';
import WelcomeIntro from './components/WelcomeIntro';

// Keep game engines and admin tools out of the portfolio's initial download.
const Admin = lazy(() => import('./pages/Admin'));
const BounceGamePage = lazy(() => import('./pages/bounce/App.tsx'));
const EndlessSkatingPage = lazy(() => import('./pages/EndlessSkating'));

function VisitTracker() {
  const location = useLocation();
  const lastTrackedPath = useRef('');
  const lastTrackedUrl = useRef('');

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    const fullUrl = window.location.href;
    const trackerState = window.__visitTrackerState || (window.__visitTrackerState = { path: '', at: 0 });
    const now = Date.now();

    if (lastTrackedPath.current === fullPath || (trackerState.path === fullPath && now - trackerState.at < 2000)) {
      return;
    }

    lastTrackedPath.current = fullPath;
    trackerState.path = fullPath;
    trackerState.at = now;

    const payload = {
      path: fullPath,
      referrer: document.referrer || '',
      language: navigator.language || '',
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pageTitle: document.title || '',
      timezoneOffset: new Date().getTimezoneOffset(),
    };

    fetch('/api/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});

    if (typeof window.gtag === 'function' && lastTrackedUrl.current !== fullUrl) {
      window.gtag('event', 'page_view', {
        page_path: fullPath,
        page_location: fullUrl,
        page_referrer: lastTrackedUrl.current,
        page_title: document.title || '',
      });
    }

    lastTrackedUrl.current = fullUrl;
  }, [location]);

  return null;
}

function AppRoutes() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${location.pathname}${location.search}`}
        className="page-transition-shell"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.995 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -14, scale: 0.995 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<div role="status" className="route-loading">Loading…</div>}>
          <Routes location={location}>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/bounce" element={<BounceGamePage />} />
            <Route path="/Endless-Skating" element={<EndlessSkatingPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent({ introActive }) {
  const location = useLocation();
  const gameRoutes = ['/Endless-Skating', '/bounce'];
  const showAiAgent = !introActive && !location.pathname.startsWith('/admin') && !gameRoutes.includes(location.pathname);

  return (
    <>
      {showAiAgent ? <FloatingAiAgent /> : null}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router basename={process.env.PUBLIC_URL || '/'}>
        <WelcomeIntro>
          {introActive => (
            <>
              <VisitTracker />
              <AppContent introActive={introActive} />
            </>
          )}
        </WelcomeIntro>
      </Router>
    </ThemeProvider>
  );
}

export default App;
