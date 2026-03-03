

# Redesign Payment Cards for Higher Conversion

## Problems with Current Layout
1. Abstract icon circles waste vertical space and add no value
2. No "who is this for" framing -- doctors can't quickly self-select
3. Middle tier (the conversion target) doesn't visually dominate enough
4. Feature lists are flat -- no hierarchy between basic and premium features
5. Passive CTA text ("Choose This Plan") doesn't reinforce outcomes
6. Price jump from 899 to 3,800 feels abrupt without value framing

## Proposed Changes

### 1. Remove icon circles, add "Ideal for" tagline per tier
Replace the icon + circle pattern with a short persona line:
- Tier 1: "I already speak the language, I just need paperwork help"
- Tier 2: "I need both homologation support and language training"  
- Tier 3: "Handle everything for me -- I just want to arrive and work"

These go right below the package title in italics/muted text, replacing the current generic descriptions.

### 2. Make middle tier visually dominant
- Give it a colored border/background (e.g., light primary tint)
- Slightly larger scale bump (1.05 instead of 1.03)
- "Most Popular" badge stays but becomes more prominent
- Add a subtle "Best Value" or savings indicator: "Save vs. buying separately"

### 3. Restructure feature lists with visual hierarchy
- Tier 2 and 3: Bold the differentiating features (the ones not in Tier 1)
- Use a divider line after "Everything in previous tier" instead of wasting a bullet on it
- Tier 3: Add a subtle summary line like "Zero out-of-pocket extras" to hammer the all-inclusive message

### 4. Stronger CTA copy
Replace "Choose This Plan" / "Elegir Este Plan" with outcome-oriented text:
- EN: "Start Now" / "Get Started"
- ES: "Empezar Ahora"
- DE: "Jetzt Starten"
Update all language files.

### 5. Add per-tier value anchoring on Tier 3
Move the competitor anchor badge to be more visually prominent -- styled as a crossed-out price or comparison line rather than a small green badge.

## Files to Modify
- `src/components/payments/PaymentFlow.tsx` -- restructure card layout, remove icons, add "ideal for" lines, enhance middle tier styling, improve CTAs
- `src/utils/i18n/languages/en/payments.ts` -- add `idealFor` strings per package, update CTA text
- `src/utils/i18n/languages/es/payments.ts` -- same
- `src/utils/i18n/languages/de/payments.ts` -- same
- `src/utils/i18n/languages/fr/payments.ts` -- same (if exists)
- `src/utils/i18n/languages/ru/payments.ts` -- same (if exists)

## What Stays the Same
- 3-tier structure and pricing (379/899/3800)
- Discount code functionality
- Payment summary scroll behavior
- Consultation CTA below cards
- Stripe checkout flow
