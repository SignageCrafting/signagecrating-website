# signagecrating-website

Website for Signage Crafting, built with React, Vite, TypeScript and Tailwind CSS.

## Development

```bash
npm install
npm run dev      # local dev server on http://localhost:3000
npm run build    # production build into dist/
```

## Deploying on Hostinger (Node.js web app)

| Setting | Value |
|---|---|
| Framework preset | React / Vite |
| Node.js version | 22 |
| Build command | `npm run build` |
| Output directory | `dist` |
| Entry file | leave empty |

## Google Ads

The Google tag (`AW-18436661648`) is loaded in `index.html`. Quote form submits,
contact form submits and phone-number clicks are tracked in `src/lib/googleAds.ts`.
Paste each conversion action's label into `CONVERSION_LABELS` in that file to
count them as conversions in Google Ads.
