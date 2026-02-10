

# Landing Page CTA Overhaul + Dual Offer Strategy

## Understanding the Two Offers

Solvia has two independent services that different users may need:

1. **Homologation Service** (credential recognition) — Document preparation, apostilles, translations, file submission, personal advisor, job placement. The packages with manual accompaniment are EUR 199 (Complete) and EUR 499 (Personal Mentorship). The EUR 49 (Digital Starter) is self-service.

2. **Language Classes** (Medical German/French/etc.) — Starter Kit (EUR 29, self-study PDFs + audio), plus presumably live classes at higher tiers. Not everyone going to Spain needs German classes. Not everyone who needs German classes also needs homologation help.

Currently the landing page treats these as one blended funnel, which creates confusion. Some users only need classes (e.g., they can handle paperwork themselves), and some only need homologation (e.g., they already speak the language).

## Proposed Strategy: Single Entry Point, Needs Detected in Wizard

Rather than splitting the landing page into two funnels (which halves conversion), the best approach is:

- **One primary CTA everywhere** that leads to the **homologation wizard** (`/homologation-wizard`)
- The wizard already captures country + profession + language level
- Based on wizard answers, the **result page** shows relevant offers:
  - Low language level + going to Germany? Show both homologation + language classes
  - Already B2 German? Show only homologation packages
  - Going to Spain (same language)? Show only homologation, no classes needed
- The **Learning Mini Banner** stays as a secondary soft entry for users who know they only need classes

This way we don't force users to self-segment on the landing page.

## Changes Required

### 1. Fix All CTAs and Links (all 5 languages)

**Hero Section** (`HeroSectionWithSearch.tsx` + all `hero.ts` files):
- Primary CTA: "Start my free assessment" -> `/homologation-wizard`
- Secondary CTA: "Explore open positions" -> `/vacancies`
- Swap the current primary/secondary — vacancies becomes the soft secondary option

| Language | New Primary CTA | New Secondary CTA |
|----------|----------------|-------------------|
| EN | Start my free assessment | Explore open positions |
| ES | Comenzar mi evaluacion gratuita | Explorar posiciones abiertas |
| DE | Meine kostenlose Bewertung starten | Offene Stellen ansehen |
| FR | Commencer mon evaluation gratuite | Explorer les postes ouverts |
| RU | Начать бесплатную оценку | Посмотреть открытые позиции |

**Path to Success** (`PathToSuccessSection.tsx` + all `pathToSuccess.ts` files):
- CTA: "Start my free assessment" -> `/homologation-wizard` (currently `/signup`)

| Language | New CTA |
|----------|---------|
| EN | Start My Free Assessment |
| ES | Comenzar Mi Evaluacion Gratuita |
| DE | Meine kostenlose Bewertung starten |
| FR | Commencer Mon Evaluation Gratuite |
| RU | Начать Бесплатную Оценку |

**Success Stories** (`SuccessStoriesSection.tsx`):
- Fix micro-CTA link: `/homologation` -> `/homologation-wizard`
- Fix card CTA links: `/homologation` -> `/homologation-wizard`

**Super CTA** (`SuperCTASection.tsx` + all `landing.ts` files):
- Primary: "Start my free assessment" -> `/homologation-wizard`
- Secondary: "Explore open positions" -> `/vacancies`
- Fix links from `/signup/professional` and `/homologation`

| Language | New Primary | New Secondary |
|----------|------------|---------------|
| EN | Start my free assessment | Explore open positions |
| ES | Comenzar mi evaluacion gratuita | Explorar posiciones abiertas |
| DE | Meine kostenlose Bewertung starten | Offene Stellen ansehen |
| FR | Commencer mon evaluation gratuite | Explorer les postes ouverts |
| RU | Начать бесплатную оценку | Посмотреть открытые позиции |

### 2. Remove Distracting/Problematic Elements

**Remove from `Index.tsx`:**
- `BlackFridayBanner` (fake urgency with resetting countdown and `Math.random()` spots)
- `EmployerBanner` (targets wrong audience — B2B on a B2C page)

### 3. Keep Learning Mini Banner As-Is

The `LearningMiniBanner` stays as the secondary entry point for users who only need language classes. It links to `/learning/starter-kit` which is correct — it serves the "I only need classes" segment without cluttering the main funnel.

### 4. FAQ Micro-CTAs Are Already Correct

The `ConversionFAQSection` already links to `/homologation-wizard?country=X` — no changes needed there.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/landing/HeroSectionWithSearch.tsx` | Swap CTA destinations and translation keys |
| `src/components/landing/PathToSuccessSection.tsx` | Change link from `/signup` to `/homologation-wizard` |
| `src/components/landing/SuccessStoriesSection.tsx` | Change 3 links from `/homologation` to `/homologation-wizard` |
| `src/components/landing/SuperCTASection.tsx` | Change both CTA destinations and translation keys |
| `src/pages/Index.tsx` | Remove BlackFridayBanner and EmployerBanner |
| `src/utils/i18n/languages/en/hero.ts` | Update CTA text |
| `src/utils/i18n/languages/es/hero.ts` | Update CTA text |
| `src/utils/i18n/languages/de/hero.ts` | Update CTA text |
| `src/utils/i18n/languages/fr/hero.ts` | Update CTA text |
| `src/utils/i18n/languages/ru/hero.ts` | Update CTA text |
| `src/utils/i18n/languages/en/landing.ts` | Update superCta text |
| `src/utils/i18n/languages/es/landing.ts` | Update superCta text |
| `src/utils/i18n/languages/de/landing.ts` | Update superCta text |
| `src/utils/i18n/languages/fr/landing.ts` | Update superCta text |
| `src/utils/i18n/languages/ru/landing.ts` | Update superCta text |
| `src/utils/i18n/languages/en/pathToSuccess.ts` | Update CTA text |
| `src/utils/i18n/languages/es/pathToSuccess.ts` | Update CTA text |
| `src/utils/i18n/languages/de/pathToSuccess.ts` | Update CTA text |
| `src/utils/i18n/languages/fr/pathToSuccess.ts` | Update CTA text |
| `src/utils/i18n/languages/ru/pathToSuccess.ts` | Update CTA text |

## What This Does NOT Cover (Future Work)

- Modifying the wizard result page to conditionally show classes vs. homologation based on user answers — that is a separate, larger piece of work
- Clarifying what the EUR 49/199/499 packages actually deliver (needs your input)
- The classes product page and its own funnel

