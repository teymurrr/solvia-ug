

## High-Conversion Payment Page Overhaul — Implementation Plan

### Overview
Seven changes across 6 files to maximize conversion on the payment page.

---

### Files to Modify

**1. `src/components/payments/PaymentFlow.tsx`** — All UI changes:

- **Line 10**: Add imports for `ShieldCheck`, `CreditCard`, `Inbox`, `Headphones`, `Calendar` from lucide-react
- **Lines 368-369**: After country badge, insert:
  - Urgency banner (`bg-primary/10` with Zap icon + "Limited introductory offer — Save up to 50%" + single `<CountdownTimer />`)
  - Social proof strip (rotating quote with 5 stars, author, country)
- **Lines 408-420**: In each card's pricing section:
  - Remove the `<Badge>` with "Limited introductory offer" (lines 410-413)
  - Remove `<CountdownTimer />` (line 414)
  - Add a "Save €X" badge next to the price display
- **After line 451** (after the grid closes): Insert:
  - Money-back guarantee strip (`bg-green-50 border-green-200` with ShieldCheck icon)
  - Trust indicators moved here (currently lines 556-568, inside the payment summary card)
- **Lines 461-476**: Inside payment summary, after email input, add "What happens next" 3-step visual with CreditCard/Inbox/Headphones icons
- **After line 553** (after payment button): Add "Not sure? Book a free consultation" secondary link
- **Lines 555-569**: Remove trust indicators from inside the summary card (moved to always-visible position)

**2-6. i18n files** (EN, ES, DE, FR, RU `payments.ts`):

Add these new keys after `popupBlocked`:
- `guarantee` — money-back guarantee text
- `youSave` — "Save" prefix for per-card badge
- `saveUpTo` — "Save up to 50%" for banner
- `notSure` — "Not sure yet?"
- `bookConsultation` — "Book a free 15-min consultation"
- `socialProofQuotes` — array of 3 objects with `text`, `author`, `country`
- `whatHappensNext` — object with `title` and `steps` array (3 items)

### Final Page Structure

```text
[Country Badge]
[Urgency Banner: Zap + Limited offer + Save up to 50% | Countdown]
[Social Proof: stars + rotating quote]

[Card 1]           [Card 2 - Popular]    [Card 3]
€79 → €39          €379 → €189           €899 → €449
[Save €40]          [Save €190]            [Save €450]
features...         features...            features...
[Choose Plan]       [Choose Plan]          [Choose Plan]

[ShieldCheck: 30-day money-back guarantee]
[Shield: Secure | Clock: 24h Support | Users: Trusted by 500+]

--- (if package selected) ---
[Payment Summary]
  Email input
  What happens next (3 steps with icons)
  Discount code
  Price breakdown
  [Start My Journey Now]
  Not sure? Book a free 15-min consultation
```

