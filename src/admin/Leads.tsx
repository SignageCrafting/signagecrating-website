import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Download, Inbox, Loader2, Mail, Phone, Search, Trash2 } from 'lucide-react';
import { api, type Lead } from './api';
import { inputClass } from './utils';

const FIELD_LABELS: Record<string, string> = {
  fullName: 'Name',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  businessName: 'Business',
  signType: 'Sign type',
  budget: 'Budget',
  details: 'Project details',
  message: 'Message',
};

function leadName(lead: Lead) {
  return lead.fields.fullName || lead.fields.name || lead.fields.email;
}

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function toCsv(leads: Lead[]) {
  const cols = ['createdAt', 'type', 'fullName', 'name', 'email', 'phone', 'businessName', 'signType', 'budget', 'details', 'message', 'page'];
  // A leading = + - @ would run as a formula in Excel, so neutralise it.
  const cell = (v: string) => {
    const s = String(v ?? '');
    return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  const rows = leads.map((l) => cols.map((c) => cell(c === 'createdAt' ? l.createdAt : c === 'type' ? l.type : c === 'page' ? l.page : l.fields[c])).join(','));
  return [cols.join(','), ...rows].join('\n');
}

export default function Leads({ onUnreadChange }: { onUnreadChange: (n: number) => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'quote' | 'contact'>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(
    () =>
      api.leads()
        .then(({ leads }) => {
          setLeads(leads);
          onUnreadChange(leads.filter((l) => !l.read).length);
        })
        .catch((err) => setError(err.message)),
    [onUnreadChange],
  );

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (leads ?? []).filter((l) => {
      if (filter === 'unread' && l.read) return false;
      if ((filter === 'quote' || filter === 'contact') && l.type !== filter) return false;
      return !q || Object.values(l.fields).some((v) => v.toLowerCase().includes(q));
    });
  }, [leads, filter, query]);

  const setRead = async (lead: Lead, read: boolean) => {
    setLeads((prev) => {
      const next = prev?.map((l) => (l.id === lead.id ? { ...l, read } : l)) ?? null;
      onUnreadChange(next?.filter((l) => !l.read).length ?? 0);
      return next;
    });
    await api.markLead(lead.id, read).catch(() => {});
  };

  const toggle = (lead: Lead) => {
    setOpen(open === lead.id ? null : lead.id);
    if (!lead.read) setRead(lead, true);
  };

  const remove = async (lead: Lead) => {
    if (!window.confirm(`Delete the lead from ${leadName(lead)}? This can't be undone.`)) return;
    await api.deleteLead(lead.id).catch((err) => setError(err.message));
    load();
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Leads</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Every quote request and contact message sent from the website.</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={!visible.length} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(['all', 'unread', 'quote', 'contact'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${filter === f ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}>
              {f === 'quote' ? 'Quotes' : f === 'contact' ? 'Messages' : f}
            </button>
          ))}
        </div>
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className={`${inputClass} pl-9`} placeholder="Search leads" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search leads" />
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}

      {!leads ? (
        <div className="flex justify-center py-16 text-slate-400"><Loader2 className="animate-spin" /></div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Inbox className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={36} />
          <p className="text-sm text-slate-500 dark:text-slate-400">{leads.length ? 'No leads match this filter.' : 'No leads yet. Form submissions from the Quote and Contact pages will appear here.'}</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {visible.map((lead) => {
            const isOpen = open === lead.id;
            const summary = lead.fields.details || lead.fields.message || '';
            return (
              <div key={lead.id}>
                <button type="button" onClick={() => toggle(lead)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50" aria-expanded={isOpen}>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${lead.read ? 'bg-transparent' : 'bg-teal-500'}`} aria-label={lead.read ? undefined : 'Unread'} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`truncate text-sm ${lead.read ? 'font-medium text-slate-700 dark:text-slate-200' : 'font-semibold text-slate-900 dark:text-white'}`}>{leadName(lead)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${lead.type === 'quote' ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{lead.type === 'quote' ? 'Quote' : 'Message'}</span>
                      {lead.fields.signType && <span className="text-xs text-slate-500 dark:text-slate-400">{lead.fields.signType}</span>}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{summary}</p>
                  </div>
                  <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{when(lead.createdAt)}</span>
                  <ChevronDown size={16} className={`shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-9 dark:border-slate-800 dark:bg-slate-950/40">
                    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {Object.entries(lead.fields).filter(([, v]) => v).map(([k, v]) => (
                        <div key={k} className={k === 'details' || k === 'message' ? 'sm:col-span-2' : ''}>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{FIELD_LABELS[k] ?? k}</dt>
                          <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm text-slate-800 dark:text-slate-100">{v}</dd>
                        </div>
                      ))}
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Received</dt>
                        <dd className="mt-0.5 text-sm text-slate-800 dark:text-slate-100">{when(lead.createdAt)}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {lead.fields.email && (
                        <a href={`mailto:${lead.fields.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"><Mail size={14} /> Reply by email</a>
                      )}
                      {lead.fields.phone && (
                        <a href={`tel:${lead.fields.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"><Phone size={14} /> Call</a>
                      )}
                      <button type="button" onClick={() => setRead(lead, !lead.read)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">Mark as {lead.read ? 'unread' : 'read'}</button>
                      <button type="button" onClick={() => remove(lead)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
