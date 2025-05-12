
import { useState, useEffect, useContext } from 'react';
import { translations, Language } from '@/utils/i18n/translations';

// Create a context for language selection
import React from 'react';

const LanguageContext = React.createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: 'en',
  setLanguage: () => {},
});

// Helper function to get browser language
const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  // Get browser language
  const browserLang = navigator.language.split('-')[0];
  
  // Check if browser language is supported
  if (browserLang === 'en' || browserLang === 'de' || 
      browserLang === 'fr' || browserLang === 'es' || 
      browserLang === 'ru') {
    return browserLang as Language;
  }
  
  return 'en'; // Default to English
};

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // First check if there's a language preference in localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de' || 
                          savedLanguage === 'fr' || savedLanguage === 'es' || 
                          savedLanguage === 'ru')) {
      setLanguage(savedLanguage as Language);
    } else {
      // If no saved preference, use browser language
      setLanguage(getBrowserLanguage());
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  
  // Return the translations for the current language with proper typing
  const t = translations[language] || translations.en;
  
  return {
    language,
    setLanguage,
    t
  };
};
