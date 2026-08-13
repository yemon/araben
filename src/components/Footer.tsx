'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function Footer() {
  const t = useT();
  const y = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl"
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
            <span className="font-serif text-lg font-semibold">
              araben<span className="text-accent">.study</span>
            </span>
          </div>
          <p className="text-muted leading-relaxed">{t(dict.footer.tagline)}</p>
        </div>
        <div>
          <div className="font-medium mb-3 text-fg">{t(dict.footer.learnHead)}</div>
          <ul className="space-y-1.5">
            <li>
              <Link href="/alphabet/">{t(dict.nav.alphabet)}</Link>
            </li>
            <li>
              <Link href="/grammar/">{t(dict.nav.grammar)}</Link>
            </li>
            <li>
              <Link href="/basics/">{t(dict.nav.basics)}</Link>
            </li>
            <li>
              <Link href="/scenarios/">{t(dict.nav.scenarios)}</Link>
            </li>
            <li>
              <Link href="/surahs/">{t(dict.nav.surahs)}</Link>
            </li>
            <li>
              <Link href="/roots/">{t(dict.nav.roots)}</Link>
            </li>
            <li>
              <Link href="/hidden/">{t(dict.nav.hidden)}</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3 text-fg">{t(dict.footer.toolsHead)}</div>
          <ul className="space-y-1.5">
            <li>
              <Link href="/search/">{t(dict.nav.search)}</Link>
            </li>
            <li>
              <Link href="/about/">{t(dict.nav.about)}</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3 text-fg">{t(dict.footer.colophonHead)}</div>
          <p className="text-muted leading-relaxed">{t(dict.footer.colophonBody)}</p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted flex flex-col md:flex-row gap-2 justify-between">
          <span>{t(dict.footer.copyright)(y)}</span>
          <span>{t(dict.footer.privacy)}</span>
        </div>
      </div>
    </footer>
  );
}
