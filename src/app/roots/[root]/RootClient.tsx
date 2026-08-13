'use client';

import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import type { Root } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function RootClient({ root }: { root: Root }) {
  const t = useT();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { href: '/roots/', labelKey: 'roots', label: 'Roots' },
          { label: root.latin },
        ]}
        eyebrow={t(dict.section.rootLabel)}
      />

      <div className="card p-8 mb-8 flex flex-col items-center text-center gap-3">
        <ArabicText size="lg" className="text-fg">
          {root.arabic}
        </ArabicText>
        <div className="translit text-2xl">{root.latin}</div>
        <div className="chip chip-accent mt-2" lang="en">
          {root.meaning}
        </div>
      </div>

      {root.family.length > 0 && (
        <section aria-labelledby="fam">
          <h2 id="fam" className="display text-2xl mb-5">
            {t(dict.section.familyHeading)}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {root.family.map((f, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <ArabicText>{f.arabic}</ArabicText>
                  {f.pattern && <span className="chip translit">{f.pattern}</span>}
                </div>
                <div className="translit text-sm mt-2">{f.transliteration}</div>
                <div className="text-sm mt-1" lang="en">
                  {f.meaning}
                </div>
                {f.note && (
                  <div className="text-xs text-muted mt-3 bn" lang="bn">
                    {f.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {root.familyGlance && (
        <section className="mt-8 card p-6">
          <div className="chip chip-warm mb-3">◆ {t(dict.section.atGlance)}</div>
          <p className="text-sm">{root.familyGlance}</p>
        </section>
      )}
    </div>
  );
}
