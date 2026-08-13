import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

// Required when output: 'export' is set (Next 15+ makes these routes dynamic by default).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
