
// Canonical country keys (stored in DB as lowercase English)
// Maps to localized display names per language
const countryNames: Record<string, Record<string, string>> = {
  germany: {
    en: 'Germany',
    de: 'Deutschland',
    es: 'Alemania',
    fr: 'Allemagne',
    ru: 'Германия',
  },
  austria: {
    en: 'Austria',
    de: 'Österreich',
    es: 'Austria',
    fr: 'Autriche',
    ru: 'Австрия',
  },
  spain: {
    en: 'Spain',
    de: 'Spanien',
    es: 'España',
    fr: 'Espagne',
    ru: 'Испания',
  },
  france: {
    en: 'France',
    de: 'Frankreich',
    es: 'Francia',
    fr: 'France',
    ru: 'Франция',
  },
  switzerland: {
    en: 'Switzerland',
    de: 'Schweiz',
    es: 'Suiza',
    fr: 'Suisse',
    ru: 'Швейцария',
  },
  italy: {
    en: 'Italy',
    de: 'Italien',
    es: 'Italia',
    fr: 'Italie',
    ru: 'Италия',
  },
};

export function getLocalizedCountryName(countryKey: string, language: string): string {
  const key = countryKey?.toLowerCase().trim();
  const translations = countryNames[key];
  if (!translations) return countryKey; // fallback to raw value
  return translations[language] || translations['en'] || countryKey;
}
