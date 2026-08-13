'use client';

import Link from 'next/link';
import type { Word } from '@/types/content';
import { ArabicText } from './ArabicText';
import { AudioButton } from './AudioButton';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export function WordCard({
  word,
  audioSrc,
  compact = false,
}: {
  word: Word;
  audioSrc?: string | null;
  compact?: boolean;
}) {
  const t = useT();
  return (
    <article
      className="card card-hover p-5 flex flex-col gap-2"
      itemScope
      itemType="https://schema.org/DefinedTerm"
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/word/${word.slug}/`}
          className="no-underline text-fg"
          aria-label={`Details for ${word.transliteration}`}
        >
          <ArabicText size={compact ? 'md' : 'lg'}>{word.arabic}</ArabicText>
        </Link>
        {audioSrc !== undefined && (
          <AudioButton src={audioSrc || null} label={word.transliteration} />
        )}
      </div>
      <div className="translit text-base" itemProp="alternateName">
        {word.transliteration}
      </div>
      <div className="text-sm text-fg-2" itemProp="description" lang="en">
        {word.english}
      </div>
      {word.bangla && (
        <div className="bn text-sm text-muted" lang="bn">
          {word.bangla}
        </div>
      )}
      {!compact && (
        <div className="mt-1">
          <Link
            href={`/word/${word.slug}/`}
            className="text-xs text-muted hover:text-accent no-underline transition-colors"
          >
            {t(dict.word.openCard)}
          </Link>
        </div>
      )}
    </article>
  );
}
