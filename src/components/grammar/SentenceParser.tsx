'use client';

import { useState } from 'react';
import { ArabicText } from '@/components/ArabicText';
import { useT } from '@/lib/i18n/t';
import type { BiText } from '@/lib/grammar/types';

export interface ParsedWord {
  arabic: string;
  translit: string;
  english: string;
  bangla: string;
  role: BiText;
  caseNote: BiText;
}

export interface SentenceParserProps {
  sentence: string;
  translit: string;
  english: string;
  bangla: string;
  words: ParsedWord[];
}

export function SentenceParser(props: SentenceParserProps) {
  const t = useT();
  const [active, setActive] = useState<number | null>(0);
  const word = active !== null ? props.words[active] : null;

  return (
    <div
      className="rounded-3xl border border-border p-5 md:p-7 my-6"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in oklab, var(--accent-soft) 55%, var(--surface)) 0%, var(--surface) 60%, color-mix(in oklab, var(--accent-2-soft) 40%, var(--surface)) 100%)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="text-[10px] uppercase tracking-wider text-muted mb-3" lang="en">
        Tap a word · কোনো শব্দে ক্লিক করো
      </div>

      {/* The sentence — reversed for RTL browsing feel with word chips */}
      <div
        dir="rtl"
        className="flex flex-wrap gap-2 justify-start mb-4"
      >
        {props.words.map((w, i) => {
          const isActive = active === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(isActive ? null : i)}
              className={
                'rounded-2xl px-3 py-2.5 flex flex-col items-center text-center transition-all border cursor-pointer ' +
                (isActive
                  ? 'text-[color:var(--accent-fg)] border-transparent shadow-sm'
                  : 'bg-surface hover:border-accent border-border')
              }
              style={
                isActive
                  ? { background: 'var(--gradient-accent)' }
                  : undefined
              }
              aria-pressed={isActive}
              dir="ltr"
            >
              <ArabicText className={isActive ? '!text-[color:var(--accent-fg)] !text-2xl' : '!text-2xl'}>
                {w.arabic}
              </ArabicText>
              <span
                className={
                  'text-[10px] mt-0.5 ' +
                  (isActive ? 'opacity-90' : 'text-muted italic')
                }
                lang="en"
              >
                {w.translit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Translation lines */}
      <div className="text-xs text-muted mb-4 space-y-0.5" dir="ltr">
        <div lang="en">
          <span className="opacity-70">EN — </span>
          <em>{props.english}</em>
        </div>
        <div lang="bn" className="bn">
          <span className="opacity-70">BN — </span>
          {props.bangla}
        </div>
      </div>

      {/* Analysis panel */}
      {word && (
        <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 mt-2 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <ArabicText className="!text-3xl">{word.arabic}</ArabicText>
            <span className="italic text-muted text-sm" lang="en">
              {word.translit}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="chip chip-accent mb-1.5" lang="en">
                {t({ bn: 'ব্যাকরণিক ভূমিকা', en: 'Role' })}
              </div>
              <div className="text-sm" lang={word.role === word.role ? undefined : undefined}>
                <span lang="bn" className="bn block">{word.role.bn}</span>
                <span lang="en" className="text-muted text-xs mt-0.5 block">{word.role.en}</span>
              </div>
            </div>
            <div>
              <div className="chip chip-warm mb-1.5" lang="en">
                {t({ bn: 'কেস / কেন', en: 'Case / why' })}
              </div>
              <div className="text-sm">
                <span lang="bn" className="bn block">{word.caseNote.bn}</span>
                <span lang="en" className="text-muted text-xs mt-0.5 block">{word.caseNote.en}</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 mt-1 pt-3 border-t border-border-2">
            <div className="text-sm" lang="en">
              <span className="text-muted text-xs uppercase tracking-wider">EN</span>
              <div>{word.english}</div>
            </div>
            <div className="text-sm bn" lang="bn">
              <span className="text-muted text-xs uppercase tracking-wider">BN</span>
              <div>{word.bangla}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
