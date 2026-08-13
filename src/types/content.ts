export type Appearance =
  | { source: 'surah'; surah: string; surahName: string; verse: number | null }
  | { source: 'basics'; category: string }
  | { source: 'scenario'; scenario: string }
  | { source: 'hidden'; category: string; banglaWord: string }
  | { source: 'root'; root: string; pattern: string };

export interface Word {
  slug: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
  root?: string;
  appearances: Appearance[];
}

export interface SurahVerse {
  ayah: number | null;
  wordSlug: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
}

export interface Surah {
  slug: string;
  banglaName: string;
  arabicName: string;
  englishName: string;
  mushafNumber: number;
  verses: SurahVerse[];
}

export interface DialogueTurn {
  speaker: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
}

export interface Scenario {
  slug: string;
  number: number;
  banglaTitle: string;
  englishTitle: string;
  turns: DialogueTurn[];
  newWordsNote: string;
}

export interface BasicCategory {
  slug: string;
  title: string;
  wordSlugs: string[];
}

export interface Basics {
  categories: BasicCategory[];
  dialogues: {
    slug: string;
    title: string;
    turns: DialogueTurn[];
  }[];
}

export interface HiddenEntry {
  bangla: string;
  arabic: string;
  transliteration: string;
  arabicMeaning: string;
  note: string;
}

export interface HiddenCategory {
  slug: string;
  title: string;
  entries: HiddenEntry[];
}

export interface HiddenData {
  categories: HiddenCategory[];
  persianNotArabic: { bangla: string; persian: string; note: string }[];
  mixed: { bangla: string; structure: string; note: string }[];
  english: { english: string; arabic: string; meaning: string }[];
}

export interface RootFamilyItem {
  arabic: string;
  transliteration: string;
  pattern: string;
  meaning: string;
  note: string;
}

export interface Root {
  slug: string;
  arabic: string;
  latin: string;
  meaning: string;
  order?: number;
  family: RootFamilyItem[];
  familyGlance?: string;
}

export interface HarakatForm {
  arabic: string;
  english: string;
  bangla: string;
}

export interface Letter {
  order: number;
  slug: string;
  arabic: string;
  name: string;
  englishSound: string;
  banglaSound: string;
  banglaNote?: string;
  englishNote?: string;
  category?: 'heavy' | 'guttural' | 'soft' | 'vowel';
  fatha: HarakatForm;
  kasra: HarakatForm;
  damma: HarakatForm;
  longVowel?: HarakatForm;
}
