import type { GrammarPart } from '../types';

export const partSentenceTypes: GrammarPart = {
  slug: 'sentence-types',
  order: 2,
  eyebrow: { bn: 'বাক্য গঠনের হৃদয়', en: 'Heart of the language' },
  title: {
    bn: 'দুই ধরনের বাক্য: নামবাচক ও ক্রিয়াবাচক',
    en: 'The two sentence types: nominal and verbal',
  },
  lead: {
    bn: 'প্রতিটি আরবি বাক্য দুইয়ের একটা—নামবাচক (nominal) অথবা ক্রিয়াবাচক (verbal)। কোনটা, সেটা ঠিক করে বাক্যের প্রথম শব্দ।',
    en: 'Every Arabic sentence is one of two kinds — nominal or verbal — and which one is decided by the first word.',
  },
  keywords: ['nominal sentence', 'verbal sentence', 'mubtada', 'khabar', 'fāʿil'],
  sections: [
    {
      id: 'nominal',
      heading: {
        bn: 'নামবাচক বাক্য (الجُمْلَة الاِسْمِيَّة)',
        en: 'The nominal sentence (al-jumla al-ismiyya)',
      },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'যে বাক্য বিশেষ্য দিয়ে শুরু হয়। দুইটি অংশ থাকে: মুবতাদা (কর্তা) আর খবর (বিধেয়)—দুটোই কর্তৃবাচকে (nominative)।',
            en: 'A sentence that begins with a noun. It has two parts: the mubtadaʾ (subject) and the khabar (predicate) — both nominative.',
          },
        },
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'সবচেয়ে জরুরি নিয়ম', en: 'The critical rule' },
          text: {
            bn: 'বর্তমান কালে "is / am / are" বলে কিছু নেই। দুইটি বিশেষ্য পাশাপাশি বসিয়ে দিলে "is" অটোমেটিক বোঝা যায়।',
            en: 'There is no verb "to be" in the present tense. Just place two nouns side by side and the "is" is understood.',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'الْبَيْتُ كَبِيرٌ', transliteration: 'al-baytu kabīrun', english: 'The house is big.', bangla: 'বাড়িটা বড়।' },
            { arabic: 'الطَّالِبُ مُجْتَهِدٌ', transliteration: 'aṭ-ṭālibu mujtahidun', english: 'The student is hardworking.', bangla: 'ছাত্রটা পরিশ্রমী।' },
            { arabic: 'مُحَمَّدٌ مُهَنْدِسٌ', transliteration: 'Muḥammadun muhandisun', english: 'Muhammad is an engineer.', bangla: 'মুহাম্মদ একজন প্রকৌশলী।' },
            { arabic: 'أَنَا مِنْ بَنْغْلَادِيش', transliteration: 'anā min Bānglādīsh', english: 'I am from Bangladesh.', bangla: 'আমি বাংলাদেশের।' },
            { arabic: 'هُوَ فِي الْمَكْتَبِ', transliteration: 'huwa fī l-maktabi', english: 'He is in the office.', bangla: 'সে অফিসে আছে।' },
          ],
        },
        {
          kind: 'prose',
          text: {
            bn: 'সাধারণ প্যাটার্ন: **নির্দিষ্ট কর্তা + অনির্দিষ্ট বিধেয়**। এই বৈসাদৃশ্যই সংকেত দেয় "X হলো Y", "the Y X" নয়।',
            en: 'The usual pattern is **definite subject + indefinite predicate**. That contrast is the signal that says "X is Y" rather than "the Y X".',
          },
        },
        {
          kind: 'callout',
          tone: 'gotcha',
          title: { bn: 'যেটাতে সবাই ধরা খায়', en: 'The classic trap' },
          text: {
            bn: 'নির্দিষ্ট + অনির্দিষ্ট = বাক্য। নির্দিষ্ট + নির্দিষ্ট = phrase, বাক্য নয়। অনির্দিষ্ট + অনির্দিষ্ট = phrase।',
            en: 'Definite + indefinite = a sentence. Definite + definite = a phrase, not a sentence. Indefinite + indefinite = a phrase.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'আরবি', en: 'Arabic' },
            { bn: 'অর্থ', en: 'Meaning' },
            { bn: 'কেন', en: 'Why' },
          ],
          rows: [
            [{ kind: 'ar-t', ar: 'الْبَيْتُ كَبِيرٌ', t: 'al-baytu kabīrun' }, { kind: 'bi', value: { bn: 'বাড়িটা বড়।', en: 'The house is big.' } }, { kind: 'bi', value: { bn: 'নির্দিষ্ট + অনির্দিষ্ট = বাক্য', en: 'definite + indefinite = sentence' } }],
            [{ kind: 'ar-t', ar: 'الْبَيْتُ الْكَبِيرُ', t: 'al-baytu l-kabīru' }, { kind: 'bi', value: { bn: 'বড় বাড়িটা', en: 'the big house' } }, { kind: 'bi', value: { bn: 'নির্দিষ্ট + নির্দিষ্ট = phrase', en: 'definite + definite = phrase' } }],
            [{ kind: 'ar-t', ar: 'بَيْتٌ كَبِيرٌ', t: 'baytun kabīrun' }, { kind: 'bi', value: { bn: 'একটি বড় বাড়ি', en: 'a big house' } }, { kind: 'bi', value: { bn: 'অনির্দিষ্ট + অনির্দিষ্ট = phrase', en: 'indefinite + indefinite = phrase' } }],
          ],
        },
      ],
    },
    {
      id: 'verbal',
      heading: {
        bn: 'ক্রিয়াবাচক বাক্য (الجُمْلَة الفِعْلِيَّة)',
        en: 'The verbal sentence (al-jumla al-fiʿliyya)',
      },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'যে বাক্য ক্রিয়া দিয়ে শুরু হয়। ডিফল্ট ক্রম: **ক্রিয়া – কর্তা – কর্ম** (V-S-O)।',
            en: 'A sentence that begins with a verb. The default order is **Verb – Subject – Object** (V-S-O).',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'كَتَبَ الْوَلَدُ الدَّرْسَ', transliteration: 'kataba l-waladu d-darsa', english: 'The boy wrote the lesson.', bangla: 'ছেলেটি পাঠ লিখেছে।' },
            { arabic: 'قَرَأَ الطَّالِبُ الْكِتَابَ', transliteration: 'qaraʾa ṭ-ṭālibu l-kitāba', english: 'The student read the book.', bangla: 'ছাত্রটি বইটি পড়েছে।' },
            { arabic: 'ذَهَبَ مُحَمَّدٌ إِلَى الْمَدْرَسَةِ', transliteration: 'dhahaba Muḥammadun ilā l-madrasati', english: 'Muhammad went to the school.', bangla: 'মুহাম্মদ স্কুলে গেছেন।' },
          ],
        },
        {
          kind: 'widget',
          widget: 'sentence-parser',
          props: {
            sentence: 'قَرَأَ الطَّالِبُ كِتَابَ الْمُعَلِّمِ',
            translit: 'qaraʾa ṭ-ṭālibu kitāba l-muʿallimi',
            english: 'The student read the teacher’s book.',
            bangla: 'ছাত্রটি শিক্ষকের বই পড়েছে।',
            words: [
              {
                arabic: 'قَرَأَ',
                translit: 'qaraʾa',
                english: 'read (he)',
                bangla: 'পড়ল',
                role: { bn: 'ক্রিয়া (fiʿl)', en: 'Verb (fiʿl)' },
                caseNote: { bn: 'অতীত কাল; ক্রিয়াবাচক বাক্য শুরু করে', en: 'Past tense; opens a verbal sentence' },
              },
              {
                arabic: 'الطَّالِبُ',
                translit: 'aṭ-ṭālibu',
                english: 'the student',
                bangla: 'ছাত্রটি',
                role: { bn: 'কর্তা (fāʿil)', en: 'Doer (fāʿil)' },
                caseNote: { bn: 'কর্তৃবাচকে (-u)', en: 'Nominative (-u) — the doer of the action' },
              },
              {
                arabic: 'كِتَابَ',
                translit: 'kitāba',
                english: 'book (of)',
                bangla: 'বই',
                role: { bn: 'কর্ম + মুদাফ', en: 'Object + first term of iḍāfa' },
                caseNote: { bn: 'কর্মবাচকে (-a); ইদাফার প্রথম অংশ, তাই ال ও তানউইন নেই', en: 'Accusative (-a); first term of iḍāfa, so no الـ and no tanwīn' },
              },
              {
                arabic: 'الْمُعَلِّمِ',
                translit: 'al-muʿallimi',
                english: 'the teacher’s',
                bangla: 'শিক্ষকের',
                role: { bn: 'মুদাফ ইলাইহি', en: 'muḍāf ilayhi' },
                caseNote: { bn: 'সবসময় সম্বন্ধপদে (-i)', en: 'Always genitive (-i)' },
              },
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: { bn: 'ছোট্ট কৌশল', en: 'A neat trick' },
          text: {
            bn: 'শব্দ-শেষের স্বরই ইংরেজির word-order-এর কাজটা করে। الْوَلَدُ = -u মানে কর্তা; الدَّرْسَ = -a মানে কর্ম। শব্দ ওলটপালট করলেও অর্থ একই থাকবে যদি শেষগুলো ঠিক থাকে।',
            en: 'The final vowels do the job English does with position. الْوَلَدُ carries -u so it must be the doer; الدَّرْسَ carries -a so it must be the object. Rearrange the words and the meaning stays the same as long as the endings do.',
          },
        },
      ],
    },
    {
      id: 'agreement',
      heading: { bn: 'যে agreement-এর নিয়ম সবাইকে চমকে দেয়', en: 'The agreement rule that surprises everyone' },
      blocks: [
        {
          kind: 'callout',
          tone: 'rule',
          text: {
            bn: 'ক্রিয়া যখন কর্তার আগে বসে, তখন ক্রিয়া থাকে **একবচনে**। শুধু লিঙ্গ মিলে।',
            en: 'When the verb comes **before** the subject, the verb stays **singular**. It only agrees in gender.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'আরবি', en: 'Arabic' },
            { bn: 'অর্থ', en: 'Meaning' },
            { bn: 'নোট', en: 'Note' },
          ],
          rows: [
            [{ kind: 'ar-t', ar: 'ذَهَبَ الْأَوْلَادُ', t: 'dhahaba l-awlādu' }, { kind: 'bi', value: { bn: 'ছেলেরা গিয়েছে।', en: 'The boys went.' } }, { kind: 'bi', value: { bn: 'ক্রিয়া একবচন, কর্তা বহুবচন', en: 'Verb singular, subject plural' } }],
            [{ kind: 'ar-t', ar: 'ذَهَبَتِ الْبَنَاتُ', t: 'dhahabati l-banātu' }, { kind: 'bi', value: { bn: 'মেয়েরা গিয়েছে।', en: 'The girls went.' } }, { kind: 'bi', value: { bn: 'ক্রিয়া একবচন স্ত্রীলিঙ্গ', en: 'Verb singular feminine' } }],
            [{ kind: 'ar-t', ar: 'الْأَوْلَادُ ذَهَبُوا', t: 'al-awlādu dhahabū' }, { kind: 'bi', value: { bn: 'ছেলেরা গিয়েছে।', en: 'The boys went.' } }, { kind: 'bi', value: { bn: 'কর্তা আগে; তাই এবার ক্রিয়া বহুবচন', en: 'Subject first, so now verb is plural' } }],
          ],
        },
      ],
    },
    {
      id: 'compare',
      heading: { bn: 'তুলনা করে দেখো', en: 'See them side by side' },
      blocks: [
        {
          kind: 'widget',
          widget: 'nominal-vs-verbal',
        },
        {
          kind: 'prose',
          text: {
            bn: 'দুটোই সঠিক। পার্থক্য শুধু জোরের—ক্রিয়াবাচক বাক্য নিরপেক্ষ, কর্মে ফোকাস; নামবাচক বাক্য বিষয়ে ফোকাস, বর্ণনায় বেশি ব্যবহৃত।',
            en: 'Both are correct — the difference is emphasis. Verbal is neutral and action-focused (default in narrative and news). Nominal is topic-focused, used to describe states or foreground the subject.',
          },
        },
      ],
    },
  ],
};
