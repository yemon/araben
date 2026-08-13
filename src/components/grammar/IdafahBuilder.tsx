'use client';

import { useMemo, useState } from 'react';
import { ArabicText } from '@/components/ArabicText';

interface Word {
  ar: string;
  arWithAl: string; // form with الـ, ends with -u nominative for standalone display
  arAsMudaf: string; // form without الـ, ends with -u nominative (first term of iḍāfa)
  arGenitive: string; // form with الـ, ends with -i genitive (second term)
  bn: string;
  en: string;
}

const FIRSTS: Word[] = [
  { ar: 'بَابٌ', arWithAl: 'الْبَابُ', arAsMudaf: 'بَابُ', arGenitive: 'الْبَابِ', bn: 'দরজা', en: 'door' },
  { ar: 'كِتَابٌ', arWithAl: 'الْكِتَابُ', arAsMudaf: 'كِتَابُ', arGenitive: 'الْكِتَابِ', bn: 'বই', en: 'book' },
  { ar: 'مُدِيرٌ', arWithAl: 'الْمُدِيرُ', arAsMudaf: 'مُدِيرُ', arGenitive: 'الْمُدِيرِ', bn: 'ম্যানেজার', en: 'manager' },
  { ar: 'غُرْفَةٌ', arWithAl: 'الْغُرْفَةُ', arAsMudaf: 'غُرْفَةُ', arGenitive: 'الْغُرْفَةِ', bn: 'ঘর', en: 'room' },
];

const SECONDS: Word[] = [
  { ar: 'بَيْتٌ', arWithAl: 'الْبَيْتُ', arAsMudaf: 'بَيْتُ', arGenitive: 'الْبَيْتِ', bn: 'বাড়ি', en: 'house' },
  { ar: 'طَالِبٌ', arWithAl: 'الطَّالِبُ', arAsMudaf: 'طَالِبُ', arGenitive: 'الطَّالِبِ', bn: 'ছাত্র', en: 'student' },
  { ar: 'شَرِكَةٌ', arWithAl: 'الشَّرِكَةُ', arAsMudaf: 'شَرِكَةُ', arGenitive: 'الشَّرِكَةِ', bn: 'কোম্পানি', en: 'company' },
  { ar: 'مُعَلِّمٌ', arWithAl: 'الْمُعَلِّمُ', arAsMudaf: 'مُعَلِّمُ', arGenitive: 'الْمُعَلِّمِ', bn: 'শিক্ষক', en: 'teacher' },
];

export function IdafahBuilder() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const first = FIRSTS[a];
  const second = SECONDS[b];

  const combined = useMemo(
    () => `${first.arAsMudaf} ${second.arGenitive}`,
    [first, second],
  );
  const en = useMemo(() => `the ${first.en} of the ${second.en}`, [first, second]);
  const bn = useMemo(() => `${second.bn}ের ${first.bn}`, [first, second]);

  return (
    <div className="card p-5 md:p-7 my-6">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-4" lang="en">
        Iḍāfa builder · ইদাফা বানাও
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Picker
          label={{ bn: 'প্রথম শব্দ', en: 'First noun' }}
          note={{
            bn: 'বসবে খালি (ال ও তানউইন ছাড়া)।',
            en: 'Bare — no الـ, no tanwīn.',
          }}
          words={FIRSTS}
          current={a}
          onPick={setA}
          preview={(w) => w.arAsMudaf}
        />
        <Picker
          label={{ bn: 'দ্বিতীয় শব্দ', en: 'Second noun' }}
          note={{
            bn: 'সবসময় সম্বন্ধপদে (-i)।',
            en: 'Always genitive (-i).',
          }}
          words={SECONDS}
          current={b}
          onPick={setB}
          preview={(w) => w.arGenitive}
        />
      </div>

      <div
        className="mt-6 rounded-2xl p-6 text-center"
        style={{
          background:
            'linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-2-soft) 100%)',
          border: '1px solid var(--border-2)',
        }}
      >
        <div className="text-xs text-muted uppercase tracking-wider mb-2" lang="en">
          result
        </div>
        <ArabicText className="!text-4xl">{combined}</ArabicText>
        <div className="grid md:grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-2 text-sm">
          <div lang="en">{en}</div>
          <div lang="bn" className="bn md:text-right">
            {bn}
          </div>
        </div>
      </div>
    </div>
  );
}

function Picker({
  label,
  note,
  words,
  current,
  onPick,
  preview,
}: {
  label: { bn: string; en: string };
  note: { bn: string; en: string };
  words: Word[];
  current: number;
  onPick: (i: number) => void;
  preview: (w: Word) => string;
}) {
  return (
    <div>
      <div className="chip chip-accent mb-2" lang="en">
        <span lang="bn" className="bn">
          {label.bn}
        </span>
        <span className="opacity-60 ml-1">· {label.en}</span>
      </div>
      <p className="text-xs text-muted mb-3">
        <span lang="bn" className="bn">
          {note.bn}
        </span>
        <span lang="en" className="opacity-70 block">
          {note.en}
        </span>
      </p>
      <div className="flex flex-wrap gap-2" dir="rtl">
        {words.map((w, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            dir="ltr"
            className={
              'rounded-xl px-3 py-2 border transition-colors cursor-pointer flex flex-col items-center min-w-[6rem] ' +
              (current === i
                ? 'text-[color:var(--accent-fg)] border-transparent'
                : 'bg-surface border-border hover:border-accent')
            }
            style={current === i ? { background: 'var(--gradient-accent)' } : undefined}
            aria-pressed={current === i}
          >
            <ArabicText className={current === i ? '!text-[color:var(--accent-fg)] !text-xl' : '!text-xl'}>
              {preview(w)}
            </ArabicText>
            <span className="text-[10px] mt-0.5 opacity-70" lang="en">
              {w.en}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
