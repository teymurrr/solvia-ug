

# Smart Dashboard: Payment-Aware Journey + Better Welcome CTA

## Problems Identified

1. **WelcomeSection CTA is redundant** -- It shows "Explora oportunidades laborales" which just duplicates the Vacancies tab that's already visible. The CTA should point to the most impactful *next action* within the user's journey, not repeat tab navigation.

2. **Paying customers see a sales teaser instead of their progress** -- The HomologationPreview in Step 2 of "My Journey" always shows the "Free Preview" with "Unlock Your Full Roadmap" CTA, even for users who already paid. It should show their actual document upload progress instead.

## Solution

### 1. Make Step 2 (Homologation) payment-aware in MyJourneyTab

Pass payment status into the HomologationPreview component. When the user has paid for a country:
- Show a compact version of the HomologationProgressCard (progress bar, document status counts, "Continue Upload" / "View Status" buttons)
- Remove the salary loss urgency block, locked documents, and "Unlock Roadmap" CTA since they already purchased

When the user has NOT paid:
- Keep the current teaser exactly as-is (salary loss, timeline, locked docs, purchase CTA)

### 2. Improve the WelcomeSection CTA

Replace the generic checklist-based CTA with a smarter one that reflects the user's actual next step in their journey:

- If profile is incomplete: "Complete your profile"
- If they haven't set a target country: "Set your target country"
- If they have a target country but no payment: "Start homologation process"
- If they've paid but documents are incomplete: "Upload documents"
- If everything is progressing: "Browse vacancies"

This makes the CTA contextually valuable rather than duplicating the tabs.

## Technical Changes

| File | Action | What |
|------|--------|------|
| `MyJourneyTab.tsx` | Edit | Import `usePaymentAccess`, check if user has paid for their target country. If paid, render a compact progress view (reusing HomologationProgressCard logic inline) instead of HomologationPreview. If not paid, keep HomologationPreview as-is. |
| `HomologationPreview.tsx` | No change | Stays as the sales teaser for non-paying users |
| `WelcomeSection.tsx` | Edit | Replace the generic "first incomplete checklist item" CTA with journey-stage-aware logic that surfaces the most impactful next action |

### What stays the same
- HomologationPreview component (untouched, still used for non-paying users)
- HomologationTab (separate tab, untouched)
- All vacancy and profile functionality
- Progress ring and greeting in WelcomeSection

