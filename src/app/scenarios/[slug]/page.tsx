import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { getAllScenarios, getScenario } from '@/lib/content';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { ScenarioClient } from './ScenarioClient';

export function generateStaticParams() {
  return getAllScenarios().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const s = getScenario(params.slug);
  if (!s) return pageMetadata({ title: 'Scenario', description: '', path: '/scenarios/' });
  return pageMetadata({
    title: `${s.englishTitle} — Arabic dialogue`,
    description: `Learn the Arabic dialogue for "${s.englishTitle.toLowerCase()}" (${s.banglaTitle}). Full Arabic script, transliteration, English and Bangla, plus the new vocabulary you'll pick up.`,
    path: `/scenarios/${s.slug}/`,
    extraKeywords: [s.englishTitle, 'Arabic conversation'],
  });
}

export default async function ScenarioPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const s = getScenario(params.slug);
  if (!s) notFound();
  const all = getAllScenarios();
  const idx = all.findIndex((x) => x.slug === s.slug);
  const prev = idx > 0 ? { slug: all[idx - 1].slug, title: all[idx - 1].englishTitle } : null;
  const next =
    idx < all.length - 1
      ? { slug: all[idx + 1].slug, title: all[idx + 1].englishTitle }
      : null;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${s.englishTitle} — Arabic dialogue`,
    inLanguage: ['ar', 'en', 'bn'],
    learningResourceType: 'Dialogue',
    educationalLevel: 'Beginner',
    url: `${siteConfig.url}/scenarios/${s.slug}/`,
  };

  return (
    <>
      <JsonLd data={ld} />
      <ScenarioClient scenario={s} prev={prev} next={next} />
    </>
  );
}
