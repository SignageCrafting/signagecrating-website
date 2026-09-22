// Google Ads tracking. The base tag (gtag.js) is loaded in index.html.
//
// To count conversions in Google Ads, create a conversion action for each
// event below (Goals > Conversions > New conversion action > Website >
// "Add a conversion action manually"), copy the label from its event snippet
// (the part after the slash in send_to: 'AW-18436661648/XXXXXXXXXXX') and
// paste it here. Until a label is set, that event is still sent to the Google
// tag but will not show up as a conversion.
export const GOOGLE_ADS_ID = 'AW-18436661648';

export const CONVERSION_LABELS = {
  quoteForm: '',
  contactForm: '',
  phoneClick: '',
};

type ConversionKey = keyof typeof CONVERSION_LABELS;

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
  const label = CONVERSION_LABELS[key];
  gtag('event', eventName, { event_category: key });
  if (label) {
    gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${label}` });
  }
}

// Catches every click-to-call link on the site in one place.
export function initPhoneClickTracking() {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a[href^="tel:"]');
    if (link) trackConversion('phoneClick', 'phone_call_click');
  });
}
