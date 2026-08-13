// Bilingual grammar content model. Every text field is a { bn, en } pair.
// Structured blocks let us render prose, tables, examples, callouts, and
// interactive widgets from a single data source.

export interface BiText {
  bn: string;
  en: string;
}

// --- Blocks that render top-to-bottom inside a section --------------------

export type Block =
  | ProseBlock
  | TableBlock
  | ExampleBlock
  | ExampleListBlock
  | CalloutBlock
  | WidgetBlock;

export interface ProseBlock {
  kind: 'prose';
  text: BiText;
}

export interface TableBlock {
  kind: 'table';
  headers: BiText[];
  /**
   * Each cell can be a plain string (rendered as-is, treated as language-neutral
   * / Arabic-friendly), or a BiText for translated content, or a { kind: 'ar' }
   * / { kind: 'translit' } marker for styling.
   */
  rows: TableCell[][];
  caption?: BiText;
}

export type TableCell =
  | string
  | { kind: 'ar'; value: string }
  | { kind: 'ar-t'; ar: string; t: string; gloss?: BiText }
  | { kind: 'translit'; value: string }
  | { kind: 'bi'; value: BiText }
  | { kind: 'bn'; value: string }
  | { kind: 'en'; value: string };

export interface ExampleBlock {
  kind: 'example';
  arabic: string;
  transliteration?: string;
  english: string;
  bangla: string;
  note?: BiText;
}

export interface ExampleListBlock {
  kind: 'example-list';
  items: {
    arabic: string;
    transliteration?: string;
    english: string;
    bangla: string;
  }[];
}

export interface CalloutBlock {
  kind: 'callout';
  tone: 'rule' | 'tip' | 'warn' | 'gotcha';
  title?: BiText;
  text: BiText;
}

export interface WidgetBlock {
  kind: 'widget';
  widget:
    | 'sentence-parser'
    | 'case-flipper'
    | 'kana-inna'
    | 'verb-conjugator'
    | 'nominal-vs-verbal'
    | 'root-explorer'
    | 'sun-moon'
    | 'idafah-builder';
  props?: Record<string, unknown>;
}

// --- Section: a group of blocks under a heading --------------------------

export interface Section {
  id: string;
  heading: BiText;
  eyebrow?: BiText;
  blocks: Block[];
}

// --- Part: one URL --------------------------------------------------------

export interface GrammarPart {
  slug: string;
  order: number;
  eyebrow: BiText;
  title: BiText;
  lead: BiText;
  keywords?: string[];
  sections: Section[];
}
