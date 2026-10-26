import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import {
  audioUrl,
  getBasics,
  getBasicsCategory,
  getWord,
} from '@/lib/content';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { CategoryClient } from './CategoryClient';

// Re-read the content from the database at most every 5 minutes; a slug
// added since the build is rendered on first visit.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getBasics()).categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const cat = await getBasicsCategory(params.category);
  if (!cat) return pageMetadata({ title: 'Basics', description: '', path: '/basics/' });
  return pageMetadata({
    title: `${cat.title} — Arabic basics`,
    description: `${cat.wordSlugs.length} common Arabic ${cat.title.toLowerCase()} with transliteration, English, and Bangla meaning. Each word has its own page.`,
    path: `/basics/${cat.slug}/`,
    extraKeywords: [cat.title, 'Arabic vocabulary'],
  });
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const cat = await getBasicsCategory(params.category);
  if (!cat) notFound();

  const words = (await Promise.all(cat.wordSlugs.map((s) => getWord(s))))
    .filter((w) => w !== undefined)
    .map((w) => ({ ...w, audioSrc: audioUrl(w.slug) }));

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Arabic ${cat.title}`,
    itemListElement: words.map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteConfig.url}/word/${w.slug}/`,
      name: w.transliteration,
    })),
  };

  return (
    <>
      <JsonLd data={ld} />
      <CategoryClient
        categorySlug={cat.slug}
        categoryTitle={cat.title}
        words={words}
      />
    </>
  );
}
