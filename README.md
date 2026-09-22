# signagecrating-website

Website and admin panel for Signage Crafting. React + Vite front end, rendered on
the server by a small Express app (`server.js`) so every page arrives as real
HTML for Google, AI assistants and fast first paint.

## What's where

| Path | What it is |
|---|---|
| `server.js` | Production server: pages, admin API, form leads, uploads, sitemap, security headers |
| `src/content/defaults.ts` | Built-in site content (everything the admin can edit) |
| `src/admin/` | The admin panel at `/admin` |
| `src/seo/head.ts` | Titles, meta tags, structured data, `sitemap.xml`, `robots.txt`, `llms.txt` |
| `src/pages/` | Public pages |

Everything saved in the admin (content, uploaded images, form leads, version
history, audit log) is stored in a `cms-data` folder **outside** the deployed
code, so redeploys never wipe it. On Hostinger that's
`~/domains/<your-domain>/cms-data`. It is never committed to git.

## Local development

```bash
npm install
npm run build
ADMIN_PASSWORD='choose-a-long-password' npm start   # http://localhost:3000
```

For live-reload while editing code, run `npm run dev:api` and `npm run dev` in
two terminals (http://localhost:3000, API proxied to port 3001).

## Deploying on Hostinger (Node.js web app)

Websites > Add Website > Node.js web app > Import Git repository (or upload a zip
without `node_modules`), then use:

| Setting | Value |
|---|---|
| Framework preset | Express (or "Other") |
| Node.js version | 22 |
| Build command | `npm run build` |
| Output directory | leave empty |
| Entry file | `server.js` |

Environment variables (Hostinger > your app > Environment variables):

| Variable | Required | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | yes | At least 12 characters. `npm run admin:password` makes a strong one. |
| `ADMIN_USERNAME` | no | Defaults to `admin`. |
| `ADMIN_TOTP_SECRET` | strongly recommended | 2-step verification. Run `npm run admin:2fa` and follow the steps. |
| `SESSION_SECRET` | no | Generated automatically and stored in `cms-data`. |
| `DATA_DIR` | no | Only if you want the data folder somewhere else. |

After the first deploy, open `https://<your-domain>/admin`, sign in and check the
Dashboard: "Data storage is working" and "Pages are pre-rendered" should both be
green.

## Security

- Admin login: strong password required, optional 2-step codes, 5 failed attempts
  per IP (30 overall) locks login for 15 minutes, every sign-in is logged.
- Sessions: signed, HttpOnly, SameSite=Strict cookies that expire after 8 hours.
  Changing the password or 2FA secret signs everyone out.
- Every admin change is re-checked on the server: only safe links and images are
  saved, text is length-limited, and all output is escaped.
- Uploads: only real JPG/PNG/WebP/GIF/AVIF files (checked by content, not name),
  random file names, served with a sandboxing Content-Security-Policy.
- Headers: strict Content-Security-Policy with per-request nonces, HSTS on HTTPS,
  X-Frame-Options, nosniff, Referrer-Policy and Permissions-Policy.
- Old WordPress and hacked-page URLs (`/wp-admin`, `*.php`, `*.html`, …) return
  `410 Gone` so Google removes them quickly.
- Forms: honeypot for bots, per-IP and global rate limits, cross-site posts blocked.
- `npm audit` is clean. Keep it that way: run `npm audit` before each deploy.

## SEO launch checklist

1. In the admin under **SEO & Search**, set *Site address* to your live domain
   (e.g. `https://signagecrafting.com`).
2. Add the site to Google Search Console and Bing Webmaster Tools (paste their
   verification codes in the same section) and submit `/sitemap.xml`.
3. Because the old site was hacked, use Search Console > Security & Manual
   Actions to check for warnings, then Removals to clear any spam URLs still
   showing in Google.
4. Create or claim the Google Business Profile with the same name, address and
   phone number as the website. Local searches like "sign company near me" come
   from it.
5. In Google Ads, create conversion actions for the quote form, contact form and
   phone clicks, and paste their labels in the admin under **Google Ads**.
