'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { BlockView } from '@/components/grammar/BlockRenderer';
import { ChapterSidebar } from '@/components/grammar/ChapterSidebar';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import type { GrammarPart } from '@/lib/grammar/types';

interface Props {
  parts: GrammarPart[];
  part: GrammarPart;
  prev: GrammarPart | null;
  next: GrammarPart | null;
}

export function PartClient({ parts, part, prev, next }: Props) {
  const t = useT();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <ChapterSidebar
          parts={parts}
          currentSlug={part.slug}
          sections={part.sections}
        />

        <div className="min-w-0 max-w-3xl">
          <PageIntro
            crumbs={[
              { href: '/', labelKey: 'home', label: 'Home' },
              { href: '/grammar/', labelKey: 'grammar', label: 'Grammar' },
              { label: t(part.title) },
            ]}
            eyebrow={t(part.eyebrow)}
            titleKey={part.title}
            leadKey={part.lead}
          />

          {/* Mobile section jump nav — the desktop nav is in the sidebar */}
          {part.sections.length > 1 && (
            <nav
              className="mb-10 card p-4 lg:hidden"
              aria-label={t({ bn: 'এই পাতায়', en: 'On this page' })}
            >
              <div
                className="text-[10px] uppercase tracking-wider text-muted mb-2"
                lang="en"
              >
                {t({ bn: 'এই পাতায়', en: 'On this page' })}
              </div>
              <ol className="flex flex-wrap gap-1.5">
                {part.sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="chip hover:text-accent hover:border-accent transition-colors no-underline"
                    >
                      <span className="text-muted mr-1.5" lang="en">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span lang="bn" className="bn">
                        {s.heading.bn}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="space-y-16">
            {part.sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-h`}
                className="scroll-mt-24"
              >
                <h2 id={`${s.id}-h`} className="display text-2xl md:text-3xl mb-1">
                  <span lang="bn" className="bn">
                    {s.heading.bn}
                  </span>
                </h2>
                <p className="text-sm text-muted mb-6" lang="en">
                  {s.heading.en}
                </p>
                {s.blocks.map((b, i) => (
                  <BlockView key={i} block={b} />
                ))}
              </section>
            ))}
          </div>

          <nav
            className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-3"
            aria-label="Part navigation"
          >
            {prev ? (
              <Link
                href={`/grammar/${prev.slug}/`}
                className="btn btn-ghost text-sm flex-1 md:flex-initial"
              >
                <span aria-hidden>←</span>
                <span className="flex flex-col items-start leading-tight text-left">
                  <span
                    className="text-[10px] text-muted uppercase tracking-wider"
                    lang="en"
                  >
                    Prev · আগে
                  </span>
                  <span lang="bn" className="bn">
                    {prev.title.bn}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/grammar/${next.slug}/`}
                className="btn btn-ghost text-sm flex-1 md:flex-initial"
              >
                <span className="flex flex-col items-end leading-tight text-right">
                  <span
                    className="text-[10px] text-muted uppercase tracking-wider"
                    lang="en"
                  >
                    Next · পরে
                  </span>
                  <span lang="bn" className="bn">
                    {next.title.bn}
                  </span>
                </span>
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
