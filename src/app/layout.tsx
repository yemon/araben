import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { themeInitScript } from '@/components/ThemeToggle';
import { siteConfig } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { LangProvider, langInitScript } from '@/lib/i18n/LangProvider';
import { fontVariables } from '@/lib/fonts';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  applicationName: siteConfig.name,
  authors: [{ name: 'araben.study' }],
  generator: 'Next.js',
  keywords: siteConfig.keywords,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.tagline,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eef1f4' },
    { media: '(prefers-color-scheme: dark)', color: '#1c2027' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    inLanguage: ['bn', 'en', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="bn" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
      </head>
      <body>
        <LangProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-accent focus:text-[color:var(--accent-fg)]"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </LangProvider>
        <JsonLd data={siteLd} />
      </body>
    </html>
  );
}
