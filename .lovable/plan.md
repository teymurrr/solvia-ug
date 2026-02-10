

# Fix "Apply" Button: Interest Capture Instead of 404

## Problem
When users click "Apply Now" on any vacancy, they are sent to `/vacancies/:id/apply` -- a route that does not exist, resulting in a 404 page. None of the vacancies have an external `application_link` set either.

## Solution: "Express Interest" Dialog
Since there are no real application flows yet, the best approach is to replace the broken navigation with an in-page interest capture dialog. When a user clicks "Apply Now":

1. A modal dialog opens (no page navigation needed)
2. It shows the vacancy title and a short form: optional cover message + confirmation
3. On submit, it records the interest in a new `vacancy_applications` database table
4. The user sees a success confirmation with a message like "We've received your interest! Our team will match you with this opportunity as part of your homologation journey."
5. The button changes to "Applied" (already supported via the `isApplied` prop)

This approach:
- Eliminates the 404 immediately
- Captures real leads from interested users
- Makes users feel their interest is being actively tracked
- Feeds into the existing "Saved & Applied" dashboard tab

## Technical Steps

### 1. Database: Create `vacancy_applications` table
- Columns: `id`, `user_id`, `vacancy_id`, `message` (optional text), `status` (default "pending"), `created_at`
- RLS: users can insert their own, read their own; institutions can read applications for their vacancies

### 2. New Component: `ApplyDialog.tsx`
- A Dialog/Sheet component triggered by the Apply button
- Shows vacancy title, optional message textarea, and submit button
- Calls Supabase insert on submit
- Shows success toast and closes

### 3. Update `VacancyFooter.tsx`
- Remove all navigation to `/vacancies/:id/apply`
- Instead, open the `ApplyDialog` when the user clicks Apply
- Keep existing logic for: redirect to signup if not logged in, show "Applied" if already applied

### 4. Hook: `useVacancyApplication.ts`
- `submitApplication(vacancyId, message?)` -- inserts into `vacancy_applications`
- `useUserApplications()` -- fetches the logged-in user's applications to check `isApplied` status
- Integrates with the existing `SavedAndApplied` tab

### 5. i18n translations
- Add dialog strings (title, placeholder, submit, success message) to EN, ES, DE, FR, RU

### 6. Update routes -- no new route needed
- The dialog approach avoids needing a `/vacancies/:id/apply` route entirely
