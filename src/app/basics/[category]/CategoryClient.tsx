'use client';

import { PageIntro } from '@/components/PageIntro';
import { WordCard } from '@/components/WordCard';
import type { Word } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import { CATEGORY_LABELS } from '../BasicsClient';

interface Props {
  categorySlug: string;
  categoryTitle: string;
  words: (Word & { audioSrc: string | null })[];
}

export function CategoryClient({ categorySlug, categoryTitle, words }: Props) {
  const t = useT();
  const label = CATEGORY_LABELS[categorySlug];
  const displayTitle = label ? t(label) : categoryTitle;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { href: '/basics/', labelKey: 'basics', label: 'Basics' },
          { label: displayTitle },
        ]}
        title={displayTitle}
        meta={t(dict.section.wordsCount)(words.length)}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {words.map((w) => (
          <WordCard key={w.slug} word={w} audioSrc={w.audioSrc} />
        ))}
      </div>
    </div>
  );
}
