
import { en } from './en';
import { de } from './de';
import { fr } from './fr';
import { es } from './es';
import { ru } from './ru';
import { Language } from '../translations';

export const languageModules = {
  en,
  de,
  fr,
  es,
  ru
};

export type TranslationType = typeof en;

export { en, de, fr, es, ru };
