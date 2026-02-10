

# Landing Page Messaging Audit and Restructure

## The Problem

The current landing page has **multiple competing messages** that dilute the core value proposition. A visitor scrolling through sees:

1. **Hero**: "Work in Europe as a doctor or nurse" (career opportunity)
2. **Stats strip**: 4 countries, 200+ positions, accelerators, digital (mixed signals)
3. **Partners**: "Backed by leading accelerators" (credibility, but unfamiliar names)
4. **Path to Success**: "How it works" (process steps)
5. **Job Explorer**: "Explore Real Opportunities in Europe" (job listings + country comparison + pricing teaser)
6. **Success Stories**: "Professionals who trusted Solvia" (social proof)
7. **Community**: Community forum posts (engagement, but distracting from conversion)
8. **FAQ**: "Frequently Asked Questions" (objection handling)
9. **Learning Banner**: "Need medical language?" (upsell -- distraction)
10. **Super CTA**: "Start Your Journey to Europe Today" (conversion)

The visitor is pulled between "find a job", "homologate your license", "join a community", and "buy a language kit" -- all on one page. There's no single narrative thread.

---

## Proposed Narrative: One Clear Story

The entire page should answer **one question** from the visitor's perspective:

> **"I'm a doctor/nurse abroad. How do I start working in Europe?"**

Every section becomes one step in that answer, building a logical persuasion arc:

```text
1. PROMISE    -- "We get you working in Europe"
2. HOW        -- "Here's how, in 4 steps"
3. PROOF      -- "Here are real jobs waiting"  
4. TRUST      -- "Others like you already did it"
5. OBJECTIONS -- "Your questions, answered"
6. ACTION     -- "Start now, it's free"
```

---

## Concrete Changes

### 1. Hero -- Sharpen the single promise
- **Current title**: "Work in Europe as a doctor or nurse."
- **Proposed title**: "Your medical career in Europe starts here."
- **Current subtitle**: "See your offers by country and get guidance..."
- **Proposed subtitle**: "We handle your license recognition, find you a job, and guide you every step of the way."
- Remove secondary CTA ("Explore open positions") -- one CTA only: "Start my free assessment"
- Keep trust line and stats strip as-is

### 2. Remove Partners section from main flow
- Move it into the footer or a small "Backed by" line inside the stats strip
- Unfamiliar accelerator logos add visual noise without building trust for the target audience

### 3. Path to Success -- Tighten as "How it works"
- Keep as-is, it's well structured
- Update subtitle to reinforce the single message: "From first consultation to your first day at work -- we handle everything."

### 4. Job Explorer -- Reframe as proof of demand
- **Current title**: "Explore Real Opportunities in Europe"
- **Proposed title**: "200+ positions waiting for qualified professionals"
- **Proposed subtitle**: "Real hospitals and clinics across 4 countries are hiring now."
- Remove country comparison cards from this section (salary/duration info). Move that data into the homologation wizard where it's more contextual and helps conversion there.
- Keep just the 4 job cards + a single CTA: "See all open positions" (links to /vacancies)

### 5. Success Stories -- Keep, but tighten header
- **Current title**: "Professionals who trusted Solvia"
- **Proposed title**: "They started where you are now"
- Remove the "Want to be next?" micro-CTA above cards (redundant, weakens the stories)
- Keep individual card CTAs

### 6. Remove Community section from landing page
- Community posts are engagement content, not conversion content
- They break the persuasion flow by showing user-generated content of variable quality
- Keep Community accessible from the navigation menu

### 7. Remove Learning Mini Banner
- The language kit upsell is a distraction on the landing page
- It's already served contextually on the homologation result page where it belongs

### 8. FAQ -- Keep as-is
- Good objection handling
- Country micro-CTAs inside answers are effective

### 9. Super CTA -- Simplify
- **Current**: Two CTAs (assessment + explore positions)
- **Proposed**: Single CTA: "Start my free assessment"
- Remove "Start Today" badge (generic)
- Tighten subtitle to close the loop: "Join 230+ healthcare professionals who already started their journey."

### 10. Hardcoded "Start Today" badge in SuperCTA
- The badge text "Start Today" is hardcoded in English -- will also be added to i18n

---

## Updated Page Structure (Index.tsx)

```text
Hero                    -- Promise + single CTA
Stats Strip             -- (inside Hero, keep as-is, optionally add partner logos here)
Path to Success         -- How it works in 4 steps  
Job Explorer            -- Proof: real jobs (simplified, no country cards)
Success Stories          -- Trust: real people
FAQ                     -- Objection handling
Super CTA               -- Final conversion (single CTA)
```

Removed from landing:
- PartnersSection (merged into stats or footer)
- CommunitySection  
- LearningMiniBanner

---

## i18n Updates

All copy changes will be applied across all 5 language files (EN, DE, ES, FR, RU) for:
- `hero.title`, `hero.subtitle`, `hero.secondaryCta` removal
- `pathToSuccess.subtitle`
- `landing.jobExplorer.title`, `landing.jobExplorer.subtitle`
- `landing.successStories.title`, removal of `microCta`/`microCtaLink`
- `landing.superCta` badge addition and subtitle update
- Hardcoded "Start Today" string moved to i18n

---

## Summary

The core principle: **every section on the page should answer "why should I start my assessment now?"** -- not "join our community", "buy a language kit", or "look at our accelerator partners". Those are valuable features, but they belong deeper in the funnel, not on the landing page.

