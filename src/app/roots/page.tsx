import { getAllRoots } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { RootsClient } from './RootsClient';

export const metadata = pageMetadata({
  title: 'Root system — Arabic word families',
  description:
    'Arabic is built from 3-letter roots that grow into whole families of words. Learn 36 essential roots and unlock hundreds of related words.',
  path: '/roots/',
});

export default function RootsPage() {
  return <RootsClient roots={getAllRoots()} />;
}
