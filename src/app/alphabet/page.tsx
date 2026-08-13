import { JsonLd } from '@/components/JsonLd';
import { LETTERS } from '@/lib/alphabet';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { AlphabetClient } from './AlphabetClient';

export const metadata = pageMetadata({
  title: 'Arabic alphabet — 28 letters with harakāt',
  description:
    "The 28 letters of the Arabic alphabet (ḥurūf al-hijā'iyyah) with English and Bangla pronunciation, plus every fatḥah, kasrah and ḍammah form for each letter. Beginner-friendly, tap-through cards.",
  path: '/alphabet/',
  extraKeywords: [
    'Arabic alphabet',
    'হুরুফ',
    'হারাকাত',
    'harakat',
    'fatha',
    'kasra',
    'damma',
    'Qaida Noorania',
  ],
});

export default function AlphabetPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Arabic alphabet — hurūf al-hijā’iyyah',
    inLanguage: ['ar', 'en', 'bn'],
    learningResourceType: 'ReferenceMaterial',
    educationalLevel: 'Beginner',
    url: `${siteConfig.url}/alphabet/`,
    numberOfItems: LETTERS.length,
  };
  return (
    <>
      <JsonLd data={ld} />
      <AlphabetClient />
    </>
  );
}
