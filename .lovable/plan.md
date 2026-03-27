

# Solvia Brand Optimization — Implementation Plan

## Summary of New Branding

The brand report proposes shifting from the current pastel blue (#0974f1 / #9DD6F1) to a deep trust blue (#1A5F8A) with a warm amber accent (#E8A838) for CTAs. New typography adds **Fraunces** (serif) for headings alongside **DM Sans** for body text. The goal: more authority, better accessibility (WCAG AA+), and higher conversion through warm CTA contrast.

### New Color System
| Role | Current | Proposed |
|------|---------|----------|
| Primary | #0974f1 | #1A5F8A |
| Primary Dark | — | #0F3D5C |
| Primary Light | #9fccfa | #2B7DB5 |
| Accent/CTA | (none — blue only) | #E8A838 (amber) |
| Text | default | #1C2B36 |
| Body text | default | #3A4F5E |
| Muted | default | #6B8190 |
| Border | default | #B0C4CE |
| Surface | default | #EDF2F5 |
| Success | — | #2D8F5E |
| Error | — | #C94444 |

---

## Phase 1: Foundation (CSS Variables + Fonts)

### 1.1 Update `src/index.css` — CSS custom properties
Replace the `:root` HSL values to match the new palette. Convert hex values to HSL:
- `--primary`: #1A5F8A → `201 67% 32%`
- `--primary-foreground`: white
- `--secondary` (amber): #E8A838 → `37 79% 56%`
- `--secondary-foreground`: #1C2B36
- `--accent`: #E8A838 (same as secondary for CTA emphasis)
- `--muted-foreground`: #6B8190
- `--border`: #B0C4CE
- `--background`: #FAFBFC → `210 14% 98%`
- `--destructive`: #C94444

Also update `.hero-gradient` from `#0974f1 → #9fccfa` to `#0F3D5C → #1A5F8A → #2B7DB5`.

Update `.text-gradient` and `.shimmer-gradient` with new blue values.

### 1.2 Update `index.html` — Add Fraunces font
Add Google Fonts link for **Fraunces** (serif, weights 300/500/700) alongside existing fonts.

### 1.3 Update `tailwind.config.ts`
- Add `fontFamily` config: `heading: ['Fraunces', 'serif']` and `body: ['DM Sans', 'sans-serif']`
- Update `medical` and `healing` color scales to align with new palette

---

## Phase 2: Global Components

### 2.1 Logo (`src/components/Logo.tsx`)
- Change color from `text-gray-500` to the new primary `text-[#1A5F8A]`
- Optionally highlight the "v" in amber: wrap in `<span className="text-[#E8A838]">`

### 2.2 Navbar (`src/components/Navbar.tsx`)
- Update scroll background from `bg-white/80` to keep white but ensure the "Sign Up" button uses amber accent: `className="bg-[#E8A838] text-[#1C2B36] hover:bg-[#C78820]"`

### 2.3 Footer (`src/components/Footer.tsx`)
- Update `bg-white` to `bg-[#EDF2F5]` for the surface color
- Links hover color will auto-update via `hover:text-primary`

---

## Phase 3: Landing Page (`src/pages/Index.tsx` sections)

### 3.1 HeroSectionWithSearch
- The background image overlay changes from `bg-background/60` to a subtle deep blue tint
- Primary CTA button gets amber styling: `bg-[#E8A838] text-[#1C2B36] hover:bg-[#C78820]` with shadow
- H1 gets `font-heading` (Fraunces) class
- Stats strip numbers use new `text-primary` (auto-updates via CSS vars)

### 3.2 PathToSuccessSection
- Section heading gets `font-heading`
- Country card tag colors update via CSS variable cascade
- CTA buttons within cards get amber accent

### 3.3 SuperCTASection
- `hero-gradient` auto-updates from Phase 1
- Primary CTA (secondary variant button) should use amber: override to `bg-[#E8A838] text-[#1C2B36]`
- "Book a Call" outline button: `border-white/50` stays, works well on new darker gradient

### 3.4 JobExplorerSection, SuccessStoriesSection, ConversionFAQSection, BlogSection
- These use `text-primary`, `bg-primary`, `border-primary` — they auto-update via CSS variables
- Add `font-heading` to section `<h2>` headings

---

## Phase 4: Secondary Pages

### 4.1 About page (`src/components/about/HeroSection.tsx`)
- H1 gets `font-heading`
- `bg-gray-50` → `bg-[#EDF2F5]` (surface color)

### 4.2 Employers landing (`src/components/employer-landing/HeroSection.tsx`)
- H1 gets `font-heading`
- CTA button gets amber styling

### 4.3 Country-specific landings (ARLanding, COLanding, INLanding)
- Apply same pattern: Fraunces headings, amber CTAs

### 4.4 Homologation Wizard page
- The wizard entry CTA is the highest-conversion element — ensure amber button styling

### 4.5 Blog pages
- `.blog-content a` color changes from `#0974f1` to `#1A5F8A` (via CSS update)
- Heading styles in `.blog-content` get `font-family: 'Fraunces', serif`

### 4.6 Auth pages (Login, Signup)
- Submit buttons get amber accent
- Any blue accents update via CSS variables

---

## Phase 5: UI Components

### 5.1 Button component (`src/components/ui/button.tsx`)
- Default variant: already uses `bg-primary` — auto-updates
- Add a new `cta` variant with amber colors for high-priority actions
- Or override secondary variant to use amber

### 5.2 Blog editor toolbar
- Update hardcoded `#0974f1` references to `#1A5F8A`

---

## Phase 6: Dark mode
- Update `.dark` CSS variables in `index.css` to complement the new palette
- Primary stays the same, surfaces become darker neutrals

---

## Implementation Order
1. CSS variables + fonts (instant global impact, ~70% of visual change)
2. Logo + Navbar + Footer
3. Landing page hero + CTA buttons (highest conversion impact)
4. All section headings → Fraunces
5. Secondary pages
6. Dark mode adjustments

**Estimated scope**: ~15-20 file edits. The CSS variable approach means most color changes cascade automatically — the manual work is primarily fonts, amber CTA overrides, and hardcoded color values.

