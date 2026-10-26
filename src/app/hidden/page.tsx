import { getHidden } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { HiddenClient } from './HiddenClient';

export const metadata = pageMetadata({
  title: 'Arabic hidden in Bangla',
  description:
    "170+ Bangla words that are secretly Arabic — from আদালত to কিতাব. Rewires how you hear the language.",
  path: '/hidden/',
});

// Re-read the content from the database at most every 5 minutes.
export const revalidate = 300;

export default async function HiddenPage() {
  return <HiddenClient hidden={await getHidden()} />;
}
