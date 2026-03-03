

# Two-Track Pricing Based on Language Proficiency

## Pricing Summary

**Track A — User speaks the country's language (B2+ / C1 / Native)**

| Tier | Spain | DE / AT / FR / IT |
|------|-------|-------------------|
| Digital Homologation | €150 | €150 |
| Personal Assistance | €250 | €289 |
| All-Inclusive | €350 | €1,900 |

**Track B — User does NOT speak the language (A1 / A2 / B1 / Don't know / not set)**

All countries identical (including Spain): €379 / €899 / €3,800 (current pricing, unchanged)

## Detection Logic

Read `wizardData.languageLevel` from localStorage. User "speaks the language" if value is `B2`, `C1`, or `native_speaker`. Everything else falls into Track B.

## Package Content — Track A (Speakers)

### Tier 1: Digital Homologation (€150)
- Document preparation templates and checklists
- Step-by-step digital guide for the homologation process
- Email support

*"Ideal for": "I know what I need — I just want the right tools and guidance"*

### Tier 2: Personal Assistance (€250 Spain / €289 others)
*Everything in Digital, plus:*
- Personal case manager assigned to you
- Full representation and communication with authorities
- Priority support via WhatsApp & email

*"Ideal for": "I want someone to handle the paperwork and talk to the authorities for me"*

### Tier 3: All-Inclusive (€350 Spain / €1,900 others)
*Everything in Personal, plus:*
- All translation and apostille costs covered
- All official fees and administrative charges
- Zero out-of-pocket extras

*"Ideal for": "Take care of everything — I just want to arrive and work"*

## Package Content — Track B (Non-Speakers)

Unchanged from current implementation. Titles reference the country's language (e.g., "Homologation + German").

## Files to Modify

1. **`src/components/payments/PaymentFlow.tsx`** — read `languageLevel`, branch `getPricingByCountry` into two tracks, swap package configs (titles, features, idealFor) based on track, fix equal-height cards
2. **`src/utils/i18n/languages/en/payments.ts`** — add `speakerPackages` object with titles, idealFor, features for all 3 tiers
3. **`src/utils/i18n/languages/es/payments.ts`** — same
4. **`src/utils/i18n/languages/de/payments.ts`** — same
5. **`src/utils/i18n/languages/fr/payments.ts`** — same
6. **`src/utils/i18n/languages/ru/payments.ts`** — same

## What Stays the Same
- 3-card layout, middle tier "Most Popular" styling
- Discount code flow, payment summary, Stripe checkout
- Consultation CTA, competitor anchor on Tier 3

