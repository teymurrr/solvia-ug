

# Landing Page Conversion Audit -- Full Analysis

## Current Page Flow (top to bottom)

1. Hero (headline + 2 CTAs + trust line + stats strip)
2. Partners (2 accelerator logos)
3. Path to Success (4-step animated timeline)
4. Job Explorer (4 sample job cards + 4 country comparison cards)
5. Success Stories (3 testimonial cards)
6. FAQ (6 items with micro-CTAs)
7. Learning Mini Banner (one-liner for Starter Kit)
8. Super CTA (final conversion block)

---

## What's Working Well

- **Single funnel**: All primary CTAs correctly point to `/homologation-wizard` -- clean, no confusion.
- **No fake urgency**: No countdowns, no "only X spots left" -- builds trust.
- **Country comparison with salary focus**: Leading with earnings (not price) is the right strategy.
- **Success stories with verifiable details**: Start dates, timelines, and hospital names add credibility.
- **Micro-CTAs in FAQ answers**: Smart -- catches people actively reading for answers.

---

## Issues Found (Ranked by Conversion Impact)

### 1. HERO: Background image is invisible (HIGH IMPACT)
The hero uses `hero-medical-team.jpg` with a `bg-background/90` overlay that makes it essentially invisible -- a white page with text on top. This wastes the most valuable real estate on the page. Either use the image properly (with ~60% overlay) or remove it entirely and use a clean design with an illustration or graphic element instead.

### 2. HERO: Stats are unverifiable and generic (HIGH IMPACT)
"+500 registered professionals", "+200 homologations in progress", "92% satisfaction" -- these are static hardcoded numbers. If a visitor Googles Solvia and sees this is an early-stage startup backed by accelerators, these numbers hurt credibility rather than help. For an early-stage product, replace vanity metrics with specific, verifiable proof points (e.g., "12 countries supported", "Average 6-month process time", "Partnered with 2 accelerators").

### 3. NAVBAR: No navigation links for non-logged-in visitors (HIGH IMPACT)
`NavLinks` returns `null` when not logged in. A first-time visitor sees only the logo, language selector, Log In, and Sign Up. There's no way to navigate to key pages like `/vacancies`, `/about`, `/for-doctors`, `/learning`, or `/employers` from the navbar. This forces the entire conversion burden onto the single landing page scroll. Adding 2-3 navigation links (e.g., "Vacancies", "How It Works", "For Employers") would reduce bounce rate and give visitors agency.

### 4. NO PRICING VISIBILITY on landing page (MEDIUM-HIGH IMPACT)
The country comparison cards show salary and duration but never mention what Solvia costs. Visitors see "Get my personalized plan" but have no idea if the service costs 50 euros or 5,000 euros. This creates anxiety. Adding a simple line like "Plans from 49 euros" or linking to a visible pricing section would reduce the friction of entering the wizard.

### 5. JOB CARDS: "Example Position" label damages trust (MEDIUM IMPACT)
Two of the four job cards are explicitly labeled "Example Position" with a disclaimer "Sample job for illustration." This actively tells visitors "these aren't real." Either show only real positions (pull from DB) or remove the sample labels and show all four as representative roles without disclaimers.

### 6. PATH TO SUCCESS vs. HOW IT WORKS: Duplicate concept (MEDIUM IMPACT)
`PathToSuccessSection` and `HowItWorksSection` both explain the same 4 steps (explore, homologate, apply, relocate). `HowItWorksSection` isn't currently on the landing page but exists as a component. This is fine for now but ensure only one is used. The current `PathToSuccessSection` is better (animated timeline).

### 7. FOOTER: Links go to non-existent routes (LOW-MEDIUM IMPACT)
Footer links like "Create Profile" go to `/professionals` and "Post Positions" goes to `/institutions` -- but `Institutions.tsx` was just deleted, and `/professionals` may have auth-gating issues. Footer should link to actual public pages: `/signup/professional`, `/signup/institution`, `/vacancies`, `/about`.

### 8. LEARNING MINI BANNER: Too subtle (LOW IMPACT)
The one-liner banner for the Starter Kit between FAQ and Super CTA is easy to miss. It could be slightly more prominent -- perhaps a card with a brief value prop instead of just a text link.

### 9. SUPER CTA: Emoji in heading (LOW IMPACT)
The target emoji in the heading looks unprofessional for a healthcare service. Remove it.

### 10. MOBILE: Sign Up button competes with hamburger menu (LOW IMPACT)
On mobile, the navbar shows both a "Sign Up" button and the hamburger icon, which crowds the header. The Sign Up CTA could be inside the mobile menu instead.

---

## Missing Elements (Opportunities)

### A. No "What You Get" / Service Overview Section
The page jumps from "how the process works" to "job cards" without ever explaining what Solvia actually delivers. There's no section that says: "We handle document preparation, translations, apostilles, job matching, and relocation support." A brief 3-column feature section between Path to Success and Job Explorer would fill this gap.

### B. No pricing teaser on landing page
As noted above -- visitors need at least a hint of cost before entering the wizard. A small "Plans from 49 euros" badge near the country cards or a mini pricing section would help.

### C. No WhatsApp / live contact option visible
For the LATAM audience (Spanish-speaking doctors), WhatsApp is the dominant communication channel. A floating WhatsApp button or a visible "Talk to an advisor" link would significantly increase engagement from this demographic.

### D. Missing France in FAQ country links
The FAQ micro-CTAs only link to Germany, Austria, and Spain -- but France is a supported country shown in the country cards. It should be added.

---

## Recommended Implementation Priority

| Priority | Change | Expected Impact |
|----------|--------|-----------------|
| 1 | Add 2-3 navbar links for non-logged-in visitors | Reduce bounce, improve navigation |
| 2 | Fix hero -- either show the image properly or replace with clean design | Better first impression |
| 3 | Replace vanity stats with honest, verifiable proof points | Build trust for early-stage |
| 4 | Remove "Example Position" labels from job cards | Stop undermining own credibility |
| 5 | Add a "What Solvia includes" feature section | Clarify the value proposition |
| 6 | Add pricing teaser near country cards ("Plans from 49 euros") | Reduce wizard entry anxiety |
| 7 | Fix footer links to point to real pages | Prevent broken UX |
| 8 | Remove emoji from Super CTA heading | Professional appearance |
| 9 | Add France to FAQ micro-CTA links | Consistency |
| 10 | Consider WhatsApp floating button for LATAM audience | Channel preference match |

---

## Technical Details

Files that would need changes:
- `src/components/landing/HeroSectionWithSearch.tsx` -- hero image/stats rework
- `src/components/navbar/NavLinks.tsx` -- add public navigation links
- `src/components/landing/JobExplorerSection.tsx` -- remove sample labels, add pricing teaser
- `src/components/landing/SuperCTASection.tsx` -- remove emoji
- `src/components/landing/ConversionFAQSection.tsx` -- add France to country links
- `src/components/Footer.tsx` -- fix broken links
- New file: `src/components/landing/WhatYouGetSection.tsx` -- service feature overview
- Translation files (en, es, de, fr, ru) -- new keys for navbar links, feature section

No database changes required. No backend changes needed.

