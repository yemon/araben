'use client';

import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { ChatDialogue } from '@/components/ChatDialogue';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import type { Basics } from '@/types/content';

const CATEGORY_LABELS: Record<string, { bn: string; en: string }> = {
  pronouns: { bn: 'সর্বনাম', en: 'Pronouns' },
  'question-words': { bn: 'প্রশ্নবোধক শব্দ', en: 'Question words' },
  greetings: { bn: 'সালাম ও ভদ্রতা', en: 'Greetings & politeness' },
  verbs: { bn: 'জরুরি ক্রিয়া', en: 'Essential verbs' },
  nouns: { bn: 'দরকারি বিশেষ্য', en: 'Common nouns' },
  adjectives: { bn: 'বিশেষণ', en: 'Adjectives' },
  particles: { bn: 'অব্যয় ও সময়', en: 'Particles & time' },
  numbers: { bn: 'সংখ্যা', en: 'Numbers' },
  possessives: { bn: 'মালিকানা প্রত্যয়', en: 'Possessive suffixes' },
  patterns: { bn: 'বাক্য প্যাটার্ন', en: 'Sentence patterns' },
  survival: { bn: 'বিপদে কাজে লাগবে', en: 'Survival phrases' },
};

export function BasicsClient({ basics }: { basics: Basics }) {
  const t = useT();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageIntro
        crumbs={[
          { href: '/', labelKey: 'home', label: 'Home' },
          { labelKey: 'basics', label: 'Basics' },
        ]}
        titleKey={dict.path.basicsTitle}
        leadKey={dict.path.basicsDesc}
      />

      <section aria-labelledby="cats" className="mb-14">
        <h2 id="cats" className="display text-2xl mb-5">
          {t(dict.section.categoriesHeading)}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {basics.categories.map((c) => {
            const label = CATEGORY_LABELS[c.slug];
            return (
              <Link
                key={c.slug}
                href={`/basics/${c.slug}/`}
                className="card card-hover p-5 no-underline text-fg flex flex-col"
              >
                <span className="display text-lg">
                  {label ? t(label) : c.title}
                </span>
                <span className="text-xs text-muted mt-2">
                  {t(dict.section.wordsCount)(c.wordSlugs.length)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="dialogues">
        <h2 id="dialogues" className="display text-2xl mb-5">
          {t(dict.section.dialoguesHeading)}
        </h2>
        <div className="space-y-8">
          {basics.dialogues.map((d) => (
            <div key={d.slug}>
              <h3 className="display text-lg mb-3" lang="en">
                {d.title}
              </h3>
              <ChatDialogue turns={d.turns} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export { CATEGORY_LABELS };
