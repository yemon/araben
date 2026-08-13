import { getAllScenarios } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { ScenariosClient } from './ScenariosClient';

export const metadata = pageMetadata({
  title: 'Real-life scenarios',
  description:
    'Ten Arabic dialogues for real situations — restaurant, taxi, directions, hotel, immigration, market, pharmacy, mosque, calls, and lost items. Each one uses vocabulary you already know.',
  path: '/scenarios/',
});

export default function ScenariosPage() {
  return <ScenariosClient scenarios={getAllScenarios()} />;
}
