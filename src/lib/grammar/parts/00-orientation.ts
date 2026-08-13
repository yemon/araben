import type { GrammarPart } from '../types';

export const partOrientation: GrammarPart = {
  slug: 'orientation',
  order: 0,
  eyebrow: { bn: 'ভিত্তি', en: 'Orientation' },
  title: {
    bn: 'ব্যাকরণের আগে তিনটি জরুরি কথা',
    en: 'Three orientation facts before grammar',
  },
  lead: {
    bn: 'আরবি ব্যাকরণে ঢুকার আগে ভাষার সাধারণ চেহারাটা মাথায় থাক—কোন আরবি শিখবে, লিপি কেমন, আর ছোট্ট স্বরচিহ্নগুলো কী কী।',
    en: "Before you touch grammar, get the language's rough shape in your head — which Arabic you're learning, how the script works, and the short-vowel marks it uses.",
  },
  keywords: ['MSA', 'Fusha', 'Arabic script', 'harakat'],
  sections: [
    {
      id: 'which-arabic',
      heading: { bn: 'কোন আরবি শিখব?', en: 'Which Arabic?' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'সব আরবি এক নয়। শুরুতে সিদ্ধান্তটা সহজ—আধুনিক প্রমিত আরবি (MSA / الفصحى) দিয়ে শুরু করো। কুরআনের ক্লাসিক্যাল আরবি আর MSA-র ব্যাকরণ প্রায় এক; কথ্য আঞ্চলিক ভাষা (মিশরি, লেভান্তীয়, খলিজি) পরের কথা।',
            en: "Arabic isn't one thing. The safe start is Modern Standard Arabic (MSA / al-fuṣḥā). Its grammar is essentially the same as Classical / Qur'anic Arabic. Dialects (Egyptian, Levantine, Gulf) come later.",
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'রকম', en: 'Variety' },
            { bn: 'যেখানে থাকে', en: 'Where it lives' },
            { bn: 'শুরুতে?', en: 'Start here?' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: 'ক্লাসিক্যাল আরবি', en: 'Classical Arabic' } },
              { kind: 'bi', value: { bn: 'কুরআন, প্রাচীন সাহিত্য', en: 'Qur’an, classical literature' } },
              { kind: 'bi', value: { bn: 'MSA-র মতোই ব্যাকরণ, পুরনো শব্দ', en: 'Same grammar, older vocabulary' } },
            ],
            [
              { kind: 'bi', value: { bn: 'MSA (আধুনিক প্রমিত)', en: 'Modern Standard Arabic' } },
              { kind: 'bi', value: { bn: 'সংবাদ, বই, লেখা মাত্রই', en: 'News, books, all writing' } },
              { kind: 'bi', value: { bn: 'হ্যাঁ, এখানেই।', en: 'Yes — start here.' } },
            ],
            [
              { kind: 'bi', value: { bn: 'আঞ্চলিক ভাষা', en: 'Dialects' } },
              { kind: 'bi', value: { bn: 'দৈনন্দিন কথাবার্তা', en: 'Daily conversation' } },
              { kind: 'bi', value: { bn: 'পরে, দরকার বুঝে একটা বেছে', en: 'Later, pick one you need' } },
            ],
          ],
        },
      ],
    },
    {
      id: 'the-script',
      heading: { bn: 'এক প্যারায় আরবি লিপি', en: 'The script in one paragraph' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'আরবি ডান থেকে বামে লেখা হয়। ২৮টি বর্ণ, সবগুলোই ব্যঞ্জন। বেশিরভাগ বর্ণ তার পাশের বর্ণের সাথে জোড়া লাগে—তাই একই বর্ণের ৪টি রূপ থাকতে পারে (আদি, মধ্য, অন্ত, স্বতন্ত্র)। ছয়টি বর্ণ (ا د ذ ر ز و) পরের বর্ণের সাথে যুক্ত হয় না, তাই শব্দ যেন মাঝপথে ভেঙে যায়। ছোট স্বর আসলে বর্ণ নয়—ব্যঞ্জনের উপর/নিচে বসানো ছোট চিহ্ন, স্বাভাবিক লেখায় সাধারণত থাকে না। বড়রা প্যাটার্ন চিনে চিনে পড়ে—ব্যাকরণ শেখানোর কাজই সেটা।',
            en: 'Arabic is written right to left. There are 28 letters, all consonants; most connect to neighbouring letters, so a single letter can have up to four shapes depending on its position. Six letters (ا د ذ ر ز و) never connect to the letter after them, which is why words seem to break in the middle. Short vowels aren’t letters — they’re optional marks above and below the consonants, usually left out in normal text. Adults read unvowelled Arabic by pattern recognition, which is exactly what grammar teaches you.',
          },
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'বিস্তারিত ২৮টি বর্ণ, রূপ ও শব্দের জন্য /alphabet/ পাতাটি দেখো।',
            en: 'For all 28 letters, their shapes and sounds, see the /alphabet/ page.',
          },
        },
      ],
    },
    {
      id: 'harakat',
      heading: { bn: 'স্বরচিহ্ন (হারাকাত)', en: 'The vowel marks (ḥarakāt)' },
      blocks: [
        {
          kind: 'table',
          headers: [
            { bn: 'চিহ্ন', en: 'Mark' },
            { bn: 'নাম', en: 'Name' },
            { bn: 'ধ্বনি', en: 'Sound' },
            { bn: 'উদাহরণ', en: 'Example' },
          ],
          rows: [
            [{ kind: 'ar', value: 'ـَ' }, 'fatḥa', { kind: 'bi', value: { bn: 'ছোট আ', en: 'short a' } }, { kind: 'ar-t', ar: 'بَ', t: 'ba' }],
            [{ kind: 'ar', value: 'ـِ' }, 'kasra', { kind: 'bi', value: { bn: 'ছোট ই', en: 'short i' } }, { kind: 'ar-t', ar: 'بِ', t: 'bi' }],
            [{ kind: 'ar', value: 'ـُ' }, 'ḍamma', { kind: 'bi', value: { bn: 'ছোট উ', en: 'short u' } }, { kind: 'ar-t', ar: 'بُ', t: 'bu' }],
            [{ kind: 'ar', value: 'ـْ' }, 'sukūn', { kind: 'bi', value: { bn: 'স্বর নেই', en: 'no vowel' } }, { kind: 'ar-t', ar: 'بْ', t: 'b' }],
            [{ kind: 'ar', value: 'ـّ' }, 'shadda', { kind: 'bi', value: { bn: 'ব্যঞ্জন দ্বিগুণ', en: 'double the consonant' } }, { kind: 'ar-t', ar: 'بّ', t: 'bb' }],
            [{ kind: 'ar', value: 'ـً ـٍ ـٌ' }, 'tanwīn', { kind: 'bi', value: { bn: 'অনির্দিষ্ট শেষ: -an, -in, -un', en: 'indefinite -an, -in, -un' } }, { kind: 'ar-t', ar: 'بٌ', t: 'bun' }],
          ],
        },
        {
          kind: 'prose',
          text: {
            bn: 'দীর্ঘ স্বরের জন্য ব্যবহৃত হয় সত্যিকারের বর্ণ: ا (ā), و (ū), ي (ī)।',
            en: 'Long vowels use actual letters: ا (ā), و (ū), ي (ī).',
          },
        },
      ],
    },
  ],
};
