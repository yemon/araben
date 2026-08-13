'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import type { Scenario } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function ScenariosClient({ scenarios }: { scenarios: Scenario[] }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'scenarios', label: 'Scenarios' },
        ]}
        titleKey={dict.path.scenariosTitle}
        leadKey={dict.path.scenariosDesc}
      />

      <ol className="grid gap-4 sm:grid-cols-2">
        {scenarios.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/scenarios/${s.slug}/`}
              className="card card-hover p-6 no-underline text-fg flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-semibold text-sm"
                  style={{
                    background: 'var(--gradient-accent)',
                    color: 'var(--accent-fg)',
                  }}
                  aria-hidden
                >
                  {s.number}
                </span>
                <h2 className="display text-xl" lang="en">
                  {s.englishTitle}
                </h2>
              </div>
              <p className="bn text-sm text-muted" lang="bn">
                {s.banglaTitle}
              </p>
              <p className="text-xs text-muted mt-4">
                {t(dict.section.turnsCount)(s.turns.length)}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
