

# Professional Dashboard Restructuring

## Problem Analysis

The current dashboard suffers from **information overload without hierarchy**. Users see 4 full-width cards stacked vertically before reaching any tabs. There's no clear visual priority, and the key conversion driver (HomologationPreview) gets buried. The Profile tab also duplicates information already shown in the WelcomeSection.

## Proposed Structure: Hub-and-Spoke Layout

Reorganize the page into 3 clear zones with distinct purposes:

```text
+--------------------------------------------------+
|  1. HERO ZONE: WelcomeSection (compact)           |
|     Progress ring + next action CTA only          |
+--------------------------------------------------+
|                                                    |
|  2. ACTION ZONE (2-column grid on desktop)         |
|  +---------------------+  +---------------------+ |
|  | LEFT (2/3 width)    |  | RIGHT (1/3 width)   | |
|  |                     |  |                      | |
|  | Tabs:               |  | HomologationPreview  | |
|  |  - Vacancies (def)  |  | (sticky sidebar,     | |
|  |  - Saved & Applied  |  |  conversion card)    | |
|  |  - Profile          |  |                      | |
|  |                     |  | CommunityWidget      | |
|  |                     |  | (compact)            | |
|  +---------------------+  +---------------------+ |
|                                                    |
+--------------------------------------------------+
```

### Key Changes

**1. Compact WelcomeSection**
- Remove the right-side checklist from the hero. Keep only the greeting, progress ring, and single primary CTA button.
- Move checklist items into the Profile tab as a "Complete Your Profile" card.
- This reduces the hero from ~300px to ~120px height.

**2. Tabs become the primary content area (left column, 2/3 width)**
- Reorder tabs to: **Vacancies** (default) > Saved & Applied > Profile
- Remove the Homologation tab (it's redundant with the sidebar preview and the dedicated `/homologation-wizard` page)
- Vacancies tab now shows RecommendedVacancies at the top, followed by all vacancies with search/filters -- merging two currently separate sections
- Profile tab absorbs the onboarding checklist (incomplete items shown as actionable cards)

**3. Sticky conversion sidebar (right column, 1/3 width)**
- HomologationPreview moves here with `sticky top-24` positioning so it follows scroll
- CommunityWidget sits below it (compact, 2 posts max instead of 3)
- For paying users (who already have homologation access), the sidebar shows a compact progress tracker instead of the sales card

**4. Default tab changes to Vacancies**
- Most users return to the dashboard to check jobs, not to stare at their profile
- This drives higher engagement and faster time-to-value

### Technical Details

**Files to modify:**
- `src/pages/ProfessionalDashboard.tsx` -- restructure layout to 2-column grid with sidebar, reorder tabs, change default tab to "vacancies"
- `src/components/professional-dashboard/WelcomeSection.tsx` -- simplify to compact hero (remove checklist, keep progress ring + single CTA)
- `src/components/professional-dashboard/CommunityWidget.tsx` -- add `compact` prop to show 2 posts instead of 3, reduce padding

**Files to create:**
- `src/components/professional-dashboard/OnboardingChecklist.tsx` -- extracted checklist component (from WelcomeSection) to embed inside the Profile tab
- `src/components/professional-dashboard/DashboardSidebar.tsx` -- wrapper component for the right column containing HomologationPreview + CommunityWidget with sticky positioning

**No new dependencies required.**

### Impact on Conversion

- HomologationPreview (salary loss counter + CTA) is now **always visible** as users scroll through vacancies, dramatically increasing exposure
- Default tab is Vacancies, which creates a "job board" feel that keeps users coming back
- Reduced cognitive load above the fold means users reach actionable content faster
- Profile completion checklist moved into the Profile tab creates a clear "to-do" feeling when they visit that tab

