import { useEffect, useState } from 'react';
import { ContentContext, mergeContent } from './store';
import { configureAds } from '@/lib/googleAds';
import type { SiteContent } from './types';

export default function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => mergeContent(window.__SITE_CONTENT__));

  useEffect(() => {
    // server.js always injects the content (or null). It's missing only on the
    // Vite dev server or plain static hosting, so ask the API directly there.
    if (window.__SITE_CONTENT__ !== undefined) return;
    fetch('/api/content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content) setContent(mergeContent(data.content));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    configureAds(content.googleAds);
  }, [content.googleAds]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
