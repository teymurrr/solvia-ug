

# Payment Page Restructure: New 3-Tier Package Model

## Strategy

Replace the current low-value tiers (39/189/449) with a premium-positioned structure that captures real value while remaining 50-80% cheaper than competitors (8,000-20,000).

## New Package Structure

### Tier 1: Guided Homologation (~€299)
- Step-by-step expert guidance through the entire process
- Personal document review before every submission
- Priority email support (24h response)
- Progress tracking dashboard
- Country-specific checklists and templates

### Tier 2: Homologation + Language (€899) -- "Most Popular"
- Everything in Guided Homologation
- 12-month medical language course access
- 4x live 1:1 sessions (60 min)
- Dedicated case manager
- Direct WhatsApp and phone support

### Tier 3: Full All-Inclusive Homologation (€3,800)
- Everything handled for you, start to finish
- All translation costs included
- All official fees and charges covered
- Authority communication and submissions done for you
- In-person support for key appointments
- Dedicated case manager with WhatsApp/phone access
- Language course included

## UI Simplification

Remove or consolidate the following clutter:

1. **Remove** the countdown timer and urgency banner (the intro pricing deadline has passed -- Feb 28, 2026 -- and aligns with no-fake-urgency policy)
2. **Remove** the duplicate consultation CTAs (currently appears 3 times: above cards, below cards, and in payment summary). Keep ONE below the cards.
3. **Remove** the social proof rotating strip from the payment page (it's already on the landing page)
4. **Remove** the "What happens next" section from the payment summary (adds friction before checkout)
5. **Simplify feature lists** to 4-5 bullet points max per card, with clear differentiators rather than repetitive "Everything in X" lists
6. **Keep**: trust badges (secure payment, 24h support, trusted by 500+), email input, discount code, payment summary with CTA

## Technical Changes

### Files to modify:

1. **`src/components/payments/PaymentFlow.tsx`**
   - Update `getPricingByCountry()` with new price points (29900, 89900, 380000 in cents)
   - Simplify the packages array to 4-5 features each
   - Remove `CountdownTimer` component
   - Remove `SocialProofStrip` component
   - Remove the pre-selection consultation CTA (lines 454-468)
   - Remove the prominent call CTA card (lines 570-627)
   - Remove the "what happens next" section from the payment summary (lines 654-670)
   - Remove the alternative CTA at the bottom of payment summary (lines 749-765)
   - Keep one simple consultation link below the package grid
   - Update `getPackageTitle()` and `getPackageDescription()` for new tier names

2. **`src/utils/i18n/languages/en/payments.ts`** -- Update all package names, descriptions, features, and remove unused keys

3. **`src/utils/i18n/languages/es/payments.ts`** -- Spanish translations for new packages

4. **`src/utils/i18n/languages/de/payments.ts`** -- German translations

5. **`src/utils/i18n/languages/fr/payments.ts`** -- French translations

6. **`src/utils/i18n/languages/ru/payments.ts`** -- Russian translations

### New i18n package content (English example):

- **Tier 1 "Guided Homologation"**: "Expert guidance through every step of your homologation"
  - Personal document review before submission
  - Direct communication with authorities on your behalf
  - Application submission handled for you
  - Priority support (24h response)

- **Tier 2 "Homologation + [Language]"**: "Complete homologation support with medical language training"
  - Everything in Guided Homologation
  - 12-month medical language course
  - 4x live 1:1 coaching sessions
  - Dedicated case manager
  - WhatsApp and phone support

- **Tier 3 "Full All-Inclusive"**: "We handle everything -- translations, fees, paperwork, all included"
  - All translation and apostille costs included
  - All official fees and charges covered
  - Complete authority communication and submissions
  - Language course + dedicated case manager
  - In-person support for appointments

### Pricing display changes:
- Remove the strikethrough "regular price" pattern (no more intro pricing gimmick)
- Show clean, confident pricing: €299 / €899 / €3,800
- Add a subtle "Competitors charge €8,000-20,000" anchor text near the top or on Tier 3
- Keep the "Save X%" badge only on Tier 3 to emphasize the competitor comparison

