

# Auto-Detect Browser Language for First-Time Visitors

## Problem

The `LanguageProvider` in `src/hooks/useLanguage.tsx` always initializes to English (`'en'`). It only switches language if a cookie or localStorage value already exists. First-time visitors from Spain (or any non-English country) see the entire site in English because no preference has been stored yet.

## Solution

On first visit (no stored language preference), detect the browser language via `navigator.language` and auto-set the UI language if it matches one of our supported languages (es, de, fr, ru). Otherwise, keep English as the default.

## Technical Changes

### File: `src/hooks/useLanguage.tsx`

In the `useEffect` that runs on mount:

1. Check for stored language (cookie or localStorage) -- keep existing behavior.
2. If no stored preference exists, read `navigator.language`, extract the base code (e.g., `es` from `es-ES`), and check if it matches a supported language.
3. If it matches, set that language (both in state and storage so it persists).
4. If it doesn't match, keep English.

```
useEffect(() => {
  const storedLanguage = getCookie('language') || localStorage.getItem('language');
  if (storedLanguage) {
    setCurrentLanguage(storedLanguage);
    switchLanguage(storedLanguage);
  } else {
    // Auto-detect from browser on first visit
    const browserLang = navigator.language?.toLowerCase().split('-')[0];
    const supportedLanguages = ['en', 'es', 'de', 'fr', 'ru'];
    if (browserLang && supportedLanguages.includes(browserLang) && browserLang !== 'en') {
      setCurrentLanguage(browserLang);
      switchLanguage(browserLang);
      // Persist so detection only happens once
      setCookie('language', browserLang, 'essential', { expires: 365 });
      localStorage.setItem('language', browserLang);
    }
  }
}, []);
```

This single change ensures:
- A user from Spain with browser set to Spanish sees the site in Spanish immediately
- The detected language is stored, so subsequent visits use the same language
- The HomologationWizard then picks up `'es'` from localStorage instead of the default `'en'`
- Emails triggered from the wizard will correctly use Spanish

