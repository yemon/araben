'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArabicText } from '@/components/ArabicText';
import { PageIntro } from '@/components/PageIntro';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

interface WordLite {
  slug: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim();
}

function score(w: WordLite, q: string, qn: string): number {
  const fields = [w.transliteration, w.english, w.bangla, w.arabic, w.slug];
  let s = 0;
  for (const f of fields) {
    if (!f) continue;
    if (f === q) s += 100;
    const fn = normalize(f);
    if (fn === qn) s += 80;
    if (fn.startsWith(qn)) s += 40;
    if (fn.includes(qn)) s += 15;
    if (f.includes(q)) s += 10;
  }
  return s;
}

export function SearchClient({ words }: { words: WordLite[] }) {
  const [q, setQ] = useState('');
  const t = useT();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const initial = p.get('q');
    if (initial) setQ(initial);
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const qn = normalize(q);
    const scored: { w: WordLite; s: number }[] = [];
    for (const w of words) {
      const s = score(w, q, qn);
      if (s > 0) scored.push({ w, s });
    }
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, 60);
  }, [q, words]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'search', label: 'Search' },
        ]}
        title={t(dict.search.heading)}
        lead={t(dict.search.lead)(words.length)}
      />

      <div className="relative">
        <label htmlFor="q" className="sr-only">
          {t(dict.search.label)}
        </label>
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(dict.search.placeholder)}
          className="w-full pl-11 pr-4 py-3.5 rounded-full border border-border bg-surface focus:border-accent outline-none shadow-sm transition-colors"
          autoComplete="off"
          autoFocus
        />
      </div>
      <p className="text-xs text-muted mt-3">
        {q.trim()
          ? results.length
            ? t(dict.search.matches)(results.length)
            : t(dict.search.noMatches)
          : t(dict.search.indexed)(words.length)}
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ w }) => (
          <li key={w.slug}>
            <Link
              href={`/word/${w.slug}/`}
              className="card card-hover p-5 no-underline text-fg flex flex-col gap-1"
            >
              <ArabicText>{w.arabic}</ArabicText>
              <span className="translit text-sm mt-1">{w.transliteration}</span>
              <span className="text-sm text-fg-2" lang="en">
                {w.english}
              </span>
              {w.bangla && (
                <span className="bn text-xs text-muted" lang="bn">
                  {w.bangla}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
