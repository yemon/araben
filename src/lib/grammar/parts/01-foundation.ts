import type { GrammarPart } from '../types';

export const partFoundation: GrammarPart = {
  slug: 'foundation',
  order: 1,
  eyebrow: { bn: 'ভিত', en: 'Foundation' },
  title: {
    bn: 'ভিত্তি: শব্দ, মূল, নির্দিষ্টতা, লিঙ্গ, বচন, কেস',
    en: 'The foundation: word types, roots, definiteness, gender, number, case',
  },
  lead: {
    bn: 'ব্যাকরণ কাজে লাগাতে হলে এই ছয়টা জিনিস আগে বুঝতে হবে—আরবি এদের চারপাশেই ঘোরে।',
    en: 'Six concepts that everything else rests on. Once these click, the rest of Arabic grammar starts making sense fast.',
  },
  keywords: ['root system', 'iʿrāb', 'gender', 'plural'],
  sections: [
    {
      id: 'word-types',
      heading: { bn: 'প্রতিটি আরবি শব্দ তিনের একটা', en: 'Every Arabic word is one of three things' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'ক্লাসিক্যাল ব্যাকরণবিদরা পুরো শব্দভাণ্ডারকে তিনটি বাক্সে ফেলে দেন। এই ভাগটাই ঠিক করে কোন নিয়ম কোথায় খাটবে।',
            en: 'Classical grammarians sort every word into one of three buckets. This isn’t trivia — it decides which rules apply.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'ধরন', en: 'Type' },
            { bn: 'আরবি', en: 'Arabic' },
            { bn: 'কী কী পড়ে', en: 'What it covers' },
            { bn: 'উদাহরণ', en: 'Example' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: 'ইসম (নাম-শ্রেণী)', en: 'Noun' } },
              { kind: 'ar-t', ar: 'اِسْم', t: 'ism' },
              { kind: 'bi', value: { bn: 'বিশেষ্য, বিশেষণ, সর্বনাম, নাম, কৃদন্ত—সব', en: 'nouns, adjectives, pronouns, names, participles' } },
              { kind: 'ar-t', ar: 'بَيْت', t: 'bayt', gloss: { bn: 'বাড়ি', en: 'house' } },
            ],
            [
              { kind: 'bi', value: { bn: 'ফিয়িল (ক্রিয়া)', en: 'Verb' } },
              { kind: 'ar-t', ar: 'فِعْل', t: 'fiʿl' },
              { kind: 'bi', value: { bn: 'কাজ, কালও (tense) বহন করে', en: 'actions, carries tense' } },
              { kind: 'ar-t', ar: 'كَتَبَ', t: 'kataba', gloss: { bn: 'সে লিখল', en: 'he wrote' } },
            ],
            [
              { kind: 'bi', value: { bn: 'হারফ (অব্যয় / চিহ্ন)', en: 'Particle' } },
              { kind: 'ar-t', ar: 'حَرْف', t: 'ḥarf' },
              { kind: 'bi', value: { bn: 'অব্যয়, প্রশ্নবাচক, না-বাচক—সবকিছু', en: 'prepositions, conjunctions, negators' } },
              { kind: 'ar-t', ar: 'فِي', t: 'fī', gloss: { bn: 'ভেতরে', en: 'in' } },
            ],
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'খেয়াল রাখো—আরবি চিন্তায় "বিশেষণ" আসলে বিশেষ্যেরই একটি রূপ। এজন্যই বিশেষণ তার বিশেষ্যের সাথে হুবহু মিলে চলে।',
            en: 'Adjectives are nouns in Arabic thinking. That’s why an adjective behaves so much like the noun it describes.',
          },
        },
      ],
    },
    {
      id: 'root-system',
      heading: { bn: 'মূল-শব্দের সিস্টেম', en: 'The root system' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'শুরুতেই বোঝার সবচেয়ে দামি জিনিস। বেশিরভাগ আরবি শব্দ তৈরি হয় তিন ব্যঞ্জনের একটা মূল থেকে—সেই মূল বহন করে অর্থের বীজ। তারপর মূলের ভেতর স্বর আর অন্য অক্ষর ঢেলে ছাঁচ (pattern) অনুসারে শব্দ বানানো হয়।',
            en: 'The single most useful thing to grasp early. Most Arabic words are built from a three-consonant root that carries a core meaning. Vowels and extras are poured into the root using fixed patterns.',
          },
        },
        {
          kind: 'widget',
          widget: 'root-explorer',
          props: { root: 'k-t-b' },
        },
        {
          kind: 'prose',
          text: {
            bn: '৪০–৫০টা ছাঁচ চিনলে অজানা শব্দও দেখা মাত্র অনুমান করতে পারবে—অর্থ আর ব্যাকরণিক ভূমিকা দুটোই। অভিধানও রুট অনুযায়ী সাজানো, শব্দের বানান অনুযায়ী নয়, তাই এটা শেখা বাধ্যবাধকতা।',
            en: 'Once you know 40–50 patterns you can meet a new word and guess both its meaning and its grammatical role. Dictionaries are organised by root — a practical necessity, not an option.',
          },
        },
        {
          kind: 'callout',
          tone: 'rule',
          text: {
            bn: 'ব্যাকরণবিদরা ف ع ل (f-ʿ-l) কে dummy-root হিসেবে ব্যবহার করেন। এজন্যই সবখানে faʿala, fāʿil, mafʿūl শব্দগুলো ঘুরেফিরে আসে।',
            en: 'Grammarians use ف ع ل (f-ʿ-l) as the dummy root for describing patterns. That’s why you see faʿala, fāʿil, mafʿūl everywhere.',
          },
        },
      ],
    },
    {
      id: 'definiteness',
      heading: { bn: 'নির্দিষ্টতা (a / the)', en: 'Definiteness (a / the)' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'আরবিতে "a / an" বলে কিছু নেই। খালি বিশেষ্য মানেই অনির্দিষ্ট।',
            en: 'Arabic has no word for "a" or "an". A bare noun is indefinite by default.',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'بَيْتٌ', transliteration: 'baytun', english: 'a house', bangla: 'একটি বাড়ি' },
            { arabic: 'الْبَيْتُ', transliteration: 'al-baytu', english: 'the house', bangla: 'বাড়িটা' },
          ],
        },
        {
          kind: 'prose',
          text: {
            bn: 'নির্দিষ্ট article হলো ال (al-)—শব্দের আগে সরাসরি জোড়া লাগে। দুটি জিনিস ঘটে: তানউইনের শেষ (ٌ) হারিয়ে যায়, আর কিছু "সূর্য-অক্ষরের" আগে ل এর উচ্চারণ পরের অক্ষরে মিশে দ্বিগুণ হয়।',
            en: 'The definite article is الـ (al-), prefixed directly. Two things happen: the tanwīn ending disappears, and with "sun letters" the l isn’t pronounced — the next consonant doubles instead.',
          },
        },
        {
          kind: 'widget',
          widget: 'sun-moon',
        },
      ],
    },
    {
      id: 'gender',
      heading: { bn: 'লিঙ্গ (পুংলিঙ্গ / স্ত্রীলিঙ্গ)', en: 'Gender' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'প্রতিটি বিশেষ্য পুংলিঙ্গ বা স্ত্রীলিঙ্গ। ক্লীবলিঙ্গ নেই।',
            en: 'Every noun is either masculine or feminine. There is no neuter.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'নিয়ম', en: 'Rule' },
            { bn: 'উদাহরণ', en: 'Example' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: 'ডিফল্টে পুংলিঙ্গ', en: 'Default is masculine' } },
              { kind: 'ar-t', ar: 'رَجُل', t: 'rajul', gloss: { bn: 'পুরুষ', en: 'man' } },
            ],
            [
              { kind: 'bi', value: { bn: 'ة (তা মারবুতা) মানে সাধারণত স্ত্রীলিঙ্গ', en: 'ة (tā’ marbūṭa) usually = feminine' } },
              { kind: 'ar-t', ar: 'مُعَلِّمَة', t: 'muʿallima', gloss: { bn: 'নারী শিক্ষক', en: 'female teacher' } },
            ],
            [
              { kind: 'bi', value: { bn: 'কিছু শব্দ চিহ্ন ছাড়াই স্ত্রীলিঙ্গ', en: 'Some words feminine without the marker' } },
              { kind: 'ar-t', ar: 'أُمّ · شَمْس · أَرْض · نَار', t: 'umm · shams · arḍ · nār', gloss: { bn: 'মা, সূর্য, পৃথিবী, আগুন', en: 'mother, sun, earth, fire' } },
            ],
            [
              { kind: 'bi', value: { bn: 'জোড়া অঙ্গ = স্ত্রীলিঙ্গ', en: 'Paired body parts = feminine' } },
              { kind: 'ar-t', ar: 'يَد · عَيْن', t: 'yad · ʿayn', gloss: { bn: 'হাত, চোখ', en: 'hand, eye' } },
            ],
          ],
        },
      ],
    },
    {
      id: 'number',
      heading: { bn: 'বচন: একবচন, দ্বিবচন, বহুবচন', en: 'Number: singular, dual, plural' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'আরবিতে আলাদা দ্বিবচন (dual) আছে—এটা অস্বাভাবিক, তাই শুরু থেকেই মাথায় রাখো।',
            en: 'Arabic has a separate dual form. This is unusual — worth internalising early.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'বচন', en: 'Number' },
            { bn: 'শেষ', en: 'Ending' },
            { bn: 'উদাহরণ', en: 'Example' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: 'একবচন', en: 'Singular' } },
              { kind: 'bi', value: { bn: 'মূল রূপ', en: 'base form' } },
              { kind: 'ar-t', ar: 'كِتَابٌ', t: 'kitābun', gloss: { bn: 'একটি বই', en: 'a book' } },
            ],
            [
              { kind: 'bi', value: { bn: 'দ্বিবচন', en: 'Dual' } },
              { kind: 'ar-t', ar: 'ـَانِ / ـَيْنِ', t: '-āni / -ayni' },
              { kind: 'ar-t', ar: 'كِتَابَانِ', t: 'kitābāni', gloss: { bn: 'দুটি বই', en: 'two books' } },
            ],
            [
              { kind: 'bi', value: { bn: 'বহুবচন', en: 'Plural' } },
              { kind: 'bi', value: { bn: 'নানারকম', en: 'varies' } },
              { kind: 'ar-t', ar: 'كُتُبٌ', t: 'kutubun', gloss: { bn: 'বইগুলো', en: 'books' } },
            ],
          ],
        },
        {
          kind: 'prose',
          text: {
            bn: 'বহুবচন দুই রকম: **সাউন্ড বহুবচন** (শব্দ অক্ষত রেখে শেষে suffix বসে) আর **ভাঙা বহুবচন** (শব্দের ভেতরের স্বর বদলে যায়)। ভাঙা বহুবচনই বেশি—প্রতিটি বিশেষ্যের সাথে তার বহুবচনটাও একসাথে মুখস্থ করে নাও।',
            en: 'Plurals come in two kinds. **Sound plurals** keep the word intact and add an ending. **Broken plurals** rearrange the word internally — most nouns take these, and you must memorise the plural with the singular from day one.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'একবচন', en: 'Singular' },
            { bn: 'বহুবচন', en: 'Plural' },
            { bn: 'অর্থ', en: 'Meaning' },
          ],
          rows: [
            [{ kind: 'ar-t', ar: 'كِتَاب', t: 'kitāb' }, { kind: 'ar-t', ar: 'كُتُب', t: 'kutub' }, { kind: 'bi', value: { bn: 'বই / বইগুলো', en: 'book / books' } }],
            [{ kind: 'ar-t', ar: 'رَجُل', t: 'rajul' }, { kind: 'ar-t', ar: 'رِجَال', t: 'rijāl' }, { kind: 'bi', value: { bn: 'পুরুষ / পুরুষেরা', en: 'man / men' } }],
            [{ kind: 'ar-t', ar: 'بَيْت', t: 'bayt' }, { kind: 'ar-t', ar: 'بُيُوت', t: 'buyūt' }, { kind: 'bi', value: { bn: 'বাড়ি / বাড়িগুলো', en: 'house / houses' } }],
            [{ kind: 'ar-t', ar: 'وَلَد', t: 'walad' }, { kind: 'ar-t', ar: 'أَوْلَاد', t: 'awlād' }, { kind: 'bi', value: { bn: 'ছেলে / ছেলেরা', en: 'boy / boys' } }],
            [{ kind: 'ar-t', ar: 'قَلَم', t: 'qalam' }, { kind: 'ar-t', ar: 'أَقْلَام', t: 'aqlām' }, { kind: 'bi', value: { bn: 'কলম / কলমগুলো', en: 'pen / pens' } }],
          ],
        },
      ],
    },
    {
      id: 'iraab',
      heading: { bn: 'কেস চিহ্ন (الإعراب al-iʿrāb)', en: 'Case endings (al-iʿrāb)' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'আরবিতে বিশেষ্যের ব্যাকরণিক ভূমিকা বোঝানো হয় শব্দের শেষে বসা স্বর দিয়ে। ইংরেজিতে word order কাজটা করে; আরবিতে করে ending—তাই word order অনেকটাই flexible।',
            en: 'Arabic marks a noun’s grammatical role with a vowel on its final letter. English uses word order for the same job; Arabic uses endings, which is why word order can flex.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'কেস', en: 'Case' },
            { bn: 'আরবি নাম', en: 'Arabic' },
            { bn: 'নির্দিষ্ট শেষ', en: 'Definite' },
            { bn: 'অনির্দিষ্ট শেষ', en: 'Indefinite' },
            { bn: 'ব্যবহার', en: 'Used for' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: 'কর্তৃবাচক (Nominative)', en: 'Nominative' } },
              { kind: 'ar-t', ar: 'رَفْع', t: 'rafʿ' },
              { kind: 'ar', value: '-u ( ُ )' },
              { kind: 'ar', value: '-un ( ٌ )' },
              { kind: 'bi', value: { bn: 'কর্তা, বিধেয়', en: 'subject, predicate' } },
            ],
            [
              { kind: 'bi', value: { bn: 'কর্মবাচক (Accusative)', en: 'Accusative' } },
              { kind: 'ar-t', ar: 'نَصْب', t: 'naṣb' },
              { kind: 'ar', value: '-a ( َ )' },
              { kind: 'ar', value: '-an ( ً )' },
              { kind: 'bi', value: { bn: 'সরাসরি কর্ম, ক্রিয়াবিশেষণ', en: 'direct object, adverbs' } },
            ],
            [
              { kind: 'bi', value: { bn: 'সম্বন্ধপদ (Genitive)', en: 'Genitive' } },
              { kind: 'ar-t', ar: 'جَرّ', t: 'jarr' },
              { kind: 'ar', value: '-i ( ِ )' },
              { kind: 'ar', value: '-in ( ٍ )' },
              { kind: 'bi', value: { bn: 'অব্যয়ের পরে, ইদাফার দ্বিতীয় অংশ', en: 'after prepositions, second part of iḍāfa' } },
            ],
          ],
        },
        {
          kind: 'widget',
          widget: 'case-flipper',
        },
        {
          kind: 'callout',
          tone: 'gotcha',
          text: {
            bn: 'কথ্য আরবিতে এই শেষগুলো বাদ পড়ে, আধুনিক লেখায়ও কম লেখা হয়। তবু জানতে হবে—কারণ এটা দিয়েই বাক্য ঠিকমতো পার্স হয়, আর সংবাদ পাঠ ও তিলাওয়াতে এগুলো আজো উচ্চারিত হয়।',
            en: 'Everyday speech drops these endings and modern texts rarely write them. You still need to know them — they’re how you parse a sentence, and they’re always pronounced in formal recitation, news, and poetry.',
          },
        },
      ],
    },
  ],
};
