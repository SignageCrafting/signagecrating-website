import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Loader2, Trash2, Upload, X } from 'lucide-react';
import { api, prepareImage, type MediaItem } from './api';

function formatSize(bytes: number) {
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
}

interface Props {
  onPick?: (url: string) => void;
}

export default function MediaLibrary({ onPick }: Props) {
  const [tab, setTab] = useState<'uploads' | 'builtIn'>('uploads');
  const [media, setMedia] = useState<{ uploads: MediaItem[]; builtIn: MediaItem[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setMedia(await api.media());
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError('');
    let last = '';
    try {
      for (const file of Array.from(files)) {
        const blob = await prepareImage(file);
        last = (await api.upload(blob, file.name)).url;
      }
      await load();
      setTab('uploads');
      if (onPick && files.length === 1 && last) onPick(last);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const remove = async (item: MediaItem) => {
    if (!window.confirm(`Delete ${item.name}? Pages still using it will show a broken image.`)) return;
    await api.deleteMedia(item.name).catch((err) => setError(err.message));
    load();
  };

  const items = media ? media[tab] : [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(['uploads', 'builtIn'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${tab === t ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}>
              {t === 'uploads' ? `Your uploads${media ? ` (${media.uploads.length})` : ''}` : `Built-in${media ? ` (${media.builtIn.length})` : ''}`}
            </button>
          ))}
        </div>
        <div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          <button type="button" disabled={busy} onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {busy ? 'Uploading…' : 'Upload images'}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300" role="alert">{error}</p>}

      {!media ? (
        <div className="flex justify-center py-16 text-slate-400"><Loader2 className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {tab === 'uploads' ? 'No uploads yet. Upload JPG, PNG, WebP or GIF images up to 8 MB.' : 'No built-in images.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.url} className="group overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <button type="button" onClick={() => onPick?.(item.url)} className={`block aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 ${onPick ? 'cursor-pointer' : 'cursor-default'}`} aria-label={onPick ? `Use ${item.name}` : item.name}>
                <img src={item.url} alt="" loading="lazy" className={`h-full w-full object-cover transition ${onPick ? 'group-hover:scale-105' : ''}`} />
              </button>
              <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200" title={item.name}>{item.name}</p>
                  <p className="text-xs text-slate-400">{formatSize(item.size)}</p>
                </div>
                {!onPick && (
                  <div className="flex shrink-0">
                    <button type="button" title="Copy link" onClick={() => { navigator.clipboard?.writeText(item.url); setCopied(item.url); setTimeout(() => setCopied(''), 1500); }} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                      {copied === item.url ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    {tab === 'uploads' && (
                      <button type="button" title="Delete" onClick={() => remove(item)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaPickerDialog({ onClose, onPick }: { onClose: () => void; onPick: (url: string) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Choose an image" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Choose an image</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-5">
          <MediaLibrary onPick={onPick} />
        </div>
      </div>
    </div>
  );
}
