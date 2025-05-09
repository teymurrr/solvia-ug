
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

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Check if there's a language preference in localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de' || savedLanguage === 'es')) {
      setLanguage(savedLanguage as Language);
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
