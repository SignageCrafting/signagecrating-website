// Google Ads tracking. The base tag (gtag.js) is loaded in index.html.
//
// The Google Ads ID and conversion labels are edited in /admin under
// "SEO & Google Ads". To get a label, create a conversion action in Google Ads
// (Goals > Conversions > New conversion action > Website > "Add a conversion
// action manually") and copy the part after the slash in its event snippet:
// send_to: 'AW-18436661648/XXXXXXXXXXX'. Until a label is set, the event is
// still sent to the Google tag but won't be counted as a conversion.
import type { SiteContent } from '@/content/types';

type AdsConfig = SiteContent['googleAds'];
type ConversionKey = 'quoteFormLabel' | 'contactFormLabel' | 'phoneClickLabel';

let config: AdsConfig = { id: 'AW-18436661648', quoteFormLabel: '', contactFormLabel: '', phoneClickLabel: '' };

export function configureAds(next: AdsConfig) {
  config = next;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

export function trackConversion(key: ConversionKey, eventName: string) {
  const label = config[key].trim();
  gtag('event', eventName, { event_category: key.replace('Label', '') });
  if (label && config.id) {
    gtag('event', 'conversion', { send_to: `${config.id}/${label}` });
  }
}

// Catches every click-to-call link on the site in one place.
export function initPhoneClickTracking() {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a[href^="tel:"]');
    if (link && !window.location.pathname.startsWith('/admin')) {
      trackConversion('phoneClickLabel', 'phone_call_click');
    }
  });
}
