'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { isFullscreenRoute } from '@/lib/nav';
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
  const [practiceOpen, setPracticeOpen] = useState(false);
  const t = useT();
  const pathname = usePathname();

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

  const practiceLinks = [
    { href: '/practice/trace/', label: t(dict.nav.traceGame), hint: t(dict.navHint.traceGame) },
  ];

  if (isFullscreenRoute(pathname)) return null;

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
          
          {/* Practice Dropdown */}
          <div className="relative">
            <button
              className="px-3 py-1.5 rounded-lg text-sm hover:bg-surface transition-colors text-fg flex items-center gap-1"
              onClick={() => setPracticeOpen(!practiceOpen)}
              onBlur={(e) => {
                // Close dropdown when clicking outside
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setTimeout(() => setPracticeOpen(false), 150);
                }
              }}
            >
              {t(dict.nav.practice)}
              <svg
                className={`w-4 h-4 transition-transform ${practiceOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {practiceOpen && (
              <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                {practiceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm hover:bg-bg transition-colors no-underline text-fg"
                    onClick={() => setPracticeOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
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
            {/* Practice section in mobile */}
            <li>
              <div className="py-3">
                <div className="font-medium text-fg mb-2">{t(dict.nav.practice)}</div>
                <div className="pl-3 space-y-2">
                  {practiceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between py-2 no-underline text-fg text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-muted">{link.hint}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
            <li className="pt-3 pb-2 md:hidden">
              <LangSwitcher />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
