import type { SiteContent } from '@/content/types';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(method: string, url: string, body?: unknown, raw?: Blob): Promise<T> {
  const headers: Record<string, string> = { 'X-Requested-With': 'signage-admin' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (raw) headers['Content-Type'] = raw.type || 'application/octet-stream';
  const res = await fetch(url, {
    method,
    headers,
    credentials: 'same-origin',
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  return data as T;
}

export interface Session {
  configured: boolean;
  twoFactor: boolean;
  authenticated: boolean;
}

export interface Lead {
  id: string;
  type: 'quote' | 'contact';
  createdAt: string;
  read: boolean;
  page: string;
  ip: string;
  userAgent: string;
  fields: Record<string, string>;
}

export interface MediaItem {
  name: string;
  url: string;
  size: number;
  modified: string;
}

export interface Status {
  dataDir: string;
  writable: boolean;
  dataInsideApp: boolean;
  serverRendering: boolean;
  twoFactor: boolean;
  savedAt: string | null;
  leads: number;
  unreadLeads: number;
  uploads: number;
  node: string;
  activity: { time: string; ip: string; action: string; detail: string }[];
}

export const api = {
  session: () => request<Session>('GET', '/api/session'),
  login: (username: string, password: string, code: string) => request<{ ok: true }>('POST', '/api/login', { username, password, code }),
  logout: () => request<{ ok: true }>('POST', '/api/logout', {}),
  content: () => request<{ content: unknown; savedAt: string | null }>('GET', '/api/content'),
  saveContent: (content: SiteContent, section: string) =>
    request<{ content: SiteContent; savedAt: string }>('PUT', '/api/content', { content, section }),
  history: () => request<{ items: { id: string; savedAt: string; size: number }[] }>('GET', '/api/history'),
  restore: (id: string) => request<{ content: SiteContent; savedAt: string }>('POST', `/api/history/${encodeURIComponent(id)}/restore`, {}),
  media: () => request<{ uploads: MediaItem[]; builtIn: MediaItem[] }>('GET', '/api/media'),
  upload: (file: Blob, name: string) => request<{ url: string }>('POST', `/api/upload?name=${encodeURIComponent(name)}`, undefined, file),
  deleteMedia: (name: string) => request<{ ok: true }>('DELETE', `/api/media/${encodeURIComponent(name)}`),
  leads: () => request<{ leads: Lead[] }>('GET', '/api/leads'),
  markLead: (id: string, read: boolean) => request<{ ok: true }>('PATCH', `/api/leads/${encodeURIComponent(id)}`, { read }),
  deleteLead: (id: string) => request<{ ok: true }>('DELETE', `/api/leads/${encodeURIComponent(id)}`),
  status: () => request<Status>('GET', '/api/status'),
};

// Large photos are scaled down before upload so pages stay fast.
export async function prepareImage(file: File): Promise<Blob> {
  const resizable = file.type === 'image/jpeg' || file.type === 'image/webp';
  if (!resizable) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const max = 2000;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1_200_000) return file;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, file.type, 0.85));
  return blob && blob.size < file.size ? blob : file;
}
