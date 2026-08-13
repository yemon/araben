import type { GrammarPart } from '../types';

export const partPronouns: GrammarPart = {
  slug: 'pronouns',
  order: 4,
  eyebrow: { bn: 'সর্বনাম', en: 'Pronouns' },
  title: {
    bn: 'সর্বনাম: স্বতন্ত্র ও যুক্ত',
    en: 'Pronouns: independent and attached',
  },
  lead: {
    bn: 'আরবিতে সর্বনাম দুই রকম—আলাদা শব্দ হিসেবে (أَنَا, هُوَ), আর প্রত্যয় হিসেবে বিশেষ্য/ক্রিয়া/অব্যয়ের শেষে জোড়া লাগে (كِتَابِي)। যুক্ত-সর্বনাম শিখলে "আমার, তোমার, তার" আর "আমাকে, তোমাকে, তাকে"—সবটাই ধরা।',
    en: "Arabic has two pronoun sets — independent words (أَنَا, هُوَ) and suffixes that attach to nouns, verbs and prepositions (كِتَابِي). Learn the attached set and you cover 'my/your/his' and 'me/you/him' at the same time.",
  },
  keywords: ['pronouns', 'attached pronouns', 'possessive'],
  sections: [
    {
      id: 'independent',
      heading: { bn: 'স্বতন্ত্র সর্বনাম', en: 'Independent pronouns' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'প্রধানত নামবাচক বাক্যের কর্তা হিসেবে, অথবা জোর দেওয়ার জন্য ব্যবহৃত হয়।',
            en: 'Used mainly as the subject of a nominal sentence, or for emphasis.',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'পুরুষ', en: 'Person' },
            { bn: 'আরবি', en: 'Arabic' },
            { bn: 'উচ্চারণ', en: 'Sound' },
            { bn: 'অর্থ', en: 'Meaning' },
          ],
          rows: [
            [{ kind: 'bi', value: { bn: '১ম একবচন', en: '1st sg' } }, { kind: 'ar', value: 'أَنَا' }, 'anā', { kind: 'bi', value: { bn: 'আমি', en: 'I' } }],
            [{ kind: 'bi', value: { bn: '২য় পুং.', en: '2nd sg m' } }, { kind: 'ar', value: 'أَنْتَ' }, 'anta', { kind: 'bi', value: { bn: 'তুমি (পুরুষ)', en: 'you (m)' } }],
            [{ kind: 'bi', value: { bn: '২য় স্ত্রী.', en: '2nd sg f' } }, { kind: 'ar', value: 'أَنْتِ' }, 'anti', { kind: 'bi', value: { bn: 'তুমি (নারী)', en: 'you (f)' } }],
            [{ kind: 'bi', value: { bn: '৩য় পুং.', en: '3rd sg m' } }, { kind: 'ar', value: 'هُوَ' }, 'huwa', { kind: 'bi', value: { bn: 'সে (পুরুষ)', en: 'he, it' } }],
            [{ kind: 'bi', value: { bn: '৩য় স্ত্রী.', en: '3rd sg f' } }, { kind: 'ar', value: 'هِيَ' }, 'hiya', { kind: 'bi', value: { bn: 'সে (নারী)', en: 'she, it' } }],
            [{ kind: 'bi', value: { bn: '১ম বহু.', en: '1st pl' } }, { kind: 'ar', value: 'نَحْنُ' }, 'naḥnu', { kind: 'bi', value: { bn: 'আমরা', en: 'we' } }],
            [{ kind: 'bi', value: { bn: '২য় দ্বিবচন', en: '2nd dual' } }, { kind: 'ar', value: 'أَنْتُمَا' }, 'antumā', { kind: 'bi', value: { bn: 'তোমরা দু’জন', en: 'you two' } }],
            [{ kind: 'bi', value: { bn: '২য় পুং. বহু.', en: '2nd pl m' } }, { kind: 'ar', value: 'أَنْتُمْ' }, 'antum', { kind: 'bi', value: { bn: 'তোমরা (পুরুষ)', en: 'you (m pl)' } }],
            [{ kind: 'bi', value: { bn: '২য় স্ত্রী. বহু.', en: '2nd pl f' } }, { kind: 'ar', value: 'أَنْتُنَّ' }, 'antunna', { kind: 'bi', value: { bn: 'তোমরা (নারী)', en: 'you (f pl)' } }],
            [{ kind: 'bi', value: { bn: '৩য় দ্বিবচন', en: '3rd dual' } }, { kind: 'ar', value: 'هُمَا' }, 'humā', { kind: 'bi', value: { bn: 'তারা দু’জন', en: 'they two' } }],
            [{ kind: 'bi', value: { bn: '৩য় পুং. বহু.', en: '3rd pl m' } }, { kind: 'ar', value: 'هُمْ' }, 'hum', { kind: 'bi', value: { bn: 'তারা (পুরুষ)', en: 'they (m)' } }],
            [{ kind: 'bi', value: { bn: '৩য় স্ত্রী. বহু.', en: '3rd pl f' } }, { kind: 'ar', value: 'هُنَّ' }, 'hunna', { kind: 'bi', value: { bn: 'তারা (নারী)', en: 'they (f)' } }],
          ],
        },
      ],
    },
    {
      id: 'attached',
      heading: { bn: 'যুক্ত সর্বনাম', en: 'Attached pronouns' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'একই প্রত্যয় দুই কাজে খাটে: বিশেষ্যের সাথে "আমার, তোমার, তার"; ক্রিয়া/অব্যয়ের সাথে "আমাকে, তোমাকে, তাকে"।',
            en: 'These suffixes do double duty. On a noun they mean "my, your, his". On a verb or preposition they mean "me, you, him".',
          },
        },
        {
          kind: 'table',
          headers: [
            { bn: 'প্রত্যয়', en: 'Suffix' },
            { bn: 'উচ্চারণ', en: 'Sound' },
            { bn: 'বিশেষ্যে', en: 'On a noun' },
            { bn: 'ক্রিয়া/অব্যয়ে', en: 'On a verb' },
          ],
          rows: [
            [{ kind: 'ar', value: 'ـِي' }, '-ī', { kind: 'bi', value: { bn: 'আমার', en: 'my' } }, { kind: 'bi', value: { bn: 'আমাকে', en: 'me' } }],
            [{ kind: 'ar', value: 'ـكَ' }, '-ka', { kind: 'bi', value: { bn: 'তোমার (পুং.)', en: 'your (m)' } }, { kind: 'bi', value: { bn: 'তোমাকে (পুং.)', en: 'you (m)' } }],
            [{ kind: 'ar', value: 'ـكِ' }, '-ki', { kind: 'bi', value: { bn: 'তোমার (স্ত্রী.)', en: 'your (f)' } }, { kind: 'bi', value: { bn: 'তোমাকে (স্ত্রী.)', en: 'you (f)' } }],
            [{ kind: 'ar', value: 'ـهُ' }, '-hu', { kind: 'bi', value: { bn: 'তার (পুং.)', en: 'his' } }, { kind: 'bi', value: { bn: 'তাকে (পুং.)', en: 'him' } }],
            [{ kind: 'ar', value: 'ـهَا' }, '-hā', { kind: 'bi', value: { bn: 'তার (স্ত্রী.)', en: 'her' } }, { kind: 'bi', value: { bn: 'তাকে (স্ত্রী.)', en: 'her' } }],
            [{ kind: 'ar', value: 'ـنَا' }, '-nā', { kind: 'bi', value: { bn: 'আমাদের', en: 'our' } }, { kind: 'bi', value: { bn: 'আমাদেরকে', en: 'us' } }],
            [{ kind: 'ar', value: 'ـكُمْ' }, '-kum', { kind: 'bi', value: { bn: 'তোমাদের', en: 'your (pl)' } }, { kind: 'bi', value: { bn: 'তোমাদেরকে', en: 'you (pl)' } }],
            [{ kind: 'ar', value: 'ـهُمْ' }, '-hum', { kind: 'bi', value: { bn: 'তাদের', en: 'their' } }, { kind: 'bi', value: { bn: 'তাদেরকে', en: 'them' } }],
          ],
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'كِتَابِي', transliteration: 'kitābī', english: 'my book', bangla: 'আমার বই' },
            { arabic: 'كِتَابُكَ', transliteration: 'kitābuka', english: 'your book', bangla: 'তোমার বই' },
            { arabic: 'بَيْتُهُ', transliteration: 'baytuhu', english: 'his house', bangla: 'তার বাড়ি' },
            { arabic: 'مَدْرَسَتُهَا', transliteration: 'madrasatuhā', english: 'her school', bangla: 'তার স্কুল' },
            { arabic: 'سَأَلَهُ', transliteration: 'saʾalahu', english: 'he asked him', bangla: 'সে তাকে জিজ্ঞেস করল' },
            { arabic: 'عِنْدِي', transliteration: 'ʿindī', english: 'I have (lit. at me)', bangla: 'আমার আছে (আক্ষরিক: আমার কাছে)' },
            { arabic: 'مِنْهُ', transliteration: 'minhu', english: 'from him', bangla: 'তার কাছ থেকে' },
          ],
        },
        {
          kind: 'callout',
          tone: 'gotcha',
          text: {
            bn: 'বিশেষ্য + যুক্ত-সর্বনাম আসলে ইদাফা। তাই সেই বিশেষ্য থেকে ال আর তানউইন উঠে যায়। বলা যাবে না الْكِتَابِي।',
            en: 'A noun with an attached pronoun is a form of iḍāfa, so it also drops الـ and tanwīn. You cannot say الْكِتَابِي.',
          },
        },
      ],
    },
    {
      id: 'have',
      heading: { bn: '"আমার আছে" বলার নিয়ম', en: 'Saying "I have"' },
      blocks: [
        {
          kind: 'prose',
          text: {
            bn: 'আরবিতে "have" বলে ক্রিয়া নেই। বদলে ব্যবহার হয় অব্যয়—عِنْدَ ("কাছে") বা لِـ ("জন্য")।',
            en: 'There is no verb "to have". Use a preposition instead — عِنْدَ (at) or لِـ (for).',
          },
        },
        {
          kind: 'example-list',
          items: [
            { arabic: 'عِنْدِي كِتَابٌ', transliteration: 'ʿindī kitābun', english: 'I have a book', bangla: 'আমার একটা বই আছে' },
            { arabic: 'عِنْدَهُ سَيَّارَةٌ', transliteration: 'ʿindahu sayyāratun', english: 'He has a car', bangla: 'তার একটা গাড়ি আছে' },
            { arabic: 'لَهَا أُخْتٌ', transliteration: 'lahā ukhtun', english: 'She has a sister', bangla: 'তার একজন বোন আছে' },
            { arabic: 'هُنَاكَ مُشْكِلَةٌ', transliteration: 'hunāka mushkilatun', english: 'There is a problem', bangla: 'একটা সমস্যা আছে' },
          ],
        },
      ],
    },
  ],
};
