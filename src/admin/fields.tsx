import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { blankOf } from '@/content/store';
import { defaultContent } from '@/content/defaults';
import { useAdmin } from './context';
import { getIn, inputClass } from './utils';
import { RICH_HELP, type Field } from './schema';

type Path = (string | number)[];

// New list items start as an empty copy of the first built-in item.
function templateFor(path: Path) {
  const list = getIn(defaultContent, path.map((p) => (typeof p === 'number' ? 0 : p)));
  const first = Array.isArray(list) ? list[0] : undefined;
  return first === undefined ? '' : blankOf(first);
}


const iconButton =
  'inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100';

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{children}</label>;
}

function Help({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{children}</p>;
}

function fieldId(path: Path) {
  return `f-${path.join('-')}`;
}

function MoveButtons({ index, count, onMove, onRemove, label }: { index: number; count: number; onMove: (to: number) => void; onRemove: () => void; label: string }) {
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={iconButton} onClick={() => onMove(index - 1)} disabled={index === 0} aria-label={`Move ${label} up`} title="Move up"><ArrowUp size={15} /></button>
      <button type="button" className={iconButton} onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label={`Move ${label} down`} title="Move down"><ArrowDown size={15} /></button>
      <button type="button" className={`${iconButton} hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-950 dark:hover:!text-red-400`} onClick={onRemove} aria-label={`Remove ${label}`} title="Remove"><Trash2 size={15} /></button>
    </div>
  );
}

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300">
      <Plus size={15} /> {children}
    </button>
  );
}

function ImageThumb({ src }: { src: string }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : null}
    </div>
  );
}

function StringsField({ field, path, value }: { field: Extract<Field, { kind: 'strings' }>; path: Path; value: string[] }) {
  const { update } = useAdmin();
  const set = (next: string[]) => update(path, next);
  return (
    <div>
      <Label>{field.label}</Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className={inputClass} value={item} placeholder={field.placeholder} onChange={(e) => set(value.map((v, j) => (j === i ? e.target.value : v)))} aria-label={`${field.label} ${i + 1}`} />
            <MoveButtons index={i} count={value.length} label={`item ${i + 1}`} onMove={(to) => set(move(value, i, to))} onRemove={() => set(value.filter((_, j) => j !== i))} />
          </div>
        ))}
      </div>
      <div className="mt-2"><AddButton onClick={() => set([...value, ''])}>Add</AddButton></div>
      <Help>{field.help}</Help>
    </div>
  );
}

function ImageField({ field, path, value }: { field: Extract<Field, { kind: 'image' }>; path: Path; value: string }) {
  const { update, pickImage } = useAdmin();
  return (
    <div>
      <Label>{field.label}</Label>
      <div className="flex items-start gap-4">
        <div className="h-24 w-32 shrink-0"><ImageThumb src={value} /></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={async () => { const url = await pickImage(); if (url) update(path, url); }} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">
            <ImagePlus size={15} /> {value ? 'Change image' : 'Choose image'}
          </button>
          {value && (
            <button type="button" onClick={() => update(path, '')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <X size={15} /> Remove
            </button>
          )}
        </div>
      </div>
      <Help>{field.help}</Help>
    </div>
  );
}

function ImagesField({ field, path, value }: { field: Extract<Field, { kind: 'images' }>; path: Path; value: string[] }) {
  const { update, pickImage } = useAdmin();
  const set = (next: string[]) => update(path, next);
  return (
    <div>
      <Label>{field.label}</Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((src, i) => (
          <div key={`${src}-${i}`} className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
            <div className="aspect-[4/3]"><ImageThumb src={src} /></div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{i === 0 ? 'Main' : `#${i + 1}`}</span>
              <MoveButtons index={i} count={value.length} label={`image ${i + 1}`} onMove={(to) => set(move(value, i, to))} onRemove={() => set(value.filter((_, j) => j !== i))} />
            </div>
          </div>
        ))}
        <button type="button" onClick={async () => { const url = await pickImage(); if (url) set([...value, url]); }} className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 text-sm font-medium text-slate-500 transition hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-teal-400 dark:hover:text-teal-300">
          <ImagePlus size={20} /> Add image
        </button>
      </div>
      <Help>{field.help}</Help>
    </div>
  );
}

function ListField({ field, path, value }: { field: Extract<Field, { kind: 'list' }>; path: Path; value: Record<string, unknown>[] }) {
  const { update } = useAdmin();
  const [open, setOpen] = useState<Set<number>>(() => new Set(value.length <= 2 ? value.map((_, i) => i) : []));
  const set = (next: Record<string, unknown>[]) => update(path, next);
  const toggle = (i: number) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    return next;
  });
  const reorder = (from: number, to: number) => {
    set(move(value, from, to));
    setOpen((prev) => {
      const next = new Set<number>();
      for (const i of prev) next.add(i === from ? to : i === to ? from : i);
      return next;
    });
  };

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{field.label} <span className="font-normal text-slate-400">({value.length})</span></p>
          <Help>{field.help}</Help>
        </div>
      </div>
      <div className="space-y-2">
        {value.map((item, i) => {
          const title = String(item[field.titleKey] ?? '').trim() || `${field.itemLabel} ${i + 1}`;
          const isOpen = open.has(i);
          return (
            <div key={i} className="rounded-lg border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 px-3 py-2">
                <button type="button" onClick={() => toggle(i)} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-expanded={isOpen}>
                  <ChevronDown size={16} className={`shrink-0 text-slate-400 transition ${isOpen ? '' : '-rotate-90'}`} />
                  <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{title}</span>
                </button>
                <MoveButtons
                  index={i}
                  count={value.length}
                  label={title}
                  onMove={(to) => reorder(i, to)}
                  onRemove={() => {
                    if (window.confirm(`Remove "${title}"?`)) {
                      set(value.filter((_, j) => j !== i));
                      setOpen(new Set());
                    }
                  }}
                />
              </div>
              {isOpen && (
                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                  <FieldGrid fields={field.fields} path={[...path, i]} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <AddButton
          onClick={() => {
            set([...value, templateFor(path) as Record<string, unknown>]);
            setOpen((prev) => new Set(prev).add(value.length));
          }}
        >
          Add {field.itemLabel.toLowerCase()}
        </AddButton>
      </div>
    </div>
  );
}

function FieldView({ field, path }: { field: Field; path: Path }) {
  const { content, update } = useAdmin();
  const full = [...path, field.key];
  const value = getIn(content, full);
  const id = fieldId(full);

  switch (field.kind) {
    case 'text':
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <input id={id} className={inputClass} value={String(value ?? '')} placeholder={field.placeholder} onChange={(e) => update(full, e.target.value)} />
          <Help>{field.help}</Help>
        </div>
      );
    case 'textarea': {
      const text = String(value ?? '');
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <textarea id={id} className={`${inputClass} leading-relaxed`} rows={field.rows ?? 3} value={text} onChange={(e) => update(full, e.target.value)} />
          <div className="flex items-start justify-between gap-4">
            <Help>{field.rich ? RICH_HELP : field.help}</Help>
            {field.counter && (
              <span className={`mt-1.5 shrink-0 text-xs ${text.length > field.counter ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>{text.length}/{field.counter}</span>
            )}
          </div>
        </div>
      );
    }
    case 'number':
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <input id={id} type="number" className={inputClass} min={field.min} max={field.max} value={Number(value ?? 0)} onChange={(e) => update(full, e.target.value === '' ? 0 : Number(e.target.value))} />
          <Help>{field.help}</Help>
        </div>
      );
    case 'toggle':
      return (
        <label className="flex cursor-pointer items-start gap-3">
          <button type="button" role="switch" aria-checked={!!value} onClick={() => update(full, !value)} className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${value ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{field.label}</span>
            <Help>{field.help}</Help>
          </span>
        </label>
      );
    case 'select':
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <select id={id} className={inputClass} value={String(value ?? '')} onChange={(e) => update(full, e.target.value)}>
            {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Help>{field.help}</Help>
        </div>
      );
    case 'image':
      return <ImageField field={field} path={full} value={String(value ?? '')} />;
    case 'images':
      return <ImagesField field={field} path={full} value={Array.isArray(value) ? (value as string[]) : []} />;
    case 'strings':
      return <StringsField field={field} path={full} value={Array.isArray(value) ? (value as string[]) : []} />;
    case 'list':
      return <ListField field={field} path={full} value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []} />;
    case 'group':
      return (
        <fieldset className="rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-slate-800">
          <legend className="px-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">{field.label}</legend>
          {field.help && <div className="-mt-1 mb-3"><Help>{field.help}</Help></div>}
          <FieldGrid fields={field.fields} path={full} />
        </fieldset>
      );
  }
}

export function FieldGrid({ fields, path }: { fields: Field[]; path: Path }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key} className={'half' in field && field.half ? '' : 'sm:col-span-2'}>
          <FieldView field={field} path={path} />
        </div>
      ))}
    </div>
  );
}
