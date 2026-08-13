'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import type { Root } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function RootsClient({ roots }: { roots: Root[] }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'roots', label: 'Roots' },
        ]}
        titleKey={dict.path.rootsTitle}
        leadKey={dict.path.rootsDesc}
      />

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {roots.map((r) => (
          <Link
            key={r.slug}
            href={`/roots/${r.slug}/`}
            className="card card-hover p-5 no-underline text-fg flex flex-col"
          >
            <ArabicText>{r.arabic}</ArabicText>
            <span className="translit text-xs mt-2">{r.latin}</span>
            <span className="text-sm mt-1" lang="en">
              {r.meaning}
            </span>
            {r.family.length > 0 && (
              <span className="text-xs text-muted mt-3">
                {t(dict.section.familyCount)(r.family.length)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
