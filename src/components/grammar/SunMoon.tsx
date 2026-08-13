'use client';

import { useState } from 'react';
import { ArabicText } from '@/components/ArabicText';

const WORDS = [
  { ar: 'الشَّمْس', pronounced: 'ash-shams', written: 'al-shams', bn: 'সূর্য', en: 'sun', type: 'sun' as const },
  { ar: 'الْقَمَر', pronounced: 'al-qamar', written: 'al-qamar', bn: 'চাঁদ', en: 'moon', type: 'moon' as const },
  { ar: 'الرَّجُل', pronounced: 'ar-rajul', written: 'al-rajul', bn: 'পুরুষ', en: 'man', type: 'sun' as const },
  { ar: 'الْبَيْت', pronounced: 'al-bayt', written: 'al-bayt', bn: 'বাড়ি', en: 'house', type: 'moon' as const },
  { ar: 'النَّجْم', pronounced: 'an-najm', written: 'al-najm', bn: 'তারা', en: 'star', type: 'sun' as const },
  { ar: 'الْمَاء', pronounced: 'al-māʾ', written: 'al-māʾ', bn: 'পানি', en: 'water', type: 'moon' as const },
];

export function SunMoon() {
  const [showPronounced, setShowPronounced] = useState(true);

  return (
    <div className="card p-5 md:p-7 my-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted" lang="en">
            Sun letters · সূর্য-অক্ষর
          </div>
          <div className="text-sm mt-1">
            <span lang="bn" className="bn">
              টগল করে দেখো—লেখা এক, উচ্চারণ আলাদা।
            </span>
            <span lang="en" className="text-muted text-xs block mt-0.5">
              Same spelling, different pronunciation when الـ meets a sun letter.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowPronounced((v) => !v)}
          className="px-3 py-1.5 rounded-full border border-border hover:border-accent text-xs"
        >
          <span lang="en">{showPronounced ? 'Show as written' : 'Show as pronounced'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {WORDS.map((w) => (
          <div
            key={w.ar}
            className="rounded-2xl border p-4 flex flex-col items-center text-center gap-1"
            style={{
              background: w.type === 'sun' ? 'var(--accent-2-soft)' : 'var(--accent-soft)',
              borderColor: 'transparent',
            }}
          >
            <ArabicText className="!text-3xl">{w.ar}</ArabicText>
            <div className="translit text-sm" lang="en">
              {showPronounced ? w.pronounced : w.written}
            </div>
            <div className="text-xs text-fg-2" lang="en">{w.en}</div>
            <div className="text-xs bn text-muted" lang="bn">{w.bn}</div>
            <div
              className="text-[10px] uppercase tracking-wider mt-1"
              style={{
                color: w.type === 'sun' ? 'var(--accent-2)' : 'var(--accent)',
              }}
              lang="en"
            >
              {w.type}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted mt-4">
        <span lang="bn" className="bn">
          সূর্য-অক্ষরের আগে ل এর উচ্চারণ পরের অক্ষরে মিশে দ্বিগুণ হয়ে যায়; বাকি সব চাঁদ-অক্ষর, সেখানে ل স্বাভাবিক শোনা যায়।
        </span>
        <span lang="en" className="opacity-70 block mt-1">
          Before sun letters, the l assimilates into the next consonant (doubled). With moon letters, the l is pronounced normally.
        </span>
      </p>
    </div>
  );
}
