// UI-chrome translation dictionary. Bangla is the default.
// This covers the site scaffolding (nav, hero, section blurbs, footer, links) —
// not the study content itself, which stays multilingual per row.

export type Lang = 'bn' | 'en';

export const dict = {
  site: {
    tagline: {
      bn: 'বাংলাভাষী শিক্ষার্থীর জন্য শান্ত, ধাপে ধাপে আরবি শেখার গাইড। কথোপকথন, ছোট সূরা, আর মূল-শব্দের কারখানা—একসাথে।',
      en: 'A calm, self-paced guide to Arabic for Bangla and English speakers — conversation, short surahs, and the root system that powers the language.',
    },
    title: {
      bn: 'আরাবেন.স্টাডি — বাংলায় আরবি শেখো',
      en: 'araben.study — Learn Arabic for Bangla & English speakers',
    },
    shortTagline: {
      bn: 'শব্দে শব্দে আরবি চেনো।',
      en: 'Get to know Arabic, word by word.',
    },
  },

  nav: {
    alphabet: { bn: 'বর্ণমালা', en: 'Alphabet' },
    grammar: { bn: 'ব্যাকরণ', en: 'Grammar' },
    basics: { bn: 'বেসিক', en: 'Basics' },
    scenarios: { bn: 'বাস্তব দৃশ্য', en: 'Scenarios' },
    surahs: { bn: 'সূরা', en: 'Surahs' },
    roots: { bn: 'মূল', en: 'Roots' },
    hidden: { bn: 'বাংলায় লুকানো আরবি', en: 'Hidden in Bangla' },
    search: { bn: 'খোঁজো', en: 'Search' },
    about: { bn: 'পরিচিতি', en: 'About' },
    home: { bn: 'হোম', en: 'Home' },
    menu: { bn: 'মেনু', en: 'Menu' },
  },

  navHint: {
    alphabet: { bn: '২৮ অক্ষর ও হারাকাত', en: '28 letters & harakāt' },
    grammar: { bn: 'বাক্য গঠনের ম্যাপ', en: 'A map of sentence-building' },
    basics: { bn: 'শব্দ ও প্যাটার্ন', en: 'Words & patterns' },
    scenarios: { bn: '১০টি বাস্তব কথোপকথন', en: '10 real-life dialogues' },
    surahs: { bn: 'শব্দে শব্দে অর্থ', en: 'Word by word' },
    roots: { bn: 'শব্দ-পরিবার', en: 'Word families' },
    hidden: { bn: 'তুমি এমনিতেই যেসব চেন', en: 'Arabic you already know' },
    search: { bn: 'যেকোনো শব্দ', en: 'Find any word' },
  },

  hero: {
    startCta: {
      bn: 'সালাম থেকে শুরু করো →',
      en: 'Start with greetings →',
    },
    scenarioCta: {
      bn: 'বাস্তব দৃশ্য দেখো',
      en: 'Try a real scenario',
    },
    greeting: {
      bn: 'আসসালামু আলাইকুম',
      en: 'Peace be upon you',
    },
    heroLead: {
      bn: 'বাংলাভাষী শিক্ষার্থীর জন্য একটি শান্ত, ধাপে ধাপে সাজানো গাইড।',
      en: 'A quiet, self-paced guide for Bangla and English speakers.',
    },
    heroLead2: {
      bn: 'মূল ফোকাস',
      en: 'Focus:',
    },
    heroLead3: {
      bn: 'বেসিক কথোপকথন',
      en: 'basic conversation',
    },
    heroLead4: {
      bn: '— যেটি ছোট সূরার শব্দভাণ্ডার আর মূল-শব্দের সিস্টেম দিয়ে দৃঢ় করা।',
      en: ", backed by the Qur'an's short surahs and the root system that unlocks the language.",
    },
  },

  path: {
    heading: { bn: 'তোমার শেখার পথ', en: 'Your learning path' },
    alphabetTitle: { bn: 'বর্ণমালা', en: 'Alphabet' },
    alphabetDesc: {
      bn:
        '২৮টি আরবি বর্ণ, তাদের নাম, উচ্চারণ, আর হারাকাত দিয়ে কীভাবে ধ্বনি তৈরি হয়।',
      en: '28 Arabic letters with English + Bangla pronunciation and every harakāt form.',
    },
    alphabetCount: { bn: '২৮ বর্ণ · ৯০+ ধ্বনি', en: '28 letters · 90+ sounds' },
    grammarTitle: { bn: 'ব্যাকরণ', en: 'Grammar' },
    grammarDesc: {
      bn: 'বাক্য কীভাবে গঠন হয়—নামবাচক, ক্রিয়াবাচক, ইদাফা, ক্রিয়ার Form, কানা ও ইন্না। ইন্টারঅ্যাক্টিভ পার্সারসহ ১৩ পাতা।',
      en: 'How sentences are built — nominal, verbal, iḍāfa, verb Forms, kāna and inna. 13 pages with interactive parsers.',
    },
    grammarCount: { bn: '১৩ পাতা · ৭টি ইন্টারঅ্যাক্টিভ', en: '13 pages · 7 interactives' },
    basicsTitle: { bn: 'বেসিক', en: 'Basics' },
    basicsDesc: {
      bn: '১২০+ দৈনন্দিন শব্দ, বাক্যের প্যাটার্ন, আর তিনটি ওয়ার্ম-আপ কথোপকথন।',
      en: '120+ everyday words, sentence patterns, and 3 warm-up dialogues.',
    },
    basicsCount: {
      bn: (n: number) => `${n}টি ক্যাটাগরি`,
      en: (n: number) => `${n} categories`,
    },
    scenariosTitle: { bn: 'বাস্তব দৃশ্য', en: 'Scenarios' },
    scenariosDesc: {
      bn: '১০টি বাস্তব কথোপকথন — রেস্টুরেন্ট, ট্যাক্সি, হোটেল, বাজার, মসজিদ…',
      en: '10 real-life dialogues — restaurant, taxi, hotel, market, mosque…',
    },
    scenariosCount: {
      bn: (n: number) => `${n}টি কথোপকথন`,
      en: (n: number) => `${n} dialogues`,
    },
    surahsTitle: { bn: 'সূরা: শব্দে শব্দে', en: 'Surahs — word by word' },
    surahsDesc: {
      bn: '১৯টি ছোট সূরার প্রতিটি শব্দের বাংলা ও ইংরেজি অর্থ।',
      en: '19 short surahs mapped word by word to English and Bangla.',
    },
    surahsCount: {
      bn: (surahs: number, verses: number) => `${surahs}টি সূরা · ${verses}টি সারি`,
      en: (surahs: number, verses: number) => `${surahs} surahs · ${verses} rows`,
    },
    rootsTitle: { bn: 'মূলশব্দ সিস্টেম', en: 'Root system' },
    rootsDesc: {
      bn: 'প্রতিটি আরবি শব্দ তিন অক্ষরের মূল থেকে গজায়। একটা চিনলে পুরো পরিবার ফ্রি।',
      en: 'Every Arabic word grows from a 3-letter root. Learn one, get a family free.',
    },
    rootsCount: {
      bn: (n: number) => `${n}টি মূল`,
      en: (n: number) => `${n} roots`,
    },
    hiddenTitle: { bn: 'বাংলায় লুকানো আরবি', en: 'Arabic in Bangla' },
    hiddenDesc: {
      bn: '১৭০+ বাংলা শব্দ আসলে আরবি। যেভাবে শোনো, সেটাই বদলাবে।',
      en: '170+ Bangla words that are secretly Arabic. Rewires how you hear the language.',
    },
    hiddenCount: { bn: '৭টি ক্যাটাগরি', en: '7 categories' },
    searchTitle: { bn: 'সব শব্দে খোঁজো', en: 'Search anything' },
    searchDesc: {
      bn: (n: number) =>
        `${n}টি শব্দ — আরবি, উচ্চারণ, ইংরেজি বা বাংলা যেকোনো কিছু দিয়ে খোঁজো।`,
      en: (n: number) =>
        `${n} words indexed — Arabic, transliteration, English, or Bangla.`,
    },
    searchCount: { bn: 'ফাজি সার্চ', en: 'Fuzzy search' },
  },

  featured: {
    wordTitle: { bn: 'একটা শব্দ, খুঁটিয়ে', en: 'A single word, unwrapped' },
    wordDesc: {
      bn: 'প্রতিটা শব্দের নিজস্ব পাতা—অর্থ, কোথায় ব্যবহৃত, একই মূল থেকে জন্মানো শব্দ। ছুঁয়ে দেখো:',
      en:
        'Every word has its own page — meaning, appearances, related words, and a root link when there is one. Try one:',
    },
    readTitle: { bn: 'যেভাবে খুশি পড়ো', en: 'Read it your way' },
    readDesc: {
      bn: 'তিনটি রিডিং মুড — উপরের টগল থেকে যেকোনো সময় বদলাও।',
      en: 'Three reading moods — toggle from the top bar any time.',
    },
    themeLight: {
      bn: 'উষ্ণ অফ-হোয়াইট, উজ্জ্বল কনট্রাস্ট। ডিফল্ট।',
      en: 'Warm off-white, high contrast. Default.',
    },
    themeDark: {
      bn: 'নরম চারকোল—রাতে চোখ আরাম পায়।',
      en: 'Soft charcoal — easier on your eyes at night.',
    },
    themeSepia: {
      bn: 'কাগজ-ক্রিম আর উষ্ণ বাদামি—লম্বা পড়ার জন্য।',
      en: 'Paper-cream with warm brown — the classic long-read.',
    },
  },

  grammar: {
    chapters: { bn: '১৩টি অধ্যায়', en: '13 chapters' },
    title: { bn: 'আরবি ব্যাকরণ: শিক্ষার্থীর ম্যাপ', en: 'Arabic grammar — a beginner’s map' },
    subtitle: { bn: 'আধুনিক প্রমিত আরবি', en: 'Modern Standard Arabic' },
    lead: {
      bn: 'তেরটি ছোট পাতা—লিপি ও ভিত্তি থেকে শুরু করে বাক্য, ইদাফা, ক্রিয়া, কানা-ইন্না, আর হাতে-কলমে বিশ্লেষণ পর্যন্ত। প্রতিটি পাতায় ইন্টারঅ্যাক্টিভ পার্সার, কেস-ফ্লিপার আর বাংলা-ইংরেজি পাশাপাশি।',
      en: 'Thirteen small pages — from script and foundations through sentence types, iḍāfa, verbs, kāna-and-inna, and word-by-word worked examples. Every page pairs interactive parsers with side-by-side Bangla and English.',
    },
    pathHead: { bn: 'পড়ার পথ', en: 'How to read this' },
    pathTitle: { bn: 'একটানা নয়, তবু ক্রমে', en: 'Not in one sitting — but in order' },
    pathBody: {
      bn: 'পুরো ম্যাপটা প্রথমে একবার শেষ থেকে শেষ পড়ে ফেলো—ভাষার শেপ মাথায় বসাতে। তারপর নির্দিষ্ট সেকশনে যতবার দরকার ফিরে এসো। ইন্টারঅ্যাক্টিভ উইজেটগুলো (শব্দ-পার্সার, ইদাফা-বিল্ডার, কানা-ইন্না ফ্লিপার) ধারণাগুলো হাতে ধরিয়ে দিতে সাহায্য করবে।',
      en: 'Read the whole map once end to end to get the language’s shape in your head. Then come back to any section as many times as you need. The interactive widgets — sentence parser, iḍāfa builder, kāna-inna flipper — put the concepts in your hands.',
    },
  },

  alphabet: {
    title: { bn: 'আরবি বর্ণমালা', en: 'Arabic alphabet' },
    subtitle: { bn: 'হুরূফ আল-হিজাইয়্যাহ', en: 'Ḥurūf al-hijā’iyyah' },
    lead: {
      bn: 'আরবির ২৮টি বর্ণ। প্রতিটির উপরে বসে হারাকাত—ফাতহা, কাসরা, দাম্মা—আর সেই বর্ণ পায় স্বরধ্বনি। এই পাতা থেকে যেকোনো বর্ণে ঢুকে হারাকাতসহ পূর্ণ উচ্চারণ দেখো।',
      en:
        'The 28 letters of Arabic. A harakāt mark — Fatḥah, Kasrah, Ḍammah — sits on a letter to give it its vowel. Tap any letter to see all three vowel forms with English and Bangla pronunciation.',
    },
    harakatHead: { bn: 'হারাকাত', en: 'Harakāt (short vowels)' },
    harakatBody: {
      bn: 'তিনটি ছোট চিহ্ন—ফাতহা, কাসরা, দাম্মা—বর্ণের উপর/নিচে বসে তার স্বর ঠিক করে।',
      en:
        'Three tiny marks — Fatḥah, Kasrah, Ḍammah — sit above or below a letter to set its vowel.',
    },
    lettersHead: { bn: '২৮টি বর্ণ', en: 'The 28 letters' },
    otherMarksHead: { bn: 'অন্যান্য চিহ্ন', en: 'Other marks' },
    otherMarksBody: {
      bn: 'হারাকাত ছাড়াও আরো কিছু চিহ্ন—সুকুন (স্বরহীন), শাদ্দাহ (দ্বিগুণ), তানউইন (আন/ইন/উন)।',
      en:
        'Besides the harakāt, a few more marks — Sukūn (no vowel), Shaddah (double consonant), and Tanwīn (an / in / un).',
    },
    longVowelsHead: { bn: 'দীর্ঘ স্বর (মদ)', en: 'Long vowels (Madd)' },
    longVowelsBody: {
      bn: 'ছোট স্বরের পরে ا, و, ي বসলে সেই স্বর দীর্ঘ হয়ে যায়।',
      en: 'When ا, و, or ي follow a short vowel, the vowel is drawn out (long).',
    },
    practiceHead: { bn: 'অনুশীলনের ক্রম', en: 'Practice order' },
    practiceBody: {
      bn: 'প্রতিটি বর্ণের জন্য এই ক্রমে বলো: بَ → বা, بِ → বি, بُ → বু। তারপর পরের বর্ণ। এভাবেই কায়দা নূরানিয়ায় শেখানো হয়।',
      en:
        'For each letter, practise in this sequence: بَ → ba, بِ → bi, بُ → bu. Then move to the next letter. This is the same progression used in Qā‘idah Nūrāniyyah.',
    },
    letterEyebrow: { bn: 'বর্ণ', en: 'Letter' },
    withHarakatHead: { bn: 'হারাকাতসহ', en: 'With harakāt' },
    longVowelHead: { bn: 'দীর্ঘ স্বর', en: 'Long vowel' },
    letterCount: {
      bn: (n: number, total: number) => `${n} / ${total}`,
      en: (n: number, total: number) => `${n} / ${total}`,
    },
    prev: { bn: 'আগের বর্ণ', en: 'Previous letter' },
    next: { bn: 'পরের বর্ণ', en: 'Next letter' },
    heavy: { bn: 'ভারী (মোটা)', en: 'Heavy' },
    guttural: { bn: 'গলার ধ্বনি', en: 'Guttural' },
    vowel: { bn: 'স্বরবর্ণ', en: 'Vowel' },
    fathaLabel: { bn: 'ফাতহা', en: 'Fatḥah' },
    kasraLabel: { bn: 'কাসরা', en: 'Kasrah' },
    dammaLabel: { bn: 'দাম্মা', en: 'Ḍammah' },
    englishHead: { bn: 'ইংরেজি উচ্চারণ', en: 'English sound' },
    banglaHead: { bn: 'বাংলা উচ্চারণ', en: 'Bangla sound' },
  },

  section: {
    categoriesHeading: { bn: 'ক্যাটাগরি', en: 'Categories' },
    dialoguesHeading: { bn: 'ওয়ার্ম-আপ কথোপকথন', en: 'Warm-up dialogues' },
    familyHeading: { bn: 'পরিবার', en: 'Family' },
    atGlance: { bn: 'সংক্ষেপে', en: 'At a glance' },
    newWords: { bn: 'নতুন শব্দ', en: 'New words' },
    whereAppears: { bn: 'কোথায় পাবে', en: "Where you'll meet it" },
    relatedWords: { bn: 'সংশ্লিষ্ট শব্দ', en: 'Related words' },
    rootLabel: { bn: 'মূল', en: 'Root' },
    versePrefix: { bn: 'আয়াত', en: 'Verse' },
    scenarioPrefix: { bn: 'দৃশ্য', en: 'Scenario' },
    mushafPrefix: { bn: 'মুসহাফ নং', en: 'Mushaf #' },
    wordsCount: {
      bn: (n: number) => `${n}টি শব্দ`,
      en: (n: number) => `${n} words`,
    },
    turnsCount: {
      bn: (n: number) => `${n}টি সংলাপ`,
      en: (n: number) => `${n} turns`,
    },
    familyCount: {
      bn: (n: number) => `${n}টি পরিবার-শব্দ`,
      en: (n: number) => `${n} family words`,
    },
  },

  breadcrumbs: {
    home: { bn: 'হোম', en: 'Home' },
    words: { bn: 'শব্দ', en: 'Words' },
  },

  word: {
    englishHeading: { bn: 'ইংরেজি', en: 'English' },
    banglaHeading: { bn: 'বাংলা', en: 'বাংলা' },
    openCard: { bn: 'কার্ড খোলো →', en: 'Open card →' },
    listen: { bn: 'শোনো', en: 'Listen' },
    playing: { bn: 'বাজছে', en: 'Playing' },
    noAudio: { bn: 'অডিও এখনও তৈরি হয়নি', en: 'Audio not yet generated for this word' },
    ariaPlay: {
      bn: (label: string) => `${label}-এর উচ্চারণ শোনো`,
      en: (label: string) => `Play pronunciation of ${label}`,
    },
    ariaNoAudio: {
      bn: (label: string) => `${label}-এর জন্য অডিও নেই`,
      en: (label: string) => `No audio available for ${label}`,
    },
  },

  search: {
    heading: { bn: 'খোঁজো', en: 'Search' },
    lead: {
      bn: (n: number) =>
        `${n}টি শব্দ ইনডেক্স করা। আরবি, উচ্চারণ, ইংরেজি বা বাংলা—যেকোনোটা লেখো।`,
      en: (n: number) =>
        `${n} words indexed. Type Arabic, transliteration, English, or Bangla — any column, any word.`,
    },
    placeholder: {
      bn: 'যেমন: সালাম, book, ধন্যবাদ, كتاب',
      en: 'e.g. salam, book, ধন্যবাদ, كتاب',
    },
    label: { bn: 'খোঁজো', en: 'Search' },
    matches: {
      bn: (n: number) => `${n}টি ফল`,
      en: (n: number) => `${n} matches`,
    },
    noMatches: { bn: 'কোনো ফল নেই', en: 'No matches' },
    indexed: {
      bn: (n: number) => `${n}টি শব্দ ইনডেক্সে`,
      en: (n: number) => `${n} words indexed`,
    },
  },

  home: {
    pageBasics: { bn: 'বেসিক পাতা', en: 'Basics' },
    pageScenarios: { bn: 'বাস্তব দৃশ্য পাতা', en: 'Scenarios' },
    pageSurahs: { bn: 'সূরার তালিকা', en: 'Surahs' },
    startHere: {
      bn: 'কথা বলার জন্য এখান থেকে শুরু',
      en: 'Start here to speak',
    },
    supportedBy: {
      bn: 'সমৃদ্ধ করবে',
      en: 'Deepen with',
    },
  },

  footer: {
    tagline: {
      bn: 'বাংলাভাষীর জন্য আরবি শেখার একটা নিরিবিলি জায়গা। বর্ণমালা থেকে কথোপকথন, কুরআনের শব্দ থেকে মূল-শব্দের পরিবার—সবটা এক ছাদের নিচে।',
      en:
        "A quiet place to learn Arabic — from the alphabet to everyday talk, from Qur'anic words to the root families that tie them together.",
    },
    learnHead: { bn: 'শেখা', en: 'Learn' },
    toolsHead: { bn: 'টুল', en: 'Tools' },
    colophonHead: { bn: 'রচনাশৈলী', en: 'Colophon' },
    colophonBody: {
      bn: 'আরবি: Amiri · বাংলা: Anek Bangla · ইংরেজি: Inter ও Playfair Display। তিনটি রিডিং মুড: লাইট গ্রে, সেমি-ডার্ক, সেপিয়া।',
      en:
        'Typeset in Amiri (Arabic), Anek Bangla, Inter, and Playfair Display. Three reading modes.',
    },
    copyright: {
      bn: (y: number) => `© ${y} araben.study — কন্টেন্ট শেয়ার করতে স্বাধীন।`,
      en: (y: number) => `© ${y} araben.study — content free to share.`,
    },
    privacy: {
      bn: 'স্ট্যাটিক সাইট — কোনো ট্র্যাকিং নেই, তোমার নির্বাচিত থিম ছাড়া কিছু সংরক্ষিত হয় না।',
      en:
        'Static site — no tracking, nothing saved except your chosen theme.',
    },
  },

  langSwitcher: {
    label: { bn: 'ভাষা', en: 'Language' },
    bn: { bn: 'বাংলা', en: 'Bangla' },
    en: { bn: 'English', en: 'English' },
  },

  themeSwitcher: {
    label: { bn: 'রিডিং থিম', en: 'Reading theme' },
    light: { bn: 'লাইট গ্রে', en: 'Light gray' },
    dark: { bn: 'সেমি ডার্ক', en: 'Semi dark' },
    sepia: { bn: 'সেপিয়া', en: 'Sepia read' },
  },

  notFound: {
    title: { bn: 'পাতাটি নেই', en: 'Not found' },
    body: {
      bn: 'এই পাতাটি এখানে নেই। নিচের বিভাগগুলো দেখো, বা যে শব্দ খুঁজছ সেটা সার্চ করো।',
      en: "That page isn't here. Try a section below, or search for the word you had in mind.",
    },
  },
} as const;

type DictVal =
  | { bn: string; en: string }
  | { bn: (...a: any[]) => string; en: (...a: any[]) => string };

export function pick<V extends DictVal>(
  val: V,
  lang: Lang
): V['bn'] {
  return (val[lang] ?? val.bn) as V['bn'];
}
