

# Conversion Maximization Plan

## Current Funnel Reality

Your numbers tell a clear story:

| Stage | Count | Conversion |
|-------|-------|------------|
| Leads (wizard + signup) | 147 | -- |
| Signed-up users | 60 | 41% of leads |
| Paying customers | 0 (organic) | 0% |

The 3 "completed" payments are manual grants (amount = 0). No one has organically purchased yet. This means the problem is not traffic — it's converting existing interest into sales.

## Root Causes Identified

1. **Broken email sequence**: 103 people received the "feedbackAsk" email, but the "valueInsight" follow-up was never sent. 44 leads have received nothing at all. The sequence stops at step 1.
2. **No sales-oriented emails**: Both existing templates are soft/conversational. Neither contains a direct link to the payment page or a clear CTA to buy.
3. **No automated triggers**: Email campaigns must be manually invoked — there's no automation that fires after signup or wizard completion.
4. **Wizard ends at a dead end**: After the homologation wizard, users land on a results page but there's no urgency-driven push to the payment page.
5. **Signed-up users have empty profiles**: 42 of 57 profiles have no target country, doctor type, or language level — meaning they signed up but never completed the wizard, so the system can't personalize outreach.

## Implementation Plan

### Phase 1: Fix the Email Sequence (Edge Functions)

**A. Create 3 new sales-focused email templates** in `send-nurture-campaign`

Add these templates to the existing edge function:

| Template | Timing | Purpose |
|----------|--------|---------|
| `personalDiagnosis` (new) | Day 3 after signup | "I looked at your case — here's what you need" with personalized steps based on their wizard data + link to results page |
| `socialProof` (new) | Day 5 | Success story + "Dr. Maria got her Approbation in 7 months" + direct link to payment page |
| `urgencyOffer` (new) | Day 7 | "Introductory pricing ends soon" + savings calculation + direct payment link |

Each email keeps the personal "David" tone but includes a clear, single CTA link to the payment page.

**B. Create an automated drip function** — `auto-nurture-sequence`

A new edge function that:
- Runs on a schedule (or is triggered after wizard completion / signup)
- Checks each lead's `email_sequence_day` and `last_email_sent` timestamp
- Automatically sends the next email in sequence if enough days have passed
- Sequence: Day 0 (feedbackAsk) -> Day 3 (personalDiagnosis) -> Day 5 (socialProof) -> Day 7 (urgencyOffer) -> Day 14 (valueInsight, final)

**C. Send the valueInsight email** to the 103 leads stuck at step 1 immediately.

### Phase 2: Post-Wizard Conversion Push (Frontend)

**A. Wizard completion redirect**

After the homologation wizard completes, instead of just showing results, add:
- A personalized "diagnosis card" showing their specific situation (country, doctor type, language gap)
- A calculated cost-of-delay message: "Every month you wait costs you ~€X,XXX in potential German salary"
- A direct "Start for €39" CTA to the Digital Homologation package (lowest barrier entry)

**B. Dashboard nudges for signed-up users**

For users who signed up but haven't paid:
- Add a persistent banner in the dashboard: "Your homologation roadmap is ready — unlock it now"
- Show a progress bar at 0% with "Step 1: Choose your package" highlighted
- Add an in-app notification on login with a link to the payment page

### Phase 3: Re-engagement of Cold Leads (Edge Function)

**A. Create `win-back-campaign`** edge function for the 44 leads who never received any email:

A single compelling email:
- Subject: "[Name], your medical career plan is still waiting"
- Body: Personalized based on their wizard data (country + doctor type)
- Contains a direct link to their results page with pre-filled data
- Includes the "€39 to start" entry point

**B. Profile completion push**

For the 42 signed-up users with empty profiles:
- The existing `send-reengagement-email` function targets incomplete profiles but only checks `about`, `location`, `specialty`
- Update it to also nudge users who haven't completed the wizard (no `target_country`)
- Add a CTA linking to the wizard, not just profile completion

### Phase 4: Conversion Tracking

**A. Add lead status updates** 

Update the `leads` table when key events happen:
- Mark as `engaged` when they open/click an email
- Mark as `converted` when a payment is completed (link via email match)
- Add a `payment_started` status for abandoned checkouts

**B. Add a `conversion_source` field to payments**

Track which email/touchpoint drove the purchase (UTM params or referral tracking on the payment page).

---

## Technical Details

### Files to create:
- `supabase/functions/auto-nurture-sequence/index.ts` — automated drip logic
- `supabase/functions/win-back-campaign/index.ts` — cold lead re-engagement

### Files to modify:
- `supabase/functions/send-nurture-campaign/index.ts` — add 3 new templates (personalDiagnosis, socialProof, urgencyOffer) with localized content in all 5 languages
- `supabase/functions/send-reengagement-email/index.ts` — expand targeting to include users missing wizard data, add payment CTA
- `src/pages/HomologationResult.tsx` — add urgency messaging and direct payment CTA after wizard results
- `src/components/dashboard/ProfessionalDashboard.tsx` (or equivalent) — add conversion banner for non-paying users
- Payment page URL in emails will include UTM parameters for tracking

### Database changes:
- Add `conversion_source` column to `payments` table (text, nullable)
- No other schema changes needed — the existing `leads.email_sequence_day` and `email_sends` table handle sequencing

### Priority order:
1. Send valueInsight to the 103 stuck leads (immediate win, no code changes)
2. Add 3 new email templates to nurture campaign
3. Create auto-nurture-sequence function
4. Add conversion CTAs to wizard results page
5. Create win-back campaign for cold leads
6. Add dashboard nudges and conversion tracking

