
# Multi-Language Email Campaign Implementation Plan

## Current Situation
- **Existing emails**: Spanish-only (day0, day1, day3, day5, day7)
- **Target leads**: 113 total
- **Study country breakdown**: 
  - Latin America: ~85 leads (Mexico 18, Colombia 8, Chile 5, Peru 3, Ecuador 2, others)
  - Europe: ~28 leads (Spain 6, Austria 3, Germany 2, France, Italy, etc.)
- **Required languages**: Spanish, German, English (+ French for ~5 leads)
- **No language preference field** in `leads` table - must auto-detect based on `study_country` and `target_country`

## Implementation Strategy

### Phase 1: Language Detection Logic
Create a function in the `send-nurture-campaign` edge function to auto-detect the best language for each lead:

**Logic:**
1. If `study_country` is in Latin America → Spanish
2. If `target_country` is Germany/Austria → German
3. If `target_country` is France → French
4. Fallback: English (for unknown cases)

**Language Mapping:**
- **Spanish**: Mexico, Colombia, Chile, Peru, Bolivia, Venezuela, Cuba, Argentina, Ecuador (85 leads)
- **German**: Germany, Austria (if they also came from these countries or speak German)
- **French**: France, Algeria (5 leads)
- **English**: Default/Unknown

### Phase 2: Email Template Translation
Create translated versions of all 5 email templates:
- Day 0: "Tu plan para trabajar en..." → "Dein Plan für die Arbeit in..." / "Your plan to work in..."
- Day 1: Success story template (translate for each language)
- Day 3: 3 common mistakes (translate for each language)
- Day 5: Price increase urgency (translate for each language)
- Day 7: Final offer with free consultation (translate for each language)

Each template will have:
- Subject line in the detected language
- HTML body in the detected language
- Personalization for country names, professions, timelines

### Phase 3: Test Email to David
Before full campaign launch:
1. Create a test lead object for `david.rehrl@thesolvia.com`
2. Send the Day 0 template in all languages to verify rendering
3. Let David choose which version looks best
4. Confirm language detection logic is working

### Phase 4: Full Campaign Execution
Once David approves the test:
1. Query all 113 leads from the `leads` table
2. Auto-detect language for each lead based on `study_country`
3. Send Day 0 personalized email in their language
4. Update `email_sequence_day` to 1 for tracking

## Technical Details

### Language Detection Function
```
detectLeadLanguage(studyCountry, targetCountry) {
  const latAmCountries = ['Mexico', 'Colombia', 'Chile', 'Peru', 'Bolivia', 'Venezuela', 'Cuba', 'Argentina', 'Ecuador'];
  
  if (latAmCountries.includes(studyCountry)) return 'es';
  if (['Germany', 'Austria'].includes(targetCountry)) return 'de';
  if (['France'].includes(targetCountry)) return 'fr';
  return 'en';
}
```

### Email Template Structure
For each template (day0, day1, day3, day5, day7), create:
- `templates.day0.es` (Spanish)
- `templates.day0.de` (German)
- `templates.day0.en` (English)
- `templates.day0.fr` (French)

### Country Names & Professions
Expand the existing mappings to include German and French:
```
countryNames: {
  germany: { es: 'Alemania', en: 'Germany', de: 'Deutschland', fr: 'Allemagne' },
  ...
}

professionNames: {
  general: { es: 'médico general', en: 'general practitioner', de: 'Allgemeinarzt', fr: 'Médecin généraliste' },
  ...
}
```

## Sequence

1. **Modify `send-nurture-campaign` function**:
   - Add language detection logic
   - Add translated email templates for all 5 days in all 4 languages
   - Keep backward compatibility with existing `segment` and `templateId` parameters
   - Add `language` parameter for manual override (optional)

2. **Send test email to David** in Spanish (most common language):
   - Subject: "David, tu plan para trabajar en [country] - precio especial €49"
   - Full personalized Day 0 template
   - Verify rendering in email client

3. **Get approval from David** on template quality

4. **Launch full campaign**:
   - Send Day 0 to all 113 leads in their detected language
   - Schedule Day 1 for next day
   - Continue with Day 3, 5, 7 sequence

## Expected Results

**Language Distribution for First Campaign:**
- Spanish speakers: ~85 emails (75%)
- German speakers: ~20 emails (18%)
- French speakers: ~5 emails (5%)
- English: ~3 emails (3%)

Each segment will receive the exact same value proposition and offer, just in their native language for maximum effectiveness.

## Files to Modify

1. **supabase/functions/send-nurture-campaign/index.ts** (Major update):
   - Add language detection function
   - Add translated templates for all 5 days × 4 languages
   - Expand country/profession mappings
   - Add language parameter to request interface
   - Auto-select language per lead

2. **supabase/config.toml** (Minor update):
   - Already updated, no changes needed

## Testing Checklist

- [ ] Test email renders correctly in Gmail, Outlook, Apple Mail
- [ ] Verify personalization fields populate correctly (firstName, country, timeline, etc.)
- [ ] Confirm language detection logic maps study countries correctly
- [ ] Check that strikethrough pricing shows (€99 → €49)
- [ ] Verify CTA button links work
- [ ] Confirm footer links are correct
