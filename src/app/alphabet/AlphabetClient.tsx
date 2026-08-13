'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ArabicText } from '@/components/ArabicText';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import {
  LETTERS,
  BASIC_HARAKAT,
  OTHER_MARKS,
  LONG_VOWELS,
} from '@/lib/alphabet';

export function AlphabetClient() {
  const t = useT();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'alphabet', label: 'Alphabet' },
        ]}
        eyebrow={t(dict.alphabet.subtitle)}
        titleKey={dict.alphabet.title}
        leadKey={dict.alphabet.lead}
      />

      {/* Harakāt explainer */}
      <section aria-labelledby="harakat" className="mb-16">
        <h2 id="harakat" className="display text-2xl mb-2">
          {t(dict.alphabet.harakatHead)}
        </h2>
        <p className="text-fg-2 read-body mb-6">{t(dict.alphabet.harakatBody)}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {BASIC_HARAKAT.map((h) => (
            <div key={h.id} className="card p-6 text-center flex flex-col items-center gap-2">
              <ArabicText size="lg" className="!text-5xl">
                {h.example}
              </ArabicText>
              <div className="translit text-lg" lang="en">
                {h.example} → "{h.sound}"
              </div>
              <div className="text-sm font-medium mt-2" lang="en">
                {h.name}
              </div>
              <div className="bn text-sm text-muted" lang="bn">
                {h.banglaName} — {h.bangla}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 28 letters grid */}
      <section aria-labelledby="letters" className="mb-16">
        <h2 id="letters" className="display text-2xl mb-6">
          {t(dict.alphabet.lettersHead)}
        </h2>
        <div
          dir="rtl"
          className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {LETTERS.map((l) => (
            <Link
              key={l.slug}
              href={`/alphabet/${l.slug}/`}
              dir="ltr"
              className="card card-hover p-5 no-underline text-fg flex flex-col items-center text-center gap-1.5"
            >
              <div className="chip !text-[10px] !py-0 mb-1" lang="en">
                {String(l.order).padStart(2, '0')}
              </div>
              <ArabicText size="lg" className="!text-5xl">
                {l.arabic}
              </ArabicText>
              <div className="translit text-sm mt-1" lang="en">
                {l.name}
              </div>
              <div className="text-xs text-fg-2" lang="en">
                {l.englishSound}
              </div>
              <div className="bn text-xs text-muted" lang="bn">
                {l.banglaSound}
              </div>
              {l.category === 'heavy' && (
                <span className="chip chip-warm !text-[10px] mt-1" lang="en">
                  {t(dict.alphabet.heavy)}
                </span>
              )}
              {l.category === 'guttural' && (
                <span className="chip chip-accent !text-[10px] mt-1" lang="en">
                  {t(dict.alphabet.guttural)}
                </span>
              )}
              {l.category === 'vowel' && (
                <span className="chip !text-[10px] mt-1" lang="en">
                  {t(dict.alphabet.vowel)}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Other marks */}
      <section aria-labelledby="marks" className="mb-16">
        <h2 id="marks" className="display text-2xl mb-2">
          {t(dict.alphabet.otherMarksHead)}
        </h2>
        <p className="text-fg-2 read-body mb-6">{t(dict.alphabet.otherMarksBody)}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {OTHER_MARKS.map((m) => (
            <div key={m.id} className="card p-5 flex flex-col items-center text-center gap-1">
              <ArabicText size="lg" className="!text-4xl">
                {m.arabic}
              </ArabicText>
              <div className="text-sm font-medium mt-1" lang="en">
                {m.name}
              </div>
              <div className="bn text-xs text-muted" lang="bn">
                {m.banglaName}
              </div>
              <div className="text-xs text-fg-2 mt-1" lang="en">
                {m.english}
              </div>
              <div className="bn text-xs text-muted" lang="bn">
                {m.bangla}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Long vowels */}
      <section aria-labelledby="madd" className="mb-16">
        <h2 id="madd" className="display text-2xl mb-2">
          {t(dict.alphabet.longVowelsHead)}
        </h2>
        <p className="text-fg-2 read-body mb-6">{t(dict.alphabet.longVowelsBody)}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {LONG_VOWELS.map((v, i) => (
            <div key={i} className="card p-6 text-center flex flex-col items-center gap-1.5">
              <ArabicText size="lg" className="!text-5xl">
                {v.arabic}
              </ArabicText>
              <div className="translit text-sm mt-1" lang="en">
                {v.english}
              </div>
              <div className="bn text-sm text-muted" lang="bn">
                {v.bangla}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice */}
      <section aria-labelledby="practice">
        <div className="card p-6">
          <div className="chip chip-warm mb-3" lang="en">
            ◆ {t(dict.alphabet.practiceHead)}
          </div>
          <h2 id="practice" className="display text-xl mb-2">
            {t(dict.alphabet.practiceHead)}
          </h2>
          <p className="text-fg-2 read-body">{t(dict.alphabet.practiceBody)}</p>
        </div>
      </section>
    </div>
  );
}
