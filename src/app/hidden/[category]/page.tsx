import { notFound } from 'next/navigation';
import { getHidden, getHiddenCategory } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { HiddenCategoryClient } from './HiddenCategoryClient';

// Re-read the content from the database at most every 5 minutes; a slug
// added since the build is rendered on first visit.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getHidden()).categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const c = await getHiddenCategory(params.category);
  if (!c) return pageMetadata({ title: 'Hidden Arabic', description: '', path: '/hidden/' });
  return pageMetadata({
    title: `${c.title} — Arabic in Bangla`,
    description: `${c.entries.length} Bangla words with Arabic origin in the category "${c.title}". Each entry shows the Bangla word, its Arabic root, and the original meaning.`,
    path: `/hidden/${c.slug}/`,
  });
}

export default async function HiddenCategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const c = await getHiddenCategory(params.category);
  if (!c) notFound();
  return <HiddenCategoryClient category={c} />;
}
