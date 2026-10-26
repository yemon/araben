import type { Metadata } from 'next';

// Admin screens are tools, not content: keep them out of search results.
export const metadata: Metadata = {
  title: { default: 'araben admin', template: '%s · araben admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
