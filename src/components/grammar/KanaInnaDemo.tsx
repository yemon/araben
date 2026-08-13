'use client';

import { useState } from 'react';
import { ArabicText } from '@/components/ArabicText';

type Mode = 'base' | 'kana' | 'inna';

const STATE: Record<Mode, {
  label: { bn: string; en: string };
  sentence: { subject: string; predicate: string; prefix?: string };
  subjectHighlight: 'nom' | 'acc';
  predicateHighlight: 'nom' | 'acc';
  english: string;
  bangla: string;
  explain: { bn: string; en: string };
}> = {
  base: {
    label: { bn: 'ভিত্তি', en: 'Base' },
    sentence: { subject: 'الْبَيْتُ', predicate: 'كَبِيرٌ' },
    subjectHighlight: 'nom',
    predicateHighlight: 'nom',
    english: 'The house is big.',
    bangla: 'বাড়িটা বড়।',
    explain: {
      bn: 'সাধারণ নামবাচক বাক্য—কর্তা ও বিধেয় দুটোই কর্তৃবাচকে (-u)।',
      en: 'Plain nominal sentence — subject and predicate both nominative (-u).',
    },
  },
  kana: {
    label: { bn: '+ كَانَ', en: '+ كَانَ' },
    sentence: { prefix: 'كَانَ', subject: 'الْبَيْتُ', predicate: 'كَبِيرًا' },
    subjectHighlight: 'nom',
    predicateHighlight: 'acc',
    english: 'The house was big.',
    bangla: 'বাড়িটা বড় ছিল।',
    explain: {
      bn: 'কানা কর্তাকে কর্তৃবাচকেই রাখে (-u), কিন্তু বিধেয়কে কর্মবাচকে (-an) ঠেলে দেয়।',
      en: 'Kāna keeps the subject nominative (-u) but flips the predicate to accusative (-an).',
    },
  },
  inna: {
    label: { bn: '+ إِنَّ', en: '+ إِنَّ' },
    sentence: { prefix: 'إِنَّ', subject: 'الْبَيْتَ', predicate: 'كَبِيرٌ' },
    subjectHighlight: 'acc',
    predicateHighlight: 'nom',
    english: 'Indeed, the house is big.',
    bangla: 'নিশ্চয়ই বাড়িটা বড়।',
    explain: {
      bn: 'ইন্না উল্টো কাজ করে—কর্তাকে কর্মবাচকে (-a) ঠেলে দেয়, বিধেয় থাকে কর্তৃবাচকেই।',
      en: 'Inna does the opposite — it flips the subject to accusative (-a) while the predicate stays nominative.',
    },
  },
};

export function KanaInnaDemo() {
  const [mode, setMode] = useState<Mode>('base');
  const s = STATE[mode];

  return (
    <div className="card p-5 md:p-7 my-6">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-3" lang="en">
        Case-flipper · কেস কেমনে ঘুরে যায়
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['base', 'kana', 'inna'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              'px-3 py-1.5 rounded-full text-sm transition-colors border ' +
              (mode === m
                ? 'bg-fg text-bg border-transparent'
                : 'border-border hover:border-accent')
            }
            aria-pressed={mode === m}
          >
            <span lang="bn" className="bn">{STATE[m].label.bn}</span>
          </button>
        ))}
      </div>

      <div className="text-center py-4">
        <div
          dir="rtl"
          className="inline-flex items-baseline gap-2 flex-wrap justify-center"
        >
          {s.sentence.prefix && (
            <ArabicText className="!text-4xl chip chip-warm !py-2 !px-4 !text-3xl">
              {s.sentence.prefix}
            </ArabicText>
          )}
          <ArabicText
            className={
              '!text-4xl px-3 py-2 rounded-xl transition-colors ' +
              (s.subjectHighlight === 'acc'
                ? 'bg-accent-2-soft text-accent-2'
                : 'bg-accent-soft text-accent')
            }
          >
            {s.sentence.subject}
          </ArabicText>
          <ArabicText
            className={
              '!text-4xl px-3 py-2 rounded-xl transition-colors ' +
              (s.predicateHighlight === 'acc'
                ? 'bg-accent-2-soft text-accent-2'
                : 'bg-accent-soft text-accent')
            }
          >
            {s.sentence.predicate}
          </ArabicText>
        </div>
      </div>

      <div className="flex justify-center gap-4 text-[11px] uppercase tracking-wider text-muted mt-1">
        <span>
          <span
            className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle"
            style={{ background: 'var(--accent)' }}
          />
          Nominative -u
        </span>
        <span>
          <span
            className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle"
            style={{ background: 'var(--accent-2)' }}
          />
          Accusative -a
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-2 mt-5 pt-4 border-t border-border">
        <div className="text-sm" lang="en">{s.english}</div>
        <div className="text-sm bn md:text-right" lang="bn">{s.bangla}</div>
      </div>

      <div className="mt-3 text-sm">
        <span lang="bn" className="bn block">{s.explain.bn}</span>
        <span lang="en" className="text-muted text-xs mt-0.5 block">
          {s.explain.en}
        </span>
      </div>
    </div>
  );
}
