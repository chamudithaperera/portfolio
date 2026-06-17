const withBase = (path = '') => {
  if (!path) return '';
  if (/^https?:\/\//.test(path) || path.startsWith('//')) return path;

  const base = process.env.PUBLIC_URL || '';
  if (base && path.startsWith(base)) return path;

  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

if (typeof window !== 'undefined') {
  window.__withBase = withBase;
}

export default withBase;
