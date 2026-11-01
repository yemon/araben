'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ChatDialogue } from '@/components/ChatDialogue';
import { ScenarioVideos } from '@/components/ScenarioVideos';
import type { Scenario } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function ScenarioClient({
  scenario,
  prev,
  next,
}: {
  scenario: Scenario;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  const t = useT();

  // Every scenario page is this one component; what it shows follows from
  // the scenario's data. With a video, the dialogue sits in the panel beside
  // it (ScenarioVideos), timed or not; without one, it is shown as a chat.
  return (
    // As wide as the site nav (max-w-6xl), so the video and its panel get
    // room; a tight heading, so they start high on the screen.
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-5">
      <PageIntro
        compact
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { href: '/scenarios/', labelKey: 'scenarios', label: 'Scenarios' },
          { label: scenario.englishTitle },
        ]}
        title={scenario.englishTitle}
        banglaSubtitle={scenario.banglaTitle}
      />

      {scenario.videos?.length ? (
        <ScenarioVideos videos={scenario.videos} turns={scenario.turns} />
      ) : (
        <ChatDialogue turns={scenario.turns} />
      )}

      {scenario.newWordsNote && (
        <section className="mt-8 card p-6">
          <div className="chip chip-warm mb-3">◆ {t(dict.section.newWords)}</div>
          <p className="bn read-body mt-1" lang="bn">
            {scenario.newWordsNote}
          </p>
        </section>
      )}

      <nav
        className="mt-12 flex items-center justify-between text-sm gap-3"
        aria-label="Scenario"
      >
        {prev ? (
          <Link
            href={`/scenarios/${prev.slug}/`}
            className="btn btn-ghost text-sm"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/scenarios/${next.slug}/`}
            className="btn btn-ghost text-sm"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
