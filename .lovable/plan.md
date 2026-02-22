

# Unified "How It Works + Country Options" Section

## Problem
The "How It Works" steps and "Country Comparison" are currently two separate `<section>` elements with different backgrounds (`bg-background` vs `bg-muted/30`), each with their own `py-16` padding. This creates a large visual gap and makes them feel disconnected, even though they are part of the same narrative: "Here's how it works, now pick your country."

## Solution
Merge both into a **single combined section** inside `PathToSuccessSection.tsx`. Remove the separate `CountryComparisonSection` from `Index.tsx` and inline the country cards directly below the steps -- all within one cohesive section with one background, tighter spacing, and a single CTA at the bottom.

### Visual structure (top to bottom):

```text
  "How It Works" heading + subtitle
  
  [Step 1] --- [Step 2] --- [Step 3] --- [Step 4]
  
  "Choose Your Destination" sub-heading
  
  [Germany]  [Austria]  [Spain]  [France]
   From €49   From €49   From €49   From €49
   6-12 mo    4-8 mo     2-6 mo     4-10 mo
  
  [Get my personalized plan ->]
  Free assessment - No commitment
```

### Design improvements for the country cards:
- Remove the floating badge that clips outside the card (causes visual issues). Instead, place the highlight text **inside** the card as a colored accent line or inline tag
- Use a subtle gradient or border-left color accent per country instead of floating badges
- Slightly larger flag emoji with country name directly below
- Price and duration side by side in a compact row rather than stacked blocks
- Hover effect: subtle scale + shadow lift

## Technical changes

### 1. `src/components/landing/PathToSuccessSection.tsx`
- Remove `py-16`, use `pt-16 pb-20` for the unified section
- After the steps grid + CTA button, add a divider/sub-heading and the country cards grid inline
- Import `Card`, `Badge`, `Clock`, `ArrowRight`, `Globe` and the country data
- Move country card rendering logic from `CountryComparisonSection` into this component
- Single CTA at the bottom (remove the one after steps)

### 2. `src/pages/Index.tsx`
- Remove `CountryComparisonSection` import and usage
- Keep only `PathToSuccessSection` (which now contains both parts)

### 3. `src/components/landing/CountryComparisonSection.tsx`
- Keep the file (no deletion) but it will no longer be used on the landing page Index. It may still be useful elsewhere.

