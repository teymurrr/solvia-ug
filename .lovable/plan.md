

# Redesign: Horizontal "How It Works" + Country Options Section

## What changes

### 1. Replace vertical timeline with horizontal step layout
The current "Path to Success" section uses a vertical alternating timeline with scroll animation. This will be replaced with a clean **horizontal 4-step layout** (left to right) that is immediately scannable:

```text
[01 Explore]  -->  [02 Homologate]  -->  [03 Apply]  -->  [04 Start Working]
```

- On desktop: 4 columns in a row with connecting lines/arrows between them
- On mobile: 2x2 grid (not vertical) to maintain the left-to-right reading flow
- Each step: icon on top, step number, title, short description
- Clean, minimal cards -- no scroll animation needed (reduces complexity, loads faster)

### 2. Add Country Options section directly below
Immediately after "How It Works", show the 4 country cards with the two key decision factors:
- **Process duration** (how long it takes)
- **Starting price** (from EUR 49 -- the Digital Starter package)

Layout per country card:

```text
  [Flag + Country Name]
  [Highlight badge, e.g. "Best salaries"]
  
  Duration:  6-12 months
  From:      EUR 49
  
  [Learn more ->]
```

Each card links to `/homologation-wizard` so users enter the funnel. A single CTA below reinforces the action.

### 3. Conversion rationale

**Why horizontal steps convert better:**
- Users scan left-to-right naturally; a horizontal layout communicates "this is simple, just 4 steps" in under 2 seconds
- Vertical timelines suggest a long journey -- horizontal says "quick process"
- No scroll dependency means the message is delivered immediately on page load

**Why showing price + duration converts better:**
- These are the two biggest objections (cost and time). Answering them early reduces bounce
- "From EUR 49" is a low-friction anchor price that makes the service feel accessible
- Duration sets realistic expectations and prevents "this seems too complex" dropout
- Country cards create a natural "choose your path" interaction that pulls users into the funnel

## Technical details

### Files to modify

**`src/components/landing/PathToSuccessSection.tsx`** -- Complete rewrite:
- Remove scroll-linked animation logic (useEffect, refs, progress state)
- Replace with a simple horizontal grid: `grid-cols-2 md:grid-cols-4`
- Add connecting arrows/lines between steps on desktop (CSS pseudo-elements or a thin divider)
- Keep existing i18n keys (`t.pathToSuccess.*`)

**`src/pages/Index.tsx`** -- Add country section:
- Import and add `CountryComparisonSection` (or a new lightweight version) between PathToSuccessSection and JobExplorerSection
- Can reuse the existing `CountryComparisonSection` component with modifications

**`src/components/landing/CountryComparisonSection.tsx`** -- Update card content:
- Replace salary display with "From EUR 49" (cheapest package price)
- Keep process duration
- Keep highlight badges
- Simplify card design: flag, name, duration, price, CTA link
- Remove "positions available" count (less relevant at this stage)

**Translation files** (es, en, de, fr, ru landing.ts) -- Add/update:
- `countryComparison.startingFrom` = "From" / "Desde" / "Ab" / "A partir de" / etc.
- Update any labels that reference salary to reference starting price instead
