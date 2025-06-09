
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Import language files
import { en } from '../utils/i18n/languages/en/index';
import { de } from '../utils/i18n/languages/de/index';
import { es } from '../utils/i18n/languages/es/index';
import { fr } from '../utils/i18n/languages/fr/index';
import { ru } from '../utils/i18n/languages/ru/index';

// Define context interfaces
interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: any;
  isLoaded: boolean;
}

// Create context with default values (English as fallback)
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: en,
  isLoaded: true,
});

// Define props for provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<any>(en);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

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
      case 'ru':
        setTranslations(ru);
        break;
      default:
        setTranslations(en);
    }
    setIsLoaded(true);
  };

  // Effect to load language from localStorage on component mount
  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage && storedLanguage !== currentLanguage) {
        setCurrentLanguage(storedLanguage);
        switchLanguage(storedLanguage);
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
      // Continue with default English if localStorage fails
    }
  }, []);

  // Function to set language and save to localStorage
  const setLanguage = (lang: string) => {
    try {
      localStorage.setItem('language', lang);
      setCurrentLanguage(lang);
      switchLanguage(lang);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
      // Still update the language even if localStorage fails
      setCurrentLanguage(lang);
      switchLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t: translations, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for consuming language context
export const useLanguage = () => useContext(LanguageContext);
