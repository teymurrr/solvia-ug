
# Route Audit: What to Keep vs. Delete

## Summary

After analyzing all 30+ routes and their internal references, here's the full breakdown.

---

## KEEP -- Core Pages (essential)

| Route | Purpose |
|---|---|
| `/` | Landing page / auto-redirect to dashboard |
| `/about` | About page |
| `/contact` | Contact page |
| `/privacy` | Privacy policy (legally required) |
| `/terms` | Terms of service (legally required) |
| `/impressum` | Legal notice (required by German law) -- linked from Footer |
| `/login` | Login page |
| `/signup` | Signup selector |
| `/signup/professional` | Professional registration |
| `/signup/institution` | Institution registration |
| `/confirm-email` | Email confirmation flow |
| `/dashboard/professional` | Professional user dashboard |
| `/dashboard/institution` | Institution user dashboard |
| `/messages`, `/messages/new`, `/messages/:id` | Messaging system |
| `/community`, `/community/:id` | Community forum |
| `/professionals` | Browse professionals listing |
| `/professionals/:id` | View a professional's profile (institution-only) |
| `/employers` | Landing page for employers/institutions |
| `/blog` | Blog listing |
| `/vacancies` | Vacancies conversion funnel |
| `/learning` | Solvia Learning page |
| `/learning/starter-kit` | Starter Kit purchase page |
| `/homologation` | Country selection (entry to homologation funnel) |
| `/homologation-wizard` | Homologation wizard (multi-step form + signup) |
| `/homologation-result` | Shows personalized homologation plan |
| `/homologation-payment` | Payment for homologation service |
| `/payment-success` | Stripe payment success callback |
| `/payment-cancelled` | Stripe payment cancel callback |
| `/onboarding` | Post-payment onboarding wizard |
| `/documents-upload` | Document upload (paid users) |
| `/documents-status` | Document tracking (paid users) |
| `/admin/users` | Admin user management |
| `/admin/applications` | Admin applications management |
| `/visa-info` | Visa information page |
| `*` (404) | Not Found fallback |

## DELETE -- Redundant Route

| Route | Reason to Delete |
|---|---|
| `/home` | Duplicate of `/`. Nobody links to it internally -- zero references found. The `/` route already shows the Index page for logged-out users and redirects logged-in users to their dashboard. |

## FIX -- Broken Link

| File | Issue | Fix |
|---|---|---|
| `src/pages/PaymentSuccess.tsx` (line ~358) | Links to `/dashboard` which doesn't exist (404) | Change to redirect based on user type: `/dashboard/professional` or `/dashboard/institution` |

---

## Technical Details

### Changes to `src/routes.tsx`:
- Remove line 108: `<Route path="/home" element={<Index />} />`

### Changes to `src/pages/PaymentSuccess.tsx`:
- Replace the `navigate('/dashboard')` call with logic that checks `userType` from `useAuth()` and navigates to the correct dashboard route.

### Result:
- 1 redundant route removed
- 1 broken link fixed
- All other routes are actively used and necessary
