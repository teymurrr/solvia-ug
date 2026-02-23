

## High-Conversion Payment Page Overhaul

### Overview
Seven targeted changes to the PaymentFlow component, each backed by proven conversion principles. All changes go into `src/components/payments/PaymentFlow.tsx` and `src/utils/i18n/languages/*/payments.ts` (EN, ES, DE, FR, RU).

---

### 1. Single Urgency Banner (replace per-card clutter)

Remove the `<Badge>` + `<CountdownTimer />` from inside each card. Add one prominent banner between the country badge and the grid:

```text
[Zap icon] Limited introductory offer -- Save up to 50% | 5d 04h 30m 12s
```

- Styled as `bg-primary/10 border border-primary/20 rounded-lg p-3`
- Shows the savings percentage to anchor value
- Keeps cards cleaner so features and price stand out

---

### 2. Savings Badge on Each Card

Replace the removed offer badge with a small per-card "You save X" badge next to the strikethrough price:

```text
€899  €449   [Save €450]
```

This makes the deal concrete on every card without repeating the timer.

---

### 3. Money-Back Guarantee Strip

Add a guarantee bar directly below the pricing grid (always visible, not gated behind package selection):

```text
[ShieldCheck icon] 30-day money-back guarantee -- no questions asked
```

- Styled as `bg-green-50 border-green-200` (light) / dark mode equivalent
- New i18n key: `payments.guarantee` in all 5 languages
- This is the single highest-impact trust element missing from the page

---

### 4. Social Proof Row (above the grid)

Add a compact social proof strip between the urgency banner and the cards:

```text
[Star Star Star Star Star]  "Solvia made the whole process effortless" -- Dr. Maria L., Spain
```

- 2-3 rotating short quotes (one-liners) with name + country
- Uses existing `successStories` data pattern
- New i18n key: `payments.socialProof` with quotes array
- Keeps it minimal -- one line, not a carousel

---

### 5. "What Happens Next" Steps (in Payment Summary)

Inside the checkout card, add a 3-step visual below the email input and above the discount code:

```text
1. Complete payment securely via Stripe
2. Receive instant access to your dashboard
3. Your dedicated team contacts you within 24h
```

- Simple numbered list with small icons (CreditCard, Inbox, Headphones)
- Reduces "what am I buying?" anxiety
- New i18n key: `payments.nextSteps`

---

### 6. Alternative CTA -- "Book a Free Consultation"

Below the "Proceed to Payment" button, add a secondary link:

```text
Not sure yet?  [Calendar icon] Book a free 15-min consultation
```

- Links to existing Calendly URL (`https://calendly.com/david-rehrl-thesolvia/30min`)
- Captures users who aren't ready to pay but are high-intent
- Styled as a text link, not a competing button
- New i18n key: `payments.notSure`, `payments.bookConsultation`

---

### 7. Move Trust Indicators Above the Fold

The current trust badges (Secure Payment, 24h Support, Trusted by 500+) only appear after selecting a package. Move them to always-visible position right below the guarantee strip, so every visitor sees them immediately.

---

### File Changes Summary

| File | Changes |
|------|---------|
| `src/components/payments/PaymentFlow.tsx` | All 7 UI changes above |
| `src/utils/i18n/languages/en/payments.ts` | Add `guarantee`, `socialProof`, `nextSteps`, `notSure`, `bookConsultation`, `youSave` keys |
| `src/utils/i18n/languages/es/payments.ts` | Same new keys (Spanish) |
| `src/utils/i18n/languages/de/payments.ts` | Same new keys (German) |
| `src/utils/i18n/languages/fr/payments.ts` | Same new keys (French) |
| `src/utils/i18n/languages/ru/payments.ts` | Same new keys (Russian) |

### New Imports Needed
- `ShieldCheck`, `CreditCard`, `Inbox`, `Headphones`, `Calendar` from `lucide-react`

### Page Structure After Changes

```text
[Country Badge]
[Urgency Banner: Limited offer + Countdown]
[Social Proof: one-liner quote + stars]

[Card 1]           [Card 2 - Popular]    [Card 3]
€79 → €39          €379 → €189           €899 → €449
Save €40            Save €190              Save €450
features...         features...            features...
[Choose Plan]       [Choose Plan]          [Choose Plan]

[Guarantee: 30-day money-back, no questions asked]
[Trust: Secure Payment | 24h Support | Trusted by 500+]

--- (if package selected) ---
[Payment Summary Card]
  Email input
  What happens next (3 steps)
  Discount code
  Price breakdown
  [Start My Journey Now]
  Not sure? Book a free consultation
```

