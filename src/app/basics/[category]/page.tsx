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

export function generateStaticParams() {
  return getBasics().categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const cat = getBasicsCategory(params.category);
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
  const cat = getBasicsCategory(params.category);
  if (!cat) notFound();

  const words = cat.wordSlugs
    .map((s) => getWord(s))
    .filter(Boolean)
    .map((w) => ({ ...(w as NonNullable<typeof w>), audioSrc: audioUrl((w as any).slug) }));

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
