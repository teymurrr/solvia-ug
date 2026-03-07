

# Black Dot on Mobile Safari — Deeper Analysis

## The Problem
The black dot persists in the **top-left corner** on **mobile Safari** despite adding `overflow-x: clip` to `html` and `overflow-x: hidden` to `body`.

## Root Cause (Revised)

Two compounding issues specific to Safari:

1. **`overflow-x: clip` is broken in Safari** — Apple's own developer forums confirm this bug is still present in Safari 18.3 (March 2025). It either doesn't work or incorrectly clips the Y-axis too. This means our primary fix is completely ineffective on the user's browser.

2. **iOS Safari ignores `overflow: hidden` on `html` and `body`** — This is a long-standing Safari behavior. The `overflow-x: hidden` on `body` (line 100 of index.css) is silently ignored. Overflow must be controlled on a **wrapper div**, not on `html`/`body`.

3. **The hero image dark corner** — The `hero-medical-team.jpg` likely has a dark area in its top-left corner. With `-mt-16` pulling the hero section up behind the navbar, and Safari not clipping the overflow, a sliver of this dark corner becomes visible through the navbar's semi-transparent background (`bg-white/80`) or at the very edge of the viewport.

## Fix Plan

### 1. Move overflow containment from html/body to the `#root` wrapper
In `src/index.css`, replace the html/body overflow rules with a `#root` selector:
```css
html {
  /* remove overflow-x: clip — broken in Safari */
  max-width: 100vw;
}

body {
  max-width: 100vw;
  position: relative;
}

#root {
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}
```
iOS Safari respects `overflow: hidden` on regular divs, just not on `html`/`body`.

### 2. Ensure MainLayout wrapper clips overflow
The MainLayout div already has `overflow-x-hidden max-w-full`. Add `position: relative` to ensure it creates a proper containing block for Safari:
```tsx
<div className="min-h-screen flex flex-col overflow-x-hidden max-w-full relative">
```

### 3. Fix the hero background to hide the dark corner on mobile
Add a mobile-specific background position to shift away from the problematic corner. Use a gradient overlay that fully covers the top-left on small screens:
```tsx
{/* Add an extra top-left corner cover for Safari */}
<div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-background/80 to-transparent sm:hidden z-[1]" />
```
This adds a small fade in the exact top-left corner on mobile only, covering any image artifact.

### Files to Change
- `src/index.css` — replace overflow rules (target `#root` instead of `html`/`body`)
- `src/components/MainLayout.tsx` — add `relative` class
- `src/components/landing/HeroSectionWithSearch.tsx` — add corner gradient cover for mobile

