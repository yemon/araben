import { JsonLd } from '@/components/JsonLd';
import {
  getAllRoots,
  getAllScenarios,
  getAllSurahs,
  getAllWords,
  getBasics,
} from '@/lib/content';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { HomeClient } from './HomeClient';

export const metadata = pageMetadata({
  title: siteConfig.name,
  description: siteConfig.tagline,
  path: '/',
});

export default function Home() {
  const words = getAllWords();
  const surahs = getAllSurahs();
  const scenarios = getAllScenarios();
  const roots = getAllRoots();
  const basics = getBasics();

  const stats = {
    words: words.length,
    surahs: surahs.length,
    scenarios: scenarios.length,
    roots: roots.length,
    basicsCategories: basics.categories.length,
    verses: surahs.reduce((n, s) => n + s.verses.length, 0),
  };

  const featuredSlugs = ['salam', 'shukran', 'uridu', 'kitab', 'bayt', 'ana'];
  const featuredWords = featuredSlugs
    .map((slug) => words.find((w) => w.slug === slug))
    .filter(Boolean)
    .map((w) => ({
      slug: w!.slug,
      arabic: w!.arabic,
      transliteration: w!.transliteration,
    }));

  const courseLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Learn Arabic — Bangla & English',
    description: siteConfig.tagline,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    inLanguage: ['bn', 'en', 'ar'],
    teaches: [
      'Basic Arabic conversation',
      'Modern Standard Arabic (Fusha)',
      'Quranic vocabulary',
      'Arabic root system',
    ],
  };

  return (
    <>
      <JsonLd data={courseLd} />
      <HomeClient stats={stats} featuredWords={featuredWords} />
    </>
  );
}
