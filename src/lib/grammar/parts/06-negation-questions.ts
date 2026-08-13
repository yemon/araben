import type { GrammarPart } from '../types';

export const partNegationQuestions: GrammarPart = {
  slug: 'negation-questions',
  order: 6,
  eyebrow: { bn: 'না ও প্রশ্ন', en: 'Negation & questions' },
  title: {
    bn: 'না-বাচক ও প্রশ্ন',
    en: 'Negation and questions',
  },
  lead: {
    bn: 'আরবিতে "না" এর জন্য একেক পরিস্থিতিতে একেক শব্দ। প্রশ্ন করাটা তুলনায় সহজ—word order একই, সামনে একটা কণা বসাও।',
    en: 'Arabic uses a different negator depending on tense and sentence type. Questions, by contrast, are easy — word order stays the same, you just prepend a particle.',
  },
  keywords: ['negation', 'questions', 'lā', 'lam', 'lan', 'laysa'],
  sections: [
    {
      id: 'negation',
      heading: { bn: 'না-বাচক', en: 'Negation' },
      blocks: [
        {
          kind: 'table',
          headers: [
            { bn: 'নেগেটর', en: 'Negator' },
            { bn: 'কোথায়', en: 'Used with' },
            { bn: 'উদাহরণ', en: 'Example' },
            { bn: 'অর্থ', en: 'Meaning' },
          ],
          rows: [
            [
              { kind: 'ar-t', ar: 'لَا', t: 'lā' },
              { kind: 'bi', value: { bn: 'বর্তমান ক্রিয়া', en: 'present verb' } },
              { kind: 'ar-t', ar: 'لَا أَكْتُبُ', t: 'lā aktubu' },
              { kind: 'bi', value: { bn: 'আমি লিখি না', en: 'I do not write' } },
            ],
            [
              { kind: 'ar-t', ar: 'مَا', t: 'mā' },
              { kind: 'bi', value: { bn: 'অতীত ক্রিয়া', en: 'past verb' } },
              { kind: 'ar-t', ar: 'مَا كَتَبَ', t: 'mā kataba' },
              { kind: 'bi', value: { bn: 'সে লিখেনি', en: 'he did not write' } },
            ],
            [
              { kind: 'ar-t', ar: 'لَمْ', t: 'lam' },
              { kind: 'bi', value: { bn: 'জুস্‌সুম বর্তমান = অতীতের অর্থ', en: 'jussive present = past' } },
              { kind: 'ar-t', ar: 'لَمْ يَكْتُبْ', t: 'lam yaktub' },
              { kind: 'bi', value: { bn: 'সে লিখেনি (আরো আনুষ্ঠানিক)', en: 'he did not write (more formal)' } },
            ],
            [
              { kind: 'ar-t', ar: 'لَنْ', t: 'lan' },
              { kind: 'bi', value: { bn: 'অনুমতিসূচক বর্তমান = ভবিষ্যৎ', en: 'subjunctive present = future' } },
              { kind: 'ar-t', ar: 'لَنْ يَكْتُبَ', t: 'lan yaktuba' },
              { kind: 'bi', value: { bn: 'সে লিখবে না', en: 'he will not write' } },
            ],
            [
              { kind: 'ar-t', ar: 'لَيْسَ', t: 'laysa' },
              { kind: 'bi', value: { bn: 'নামবাচক বাক্য', en: 'nominal sentence' } },
              { kind: 'ar-t', ar: 'لَيْسَ الْبَيْتُ كَبِيرًا', t: 'laysa l-baytu kabīran' },
              { kind: 'bi', value: { bn: 'বাড়িটা বড় না', en: 'the house is not big' } },
            ],
            [
              { kind: 'ar-t', ar: 'لَا النَّاهِيَة', t: 'lā n-nāhiya' },
              { kind: 'bi', value: { bn: 'নিষেধ', en: 'prohibition' } },
              { kind: 'ar-t', ar: 'لَا تَكْتُبْ', t: 'lā taktub' },
              { kind: 'bi', value: { bn: 'লিখো না!', en: 'do not write!' } },
            ],
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'অতীতে না বলতে لَمْ আর مَا দুটোই চলে; আনুষ্ঠানিক লেখায় لَمْ বেশি প্রচলিত।',
            en: 'لَمْ and مَا both negate the past. لَمْ is more common in formal writing.',
          },
        },
      ],
    },
    {
      id: 'questions',
      heading: { bn: 'প্রশ্ন', en: 'Questions' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'হ্যাঁ/না প্রশ্নে শুধু سামনে একটা কণা বসাও। বাক্যের ক্রম বদলায় না।',
            en: 'For yes/no questions, just add a particle at the front. Word order does not change.',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'هَلْ أَنْتَ طَالِبٌ؟', transliteration: 'hal anta ṭālibun?', english: 'Are you a student?', bangla: 'তুমি কি ছাত্র?' },
            { arabic: 'هَلْ كَتَبَ الدَّرْسَ؟', transliteration: 'hal kataba d-darsa?', english: 'Did he write the lesson?', bangla: 'সে কি পাঠটি লিখেছে?' },
            { arabic: 'أَأَنْتَ مُحَمَّدٌ؟', transliteration: 'a-anta Muḥammadun?', english: 'Are you Muhammad?', bangla: 'তুমি কি মুহাম্মদ?' },
          ],
        },
        {
          kind: 'table',
          headers: [
            { bn: 'প্রশ্নবাচক', en: 'Question word' },
            { bn: 'উচ্চারণ', en: 'Sound' },
            { bn: 'অর্থ', en: 'Meaning' },
          ],
          rows: [
            [{ kind: 'ar', value: 'مَنْ' }, 'man', { kind: 'bi', value: { bn: 'কে', en: 'who' } }],
            [{ kind: 'ar', value: 'مَا' }, 'mā', { kind: 'bi', value: { bn: 'কী (বিশেষ্যের আগে)', en: 'what (before a noun)' } }],
            [{ kind: 'ar', value: 'مَاذَا' }, 'mādhā', { kind: 'bi', value: { bn: 'কী (ক্রিয়ার আগে)', en: 'what (before a verb)' } }],
            [{ kind: 'ar', value: 'أَيْنَ' }, 'ayna', { kind: 'bi', value: { bn: 'কোথায়', en: 'where' } }],
            [{ kind: 'ar', value: 'مَتَى' }, 'matā', { kind: 'bi', value: { bn: 'কখন', en: 'when' } }],
            [{ kind: 'ar', value: 'كَيْفَ' }, 'kayfa', { kind: 'bi', value: { bn: 'কীভাবে', en: 'how' } }],
            [{ kind: 'ar', value: 'لِمَاذَا' }, 'limādhā', { kind: 'bi', value: { bn: 'কেন', en: 'why' } }],
            [{ kind: 'ar', value: 'كَمْ' }, 'kam', { kind: 'bi', value: { bn: 'কত', en: 'how many' } }],
            [{ kind: 'ar', value: 'أَيّ' }, 'ayy', { kind: 'bi', value: { bn: 'কোনটা', en: 'which' } }],
          ],
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'مَا اسْمُكَ؟', transliteration: 'masmuk?', english: 'What is your name?', bangla: 'তোমার নাম কী?' },
            { arabic: 'أَيْنَ الْكِتَابُ؟', transliteration: 'aynal-kitāb?', english: 'Where is the book?', bangla: 'বইটা কোথায়?' },
            { arabic: 'مَاذَا تَفْعَلُ؟', transliteration: 'mādhā tafʿalu?', english: 'What are you doing?', bangla: 'তুমি কী করছ?' },
            { arabic: 'كَيْفَ حَالُكَ؟', transliteration: 'kayfa ḥāluka?', english: 'How are you?', bangla: 'তুমি কেমন আছ?' },
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'আরবি প্রশ্নচিহ্ন মিরর করা: **؟** (ডানে বাঁকা)।',
            en: 'The Arabic question mark is mirrored: **؟**',
          },
        },
      ],
    },
  ],
};
