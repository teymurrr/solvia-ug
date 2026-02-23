

## Move Countdown Timer to a Single Banner

### Problem
The countdown timer is currently rendered inside each of the three pricing cards, which is redundant and clutters the design.

### Solution
Remove the `<CountdownTimer />` from inside each card and place a single, prominent banner above the package grid. This banner will combine the "Limited introductory offer" message with the countdown timer.

### Changes (single file)

**`src/components/payments/PaymentFlow.tsx`**

1. Remove `<CountdownTimer />` from inside each card's pricing section (currently rendered per-card in the `CardContent`).
2. Remove the per-card "Limited introductory offer" badge as well, since the banner will convey this.
3. Add a single banner between the country indicator and the package grid:
   - Styled as a highlighted bar (e.g., `bg-primary/10 border border-primary/20 rounded-lg`) centered with the Zap icon, "Limited introductory offer" text, a separator, and the countdown timer.
   - Uses existing translations (`t?.payments?.limitedOffer`).
4. The `CountdownTimer` component stays unchanged internally, just used once instead of three times.

### Visual Result
```text
  [Country Badge]

  [--- Zap Limited introductory offer  |  Timer: 5d 04h 30m 12s ---]

  [Card 1]          [Card 2]          [Card 3]
  €79 → €39         €379 → €189       €899 → €449
  features...        features...        features...
```

