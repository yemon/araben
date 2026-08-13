'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import { AudioButton } from '@/components/AudioButton';
import { WordCard } from '@/components/WordCard';
import type { Word } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

interface AppearanceLink {
  label: string;
  href: string;
}

interface Props {
  word: Word;
  audioSrc: string | null;
  appearances: AppearanceLink[];
  related: Word[];
}

export function WordClient({ word, audioSrc, appearances, related }: Props) {
  const t = useT();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { href: '/search/', labelKey: 'words', label: 'Words' },
          { label: word.transliteration },
        ]}
      />

      <div className="card p-8 md:p-12 flex flex-col items-center text-center gap-4 hero-ornament">
        <ArabicText size="lg" className="text-fg">
          {word.arabic}
        </ArabicText>
        <div className="translit text-2xl">{word.transliteration}</div>
        <div className="mt-2">
          <AudioButton src={audioSrc} label={word.transliteration} />
        </div>
      </div>

      <section className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card p-6">
          <div className="chip chip-accent mb-3">
            {t(dict.word.englishHeading)}
          </div>
          <p className="text-lg font-serif" lang="en">
            {word.english}
          </p>
        </div>
        {word.bangla && (
          <div className="card p-6">
            <div className="chip chip-warm mb-3">
              {t(dict.word.banglaHeading)}
            </div>
            <p className="text-lg bn font-medium" lang="bn">
              {word.bangla}
            </p>
          </div>
        )}
      </section>

      {appearances.length > 0 && (
        <section className="mt-10">
          <h2 className="display text-xl mb-4">{t(dict.section.whereAppears)}</h2>
          <ul className="flex flex-wrap gap-2">
            {appearances.map((a, i) => (
              <li key={i}>
                <Link
                  href={a.href}
                  className="chip hover:text-fg hover:border-accent transition-colors no-underline"
                  lang="en"
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {word.root && (
        <section className="mt-10">
          <h2 className="display text-xl mb-4">{t(dict.section.rootLabel)}</h2>
          <Link
            href={`/roots/${word.root}/`}
            className="card card-hover p-4 no-underline text-fg inline-flex items-center gap-3"
          >
            <span className="chip chip-accent">{t(dict.section.rootLabel)}</span>
            <span className="translit">{word.root}</span>
            <span aria-hidden>→</span>
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="display text-xl mb-4">{t(dict.section.relatedWords)}</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {related.map((r) => (
              <WordCard key={r.slug} word={r} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
