'use client';

import { useLang } from './LangProvider';
import { dict, type Lang } from './dict';

type DictNode =
  | { bn: string; en: string }
  | { bn: (...a: any[]) => string; en: (...a: any[]) => string };

export function useT() {
  const { lang } = useLang();
  return function t<V extends DictNode>(val: V): V['bn'] {
    return (val[lang] ?? val.bn) as V['bn'];
  };
}

export function tStatic<V extends DictNode>(val: V, lang: Lang): V['bn'] {
  return (val[lang] ?? val.bn) as V['bn'];
}

export { dict };
