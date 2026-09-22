export type Path = (string | number)[];

export function getIn(obj: unknown, path: Path): unknown {
  let cur = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

export function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const copy = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, unknown>;
  copy[head] = setIn(copy[head], rest, value);
  return copy as T;
}

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20';
