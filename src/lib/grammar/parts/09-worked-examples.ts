import type { GrammarPart } from '../types';

export const partWorkedExamples: GrammarPart = {
  slug: 'worked-examples',
  order: 9,
  eyebrow: { bn: 'হাতে-কলমে', en: 'Worked examples' },
  title: {
    bn: 'পুরো বাক্য শব্দে শব্দে বিশ্লেষণ',
    en: 'Sentences broken open, word by word',
  },
  lead: {
    bn: 'তিনটা বাক্য—নামবাচক, ক্রিয়াবাচক ইদাফা সহ, আর কানা দিয়ে না-বাচক। প্রতিটি শব্দে ক্লিক করে দেখো তার ভূমিকা, কেস, আর কেন।',
    en: 'Three sentences — nominal, verbal with iḍāfa, and negated with kāna. Tap each word to see its role, its case, and why.',
  },
  keywords: ['parsing', 'iʿrāb', 'example sentences'],
  sections: [
    {
      id: 'example-1',
      heading: { bn: 'উদাহরণ ১: নামবাচক', en: 'Example 1: Nominal' },
      blocks: [
        {
          kind: 'widget',
          widget: 'sentence-parser',
          props: {
            sentence: 'الطَّالِبُ الْجَدِيدُ فِي الْمَكْتَبَةِ',
            translit: 'aṭ-ṭālibu l-jadīdu fī l-maktabati',
            english: 'The new student is in the library.',
            bangla: 'নতুন ছাত্রটি লাইব্রেরিতে।',
            words: [
              {
                arabic: 'الطَّالِبُ',
                translit: 'aṭ-ṭālibu',
                english: 'the student',
                bangla: 'ছাত্রটি',
                role: { bn: 'মুবতাদা', en: 'mubtadaʾ (subject)' },
                caseNote: { bn: 'কর্তৃবাচকে -u; নামবাচক বাক্যের কর্তা', en: 'Nominative -u; subject of a nominal sentence' },
              },
              {
                arabic: 'الْجَدِيدُ',
                translit: 'al-jadīdu',
                english: 'the new',
                bangla: 'নতুন',
                role: { bn: 'বিশেষণ', en: 'Adjective' },
                caseNote: { bn: 'বিশেষ্যের সাথে চার-দিকে মিল', en: 'Matches its noun in all four ways' },
              },
              {
                arabic: 'فِي',
                translit: 'fī',
                english: 'in',
                bangla: 'ভেতরে',
                role: { bn: 'অব্যয়', en: 'Preposition' },
                caseNote: { bn: 'পরের বিশেষ্যকে সম্বন্ধপদে ঠেলে দেয়', en: 'Forces the following noun into the genitive' },
              },
              {
                arabic: 'الْمَكْتَبَةِ',
                translit: 'al-maktabati',
                english: 'the library',
                bangla: 'লাইব্রেরি',
                role: { bn: 'অব্যয়ের কর্ম', en: 'Object of preposition' },
                caseNote: { bn: 'সম্বন্ধপদে -i, فِي এর কারণে', en: 'Genitive -i, forced by فِي' },
              },
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'এখানে বিধেয় হলো পুরো "فِي الْمَكْتَبَةِ" phrase—একটা অব্যয়-phrase-ই খবর হতে পারে।',
            en: 'Here the predicate is the whole prepositional phrase "فِي الْمَكْتَبَةِ" — a preposition phrase can serve as khabar.',
          },
        },
      ],
    },
    {
      id: 'example-2',
      heading: { bn: 'উদাহরণ ২: ক্রিয়াবাচক + ইদাফা', en: 'Example 2: Verbal + iḍāfa' },
      blocks: [
        {
          kind: 'widget',
          widget: 'sentence-parser',
          props: {
            sentence: 'قَرَأَ الطَّالِبُ كِتَابَ الْمُعَلِّمِ',
            translit: 'qaraʾa ṭ-ṭālibu kitāba l-muʿallimi',
            english: "The student read the teacher's book.",
            bangla: 'ছাত্রটি শিক্ষকের বই পড়েছে।',
            words: [
              {
                arabic: 'قَرَأَ',
                translit: 'qaraʾa',
                english: 'he read',
                bangla: 'পড়ল',
                role: { bn: 'ক্রিয়া (অতীত)', en: 'Verb (past)' },
                caseNote: { bn: 'ক্রিয়াবাচক বাক্য শুরু করে', en: 'Opens a verbal sentence' },
              },
              {
                arabic: 'الطَّالِبُ',
                translit: 'aṭ-ṭālibu',
                english: 'the student',
                bangla: 'ছাত্রটি',
                role: { bn: 'কর্তা (fāʿil)', en: 'Doer (fāʿil)' },
                caseNote: { bn: 'কর্তৃবাচকে -u', en: 'Nominative -u — the doer' },
              },
              {
                arabic: 'كِتَابَ',
                translit: 'kitāba',
                english: 'book (of)',
                bangla: 'বই',
                role: { bn: 'কর্ম + মুদাফ', en: 'Object + muḍāf' },
                caseNote: { bn: 'কর্মবাচকে -a; ইদাফার প্রথম অংশ, তাই ال ও তানউইন নেই', en: 'Accusative -a; first term of iḍāfa — no الـ, no tanwīn' },
              },
              {
                arabic: 'الْمُعَلِّمِ',
                translit: 'al-muʿallimi',
                english: "the teacher's",
                bangla: 'শিক্ষকের',
                role: { bn: 'মুদাফ ইলাইহি', en: 'muḍāf ilayhi' },
                caseNote: { bn: 'সবসময় সম্বন্ধপদে -i', en: 'Always genitive -i' },
              },
            ],
          },
        },
      ],
    },
    {
      id: 'example-3',
      heading: { bn: 'উদাহরণ ৩: Kāna দিয়ে না-বাচক', en: 'Example 3: Negated with kāna' },
      blocks: [
        {
          kind: 'widget',
          widget: 'sentence-parser',
          props: {
            sentence: 'لَمْ يَكُنِ الْبَيْتُ الْقَدِيمُ كَبِيرًا',
            translit: 'lam yakuni l-baytu l-qadīmu kabīran',
            english: 'The old house was not big.',
            bangla: 'পুরনো বাড়িটা বড় ছিল না।',
            words: [
              {
                arabic: 'لَمْ',
                translit: 'lam',
                english: 'did not',
                bangla: 'নি',
                role: { bn: 'না-বাচক', en: 'Negator' },
                caseNote: { bn: 'জুস্‌সুম-এ ঠেলে দেয়', en: 'Forces jussive' },
              },
              {
                arabic: 'يَكُنْ',
                translit: 'yakun',
                english: 'was',
                bangla: 'ছিল',
                role: { bn: 'কানা (জুস্‌সুম বর্তমান)', en: 'kāna in jussive present' },
                caseNote: { bn: 'لَمْ এর জন্য অতীতের অর্থে ব্যবহৃত', en: 'Means "was" because of لَمْ' },
              },
              {
                arabic: 'الْبَيْتُ',
                translit: 'al-baytu',
                english: 'the house',
                bangla: 'বাড়িটা',
                role: { bn: 'ইসম কানা', en: 'ism kāna' },
                caseNote: { bn: 'কর্তৃবাচকেই থাকে', en: 'Stays nominative' },
              },
              {
                arabic: 'الْقَدِيمُ',
                translit: 'al-qadīmu',
                english: 'the old',
                bangla: 'পুরনো',
                role: { bn: 'বিশেষণ', en: 'Adjective' },
                caseNote: { bn: 'তার বিশেষ্যের সাথে কর্তৃবাচকে', en: 'Follows its noun into the nominative' },
              },
              {
                arabic: 'كَبِيرًا',
                translit: 'kabīran',
                english: 'big',
                bangla: 'বড়',
                role: { bn: 'খবর কানা', en: 'khabar kāna' },
                caseNote: { bn: 'কানার কারণে কর্মবাচকে', en: 'Accusative — pushed there by kāna' },
              },
            ],
          },
        },
      ],
    },
  ],
};
