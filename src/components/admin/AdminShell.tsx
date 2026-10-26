'use client';

/**
 * The admin panel's frame: a fixed sidebar on wide screens, a top bar with a
 * slide-in drawer on narrow ones. The site's own Nav and Footer stand aside
 * on /admin (see isFullscreenRoute).
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Icon, type IconName } from './icons';

const NAV: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: '/admin/', label: 'Dashboard', icon: 'dashboard', exact: true },
  { href: '/admin/scenarios/', label: 'Scenarios', icon: 'messages' },
  { href: '/admin/surahs/', label: 'Surahs', icon: 'book' },
  { href: '/admin/hidden/', label: 'Hidden in Bangla', icon: 'languages' },
  { href: '/admin/trace/', label: 'Trace game', icon: 'penLine' },
];

const isActive = (pathname: string, href: string, exact?: boolean) => {
  const base = href.replace(/\/$/, '');
  const path = pathname.replace(/\/$/, '');
  return exact ? path === base : path === base || path.startsWith(`${base}/`);
};

function LogoMark() {
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      style={{ background: 'var(--gradient-accent)' }}
      aria-hidden
    >
      <span className="ar font-bold text-[color:var(--accent-fg)]" style={{ fontSize: '1.15em', lineHeight: 1 }}>
        ع
      </span>
    </span>
  );
}

function Sidebar({ email, name, onNavigate }: { email: string; name: string | null; onNavigate?: () => void }) {
  const pathname = usePathname() ?? '';
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin/" onClick={onNavigate} className="flex items-center gap-3 px-5 py-5 no-underline">
        <LogoMark />
        <span className="leading-tight">
          <span className="block font-serif text-lg font-semibold text-fg">
            araben<span className="text-accent">.study</span>
          </span>
          <span className="block text-xs font-medium uppercase tracking-wider text-muted">Admin</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Admin sections">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                active ? 'bg-accent-soft text-accent' : 'text-fg-2 hover:bg-surface-2 hover:text-fg'
              }`}
            >
              {active && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-accent" aria-hidden />}
              <Icon name={item.icon} size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-muted no-underline transition-colors hover:text-accent"
        >
          <Icon name="external" size={16} strokeWidth={2} />
          View the site
        </Link>
        <ThemeToggle />
        <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold uppercase text-accent">
            {(name || email).slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            {name && <p className="truncate text-sm font-semibold text-fg">{name}</p>}
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login/' })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-rose-600"
            aria-label="Sign out"
            title="Sign out"
          >
            <Icon name="logOut" size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({
  email,
  name,
  children,
}: {
  email: string;
  name: string | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer after navigating, and let Escape close it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface lg:block">
        <Sidebar email={email} name={name} />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Link href="/admin/" className="flex items-center gap-2 no-underline">
          <LogoMark />
          <span className="font-serif font-semibold text-fg">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-fg"
          aria-label="Open the menu"
          aria-expanded={open}
        >
          <Icon name="menu" size={18} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close the menu"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-surface shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:text-fg"
              aria-label="Close the menu"
            >
              <Icon name="x" size={18} />
            </button>
            <Sidebar email={email} name={name} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
