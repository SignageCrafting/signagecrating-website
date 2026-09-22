import { createContext, useContext } from 'react';
import { defaultContent } from './defaults';
import type { SiteContent } from './types';

declare global {
  interface Window {
    // Injected into index.html by server.js when content has been saved in /admin.
    __SITE_CONTENT__?: unknown;
  }
}

type Json = unknown;

function isPlainObject(v: Json): v is Record<string, Json> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// A same-shaped value with empty fields, used for new list items and for
// filling in fields that older saved items don't have yet.
export function blankOf<T>(template: T): T {
  if (Array.isArray(template)) return [] as T;
  if (isPlainObject(template)) {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(template)) out[k] = blankOf(v);
    return out as T;
  }
  if (typeof template === 'number') return 0 as T;
  if (typeof template === 'boolean') return false as T;
  return '' as T;
}

// Layers saved content over the defaults. Saved values win when they have the
// right type; saved lists replace the default list entirely.
function merge(base: Json, saved: Json): Json {
  if (saved === undefined || saved === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    const template = base[0];
    if (isPlainObject(template)) {
      const blank = blankOf(template);
      return saved.filter(isPlainObject).map((item) => merge(blank, item));
    }
    return saved.filter((item) => typeof item === typeof (template ?? ''));
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(saved)) return base;
    const out: Record<string, Json> = {};
    for (const key of Object.keys(base)) out[key] = merge(base[key], saved[key]);
    return out;
  }
  return typeof saved === typeof base ? saved : base;
}

export function mergeContent(saved: unknown): SiteContent {
  return merge(defaultContent, saved) as SiteContent;
}

export const ContentContext = createContext<SiteContent>(defaultContent);

export function useContent() {
  return useContext(ContentContext);
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

// "Lodi, CA 95240, USA"
export function cityLine(business: SiteContent['business']) {
  const region = [business.state, business.postalCode].filter(Boolean).join(' ');
  return [business.city, region, business.country].filter(Boolean).join(', ');
}

export function fullAddress(business: SiteContent['business']) {
  return [business.street, cityLine(business)].filter(Boolean).join(', ');
}

// Plain-text version of the {tokens} that can be used in editable text.
export function fillTokens(text: string, content: SiteContent) {
  const { business } = content;
  return text
    .replace(/\{year\}/g, String(new Date().getFullYear()))
    .replace(/\{business\}/g, business.name)
    .replace(/\{email\}/g, business.email)
    .replace(/\{phone\}/g, business.phone)
    .replace(/\{address\}/g, fullAddress(business));
}
