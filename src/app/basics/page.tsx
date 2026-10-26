import { getBasics } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { BasicsClient } from './BasicsClient';

export const metadata = pageMetadata({
  title: 'Arabic basics',
  description:
    '120+ everyday Arabic words in 10 categories — pronouns, verbs, nouns, greetings, numbers, particles — plus three warm-up dialogues to say them out loud.',
  path: '/basics/',
});

// Re-read the content from the database at most every 5 minutes.
export const revalidate = 300;

export default async function BasicsPage() {
  return <BasicsClient basics={await getBasics()} />;
}
