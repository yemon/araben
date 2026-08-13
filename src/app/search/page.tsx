import { getAllWords } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { SearchClient } from './SearchClient';

export const metadata = pageMetadata({
  title: 'Search Arabic words',
  description:
    'Search 800+ Arabic words by Arabic script, transliteration, English or Bangla meaning. Instant, offline, in-browser.',
  path: '/search/',
});

export default function SearchPage() {
  const words = getAllWords().map((w) => ({
    slug: w.slug,
    arabic: w.arabic,
    transliteration: w.transliteration,
    english: w.english,
    bangla: w.bangla,
  }));

  return <SearchClient words={words} />;
}
