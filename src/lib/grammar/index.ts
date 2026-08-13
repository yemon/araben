import type { GrammarPart } from './types';
import { partOrientation } from './parts/00-orientation';
import { partFoundation } from './parts/01-foundation';
import { partSentenceTypes } from './parts/02-sentence-types';
import { partPhrases } from './parts/03-phrases';
import { partPronouns } from './parts/04-pronouns';
import { partVerbs } from './parts/05-verbs';
import { partNegationQuestions } from './parts/06-negation-questions';
import { partKanaInna } from './parts/07-kana-inna';
import { partConjunctions } from './parts/08-conjunctions';
import { partWorkedExamples } from './parts/09-worked-examples';
import { partMistakes } from './parts/10-mistakes';
import { partLearningSequence } from './parts/11-learning-sequence';
import { partReference } from './parts/12-reference';

export const GRAMMAR_PARTS: GrammarPart[] = [
  partOrientation,
  partFoundation,
  partSentenceTypes,
  partPhrases,
  partPronouns,
  partVerbs,
  partNegationQuestions,
  partKanaInna,
  partConjunctions,
  partWorkedExamples,
  partMistakes,
  partLearningSequence,
  partReference,
];

export function getGrammarPart(slug: string): GrammarPart | undefined {
  return GRAMMAR_PARTS.find((p) => p.slug === slug);
}

export function getGrammarNeighbours(slug: string) {
  const i = GRAMMAR_PARTS.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? GRAMMAR_PARTS[i - 1] : null,
    next: i >= 0 && i < GRAMMAR_PARTS.length - 1 ? GRAMMAR_PARTS[i + 1] : null,
  };
}

export type { GrammarPart } from './types';
