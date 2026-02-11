

# Professional Dashboard Redesign: Declutter and Focus on User Goals

## User Analysis

**Who is the user?** An international medical professional (doctor, nurse) who wants to work in a European country (Germany, Austria, France, etc.).

**Their priorities, in order:**
1. "How do I learn the language I need?" (Language learning)
2. "What is the process to get my diploma recognized?" (Homologation understanding)
3. "What jobs are available for me?" (Career opportunities)

**Their concerns:**
- Overwhelmed by bureaucracy -- they need clarity, not more complexity
- Financial pressure -- they're not earning their full potential yet
- Uncertainty -- "Am I on the right track?"

## Current Problems

The dashboard currently shows **too many things at once**, creating decision fatigue:

1. **Welcome hero** with progress ring + onboarding checklist (duplicated)
2. **4 tabs** (My Journey, Vacancies, Saved & Applied, Profile)
3. **Sidebar** with LanguagePathCard + HomologationPreview + CommunityWidget
4. **Inside My Journey tab**: LanguagePathCard AGAIN (duplicated) + full HomologationTab + Find Work buttons
5. **Inside Profile tab**: OnboardingChecklist (a 3rd place with checklist logic) + ProfileCard + LanguagesCard
6. **Inside Vacancies tab**: RecommendedVacancies + full vacancy list with search/filters/pagination

**Key duplications:**
- LanguagePathCard appears in sidebar AND inside My Journey tab
- Checklist logic appears in WelcomeSection AND OnboardingChecklist (nearly identical code)
- Language info appears in LanguagePathCard, LanguagesCard, and profile

## Proposed Redesign

### Guiding Principle
One screen, one clear next action. Reduce cognitive load by showing only what matters for the user's current stage.

### New Layout: Remove sidebar, use full-width single column

**Why remove the sidebar?** It duplicates content from the tabs (LanguagePathCard, HomologationPreview) and the CommunityWidget is secondary to the user's core goals. On mobile it stacks below anyway, making it invisible.

### New Structure

```text
+----------------------------------------------------------+
|  Compact Welcome Bar (greeting + progress ring + CTA)    |
+----------------------------------------------------------+
|  [My Journey]  [Vacancies]  [Saved]  [Profile]           |
+----------------------------------------------------------+
|                                                          |
|  Tab Content (full width)                                |
|                                                          |
+----------------------------------------------------------+
```

### Changes by Component

**1. WelcomeSection -- KEEP, simplify**
- Already compact and good. Remove the emoji. Keep progress ring + greeting + single CTA.

**2. Sidebar (DashboardSidebar) -- REMOVE entirely**
- LanguagePathCard is already in My Journey tab
- HomologationPreview content is already in My Journey tab (HomologationTab)
- CommunityWidget moves to a small link/banner at the bottom of the My Journey tab

**3. My Journey Tab -- SIMPLIFY**
- Remove the LanguagePathCard embedded inside a Card-within-a-Card (currently a card inside Step 1's card). Instead, make the language progress bar a direct, clean section.
- Replace the heavy HomologationTab embed in Step 2 with the HomologationPreview teaser (salary loss + timeline + CTA). This is what creates urgency and value without overwhelming.
- Step 3 (Find Work): Keep the button, add a count of matching vacancies as a hook.
- Add a small "Join the Community" link at the bottom (replaces CommunityWidget in sidebar).

**4. Vacancies Tab -- KEEP, minor cleanup**
- RecommendedVacancies at top is good, keep it.
- The search/filter/pagination is fine as-is.

**5. Saved & Applied Tab -- KEEP as-is**
- No changes needed, it's straightforward.

**6. Profile Tab -- SIMPLIFY**
- Remove OnboardingChecklist from inside the Profile tab (it's redundant with WelcomeSection).
- Keep ProfileCard + LanguagesCard.

**7. OnboardingChecklist component -- DELETE**
- Redundant with WelcomeSection which already shows the same checklist items as a progress ring + CTA.

### Result: What the user sees

When they land on "My Journey" (default for new users):
1. A greeting bar telling them where they stand (3/5 steps done)
2. Three clear, sequential steps -- Language, Homologation, Work -- each with a concise status indicator and one action button
3. No sidebar competing for attention
4. Full-width layout that breathes

## Technical Changes Summary

| File | Action | What |
|------|--------|------|
| `ProfessionalDashboard.tsx` | Edit | Remove sidebar column, make tabs full-width. Remove OnboardingChecklist from Profile tab. Remove DashboardSidebar import/usage. |
| `DashboardSidebar.tsx` | Delete | No longer needed |
| `OnboardingChecklist.tsx` | Delete | Redundant with WelcomeSection |
| `MyJourneyTab.tsx` | Edit | Replace Card-in-Card LanguagePathCard with inline progress. Replace HomologationTab embed with HomologationPreview (the teaser). Add community link at bottom. |
| `LanguagePathCard.tsx` | Edit | Remove outer Card wrapper when used inside MyJourneyTab (add a `compact` prop). Keep card style for standalone use if needed. |
| `HomologationPreview.tsx` | Keep | Already works well as a teaser -- this is what goes in My Journey Step 2 |

### What gets removed
- Sidebar (3 widgets stacked vertically, duplicating tab content)
- OnboardingChecklist (duplicate of WelcomeSection logic)
- Card-inside-Card nesting in My Journey (LanguagePathCard inside Step 1 Card)
- HomologationTab inside My Journey (too heavy; replaced with the lighter HomologationPreview teaser)

### What stays
- WelcomeSection (compact hero)
- 4 tabs with same names
- LanguagePathCard (inline in Step 1, no double-card)
- HomologationPreview (in Step 2 as the teaser)
- CommunityWidget (small link at bottom of My Journey, not a full widget)
- All vacancy functionality unchanged
- Profile tab with ProfileCard + LanguagesCard

