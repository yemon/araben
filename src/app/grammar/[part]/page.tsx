import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import {
  GRAMMAR_PARTS,
  getGrammarNeighbours,
  getGrammarPart,
} from '@/lib/grammar';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { PartClient } from './PartClient';

export function generateStaticParams() {
  return GRAMMAR_PARTS.map((p) => ({ part: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ part: string }> }) {
  const params = await props.params;
  const p = getGrammarPart(params.part);
  if (!p) return pageMetadata({ title: 'Grammar', description: '', path: '/grammar/' });
  return pageMetadata({
    title: `${p.title.en} — Arabic grammar`,
    description: p.lead.en,
    path: `/grammar/${p.slug}/`,
    extraKeywords: p.keywords,
  });
}

export default async function GrammarPartPage(props: { params: Promise<{ part: string }> }) {
  const params = await props.params;
  const p = getGrammarPart(params.part);
  if (!p) notFound();
  const { prev, next } = getGrammarNeighbours(p.slug);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${p.title.en} — Arabic grammar`,
    inLanguage: ['en', 'bn', 'ar'],
    learningResourceType: 'Chapter',
    educationalLevel: 'Beginner',
    isPartOf: {
      '@type': 'Course',
      name: 'Arabic grammar for Bangla and English speakers',
      url: `${siteConfig.url}/grammar/`,
    },
    url: `${siteConfig.url}/grammar/${p.slug}/`,
  };

  return (
    <>
      <JsonLd data={ld} />
      <PartClient parts={GRAMMAR_PARTS} part={p} prev={prev} next={next} />
    </>
  );
}
