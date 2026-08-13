import type { GrammarPart } from '../types';

export const partMistakes: GrammarPart = {
  slug: 'mistakes',
  order: 10,
  eyebrow: { bn: 'সাধারণ ভুল', en: 'Common mistakes' },
  title: {
    bn: 'শিক্ষার্থীর সাধারণ ভুল—আর সেগুলোর সমাধান',
    en: 'Mistakes beginners make — and how to fix them',
  },
  lead: {
    bn: 'প্রায় সবাই একই ভুলগুলো করে। আগে থেকে দেখে নিলে তোমার হবে না।',
    en: 'Almost every beginner hits the same set of walls. See them coming and step around them.',
  },
  keywords: ['common mistakes', 'grammar pitfalls'],
  sections: [
    {
      id: 'mistakes',
      heading: { bn: 'ভুলের তালিকা', en: 'The list' },
      blocks: [
        {
          kind: 'table',
          headers: [
            { bn: 'ভুল', en: 'Mistake' },
            { bn: 'কেন হয়', en: 'Why it happens' },
            { bn: 'সমাধান', en: 'Fix' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: '"is" খুঁজছ', en: 'Looking for "is"' } },
              { kind: 'bi', value: { bn: 'ইংরেজির অভ্যাস', en: 'English habit' } },
              { kind: 'bi', value: { bn: 'বর্তমান "to be" আরবিতে নেই—তেমনই থাকে', en: 'Present-tense "to be" simply does not exist' } },
            ],
            [
              { kind: 'bi', value: { bn: '"a / an" লিখছ', en: 'Writing "a" or "an"' } },
              { kind: 'bi', value: { bn: 'ইংরেজির অভ্যাস', en: 'English habit' } },
              { kind: 'bi', value: { bn: 'অনির্দিষ্টতা তানউইনে বোঝায়, নয়তো কিছুই না', en: 'Indefiniteness is shown by tanwīn or by nothing at all' } },
            ],
            [
              { kind: 'bi', value: { bn: 'বিশেষণ আগে বসাচ্ছ', en: 'Putting the adjective first' } },
              { kind: 'bi', value: { bn: 'ইংরেজি word order', en: 'English word order' } },
              { kind: 'bi', value: { bn: 'বিশেষণ সবসময় বিশেষ্যের পরে', en: 'Adjective always follows the noun' } },
            ],
            [
              { kind: 'bi', value: { bn: 'বলছ الْكِتَابُ الطَّالِبِ', en: 'Saying الْكِتَابُ الطَّالِبِ' } },
              { kind: 'bi', value: { bn: 'ইদাফা মিলিয়ে ফেলছ', en: 'Mixing up iḍāfa' } },
              { kind: 'bi', value: { bn: 'প্রথম অংশ থেকে ال ফেলে দাও: كِتَابُ الطَّالِبِ', en: 'Drop الـ from the first term: كِتَابُ الطَّالِبِ' } },
            ],
            [
              { kind: 'bi', value: { bn: 'কর্তা বহুবচন—তাই ক্রিয়াও বহুবচন করেছ', en: 'Making verb plural before a plural subject' } },
              { kind: 'bi', value: { bn: 'agreement এর ভুল প্রয়োগ', en: 'over-applying agreement' } },
              { kind: 'bi', value: { bn: 'ক্রিয়া কর্তার আগে বসলে একবচনই থাকবে', en: 'Verb before subject stays singular' } },
            ],
            [
              { kind: 'bi', value: { bn: 'বলছ الْكُتُبُ جَدِيدُونَ', en: 'الْكُتُبُ جَدِيدُونَ' } },
              { kind: 'bi', value: { bn: 'বইয়ের বহুবচনকে মানুষের মতো ধরছ', en: 'Treating book-plurals as human' } },
              { kind: 'bi', value: { bn: 'অ-মানব বহুবচন = স্ত্রী-একবচন: الْكُتُبُ الْجَدِيدَةُ', en: 'Non-human plurals take feminine singular: الْكُتُبُ الْجَدِيدَةُ' } },
            ],
            [
              { kind: 'bi', value: { bn: 'কেস চিহ্ন উপেক্ষা করছ', en: 'Ignoring case endings entirely' } },
              { kind: 'bi', value: { bn: 'বেশিরভাগ লেখায় ওগুলো অদৃশ্য', en: 'They’re invisible in most texts' } },
              { kind: 'bi', value: { bn: 'তবু শিখে রাখো—ambiguity সমাধানের চাবি', en: 'Learn them anyway; they resolve ambiguity' } },
            ],
            [
              { kind: 'bi', value: { bn: 'বহুবচন ছাড়া শব্দ শিখছ', en: 'Memorising words without their plural' } },
              { kind: 'bi', value: { bn: 'ভাঙা বহুবচন অনুমান-অসম্ভব', en: 'Broken plurals are unpredictable' } },
              { kind: 'bi', value: { bn: 'একবচন + বহুবচন একসাথে মুখস্থ করো', en: 'Always learn singular + plural as one unit' } },
            ],
            [
              { kind: 'bi', value: { bn: 'ক্রিয়ার বর্তমান-রূপ ছাড়া শিখছ', en: 'Learning a verb without its present form' } },
              { kind: 'bi', value: { bn: 'বর্তমানের স্বর অনুমান-অসম্ভব', en: 'The vowel is unpredictable' } },
              { kind: 'bi', value: { bn: 'كَتَبَ / يَكْتُبُ একসাথে শেখো', en: 'Learn كَتَبَ / يَكْتُبُ together' } },
            ],
          ],
        },
      ],
    },
  ],
};
