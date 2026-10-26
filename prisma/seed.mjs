/**
 * Seed script for araben trace game database
 * Seeds the database with:
 * - Game type (word-trace)
 * - Sample Arabic words for tracing, fully vowelled the way a primer
 *   writes them — the tracer draws each letter's harakat (fatha, damma,
 *   kasra, tanween, sukun) as strokes of their own after the letter.
 *   Safe to re-run: existing games are updated in place, word included.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create game type
  const gameType = await prisma.gameType.upsert({
    where: { code: "word-trace" },
    update: {},
    create: {
      code: "word-trace",
      name: "Word Trace",
      description: "Trace Arabic words by following the font outline",
    },
  });

  console.log("✓ Game type created:", gameType.code);

  // Sample Arabic words for trace game (from common Islamic/Arabic vocabulary).
  // At most 5 letters each — the trace player's cap; harakat don't count.
  const arabicWords = [
    {
      word: "سَلَامٌ",
      title: "Salām (Peace)",
      difficulty: "easy",
      slug: "arabic-word-salam",
    },
    {
      word: "كِتَابٌ",
      title: "Kitāb (Book)",
      difficulty: "easy",
      slug: "arabic-word-kitab",
    },
    {
      word: "قَلَمٌ",
      title: "Qalam (Pen)",
      difficulty: "easy",
      slug: "arabic-word-qalam",
    },
    {
      word: "بَيْتٌ",
      title: "Bayt (House)",
      difficulty: "easy",
      slug: "arabic-word-bayt",
    },
    {
      word: "مَاءٌ",
      title: "Māʾ (Water)",
      difficulty: "easy",
      slug: "arabic-word-maa",
    },
    {
      word: "شَمْسٌ",
      title: "Shams (Sun)",
      difficulty: "easy",
      slug: "arabic-word-shams",
    },
    {
      word: "قَمَرٌ",
      title: "Qamar (Moon)",
      difficulty: "easy",
      slug: "arabic-word-qamar",
    },
    {
      word: "بَابٌ",
      title: "Bāb (Door)",
      difficulty: "easy",
      slug: "arabic-word-bab",
    },
    {
      word: "يَدٌ",
      title: "Yad (Hand)",
      difficulty: "easy",
      slug: "arabic-word-yad",
    },
    {
      word: "عَيْنٌ",
      title: "ʿAyn (Eye)",
      difficulty: "easy",
      slug: "arabic-word-ayn",
    },
    {
      word: "مَدْرَسَةٌ",
      title: "Madrasa (School)",
      difficulty: "medium",
      slug: "arabic-word-madrasa",
    },
    {
      word: "مَسْجِدٌ",
      title: "Masjid (Mosque)",
      difficulty: "medium",
      slug: "arabic-word-masjid",
    },
    {
      word: "صَدِيقٌ",
      title: "Ṣadīq (Friend)",
      difficulty: "medium",
      slug: "arabic-word-sadiq",
    },
    {
      word: "طَعَامٌ",
      title: "Ṭaʿām (Food)",
      difficulty: "medium",
      slug: "arabic-word-taam",
    },
    {
      word: "شُكْرًا",
      title: "Shukran (Thank you)",
      difficulty: "medium",
      slug: "arabic-word-shukran",
    },
    {
      word: "مَرْحَبًا",
      title: "Marḥaban (Welcome)",
      difficulty: "medium",
      slug: "arabic-word-marhaban",
    },
    {
      word: "جَمِيلٌ",
      title: "Jamīl (Beautiful)",
      difficulty: "medium",
      slug: "arabic-word-jamil",
    },
    {
      word: "كَبِيرٌ",
      title: "Kabīr (Big)",
      difficulty: "medium",
      slug: "arabic-word-kabir",
    },
    {
      word: "صَغِيرٌ",
      title: "Ṣaghīr (Small)",
      difficulty: "medium",
      slug: "arabic-word-saghir",
    },
    {
      word: "طَوِيلٌ",
      title: "Ṭawīl (Long)",
      difficulty: "medium",
      slug: "arabic-word-tawil",
    },
  ];

  let createdCount = 0;

  for (const wordData of arabicWords) {
    const slug = wordData.slug;
    const description = `Trace the Arabic word: ${wordData.word}`;
    // NFKC puts stacked marks (shadda + vowel) in the order the player's
    // sanitiseWord keeps them; a word it would rewrite isn't traceable.
    const slide = {
      slideNumber: 1,
      data: { word: wordData.word.normalize("NFKC"), language: "ar" },
    };

    await prisma.game.upsert({
      where: { slug },
      // The word lives in the slide, so an existing game gets its slide
      // replaced too — otherwise re-seeding never changes a stored word.
      update: {
        title: wordData.title,
        description,
        difficulty: wordData.difficulty,
        status: "published",
        slides: { deleteMany: {}, create: slide },
      },
      create: {
        slug,
        title: wordData.title,
        description,
        gameTypeId: gameType.id,
        status: "published",
        difficulty: wordData.difficulty,
        slides: { create: slide },
      },
    });

    createdCount++;
  }

  console.log(`✓ Created/updated ${createdCount} Arabic trace words`);
  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
