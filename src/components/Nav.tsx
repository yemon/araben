'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LangSwitcher } from './LangSwitcher';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={
        'inline-flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ' +
        className
      }
      style={{ background: 'var(--gradient-accent)' }}
      aria-hidden
    >
      <span
        className="ar text-[color:var(--accent-fg)] font-bold"
        style={{ fontSize: '1.15em', lineHeight: 1 }}
      >
        ع
      </span>
    </span>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const t = useT();

  const links = [
    { href: '/alphabet/', label: t(dict.nav.alphabet), hint: t(dict.navHint.alphabet) },
    { href: '/grammar/', label: t(dict.nav.grammar), hint: t(dict.navHint.grammar) },
    { href: '/basics/', label: t(dict.nav.basics), hint: t(dict.navHint.basics) },
    { href: '/scenarios/', label: t(dict.nav.scenarios), hint: t(dict.navHint.scenarios) },
    { href: '/surahs/', label: t(dict.nav.surahs), hint: t(dict.navHint.surahs) },
    { href: '/roots/', label: t(dict.nav.roots), hint: t(dict.navHint.roots) },
    { href: '/hidden/', label: t(dict.nav.hidden), hint: t(dict.navHint.hidden) },
    { href: '/search/', label: t(dict.nav.search), hint: t(dict.navHint.search) },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-lg"
      style={{ background: 'color-mix(in oklab, var(--bg) 78%, transparent)' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-lg no-underline text-fg"
        >
          <LogoMark />
          <span className="hidden xs:inline">
            araben<span className="text-accent">.study</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-3" aria-label="Primary">
          {links.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-lg text-sm hover:bg-surface transition-colors no-underline text-fg"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <LangSwitcher />
          </div>
          <ThemeToggle />
          <button
            className="lg:hidden px-2.5 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
            aria-label={t(dict.nav.menu)}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="lg:hidden border-t border-border bg-surface"
          aria-label="Mobile primary"
        >
          <ul className="px-4 py-2 divide-y divide-[color:var(--border-2)]">
            {links.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex items-center justify-between py-3 no-underline text-fg"
                  onClick={() => setOpen(false)}
                >
                  <span className="font-medium">{n.label}</span>
                  <span className="text-xs text-muted">{n.hint}</span>
                </Link>
              </li>
            ))}
            <li className="pt-3 pb-2 md:hidden">
              <LangSwitcher />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
