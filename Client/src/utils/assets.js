const stripQuotes = (value) => value.replace(/^['"]|['"]$/g, '');

const normalizeBase = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }
  const trimmed = stripQuotes(value.trim());
  if (!trimmed) {
    return '';
  }
  const withoutTrailingSlash = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  return withoutTrailingSlash;
};

const isAbsoluteUrl = (value) => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(value);

const DEFAULT_IMAGES = ['defaultProfile.png', 'BackgroundProfiledefault.jpg'];

const isDefaultImage = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  const normalized = filename.toLowerCase().trim();
  return DEFAULT_IMAGES.some((defaultImg) => normalized.includes(defaultImg.toLowerCase()));
};

const resolveBase = () => {
  const envValue = normalizeBase(import.meta.env.VITE_PUBLIC_FOLDER);
  if (envValue) {
    return envValue;
  }
  const apiBase = normalizeBase(import.meta.env.VITE_API_BASE_URL);
  if (apiBase) {
    return `${apiBase}/images`.replace(/\/{2,}/g, '/').replace(':/', '://');
  }
  return 'http://localhost:5000/images';
};

const baseUrl = resolveBase();

const joinUrl = (base, path) => {
  if (!base) {
    return path;
  }
  const sanitizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const sanitizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${sanitizedBase}/${sanitizedPath}`;
};

export const assetUrl = (path, fallback) => {
  const target = (path || fallback || '').toString().trim();
  if (!target) {
    return '';
  }
  
  if (isAbsoluteUrl(target)) {
    return target;
  }
  
  const sanitized = target.replace(/^['"]|['"]$/g, '').replace(/^\/+/, '');
  
  if (isDefaultImage(sanitized)) {
    return `/images/${sanitized}`;
  }
  
  return joinUrl(baseUrl, sanitized);
};

