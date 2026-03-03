import type { Language } from '@/utils/i18n/translations';

/**
 * Returns the localized value for a vacancy field (e.g. title, description).
 * Falls back to the default field if no localized version exists.
 */
export const getLocalizedVacancyField = (
  vacancy: Record<string, any>,
  field: 'title' | 'description',
  language: Language
): string => {
  const localizedKey = `${field}_${language}`;
  return vacancy[localizedKey] || vacancy[field] || '';
};
