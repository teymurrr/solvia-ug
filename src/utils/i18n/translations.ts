
export type Language = 'en' | 'de' | 'fr' | 'es' | 'ru';

import { en, de, fr, es, ru } from './languages';
export type TranslationType = typeof en;

// Ensure all translations adhere to the same structure
// by using type assertion to enforce consistency
export const translations: Record<Language, TranslationType> = {
  en,
  de: de as unknown as TranslationType,
  fr: fr as unknown as TranslationType,
  es: es as unknown as TranslationType,
  ru: ru as unknown as TranslationType
};

export const languageNames = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский'
};
