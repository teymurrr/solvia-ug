
import { useEffect, useState } from 'react';
import { Language, translations } from '@/utils/i18n/translations';
import { availableLanguages } from '@/data/languages';

const mapBrowserLangToSupported = (browserLang: string): Language => {
  const lang = browserLang.split('-')[0];
  if (lang === 'de') return 'de';
  if (lang === 'es') return 'es';
  return 'en';
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language;
    const mappedLang = mapBrowserLangToSupported(browserLang);
    setCurrentLanguage(mappedLang);
  }, []);

  return {
    t: translations[currentLanguage],
    currentLanguage,
    setLanguage: setCurrentLanguage
  };
};
