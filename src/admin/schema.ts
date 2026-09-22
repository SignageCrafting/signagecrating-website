import type { LucideIcon } from 'lucide-react';
import { Building2, PanelTop, PanelBottom, Home, LayoutGrid, Info, FileText, Mail, HelpCircle, Shield, ScrollText, RotateCcw, Truck, Search, Megaphone } from 'lucide-react';

export type Field =
  | { kind: 'text'; key: string; label: string; help?: string; placeholder?: string; half?: boolean }
  | { kind: 'textarea'; key: string; label: string; help?: string; rows?: number; rich?: boolean; counter?: number }
  | { kind: 'number'; key: string; label: string; help?: string; min?: number; max?: number; half?: boolean }
  | { kind: 'toggle'; key: string; label: string; help?: string }
  | { kind: 'select'; key: string; label: string; help?: string; options: { value: string; label: string }[]; half?: boolean }
  | { kind: 'image'; key: string; label: string; help?: string }
  | { kind: 'images'; key: string; label: string; help?: string }
  | { kind: 'strings'; key: string; label: string; help?: string; placeholder?: string }
  | { kind: 'list'; key: string; label: string; help?: string; itemLabel: string; titleKey: string; fields: Field[] }
  | { kind: 'group'; key: string; label: string; help?: string; fields: Field[] };

export interface Section {
  id: string;
  title: string;
  description: string;
  group: string;
  icon: LucideIcon;
  path: string[];
  preview: string;
  fields: Field[];
}

export const RICH_HELP = 'Formatting: **bold**, [link text](https://example.com or /page), blank line = new paragraph, lines starting with "- " = bullet list, lines like "| a | b |" = table. Auto-filled: {business} {email} {phone} {address} {year}';

const links = (key: string, label: string, help?: string): Field => ({
  kind: 'list',
  key,
  label,
  help,
  itemLabel: 'Link',
  titleKey: 'label',
  fields: [
    { kind: 'text', key: 'label', label: 'Text', half: true },
    { kind: 'text', key: 'path', label: 'Goes to', placeholder: '/quote', help: 'A page like /about, or a full https:// address', half: true },
  ],
});

const stats = (key: string, label: string): Field => ({
  kind: 'list',
  key,
  label,
  itemLabel: 'Stat',
  titleKey: 'label',
  fields: [
    { kind: 'text', key: 'value', label: 'Number', placeholder: '15+', half: true },
    { kind: 'text', key: 'label', label: 'Label', placeholder: 'Years Experience', half: true },
  ],
});

const cards = (key: string, label: string): Field => ({
  kind: 'list',
  key,
  label,
  itemLabel: 'Card',
  titleKey: 'title',
  fields: [
    { kind: 'text', key: 'icon', label: 'Badge word', help: 'Short word shown in the square badge', half: true },
    { kind: 'text', key: 'title', label: 'Title', half: true },
    { kind: 'textarea', key: 'desc', label: 'Text', rows: 2 },
  ],
});

const pageSeo = (key: string, label: string): Field => ({
  kind: 'group',
  key,
  label,
  fields: [
    { kind: 'text', key: 'title', label: 'Title in Google', help: 'Aim for 50-60 characters.' },
    { kind: 'textarea', key: 'description', label: 'Description in Google', rows: 2, counter: 160 },
  ],
});

const legal = (key: 'privacy' | 'terms' | 'refund' | 'shipping', title: string, icon: LucideIcon): Section => ({
  id: key,
  title,
  description: 'Edit the policy title, date and each section of text.',
  group: 'Policies',
  icon,
  path: ['legal', key],
  preview: `/${key}`,
  fields: [
    { kind: 'text', key: 'title', label: 'Page title' },
    { kind: 'text', key: 'lastUpdated', label: 'Last updated', placeholder: 'September 2026', half: true },
    {
      kind: 'list',
      key: 'sections',
      label: 'Sections',
      itemLabel: 'Section',
      titleKey: 'heading',
      fields: [
        { kind: 'text', key: 'heading', label: 'Heading' },
        { kind: 'textarea', key: 'body', label: 'Text', rows: 10, rich: true },
      ],
    },
  ],
});

export const sections: Section[] = [
  {
    id: 'business',
    title: 'Business & Contact',
    description: 'Name, logo, phone, email, address and social links. Used in the header, footer, contact page, policies and Google.',
    group: 'Business',
    icon: Building2,
    path: ['business'],
    preview: '/contact',
    fields: [
      { kind: 'text', key: 'name', label: 'Business name', half: true },
      { kind: 'text', key: 'logoText', label: 'Logo text', help: 'Shown when no logo image is set', half: true },
      { kind: 'image', key: 'logoImage', label: 'Logo image', help: 'Optional. Replaces the logo text in the header and footer. A wide PNG with a transparent background works best.' },
      { kind: 'text', key: 'phone', label: 'Phone number', placeholder: '+1 (209) 340-4633', half: true },
      { kind: 'text', key: 'email', label: 'Email address', half: true },
      { kind: 'text', key: 'hours', label: 'Business hours', placeholder: 'Mon-Fri 8AM-6PM', half: true },
      { kind: 'text', key: 'street', label: 'Street address', half: true },
      { kind: 'text', key: 'city', label: 'City', half: true },
      { kind: 'text', key: 'state', label: 'State', half: true },
      { kind: 'text', key: 'postalCode', label: 'ZIP code', half: true },
      { kind: 'text', key: 'country', label: 'Country', half: true },
      {
        kind: 'group',
        key: 'social',
        label: 'Social media',
        help: 'Full https:// links. Empty ones are hidden on the site.',
        fields: [
          { kind: 'text', key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
          { kind: 'text', key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
          { kind: 'text', key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
        ],
      },
    ],
  },
  {
    id: 'header',
    title: 'Header',
    description: 'Menu links and the button at the top of every page.',
    group: 'Layout',
    icon: PanelTop,
    path: ['header'],
    preview: '/',
    fields: [
      links('navLinks', 'Menu links'),
      { kind: 'text', key: 'ctaLabel', label: 'Button text', half: true },
      { kind: 'text', key: 'ctaPath', label: 'Button goes to', placeholder: '/quote', half: true },
      { kind: 'toggle', key: 'showPhone', label: 'Show phone number in the header' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Text and link columns at the bottom of every page.',
    group: 'Layout',
    icon: PanelBottom,
    path: ['footer'],
    preview: '/',
    fields: [
      { kind: 'textarea', key: 'description', label: 'About text', rows: 3 },
      { kind: 'text', key: 'quickLinksTitle', label: 'Links column title', half: true },
      { kind: 'text', key: 'legalTitle', label: 'Legal column title', half: true },
      links('quickLinks', 'Quick links'),
      links('legalLinks', 'Legal links'),
      { kind: 'text', key: 'contactTitle', label: 'Contact column title', half: true },
      { kind: 'text', key: 'copyright', label: 'Copyright line', help: '{year} becomes the current year', half: true },
      links('bottomLinks', 'Bottom bar links'),
    ],
  },
  {
    id: 'home',
    title: 'Home Page',
    description: 'Hero, stats, process, reasons, portfolio, testimonials and the closing banner.',
    group: 'Pages',
    icon: Home,
    path: ['home'],
    preview: '/',
    fields: [
      {
        kind: 'group',
        key: 'hero',
        label: 'Hero (top of the page)',
        fields: [
          { kind: 'text', key: 'badge', label: 'Badge above the headline', help: 'Leave empty to hide. Only use ratings you can prove.' },
          { kind: 'textarea', key: 'headline', label: 'Headline', rows: 2 },
          { kind: 'text', key: 'headlineHighlight', label: 'Highlighted last word(s)', help: 'Shown in the accent color after the headline' },
          { kind: 'textarea', key: 'description', label: 'Intro text', rows: 3 },
          { kind: 'strings', key: 'features', label: 'Check-mark points' },
          { kind: 'text', key: 'ctaLabel', label: 'Button text', half: true },
          { kind: 'text', key: 'trustLabel', label: 'Trust line label', half: true },
          { kind: 'strings', key: 'trustPoints', label: 'Trust points' },
          { kind: 'images', key: 'cubeImages', label: 'Rotating cube images', help: 'Up to 6 images for the 3D cube on large screens' },
        ],
      },
      stats('stats', 'Stats bar'),
      {
        kind: 'group',
        key: 'collection',
        label: 'Sign types section',
        help: 'The cards come from Sign Types (the ones marked "Show on home page").',
        fields: [
          { kind: 'text', key: 'label', label: 'Small label', half: true },
          { kind: 'text', key: 'title', label: 'Title', half: true },
          { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
          { kind: 'text', key: 'detailsLabel', label: 'Card link text', half: true },
          { kind: 'text', key: 'buttonLabel', label: 'Button text', half: true },
        ],
      },
      {
        kind: 'group',
        key: 'process',
        label: 'How it works',
        fields: [
          { kind: 'text', key: 'label', label: 'Small label', half: true },
          { kind: 'text', key: 'title', label: 'Title', half: true },
          { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
          {
            kind: 'list',
            key: 'steps',
            label: 'Steps',
            help: 'Numbered automatically',
            itemLabel: 'Step',
            titleKey: 'title',
            fields: [
              { kind: 'text', key: 'title', label: 'Title' },
              { kind: 'textarea', key: 'desc', label: 'Text', rows: 2 },
            ],
          },
        ],
      },
      {
        kind: 'group',
        key: 'why',
        label: 'Why choose us',
        fields: [
          { kind: 'text', key: 'label', label: 'Small label', half: true },
          { kind: 'text', key: 'title', label: 'Title', half: true },
          { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
          cards('items', 'Reasons'),
        ],
      },
      {
        kind: 'group',
        key: 'portfolio',
        label: 'Portfolio',
        fields: [
          { kind: 'text', key: 'label', label: 'Small label', half: true },
          { kind: 'text', key: 'title', label: 'Title', half: true },
          { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
          { kind: 'text', key: 'hoverLabel', label: 'Text on hover', half: true },
          { kind: 'images', key: 'images', label: 'Portfolio images' },
        ],
      },
      {
        kind: 'group',
        key: 'testimonials',
        label: 'Testimonials',
        help: 'Use real customer reviews only. Made-up reviews break Google Ads and FTC rules.',
        fields: [
          { kind: 'text', key: 'label', label: 'Small label', half: true },
          { kind: 'text', key: 'title', label: 'Title', half: true },
          { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
          {
            kind: 'list',
            key: 'items',
            label: 'Reviews',
            itemLabel: 'Review',
            titleKey: 'name',
            fields: [
              { kind: 'text', key: 'name', label: 'Name', half: true },
              { kind: 'text', key: 'role', label: 'Role & business', half: true },
              { kind: 'number', key: 'rating', label: 'Stars (0-5)', min: 0, max: 5, half: true },
              { kind: 'textarea', key: 'text', label: 'Review', rows: 3 },
            ],
          },
        ],
      },
      {
        kind: 'group',
        key: 'cta',
        label: 'Closing banner',
        fields: [
          { kind: 'text', key: 'title', label: 'Title' },
          { kind: 'textarea', key: 'text', label: 'Text', rows: 2 },
          { kind: 'text', key: 'buttonLabel', label: 'Button text', half: true },
        ],
      },
    ],
  },
  {
    id: 'sign-types',
    title: 'Sign Types',
    description: 'Every sign type, its images, features, price and Google listing. Each one gets its own page at /sign-types/<id>.',
    group: 'Pages',
    icon: LayoutGrid,
    path: [],
    preview: '/sign-types',
    fields: [
      {
        kind: 'group',
        key: 'signTypesPage',
        label: 'Sign Types page text',
        fields: [
          { kind: 'text', key: 'label', label: 'Small label', half: true },
          { kind: 'text', key: 'title', label: 'Title', half: true },
          { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
          { kind: 'text', key: 'allLabel', label: '"All" filter text', half: true },
          { kind: 'text', key: 'quoteButtonLabel', label: 'Quote button text', half: true },
          { kind: 'text', key: 'pricePrefix', label: 'Price prefix', placeholder: 'From', half: true },
          { kind: 'text', key: 'ctaTitle', label: 'Bottom box title' },
          { kind: 'textarea', key: 'ctaText', label: 'Bottom box text', rows: 2 },
          { kind: 'text', key: 'ctaButtonLabel', label: 'Bottom box button', half: true },
        ],
      },
      {
        kind: 'list',
        key: 'signTypes',
        label: 'Sign types',
        itemLabel: 'Sign type',
        titleKey: 'name',
        fields: [
          { kind: 'text', key: 'name', label: 'Name', half: true },
          { kind: 'text', key: 'id', label: 'Page address', help: 'Used in the link: /sign-types/<this>. Lowercase words and dashes. Changing it breaks old links and ads.', half: true },
          { kind: 'text', key: 'category', label: 'Filter category', placeholder: 'Neon', half: true },
          { kind: 'text', key: 'tag', label: 'Card badge', placeholder: 'Most Popular', half: true },
          { kind: 'text', key: 'designs', label: 'Designs count', placeholder: '450+ Designs', half: true },
          { kind: 'text', key: 'startingPrice', label: 'Starting price', placeholder: '$299', half: true },
          { kind: 'textarea', key: 'shortDescription', label: 'Short description (home page card)', rows: 2 },
          { kind: 'textarea', key: 'description', label: 'Full description', rows: 4 },
          { kind: 'strings', key: 'features', label: 'Features' },
          { kind: 'images', key: 'images', label: 'Images', help: 'The first image is the main one' },
          { kind: 'toggle', key: 'showOnHome', label: 'Show on home page' },
          { kind: 'text', key: 'seoTitle', label: 'Title in Google', help: 'Aim for 50-60 characters. Include the main keyword, e.g. "Custom Channel Letter Signs".' },
          { kind: 'textarea', key: 'seoDescription', label: 'Description in Google', rows: 2, counter: 160 },
        ],
      },
    ],
  },
  {
    id: 'about',
    title: 'About Page',
    description: 'Your story, stats and values.',
    group: 'Pages',
    icon: Info,
    path: ['about'],
    preview: '/about',
    fields: [
      { kind: 'text', key: 'label', label: 'Small label', half: true },
      { kind: 'text', key: 'titleHighlight', label: 'Highlighted words', half: true },
      { kind: 'textarea', key: 'title', label: 'Title', rows: 2, help: 'Press Enter for a line break' },
      { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
      { kind: 'image', key: 'image', label: 'Story image' },
      { kind: 'text', key: 'storyTitle', label: 'Story title' },
      { kind: 'textarea', key: 'story', label: 'Story', rows: 8, rich: true },
      stats('stats', 'Stats'),
      { kind: 'text', key: 'valuesLabel', label: 'Values small label', half: true },
      { kind: 'text', key: 'valuesTitle', label: 'Values title', half: true },
      cards('values', 'Values'),
      { kind: 'text', key: 'ctaTitle', label: 'Bottom box title' },
      { kind: 'textarea', key: 'ctaText', label: 'Bottom box text', rows: 2 },
      { kind: 'text', key: 'ctaButtonLabel', label: 'Bottom box button', half: true },
    ],
  },
  {
    id: 'quote',
    title: 'Quote Page',
    description: 'Quote form text, dropdown choices and the thank-you message.',
    group: 'Pages',
    icon: FileText,
    path: ['quote'],
    preview: '/quote',
    fields: [
      { kind: 'text', key: 'label', label: 'Small label', half: true },
      { kind: 'textarea', key: 'title', label: 'Title', rows: 2, help: 'Press Enter for a line break' },
      { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
      { kind: 'strings', key: 'badges', label: 'Badges under the title' },
      { kind: 'strings', key: 'signTypeOptions', label: 'Sign type choices' },
      { kind: 'strings', key: 'budgetOptions', label: 'Budget choices' },
      { kind: 'text', key: 'submitLabel', label: 'Submit button text', half: true },
      { kind: 'strings', key: 'footnotes', label: 'Notes under the button' },
      { kind: 'text', key: 'successTitle', label: 'Thank-you title' },
      { kind: 'textarea', key: 'successText', label: 'Thank-you text', rows: 3 },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Page',
    description: 'Contact page text. Phone, email and address come from Business & Contact.',
    group: 'Pages',
    icon: Mail,
    path: ['contact'],
    preview: '/contact',
    fields: [
      { kind: 'text', key: 'label', label: 'Small label', half: true },
      { kind: 'text', key: 'title', label: 'Title', half: true },
      { kind: 'textarea', key: 'subtitle', label: 'Subtitle', rows: 2 },
      { kind: 'text', key: 'submitLabel', label: 'Submit button text', half: true },
      { kind: 'text', key: 'infoTitle', label: 'Contact box title', half: true },
      { kind: 'text', key: 'socialTitle', label: 'Social box title', half: true },
      { kind: 'text', key: 'successTitle', label: 'Thank-you title' },
      { kind: 'textarea', key: 'successText', label: 'Thank-you text', rows: 3 },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Questions and answers shown on /faq and the home page. They help Google and AI assistants answer questions about you.',
    group: 'Pages',
    icon: HelpCircle,
    path: ['faq'],
    preview: '/faq',
    fields: [
      { kind: 'text', key: 'label', label: 'Small label', half: true },
      { kind: 'text', key: 'title', label: 'FAQ page title', half: true },
      { kind: 'textarea', key: 'subtitle', label: 'FAQ page subtitle', rows: 2 },
      { kind: 'text', key: 'homeTitle', label: 'Home page section title', half: true },
      { kind: 'number', key: 'homeLimit', label: 'Questions shown on home page', min: 0, max: 50, half: true },
      {
        kind: 'list',
        key: 'items',
        label: 'Questions',
        help: 'Write questions the way customers ask them, and start each answer with the direct answer.',
        itemLabel: 'Question',
        titleKey: 'question',
        fields: [
          { kind: 'text', key: 'question', label: 'Question' },
          { kind: 'textarea', key: 'answer', label: 'Answer', rows: 4, rich: true },
        ],
      },
    ],
  },
  legal('privacy', 'Privacy Policy', Shield),
  legal('terms', 'Terms of Service', ScrollText),
  legal('refund', 'Refund Policy', RotateCcw),
  legal('shipping', 'Shipping Policy', Truck),
  {
    id: 'seo',
    title: 'SEO & Search',
    description: 'How the site appears in Google and AI assistants, plus local business details for maps.',
    group: 'Marketing',
    icon: Search,
    path: ['seo'],
    preview: '/',
    fields: [
      { kind: 'text', key: 'siteUrl', label: 'Site address', placeholder: 'https://signagecrafting.com', help: 'Your main domain, with https:// and no slash at the end. Used for canonical links and the sitemap. Leave empty until the domain is live.' },
      { kind: 'text', key: 'title', label: 'Home page title in Google', help: 'Aim for 50-60 characters.' },
      { kind: 'textarea', key: 'description', label: 'Home page description in Google', rows: 2, counter: 160 },
      { kind: 'image', key: 'ogImage', label: 'Share image', help: 'Shown when a link is shared on Facebook, LinkedIn, iMessage etc. 1200×630 works best.' },
      {
        kind: 'group',
        key: 'pages',
        label: 'Other pages in Google',
        fields: [
          pageSeo('signTypes', 'Sign Types page'),
          pageSeo('about', 'About page'),
          pageSeo('quote', 'Quote page'),
          pageSeo('contact', 'Contact page'),
          pageSeo('faq', 'FAQ page'),
        ],
      },
      {
        kind: 'select',
        key: 'businessType',
        label: 'Business type for Google',
        half: true,
        options: [
          { value: 'LocalBusiness', label: 'Local business' },
          { value: 'ProfessionalService', label: 'Professional service' },
          { value: 'HomeAndConstructionBusiness', label: 'Construction / installation' },
          { value: 'Store', label: 'Store' },
        ],
      },
      { kind: 'text', key: 'priceRange', label: 'Price range', placeholder: '$$', half: true },
      { kind: 'text', key: 'openingHours', label: 'Opening hours (Google format)', placeholder: 'Mo-Fr 08:00-18:00', help: 'Days: Mo Tu We Th Fr Sa Su. Separate groups with a comma, e.g. "Mo-Fr 08:00-18:00, Sa 09:00-13:00"', half: true },
      { kind: 'text', key: 'areaServed', label: 'Area served', placeholder: 'United States', half: true },
      { kind: 'text', key: 'latitude', label: 'Latitude', help: 'Optional. Right-click your shop on Google Maps to copy it.', half: true },
      { kind: 'text', key: 'longitude', label: 'Longitude', half: true },
      { kind: 'text', key: 'googleVerification', label: 'Google Search Console code', help: 'In Search Console choose "HTML tag" and paste only the content="..." value.', half: true },
      { kind: 'text', key: 'bingVerification', label: 'Bing Webmaster code', help: 'From Bing Webmaster Tools > "HTML Meta Tag" (content value only).', half: true },
    ],
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    description: 'Your Google Ads account and conversion tracking. Easiest setup: in Google Ads create website conversion actions based on a page URL — "URL contains /quote/thank-you" for quote requests and "/contact/thank-you" for messages. No labels needed. Or create them with code and paste the labels below.',
    group: 'Marketing',
    icon: Megaphone,
    path: ['googleAds'],
    preview: '/',
    fields: [
      { kind: 'text', key: 'id', label: 'Google Ads ID', placeholder: 'AW-18436661648', half: true },
      { kind: 'text', key: 'quoteFormLabel', label: 'Quote form conversion label', help: 'From Google Ads > Goals > Conversions > your action > Tag setup. The part after the slash in send_to.', half: true },
      { kind: 'text', key: 'contactFormLabel', label: 'Contact form conversion label', half: true },
      { kind: 'text', key: 'phoneClickLabel', label: 'Phone click conversion label', half: true },
    ],
  },
];

export const sectionGroups = ['Business', 'Layout', 'Pages', 'Policies', 'Marketing'];
