import WordTraceBuilder from '../WordTraceBuilder';

export const metadata = { title: 'New trace word' };

export default function CreateWordTracePage() {
  return <WordTraceBuilder mode="create" />;
}
