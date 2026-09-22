import { useState } from 'react';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { api, type Session } from './api';
import { inputClass } from './utils';

export default function Login({ session, onSuccess }: { session: Session; onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(username, password, code);
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/logo-mark-light.png" alt="Signage Crafting" width={92} height={48} className="mx-auto mb-4 h-12 w-auto dark:hidden" />
          <img src="/logo-mark-dark.png" alt="Signage Crafting" width={92} height={48} className="mx-auto mb-4 hidden h-12 w-auto dark:block" />
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Signage Crafting Admin</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to edit your website</p>
        </div>

        {!session.configured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <p className="mb-2 font-semibold">Admin isn't set up yet</p>
            <p>In Hostinger, open your Node.js app &rarr; <strong>Environment variables</strong> and add <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">ADMIN_PASSWORD</code> with a password of at least 12 characters. Then save to redeploy.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <label htmlFor="login-user" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
              <input id="login-user" className={inputClass} autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label htmlFor="login-pass" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input id="login-pass" type="password" className={inputClass} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {session.twoFactor && (
              <div>
                <label htmlFor="login-code" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">6-digit code from your authenticator app</label>
                <input id="login-code" className={`${inputClass} tracking-[0.3em]`} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} required value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
            )}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300" role="alert">{error}</p>}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Sign in
            </button>
          </form>
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} /> Protected: 5 failed attempts locks sign-in for 15 minutes
        </p>
      </div>
    </div>
  );
}
