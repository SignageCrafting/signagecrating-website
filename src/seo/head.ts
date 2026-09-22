// Builds everything search engines and AI assistants read without running
// JavaScript: <head> tags, JSON-LD structured data, sitemap.xml, robots.txt
// and llms.txt. Used by server.js through entry-server.tsx.
import { fillTokens, fullAddress } from '@/content/store';
import type { LegalKey, SignType, SiteContent } from '@/content/types';

type Page =
  | { kind: 'home' }
  | { kind: 'signTypes' }
  | { kind: 'signType'; sign: SignType }
  | { kind: 'about' }
  | { kind: 'quote' }
  | { kind: 'contact' }
  | { kind: 'faq' }
  | { kind: 'legal'; key: LegalKey }
  | { kind: 'thankYou'; form: 'quote' | 'contact' }
  | { kind: 'notFound' };

const LEGAL_KEYS: LegalKey[] = ['privacy', 'terms', 'refund', 'shipping'];

export function resolvePage(pathname: string, content: SiteContent): Page {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { kind: 'home' };
  if (path === '/sign-types') return { kind: 'signTypes' };
  const signMatch = path.match(/^\/sign-types\/([^/]+)$/);
  if (signMatch) {
    const sign = content.signTypes.find((s) => s.id === decodeURIComponent(signMatch[1]));
    return sign ? { kind: 'signType', sign } : { kind: 'notFound' };
  }
  if (path === '/quote/thank-you') return { kind: 'thankYou', form: 'quote' };
  if (path === '/contact/thank-you') return { kind: 'thankYou', form: 'contact' };
  if (path === '/about') return { kind: 'about' };
  if (path === '/quote') return { kind: 'quote' };
  if (path === '/contact') return { kind: 'contact' };
  if (path === '/faq') return { kind: 'faq' };
  const legal = LEGAL_KEYS.find((k) => path === `/${k}`);
  if (legal) return { kind: 'legal', key: legal };
  return { kind: 'notFound' };
}

function esc(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Safe to place inside <script>: no "</script>" or HTML comment breakouts.
export function scriptJson(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

// Turns admin-formatted text (**bold**, [label](url), {tokens}) into plain text.
function plain(text: string, content: SiteContent) {
  return fillTokens(text, content)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    .replace(/\s*\n\s*/g, ' ')
    .trim();
}

function abs(origin: string, url: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

function titleCase(text: string) {
  return text.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

function priceNumber(price: string) {
  const m = price.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

export function pagePath(page: Page) {
  switch (page.kind) {
    case 'home': return '/';
    case 'signTypes': return '/sign-types';
    case 'signType': return `/sign-types/${page.sign.id}`;
    case 'legal': return `/${page.key}`;
    case 'thankYou': return `/${page.form}/thank-you`;
    case 'notFound': return '';
    default: return `/${page.kind}`;
  }
}

interface Meta {
  title: string;
  description: string;
  image: string;
  crumb: string;
  webPageType: string;
}

function metaFor(page: Page, content: SiteContent): Meta {
  const { seo, business } = content;
  const brand = business.name;
  const base = { image: seo.ogImage, webPageType: 'WebPage' };
  switch (page.kind) {
    case 'home':
      return { ...base, title: seo.title, description: seo.description, crumb: 'Home' };
    case 'signTypes':
      return { ...base, ...seo.pages.signTypes, crumb: titleCase(content.signTypesPage.label), webPageType: 'CollectionPage' };
    case 'signType': {
      const s = page.sign;
      return {
        title: s.seoTitle || `${s.name} | ${brand}`,
        description: s.seoDescription || s.shortDescription || s.description,
        image: s.images[0] || seo.ogImage,
        crumb: s.name,
        webPageType: 'WebPage',
      };
    }
    case 'about':
      return { ...base, ...seo.pages.about, image: content.about.image || seo.ogImage, crumb: 'About', webPageType: 'AboutPage' };
    case 'quote':
      return { ...base, ...seo.pages.quote, crumb: 'Get a Quote' };
    case 'contact':
      return { ...base, ...seo.pages.contact, crumb: 'Contact', webPageType: 'ContactPage' };
    case 'faq':
      return { ...base, ...seo.pages.faq, crumb: 'FAQ', webPageType: 'FAQPage' };
    case 'legal': {
      const legal = content.legal[page.key];
      // First paragraph with real text (skips short lines like "Effective Date: …").
      const first = legal.sections
        .flatMap((sec) => sec.body.split(/\n\s*\n/))
        .map((para) => plain(para, content))
        .find((para) => para.length > 80 && !para.startsWith('|') && !para.startsWith('- ')) ?? '';
      const title = legal.title.includes(brand) ? legal.title : `${legal.title} | ${brand}`;
      return { ...base, title, description: first.length > 158 ? `${first.slice(0, 155).replace(/\s+\S*$/, '')}…` : first, crumb: legal.title.replace(`${brand} – `, '') };
    }
    case 'thankYou':
      return { ...base, title: `Thank You | ${brand}`, description: content[page.form].successText, crumb: 'Thank you' };
    case 'notFound':
      return { ...base, title: `Page Not Found | ${brand}`, description: seo.description, crumb: 'Not found' };
  }
}

function businessNode(content: SiteContent, origin: string) {
  const { business, seo, signTypes } = content;
  const sameAs = Object.values(business.social).filter(Boolean);
  const node: Record<string, unknown> = {
    '@type': seo.businessType || 'LocalBusiness',
    '@id': `${origin}/#business`,
    name: business.name,
    url: `${origin}/`,
    description: seo.description,
    image: abs(origin, seo.ogImage),
    telephone: business.phone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.postalCode,
      addressCountry: business.country,
    },
    priceRange: seo.priceRange || undefined,
    openingHours: seo.openingHours || undefined,
    areaServed: seo.areaServed ? { '@type': 'Country', name: seo.areaServed } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Custom Signs',
      itemListElement: signTypes.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: `${origin}/sign-types/${s.id}` },
      })),
    },
  };
  // Google shows logos on white, where the white "C" of the built-in logo would
  // vanish, so use the dark square icon unless a custom logo was uploaded.
  const customLogo = business.logoImage && !business.logoImage.startsWith('/logo-mark-');
  node.logo = abs(origin, customLogo ? business.logoImage : '/icon-512.png');
  if (seo.latitude && seo.longitude) {
    node.geo = { '@type': 'GeoCoordinates', latitude: Number(seo.latitude), longitude: Number(seo.longitude) };
  }
  return node;
}

function serviceNode(sign: SignType, content: SiteContent, origin: string) {
  const price = priceNumber(sign.startingPrice);
  return {
    '@type': 'Service',
    '@id': `${origin}/sign-types/${sign.id}#service`,
    name: sign.name,
    serviceType: sign.name,
    description: sign.description,
    url: `${origin}/sign-types/${sign.id}`,
    image: sign.images.map((img) => abs(origin, img)),
    provider: { '@id': `${origin}/#business` },
    areaServed: content.seo.areaServed ? { '@type': 'Country', name: content.seo.areaServed } : undefined,
    offers: price
      ? {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price,
          priceSpecification: { '@type': 'PriceSpecification', minPrice: price, priceCurrency: 'USD' },
          url: `${origin}/quote`,
        }
      : undefined,
  };
}

function structuredData(page: Page, meta: Meta, content: SiteContent, origin: string, url: string) {
  const graph: Record<string, unknown>[] = [
    businessNode(content, origin),
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: content.business.name,
      publisher: { '@id': `${origin}/#business` },
      inLanguage: 'en-US',
    },
  ];

  const crumbs = [{ name: 'Home', url: `${origin}/` }];
  if (page.kind === 'signType') crumbs.push({ name: titleCase(content.signTypesPage.label), url: `${origin}/sign-types` });
  if (page.kind !== 'home') crumbs.push({ name: meta.crumb, url });

  const webPage: Record<string, unknown> = {
    '@type': meta.webPageType,
    '@id': `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#business` },
    inLanguage: 'en-US',
  };
  if (page.kind !== 'home') {
    webPage.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
    };
  }
  if (page.kind === 'faq') {
    webPage.mainEntity = content.faq.items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: plain(f.answer, content) },
    }));
  }
  graph.push(webPage);

  if (page.kind === 'signType') graph.push(serviceNode(page.sign, content, origin));
  if (page.kind === 'signTypes') {
    graph.push({
      '@type': 'ItemList',
      name: content.signTypesPage.title,
      itemListElement: content.signTypes.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: serviceNode(s, content, origin),
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

// Title and description for a page, used when navigating inside the browser.
export function pageMeta(pathname: string, content: SiteContent) {
  const meta = metaFor(resolvePage(pathname, content), content);
  return { title: meta.title, description: meta.description };
}

export interface HeadResult {
  status: number;
  html: string;
}

export function buildHead(pathname: string, content: SiteContent, origin: string): HeadResult {
  const page = resolvePage(pathname, content);
  const meta = metaFor(page, content);
  const path = pagePath(page);
  const url = `${origin}${path}`;
  const image = abs(origin, meta.image);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
  ];
  if (content.seo.googleVerification) tags.push(`<meta name="google-site-verification" content="${esc(content.seo.googleVerification)}" />`);
  if (content.seo.bingVerification) tags.push(`<meta name="msvalidate.01" content="${esc(content.seo.bingVerification)}" />`);
  if (page.kind === 'notFound' || page.kind === 'thankYou') {
    tags.push('<meta name="robots" content="noindex" />');
  } else {
    tags.push(
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:type" content="${page.kind === 'home' ? 'website' : 'article'}" />`,
      `<meta property="og:site_name" content="${esc(content.business.name)}" />`,
      `<meta property="og:title" content="${esc(meta.title)}" />`,
      `<meta property="og:description" content="${esc(meta.description)}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      '<meta property="og:locale" content="en_US" />',
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${esc(meta.title)}" />`,
      `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    );
    if (image) {
      tags.push(`<meta property="og:image" content="${esc(image)}" />`, `<meta name="twitter:image" content="${esc(image)}" />`);
    }
    tags.push(`<script type="application/ld+json">${scriptJson(structuredData(page, meta, content, origin, url))}</script>`);
  }
  return { status: page.kind === 'notFound' ? 404 : 200, html: tags.join('\n    ') };
}

export function sitePaths(content: SiteContent) {
  return [
    '/',
    '/sign-types',
    ...content.signTypes.map((s) => `/sign-types/${s.id}`),
    '/about',
    '/quote',
    '/contact',
    '/faq',
    ...LEGAL_KEYS.map((k) => `/${k}`),
  ];
}

export function buildSitemap(content: SiteContent, origin: string, lastmod: string) {
  const priority = (p: string) => (p === '/' ? '1.0' : p.startsWith('/sign-types') || p === '/quote' ? '0.9' : LEGAL_KEYS.some((k) => p === `/${k}`) ? '0.3' : '0.7');
  const urls = sitePaths(content)
    .map((p) => `  <url>\n    <loc>${esc(origin + p)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority(p)}</priority>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobots(origin: string) {
  const agents = ['*', 'Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended'];
  return [
    '# Search engines and AI assistants are welcome to read this site.',
    ...agents.map((a) => `User-agent: ${a}`),
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    'Disallow: /quote/thank-you',
    'Disallow: /contact/thank-you',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
}

// https://llmstxt.org — a plain summary for AI assistants and answer engines.
export function buildLlmsTxt(content: SiteContent, origin: string, full: boolean) {
  const { business, signTypes, faq, seo, about } = content;
  const lines = [
    `# ${business.name}`,
    '',
    `> ${seo.description}`,
    '',
    `${business.name} is a custom sign company based in ${[business.city, business.state].filter(Boolean).join(', ')} that designs, manufactures and ships custom signs to businesses across the ${seo.areaServed || 'United States'}. Customers get a free quote and digital mockup, typically in as fast as 2 hours.`,
    '',
    '## Contact',
    '',
    `- Phone: ${business.phone}`,
    `- Email: ${business.email}`,
    `- Address: ${fullAddress(business)}`,
    `- Hours: ${business.hours}`,
    `- Request a quote: ${origin}/quote`,
    '',
    '## Sign types',
    '',
    ...signTypes.map((s) => `- [${s.name}](${origin}/sign-types/${s.id}): ${s.shortDescription || s.description}${s.startingPrice ? ` Starting price: ${s.startingPrice}.` : ''}`),
    '',
    '## Pages',
    '',
    `- [About ${business.name}](${origin}/about): ${plain(about.subtitle, content)}`,
    `- [Frequently asked questions](${origin}/faq): ${seo.pages.faq.description}`,
    `- [Get a free quote](${origin}/quote): ${seo.pages.quote.description}`,
    `- [Contact](${origin}/contact)`,
    '',
    '## Policies',
    '',
    ...LEGAL_KEYS.map((k) => `- [${content.legal[k].title}](${origin}/${k})`),
    '',
  ];
  if (full) {
    lines.push('## Frequently asked questions', '');
    for (const f of faq.items) lines.push(`### ${f.question}`, '', plain(f.answer, content), '');
    lines.push('## Sign type details', '');
    for (const s of signTypes) {
      lines.push(`### ${s.name}`, '', s.description, '');
      if (s.features.length) lines.push(...s.features.map((f) => `- ${f}`), '');
    }
  } else {
    lines.push('## Optional', '', `- [Full details for AI assistants](${origin}/llms-full.txt): every FAQ answer and sign type description in one file.`, '');
  }
  return lines.join('\n');
}
