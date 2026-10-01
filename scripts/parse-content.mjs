#!/usr/bin/env node
// Parses arabic-complete-guide.md into structured JSON for the site.
// Emits: content/words.json, content/surahs.json, content/scenarios.json,
//        content/roots.json, content/hidden.json, content/basics.json
//
// Every word entry gets a stable, URL-safe slug so it can have its own page.
// When the same transliteration means different things, we append a disambiguator.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'arabic-complete-guide.md');
const OUT_DIR = path.join(ROOT, 'content');

fs.mkdirSync(OUT_DIR, { recursive: true });

// Normalize line endings: Windows checkouts (git autocrlf) yield CRLF, which
// breaks the line-anchored regexes below.
const raw = fs.readFileSync(SOURCE, 'utf8').replace(/\r\n?/g, '\n');

// ---------- Utilities ----------

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks
    .replace(/['`']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Strips markdown formatting artifacts, ★ markers, and stray whitespace.
function clean(s) {
  return String(s ?? '')
    .replace(/\s*★\s*/g, '')
    .replace(/\|/g, '')
    .trim();
}

// Split a markdown table (header + rows) into arrays of cell strings.
function parseTable(tableText) {
  const lines = tableText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));
  if (lines.length < 2) return { headers: [], rows: [] };
  const parseRow = (line) =>
    line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());
  const headers = parseRow(lines[0]);
  const rows = lines
    .slice(2) // skip alignment row
    .map(parseRow)
    .filter((r) => r.length === headers.length);
  return { headers, rows };
}

// Extract sections split by markdown `## ` headings *within* a `# Part N` block.
function splitByH2(block) {
  const parts = [];
  const lines = block.split('\n');
  let current = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(.*)$/);
    if (m) {
      if (current) parts.push(current);
      current = { title: m[1].trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) parts.push(current);
  return parts;
}

// Grab every H2 section under a specific H1 (# Part N: ...).
function extractPart(source, partNumber) {
  const re = new RegExp(`^#\\s+Part\\s+${partNumber}:.*$`, 'm');
  const start = source.search(re);
  if (start === -1) return '';
  const rest = source.slice(start);
  const next = rest.slice(1).search(/^#\s+Part\s+\d+/m);
  return next === -1 ? rest : rest.slice(0, next + 1);
}

// Grab every markdown table (contiguous | ... | lines) inside a body.
function findTables(body) {
  const tables = [];
  const lines = body.split('\n');
  let buf = [];
  for (const line of lines) {
    if (line.trim().startsWith('|')) {
      buf.push(line);
    } else if (buf.length) {
      tables.push(buf.join('\n'));
      buf = [];
    }
  }
  if (buf.length) tables.push(buf.join('\n'));
  return tables;
}

// Slug collision registry
const slugRegistry = new Map();
function makeUniqueSlug(base, context = '') {
  const clean = base || 'word';
  let candidate = clean;
  let i = 2;
  while (slugRegistry.has(candidate)) {
    const existing = slugRegistry.get(candidate);
    if (existing.context === context) return candidate;
    candidate = context ? `${clean}-${context}` : `${clean}-${i}`;
    if (context && slugRegistry.has(candidate)) {
      candidate = `${clean}-${i}`;
    }
    i++;
  }
  slugRegistry.set(candidate, { context });
  return candidate;
}

// Master word list — every distinct (arabic, transliteration, meaning) triple
// gets one entry. We dedupe on (arabic + transliteration).
const wordMap = new Map();
function upsertWord(entry) {
  const key = `${entry.arabic}|${entry.transliteration}`;
  const existing = wordMap.get(key);
  if (existing) {
    // merge: collect appearances
    if (entry.appearances) {
      existing.appearances = [
        ...(existing.appearances || []),
        ...entry.appearances,
      ];
    }
    if (entry.english && !existing.english.includes(entry.english)) {
      existing.english = existing.english + '; ' + entry.english;
    }
    if (entry.bangla && !existing.bangla.includes(entry.bangla)) {
      existing.bangla = existing.bangla + '; ' + entry.bangla;
    }
    return existing;
  }
  const base = slugify(entry.transliteration || entry.arabic);
  const slug = makeUniqueSlug(base, entry.context || '');
  const stored = { ...entry, slug };
  wordMap.set(key, stored);
  return stored;
}

// ---------- Part 1: Surahs ----------

const part1 = extractPart(raw, 1);
const surahs = [];
const surahSections = splitByH2(part1).filter((s) =>
  /^\d+\.\s+সূরা/.test(s.title)
);

const surahMeta = {
  'আল-ফাতিহা': { english: 'The Opening', mushaf: 1, slug: 'al-fatiha' },
  'আল-মাসাদ': { english: 'The Palm Fiber', mushaf: 111, slug: 'al-masad' },
  'আল-আসর': { english: 'The Time', mushaf: 103, slug: 'al-asr' },
  'আল-কদর': { english: 'The Decree', mushaf: 97, slug: 'al-qadr' },
  'আল-ফিল': { english: 'The Elephant', mushaf: 105, slug: 'al-fil' },
  'আল-মাউন': { english: 'Small Kindnesses', mushaf: 107, slug: 'al-maun' },
  'আল-কাউসার': { english: 'The Abundance', mushaf: 108, slug: 'al-kawthar' },
  'আন-নাসর': { english: 'The Help', mushaf: 110, slug: 'an-nasr' },
  'আল-ইখলাস': { english: 'The Sincerity', mushaf: 112, slug: 'al-ikhlas' },
  'আল-ফালাক': { english: 'The Daybreak', mushaf: 113, slug: 'al-falaq' },
  'আন-নাস': { english: 'Mankind', mushaf: 114, slug: 'an-nas' },
  'কুরাইশ': { english: 'Quraysh', mushaf: 106, slug: 'quraysh' },
  'আল-কাফিরুন': { english: 'The Disbelievers', mushaf: 109, slug: 'al-kafirun' },
  'আল-বাইয়্যিনাহ': { english: 'The Clear Proof', mushaf: 98, slug: 'al-bayyinah' },
  'আয-যালযালাহ': { english: 'The Earthquake', mushaf: 99, slug: 'az-zalzalah' },
  'আত-তাকাসুর': { english: 'Rivalry in Increase', mushaf: 102, slug: 'at-takathur' },
  'আশ-শারহ': { english: 'The Relief', mushaf: 94, slug: 'ash-sharh' },
  'আত-তিন': { english: 'The Fig', mushaf: 95, slug: 'at-tin' },
  'আল-হুমাযাহ': { english: 'The Slanderer', mushaf: 104, slug: 'al-humazah' },
};

for (const sec of surahSections) {
  const titleMatch = sec.title.match(/^\d+\.\s+সূরা\s+([^\s(]+)\s*\(([^)]+)\)/);
  const banglaName = titleMatch ? titleMatch[1].trim() : sec.title;
  const arabicName = titleMatch ? titleMatch[2].trim() : '';
  const meta = surahMeta[banglaName] || {
    slug: slugify(banglaName) || 'surah',
    english: '',
    mushaf: 0,
  };
  const tables = findTables(sec.body);
  const verses = [];
  for (const tbl of tables) {
    const { rows } = parseTable(tbl);
    for (const row of rows) {
      if (row.length < 5) continue;
      const [ayah, arabic, translit, english, bangla] = row.map(clean);
      if (!arabic || !translit) continue;
      const word = upsertWord({
        arabic,
        transliteration: translit.replace(/^[A-Z]/, (c) => c.toLowerCase()),
        english,
        bangla,
        context: meta.slug,
        appearances: [
          {
            source: 'surah',
            surah: meta.slug,
            surahName: banglaName,
            verse: Number(ayah) || null,
          },
        ],
      });
      verses.push({
        ayah: Number(ayah) || null,
        wordSlug: word.slug,
        arabic,
        transliteration: word.transliteration,
        english,
        bangla,
      });
    }
  }
  surahs.push({
    slug: meta.slug,
    banglaName,
    arabicName,
    englishName: meta.english,
    mushafNumber: meta.mushaf,
    verses,
  });
}

// ---------- Part 2: Basics ----------

const part2 = extractPart(raw, 2);
const basicsSections = splitByH2(part2);

const basicCategoryMap = {
  Pronouns: 'pronouns',
  'Question words': 'question-words',
  'Greetings & politeness': 'greetings',
  'Essential verbs': 'verbs',
  'Common nouns': 'nouns',
  Adjectives: 'adjectives',
  'Particles, prepositions, time words': 'particles',
  Numbers: 'numbers',
  'Possessive suffixes': 'possessives',
  'Sentence patterns': 'patterns',
  'Survival phrases': 'survival',
};

const basics = { categories: [], dialogues: [] };

for (const sec of basicsSections) {
  const englishTag = sec.title.split('|')[0].replace(/^\d+\.\s*/, '').trim();
  const catSlug = basicCategoryMap[englishTag];

  if (sec.title.startsWith('Conversation')) {
    const dialogueMatch = sec.title.match(/^Conversation\s+(\d+):\s*(.+)$/);
    if (dialogueMatch) {
      const tables = findTables(sec.body);
      const turns = [];
      for (const tbl of tables) {
        const { rows } = parseTable(tbl);
        for (const row of rows) {
          if (row.length < 5) continue;
          const [speaker, arabic, translit, english, bangla] = row.map(clean);
          turns.push({ speaker, arabic, transliteration: translit, english, bangla });
        }
      }
      basics.dialogues.push({
        slug: `conversation-${dialogueMatch[1]}`,
        title: dialogueMatch[2].trim(),
        turns,
      });
    }
    continue;
  }

  if (!catSlug) continue;
  const words = [];
  const tables = findTables(sec.body);
  for (const tbl of tables) {
    const { headers, rows } = parseTable(tbl);
    // Some tables have >4 cols (possessives, patterns). Only pull vocab tables.
    if (headers.length < 4) continue;
    const isVocab =
      headers[0].toLowerCase().includes('arabic') ||
      /Arabic/i.test(headers[0]);
    if (!isVocab) continue;
    for (const row of rows) {
      if (row.length < 4) continue;
      const [arabic, translit, english, bangla] = row.map(clean);
      if (!arabic || !translit) continue;
      const word = upsertWord({
        arabic,
        transliteration: translit,
        english,
        bangla,
        context: catSlug,
        appearances: [{ source: 'basics', category: catSlug }],
      });
      words.push(word.slug);
    }
  }
  if (words.length) {
    basics.categories.push({
      slug: catSlug,
      title: englishTag,
      wordSlugs: words,
    });
  }
}

// ---------- Part 3: Scenarios ----------

const part3 = extractPart(raw, 3);
const scenarioSections = splitByH2(part3).filter((s) =>
  /^\d+\.\s/.test(s.title)
);

const scenarioSlugs = {
  1: 'restaurant',
  2: 'taxi',
  3: 'directions',
  4: 'hotel',
  5: 'immigration',
  6: 'market',
  7: 'pharmacy',
  8: 'mosque',
  9: 'phone-plans',
  10: 'lost-phone',
};

const scenarios = [];
for (const sec of scenarioSections) {
  const m = sec.title.match(/^(\d+)\.\s+(.+?)\s*\((.+?)\)/);
  if (!m) continue;
  const num = Number(m[1]);
  const banglaTitle = m[2].trim();
  const englishTitle = m[3].trim();
  const slug = scenarioSlugs[num] || slugify(englishTitle);
  const tables = findTables(sec.body);
  const turns = [];
  for (const tbl of tables) {
    const { rows } = parseTable(tbl);
    for (const row of rows) {
      if (row.length < 5) continue;
      const [speaker, arabic, translit, english, bangla] = row.map(clean);
      if (!arabic || !translit) continue;
      turns.push({ speaker, arabic, transliteration: translit, english, bangla });
      upsertWord({
        arabic,
        transliteration: translit,
        english,
        bangla,
        context: slug,
        appearances: [{ source: 'scenario', scenario: slug }],
      });
    }
  }
  // pull the "নতুন শব্দ:" list to link related new words
  const newWordsLine = sec.body.match(/\*\*নতুন শব্দ:\*\*\s*(.+)/);
  const newWords = newWordsLine ? newWordsLine[1].trim() : '';
  scenarios.push({
    slug,
    number: num,
    banglaTitle,
    englishTitle,
    turns,
    newWordsNote: newWords,
  });
}

// ---------- Part 4: Hidden Arabic in Bangla ----------

const part4 = extractPart(raw, 4);
const hiddenSections = splitByH2(part4).filter((s) => /^\d+\./.test(s.title));

const hiddenSlugMap = {
  'আইন-আদালত ও প্রশাসন': 'law-and-administration',
  'টাকা-পয়সা ও ব্যবসা': 'money-and-business',
  'জায়গা, প্রশাসনিক এলাকা ও সংঘাত': 'places-and-conflict',
  'রোজকার জিনিস ও মানুষ': 'everyday-things',
  'ভাব, অনুভূতি ও গুণ': 'feelings-and-qualities',
  'কথাবার্তা ও কাজকর্ম': 'speech-and-work',
  সময়: 'time',
};

const hidden = { categories: [], persianNotArabic: [], mixed: [], english: [] };

for (const sec of hiddenSections) {
  const titleMatch = sec.title.match(/^\d+\.\s*(.+?)\s*\(\d+\)$/);
  const banglaCat = titleMatch ? titleMatch[1].trim() : sec.title;
  const slug = hiddenSlugMap[banglaCat] || slugify(banglaCat);
  const tables = findTables(sec.body);
  const entries = [];
  for (const tbl of tables) {
    const { rows } = parseTable(tbl);
    for (const row of rows) {
      if (row.length < 4) continue;
      const [bangla, arabic, translit, meaning, note] = row.map(clean);
      if (!arabic) continue;
      entries.push({
        bangla,
        arabic,
        transliteration: translit,
        arabicMeaning: meaning,
        note: note || '',
      });
      upsertWord({
        arabic,
        transliteration: translit,
        english: meaning,
        bangla,
        context: `hidden-${slug}`,
        appearances: [{ source: 'hidden', category: slug, banglaWord: bangla }],
      });
    }
  }
  if (entries.length) {
    hidden.categories.push({ slug, title: banglaCat, entries });
  }
}

// Extract Persian-not-Arabic table
{
  const persianSec = splitByH2(part4).find((s) =>
    s.title.includes('ফারসি, আরবি নয়')
  );
  if (persianSec) {
    const tables = findTables(persianSec.body);
    for (const tbl of tables) {
      const { rows } = parseTable(tbl);
      for (const row of rows) {
        if (row.length < 3) continue;
        const [bangla, persian, note] = row.map(clean);
        hidden.persianNotArabic.push({ bangla, persian, note });
      }
    }
  }
}
// Mixed Persian+Arabic
{
  const mixedSec = splitByH2(part4).find((s) =>
    s.title.includes('মিশ্র শব্দ')
  );
  if (mixedSec) {
    const tables = findTables(mixedSec.body);
    for (const tbl of tables) {
      const { rows } = parseTable(tbl);
      for (const row of rows) {
        if (row.length < 3) continue;
        const [bangla, structure, note] = row.map(clean);
        hidden.mixed.push({ bangla, structure, note });
      }
    }
  }
}
// English words with Arabic origin
{
  const englishSec = splitByH2(part4).find((s) =>
    s.title.includes('ইংরেজিও বাদ যায়নি')
  );
  if (englishSec) {
    const tables = findTables(englishSec.body);
    for (const tbl of tables) {
      const { rows } = parseTable(tbl);
      for (const row of rows) {
        if (row.length < 3) continue;
        const [english, arabic, meaning] = row.map(clean);
        hidden.english.push({ english, arabic, meaning });
      }
    }
  }
}

// ---------- Part 5: Roots ----------

const part5 = extractPart(raw, 5);
const rootMap = new Map();

// Find all sub-sub-sections ("### N. Root ...")
const h3Blocks = [];
{
  const lines = part5.split('\n');
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^###\s+(.*)$/);
    if (m) {
      if (cur) h3Blocks.push(cur);
      cur = { title: m[1].trim(), body: '' };
    } else if (cur) {
      cur.body += line + '\n';
    }
  }
  if (cur) h3Blocks.push(cur);
}

const rootTitleRe = /^(\d+)\.\s+([^ ]+)\s*\(([^)]+)\)\s*(.*)$/;
const roots = [];
for (const block of h3Blocks) {
  const m = block.title.match(rootTitleRe);
  if (!m) continue;
  const [, numStr, arabicRoot, latinRoot, meaning] = m;
  // Latin form uses "'" for ain (ع); keep the letter position by mapping to "a".
  const slug = slugify(latinRoot.replace(/'/g, 'a'));
  const tables = findTables(block.body);
  const family = [];
  for (const tbl of tables) {
    const { rows } = parseTable(tbl);
    for (const row of rows) {
      if (row.length < 4) continue;
      const [arabic, translit, pattern, meaningCell, note] = row.map(clean);
      if (!arabic) continue;
      family.push({
        arabic,
        transliteration: translit,
        pattern,
        meaning: meaningCell,
        note: note || '',
      });
      upsertWord({
        arabic,
        transliteration: translit,
        english: meaningCell,
        bangla: '',
        context: `root-${slug}`,
        appearances: [{ source: 'root', root: slug, pattern }],
      });
    }
  }
  const rootObj = {
    slug,
    arabic: arabicRoot,
    latin: latinRoot,
    meaning: meaning.trim(),
    order: Number(numStr),
    family,
  };
  roots.push(rootObj);
  rootMap.set(slug, rootObj);
}

// The 16-roots-at-a-glance table
// Arabic-letter roots need transliterating to make a URL-safe slug.
const ARABIC_LETTER_TO_LATIN = {
  ا: 'a', ب: 'b', ت: 't', ث: 'th', ج: 'j', ح: 'h', خ: 'kh', د: 'd', ذ: 'dh',
  ر: 'r', ز: 'z', س: 's', ش: 'sh', ص: 's', ض: 'd', ط: 't', ظ: 'z', ع: 'a',
  غ: 'gh', ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm', ن: 'n', ه: 'h', و: 'w',
  ي: 'y', أ: 'a', إ: 'i', آ: 'a', ء: 'a', ة: 'h', ى: 'a', ئ: 'y', ؤ: 'w',
};
function arabicRootToLatin(arabic) {
  return arabic
    .split('')
    .map((ch) => ARABIC_LETTER_TO_LATIN[ch] ?? (ch === '-' ? '-' : ''))
    .filter(Boolean)
    .join('');
}

{
  const glanceSec = splitByH2(part5).find((s) =>
    s.title.includes('আরো ১৬টি মূল এক নজরে')
  );
  if (glanceSec) {
    const tables = findTables(glanceSec.body);
    for (const tbl of tables) {
      const { rows } = parseTable(tbl);
      for (const row of rows) {
        if (row.length < 3) continue;
        const [arabicRoot, meaning, family] = row.map(clean);
        const latin = arabicRootToLatin(arabicRoot);
        const slug = slugify(latin);
        if (!slug || rootMap.has(slug)) continue;
        roots.push({
          slug,
          arabic: arabicRoot,
          latin,
          meaning,
          familyGlance: family,
          family: [],
        });
        rootMap.set(slug, roots[roots.length - 1]);
      }
    }
  }
}

// ---------- Emit ----------

const words = [...wordMap.values()].map((w) => ({
  slug: w.slug,
  arabic: w.arabic,
  transliteration: w.transliteration,
  english: w.english,
  bangla: w.bangla,
  appearances: dedupeAppearances(w.appearances || []),
}));

function dedupeAppearances(list) {
  const seen = new Set();
  const out = [];
  for (const a of list) {
    const key = JSON.stringify(a);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

// Cross-link every word with its root if we can detect one from context
for (const w of words) {
  const rootAppearance = (w.appearances || []).find((a) => a.source === 'root');
  if (rootAppearance) w.root = rootAppearance.root;
}

// Refuse to clobber committed content with empty output if parsing failed.
if (!words.length || !surahs.length) {
  console.error(
    `Parse produced no content (words: ${words.length}, surahs: ${surahs.length}); ` +
      'leaving content/ untouched. Check the format of arabic-complete-guide.md.'
  );
  process.exit(1);
}

const write = (name, data) =>
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 2));

write('words.json', words);
write('surahs.json', surahs);
write('basics.json', basics);
write('scenarios.json', scenarios);
write('hidden.json', hidden);
write('roots.json', roots);

// Summary manifest
const manifest = {
  generatedAt: new Date().toISOString(),
  counts: {
    words: words.length,
    surahs: surahs.length,
    scenarios: scenarios.length,
    basicsCategories: basics.categories.length,
    basicsDialogues: basics.dialogues.length,
    hiddenCategories: hidden.categories.length,
    roots: roots.length,
  },
};
write('manifest.json', manifest);

console.log('Parsed content:');
console.log(JSON.stringify(manifest.counts, null, 2));
