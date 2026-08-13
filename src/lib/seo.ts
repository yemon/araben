import type { Metadata } from 'next';

export const siteConfig = {
  name: 'araben.study',
  title: 'araben.study — Learn Arabic for Bangla & English speakers',
  tagline: 'A calm, self-paced guide to Arabic conversation, the Qur’an, and the root system that powers the language.',
  url: 'https://araben.study',
  locale: 'en_US',
  keywords: [
    'learn Arabic',
    'Arabic for Bangla speakers',
    'আরবি শেখা',
    'Arabic vocabulary',
    'Arabic root system',
    'basic Arabic conversation',
    'Quran word by word',
    'Arabic words in Bangla',
    'Modern Standard Arabic',
    'Fusha',
  ],
};

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  extraKeywords?: string[];
}): Metadata {
  const fullTitle =
    input.title === siteConfig.name ? siteConfig.title : `${input.title} — ${siteConfig.name}`;
  const url = `${siteConfig.url}${input.path.startsWith('/') ? '' : '/'}${input.path}`;

  return {
    // absolute prevents the root layout template from re-appending the site name
    title: { absolute: fullTitle },
    description: input.description,
    keywords: [...siteConfig.keywords, ...(input.extraKeywords || [])].join(', '),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: input.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  };
}
