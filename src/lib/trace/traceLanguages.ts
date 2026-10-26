/**
 * Arabic language configuration for trace game
 * Simplified from kids-hub to support Arabic only
 */

// ء through غ, then ف through ي — the letters, with every hamza carrier,
// taa marbuta and alif maqsura. U+0640 (tatweel) sits between the two runs.
const ARABIC_LETTER = /^[ء-غف-ي]$/;

// Fathatan through sukun: the three tanween, fatha, damma, kasra, shadda, sukun.
const HARAKA = /^[ً-ْ]$/;
const SHADDA = "ّ";

// The admin's on-screen letter pad, in alphabet (hija'i) order, followed by
// the hamza forms and the two word-final letters, then the harakat.
export const ARABIC_ALPHABET = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");
export const ARABIC_EXTRA_LETTERS = "ءأإآؤئةى".split("");
export const ARABIC_HARAKAT = [
  { mark: "َ", name: "fatha" },
  { mark: "ُ", name: "damma" },
  { mark: "ِ", name: "kasra" },
  { mark: "ْ", name: "sukun" },
  { mark: SHADDA, name: "shadda" },
  { mark: "ً", name: "fathatan" },
  { mark: "ٌ", name: "dammatan" },
  { mark: "ٍ", name: "kasratan" },
];

export const isHaraka = (ch: string): boolean => HARAKA.test(ch);

/** Remove the harakat, leaving the bare letters. */
export const stripHarakat = (text: string): string => text.replace(/[ً-ْ]/g, "");

export const TRACE_LANGUAGE = {
  code: "ar",
  label: "Arabic",
  nativeLabel: "العربية",
  dir: "rtl" as const,
  maxLength: 5,
  isLetter: (ch: string) => ARABIC_LETTER.test(ch),
  isAllowed: (ch: string) => ARABIC_LETTER.test(ch) || HARAKA.test(ch),
};

/** How many letters a word has — harakat don't count. */
export function countLetters(word: string): number {
  return (word || "").split("").filter((ch) => TRACE_LANGUAGE.isLetter(ch)).length;
}

/**
 * Filter any input down to what Arabic can trace, capped at its
 * maximum number of letters. Text is NFKC-normalised first, so text
 * pasted from a PDF in presentation forms (ﺑ, ﻻ) comes back as the plain
 * letters (ب, لا). A haraka is kept only straight after a letter, and a
 * letter keeps at most one vowel mark and one shadda — a stray or doubled
 * mark would have nothing to sit on.
 */
export function sanitiseWord(raw: string): string {
  let out = "";
  let letters = 0;
  let onLetter: { vowel: boolean; shadda: boolean } | null = null;
  
  for (const ch of (raw || "").normalize("NFKC")) {
    if (TRACE_LANGUAGE.isLetter(ch)) {
      if (letters === TRACE_LANGUAGE.maxLength) break;
      out += ch;
      letters++;
      onLetter = { vowel: false, shadda: false };
    } else if (HARAKA.test(ch) && onLetter) {
      const slot = ch === SHADDA ? "shadda" : "vowel";
      if (onLetter[slot]) continue;
      onLetter[slot] = true;
      out += ch;
    } else {
      // Anything else — a space, a stray mark — ends the current letter's
      // run of marks, so a mark after it can't attach across the gap.
      onLetter = null;
    }
  }
  return out;
}

export function isTraceableWord(word: string): boolean {
  return !!word && countLetters(word) > 0 && sanitiseWord(word) === word;
}
