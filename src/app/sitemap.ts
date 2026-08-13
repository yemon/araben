import type { MetadataRoute } from 'next';
import {
  getAllRoots,
  getAllScenarios,
  getAllSurahs,
  getAllWords,
  getBasics,
  getHidden,
} from '@/lib/content';
import { LETTERS } from '@/lib/alphabet';
import { GRAMMAR_PARTS } from '@/lib/grammar';
import { siteConfig } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticRoutes = [
    '/',
    '/alphabet/',
    '/grammar/',
    '/basics/',
    '/scenarios/',
    '/surahs/',
    '/roots/',
    '/hidden/',
    '/search/',
    '/about/',
  ].map((p) => ({ url: base + p, lastModified: now, changeFrequency: 'monthly' as const, priority: p === '/' ? 1.0 : 0.8 }));

  const letterRoutes = LETTERS.map((l) => ({
    url: `${base}/alphabet/${l.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const grammarRoutes = GRAMMAR_PARTS.map((p) => ({
    url: `${base}/grammar/${p.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const wordRoutes = getAllWords().map((w) => ({
    url: `${base}/word/${w.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));

  const surahRoutes = getAllSurahs().map((s) => ({
    url: `${base}/surahs/${s.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const scenarioRoutes = getAllScenarios().map((s) => ({
    url: `${base}/scenarios/${s.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const rootRoutes = getAllRoots().map((r) => ({
    url: `${base}/roots/${r.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const basicsRoutes = getBasics().categories.map((c) => ({
    url: `${base}/basics/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const hiddenRoutes = getHidden().categories.map((c) => ({
    url: `${base}/hidden/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...letterRoutes,
    ...grammarRoutes,
    ...basicsRoutes,
    ...surahRoutes,
    ...scenarioRoutes,
    ...rootRoutes,
    ...hiddenRoutes,
    ...wordRoutes,
  ];
}
