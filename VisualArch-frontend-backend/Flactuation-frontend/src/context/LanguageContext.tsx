import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type LanguageCode } from '../locales/dictionary';

type LanguageContextType = {
  lang: LanguageCode;
  toggleLang: () => void;
  t: (keyPath: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<LanguageCode>('en');

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ru' : 'en'));
  };

  const t = (keyPath: string) => {
    const keys = keyPath.split('.');
    let current: any = translations[lang];
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${keyPath} in lang: ${lang}`);
        return keyPath;
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
