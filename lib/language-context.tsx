'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language } from '@/lib/i18n';

interface LanguageCtx {
  lang: Language;
  setLang: (l: Language) => void;
}

const LanguageContext = createContext<LanguageCtx | undefined>(undefined);

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang: Language }) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const setLang = useCallback((l: Language) => setLangState(l), []);
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageCtx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
