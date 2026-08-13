import type { GrammarPart } from '../types';

export const partKanaInna: GrammarPart = {
  slug: 'kana-inna',
  order: 7,
  eyebrow: { bn: 'কেস-ফ্লিপার', en: 'The case flippers' },
  title: {
    bn: 'Kāna আর Inna: দুই পরিবার যারা কেস ওলটপালট করে',
    en: 'Kāna and Inna: two families that flip the case endings',
  },
  lead: {
    bn: 'নামবাচক বাক্যের সামনে কিছু কিছু শব্দ এসে বসলে দুই অংশের কেস বদলে যায়। কে কী করে, সেটা মনে রাখার সহজ কৌশল: **কানা দ্বিতীয় শব্দটাকে ওলটায়, ইন্না প্রথমটাকে।**',
    en: 'Two sets of words rearrange a nominal sentence’s case endings. Remember the pair with one hook: **kāna flips the second word, inna flips the first.**',
  },
  keywords: ['kāna', 'inna', 'case flip'],
  sections: [
    {
      id: 'interactive',
      heading: { bn: 'নিজে চেষ্টা করে দেখো', en: 'Try it yourself' },
      blocks: [
        {
          kind: 'widget',
          widget: 'kana-inna',
        },
      ],
    },
    {
      id: 'kana',
      heading: { bn: 'Kāna ও তার বোনদের দল', en: 'Kāna and her sisters' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'এগুলো ক্রিয়া। কর্তাকে কর্তৃবাচকেই রাখে, কিন্তু বিধেয়কে ঠেলে দেয় **কর্মবাচকে (accusative)**।',
            en: 'These are verbs. They keep the subject nominative but push the predicate into the **accusative**.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'শব্দ', en: 'Word' },
            { bn: 'উচ্চারণ', en: 'Sound' },
            { bn: 'অর্থ', en: 'Meaning' },
          ],
          rows: [
            [{ kind: 'ar', value: 'كَانَ' }, { kind: 'translit', value: 'kāna' }, { kind: 'bi', value: { bn: 'ছিল', en: 'was' } }],
            [{ kind: 'ar', value: 'لَيْسَ' }, { kind: 'translit', value: 'laysa' }, { kind: 'bi', value: { bn: 'নয়', en: 'is not' } }],
            [{ kind: 'ar', value: 'صَارَ' }, { kind: 'translit', value: 'ṣāra' }, { kind: 'bi', value: { bn: 'হয়ে গেল', en: 'became' } }],
            [{ kind: 'ar', value: 'أَصْبَحَ' }, { kind: 'translit', value: 'aṣbaḥa' }, { kind: 'bi', value: { bn: 'সকালে হয়ে গেল', en: 'became (in the morning)' } }],
            [{ kind: 'ar', value: 'ظَلَّ' }, { kind: 'translit', value: 'ẓalla' }, { kind: 'bi', value: { bn: 'থেকে গেল', en: 'remained' } }],
            [{ kind: 'ar', value: 'مَا زَالَ' }, { kind: 'translit', value: 'mā zāla' }, { kind: 'bi', value: { bn: 'এখনো (আছে)', en: 'still is' } }],
          ],
          caption: {
            bn: 'কানার পরিবার—সবাই ক্রিয়া; বিধেয়কে কর্মবাচকে ঠেলে দেয়।',
            en: 'The family of kāna — all verbs; each flips the predicate to accusative.',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'كَانَ الْبَيْتُ كَبِيرًا', transliteration: 'kāna l-baytu kabīran', english: 'The house was big.', bangla: 'বাড়িটা বড় ছিল।' },
            { arabic: 'لَيْسَ الْبَيْتُ كَبِيرًا', transliteration: 'laysa l-baytu kabīran', english: 'The house is not big.', bangla: 'বাড়িটা বড় নয়।' },
            { arabic: 'أَصْبَحَ الطَّالِبُ مُعَلِّمًا', transliteration: 'aṣbaḥa ṭ-ṭālibu muʿalliman', english: 'The student became a teacher.', bangla: 'ছাত্রটি শিক্ষক হয়ে গেল।' },
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'যেহেতু আরবিতে বর্তমান "to be" নেই, "ছিল" বলার সবচেয়ে সরাসরি উপায় হলো كَانَ। তাই এটা ভাষার অন্যতম দরকারি ক্রিয়া।',
            en: 'Since Arabic has no present-tense "to be", كَانَ is how you say "was". That makes it one of the most useful verbs in the language.',
          },
        },
      ],
    },
    {
      id: 'inna',
      heading: { bn: 'Inna ও তার বোনদের দল', en: 'Inna and her sisters' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'এগুলো ক্রিয়া নয়, particle। কাজটা উল্টো: **কর্তা যায় কর্মবাচকে**, বিধেয় থাকে কর্তৃবাচকেই।',
            en: 'These are particles. They do the reverse: the **subject becomes accusative**, the predicate stays nominative.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'শব্দ', en: 'Word' },
            { bn: 'উচ্চারণ', en: 'Sound' },
            { bn: 'অর্থ', en: 'Meaning' },
          ],
          rows: [
            [{ kind: 'ar', value: 'إِنَّ' }, { kind: 'translit', value: 'inna' }, { kind: 'bi', value: { bn: 'নিশ্চয়ই', en: 'indeed' } }],
            [{ kind: 'ar', value: 'أَنَّ' }, { kind: 'translit', value: 'anna' }, { kind: 'bi', value: { bn: 'যে (that)', en: 'that' } }],
            [{ kind: 'ar', value: 'لَكِنَّ' }, { kind: 'translit', value: 'lākinna' }, { kind: 'bi', value: { bn: 'কিন্তু', en: 'but' } }],
            [{ kind: 'ar', value: 'لِأَنَّ' }, { kind: 'translit', value: 'li-anna' }, { kind: 'bi', value: { bn: 'কারণ', en: 'because' } }],
            [{ kind: 'ar', value: 'كَأَنَّ' }, { kind: 'translit', value: 'ka-anna' }, { kind: 'bi', value: { bn: 'যেন', en: 'as if' } }],
            [{ kind: 'ar', value: 'لَعَلَّ' }, { kind: 'translit', value: 'laʿalla' }, { kind: 'bi', value: { bn: 'হয়তো', en: 'perhaps' } }],
            [{ kind: 'ar', value: 'لَيْتَ' }, { kind: 'translit', value: 'layta' }, { kind: 'bi', value: { bn: 'হায় যদি', en: 'if only' } }],
          ],
          caption: {
            bn: 'ইন্নার পরিবার—সবাই particle; কর্তাকে কর্মবাচকে ঠেলে দেয়।',
            en: 'The family of inna — all particles; each flips the subject to accusative.',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'إِنَّ الْبَيْتَ كَبِيرٌ', transliteration: 'inna l-bayta kabīrun', english: 'Indeed, the house is big.', bangla: 'নিশ্চয়ই বাড়িটা বড়।' },
            { arabic: 'أَعْلَمُ أَنَّ الْبَيْتَ كَبِيرٌ', transliteration: 'aʿlamu anna l-bayta kabīrun', english: 'I know that the house is big.', bangla: 'আমি জানি যে বাড়িটা বড়।' },
            { arabic: 'لِأَنَّ الطَّالِبَ مُجْتَهِدٌ', transliteration: 'li-anna ṭ-ṭāliba mujtahidun', english: 'because the student is hardworking', bangla: 'কারণ ছাত্রটি পরিশ্রমী' },
          ],
        },
      ],
    },
  ],
};
