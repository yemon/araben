'use client';

import { useState } from 'react';
import { ArabicText } from '@/components/ArabicText';
import { useT } from '@/lib/i18n/t';

// Only k-t-b for now — the model is set up to support more roots later.
const CONJUGATIONS = {
  'k-t-b': {
    past: [
      { pron: 'أَنَا', ar: 'كَتَبْتُ', latin: 'katabtu', bn: 'আমি লিখেছি', en: 'I wrote' },
      { pron: 'أَنْتَ', ar: 'كَتَبْتَ', latin: 'katabta', bn: 'তুমি লিখেছ (পুং.)', en: 'you wrote (m)' },
      { pron: 'أَنْتِ', ar: 'كَتَبْتِ', latin: 'katabti', bn: 'তুমি লিখেছ (স্ত্রী.)', en: 'you wrote (f)' },
      { pron: 'هُوَ', ar: 'كَتَبَ', latin: 'kataba', bn: 'সে লিখেছে (পুং.)', en: 'he wrote' },
      { pron: 'هِيَ', ar: 'كَتَبَتْ', latin: 'katabat', bn: 'সে লিখেছে (স্ত্রী.)', en: 'she wrote' },
      { pron: 'نَحْنُ', ar: 'كَتَبْنَا', latin: 'katabnā', bn: 'আমরা লিখেছি', en: 'we wrote' },
      { pron: 'أَنْتُمْ', ar: 'كَتَبْتُمْ', latin: 'katabtum', bn: 'তোমরা লিখেছ (পুং.)', en: 'you (m pl) wrote' },
      { pron: 'هُمْ', ar: 'كَتَبُوا', latin: 'katabū', bn: 'তারা লিখেছে (পুং.)', en: 'they (m) wrote' },
      { pron: 'هُنَّ', ar: 'كَتَبْنَ', latin: 'katabna', bn: 'তারা লিখেছে (স্ত্রী.)', en: 'they (f) wrote' },
    ],
    present: [
      { pron: 'أَنَا', ar: 'أَكْتُبُ', latin: 'aktubu', bn: 'আমি লিখি', en: 'I write' },
      { pron: 'أَنْتَ', ar: 'تَكْتُبُ', latin: 'taktubu', bn: 'তুমি লেখো (পুং.)', en: 'you write (m)' },
      { pron: 'أَنْتِ', ar: 'تَكْتُبِينَ', latin: 'taktubīna', bn: 'তুমি লেখো (স্ত্রী.)', en: 'you write (f)' },
      { pron: 'هُوَ', ar: 'يَكْتُبُ', latin: 'yaktubu', bn: 'সে লেখে (পুং.)', en: 'he writes' },
      { pron: 'هِيَ', ar: 'تَكْتُبُ', latin: 'taktubu', bn: 'সে লেখে (স্ত্রী.)', en: 'she writes' },
      { pron: 'نَحْنُ', ar: 'نَكْتُبُ', latin: 'naktubu', bn: 'আমরা লিখি', en: 'we write' },
      { pron: 'أَنْتُمْ', ar: 'تَكْتُبُونَ', latin: 'taktubūna', bn: 'তোমরা লেখো (পুং.)', en: 'you (m pl) write' },
      { pron: 'هُمْ', ar: 'يَكْتُبُونَ', latin: 'yaktubūna', bn: 'তারা লেখে (পুং.)', en: 'they (m) write' },
      { pron: 'هُنَّ', ar: 'يَكْتُبْنَ', latin: 'yaktubna', bn: 'তারা লেখে (স্ত্রী.)', en: 'they (f) write' },
    ],
    future: [
      { pron: 'أَنَا', ar: 'سَأَكْتُبُ', latin: 'sa-aktubu', bn: 'আমি লিখব', en: 'I will write' },
      { pron: 'أَنْتَ', ar: 'سَتَكْتُبُ', latin: 'sa-taktubu', bn: 'তুমি লিখবে (পুং.)', en: 'you will write (m)' },
      { pron: 'هُوَ', ar: 'سَيَكْتُبُ', latin: 'sa-yaktubu', bn: 'সে লিখবে (পুং.)', en: 'he will write' },
      { pron: 'هِيَ', ar: 'سَتَكْتُبُ', latin: 'sa-taktubu', bn: 'সে লিখবে (স্ত্রী.)', en: 'she will write' },
      { pron: 'نَحْنُ', ar: 'سَنَكْتُبُ', latin: 'sa-naktubu', bn: 'আমরা লিখব', en: 'we will write' },
      { pron: 'هُمْ', ar: 'سَيَكْتُبُونَ', latin: 'sa-yaktubūna', bn: 'তারা লিখবে (পুং.)', en: 'they (m) will write' },
    ],
  },
} as const;

type Tense = 'past' | 'present' | 'future';

export function VerbConjugator({ root = 'k-t-b' as keyof typeof CONJUGATIONS }: { root?: keyof typeof CONJUGATIONS }) {
  const [tense, setTense] = useState<Tense>('present');
  const t = useT();
  const data = CONJUGATIONS[root];

  const tenses: { id: Tense; label: { bn: string; en: string } }[] = [
    { id: 'past', label: { bn: 'অতীত', en: 'Past' } },
    { id: 'present', label: { bn: 'বর্তমান', en: 'Present' } },
    { id: 'future', label: { bn: 'ভবিষ্যৎ', en: 'Future' } },
  ];

  const rows = data[tense];

  return (
    <div className="card p-5 md:p-7 my-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted" lang="en">
            {t({ bn: 'ক্রিয়ার সংযোজন', en: 'Verb conjugation' })}
          </div>
          <div className="translit text-lg" lang="en">
            root {root} — {t({ bn: 'লেখা', en: 'writing' })}
          </div>
        </div>
        <div className="flex gap-2">
          {tenses.map((tn) => (
            <button
              key={tn.id}
              type="button"
              onClick={() => setTense(tn.id)}
              className={
                'px-3 py-1.5 rounded-full text-sm transition-colors border ' +
                (tense === tn.id
                  ? 'bg-fg text-bg border-transparent'
                  : 'border-border hover:border-accent')
              }
              aria-pressed={tense === tn.id}
            >
              <span lang="bn" className="bn">{t(tn.label)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-2">
        <table className="w-full text-sm">
          <thead className="bg-surface-2">
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="p-3">Pron.</th>
              <th className="p-3">Arabic</th>
              <th className="p-3">Translit</th>
              <th className="p-3" lang="en">English</th>
              <th className="p-3 bn" lang="bn">বাংলা</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-2)]">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="p-3"><ArabicText className="!text-lg">{r.pron}</ArabicText></td>
                <td className="p-3"><ArabicText className="!text-xl">{r.ar}</ArabicText></td>
                <td className="p-3 translit" lang="en">{r.latin}</td>
                <td className="p-3 text-fg-2" lang="en">{r.en}</td>
                <td className="p-3 bn" lang="bn">{r.bn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
