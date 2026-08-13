import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import {
  audioUrl,
  getAllWords,
  getRelatedWords,
  getWord,
} from '@/lib/content';
import { pageMetadata, siteConfig } from '@/lib/seo';
import { WordClient } from './WordClient';
import type { Appearance } from '@/types/content';

export function generateStaticParams() {
  return getAllWords().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const w = getWord(params.slug);
  if (!w) return pageMetadata({ title: 'Word', description: '', path: '/word/' });
  const desc = `${w.arabic} (${w.transliteration}) — Arabic word meaning "${w.english}"${
    w.bangla ? `, বাংলা: ${w.bangla}` : ''
  }. See where it appears and words in its family.`;
  return pageMetadata({
    title: `${w.transliteration} — ${w.english}`,
    description: desc,
    path: `/word/${w.slug}/`,
    extraKeywords: [w.transliteration, w.english, w.arabic],
  });
}

function appearanceLabel(a: Appearance): { label: string; href: string } {
  switch (a.source) {
    case 'surah':
      return {
        label: `Surah ${a.surahName}${a.verse ? ' · v' + a.verse : ''}`,
        href: `/surahs/${a.surah}/`,
      };
    case 'basics':
      return { label: `Basics · ${a.category}`, href: `/basics/${a.category}/` };
    case 'scenario':
      return { label: `Scenario · ${a.scenario}`, href: `/scenarios/${a.scenario}/` };
    case 'hidden':
      return {
        label: `Hidden · ${a.banglaWord}`,
        href: `/hidden/${a.category}/`,
      };
    case 'root':
      return { label: `Root · ${a.root}`, href: `/roots/${a.root}/` };
  }
}

export default async function WordPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const w = getWord(params.slug);
  if (!w) notFound();
  const related = getRelatedWords(w, 8);
  const audio = audioUrl(w.slug);
  const appearances = w.appearances.map(appearanceLabel);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${siteConfig.url}/word/${w.slug}/`,
    name: w.transliteration,
    alternateName: [w.arabic, w.bangla].filter(Boolean),
    description: w.english,
    inLanguage: 'ar',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'araben.study Arabic vocabulary',
      url: `${siteConfig.url}/`,
    },
    ...(audio && {
      audio: { '@type': 'AudioObject', contentUrl: `${siteConfig.url}${audio}` },
    }),
  };

  return (
    <>
      <JsonLd data={ld} />
      <WordClient
        word={w}
        audioSrc={audio}
        appearances={appearances}
        related={related}
      />
    </>
  );
}
