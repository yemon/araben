'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Icon } from '@/components/admin/icons';
import { ErrorBanner, Field, inputClass } from '@/components/admin/ui';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.ok && !result.error) {
      router.push(callbackUrl);
      router.refresh();
      return;
    }
    // One message for every failure: it shouldn't reveal whether the email
    // exists, or that it has been locked for a while.
    setError("That email and password don't match an admin account. After several tries, wait 15 minutes.");
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span
            className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'var(--gradient-accent)' }}
            aria-hidden
          >
            <span className="ar font-bold text-[color:var(--accent-fg)]" style={{ fontSize: '1.6em', lineHeight: 1 }}>
              ع
            </span>
          </span>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-fg">
            araben<span className="text-accent">.study</span> admin
          </h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage the content.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <Field label="Email">
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <ErrorBanner error={error} />
          <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
            <Icon name="lock" size={16} />
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
