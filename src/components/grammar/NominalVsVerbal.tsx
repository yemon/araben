'use client';

import { ArabicText } from '@/components/ArabicText';

export function NominalVsVerbal() {
  return (
    <div className="grid md:grid-cols-2 gap-4 my-6">
      <Panel
        colour="accent"
        badge={{ bn: 'নামবাচক', en: 'Nominal' }}
        formula={{ bn: 'বিশেষ্য + বিশেষ্য', en: 'noun + noun' }}
        sentence="مُحَمَّدٌ مُهَنْدِسٌ"
        translit="Muḥammadun muhandisun"
        en="Muhammad is an engineer."
        bn="মুহাম্মদ একজন প্রকৌশলী।"
        note={{
          bn: 'বিষয়ে ফোকাস। বর্ণনায় বেশি ব্যবহৃত। "is" অটোমেটিক।',
          en: 'Topic-focused. Common in descriptions. "Is" is understood.',
        }}
      />
      <Panel
        colour="accent-2"
        badge={{ bn: 'ক্রিয়াবাচক', en: 'Verbal' }}
        formula={{ bn: 'ক্রিয়া + কর্তা + কর্ম', en: 'verb + doer + object' }}
        sentence="عَمِلَ مُحَمَّدٌ مُهَنْدِسًا"
        translit="ʿamila Muḥammadun muhandisan"
        en="Muhammad worked as an engineer."
        bn="মুহাম্মদ প্রকৌশলী হিসেবে কাজ করেছেন।"
        note={{
          bn: 'কাজে ফোকাস। বর্ণনামূলক গদ্য ও খবরে ডিফল্ট।',
          en: 'Action-focused. The default in narrative and news.',
        }}
      />
    </div>
  );
}

function Panel({
  colour,
  badge,
  formula,
  sentence,
  translit,
  en,
  bn,
  note,
}: {
  colour: 'accent' | 'accent-2';
  badge: { bn: string; en: string };
  formula: { bn: string; en: string };
  sentence: string;
  translit: string;
  en: string;
  bn: string;
  note: { bn: string; en: string };
}) {
  return (
    <div className="card p-5">
      <div
        className="chip mb-3"
        style={{
          background: colour === 'accent' ? 'var(--accent-soft)' : 'var(--accent-2-soft)',
          color: colour === 'accent' ? 'var(--accent)' : 'var(--accent-2)',
          borderColor: 'transparent',
        }}
      >
        <span lang="bn" className="bn">{badge.bn}</span>
        <span className="opacity-60 ml-1" lang="en">· {badge.en}</span>
      </div>
      <div className="text-xs text-muted mb-2" lang="en">
        <span lang="bn" className="bn">{formula.bn}</span>
        <span className="opacity-60 ml-1">· {formula.en}</span>
      </div>
      <ArabicText className="!text-3xl block text-center my-3">{sentence}</ArabicText>
      <div className="translit text-xs text-center" lang="en">{translit}</div>
      <div className="grid md:grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-2 text-sm">
        <div lang="en">{en}</div>
        <div lang="bn" className="bn md:text-right">{bn}</div>
      </div>
      <div className="mt-3 text-xs text-muted">
        <div lang="bn" className="bn">{note.bn}</div>
        <div lang="en" className="opacity-70 mt-0.5">{note.en}</div>
      </div>
    </div>
  );
}
