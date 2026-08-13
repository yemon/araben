'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from './dict';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
}
const LangContext = createContext<Ctx>({ lang: 'bn', setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bn');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' &&
      (localStorage.getItem('lang') as Lang | null)) || null;
    const initial: Lang = stored === 'en' || stored === 'bn' ? stored : 'bn';
    setLangState(initial);
    document.documentElement.setAttribute('lang', initial);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    document.documentElement.setAttribute('lang', l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Inline <head> script — sets <html lang=""> before first paint. Bangla default. */
export const langInitScript = `
(function(){
  try {
    var l = localStorage.getItem('lang');
    if (l !== 'en' && l !== 'bn') l = 'bn';
    document.documentElement.setAttribute('lang', l);
  } catch(e) {
    document.documentElement.setAttribute('lang', 'bn');
  }
})();
`;
