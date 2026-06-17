import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Keep GitHub Pages project paths working under /portfolio.
window.__withBase = (path = '') => {
  if (!path) return '';
  if (/^https?:\/\//.test(path) || path.startsWith('//')) return path;

  const base = process.env.PUBLIC_URL || '';
  if (base && path.startsWith(base)) return path;

  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
