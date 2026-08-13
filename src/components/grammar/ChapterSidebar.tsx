'use client';

import Link from 'next/link';
import type { GrammarPart } from '@/lib/grammar/types';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

interface Props {
  parts: GrammarPart[];
  currentSlug: string;
  sections?: { id: string; heading: { bn: string; en: string } }[];
}

export function ChapterSidebar({ parts, currentSlug, sections }: Props) {
  const t = useT();
  return (
    <aside
      aria-label="Grammar chapters"
      className="hidden lg:block sticky top-24 self-start h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-minimal"
    >
      <div className="text-[10px] uppercase tracking-wider text-muted mb-2 px-3" lang="en">
        {t(dict.grammar.chapters)}
      </div>
      <ol className="flex flex-col gap-0.5">
        {parts.map((p) => {
          const active = p.slug === currentSlug;
          return (
            <li key={p.slug}>
              <Link
                href={`/grammar/${p.slug}/`}
                className={
                  'flex items-start gap-2.5 rounded-xl px-3 py-2 text-sm no-underline transition-colors ' +
                  (active
                    ? 'bg-accent-soft text-fg font-medium'
                    : 'text-fg-2 hover:bg-surface hover:text-fg')
                }
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={
                    'shrink-0 w-6 text-right tabular-nums text-xs pt-0.5 ' +
                    (active ? 'text-accent font-semibold' : 'text-muted')
                  }
                  lang="en"
                >
                  {String(p.order).padStart(2, '0')}
                </span>
                <span className="leading-snug">
                  <span lang="bn" className="bn block">
                    {p.title.bn}
                  </span>
                  <span
                    lang="en"
                    className={
                      'text-[11px] block mt-0.5 ' +
                      (active ? 'text-fg-2' : 'text-muted')
                    }
                  >
                    {p.title.en}
                  </span>
                </span>
              </Link>

              {active && sections && sections.length > 1 && (
                <ol className="ml-8 mt-1 mb-2 flex flex-col gap-0.5 border-l border-border pl-3">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block text-xs text-muted hover:text-accent no-underline py-1 transition-colors"
                      >
                        <span lang="bn" className="bn">
                          {s.heading.bn}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
