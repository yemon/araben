'use client';

import { useState } from 'react';
import { ArabicText } from '@/components/ArabicText';
import { useT } from '@/lib/i18n/t';

const CASES = [
  {
    id: 'nom',
    arabic: 'الْوَلَدُ',
    ending: '-u',
    label: { bn: 'কর্তৃবাচক (Nominative)', en: 'Nominative' },
    sentence: {
      arabic: 'ذَهَبَ الْوَلَدُ',
      translit: 'dhahaba l-waladu',
      english: 'The boy went.',
      bangla: 'ছেলেটি গেল।',
    },
    explanation: {
      bn: 'শব্দ কর্তা—কর্মটা কে করছে সেটা এই ending বোঝায়।',
      en: 'The word is the doer. This ending marks the subject / doer of the action.',
    },
  },
  {
    id: 'acc',
    arabic: 'الْوَلَدَ',
    ending: '-a',
    label: { bn: 'কর্মবাচক (Accusative)', en: 'Accusative' },
    sentence: {
      arabic: 'رَأَيْتُ الْوَلَدَ',
      translit: 'raʾaytu l-walada',
      english: 'I saw the boy.',
      bangla: 'আমি ছেলেটিকে দেখেছি।',
    },
    explanation: {
      bn: 'শব্দ কর্ম—ক্রিয়া তার উপর ঘটছে।',
      en: 'The word is the direct object — the action lands on it.',
    },
  },
  {
    id: 'gen',
    arabic: 'الْوَلَدِ',
    ending: '-i',
    label: { bn: 'সম্বন্ধপদ (Genitive)', en: 'Genitive' },
    sentence: {
      arabic: 'مَعَ الْوَلَدِ',
      translit: 'maʿa l-waladi',
      english: 'with the boy',
      bangla: 'ছেলেটির সাথে',
    },
    explanation: {
      bn: 'শব্দ অব্যয়ের পরে অথবা ইদাফার দ্বিতীয় অংশ।',
      en: 'The word follows a preposition, or is the second term of an iḍāfa.',
    },
  },
] as const;

export function CaseFlipper() {
  const [i, setI] = useState(0);
  const active = CASES[i];
  const t = useT();

  return (
    <div className="card p-5 md:p-7 my-6">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-3" lang="en">
        {t({ bn: 'একই শব্দ, তিন কেস', en: 'Same word, three cases' })}
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {CASES.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setI(idx)}
            className={
              'px-3 py-1.5 rounded-full text-sm transition-colors border ' +
              (i === idx
                ? 'bg-fg text-bg border-transparent'
                : 'border-border hover:border-accent')
            }
            aria-pressed={i === idx}
          >
            <span lang="bn" className="bn">{t(c.label as any)}</span>
            <span className="ml-1.5 translit text-xs opacity-70" lang="en">
              {c.ending}
            </span>
          </button>
        ))}
      </div>

      <div className="text-center py-4">
        <ArabicText className="!text-6xl !leading-none">{active.arabic}</ArabicText>
      </div>

      <div className="mt-4 rounded-2xl bg-surface-2 border border-border-2 p-4 flex flex-col gap-2">
        <ArabicText className="!text-2xl text-center">{active.sentence.arabic}</ArabicText>
        <div className="text-center translit text-sm" lang="en">{active.sentence.translit}</div>
        <div className="grid md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-border-2">
          <div className="text-sm text-fg-2" lang="en">{active.sentence.english}</div>
          <div className="text-sm text-muted bn md:text-right" lang="bn">
            {active.sentence.bangla}
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm">
        <span lang="bn" className="bn block">{active.explanation.bn}</span>
        <span lang="en" className="text-muted text-xs mt-0.5 block">
          {active.explanation.en}
        </span>
      </div>
    </div>
  );
}
