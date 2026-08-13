'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import type { Surah } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function SurahsClient({ surahs }: { surahs: Surah[] }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'surahs', label: 'Surahs' },
        ]}
        titleKey={dict.path.surahsTitle}
        leadKey={dict.path.surahsDesc}
      />

      <ol className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {surahs.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/surahs/${s.slug}/`}
              className="card card-hover p-5 no-underline text-fg flex items-start justify-between gap-3"
            >
              <span className="min-w-0">
                {s.arabicName && (
                  <ArabicText className="block !text-2xl !leading-tight mb-1">
                    {s.arabicName}
                  </ArabicText>
                )}
                <span className="display text-base block" lang="en">
                  {s.englishName}
                </span>
                <span className="bn text-xs text-muted block mt-0.5" lang="bn">
                  {s.banglaName}
                </span>
              </span>
              <span className="chip chip-warm shrink-0">#{s.mushafNumber}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
