import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ExternalLink, Image, Inbox, Loader2, Save, ShieldCheck } from 'lucide-react';
import { api, type Status } from './api';
import { sections } from './schema';

function when(iso: string | null) {
  return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';
}

const ACTIONS: Record<string, string> = {
  login: 'Signed in',
  logout: 'Signed out',
  'login-failed': 'Failed sign-in',
  'content-saved': 'Saved changes',
  'content-restored': 'Restored a version',
  'image-uploaded': 'Uploaded image',
  'image-deleted': 'Deleted image',
  'lead-deleted': 'Deleted lead',
};

function Check({ ok, title, children }: { ok: boolean; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      {ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />}
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{title}</p>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{children}</p>
      </div>
    </li>
  );
}

export default function Dashboard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.status().then(setStatus).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>;
  if (!status) return <div className="flex justify-center py-24 text-slate-400"><Loader2 className="animate-spin" /></div>;

  const cards = [
    { label: 'New leads', value: status.unreadLeads, icon: Inbox, to: '/admin/leads', accent: status.unreadLeads > 0 },
    { label: 'Total leads', value: status.leads, icon: Inbox, to: '/admin/leads' },
    { label: 'Uploaded images', value: status.uploads, icon: Image, to: '/admin/media' },
    { label: 'Last saved', value: when(status.savedAt), icon: Save, to: '/admin/history', small: true },
  ];
  const origin = window.location.origin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Edit any part of the website from the menu. Changes go live as soon as you save.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to, accent, small }) => (
          <Link key={label} to={to} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
              <Icon size={16} className={accent ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'} />
            </div>
            <p className={`mt-2 font-semibold ${small ? 'text-sm' : 'text-2xl'} ${accent ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Edit your website</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <Link key={s.id} to={`/admin/${s.id}`} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50/50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-teal-800 dark:hover:bg-teal-950/30">
                <s.icon size={16} className="text-slate-400" /> {s.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><ShieldCheck size={16} className="text-teal-600 dark:text-teal-400" /> Security</h2>
            <ul className="space-y-3">
              <Check ok={status.twoFactor} title={status.twoFactor ? '2-step verification is on' : '2-step verification is off'}>
                {status.twoFactor ? 'Signing in needs a code from your authenticator app.' : 'Strongly recommended. Run "npm run admin:2fa" and add ADMIN_TOTP_SECRET in Hostinger.'}
              </Check>
              <Check
                ok={status.writable && !status.dataInsideApp}
                title={!status.writable ? 'Data folder is not writable' : status.dataInsideApp ? 'Data is stored inside the app folder' : 'Data storage is working'}
              >
                {!status.writable
                  ? `The server can't write to ${status.dataDir}. Set DATA_DIR in Hostinger.`
                  : status.dataInsideApp
                    ? `Saved content, images and leads are in ${status.dataDir}, which a redeploy would erase. In Hostinger add the environment variable DATA_DIR pointing to a folder in your home directory, e.g. /home/<your-user>/cms-data.`
                    : `Content, images and leads are stored in ${status.dataDir}, outside the website code.`}
              </Check>
              <Check ok={status.serverRendering} title={status.serverRendering ? 'Pages are pre-rendered for Google' : 'Pre-rendering is off'}>
                {status.serverRendering ? 'Search engines and AI assistants see full page content.' : 'Redeploy the site so the server bundle is built.'}
              </Check>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">SEO tools</h2>
            <ul className="space-y-2 text-sm">
              {[
                ['Sitemap (submit in Google Search Console)', '/sitemap.xml'],
                ['robots.txt', '/robots.txt'],
                ['llms.txt (for AI assistants)', '/llms.txt'],
                ['Test structured data with Google', `https://search.google.com/test/rich-results?url=${encodeURIComponent(origin + '/')}`],
                ['Test page speed', `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(origin + '/')}`],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-teal-700 hover:underline dark:text-teal-300">{label} <ExternalLink size={12} /></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Recent activity</h2>
        {status.activity.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-4 font-medium">When</th>
                  <th className="pb-2 pr-4 font-medium">What</th>
                  <th className="pb-2 pr-4 font-medium">Details</th>
                  <th className="pb-2 font-medium">IP address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {status.activity.map((a, i) => (
                  <tr key={i} className={a.action === 'login-failed' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}>
                    <td className="whitespace-nowrap py-2 pr-4">{when(a.time)}</td>
                    <td className="whitespace-nowrap py-2 pr-4">{ACTIONS[a.action] ?? a.action}</td>
                    <td className="max-w-[220px] truncate py-2 pr-4 text-slate-500 dark:text-slate-400" title={a.detail}>{a.detail}</td>
                    <td className="whitespace-nowrap py-2 font-mono text-xs text-slate-500 dark:text-slate-400">{a.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
