
import { useEffect, useState } from 'react';
import { Language, translations } from '@/utils/i18n/translations';
import { DEFAULT_LANGUAGES, getSafeLanguages, availableLanguages } from '@/data/languages';

const mapBrowserLangToSupported = (browserLang: string): Language => {
  try {
    const lang = browserLang.split('-')[0];
    if (lang === 'de') return 'de';
    if (lang === 'es') return 'es';
    return 'en';
  } catch (error) {
    console.error("Error mapping browser language:", error);
    return 'en';  // Default to English on error
  }
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Validate that we have actual language data
  useEffect(() => {
    // Log warning if language data is missing or invalid
    if (!Array.isArray(availableLanguages) || availableLanguages.length === 0) {
      console.warn("Warning: availableLanguages is not properly defined, using defaults");
    }

    // Validate translations exist for each language
    if (!translations || typeof translations !== 'object') {
      console.error("Error: translations object is invalid");
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

  // Ensure we have valid translations even if there's an error
  const getTranslations = () => {
    if (!translations || !translations[currentLanguage]) {
      console.error(`Missing translations for ${currentLanguage}, falling back to English`);
      return translations?.en || {};
    }
    return translations[currentLanguage];
  };

  // Use the safe helper function to always return a valid array
  const safeLanguages = getSafeLanguages();

  return {
    t: getTranslations(),
    currentLanguage,
    setLanguage: setCurrentLanguage,
    availableLanguages: safeLanguages
  };
};
