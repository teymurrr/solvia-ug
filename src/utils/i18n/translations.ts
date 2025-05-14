
export type Language = 'en' | 'de' | 'fr' | 'es' | 'ru';

import { en, de, fr, es, ru } from './languages';
export type TranslationType = typeof en;

export const translations: Record<Language, TranslationType> = {
  en,
  de,
  fr,
  es,
  ru
};

export const languageNames = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский'
};
