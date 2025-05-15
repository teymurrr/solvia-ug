
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Import language files
import { en } from '../utils/i18n/languages/en/index';
import { de } from '../utils/i18n/languages/de/index';
import { es } from '../utils/i18n/languages/es/index';
import { fr } from '../utils/i18n/languages/fr/index';

// Define context interfaces
interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: any;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: en,
});

// Define props for provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<any>(en);

  // Effect to load language from localStorage on component mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
      switchLanguage(storedLanguage);
    }
  }, []);

  // Function to switch language
  const switchLanguage = (lang: string) => {
    switch (lang) {
      case 'en':
        setTranslations(en);
        break;
      case 'de':
        setTranslations(de);
        break;
      case 'es':
        setTranslations(es);
        break;
      case 'fr':
        setTranslations(fr);
        break;
      default:
        setTranslations(en);
    }
  };

  // Function to set language and save to localStorage
  const setLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    setCurrentLanguage(lang);
    switchLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for consuming language context
export const useLanguage = () => useContext(LanguageContext);
