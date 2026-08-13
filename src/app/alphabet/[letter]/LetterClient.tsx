'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import type { Letter } from '@/types/content';
import { LETTERS } from '@/lib/alphabet';

interface Props {
  letter: Letter;
  prev: Letter | null;
  next: Letter | null;
}

export function LetterClient({ letter, prev, next }: Props) {
  const t = useT();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { href: '/alphabet/', labelKey: 'alphabet', label: 'Alphabet' },
          { label: letter.name },
        ]}
        eyebrow={`${t(dict.alphabet.letterEyebrow)} · ${t(dict.alphabet.letterCount)(
          letter.order,
          LETTERS.length,
        )}`}
      />

      {/* Big letter card */}
      <div className="card p-8 md:p-12 hero-ornament flex flex-col items-center text-center gap-4 mb-10">
        <ArabicText className="!text-[9rem] !leading-none">{letter.arabic}</ArabicText>
        <div className="translit text-2xl mt-2" lang="en">
          {letter.name}
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {letter.category === 'heavy' && (
            <span className="chip chip-warm" lang="en">
              {t(dict.alphabet.heavy)}
            </span>
          )}
          {letter.category === 'guttural' && (
            <span className="chip chip-accent" lang="en">
              {t(dict.alphabet.guttural)}
            </span>
          )}
          {letter.category === 'vowel' && (
            <span className="chip" lang="en">
              {t(dict.alphabet.vowel)}
            </span>
          )}
        </div>
      </div>

      {/* English + Bangla pronunciation cards */}
      <section className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="card p-6">
          <div className="chip chip-accent mb-3" lang="en">
            {t(dict.alphabet.englishHead)}
          </div>
          <p className="text-lg font-serif" lang="en">
            {letter.englishSound}
          </p>
          {letter.englishNote && (
            <p className="text-sm text-fg-2 mt-3 leading-relaxed" lang="en">
              {letter.englishNote}
            </p>
          )}
        </div>
        <div className="card p-6">
          <div className="chip chip-warm mb-3" lang="en">
            {t(dict.alphabet.banglaHead)}
          </div>
          <p className="text-lg bn font-medium" lang="bn">
            {letter.banglaSound}
          </p>
          {letter.banglaNote && (
            <p className="text-sm text-muted mt-3 leading-relaxed bn" lang="bn">
              {letter.banglaNote}
            </p>
          )}
        </div>
      </section>

      {/* Harakāt forms */}
      <section aria-labelledby="harakat" className="mb-10">
        <h2 id="harakat" className="display text-2xl mb-5">
          {t(dict.alphabet.withHarakatHead)}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <HarakatCard
            colour="accent"
            label={t(dict.alphabet.fathaLabel)}
            symbol="ـَ"
            form={letter.fatha}
          />
          <HarakatCard
            colour="accent-2"
            label={t(dict.alphabet.kasraLabel)}
            symbol="ـِ"
            form={letter.kasra}
          />
          <HarakatCard
            colour="accent"
            label={t(dict.alphabet.dammaLabel)}
            symbol="ـُ"
            form={letter.damma}
          />
        </div>
      </section>

      {/* Long vowel (for ا / و / ي) */}
      {letter.longVowel && (
        <section aria-labelledby="madd" className="mb-10">
          <h2 id="madd" className="display text-2xl mb-5">
            {t(dict.alphabet.longVowelHead)}
          </h2>
          <div className="card p-6 flex flex-col items-center text-center gap-2 max-w-sm mx-auto">
            <ArabicText size="lg" className="!text-6xl">
              {letter.longVowel.arabic}
            </ArabicText>
            <div className="translit text-lg" lang="en">
              {letter.longVowel.english}
            </div>
            <div className="bn text-lg text-muted" lang="bn">
              {letter.longVowel.bangla}
            </div>
          </div>
        </section>
      )}

      {/* Prev/next navigation */}
      <nav
        className="mt-12 flex items-center justify-between gap-3"
        aria-label="Letter navigation"
      >
        {prev ? (
          <Link
            href={`/alphabet/${prev.slug}/`}
            className="btn btn-ghost text-sm flex-1 md:flex-initial"
          >
            <span aria-hidden>←</span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[10px] text-muted uppercase tracking-wider">
                {t(dict.alphabet.prev)}
              </span>
              <span>
                <span lang="ar" dir="rtl" className="ar font-normal !text-lg">
                  {prev.arabic}
                </span>{' '}
                <span lang="en">{prev.name}</span>
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/alphabet/${next.slug}/`}
            className="btn btn-ghost text-sm flex-1 md:flex-initial"
          >
            <span className="flex flex-col items-end leading-tight">
              <span className="text-[10px] text-muted uppercase tracking-wider">
                {t(dict.alphabet.next)}
              </span>
              <span>
                <span lang="en">{next.name}</span>{' '}
                <span lang="ar" dir="rtl" className="ar font-normal !text-lg">
                  {next.arabic}
                </span>
              </span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

function HarakatCard({
  colour,
  label,
  symbol,
  form,
}: {
  colour: 'accent' | 'accent-2';
  label: string;
  symbol: string;
  form: { arabic: string; english: string; bangla: string };
}) {
  return (
    <div className="card p-6 flex flex-col items-center text-center gap-2 relative overflow-hidden">
      <span
        className="absolute top-3 right-3 chip"
        style={{
          background:
            colour === 'accent' ? 'var(--accent-soft)' : 'var(--accent-2-soft)',
          color: colour === 'accent' ? 'var(--accent)' : 'var(--accent-2)',
          borderColor: 'transparent',
        }}
      >
        <ArabicText className="!text-base !leading-none">{symbol}</ArabicText>
        <span lang="en">{label}</span>
      </span>
      <ArabicText size="lg" className="!text-7xl mt-6">
        {form.arabic}
      </ArabicText>
      <div className="translit text-lg mt-2" lang="en">
        "{form.english}"
      </div>
      <div className="bn text-lg text-muted" lang="bn">
        {form.bangla}
      </div>
    </div>
  );
}
