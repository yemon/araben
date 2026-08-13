import type { GrammarPart } from '../types';

export const partLearningSequence: GrammarPart = {
  slug: 'learning-sequence',
  order: 11,
  eyebrow: { bn: 'ধাপে ধাপে', en: 'A learning path' },
  title: {
    bn: 'বাস্তব শেখার ক্রম',
    en: 'A practical learning sequence',
  },
  lead: {
    bn: 'এক নজরে বারো ধাপ। ধাপে ধাপে এগোতে পারলে বছর ঘুরতে না ঘুরতেই সাধারণ আরবি লেখা পড়তে পারবে।',
    en: 'Twelve stages at a glance. Follow this and, over a year, unvowelled prose will start to feel readable.',
  },
  keywords: ['learning path', 'study plan'],
  sections: [
    {
      id: 'stages',
      heading: { bn: 'বারো ধাপ', en: 'Twelve stages' },
      blocks: [
        {
          kind: 'table',
          headers: [
            { bn: 'ধাপ', en: 'Stage' },
            { bn: 'কী শিখবে', en: 'Focus' },
            { bn: 'লক্ষ্য', en: 'Rough goal' },
          ],
          rows: [
            ['1', { kind: 'bi', value: { bn: 'লিপি ও ধ্বনি', en: 'Script and sounds' } }, { kind: 'bi', value: { bn: 'হারাকাতসহ যেকোনো লেখা জোরে পড়া—বুঝ্‌ন ছাড়াই', en: 'Read any vowelled text aloud, even without understanding' } }],
            ['2', { kind: 'bi', value: { bn: '১৫০-২০০ বিশেষ্য (বহুবচনসহ)', en: '150–200 core nouns with plurals' } }, { kind: 'bi', value: { bn: 'বাক্য বানানোর মশলা জোগাড়', en: 'Enough material to build with' } }],
            ['3', { kind: 'bi', value: { bn: 'নামবাচক বাক্য', en: 'Nominal sentences' } }, { kind: 'bi', value: { bn: 'বর্ণনা: X হলো Y, X-এর মধ্যে Y', en: 'Describe things: X is Y, X is in Y' } }],
            ['4', { kind: 'bi', value: { bn: 'বিশেষণ ও চার-দিকী মিল', en: 'Adjectives and the four agreements' } }, { kind: 'bi', value: { bn: 'নির্ভুল noun-phrase', en: 'Build accurate noun phrases' } }],
            ['5', { kind: 'bi', value: { bn: 'ইদাফা', en: 'Iḍāfa' } }, { kind: 'bi', value: { bn: 'অধিকার ও সম্পর্ক', en: 'Express possession and relationships' } }],
            ['6', { kind: 'bi', value: { bn: 'সর্বনাম—স্বতন্ত্র ও যুক্ত', en: 'Pronouns, both kinds' } }, { kind: 'bi', value: { bn: '"আমার, তোমার, তার" আর "আমার আছে"', en: 'Say my, your, his, and "I have"' } }],
            ['7', { kind: 'bi', value: { bn: 'সাউন্ড ক্রিয়ার বর্তমান', en: 'Present tense of sound verbs' } }, { kind: 'bi', value: { bn: 'রুটিন ও চলমান কাজ', en: 'Talk about routine and ongoing action' } }],
            ['8', { kind: 'bi', value: { bn: 'অতীত ক্রিয়া', en: 'Past tense' } }, { kind: 'bi', value: { bn: 'বর্ণনা করা', en: 'Narrate' } }],
            ['9', { kind: 'bi', value: { bn: 'না-বাচক ও প্রশ্ন', en: 'Negation and questions' } }, { kind: 'bi', value: { bn: 'সাধারণ কথাবার্তা', en: 'Hold a basic exchange' } }],
            ['10', { kind: 'bi', value: { bn: 'Kāna ও Inna পরিবার', en: 'Kāna and Inna families' } }, { kind: 'bi', value: { bn: 'হারাবার আগেই বাস্তব লেখা পড়া', en: 'Read real sentences without getting lost' } }],
            ['11', { kind: 'bi', value: { bn: 'Verb Forms II থেকে X', en: 'Verb Forms II–X' } }, { kind: 'bi', value: { bn: 'শব্দভাণ্ডার নিজে নিজে বাড়ে', en: 'Vocabulary starts expanding on its own' } }],
            ['12', { kind: 'bi', value: { bn: 'দুর্বল ক্রিয়া, কর্মবাচ্য, পূর্ণ ইরাব', en: 'Weak verbs, passive, full iʿrāb' } }, { kind: 'bi', value: { bn: 'সাবলীল পড়ার দ্বারপ্রান্ত', en: 'Approach fluent reading' } }],
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: { bn: 'দুইটি অভ্যাস, বাকি সব কিছুর চেয়ে বেশি ফল দেয়', en: 'Two habits worth more than anything else' },
          text: {
            bn: '১) প্রতিটি বিশেষ্য শিখো তার বহুবচনসহ, প্রতিটি ক্রিয়া শিখো তার বর্তমান-রূপসহ। ইনপুটের সময় বাড়তি ৩০ সেকেন্ড, পরে ঘণ্টার পর ঘণ্টা বাঁচাবে।\n২) হারাকাত-সহ লেখা প্রতিদিন জোরে পড়ো—বুঝ্‌ন না আসলেও। প্যাটার্ন-চেনা এভাবেই আসে, আর সেটাই হারাকাত-হীন লেখা পড়ার চাবি।',
            en: '(1) Learn every noun with its plural and every verb with its present form. The extra 30 seconds at input time saves hours later.\n(2) Read vowelled text aloud daily, even before you understand it. Pattern recognition is what eventually unlocks unvowelled reading, and it only develops through exposure.',
          },
        },
      ],
    },
  ],
};
