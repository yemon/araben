/**
 * Seed the learning-content tables from content/*.json — the files
 * scripts/parse-content.mjs generates from arabic-complete-guide.md.
 *
 *   npm run db:seed-content               validate, write, verify
 *   npm run db:seed-content -- --dry-run  validate only; writes nothing
 *
 * Safe to re-run, and built to fail safe:
 * - Only the content tables are touched. The trace game tables (game_types,
 *   games, game_slides) are never read or written.
 * - Every file is checked before anything is written: each record must have
 *   exactly the fields this seed knows (a new field would otherwise be
 *   silently dropped), every cross-reference must resolve, every slug must
 *   be unique, and every string must fit its column. Any problem aborts with
 *   nothing written.
 * - All writes happen in one transaction. Before it commits, every JSON file
 *   is rebuilt from the database and compared with the original; any
 *   difference rolls the whole seed back.
 * - Rows are matched by slug, so a re-seed keeps the ids of rows that are
 *   still there. Lists (verses, turns, appearances…) are replaced, and rows
 *   no longer in the JSON are removed.
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const CONTENT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../content",
);
const DRY_RUN = process.argv.includes("--dry-run");

// Prisma's MySQL String is VARCHAR(191) (characters); @db.Text holds 65,535
// bytes.
const VARCHAR_CHARS = 191;
const TEXT_BYTES = 65535;

const prisma = new PrismaClient();

// ---------- Load ----------

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, name), "utf8"));
}

function loadContent() {
  return {
    words: readJson("words.json"),
    surahs: readJson("surahs.json"),
    basics: readJson("basics.json"),
    scenarios: readJson("scenarios.json"),
    hidden: readJson("hidden.json"),
    roots: readJson("roots.json"),
    manifest: readJson("manifest.json"),
  };
}

// ---------- Validate ----------

// Field kinds: s = VARCHAR string, t = TEXT string, i = integer,
// a = array (checked by the caller). A trailing ? marks an optional field.
const SHAPES = {
  word: { slug: "s", arabic: "s", transliteration: "s", english: "t", bangla: "t", appearances: "a", root: "s?" },
  surah: { slug: "s", banglaName: "s", arabicName: "s", englishName: "s", mushafNumber: "i", verses: "a" },
  verse: { ayah: "i", wordSlug: "s", arabic: "s", transliteration: "s", english: "t", bangla: "t" },
  basics: { categories: "a", dialogues: "a" },
  basicsCategory: { slug: "s", title: "s", wordSlugs: "a" },
  dialogue: { slug: "s", title: "s", turns: "a" },
  turn: { speaker: "s", arabic: "s", transliteration: "s", english: "t", bangla: "t" },
  scenario: { slug: "s", number: "i", banglaTitle: "s", englishTitle: "s", turns: "a", newWordsNote: "t" },
  hidden: { categories: "a", persianNotArabic: "a", mixed: "a", english: "a" },
  hiddenCategory: { slug: "s", title: "s", entries: "a" },
  hiddenEntry: { bangla: "s", arabic: "s", transliteration: "s", arabicMeaning: "t", note: "t" },
  persianWord: { bangla: "s", persian: "s", note: "t" },
  mixedWord: { bangla: "s", structure: "t", note: "t" },
  englishWord: { english: "s", arabic: "s", meaning: "t" },
  root: { slug: "s", arabic: "s", latin: "s", meaning: "s", order: "i?", familyGlance: "t?", family: "a" },
  familyMember: { arabic: "s", transliteration: "s", pattern: "s", meaning: "t", note: "t" },
};

// Each appearance source and the fields it carries (besides `source`).
const APPEARANCE_SHAPES = {
  surah: { surah: "s", surahName: "s", verse: "i" },
  basics: { category: "s" },
  scenario: { scenario: "s" },
  hidden: { category: "s", banglaWord: "s" },
  root: { root: "s", pattern: "s" },
};

function validate(c) {
  const problems = [];
  const fail = (where, msg) => problems.push(`${where}: ${msg}`);

  const checkShape = (obj, shape, where) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      fail(where, "expected an object");
      return false;
    }
    for (const key of Object.keys(obj)) {
      if (!(key in shape)) fail(where, `unknown field "${key}" — teach the seed and schema about it first`);
    }
    for (const [key, spec] of Object.entries(shape)) {
      const optional = spec.endsWith("?");
      const kind = spec.replace("?", "");
      const v = obj[key];
      if (v === undefined) {
        if (!optional) fail(where, `missing field "${key}"`);
        continue;
      }
      if (kind === "a" && !Array.isArray(v)) fail(where, `"${key}" should be a list`);
      if (kind === "i" && !Number.isInteger(v)) fail(where, `"${key}" should be a whole number, got ${JSON.stringify(v)}`);
      if (kind === "s" || kind === "t") {
        if (typeof v !== "string") fail(where, `"${key}" should be text, got ${JSON.stringify(v)}`);
        else if (kind === "s" && [...v].length > VARCHAR_CHARS)
          fail(where, `"${key}" is ${[...v].length} characters; the column holds ${VARCHAR_CHARS}`);
        else if (kind === "t" && Buffer.byteLength(v) > TEXT_BYTES)
          fail(where, `"${key}" is ${Buffer.byteLength(v)} bytes; the column holds ${TEXT_BYTES}`);
      }
    }
    return true;
  };

  // Slugs compare case-insensitively in the database, so they must be
  // unique that way here too.
  const uniqueBy = (list, key, label) => {
    const seen = new Map();
    list.forEach((item, i) => {
      const k = String(key(item)).toLowerCase();
      if (seen.has(k)) fail(`${label}[${i}]`, `duplicate ${JSON.stringify(key(item))} (also at [${seen.get(k)}])`);
      else seen.set(k, i);
    });
  };

  const { words, surahs, basics, scenarios, hidden, roots, manifest } = c;
  for (const [name, list] of Object.entries({ words, surahs, scenarios, roots })) {
    if (!Array.isArray(list) || !list.length) fail(`${name}.json`, "expected a non-empty list");
  }
  if (problems.length) return problems;
  checkShape(basics, SHAPES.basics, "basics.json");
  checkShape(hidden, SHAPES.hidden, "hidden.json");
  if (problems.length) return problems;

  roots.forEach((r, i) => {
    checkShape(r, SHAPES.root, `roots[${i}]`);
    r.family?.forEach((m, j) => checkShape(m, SHAPES.familyMember, `roots[${i}].family[${j}]`));
  });
  surahs.forEach((s, i) => {
    checkShape(s, SHAPES.surah, `surahs[${i}]`);
    s.verses?.forEach((v, j) => checkShape(v, SHAPES.verse, `surahs[${i}].verses[${j}]`));
  });
  basics.categories.forEach((b, i) => {
    checkShape(b, SHAPES.basicsCategory, `basics.categories[${i}]`);
    b.wordSlugs?.forEach((w, j) => {
      if (typeof w !== "string") fail(`basics.categories[${i}].wordSlugs[${j}]`, "should be text");
    });
  });
  basics.dialogues.forEach((d, i) => {
    checkShape(d, SHAPES.dialogue, `basics.dialogues[${i}]`);
    d.turns?.forEach((t, j) => checkShape(t, SHAPES.turn, `basics.dialogues[${i}].turns[${j}]`));
  });
  scenarios.forEach((s, i) => {
    checkShape(s, SHAPES.scenario, `scenarios[${i}]`);
    s.turns?.forEach((t, j) => checkShape(t, SHAPES.turn, `scenarios[${i}].turns[${j}]`));
  });
  hidden.categories.forEach((h, i) => {
    checkShape(h, SHAPES.hiddenCategory, `hidden.categories[${i}]`);
    h.entries?.forEach((e, j) => checkShape(e, SHAPES.hiddenEntry, `hidden.categories[${i}].entries[${j}]`));
  });
  hidden.persianNotArabic.forEach((x, i) => checkShape(x, SHAPES.persianWord, `hidden.persianNotArabic[${i}]`));
  hidden.mixed.forEach((x, i) => checkShape(x, SHAPES.mixedWord, `hidden.mixed[${i}]`));
  hidden.english.forEach((x, i) => checkShape(x, SHAPES.englishWord, `hidden.english[${i}]`));
  words.forEach((w, i) => {
    checkShape(w, SHAPES.word, `words[${i}]`);
    w.appearances?.forEach((a, j) => {
      const shape = APPEARANCE_SHAPES[a?.source];
      if (!shape) fail(`words[${i}].appearances[${j}]`, `unknown source ${JSON.stringify(a?.source)}`);
      else checkShape(a, { source: "s", ...shape }, `words[${i}].appearances[${j}]`);
    });
  });
  if (problems.length) return problems;

  uniqueBy(words, (w) => w.slug, "words");
  uniqueBy(surahs, (s) => s.slug, "surahs");
  uniqueBy(surahs, (s) => s.mushafNumber, "surahs (mushafNumber)");
  uniqueBy(scenarios, (s) => s.slug, "scenarios");
  uniqueBy(scenarios, (s) => s.number, "scenarios (number)");
  uniqueBy(roots, (r) => r.slug, "roots");
  uniqueBy(basics.categories, (b) => b.slug, "basics.categories");
  uniqueBy(basics.dialogues, (d) => d.slug, "basics.dialogues");
  uniqueBy(hidden.categories, (h) => h.slug, "hidden.categories");

  const wordSlugs = new Set(words.map((w) => w.slug));
  const surahBySlug = new Map(surahs.map((s) => [s.slug, s]));
  const scenarioSlugs = new Set(scenarios.map((s) => s.slug));
  const rootSlugs = new Set(roots.map((r) => r.slug));
  const basicsSlugs = new Set(basics.categories.map((b) => b.slug));
  const hiddenSlugs = new Set(hidden.categories.map((h) => h.slug));

  surahs.forEach((s, i) =>
    s.verses.forEach((v, j) => {
      if (!wordSlugs.has(v.wordSlug)) fail(`surahs[${i}].verses[${j}]`, `word "${v.wordSlug}" not in words.json`);
    }),
  );
  basics.categories.forEach((b, i) => {
    b.wordSlugs.forEach((w, j) => {
      if (!wordSlugs.has(w)) fail(`basics.categories[${i}].wordSlugs[${j}]`, `word "${w}" not in words.json`);
    });
    uniqueBy(b.wordSlugs, (w) => w, `basics.categories[${i}].wordSlugs`);
  });
  words.forEach((w, i) => {
    if (w.root !== undefined && !rootSlugs.has(w.root)) fail(`words[${i}]`, `root "${w.root}" not in roots.json`);
    w.appearances.forEach((a, j) => {
      const where = `words[${i}].appearances[${j}]`;
      if (a.source === "surah") {
        const surah = surahBySlug.get(a.surah);
        if (!surah) fail(where, `surah "${a.surah}" not in surahs.json`);
        // surahName isn't stored: it is rebuilt from the surah's own name.
        else if (surah.banglaName !== a.surahName)
          fail(where, `surahName "${a.surahName}" differs from the surah's name "${surah.banglaName}"`);
      }
      if (a.source === "basics" && !basicsSlugs.has(a.category)) fail(where, `basics category "${a.category}" not found`);
      if (a.source === "hidden" && !hiddenSlugs.has(a.category)) fail(where, `hidden category "${a.category}" not found`);
      if (a.source === "scenario" && !scenarioSlugs.has(a.scenario)) fail(where, `scenario "${a.scenario}" not found`);
      if (a.source === "root" && !rootSlugs.has(a.root)) fail(where, `root "${a.root}" not found`);
    });
  });

  // A manifest that disagrees with the files means a half-finished parse.
  if (Number.isNaN(Date.parse(manifest?.generatedAt))) fail("manifest.json", "generatedAt is not a date");
  const actual = {
    words: words.length,
    surahs: surahs.length,
    scenarios: scenarios.length,
    basicsCategories: basics.categories.length,
    basicsDialogues: basics.dialogues.length,
    hiddenCategories: hidden.categories.length,
    roots: roots.length,
  };
  for (const [k, n] of Object.entries(actual)) {
    if (manifest?.counts?.[k] !== n) fail("manifest.json", `counts.${k} is ${manifest?.counts?.[k]}, but the files hold ${n}`);
  }

  return problems;
}

// ---------- Write ----------

const at = (position) => (row) => ({ ...row, position });

// Upsert one row per item by slug; returns slug → id.
async function upsertBySlug(model, items, toData) {
  const ids = new Map();
  for (let i = 0; i < items.length; i++) {
    const data = { ...toData(items[i]), position: i };
    const row = await model.upsert({
      where: { slug: items[i].slug },
      update: data,
      create: { slug: items[i].slug, ...data },
      select: { id: true },
    });
    ids.set(items[i].slug, row.id);
  }
  return ids;
}

async function write(tx, c) {
  const { words, surahs, basics, scenarios, hidden, roots } = c;

  // 1. Clear every list. They are rebuilt in full below, and clearing them
  //    first frees the parent rows that are about to be removed.
  await tx.wordAppearance.deleteMany();
  await tx.surahVerse.deleteMany();
  await tx.basicsCategoryWord.deleteMany();
  await tx.basicsDialogueTurn.deleteMany();
  await tx.scenarioTurn.deleteMany();
  await tx.hiddenEntry.deleteMany();
  await tx.rootFamilyMember.deleteMany();
  await tx.hiddenPersianWord.deleteMany();
  await tx.hiddenMixedWord.deleteMany();
  await tx.hiddenEnglishWord.deleteMany();

  // 2. Upsert the parents by slug, so unchanged rows keep their ids.
  const rootIds = await upsertBySlug(tx.root, roots, (r) => ({
    arabic: r.arabic,
    latin: r.latin,
    meaning: r.meaning,
    sortOrder: r.order ?? null,
    familyGlance: r.familyGlance ?? null,
  }));
  const surahIds = await upsertBySlug(tx.surah, surahs, (s) => ({
    banglaName: s.banglaName,
    arabicName: s.arabicName,
    englishName: s.englishName,
    mushafNumber: s.mushafNumber,
  }));
  const scenarioIds = await upsertBySlug(tx.scenario, scenarios, (s) => ({
    number: s.number,
    banglaTitle: s.banglaTitle,
    englishTitle: s.englishTitle,
    newWordsNote: s.newWordsNote,
  }));
  const basicsIds = await upsertBySlug(tx.basicsCategory, basics.categories, (b) => ({ title: b.title }));
  const dialogueIds = await upsertBySlug(tx.basicsDialogue, basics.dialogues, (d) => ({ title: d.title }));
  const hiddenIds = await upsertBySlug(tx.hiddenCategory, hidden.categories, (h) => ({ title: h.title }));
  const wordIds = await upsertBySlug(tx.word, words, (w) => ({
    arabic: w.arabic,
    transliteration: w.transliteration,
    english: w.english,
    bangla: w.bangla,
    rootId: w.root === undefined ? null : rootIds.get(w.root),
  }));

  // 3. Remove parents no longer in the JSON. Words go first: they may point
  //    at a root that is about to go.
  const notIn = (ids) => ({ slug: { notIn: [...ids.keys()] } });
  const removed = {
    words: (await tx.word.deleteMany({ where: notIn(wordIds) })).count,
    roots: (await tx.root.deleteMany({ where: notIn(rootIds) })).count,
    surahs: (await tx.surah.deleteMany({ where: notIn(surahIds) })).count,
    scenarios: (await tx.scenario.deleteMany({ where: notIn(scenarioIds) })).count,
    basicsCategories: (await tx.basicsCategory.deleteMany({ where: notIn(basicsIds) })).count,
    basicsDialogues: (await tx.basicsDialogue.deleteMany({ where: notIn(dialogueIds) })).count,
    hiddenCategories: (await tx.hiddenCategory.deleteMany({ where: notIn(hiddenIds) })).count,
  };

  // 4. Rebuild the lists.
  await tx.surahVerse.createMany({
    data: surahs.flatMap((s) =>
      s.verses.map((v, i) => ({
        surahId: surahIds.get(s.slug),
        position: i,
        ayah: v.ayah,
        wordId: wordIds.get(v.wordSlug),
        arabic: v.arabic,
        transliteration: v.transliteration,
        english: v.english,
        bangla: v.bangla,
      })),
    ),
  });
  await tx.basicsCategoryWord.createMany({
    data: basics.categories.flatMap((b) =>
      b.wordSlugs.map((slug, i) => ({
        categoryId: basicsIds.get(b.slug),
        position: i,
        wordId: wordIds.get(slug),
      })),
    ),
  });
  const turn = (t) => ({
    speaker: t.speaker,
    arabic: t.arabic,
    transliteration: t.transliteration,
    english: t.english,
    bangla: t.bangla,
  });
  await tx.basicsDialogueTurn.createMany({
    data: basics.dialogues.flatMap((d) =>
      d.turns.map((t, i) => at(i)({ dialogueId: dialogueIds.get(d.slug), ...turn(t) })),
    ),
  });
  await tx.scenarioTurn.createMany({
    data: scenarios.flatMap((s) =>
      s.turns.map((t, i) => at(i)({ scenarioId: scenarioIds.get(s.slug), ...turn(t) })),
    ),
  });
  await tx.hiddenEntry.createMany({
    data: hidden.categories.flatMap((h) =>
      h.entries.map((e, i) =>
        at(i)({
          categoryId: hiddenIds.get(h.slug),
          bangla: e.bangla,
          arabic: e.arabic,
          transliteration: e.transliteration,
          arabicMeaning: e.arabicMeaning,
          note: e.note,
        }),
      ),
    ),
  });
  await tx.hiddenPersianWord.createMany({ data: hidden.persianNotArabic.map((x, i) => at(i)({ ...x })) });
  await tx.hiddenMixedWord.createMany({ data: hidden.mixed.map((x, i) => at(i)({ ...x })) });
  await tx.hiddenEnglishWord.createMany({ data: hidden.english.map((x, i) => at(i)({ ...x })) });
  await tx.rootFamilyMember.createMany({
    data: roots.flatMap((r) =>
      r.family.map((m, i) =>
        at(i)({
          rootId: rootIds.get(r.slug),
          arabic: m.arabic,
          transliteration: m.transliteration,
          pattern: m.pattern,
          meaning: m.meaning,
          note: m.note,
        }),
      ),
    ),
  });
  await tx.wordAppearance.createMany({
    data: words.flatMap((w) =>
      w.appearances.map((a, i) => ({
        wordId: wordIds.get(w.slug),
        position: i,
        source: a.source,
        surahId: a.source === "surah" ? surahIds.get(a.surah) : null,
        verse: a.source === "surah" ? a.verse : null,
        basicsCategoryId: a.source === "basics" ? basicsIds.get(a.category) : null,
        scenarioId: a.source === "scenario" ? scenarioIds.get(a.scenario) : null,
        hiddenCategoryId: a.source === "hidden" ? hiddenIds.get(a.category) : null,
        banglaWord: a.source === "hidden" ? a.banglaWord : null,
        rootId: a.source === "root" ? rootIds.get(a.root) : null,
        pattern: a.source === "root" ? a.pattern : null,
      })),
    ),
  });

  return removed;
}

// ---------- Verify ----------

// Rebuild every JSON file from the database, in the files' own shapes.
async function readBack(tx) {
  const byPosition = { orderBy: { position: "asc" } };
  const [words, surahs, basicsCategories, dialogues, scenarios, hiddenCategories, persian, mixed, english, roots] =
    await Promise.all([
      tx.word.findMany({
        ...byPosition,
        include: {
          root: true,
          appearances: {
            ...byPosition,
            include: { surah: true, basicsCategory: true, scenario: true, hiddenCategory: true, root: true },
          },
        },
      }),
      tx.surah.findMany({ ...byPosition, include: { verses: { ...byPosition, include: { word: true } } } }),
      tx.basicsCategory.findMany({ ...byPosition, include: { words: { ...byPosition, include: { word: true } } } }),
      tx.basicsDialogue.findMany({ ...byPosition, include: { turns: byPosition } }),
      tx.scenario.findMany({ ...byPosition, include: { turns: byPosition } }),
      tx.hiddenCategory.findMany({ ...byPosition, include: { entries: byPosition } }),
      tx.hiddenPersianWord.findMany(byPosition),
      tx.hiddenMixedWord.findMany(byPosition),
      tx.hiddenEnglishWord.findMany(byPosition),
      tx.root.findMany({ ...byPosition, include: { family: byPosition } }),
    ]);

  const turn = (t) => ({
    speaker: t.speaker,
    arabic: t.arabic,
    transliteration: t.transliteration,
    english: t.english,
    bangla: t.bangla,
  });
  const appearance = (a) => {
    switch (a.source) {
      case "surah":
        return { source: a.source, surah: a.surah?.slug, surahName: a.surah?.banglaName, verse: a.verse };
      case "basics":
        return { source: a.source, category: a.basicsCategory?.slug };
      case "scenario":
        return { source: a.source, scenario: a.scenario?.slug };
      case "hidden":
        return { source: a.source, category: a.hiddenCategory?.slug, banglaWord: a.banglaWord };
      case "root":
        return { source: a.source, root: a.root?.slug, pattern: a.pattern };
      default:
        return { source: a.source };
    }
  };

  return {
    words: words.map((w) => ({
      slug: w.slug,
      arabic: w.arabic,
      transliteration: w.transliteration,
      english: w.english,
      bangla: w.bangla,
      appearances: w.appearances.map(appearance),
      ...(w.root ? { root: w.root.slug } : {}),
    })),
    surahs: surahs.map((s) => ({
      slug: s.slug,
      banglaName: s.banglaName,
      arabicName: s.arabicName,
      englishName: s.englishName,
      mushafNumber: s.mushafNumber,
      verses: s.verses.map((v) => ({
        ayah: v.ayah,
        wordSlug: v.word.slug,
        arabic: v.arabic,
        transliteration: v.transliteration,
        english: v.english,
        bangla: v.bangla,
      })),
    })),
    basics: {
      categories: basicsCategories.map((b) => ({
        slug: b.slug,
        title: b.title,
        wordSlugs: b.words.map((l) => l.word.slug),
      })),
      dialogues: dialogues.map((d) => ({ slug: d.slug, title: d.title, turns: d.turns.map(turn) })),
    },
    scenarios: scenarios.map((s) => ({
      slug: s.slug,
      number: s.number,
      banglaTitle: s.banglaTitle,
      englishTitle: s.englishTitle,
      turns: s.turns.map(turn),
      newWordsNote: s.newWordsNote,
    })),
    hidden: {
      categories: hiddenCategories.map((h) => ({
        slug: h.slug,
        title: h.title,
        entries: h.entries.map((e) => ({
          bangla: e.bangla,
          arabic: e.arabic,
          transliteration: e.transliteration,
          arabicMeaning: e.arabicMeaning,
          note: e.note,
        })),
      })),
      persianNotArabic: persian.map((x) => ({ bangla: x.bangla, persian: x.persian, note: x.note })),
      mixed: mixed.map((x) => ({ bangla: x.bangla, structure: x.structure, note: x.note })),
      english: english.map((x) => ({ english: x.english, arabic: x.arabic, meaning: x.meaning })),
    },
    roots: roots.map((r) => ({
      slug: r.slug,
      arabic: r.arabic,
      latin: r.latin,
      meaning: r.meaning,
      ...(r.sortOrder === null ? {} : { order: r.sortOrder }),
      ...(r.familyGlance === null ? {} : { familyGlance: r.familyGlance }),
      family: r.family.map((m) => ({
        arabic: m.arabic,
        transliteration: m.transliteration,
        pattern: m.pattern,
        meaning: m.meaning,
        note: m.note,
      })),
    })),
  };
}

// Every difference between two JSON values, up to `limit`. Object key order
// is ignored; array order, key presence and values must all match.
function differences(a, b, where = "", out = [], limit = 20) {
  if (out.length >= limit) return out;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) out.push(`${where}: list vs non-list`);
    else {
      if (a.length !== b.length) out.push(`${where}: ${a.length} items in the file, ${b.length} in the database`);
      for (let i = 0; i < Math.min(a.length, b.length); i++) differences(a[i], b[i], `${where}[${i}]`, out, limit);
    }
  } else if (a && b && typeof a === "object" && typeof b === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) out.push(`${where}.${k}: only in the database`);
      else if (!(k in b)) out.push(`${where}.${k}: missing from the database`);
      else differences(a[k], b[k], `${where}.${k}`, out, limit);
    }
  } else if (a !== b) {
    out.push(`${where}: file ${JSON.stringify(a)} ≠ database ${JSON.stringify(b)}`);
  }
  return out;
}

// ---------- Main ----------

function describeTarget() {
  try {
    const u = new URL(process.env.DATABASE_URL);
    return `${u.hostname}:${u.port || 3306}/${u.pathname.slice(1)}`;
  } catch {
    return "(DATABASE_URL not set)";
  }
}

async function main() {
  const content = loadContent();
  const problems = validate(content);
  if (problems.length) {
    console.error(`❌ The content files have ${problems.length} problem(s); nothing was written:`);
    for (const p of problems.slice(0, 50)) console.error(`   - ${p}`);
    if (problems.length > 50) console.error(`   … and ${problems.length - 50} more`);
    process.exitCode = 1;
    return;
  }

  try {
    await prisma.word.count();
  } catch (e) {
    if (e?.code === "P2021") {
      console.error("❌ The content tables don't exist yet. Run `npm run db:push` first.");
      process.exitCode = 1;
      return;
    }
    throw e;
  }

  if (DRY_RUN) {
    console.log("✓ Content files are valid (dry run — nothing was written).");
    return;
  }

  const removed = await prisma.$transaction(
    async (tx) => {
      const removed = await write(tx, content);
      const { manifest, ...files } = content;
      const diffs = differences(files, await readBack(tx));
      if (diffs.length) {
        throw new Error(
          `Database doesn't match the content files; everything was rolled back.\n   - ${diffs.join("\n   - ")}`,
        );
      }
      await tx.contentSync.create({
        data: { generatedAt: new Date(manifest.generatedAt), counts: manifest.counts },
      });
      return removed;
    },
    { maxWait: 10_000, timeout: 300_000 },
  );

  console.log(`✓ Content seeded into ${describeTarget()} and verified.`);
  const gone = Object.entries(removed).filter(([, n]) => n);
  if (gone.length) console.log(`  Removed, no longer in the files: ${gone.map(([k, n]) => `${n} ${k}`).join(", ")}`);
}

main()
  .catch((e) => {
    console.error("❌ Content seed failed:", e.message ?? e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
