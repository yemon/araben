import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { LETTERS, getLetter, getLetterNeighbours } from '@/lib/alphabet';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { LetterClient } from './LetterClient';

export function generateStaticParams() {
  return LETTERS.map((l) => ({ letter: l.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ letter: string }>;
}) {
  const params = await props.params;
  const l = getLetter(params.letter);
  if (!l) return pageMetadata({ title: 'Letter', description: '', path: '/alphabet/' });
  return pageMetadata({
    title: `${l.name} (${l.arabic}) — Arabic letter`,
    description: `The Arabic letter ${l.arabic} (${l.name}) — pronounced "${l.englishSound}". See its fatḥah, kasrah and ḍammah forms with English and Bangla pronunciation.`,
    path: `/alphabet/${l.slug}/`,
    extraKeywords: [`Arabic letter ${l.name}`, l.arabic, l.banglaSound],
  });
}

export default async function LetterPage(props: {
  params: Promise<{ letter: string }>;
}) {
  const params = await props.params;
  const l = getLetter(params.letter);
  if (!l) notFound();
  const { prev, next } = getLetterNeighbours(l.slug);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${siteConfig.url}/alphabet/${l.slug}/`,
    name: l.name,
    alternateName: [l.arabic, l.banglaSound],
    description: `Arabic letter ${l.name} — pronounced "${l.englishSound}". Includes fatḥah, kasrah, and ḍammah forms.`,
    inLanguage: 'ar',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Arabic alphabet',
      url: `${siteConfig.url}/alphabet/`,
    },
  };

  return (
    <>
      <JsonLd data={ld} />
      <LetterClient letter={l} prev={prev} next={next} />
    </>
  );
}
