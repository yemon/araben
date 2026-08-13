'use client';

import { ArabicText } from '@/components/ArabicText';
import { useT } from '@/lib/i18n/t';
import type {
  Block,
  BiText,
  CalloutBlock,
  ExampleBlock,
  ExampleListBlock,
  ProseBlock,
  TableBlock,
  TableCell,
  WidgetBlock,
} from '@/lib/grammar/types';
import { CaseFlipper } from './CaseFlipper';
import { IdafahBuilder } from './IdafahBuilder';
import { KanaInnaDemo } from './KanaInnaDemo';
import { NominalVsVerbal } from './NominalVsVerbal';
import { RootExplorer } from './RootExplorer';
import { SentenceParser, type SentenceParserProps } from './SentenceParser';
import { SunMoon } from './SunMoon';
import { VerbConjugator } from './VerbConjugator';

/**
 * Renders **markdown-lite** inline text: **bold** becomes <strong>, blank lines
 * become paragraph breaks. Keep it simple — this isn't a full parser.
 */
function renderInline(s: string): React.ReactNode {
  const paragraphs = s.split('\n').filter((p) => p.length > 0);
  return paragraphs.map((p, i) => {
    const parts = p.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className={i === 0 ? '' : 'mt-3'}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="text-fg font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

function BiProse({ text, className }: { text: BiText; className?: string }) {
  return (
    <div className={className}>
      <div lang="bn" className="bn read-body">
        {renderInline(text.bn)}
      </div>
      <div lang="en" className="mt-2 pt-2 border-t border-border-2 text-sm text-muted">
        {renderInline(text.en)}
      </div>
    </div>
  );
}

function ProseBlockView({ block }: { block: ProseBlock }) {
  return <BiProse text={block.text} className="my-5" />;
}

function TableCellView({ cell }: { cell: TableCell }) {
  if (typeof cell === 'string') {
    // treat as language-neutral (may contain Arabic / ASCII)
    return <span>{cell}</span>;
  }
  switch (cell.kind) {
    case 'ar':
      return <ArabicText className="!text-lg">{cell.value}</ArabicText>;
    case 'ar-t':
      return (
        <span className="flex flex-col gap-0.5 leading-tight">
          <ArabicText className="!text-lg">{cell.ar}</ArabicText>
          <span className="translit text-xs" lang="en">
            {cell.t}
          </span>
          {cell.gloss && (
            <span className="text-xs text-fg-2 mt-0.5">
              <span lang="en">{cell.gloss.en}</span>
              <span lang="bn" className="bn text-muted block">
                {cell.gloss.bn}
              </span>
            </span>
          )}
        </span>
      );
    case 'translit':
      return (
        <span className="translit" lang="en">
          {cell.value}
        </span>
      );
    case 'bn':
      return (
        <span lang="bn" className="bn">
          {cell.value}
        </span>
      );
    case 'en':
      return <span lang="en">{cell.value}</span>;
    case 'bi':
      return (
        <span className="flex flex-col gap-0.5">
          <span lang="bn" className="bn">
            {cell.value.bn}
          </span>
          <span lang="en" className="text-muted text-xs">
            {cell.value.en}
          </span>
        </span>
      );
  }
}

function TableBlockView({ block }: { block: TableBlock }) {
  return (
    <div className="my-6 card overflow-hidden">
      <table className="w-full responsive-table text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-border bg-surface-2">
            {block.headers.map((h, i) => (
              <th key={i} className="p-3">
                <span lang="bn" className="bn">
                  {h.bn}
                </span>
                <span lang="en" className="text-muted normal-case tracking-normal opacity-70 ml-1.5">
                  · {h.en}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--border-2)]">
          {block.rows.map((row, i) => (
            <tr key={i} className="align-top">
              {row.map((cell, j) => (
                <td key={j} className="p-3" data-label={block.headers[j]?.en}>
                  <TableCellView cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {block.caption && (
        <div className="text-xs text-muted border-t border-border p-3">
          <span lang="bn" className="bn">
            {block.caption.bn}
          </span>
        </div>
      )}
    </div>
  );
}

function ExampleBlockView({ block }: { block: ExampleBlock }) {
  return (
    <div className="my-5 card p-5 flex flex-col gap-2">
      <ArabicText className="!text-3xl">{block.arabic}</ArabicText>
      {block.transliteration && (
        <div className="translit text-sm" lang="en">
          {block.transliteration}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-2 mt-1 pt-2 border-t border-border-2 text-sm">
        <div lang="en">{block.english}</div>
        <div lang="bn" className="bn md:text-right">
          {block.bangla}
        </div>
      </div>
      {block.note && (
        <div className="text-xs text-muted mt-1">
          <span lang="bn" className="bn">
            {block.note.bn}
          </span>
        </div>
      )}
    </div>
  );
}

function ExampleListBlockView({ block }: { block: ExampleListBlock }) {
  return (
    <div className="my-5 rounded-2xl border border-border overflow-hidden">
      <ul className="divide-y divide-[color:var(--border-2)]">
        {block.items.map((it, i) => (
          <li key={i} className="p-4 grid md:grid-cols-[auto_1fr] gap-x-6 gap-y-1">
            <div className="flex flex-col gap-0.5">
              <ArabicText className="!text-2xl">{it.arabic}</ArabicText>
              {it.transliteration && (
                <span className="translit text-xs" lang="en">
                  {it.transliteration}
                </span>
              )}
            </div>
            <div className="text-sm flex flex-col justify-center gap-1 min-w-0">
              <span lang="en" className="text-fg-2">
                {it.english}
              </span>
              <span lang="bn" className="bn text-muted">
                {it.bangla}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CalloutBlockView({ block }: { block: CalloutBlock }) {
  const styles: Record<CalloutBlock['tone'], { chip: string; label: BiText }> = {
    rule: { chip: 'chip-accent', label: { bn: 'নিয়ম', en: 'Rule' } },
    tip: { chip: 'chip-warm', label: { bn: 'টিপস', en: 'Tip' } },
    warn: { chip: 'chip-warm', label: { bn: 'সাবধান', en: 'Watch out' } },
    gotcha: { chip: 'chip-warm', label: { bn: 'ফাঁদ', en: 'Gotcha' } },
  };
  const t = useT();
  const s = styles[block.tone];
  return (
    <div
      className="my-6 rounded-2xl border p-5"
      style={{
        borderColor: 'var(--border)',
        background:
          block.tone === 'rule'
            ? 'color-mix(in oklab, var(--accent-soft) 60%, var(--surface))'
            : 'color-mix(in oklab, var(--accent-2-soft) 55%, var(--surface))',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={'chip ' + s.chip}>
          <span lang="bn" className="bn">
            {t(s.label)}
          </span>
        </span>
        {block.title && (
          <span className="text-sm font-semibold">
            <span lang="bn" className="bn">
              {block.title.bn}
            </span>
            <span lang="en" className="text-muted font-normal ml-1.5 text-xs">
              · {block.title.en}
            </span>
          </span>
        )}
      </div>
      <BiProse text={block.text} />
    </div>
  );
}

function WidgetView({ block }: { block: WidgetBlock }) {
  switch (block.widget) {
    case 'sentence-parser':
      return <SentenceParser {...(block.props as unknown as SentenceParserProps)} />;
    case 'case-flipper':
      return <CaseFlipper />;
    case 'kana-inna':
      return <KanaInnaDemo />;
    case 'verb-conjugator':
      return <VerbConjugator {...(block.props as any)} />;
    case 'nominal-vs-verbal':
      return <NominalVsVerbal />;
    case 'root-explorer':
      return <RootExplorer {...(block.props as any)} />;
    case 'sun-moon':
      return <SunMoon />;
    case 'idafah-builder':
      return <IdafahBuilder />;
  }
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'prose':
      return <ProseBlockView block={block} />;
    case 'table':
      return <TableBlockView block={block} />;
    case 'example':
      return <ExampleBlockView block={block} />;
    case 'example-list':
      return <ExampleListBlockView block={block} />;
    case 'callout':
      return <CalloutBlockView block={block} />;
    case 'widget':
      return <WidgetView block={block} />;
  }
}
