
import { useEffect, useState } from 'react';
import { Language, translations } from '@/utils/i18n/translations';
import { availableLanguages, DEFAULT_LANGUAGES } from '@/data/languages';

const mapBrowserLangToSupported = (browserLang: string): Language => {
  const lang = browserLang.split('-')[0];
  if (lang === 'de') return 'de';
  if (lang === 'es') return 'es';
  return 'en';
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Validate that we have actual language data
  useEffect(() => {
    // Log warning if language data is missing or invalid
    if (!Array.isArray(availableLanguages) || availableLanguages.length === 0) {
      console.warn("Warning: availableLanguages is not properly defined, using defaults");
    }
  }, []);

  useEffect(() => {
    try {
      const browserLang = navigator.language;
      const mappedLang = mapBrowserLangToSupported(browserLang);
      setCurrentLanguage(mappedLang);
    } catch (error) {
      console.error("Error detecting browser language:", error);
      // Fallback to English
      setCurrentLanguage('en');
    }
  }, []);

  return {
    t: translations[currentLanguage],
    currentLanguage,
    setLanguage: setCurrentLanguage,
    availableLanguages: Array.isArray(availableLanguages) ? availableLanguages : DEFAULT_LANGUAGES
  };
};
