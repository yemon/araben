import { getAllScenarios } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { ScenariosClient } from './ScenariosClient';

export const metadata = pageMetadata({
  title: 'Real-life scenarios',
  description:
    'Twelve Arabic dialogues for real situations — restaurant, taxi, directions, hotel, immigration, market, pharmacy, mosque, calls, lost items, café and grocery shop. Each one uses vocabulary you already know.',
  path: '/scenarios/',
});

// Re-read the content from the database at most every 5 minutes.
export const revalidate = 300;

export default async function ScenariosPage() {
  return <ScenariosClient scenarios={await getAllScenarios()} />;
}
