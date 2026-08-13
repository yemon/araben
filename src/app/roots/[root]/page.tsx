import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { getAllRoots, getRoot } from '@/lib/content';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { RootClient } from './RootClient';

export function generateStaticParams() {
  return getAllRoots().map((r) => ({ root: r.slug }));
}

export async function generateMetadata(props: { params: Promise<{ root: string }> }) {
  const params = await props.params;
  const r = getRoot(params.root);
  if (!r) return pageMetadata({ title: 'Root', description: '', path: '/roots/' });
  return pageMetadata({
    title: `Root ${r.latin} — ${r.meaning}`,
    description: `Arabic root ${r.arabic} (${r.latin}) means "${r.meaning}". See its whole family of derived words: doer, place, tool, and more.`,
    path: `/roots/${r.slug}/`,
    extraKeywords: [`Arabic root ${r.latin}`, r.meaning],
  });
}

export default async function RootPage(props: { params: Promise<{ root: string }> }) {
  const params = await props.params;
  const r = getRoot(params.root);
  if (!r) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: r.latin,
    alternateName: r.arabic,
    description: `Arabic root meaning ${r.meaning}`,
    inLanguage: 'ar',
    url: `${siteConfig.url}/roots/${r.slug}/`,
  };

  return (
    <>
      <JsonLd data={ld} />
      <RootClient root={r} />
    </>
  );
}
