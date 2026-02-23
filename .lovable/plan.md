

# Homologation Results Page: Condensed Layout + Smart Language Logic

## Problems Identified

### 1. Language step shown when irrelevant
The roadmap always displays "Language Preparation" as step 2, even when the user already speaks the target country's language (e.g., a Colombian targeting Spain). The `requiresForeignLanguage()` function exists and correctly detects this case, but it's only used for the diagnosis card -- the roadmap ignores it entirely.

### 2. Page is not condensed enough
The current layout has four full-width sections stacked vertically with generous padding, making the page feel long and diluted. Key conversion elements (the price card and CTAs) end up far below the fold.

---

## Solution

### A. Smart roadmap: skip the language step when not needed

Filter out the "Language Preparation" roadmap step (step 2) when `requiresForeignLanguage()` returns `false`. This means:
- A Colombian doctor targeting Spain will NOT see a "Language Preparation" step
- A German doctor targeting Austria will NOT see it either
- A Colombian targeting Germany WILL see it (they need to learn German)

The step numbering will automatically adjust (steps renumber to 01-04 instead of 01-05).

### B. Condense the layout into fewer visual sections

Merge the page into a tighter, more conversion-focused flow:

```text
[Badge: "We analyzed your profile"]
[H1: Your Path to Germany]
[Subtitle + salary urgency on same line]
[Profile pills inline]

--- tighter gap ---

[Duration] [Language Gap*] [Documents]   <-- diagnosis cards (same row)

--- minimal gap ---

[Roadmap title]
[Step 1] [Step 2*] [Step 3 locked] [Step 4 locked]
[Gradient fade + Unlock CTA]

--- minimal gap ---

[Salary vs Investment side-by-side]
[Trust badges inline]
[Two CTA buttons]
[Guarantee text]
```

Specific spacing reductions:
- Hero section: reduce `pt-10 pb-6` to `pt-8 pb-4`
- Main content container: reduce `space-y-6` to `space-y-4`
- Roadmap heading: reduce `mb-6` to `mb-3`
- Price card section: reduce `mt-6` to `mt-2`
- Overall bottom padding: reduce `pb-16` to `pb-10`

### C. Merge salary urgency into the subtitle area

Instead of having the salary loss message as a separate block with its own icon, append it to the subtitle paragraph or make it a compact inline badge under the subtitle, removing the separate `div` wrapper and reducing vertical space.

---

## Technical Changes

### File: `src/pages/HomologationResult.tsx`

1. **Filter roadmap steps** (lines 182-189): Wrap the language step in a conditional based on `requiresForeignLanguage()`:
   - Only include the language step (`roadmap.step2`) when `requiresForeignLanguage()` is `true`
   - Steps will auto-number correctly since we use `i + 1`

2. **Reduce vertical spacing** throughout:
   - Hero section padding: `pt-10 pb-6` becomes `pt-8 pb-3`
   - Container `space-y-6` becomes `space-y-4`
   - Roadmap heading `mb-6` becomes `mb-3`
   - Price card `mt-6` becomes `mt-2`
   - Bottom padding `pb-16` becomes `pb-10`

3. **Make salary urgency more compact**: Convert the standalone salary loss line into a smaller inline element within the subtitle area, combining it with the subtitle text to save a full line of vertical space.

4. **Diagnosis cards**: When `showLanguageCard` is false, the grid will have 2 cards. Switch from `md:grid-cols-3` to a dynamic class: use 3 columns when language card is shown, 2 columns otherwise. This prevents awkward empty space.

