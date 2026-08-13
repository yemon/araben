import type { GrammarPart } from '../types';

export const partVerbs: GrammarPart = {
  slug: 'verbs',
  order: 5,
  eyebrow: { bn: 'ক্রিয়া সিস্টেম', en: 'Verb system' },
  title: {
    bn: 'ক্রিয়া: অতীত, বর্তমান, আদেশ ও দশ Form',
    en: 'Verbs: past, present, imperative, and the ten Forms',
  },
  lead: {
    bn: 'ইংরেজির চেয়ে আরবি ক্রিয়ার কাল কম, কিন্তু ভেতরে কর্তার লিঙ্গ-বচন-পুরুষ সব লেখা থাকে। শিখলে অর্ধেক বাক্য এমনিতেই বাঁচে।',
    en: 'Arabic has fewer tenses than English, but every verb encodes person, gender, and number inside itself. Once these patterns land, half of every sentence writes itself.',
  },
  keywords: ['verbs', 'past tense', 'present tense', 'forms', 'awzān'],
  sections: [
    {
      id: 'three-forms',
      heading: { bn: 'তিনটি মৌলিক রূপ', en: 'Three basic forms' },
      blocks: [
        {
          kind: 'table',
          headers: [
            { bn: 'রূপ', en: 'Form' },
            { bn: 'আরবি নাম', en: 'Arabic name' },
            { bn: 'কাজ', en: 'Function' },
            { bn: 'উদাহরণ', en: 'Example' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: 'অতীত', en: 'Past' } },
              { kind: 'ar-t', ar: 'الماضي', t: 'al-māḍī' },
              { kind: 'bi', value: { bn: 'সম্পন্ন কাজ', en: 'completed action' } },
              { kind: 'ar-t', ar: 'كَتَبَ', t: 'kataba', gloss: { bn: 'সে লিখেছে', en: 'he wrote' } },
            ],
            [
              { kind: 'bi', value: { bn: 'বর্তমান', en: 'Present' } },
              { kind: 'ar-t', ar: 'المضارع', t: 'al-muḍāriʿ' },
              { kind: 'bi', value: { bn: 'চলমান বা বর্তমান', en: 'present / ongoing' } },
              { kind: 'ar-t', ar: 'يَكْتُبُ', t: 'yaktubu', gloss: { bn: 'সে লেখে', en: 'he writes' } },
            ],
            [
              { kind: 'bi', value: { bn: 'আদেশ', en: 'Imperative' } },
              { kind: 'ar-t', ar: 'الأمر', t: 'al-amr' },
              { kind: 'bi', value: { bn: 'হুকুম', en: 'command' } },
              { kind: 'ar-t', ar: 'اُكْتُبْ', t: 'uktub', gloss: { bn: 'লেখো!', en: 'write!' } },
            ],
          ],
        },
        {
          kind: 'prose',
          text: {
            bn: 'ভবিষ্যৎ = বর্তমান + prefix سَـ বা সাবধানে سَوْفَ। যেমন سَيَكْتُبُ = "সে লিখবে"।',
            en: 'Future is just the present with a prefix: سَـ (sa-) or سَوْفَ (sawfa). سَيَكْتُبُ = "he will write".',
          },
        },
      ],
    },
    {
      id: 'conjugation',
      heading: { bn: 'অতীত ও বর্তমানের সংযোজন', en: 'Past & present conjugation' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'অতীত: সব প্রত্যয়ের কাজ। বর্তমান: prefix + মাঝে মাঝে suffix। এই দুইটা ছক মুখস্থ করলে যেকোনো সাউন্ড ক্রিয়া চালাতে পারবে।',
            en: 'Past = suffixes. Present = prefixes with occasional suffixes. Nail these two tables and any sound verb bends to your will.',
          },
        },
        {
          kind: 'widget',
          widget: 'verb-conjugator',
          props: { root: 'k-t-b' },
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'ক্রিয়াই কে করছে সেটা বলে দেয়—তাই أَكْتُبُ একাই "আমি লিখি" মানে দাঁড়াবে। আলাদা أَنَا বসানো শুধুই জোর দেওয়ার জন্য।',
            en: 'Because the verb already encodes the person, you don’t need a separate pronoun. أَكْتُبُ on its own is a complete sentence meaning "I write". Adding أَنَا is emphasis.',
          },
        },
      ],
    },
    {
      id: 'moods',
      heading: { bn: 'বর্তমান ক্রিয়ার Mood', en: 'Present-tense moods' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'বর্তমান ক্রিয়ার শেষ স্বর বদলে যায় আগের শব্দের কারণে। তিনটি mood:',
            en: 'The present verb changes its final vowel depending on what precedes it. Three moods:',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'Mood', en: 'Mood' },
            { bn: 'আরবি', en: 'Arabic' },
            { bn: 'শেষ', en: 'Ending' },
            { bn: 'কে ট্রিগার করে', en: 'Triggered by' },
          ],
          rows: [
            [
              { kind: 'bi', value: { bn: 'নির্দেশক', en: 'Indicative' } },
              { kind: 'ar-t', ar: 'مَرْفُوع', t: 'marfūʿ' },
              '-u',
              { kind: 'bi', value: { bn: 'ডিফল্ট', en: 'default' } },
            ],
            [
              { kind: 'bi', value: { bn: 'অনুমতিসূচক', en: 'Subjunctive' } },
              { kind: 'ar-t', ar: 'مَنْصُوب', t: 'manṣūb' },
              '-a',
              { kind: 'ar-t', ar: 'أَنْ · لِـ · لَنْ · حَتَّى', t: 'an · li- · lan · ḥattā' },
            ],
            [
              { kind: 'bi', value: { bn: 'জুস্‌সুম', en: 'Jussive' } },
              { kind: 'ar-t', ar: 'مَجْزُوم', t: 'majzūm' },
              { kind: 'translit', value: 'sukūn' },
              { kind: 'ar-t', ar: 'لَمْ · لَا (নিষেধ) · শর্ত', t: 'lam · lā (nāhiya) · conditional' },
            ],
          ],
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'يَكْتُبُ', transliteration: 'yaktubu', english: 'he writes', bangla: 'সে লেখে' },
            { arabic: 'لَنْ يَكْتُبَ', transliteration: 'lan yaktuba', english: 'he will not write', bangla: 'সে লিখবে না' },
            { arabic: 'أُرِيدُ أَنْ أَكْتُبَ', transliteration: 'urīdu an aktuba', english: 'I want to write', bangla: 'আমি লিখতে চাই' },
            { arabic: 'لَمْ يَكْتُبْ', transliteration: 'lam yaktub', english: 'he did not write', bangla: 'সে লেখেনি' },
          ],
        },
      ],
    },
    {
      id: 'forms',
      heading: { bn: 'দশটি Form (الأَوْزَان)', en: 'The ten Forms (al-awzān)' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'একটি মূলকে দশটি প্রমাণিত ছাঁচে ঠেলে দিলে অর্থ ঘোরে—কার্যকরী, প্রতিফলক, পারস্পরিক, চাওয়া—প্রতিটির নির্দিষ্ট প্যাটার্ন। শুরুতে চেনা যথেষ্ট, পরে ব্যবহার আসবে।',
            en: 'A root can be pushed through ten established patterns — causative, reflexive, mutual, seeking, etc. — each with a predictable meaning shift. Recognise them now; use them later.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'Form', en: 'Form' },
            { bn: 'প্যাটার্ন', en: 'Pattern' },
            { bn: 'অর্থের ধরন', en: 'Typical meaning' },
            { bn: 'উদাহরণ (ع ل م)', en: 'Example (ʿ-l-m)' },
          ],
          rows: [
            ['I', { kind: 'ar-t', ar: 'فَعَلَ', t: 'faʿala' }, { kind: 'bi', value: { bn: 'মূল অর্থ', en: 'base meaning' } }, { kind: 'ar-t', ar: 'عَلِمَ', t: 'ʿalima', gloss: { bn: 'সে জানল', en: 'he knew' } }],
            ['II', { kind: 'ar-t', ar: 'فَعَّلَ', t: 'faʿʿala' }, { kind: 'bi', value: { bn: 'কারণসূচক / জোর', en: 'intensive / causative' } }, { kind: 'ar-t', ar: 'عَلَّمَ', t: 'ʿallama', gloss: { bn: 'সে শেখাল', en: 'he taught' } }],
            ['III', { kind: 'ar-t', ar: 'فَاعَلَ', t: 'fāʿala' }, { kind: 'bi', value: { bn: 'কারো সাথে কিছু করা', en: 'doing to someone' } }, { kind: 'ar-t', ar: 'قَاتَلَ', t: 'qātala', gloss: { bn: 'কারো সাথে যুদ্ধ করল', en: 'he fought (sb)' } }],
            ['IV', { kind: 'ar-t', ar: 'أَفْعَلَ', t: 'afʿala' }, { kind: 'bi', value: { bn: 'কারণসূচক', en: 'causative' } }, { kind: 'ar-t', ar: 'أَعْلَمَ', t: 'aʿlama', gloss: { bn: 'সে জানাল', en: 'he informed' } }],
            ['V', { kind: 'ar-t', ar: 'تَفَعَّلَ', t: 'tafaʿʿala' }, { kind: 'bi', value: { bn: 'II-এর প্রতিফলক', en: 'reflexive of II' } }, { kind: 'ar-t', ar: 'تَعَلَّمَ', t: 'taʿallama', gloss: { bn: 'সে শিখল', en: 'he learned' } }],
            ['VI', { kind: 'ar-t', ar: 'تَفَاعَلَ', t: 'tafāʿala' }, { kind: 'bi', value: { bn: 'পারস্পরিক', en: 'mutual' } }, { kind: 'ar-t', ar: 'تَعَاوَنَ', t: 'taʿāwana', gloss: { bn: 'তারা সহযোগিতা করল', en: 'they cooperated' } }],
            ['VII', { kind: 'ar-t', ar: 'اِنْفَعَلَ', t: 'infaʿala' }, { kind: 'bi', value: { bn: 'কর্মবাচ্য', en: 'passive/happening to' } }, { kind: 'ar-t', ar: 'اِنْكَسَرَ', t: 'inkasara', gloss: { bn: 'তা ভেঙে গেল', en: 'it broke' } }],
            ['VIII', { kind: 'ar-t', ar: 'اِفْتَعَلَ', t: 'iftaʿala' }, { kind: 'bi', value: { bn: 'প্রতিফলক (বিচিত্র)', en: 'reflexive (varied)' } }, { kind: 'ar-t', ar: 'اِجْتَمَعَ', t: 'ijtamaʿa', gloss: { bn: 'সে একত্র হলো', en: 'he gathered' } }],
            ['IX', { kind: 'ar-t', ar: 'اِفْعَلَّ', t: 'ifʿalla' }, { kind: 'bi', value: { bn: 'রং ও ত্রুটি', en: 'colours and defects' } }, { kind: 'ar-t', ar: 'اِحْمَرَّ', t: 'iḥmarra', gloss: { bn: 'তা লাল হলো', en: 'it turned red' } }],
            ['X', { kind: 'ar-t', ar: 'اِسْتَفْعَلَ', t: 'istafʿala' }, { kind: 'bi', value: { bn: 'চাওয়া, মনে করা', en: 'seeking / considering' } }, { kind: 'ar-t', ar: 'اِسْتَعْلَمَ', t: 'istaʿlama', gloss: { bn: 'সে তথ্য চাইল', en: 'he inquired' } }],
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          text: {
            bn: 'একটা কেসে كَتَبَ চেনা মানে اِسْتَكْتَبَ, مُكَاتَبَة এবং আরো এক ডজন শব্দে হাত পড়া। তাই forms শিখলে শব্দভাণ্ডার নিজে নিজে বাড়ে।',
            en: 'Knowing كَتَبَ gives you access to اِسْتَكْتَبَ, مُكَاتَبَة, and a dozen more. Learn the forms — your vocabulary starts multiplying on its own.',
          },
        },
      ],
    },
    {
      id: 'weak-verbs',
      heading: { bn: 'দুর্বল ক্রিয়া', en: 'Weak verbs' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'যে মূলে و, ي বা ء থাকে সেগুলো অস্বাভাবিক আচরণ করে—কারণ এই দুর্বল অক্ষরগুলো কিছু প্যাটার্নে সরে যায় বা উবে যায়। قَالَ (qāla, বলল) আসে ق و ل থেকে; وَجَدَ (found) তার و হারায় বর্তমানে: يَجِدُ। বাধা আসল, তবে পরের কথা—আগে সাউন্ড ক্রিয়া শিখো।',
            en: 'Roots containing و, ي, or ء behave irregularly, because those letters shift or vanish under certain patterns. قَالَ (qāla, he said) comes from ق و ل. وَجَدَ (he found) loses its و in the present: يَجِدُ. It’s a real hurdle — but a later one. Learn sound verbs first.',
          },
        },
      ],
    },
  ],
};
