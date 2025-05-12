
export type Language = 'en' | 'de' | 'fr' | 'es' | 'ru';

import { languageModules, TranslationType } from './languages';

export const translations: Record<Language, TranslationType> = languageModules;

export const languageNames = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский'
};
