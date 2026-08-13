'use client';

import { useState } from 'react';
import { ArabicText } from '@/components/ArabicText';

const ROOT_FAMILY: Record<string, { arabic: string; latin: string; forms: { ar: string; latin: string; pattern: string; bn: string; en: string }[] }> = {
  'k-t-b': {
    arabic: 'ك-ت-ب',
    latin: 'k-t-b',
    forms: [
      { ar: 'كَتَبَ', latin: 'kataba', pattern: 'faʿala', bn: 'সে লিখল', en: 'he wrote' },
      { ar: 'كِتَاب', latin: 'kitāb', pattern: 'fiʿāl', bn: 'বই', en: 'book' },
      { ar: 'كَاتِب', latin: 'kātib', pattern: 'fāʿil', bn: 'লেখক', en: 'writer' },
      { ar: 'مَكْتُوب', latin: 'maktūb', pattern: 'mafʿūl', bn: 'লিখিত / চিঠি', en: 'written / letter' },
      { ar: 'مَكْتَب', latin: 'maktab', pattern: 'mafʿal', bn: 'অফিস, মক্তব', en: 'desk, office' },
      { ar: 'مَكْتَبَة', latin: 'maktaba', pattern: 'mafʿala', bn: 'লাইব্রেরি', en: 'library, bookshop' },
      { ar: 'كِتَابَة', latin: 'kitāba', pattern: 'fiʿāla', bn: 'লেখা (কাজ)', en: 'the act of writing' },
    ],
  },
};

export function RootExplorer({ root = 'k-t-b' }: { root?: string }) {
  const data = ROOT_FAMILY[root];
  const [active, setActive] = useState(0);
  if (!data) return null;
  const f = data.forms[active];

  return (
    <div className="card p-5 md:p-7 my-6">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-3" lang="en">
        Root explorer · একটা মূল, সাত রূপ
      </div>

      <div className="text-center py-2 mb-3">
        <ArabicText className="!text-5xl">{data.arabic}</ArabicText>
        <div className="translit text-sm mt-1" lang="en">{data.latin}</div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-5" dir="rtl">
        {data.forms.map((form, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            dir="ltr"
            className={
              'rounded-2xl px-3 py-2 border transition-colors flex flex-col items-center cursor-pointer ' +
              (active === i
                ? 'text-[color:var(--accent-fg)] border-transparent'
                : 'bg-surface border-border hover:border-accent')
            }
            style={active === i ? { background: 'var(--gradient-accent)' } : undefined}
            aria-pressed={active === i}
          >
            <ArabicText className={active === i ? '!text-[color:var(--accent-fg)] !text-2xl' : '!text-2xl'}>
              {form.ar}
            </ArabicText>
            <span
              className={'text-[10px] mt-0.5 ' + (active === i ? 'opacity-90' : 'text-muted italic')}
              lang="en"
            >
              {form.pattern}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-surface-2 border border-border-2 p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <ArabicText className="!text-3xl">{f.ar}</ArabicText>
          <span className="chip chip-accent" lang="en">{f.pattern}</span>
        </div>
        <div className="translit text-sm mt-2" lang="en">{f.latin}</div>
        <div className="grid md:grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-2 text-sm">
          <div lang="en">{f.en}</div>
          <div lang="bn" className="bn md:text-right">{f.bn}</div>
        </div>
      </div>
    </div>
  );
}
