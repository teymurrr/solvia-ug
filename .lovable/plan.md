
# Add Pre-Selection Consultation CTA on Payment Page

## Problem
Users who arrive at the payment page after the wizard but don't know which package suits them have no clear path to get help *before* scrolling through and comparing all three options. The existing "Schedule a Free Call" card only appears after the packages and trust indicators.

## Solution
Add a subtle but visible consultation link between the social proof strip and the package grid. This is NOT a popup (popups are disruptive and annoying at this stage). Instead, it's a friendly, low-pressure inline prompt that catches the eye of undecided users without interrupting those who are ready to choose.

## Design
A centered text line with a calendar icon and link, styled as a soft prompt:

```text
"Not sure which plan is right for you? Book a free 15-min consultation"
```

- Positioned directly above the package cards (after social proof, before the grid)
- Uses a warm, non-aggressive style: muted text with an underlined link in primary color
- Links to the same Calendly URL
- Leverages existing translation keys (`notSure`, `bookConsultation`) already present in all 5 languages (EN, ES, DE, FR, RU)

## Technical Changes

### 1. `src/components/payments/PaymentFlow.tsx`
- Insert a new element between the `SocialProofStrip` (line 451) and the package grid (line 454)
- Simple centered `div` with `Calendar` icon + translated text linking to Calendly
- No new components needed

### 2. Translation files -- NO changes needed
The keys `notSure` and `bookConsultation` already exist in all 5 language files:
- EN: "Not sure yet?" / "Book a free 15-min consultation"
- ES: "No estas seguro/a?" / "Reserva una consulta gratuita de 15 min"
- DE: "Noch unsicher?" / "Kostenlose 15-Min-Beratung buchen"
- FR: (already present)
- RU: (already present)

No new dependencies, no new files. One small insertion in PaymentFlow.tsx.
