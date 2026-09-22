// Everything on the public site that can be edited from /admin.

export interface LinkItem {
  label: string;
  path: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface CardItem {
  icon: string;
  title: string;
  desc: string;
}

export interface StepItem {
  title: string;
  desc: string;
}

export interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
}

export interface SignType {
  id: string;
  name: string;
  category: string;
  tag: string;
  designs: string;
  startingPrice: string;
  shortDescription: string;
  description: string;
  features: string[];
  images: string[];
  showOnHome: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageSeo {
  title: string;
  description: string;
}

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPage {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export type LegalKey = 'privacy' | 'terms' | 'refund' | 'shipping';

export interface SiteContent {
  business: {
    name: string;
    logoText: string;
    logoImage: string;
    logoImageLight: string;
    phone: string;
    email: string;
    hours: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    social: { instagram: string; facebook: string; linkedin: string };
  };
  header: {
    navLinks: LinkItem[];
    ctaLabel: string;
    ctaPath: string;
    showPhone: boolean;
  };
  footer: {
    description: string;
    quickLinksTitle: string;
    quickLinks: LinkItem[];
    legalTitle: string;
    legalLinks: LinkItem[];
    contactTitle: string;
    copyright: string;
    bottomLinks: LinkItem[];
  };
  home: {
    hero: {
      badge: string;
      headline: string;
      headlineHighlight: string;
      description: string;
      features: string[];
      ctaLabel: string;
      trustLabel: string;
      trustPoints: string[];
      cubeImages: string[];
    };
    stats: StatItem[];
    collection: { label: string; title: string; subtitle: string; detailsLabel: string; buttonLabel: string };
    process: { label: string; title: string; subtitle: string; steps: StepItem[] };
    why: { label: string; title: string; subtitle: string; items: CardItem[] };
    portfolio: { label: string; title: string; subtitle: string; hoverLabel: string; images: string[] };
    testimonials: { label: string; title: string; subtitle: string; items: Testimonial[] };
    cta: { title: string; text: string; buttonLabel: string };
  };
  signTypesPage: {
    label: string;
    title: string;
    subtitle: string;
    allLabel: string;
    quoteButtonLabel: string;
    pricePrefix: string;
    ctaTitle: string;
    ctaText: string;
    ctaButtonLabel: string;
  };
  signTypes: SignType[];
  about: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    image: string;
    storyTitle: string;
    story: string;
    stats: StatItem[];
    valuesLabel: string;
    valuesTitle: string;
    values: CardItem[];
    ctaTitle: string;
    ctaText: string;
    ctaButtonLabel: string;
  };
  quote: {
    label: string;
    title: string;
    subtitle: string;
    badges: string[];
    signTypeOptions: string[];
    budgetOptions: string[];
    submitLabel: string;
    footnotes: string[];
    successTitle: string;
    successText: string;
  };
  contact: {
    label: string;
    title: string;
    subtitle: string;
    submitLabel: string;
    successTitle: string;
    successText: string;
    infoTitle: string;
    socialTitle: string;
  };
  faq: {
    label: string;
    title: string;
    subtitle: string;
    homeTitle: string;
    homeLimit: number;
    items: FaqItem[];
  };
  legal: Record<LegalKey, LegalPage>;
  seo: {
    siteUrl: string;
    title: string;
    description: string;
    ogImage: string;
    pages: {
      signTypes: PageSeo;
      about: PageSeo;
      quote: PageSeo;
      contact: PageSeo;
      faq: PageSeo;
    };
    businessType: string;
    priceRange: string;
    openingHours: string;
    areaServed: string;
    latitude: string;
    longitude: string;
    googleVerification: string;
    bingVerification: string;
  };
  googleAds: {
    id: string;
    quoteFormLabel: string;
    contactFormLabel: string;
    phoneClickLabel: string;
  };
}
