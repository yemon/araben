import type { GrammarPart } from '../types';

export const partPhrases: GrammarPart = {
  slug: 'phrases',
  order: 3,
  eyebrow: { bn: 'বাক্যের ইট', en: 'Building blocks' },
  title: {
    bn: 'বাক্যাংশ বানানো: বিশেষণ, ইদাফা, অব্যয়',
    en: 'Building phrases: adjectives, iḍāfa, prepositions',
  },
  lead: {
    bn: 'পুরো বাক্যে যাওয়ার আগে ছোট ছোট বাক্যাংশ ঠিকমতো বসাতে শেখো—বিশেষণের চার-দিকী মিল, ইদাফার "-এর" বন্ধন, আর অব্যয়ের পর সম্বন্ধপদ।',
    en: 'Before you attempt full sentences, learn to build correct phrases — the four-way match of adjectives, the "-of" bond of iḍāfa, and how prepositions force the genitive.',
  },
  keywords: ['adjectives', 'iḍāfa', 'prepositions', 'agreement'],
  sections: [
    {
      id: 'adjectives',
      heading: { bn: 'বিশেষণ (النَّعْت)', en: 'Adjectives (an-naʿt)' },
      blocks: [
        {
          kind: 'callout',
          tone: 'rule',
          text: {
            bn: 'আরবি বিশেষণ **বিশেষ্যের পরে** বসে, আর একই সাথে চারটি ব্যাপারে মিলতে হয়: **লিঙ্গ, বচন, কেস, নির্দিষ্টতা।**',
            en: 'Arabic adjectives come **after** the noun and must match in **gender, number, case, and definiteness** — all four at once.',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'بَيْتٌ كَبِيرٌ', transliteration: 'baytun kabīrun', english: 'a big house', bangla: 'একটি বড় বাড়ি' },
            { arabic: 'الْبَيْتُ الْكَبِيرُ', transliteration: 'al-baytu l-kabīru', english: 'the big house', bangla: 'বড় বাড়িটা' },
            { arabic: 'مَدْرَسَةٌ جَدِيدَةٌ', transliteration: 'madrasatun jadīdatun', english: 'a new school', bangla: 'একটি নতুন স্কুল' },
            { arabic: 'الْمَدْرَسَةُ الْجَدِيدَةُ', transliteration: 'al-madrasatu l-jadīdatu', english: 'the new school', bangla: 'নতুন স্কুলটা' },
            { arabic: 'فِي الْبَيْتِ الْكَبِيرِ', transliteration: 'fī l-bayti l-kabīri', english: 'in the big house', bangla: 'বড় বাড়িটার ভেতরে' },
          ],
        },
        {
          kind: 'prose',
          text: {
            bn: 'শেষ উদাহরণে খেয়াল করো—অব্যয় বিশেষ্যকে সম্বন্ধপদে ঠেলে দেয়, আর বিশেষণও সেই সাথে সম্বন্ধপদে চলে যায়।',
            en: 'Note the last one: the preposition puts the noun in the genitive, and the adjective follows along.',
          },
        },
        {
          kind: 'callout',
          tone: 'gotcha',
          title: { bn: 'অ-মানব বহুবচনের অদ্ভুত নিয়ম', en: 'The non-human plural rule' },
          text: {
            bn: 'যেসব বহুবচন **জিনিস বা প্রাণীর** কথা বলে, তারা বিশেষণ নেয় **স্ত্রীলিঙ্গ একবচন**। এটা ঐচ্ছিক নয়—সবখানে কাজ করে।',
            en: "Plural nouns that refer to **things or animals** take a **feminine singular** adjective. It's not optional — it's everywhere.",
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'الْكُتُبُ الْجَدِيدَةُ', transliteration: 'al-kutubu l-jadīdatu', english: 'the new books (books = things = f.sg agreement)', bangla: 'নতুন বইগুলো (অ-মানব বহুবচন = স্ত্রী-একবচন)' },
            { arabic: 'السَّيَّارَاتُ الْكَبِيرَةُ', transliteration: 'as-sayyārātu l-kabīratu', english: 'the big cars', bangla: 'বড় গাড়িগুলো' },
            { arabic: 'الْأَوْلَادُ الْجُدُدُ', transliteration: 'al-awlādu l-judud', english: 'the new boys (human plural = real plural adjective)', bangla: 'নতুন ছেলেরা (মানব বহুবচন = বহুবচন বিশেষণ)' },
          ],
        },
      ],
    },
    {
      id: 'idafa',
      heading: {
        bn: 'দখল বোঝানোর বাঁধন — ইদাফা (الإِضَافَة)',
        en: 'The possessive construction — iḍāfa (al-iḍāfa)',
      },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'আরবিতে "of" বলে কিছু নেই, "-এর" বসানোর apostrophe-s নেই। দুইটি বিশেষ্যকে সরাসরি জোড়া লাগিয়ে দিলেই "…-এর …" হয়ে যায়।',
            en: 'Arabic has no word for "of" and no apostrophe-s. It joins two nouns directly to say "X of Y".',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'بَابُ الْبَيْتِ', transliteration: 'bābu l-bayti', english: 'the door of the house', bangla: 'বাড়ির দরজা' },
            { arabic: 'كِتَابُ الطَّالِبِ', transliteration: 'kitābu ṭ-ṭālibi', english: "the student's book", bangla: 'ছাত্রের বই' },
            { arabic: 'مُدِيرُ الشَّرِكَةِ', transliteration: 'mudīru sh-sharikati', english: 'the manager of the company', bangla: 'কোম্পানির ম্যানেজার' },
            { arabic: 'غُرْفَةُ الْمُدِيرِ', transliteration: 'ghurfatu l-mudīri', english: "the manager's room", bangla: 'ম্যানেজারের ঘর' },
          ],
        },
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'চারটি নিরঙ্কুশ নিয়ম', en: 'Four absolute rules' },
          text: {
            bn: '(১) প্রথম বিশেষ্য (মুদাফ) কখনো ال নেয় না, তানউইন নেয় না।\n(২) দ্বিতীয় বিশেষ্য (মুদাফ ইলাইহি) **সবসময় সম্বন্ধপদে**।\n(৩) পুরো বাক্যাংশ নির্দিষ্ট নাকি অনির্দিষ্ট—সেটা ঠিক করে **দ্বিতীয়** বিশেষ্য।\n(৪) মাঝখানে **কিছুই** যেতে পারে না। "বাড়ির বড় দরজা" বলতে হলে বিশেষণ পুরো ইদাফার শেষে বসাতে হবে, এবং কেস দিয়েই বোঝা যাবে সে কার সাথে যায়।',
            en: '(1) The **first noun** (muḍāf) never takes الـ and never takes tanwīn.\n(2) The **second noun** (muḍāf ilayhi) is **always genitive**.\n(3) Whether the whole phrase is definite or indefinite depends on the **second** noun.\n(4) **Nothing** goes between them. To say "the big door of the house" you must put the adjective at the end and let case endings show which noun it belongs to.',
          },
        },
        {
          kind: 'widget',
          widget: 'idafah-builder',
        },
        {
          kind: 'prose',
          text: {
            bn: 'ইদাফা চেইনও করা যায়: كِتَابُ مُدِيرِ الشَّرِكَةِ ("কোম্পানির ম্যানেজারের বই")।',
            en: 'You can chain them: كِتَابُ مُدِيرِ الشَّرِكَةِ — "the book of the manager of the company."',
          },
        },
      ],
    },
    {
      id: 'prepositions',
      heading: { bn: 'অব্যয় (حُرُوف الجَرّ)', en: 'Prepositions (ḥurūf al-jarr)' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'প্রতিটি অব্যয় পরের বিশেষ্যকে সম্বন্ধপদে (genitive-এ) ঠেলে দেয়। ব্যতিক্রম নেই।',
            en: 'Every preposition forces the following noun into the genitive. No exceptions.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'আরবি', en: 'Arabic' },
            { bn: 'উচ্চারণ', en: 'Sound' },
            { bn: 'অর্থ', en: 'Meaning' },
          ],
          rows: [
            [{ kind: 'ar', value: 'فِي' }, 'fī', { kind: 'bi', value: { bn: 'ভেতরে', en: 'in' } }],
            [{ kind: 'ar', value: 'مِنْ' }, 'min', { kind: 'bi', value: { bn: 'থেকে', en: 'from' } }],
            [{ kind: 'ar', value: 'إِلَى' }, 'ilā', { kind: 'bi', value: { bn: 'দিকে', en: 'to' } }],
            [{ kind: 'ar', value: 'عَلَى' }, 'ʿalā', { kind: 'bi', value: { bn: 'উপর', en: 'on' } }],
            [{ kind: 'ar', value: 'بِـ' }, 'bi-', { kind: 'bi', value: { bn: 'দিয়ে (attached)', en: 'with, by (attached)' } }],
            [{ kind: 'ar', value: 'لِـ' }, 'li-', { kind: 'bi', value: { bn: 'জন্য (attached)', en: 'for, to (attached)' } }],
            [{ kind: 'ar', value: 'عَنْ' }, 'ʿan', { kind: 'bi', value: { bn: 'সম্পর্কে', en: 'about, from' } }],
            [{ kind: 'ar', value: 'مَعَ' }, 'maʿa', { kind: 'bi', value: { bn: 'সাথে', en: 'with (together)' } }],
            [{ kind: 'ar', value: 'عِنْدَ' }, 'ʿinda', { kind: 'bi', value: { bn: 'কাছে; -এর আছে', en: 'at, in the possession of' } }],
          ],
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'فِي الْبَيْتِ', transliteration: 'fī l-bayti', english: 'in the house', bangla: 'বাড়িতে' },
            { arabic: 'مِنَ الْمَدْرَسَةِ', transliteration: 'mina l-madrasati', english: 'from the school', bangla: 'স্কুল থেকে' },
            { arabic: 'بِالْقَلَمِ', transliteration: 'bi-l-qalami', english: 'with the pen', bangla: 'কলম দিয়ে' },
          ],
        },
      ],
    },
  ],
};
