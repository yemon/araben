import type { GrammarPart } from '../types';

export const partConjunctions: GrammarPart = {
  slug: 'conjunctions',
  order: 8,
  eyebrow: { bn: 'বাক্য জোড়া', en: 'Joining ideas' },
  title: {
    bn: 'বাক্য ও ধারা জোড়া দেওয়ার শব্দ',
    en: 'Joining sentences and clauses',
  },
  lead: {
    bn: 'ছোট ছোট বাক্য মিলিয়ে বড় ভাষা—আরবিতে এই জোড়া দেওয়াটা ইংরেজির চেয়ে অনেক অবাধ। এক و দিয়েই লম্বা বাক্যচেইন হয়।',
    en: 'Arabic strings small sentences into long ones much more freely than English. A single و carries whole paragraphs.',
  },
  keywords: ['conjunctions', 'relative pronouns', 'wa', 'fa'],
  sections: [
    {
      id: 'connectors',
      heading: { bn: 'সংযোজক', en: 'Connectors' },
      blocks: [
        {
          kind: 'table',
          headers: [
            { bn: 'কণা', en: 'Particle' },
            { bn: 'উচ্চারণ', en: 'Sound' },
            { bn: 'অর্থ', en: 'Meaning' },
            { bn: 'নোট', en: 'Note' },
          ],
          rows: [
            [{ kind: 'ar', value: 'وَ' }, 'wa', { kind: 'bi', value: { bn: 'এবং', en: 'and' } }, { kind: 'bi', value: { bn: 'পরের শব্দে লেগে যায়', en: 'attached to next word' } }],
            [{ kind: 'ar', value: 'فَ' }, 'fa', { kind: 'bi', value: { bn: 'তারপর, তাই', en: 'and then, so' } }, { kind: 'bi', value: { bn: 'ক্রম বা ফলাফল বোঝায়', en: 'implies sequence or result' } }],
            [{ kind: 'ar', value: 'ثُمَّ' }, 'thumma', { kind: 'bi', value: { bn: 'তারপর', en: 'then, afterwards' } }, { kind: 'bi', value: { bn: 'সময়ের একটু বেশি ফাঁক', en: 'a longer time gap' } }],
            [{ kind: 'ar', value: 'أَوْ' }, 'aw', { kind: 'bi', value: { bn: 'অথবা', en: 'or' } }, ''],
            [{ kind: 'ar', value: 'لَكِنْ' }, 'lākin', { kind: 'bi', value: { bn: 'কিন্তু', en: 'but' } }, ''],
            [{ kind: 'ar', value: 'لِأَنَّ' }, 'li-anna', { kind: 'bi', value: { bn: 'কারণ', en: 'because' } }, { kind: 'bi', value: { bn: 'পরে কর্মবাচক কর্তা', en: 'followed by accusative subject' } }],
            [{ kind: 'ar', value: 'إِذَا' }, 'idhā', { kind: 'bi', value: { bn: 'যদি (বাস্তব শর্ত)', en: 'if (real condition)' } }, ''],
            [{ kind: 'ar', value: 'عِنْدَمَا' }, 'ʿindamā', { kind: 'bi', value: { bn: 'যখন', en: 'when' } }, ''],
            [{ kind: 'ar', value: 'الَّذِي / الَّتِي' }, 'alladhī / allatī', { kind: 'bi', value: { bn: 'যে, যিনি (relative)', en: 'who, which' } }, { kind: 'bi', value: { bn: 'লিঙ্গ-বচনে মিল থাকতে হবে', en: 'must match gender and number' } }],
          ],
        },
        {
          kind: 'prose',
          text: {
            bn: 'ক্লাসিক্যাল আরবিতে একটাই বাক্য প্যারা পার হয়ে যেতে পারত। আধুনিক লেখা সংক্ষিপ্ত, তবু লম্বা যুক্ত বাক্য আরবি ভাষায় স্বাভাবিক।',
            en: 'A single classical Arabic sentence can run for a paragraph. Modern writing is shorter, but comfortable with long coordinated strings.',
          },
        },
      ],
    },
    {
      id: 'relative',
      heading: { bn: 'Relative clause-এ সাবধান', en: 'Relative clauses need care' },
      blocks: [
        {
          kind: 'callout',
          tone: 'rule',
          text: {
            bn: 'Relative pronoun (الَّذِي, الَّتِي) **তখনই** বসে যখন বিশেষ্যটি নির্দিষ্ট।',
            en: 'The relative pronoun appears **only if the noun is definite**.',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'الْكِتَابُ الَّذِي قَرَأْتُهُ', transliteration: 'al-kitābu lladhī qaraʾtuhu', english: 'the book that I read', bangla: 'যে বইটা আমি পড়েছি' },
            { arabic: 'كِتَابٌ قَرَأْتُهُ', transliteration: 'kitābun qaraʾtuhu', english: 'a book that I read (no relative pronoun!)', bangla: 'একটা বই যা আমি পড়েছি (relative pronoun লাগে না)' },
          ],
        },
      ],
    },
  ],
};
