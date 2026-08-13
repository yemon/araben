import { JsonLd } from '@/components/JsonLd';
import { GRAMMAR_PARTS } from '@/lib/grammar';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { GrammarHubClient } from './GrammarHubClient';

export const metadata = pageMetadata({
  title: 'Arabic grammar — a beginner’s map',
  description:
    "A calm, 13-page working reference to Modern Standard Arabic grammar for Bangla and English speakers. Sentence types, iḍāfa, verbs, kāna and inna, worked examples, and interactive parsers.",
  path: '/grammar/',
  extraKeywords: [
    'Arabic grammar',
    'আরবি ব্যাকরণ',
    'MSA',
    'iḍāfa',
    'kāna',
    'inna',
    'nominal sentence',
    'verbal sentence',
    'iʿrāb',
  ],
});

export default function GrammarHubPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Arabic grammar — a beginner’s map',
    description:
      'A 13-part beginner reference to Modern Standard Arabic grammar with interactive sentence parsers, case flippers, and side-by-side Bangla + English.',
    provider: { '@type': 'Organization', name: siteConfig.name, sameAs: siteConfig.url },
    inLanguage: ['en', 'bn', 'ar'],
    url: `${siteConfig.url}/grammar/`,
    numberOfCredits: GRAMMAR_PARTS.length,
  };
  return (
    <>
      <JsonLd data={ld} />
      <GrammarHubClient parts={GRAMMAR_PARTS} />
    </>
  );
}
