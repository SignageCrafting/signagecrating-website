import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { CheckCircle2, ExternalLink, History as HistoryIcon, Image, Inbox, LayoutDashboard, Loader2, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { mergeContent } from '@/content/store';
import type { SiteContent } from '@/content/types';
import { api, ApiError, type Session } from './api';
import { AdminContext } from './context';
import { setIn } from './utils';
import { sectionGroups, sections } from './schema';
import Login from './Login';
import Dashboard from './Dashboard';
import Leads from './Leads';
import ContentEditor from './ContentEditor';
import History from './History';
import MediaLibrary, { MediaPickerDialog } from './MediaLibrary';

function useAdminTheme() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') setTheme(saved);
    } catch {
      // Storage blocked; keep the default.
    }
  }, [setTheme]);
  return { dark: theme === 'dark', toggleTheme };
}

const navItem = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
  }`;

function Shell({ onSignedOut, dark, toggleTheme }: { onSignedOut: () => void; dark: boolean; toggleTheme: () => void }) {
  const [saved, setSaved] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [picker, setPicker] = useState<((url: string | null) => void) | null>(null);
  const location = useLocation();
  const noticeTimer = useRef<number | undefined>(undefined);

  const showNotice = useCallback((kind: 'ok' | 'error', text: string) => {
    setNotice({ kind, text });
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), kind === 'ok' ? 3000 : 8000);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof ApiError && err.status === 401) onSignedOut();
    else showNotice('error', (err as Error).message);
  }, [onSignedOut, showNotice]);

  useEffect(() => {
    api.content()
      .then(({ content, savedAt }) => {
        const merged = mergeContent(content);
        setSaved(merged);
        setDraft(merged);
        setSavedAt(savedAt);
      })
      .catch(handleError);
    api.status().then((s) => setUnread(s.unreadLeads)).catch(() => {});
  }, [handleError]);

  const dirty = useMemo(() => !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const save = useCallback(async () => {
    if (!draft || saving) return;
    setSaving(true);
    try {
      const section = location.pathname.replace(/^\/admin\/?/, '') || 'dashboard';
      const res = await api.saveContent(draft, section);
      setSaved(res.content);
      setDraft(res.content);
      setSavedAt(res.savedAt);
      showNotice('ok', 'Saved. Your changes are live.');
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }, [draft, saving, location.pathname, showNotice, handleError]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty) save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, save]);

  const update = useCallback((path: (string | number)[], value: unknown) => {
    setDraft((prev) => (prev ? setIn(prev, path, value) : prev));
  }, []);

  const pickImage = useCallback(() => new Promise<string | null>((resolve) => setPicker(() => resolve)), []);
  const closePicker = (url: string | null) => {
    picker?.(url);
    setPicker(null);
  };

  const signOut = async () => {
    if (dirty && !window.confirm('You have unsaved changes. Sign out anyway?')) return;
    await api.logout().catch(() => {});
    onSignedOut();
  };

  const contextValue = useMemo(() => (draft ? { content: draft, update, pickImage } : null), [draft, update, pickImage]);

  if (!contextValue) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400 dark:bg-slate-950"><Loader2 className="animate-spin" /></div>;
  }

  const sidebar = (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4" aria-label="Admin">
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-teal-300 dark:bg-slate-800">SC</div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Signage Crafting</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Website admin</p>
        </div>
      </div>
      <div className="space-y-1">
        <NavLink to="/admin" end className={navItem}><LayoutDashboard size={16} /> Dashboard</NavLink>
        <NavLink to="/admin/leads" className={navItem}>
          <Inbox size={16} /> Leads
          {unread > 0 && <span className="ml-auto rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-semibold text-white">{unread}</span>}
        </NavLink>
      </div>
      {sectionGroups.map((group) => (
        <div key={group}>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{group}</p>
          <div className="space-y-1">
            {sections.filter((s) => s.group === group).map((s) => (
              <NavLink key={s.id} to={`/admin/${s.id}`} className={navItem}><s.icon size={16} /> {s.title}</NavLink>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Files</p>
        <div className="space-y-1">
          <NavLink to="/admin/media" className={navItem}><Image size={16} /> Media library</NavLink>
          <NavLink to="/admin/history" className={navItem}><HistoryIcon size={16} /> Version history</NavLink>
        </div>
      </div>
      <div className="mt-auto space-y-1 border-t border-slate-200 pt-4 dark:border-slate-800">
        <a href="/" target="_blank" rel="noopener" className={navItem({ isActive: false })}><ExternalLink size={16} /> View website</a>
        <button type="button" onClick={toggleTheme} className={`${navItem({ isActive: false })} w-full`}>{dark ? <Sun size={16} /> : <Moon size={16} />} {dark ? 'Light mode' : 'Dark mode'}</button>
        <button type="button" onClick={signOut} className={`${navItem({ isActive: false })} w-full`}><LogOut size={16} /> Sign out</button>
      </div>
    </nav>
  );

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">{sidebar}</aside>

        {menuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMenuOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-900">
              <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-3 top-3 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close menu"><X size={18} /></button>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
            <button type="button" onClick={() => setMenuOpen(true)} className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Open menu"><Menu size={20} /></button>
            <div className="min-w-0 flex-1 text-sm">
              {dirty ? (
                <span className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-amber-700 dark:text-amber-400"><span className="h-2 w-2 rounded-full bg-amber-500" /> Unsaved changes</span>
              ) : (
                <span className="block truncate text-slate-500 dark:text-slate-400">
                  <span className="sm:hidden">{savedAt ? 'All changes saved' : 'Built-in content'}</span>
                  <span className="hidden sm:inline">{savedAt ? `All changes saved · ${new Date(savedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}` : 'Showing the built-in content. Save once to start editing.'}</span>
                </span>
              )}
            </div>
            <button type="button" disabled={!dirty || saving} onClick={() => setDraft(saved)} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 sm:block dark:text-slate-300 dark:hover:bg-slate-800">Discard</button>
            <button type="button" disabled={!dirty || saving} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-40" title="Save (Ctrl/⌘ + S)">
              {saving && <Loader2 size={15} className="animate-spin" />} Save changes
            </button>
          </header>

          {notice && (
            <div className="fixed bottom-4 right-4 z-50 max-w-sm" role="status">
              <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm shadow-lg ${notice.kind === 'ok' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-red-600 text-white'}`}>
                {notice.kind === 'ok' && <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-teal-400 dark:text-teal-600" />}
                {notice.text}
              </div>
            </div>
          )}

          <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<Leads onUnreadChange={setUnread} />} />
              <Route path="media" element={
                <div>
                  <div className="mb-6">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Media library</h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Upload images once and use them anywhere on the site. Large photos are resized automatically.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><MediaLibrary /></div>
                </div>
              } />
              <Route path="history" element={<History dirty={dirty} onRestored={(content, at) => { setSaved(content); setDraft(content); setSavedAt(at); showNotice('ok', 'Version restored. The website now shows it.'); }} />} />
              <Route path=":sectionId" element={<ContentEditor />} />
            </Routes>
          </main>
        </div>

        {picker && <MediaPickerDialog onClose={() => closePicker(null)} onPick={(url) => closePicker(url)} />}
      </div>
    </AdminContext.Provider>
  );
}

export default function AdminApp() {
  const { dark, toggleTheme } = useAdminTheme();
  const [session, setSession] = useState<Session | null>(null);

  const refresh = useCallback(() => {
    api.session()
      .then(setSession)
      .catch(() => setSession({ configured: false, twoFactor: false, authenticated: false }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className={dark ? 'dark' : ''} style={{ colorScheme: dark ? 'dark' : 'light' }}>
      {!session ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400 dark:bg-slate-950"><Loader2 className="animate-spin" /></div>
      ) : !session.authenticated ? (
        <Login session={session} onSuccess={refresh} />
      ) : (
        <Shell onSignedOut={refresh} dark={dark} toggleTheme={toggleTheme} />
      )}
    </div>
  );
}
