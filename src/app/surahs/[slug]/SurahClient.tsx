'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import type { Surah } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function SurahClient({ surah }: { surah: Surah }) {
  const t = useT();

  const byVerse = new Map<number, typeof surah.verses>();
  for (const v of surah.verses) {
    const n = v.ayah ?? 0;
    if (!byVerse.has(n)) byVerse.set(n, []);
    byVerse.get(n)!.push(v);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { href: '/surahs/', labelKey: 'surahs', label: 'Surahs' },
          { label: surah.englishName },
        ]}
        eyebrow={`${t(dict.section.mushafPrefix)}${surah.mushafNumber}`}
        title={`${surah.englishName}`}
        banglaSubtitle={`সূরা ${surah.banglaName}`}
      />

      {surah.arabicName && (
        <div className="mb-8 -mt-4">
          <ArabicText className="!text-4xl md:!text-5xl !leading-tight">
            {surah.arabicName}
          </ArabicText>
        </div>
      )}

      <div className="space-y-10">
        {[...byVerse.entries()].map(([verse, words]) => (
          <section key={verse} aria-label={`Verse ${verse}`}>
            <div className="chip mb-3">
              {t(dict.section.versePrefix)} {verse}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {words.map((w, i) => (
                <Link
                  key={i}
                  href={`/word/${w.wordSlug}/`}
                  className="card-2 px-3.5 py-2.5 no-underline hover:border-accent transition-colors flex flex-col min-w-[9ch]"
                  title={w.english}
                >
                  <ArabicText>{w.arabic}</ArabicText>
                  <span className="translit text-xs mt-0.5">{w.transliteration}</span>
                  <span className="text-xs text-fg-2 mt-0.5" lang="en">
                    {w.english}
                  </span>
                  {w.bangla && (
                    <span className="bn text-xs text-muted" lang="bn">
                      {w.bangla}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
