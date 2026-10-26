import { getAllWords } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { SearchClient } from './SearchClient';

export const metadata = pageMetadata({
  title: 'Search Arabic words',
  description:
    'Search 800+ Arabic words by Arabic script, transliteration, English or Bangla meaning. Instant, offline, in-browser.',
  path: '/search/',
});

// Re-read the content from the database at most every 5 minutes.
export const revalidate = 300;

export default async function SearchPage() {
  const words = (await getAllWords()).map((w) => ({
    slug: w.slug,
    arabic: w.arabic,
    transliteration: w.transliteration,
    english: w.english,
    bangla: w.bangla,
  }));

  return <SearchClient words={words} />;
}
