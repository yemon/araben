// Server-only content loader. Runs at build time only (static export).
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type {
  Word,
  Surah,
  Scenario,
  Basics,
  HiddenData,
  Root,
} from '@/types/content';

const contentDir = path.join(process.cwd(), 'content');

function load<T>(name: string): T {
  const raw = fs.readFileSync(path.join(contentDir, name), 'utf8');
  return JSON.parse(raw) as T;
}

let _words: Word[] | null = null;
let _surahs: Surah[] | null = null;
let _scenarios: Scenario[] | null = null;
let _basics: Basics | null = null;
let _hidden: HiddenData | null = null;
let _roots: Root[] | null = null;

export function getAllWords(): Word[] {
  if (!_words) _words = load<Word[]>('words.json');
  return _words;
}
export function getWord(slug: string): Word | undefined {
  return getAllWords().find((w) => w.slug === slug);
}
export function getAllSurahs(): Surah[] {
  if (!_surahs) _surahs = load<Surah[]>('surahs.json');
  return _surahs;
}
export function getSurah(slug: string): Surah | undefined {
  return getAllSurahs().find((s) => s.slug === slug);
}
export function getAllScenarios(): Scenario[] {
  if (!_scenarios) _scenarios = load<Scenario[]>('scenarios.json');
  return _scenarios;
}
export function getScenario(slug: string): Scenario | undefined {
  return getAllScenarios().find((s) => s.slug === slug);
}
export function getBasics(): Basics {
  if (!_basics) _basics = load<Basics>('basics.json');
  return _basics;
}
export function getBasicsCategory(slug: string) {
  return getBasics().categories.find((c) => c.slug === slug);
}
export function getHidden(): HiddenData {
  if (!_hidden) _hidden = load<HiddenData>('hidden.json');
  return _hidden;
}
export function getHiddenCategory(slug: string) {
  return getHidden().categories.find((c) => c.slug === slug);
}
export function getAllRoots(): Root[] {
  if (!_roots) _roots = load<Root[]>('roots.json');
  return _roots;
}
export function getRoot(slug: string): Root | undefined {
  return getAllRoots().find((r) => r.slug === slug);
}

export function getRelatedWords(word: Word, limit = 8): Word[] {
  const words = getAllWords();
  const scored: { word: Word; score: number }[] = [];
  for (const w of words) {
    if (w.slug === word.slug) continue;
    let s = 0;
    // Same root
    if (word.root && w.root === word.root) s += 5;
    // Shared appearances
    for (const a of word.appearances || []) {
      for (const b of w.appearances || []) {
        if (a.source === 'surah' && b.source === 'surah' && a.surah === b.surah) s += 1;
        if (
          a.source === 'scenario' &&
          b.source === 'scenario' &&
          a.scenario === b.scenario
        )
          s += 2;
        if (
          a.source === 'basics' &&
          b.source === 'basics' &&
          a.category === b.category
        )
          s += 1;
      }
    }
    if (s > 0) scored.push({ word: w, score: s });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.word);
}

let _audioManifest: Record<string, string> | null = null;
export function getAudioManifest(): Record<string, string> {
  if (_audioManifest) return _audioManifest;
  const p = path.join(contentDir, 'audio-manifest.json');
  if (!fs.existsSync(p)) {
    _audioManifest = {};
    return _audioManifest;
  }
  _audioManifest = JSON.parse(fs.readFileSync(p, 'utf8'));
  return _audioManifest!;
}

export function hasAudio(slug: string): boolean {
  return Boolean(getAudioManifest()[slug]);
}

export function audioUrl(slug: string): string | null {
  const m = getAudioManifest();
  return m[slug] ? `/audio/${m[slug]}` : null;
}
