import { useEffect, useState } from 'react';
import { History as HistoryIcon, Loader2, RotateCcw } from 'lucide-react';
import { api } from './api';
import type { SiteContent } from '@/content/types';

interface Props {
  dirty: boolean;
  onRestored: (content: SiteContent, savedAt: string) => void;
}

export default function History({ dirty, onRestored }: Props) {
  const [items, setItems] = useState<{ id: string; savedAt: string; size: number }[] | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.history().then((r) => setItems(r.items)).catch((err) => setError(err.message));
  }, []);

  const restore = async (id: string, savedAt: string) => {
    const label = new Date(savedAt).toLocaleString();
    const warning = dirty ? '\n\nYour unsaved changes will be lost.' : '';
    if (!window.confirm(`Restore the website to how it was on ${label}? The current version is kept in this list.${warning}`)) return;
    setBusy(id);
    try {
      const res = await api.restore(id);
      onRestored(res.content, res.savedAt);
      setItems((await api.history()).items);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Version history</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">The last 30 saved versions. Restore one if a change went wrong.</p>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
      {!items ? (
        <div className="flex justify-center py-16 text-slate-400"><Loader2 className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <HistoryIcon className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={36} />
          <p className="text-sm text-slate-500 dark:text-slate-400">No earlier versions yet. Each time you save, the previous version is kept here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{new Date(item.savedAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
                <p className="text-xs text-slate-400">{Math.round(item.size / 1000)} KB</p>
              </div>
              <button type="button" disabled={!!busy} onClick={() => restore(item.id, item.savedAt)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                {busy === item.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />} Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
