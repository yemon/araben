'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import type { GrammarPart } from '@/lib/grammar/types';

const CATEGORY: Record<string, 'accent' | 'accent-2'> = {
  orientation: 'accent',
  foundation: 'accent',
  'sentence-types': 'accent',
  phrases: 'accent',
  pronouns: 'accent-2',
  verbs: 'accent-2',
  'negation-questions': 'accent-2',
  'kana-inna': 'accent-2',
  conjunctions: 'accent-2',
  'worked-examples': 'accent',
  mistakes: 'accent-2',
  'learning-sequence': 'accent',
  'quick-reference': 'accent',
};

export function GrammarHubClient({ parts }: { parts: GrammarPart[] }) {
  const t = useT();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'grammar', label: 'Grammar' },
        ]}
        eyebrow={dict.grammar.subtitle}
        titleKey={dict.grammar.title}
        leadKey={dict.grammar.lead}
      />

      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {parts.map((p) => {
          const colour = CATEGORY[p.slug] ?? 'accent';
          return (
            <li key={p.slug}>
              <Link
                href={`/grammar/${p.slug}/`}
                className="card card-hover p-6 no-underline text-fg flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-semibold text-sm"
                    style={{
                      background:
                        colour === 'accent' ? 'var(--gradient-accent)' : 'var(--gradient-accent-2)',
                      color: 'var(--accent-fg)',
                    }}
                    aria-hidden
                  >
                    {String(p.order).padStart(2, '0')}
                  </span>
                  <div className="text-[10px] uppercase tracking-wider text-muted" lang="en">
                    {p.eyebrow.en}
                  </div>
                </div>
                <h3 className="display text-xl mb-2">
                  <span lang="bn" className="bn">
                    {p.title.bn}
                  </span>
                </h3>
                <p className="text-sm text-fg-2 leading-relaxed mb-4">
                  <span lang="bn" className="bn">
                    {p.lead.bn}
                  </span>
                </p>
                <div className="mt-auto text-xs text-muted flex flex-wrap gap-1.5">
                  {p.sections.map((s) => (
                    <span key={s.id} className="chip" lang="en">
                      {s.heading.en}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="mt-16 card p-6 md:p-8">
        <div className="chip chip-warm mb-3" lang="en">
          ◆ {t(dict.grammar.pathHead)}
        </div>
        <h2 className="display text-2xl mb-3">
          <span lang="bn" className="bn">
            {t(dict.grammar.pathTitle)}
          </span>
        </h2>
        <p className="read-body">
          <span lang="bn" className="bn">
            {t(dict.grammar.pathBody)}
          </span>
        </p>
      </section>
    </div>
  );
}
