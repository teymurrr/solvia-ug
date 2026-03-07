

# Investigating the Persistent Black Dot on Mobile

## What We Know
- The black dot was **not there before** — it appeared after a recent change
- Changing the background image position (`bg-center` → `bg-right-bottom`) did **not** fix it
- It only shows on **mobile**, not desktop
- The browser automation identified it as a **scrollbar arrow/triangle** at the viewport edge

## Root Cause: Horizontal Overflow Triggering a Native Scrollbar

On certain mobile browsers (especially older iOS Safari or non-overlay scrollbar modes), a small horizontal overflow creates a visible scrollbar that manifests as a tiny black rectangle/triangle at the edge of the viewport.

The most likely overflow sources:

1. **Navbar right-side elements**: Line 104 in `Navbar.tsx` uses `-mr-2` (negative margin) on the mobile button group, which can push content slightly beyond the viewport edge
2. **Hero section**: The `-mt-16` negative margin on the hero section (line 28 of `HeroSectionWithSearch.tsx`) combined with `pt-16` on the `<main>` element can create subpixel overflow on certain screen sizes
3. **WhatsApp FAB**: Positioned `fixed bottom-6 right-6` — at exactly the viewport edge on small screens, the button (56px + 24px right = 80px from edge) could extend slightly past the viewport

## Fix Plan

### 1. Add overflow containment at the root level
In `index.css`, ensure the `html` element clips any stray overflow:
```css
html {
  overflow-x: clip; /* stronger than hidden, prevents scroll behavior entirely */
}
```

### 2. Remove the `-mr-2` negative margin from Navbar mobile section
In `Navbar.tsx` line 104, change:
```
className="-mr-2 flex items-center gap-1 sm:hidden"
```
to:
```
className="flex items-center gap-1 sm:hidden"
```
The `-mr-2` pulls the hamburger button outside the padding boundary, which on tight mobile viewports causes 2px of horizontal overflow.

### 3. Revert hero background to `bg-center` (since that wasn't the cause)
In `HeroSectionWithSearch.tsx` line 31, restore `bg-center` since changing it didn't fix the dot and the centered position looks better.

### Files Changed
- `src/index.css` — add `overflow-x: clip` to `html`
- `src/components/Navbar.tsx` — remove `-mr-2` from mobile nav container
- `src/components/landing/HeroSectionWithSearch.tsx` — revert to `bg-center`

