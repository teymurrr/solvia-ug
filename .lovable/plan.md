

# Redesign Professional Dashboard to Match User Priorities

## The Problem

Two issues:

1. **HomologationPreview teaser is invisible** -- It only renders when `profileData` exists AND `profileData.targetCountry` maps to a valid country in `homologationDataByCountry`. If the user hasn't set a target country in their profile, the component returns `null` silently.

2. **Dashboard doesn't reflect what users actually care about** -- The current dashboard leads with job vacancies, but your clients' real priorities are:
   - Language learning (how do I prepare for B2/FSP?)
   - Understanding the homologation process (what steps do I need?)
   - How can I work in my target country? (what's the path?)

The dashboard should guide users through these priorities, not just show job listings.

## Proposed Redesign

### New Sidebar Structure (right column)

Replace the current sidebar (HomologationPreview + CommunityWidget) with three priority-ordered action cards:

**Card 1: "Your Language Path"** (always visible)
- Shows the user's current language level (from profile) vs. required level (B2/C1 depending on country)
- Visual progress indicator (e.g., A1 -> A2 -> B1 -> B2)
- CTA: "Start your Starter Kit (from EUR 29)" linking to `/learning/starter-kit`
- If user has no target country set, show a prompt to set one

**Card 2: "Your Homologation Roadmap"** (the current HomologationPreview, fixed)
- Fix the rendering bug: show even without `targetCountry` by defaulting to Germany and prompting "Set your target country" instead of returning null
- Keep the salary loss counter and document preview as-is
- For users who HAVE paid: replace teaser with the `HomologationProgressCard` inline (from HomologationTab)

**Card 3: Community Widget** (keep as-is, already working)

### Fix HomologationPreview Visibility

The component currently returns `null` when `countryData` is undefined. Instead:
- If no `targetCountry` in profile, show a simplified card asking the user to set their target country via the free assessment
- This ensures the teaser is always visible for non-paying users

### Add "My Journey" Tab (4th tab)

Add a new tab alongside Vacancies / Saved & Applied / Profile called **"My Journey"** that consolidates:
- Language learning status and next steps
- Homologation process status (uses existing `HomologationTab` component)
- Country-specific requirements summary

This gives users a single place to understand "where am I in the process?"

### Updated Tab Order

Reorder tabs to match user priorities:
1. **My Journey** (new, default tab for new users) -- language + homologation + country info
2. **Vacancies** (current default, becomes default only after profile is complete)
3. **Saved & Applied**
4. **Profile**

The default tab logic: if user has no paid countries and profile is less than 50% complete, default to "My Journey". Otherwise default to "Vacancies".

## Technical Changes

### 1. New component: `LanguagePathCard.tsx`
- Reads `profileData.languages` to find German/target language level
- Reads `profileData.targetCountry` to determine required level
- Shows visual progress bar from current to required level
- CTA to Starter Kit page

### 2. New component: `MyJourneyTab.tsx`
- Combines `LanguagePathCard`, `HomologationTab`, and a brief country requirements summary
- Guides users through the three priorities in order

### 3. Fix `HomologationPreview.tsx`
- Remove the early `return null` when `countryData` is missing
- Show a fallback card prompting users to take the free assessment

### 4. Update `DashboardSidebar.tsx`
- Add `LanguagePathCard` above `HomologationPreview`
- Always show `HomologationPreview` (remove the conditional `showHomologationPreview` for non-paid users)

### 5. Update `ProfessionalDashboard.tsx`
- Add 4th tab "My Journey"
- Update default tab logic based on user state
- Update `TabsList` from `grid-cols-3` to `grid-cols-4`

### 6. i18n updates
- Add keys for "My Journey", "Your Language Path", language level labels, and the target country prompt across all 5 languages

