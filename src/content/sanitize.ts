// Server-side clean-up of content saved from /admin (run by server.js before
// anything is written to disk). Unknown fields are dropped, text is length
// limited, and every link or image must be a safe URL.
import { mergeContent } from './store';
import type { SiteContent } from './types';

const LINK_OK = /^(\/(?!\/)|https?:\/\/|mailto:|tel:)/i;
const IMAGE_OK = /^(\/(?!\/)[^\s"'<>]*|https:\/\/[^\s"'<>]+)$/i;

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

function cleanText(value: string, max: number) {
  return value.replace(CONTROL_CHARS, '').slice(0, max);
}

// Anything that could run code when clicked.
const DANGEROUS = /^\s*(javascript|data|vbscript|file|blob)\s*:/i;
const LOOKS_LIKE_DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/|\?|$)/i;

// Accepts links the way people type them: "/about", "about", "example.com/x",
// "www.example.com", "https://…", "mailto:…", "tel:…".
function cleanLink(value: string) {
  const v = value.trim();
  if (v === '' || DANGEROUS.test(v)) return '';
  if (LINK_OK.test(v)) return v.slice(0, 500);
  if (LOOKS_LIKE_DOMAIN.test(v)) return `https://${v}`.slice(0, 500);
  if (/^[a-z0-9][a-z0-9\-/]*$/i.test(v)) return `/${v}`.slice(0, 500);
  return '';
}

function cleanImage(value: string) {
  const v = value.trim();
  return v === '' || IMAGE_OK.test(v) ? v.slice(0, 500) : '';
}

// Social profile links: add https:// when it's missing, upgrade http://.
function cleanHttps(value: string) {
  const v = value.trim().replace(/^http:\/\//i, 'https://');
  if (v === '' || DANGEROUS.test(v)) return '';
  if (/^https:\/\/[^\s"'<>]+$/i.test(v)) return v.slice(0, 500);
  if (LOOKS_LIKE_DOMAIN.test(v)) return `https://${v}`.slice(0, 500);
  return '';
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

const LONG_FIELDS = new Set(['body', 'answer', 'story', 'description']);
const IMAGE_FIELDS = new Set(['image', 'logoImage', 'logoImageLight', 'ogImage']);
const IMAGE_LISTS = new Set(['images', 'cubeImages']);
const LINK_FIELDS = new Set(['path', 'ctaPath']);

function walk(value: unknown, key: string): unknown {
  if (Array.isArray(value)) {
    if (IMAGE_LISTS.has(key)) return value.map((v) => cleanImage(String(v))).filter(Boolean).slice(0, 24);
    return value.slice(0, 100).map((v) => walk(v, key));
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = walk(v, k);
    return out;
  }
  if (typeof value === 'string') {
    if (IMAGE_FIELDS.has(key)) return cleanImage(value);
    if (LINK_FIELDS.has(key)) return cleanLink(value);
    return cleanText(value, LONG_FIELDS.has(key) ? 20000 : 2000);
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  return value;
}

export function sanitizeContent(input: unknown): SiteContent {
  const content = walk(mergeContent(input), '') as SiteContent;

  const social = content.business.social;
  social.instagram = cleanHttps(social.instagram);
  social.facebook = cleanHttps(social.facebook);
  social.linkedin = cleanHttps(social.linkedin);

  const site = content.seo.siteUrl.trim().replace(/\/+$/, '');
  content.seo.siteUrl = /^https?:\/\/[a-z0-9.-]+(:\d+)?$/i.test(site) ? site : '';
  if (!/^[A-Za-z]+$/.test(content.seo.businessType)) content.seo.businessType = 'LocalBusiness';
  if (content.seo.latitude && !/^-?\d{1,3}(\.\d+)?$/.test(content.seo.latitude.trim())) content.seo.latitude = '';
  for (const k of ['googleVerification', 'bingVerification'] as const) {
    content.seo[k] = /^[A-Za-z0-9_-]{0,100}$/.test(content.seo[k].trim()) ? content.seo[k].trim() : '';
  }
  if (content.seo.longitude && !/^-?\d{1,3}(\.\d+)?$/.test(content.seo.longitude.trim())) content.seo.longitude = '';

  const ads = content.googleAds;
  ads.id = /^AW-\d{5,15}$/.test(ads.id.trim()) ? ads.id.trim() : '';
  for (const k of ['quoteFormLabel', 'contactFormLabel', 'phoneClickLabel'] as const) {
    ads[k] = /^[A-Za-z0-9_-]{0,64}$/.test(ads[k].trim()) ? ads[k].trim() : '';
  }

  // Sign type ids become page URLs (/sign-types/<id>), so keep them unique slugs.
  const seen = new Set<string>();
  for (const sign of content.signTypes) {
    let id = slug(sign.id) || slug(sign.name) || 'sign';
    const base = id;
    for (let n = 2; seen.has(id); n++) id = `${base}-${n}`;
    seen.add(id);
    sign.id = id;
  }

  content.faq.homeLimit = Math.max(0, Math.min(50, Math.round(content.faq.homeLimit)));
  for (const t of content.home.testimonials.items) t.rating = Math.max(0, Math.min(5, Math.round(t.rating)));

  return content;
}
