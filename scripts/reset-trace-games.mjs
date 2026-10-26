/**
 * Reset trace games script
 * Deletes all existing trace games and reseeds with proper English slugs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Resetting trace games...');

  // Get the word-trace game type
  const gameType = await prisma.gameType.findUnique({
    where: { code: 'word-trace' },
  });

  if (gameType) {
    // Delete all existing trace games
    const deletedGames = await prisma.game.deleteMany({
      where: { gameTypeId: gameType.id },
    });

    console.log(`✓ Deleted ${deletedGames.count} existing trace games`);
  }

  console.log('✅ Database cleaned! Now run: npm run db:seed');
}

main()
  .catch((e) => {
    console.error('❌ Reset failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
