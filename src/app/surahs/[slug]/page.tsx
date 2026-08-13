import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { getAllSurahs, getSurah } from '@/lib/content';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { SurahClient } from './SurahClient';

export function generateStaticParams() {
  return getAllSurahs().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const s = getSurah(params.slug);
  if (!s) return pageMetadata({ title: 'Surah', description: '', path: '/surahs/' });
  return pageMetadata({
    title: `Surah ${s.englishName} — word by word`,
    description: `Every word of Surah ${s.englishName} (${s.banglaName}) — Arabic, transliteration, English and Bangla meaning. Mushaf #${s.mushafNumber}.`,
    path: `/surahs/${s.slug}/`,
    extraKeywords: [`Surah ${s.englishName}`, s.banglaName],
  });
}

export default async function SurahPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const s = getSurah(params.slug);
  if (!s) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `Surah ${s.englishName} — word-by-word`,
    inLanguage: ['ar', 'en', 'bn'],
    learningResourceType: 'ReferenceMaterial',
    url: `${siteConfig.url}/surahs/${s.slug}/`,
  };

  return (
    <>
      <JsonLd data={ld} />
      <SurahClient surah={s} />
    </>
  );
}
