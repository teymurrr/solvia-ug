

# Cleanup: Remove Unused Pages and Components

## Summary

After analyzing the codebase, I found **4 files** that are dead code -- not routed, not imported, or fully superseded by newer implementations. Removing them reduces bundle size and avoids confusion.

---

## Files to Delete

### 1. `src/pages/Auth.tsx`
- **Why**: Old combined login/signup page with hardcoded English strings. Fully replaced by the dedicated `Login.tsx`, `ProfessionalSignup.tsx`, and `InstitutionSignup.tsx` pages. Not imported anywhere -- no route, no reference.

### 2. `src/pages/GermanStarterKit.tsx`
- **Why**: Superseded by the new country-generic `StarterKit.tsx` (created in the last session). Not referenced in routes or imported anywhere. The new `StarterKit.tsx` handles Germany and all other countries via `?country=` parameter.

### 3. `src/pages/Institutions.tsx`
- **Why**: Contains only hardcoded sample data (fake hospitals). It is imported in `routes.tsx` but **has no `<Route>` element** -- completely unreachable dead code. The institution browsing concept is handled differently through the dashboard.

### 4. `src/components/payments/BlackFridayBanner.tsx`
- **Why**: The "Launch Week" / "Black Friday" fake-urgency banner. It was already removed from `PaymentFlow.tsx` in a previous cleanup. No remaining imports anywhere -- orphaned file.

---

## Route Cleanup

In `src/routes.tsx`, the lazy import for `Institutions` will be removed since the page is being deleted. Additionally, the `Vacancies` import (for the `/vacancies-old` route) should be reviewed -- it serves as a legacy fallback but the active route is `VacanciesConversion` at `/vacancies`. I will **remove the `/vacancies-old` route and `Vacancies.tsx`** as well if you approve, since it's a 549-line legacy page that's been replaced.

### 5. `src/pages/Vacancies.tsx` (optional -- recommend removing)
- **Why**: 549-line legacy vacancies page, only accessible via `/vacancies-old`. Fully replaced by `VacanciesConversion.tsx` which is the active `/vacancies` route. Keeping it creates maintenance confusion.

---

## Changes Summary

| Action | File |
|--------|------|
| Delete | `src/pages/Auth.tsx` |
| Delete | `src/pages/GermanStarterKit.tsx` |
| Delete | `src/pages/Institutions.tsx` |
| Delete | `src/components/payments/BlackFridayBanner.tsx` |
| Delete | `src/pages/Vacancies.tsx` (recommended) |
| Edit | `src/routes.tsx` -- remove dead imports (`Institutions`, `Vacancies`) and the `/vacancies-old` route |

No database changes, no translation file changes, no component dependency breakage.

