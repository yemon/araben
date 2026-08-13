import type { GrammarPart } from '../types';

export const partReference: GrammarPart = {
  slug: 'quick-reference',
  order: 12,
  eyebrow: { bn: 'সংক্ষেপে', en: 'Quick reference' },
  title: {
    bn: 'পুরো ব্যাকরণ এক পাতায়',
    en: 'The whole grammar on one page',
  },
  lead: {
    bn: 'পড়া শেষ হলে এই পাতাটাই তোমার cheat sheet—কোনটা কোথায়, দ্রুত মনে করানোর জন্য।',
    en: 'When you’ve read through, this page becomes your cheat sheet — quick reminders for everything.',
  },
  keywords: ['cheat sheet', 'summary', 'reference'],
  sections: [
    {
      id: 'sentence-types',
      heading: { bn: 'বাক্যের ধরন', en: 'Sentence types' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: '**নামবাচক:** বিশেষ্য + বিশেষ্য, দুটোই কর্তৃবাচকে, কোনো "is" নেই।\n**ক্রিয়াবাচক:** ক্রিয়া + কর্তা (কর্তৃবাচকে) + কর্ম (কর্মবাচকে)।',
            en: '**Nominal:** noun + noun, both nominative, no "is".\n**Verbal:** verb + doer (nominative) + object (accusative).',
          },
        },
      ],
    },
    {
      id: 'cases',
      heading: { bn: 'তিনটি কেস', en: 'Three cases' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: '-u কর্তৃবাচক: কর্তা, বিধেয়।\n-a কর্মবাচক: কর্ম, ইন্না-র পরে, কানার খবর।\n-i সম্বন্ধপদ: অব্যয়ের পরে, ইদাফার দ্বিতীয় অংশ।',
            en: '-u nominative: subject, predicate.\n-a accusative: object, after inna, khabar of kāna.\n-i genitive: after prepositions, second term of iḍāfa.',
          },
        },
      ],
    },
    {
      id: 'rules',
      heading: { bn: 'সুবর্ণ নিয়ম', en: 'Golden rules' },
      blocks: [
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'বিশেষণ', en: 'Adjective' },
          text: {
            bn: 'বিশেষ্যের পরে বসে, লিঙ্গ-বচন-কেস-নির্দিষ্টতা—চারটাতেই মিলে।',
            en: 'Follows the noun; matches in gender, number, case, and definiteness.',
          },
        },
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'ইদাফা', en: 'Iḍāfa' },
          text: {
            bn: 'প্রথম বিশেষ্য খালি (ال ও তানউইন নেই), দ্বিতীয় বিশেষ্য সম্বন্ধপদে, মাঝে কিছুই না।',
            en: 'First noun bare, second noun genitive, nothing between them.',
          },
        },
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'অ-মানব বহুবচন', en: 'Non-human plurals' },
          text: {
            bn: 'বিশেষণ ও সর্বনামে স্ত্রী-একবচন-এর মিল নেয়।',
            en: 'Take feminine singular agreement in adjectives and pronouns.',
          },
        },
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'ক্রিয়ার agreement', en: 'Verb agreement' },
          text: {
            bn: 'ক্রিয়া কর্তার আগে বসলে একবচনই থাকবে।',
            en: 'Verb before subject stays singular.',
          },
        },
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'কেস-ফ্লিপার', en: 'Case-flippers' },
          text: {
            bn: 'কানা → বিধেয় কর্মবাচকে। ইন্না → কর্তা কর্মবাচকে।',
            en: 'Kāna makes the predicate accusative. Inna makes the subject accusative.',
          },
        },
        {
          kind: 'callout',
          tone: 'rule',
          title: { bn: 'না-বাচক', en: 'Negators' },
          text: {
            bn: 'lā (বর্তমান), mā / lam (অতীত), lan (ভবিষ্যৎ), laysa (নামবাচক)।',
            en: 'lā (present), mā / lam (past), lan (future), laysa (nominal).',
          },
        },
      ],
    },
  ],
};
