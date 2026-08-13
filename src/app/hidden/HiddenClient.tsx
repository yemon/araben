'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import type { HiddenData } from '@/types/content';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

const CAT_LABELS: Record<string, { bn: string; en: string }> = {
  'law-and-administration': { bn: 'আইন-আদালত ও প্রশাসন', en: 'Law & administration' },
  'money-and-business': { bn: 'টাকা-পয়সা ও ব্যবসা', en: 'Money & business' },
  'places-and-conflict': { bn: 'জায়গা ও সংঘাত', en: 'Places & conflict' },
  'everyday-things': { bn: 'রোজকার জিনিস ও মানুষ', en: 'Everyday things' },
  'feelings-and-qualities': { bn: 'ভাব, অনুভূতি ও গুণ', en: 'Feelings & qualities' },
  'speech-and-work': { bn: 'কথাবার্তা ও কাজ', en: 'Speech & work' },
  time: { bn: 'সময়', en: 'Time' },
};

const CARD_HEADS = {
  persian: { bn: 'ফারসি, আরবি নয়', en: 'Persian, not Arabic' },
  persianBody: {
    bn: 'অনেকে আরবি ভাবে, আসলে ফারসি।',
    en: 'Common Bangla words most people think are Arabic, but are actually Persian.',
  },
  mixed: { bn: 'মিশ্র শব্দ', en: 'Mixed words' },
  mixedBody: { bn: 'ফারসি + আরবি জোড়া।', en: 'Persian + Arabic hybrids.' },
  english: { bn: 'ইংরেজিও বাদ যায়নি', en: 'English words from Arabic' },
  englishBody: { bn: 'coffee, sugar, algebra…', en: 'Coffee, sugar, algebra…' },
  more: { bn: '…আরো আছে', en: '…and more' },
};

export function HiddenClient({ hidden }: { hidden: HiddenData }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'hidden', label: 'Hidden in Bangla' },
        ]}
        titleKey={dict.path.hiddenTitle}
        leadKey={dict.path.hiddenDesc}
      />

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mb-14">
        {hidden.categories.map((c) => {
          const l = CAT_LABELS[c.slug];
          return (
            <Link
              key={c.slug}
              href={`/hidden/${c.slug}/`}
              className="card card-hover p-5 no-underline text-fg flex flex-col"
            >
              <span className="display text-lg">
                {l ? t(l) : c.title}
              </span>
              <span className="text-xs text-muted mt-2">
                {t(dict.section.wordsCount)(c.entries.length)}
              </span>
            </Link>
          );
        })}
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="chip chip-accent mb-3">{t(CARD_HEADS.persian)}</div>
          <p className="text-sm text-fg-2 mb-4">{t(CARD_HEADS.persianBody)}</p>
          <ul className="text-sm space-y-1 bn" lang="bn">
            {hidden.persianNotArabic.slice(0, 6).map((p) => (
              <li key={p.bangla}>{p.bangla}</li>
            ))}
            <li className="text-muted">{t(CARD_HEADS.more)}</li>
          </ul>
        </div>
        <div className="card p-6">
          <div className="chip chip-warm mb-3">{t(CARD_HEADS.mixed)}</div>
          <p className="text-sm text-fg-2 mb-4">{t(CARD_HEADS.mixedBody)}</p>
          <ul className="text-sm space-y-1 bn" lang="bn">
            {hidden.mixed.slice(0, 6).map((p) => (
              <li key={p.bangla}>{p.bangla}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <div className="chip chip-accent mb-3">{t(CARD_HEADS.english)}</div>
          <p className="text-sm text-fg-2 mb-4">{t(CARD_HEADS.englishBody)}</p>
          <ul className="text-sm space-y-1.5">
            {hidden.english.slice(0, 6).map((p) => (
              <li key={p.english}>
                <strong className="text-fg" lang="en">
                  {p.english}
                </strong>{' '}
                <span className="text-muted bn" lang="bn">
                  ← {p.meaning}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export { CAT_LABELS };
