
# Redesign Payment Packages: New 3-Tier Structure with Introduction Pricing

## New Package Structure

### Tier 1: Digital Guide (was "Digital Starter")
- **Regular price**: 79 EUR | **Intro price**: 39 EUR (limited 2-month offer)
- **Positioning**: Self-service digital toolkit
- **Features**:
  - AI-powered document analysis and validation
  - Country-specific document checklist and templates
  - Step-by-step explanation videos for each document
  - Apostille and translation instructions
  - Medical CV template
  - Email support (response within 72h)

### Tier 2: Full Support (was "Complete Package")
- **Regular price**: 379 EUR | **Intro price**: 189 EUR
- **Positioning**: Expert-guided homologation (most popular)
- **Features**:
  - Everything in Digital Guide
  - Personal expert review of every document before submission
  - Direct communication with authorities on your behalf
  - Application submission support
  - FSP/equivalence exam preparation material
  - Priority support (response within 24h)
  - Progress tracking dashboard

### Tier 3: Full Support + Language (was "Personal Mentorship")
- **Regular price**: 899 EUR | **Intro price**: 499 EUR
- **Positioning**: Complete package with language training and in-person support
- **Features**:
  - Everything in Full Support
  - 12-month medical language course access (target country language)
  - 4x live 1:1 sessions (60 min): document review, exam prep, interview coaching
  - Dedicated case manager from start to finish
  - In-person support for key appointments (where available)
  - We handle all authority communication and paperwork
  - Job matching with open positions on our platform
  - Direct WhatsApp and phone support

---

## Technical Changes

### 1. Pricing config in `PaymentFlow.tsx`
Update `getPricingByCountry()` to return both regular and intro prices:
- digital_starter: 7900 (intro: 3900)
- complete: 37900 (intro: 18900)
- personal_mentorship: 89900 (intro: 49900)

Add `introPrice` field to `PackageConfig` interface and render both prices (strikethrough on regular, highlighted intro price with a "Limited offer" badge).

### 2. Translation files (all 5 languages: en, es, de, fr, ru)
Update `payments.ts` in each language folder:
- Rename package titles: "Digital Guide", "Full Support", "Full Support + [Language]"
- Update descriptions to match new positioning
- Update feature lists per tier
- Add new translation keys: `introPrice`, `limitedOffer`, `regularPrice`, `introEnds`

### 3. Price display in `PaymentFlow.tsx`
- Show regular price with strikethrough
- Show intro price as the main bold price
- Add a small "Limited introductory offer" badge
- Keep the `oneTime` label

### 4. Results page price reference (`HomologationResult.tsx`)
- Update the "Starting from 49EUR" text on line 400 to "Starting from 39EUR"
- Update investment percentage calculation to use 39 instead of 49

### 5. Edge function pricing (if hardcoded)
- The `create-payment` edge function receives `productType` and should map to Stripe prices server-side -- these Stripe prices will need updating separately (not in frontend code)

### Files to modify:
- `src/components/payments/PaymentFlow.tsx` -- pricing, UI, intro price display
- `src/utils/i18n/languages/en/payments.ts` -- English translations
- `src/utils/i18n/languages/es/payments.ts` -- Spanish translations
- `src/utils/i18n/languages/de/payments.ts` -- German translations
- `src/utils/i18n/languages/fr/payments.ts` -- French translations
- `src/utils/i18n/languages/ru/payments.ts` -- Russian translations
- `src/pages/HomologationResult.tsx` -- update "Starting from" price reference
