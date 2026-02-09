

# Fix Email Language Detection

## Problem

Two issues are causing emails to go out in English instead of Spanish:

### 1. Homologation Plan Email
The `send-homologation-plan` function receives the language from `localStorage.getItem('language') || 'en'`. If the user never switched the site language, it defaults to English -- even when their study country is Spain. The function itself has no smart language detection; it blindly uses whatever is passed.

### 2. Nurture Campaign Emails
The `send-nurture-campaign` function has language detection logic that checks:
1. `preferred_language` from the database (usually `null` for most leads)
2. `study_country` (also `null` for most imported leads)
3. Falls back to English

Most leads in the database have no `preferred_language` and no `study_country`, so everything defaults to English.

## Solution

### Step 1: Add language detection to `send-homologation-plan`
- Add the same country-based language detection logic that exists in `send-nurture-campaign`
- Use `studyCountry` from the request to auto-detect language when no explicit language is provided or when it's the default `'en'`
- Priority: explicit non-default language > study country detection > `'en'`

### Step 2: Improve the HomologationWizard frontend call
- Instead of only passing `localStorage.getItem('language')`, also consider the study country the user selected in the wizard to infer language
- If the user selected Spain as study country and never changed the site language, send `'es'` instead of `'en'`

### Step 3: Improve nurture campaign language detection
- Add email domain analysis as an additional signal (e.g., `.es`, `.ar`, `.mx` domains suggest Spanish)
- Add name-based heuristics as a weaker signal
- For leads with no data, check if their email was captured on a page where the site language was set (this would require storing the language at capture time)

### Step 4: Backfill lead data
- Update the `capture-lead` edge function to store the browser language / site language at time of capture as `preferred_language` when not already set
- For existing leads without language data, we can update them based on available signals (email domain, etc.)

## Technical Changes

### File: `supabase/functions/send-homologation-plan/index.ts`
- Add a `detectLanguageFromCountry(studyCountry)` function mapping Spanish-speaking countries to `'es'`, etc.
- In `getEmailContent`, change `const lang = data.language || 'en'` to: use detected language from `studyCountry` when `data.language` is missing or is `'en'` (the default)

### File: `src/pages/HomologationWizard.tsx`
- Change line 154 to pass a smarter language value: detect from `studyCountry` if localStorage language is the default `'en'`

### File: `supabase/functions/send-nurture-campaign/index.ts`
- Enhance `detectLanguage` to also check email TLD as a fallback signal before defaulting to English
- Add common Spanish email domains (`.es`, `.ar`, `.co`, `.mx`, `.cl`, `.pe`, etc.)

### File: `supabase/functions/capture-lead/index.ts`
- Ensure `browserLanguage` or site language is saved as `preferred_language` when capturing leads

## Impact
- Future homologation plan emails will be sent in the correct language based on study country
- Nurture emails will have better language detection for leads without explicit language preferences
- New leads will have language data captured at signup time
