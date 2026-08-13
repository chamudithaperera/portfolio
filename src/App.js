import './App.css';
import './utils/basePath';
import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Admin from './pages/Admin';
import Home, { PricingPage, ProjectsPage } from './pages/Home';

function VisitTracker() {
  const location = useLocation();
  const lastTrackedPath = useRef('');

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    if (lastTrackedPath.current === fullPath) {
      return;
    }

    lastTrackedPath.current = fullPath;

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
  }, [location]);

  return null;
}

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL || '/'}>
      <VisitTracker />
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
