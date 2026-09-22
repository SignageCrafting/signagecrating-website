// Server bundle used by server.js (built with `vite build --ssr`).
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ContentContext, mergeContent } from './content/store';
import { sanitizeContent } from './content/sanitize';
import { buildHead, buildLlmsTxt, buildRobots, buildSitemap } from './seo/head';
import SiteRoutes from './SiteRoutes';

export function render(url: string, saved: unknown, origin: string) {
  const content = mergeContent(saved);
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <ContentContext.Provider value={content}>
        <SiteRoutes admin={null} />
      </ContentContext.Provider>
    </StaticRouter>,
  );
  const head = buildHead(new URL(url, 'http://localhost').pathname, content, origin);
  return { appHtml, headHtml: head.html, status: head.status };
}

export { mergeContent, sanitizeContent, buildLlmsTxt, buildRobots, buildSitemap };
