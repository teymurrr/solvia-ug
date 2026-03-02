

# Email System Fixes: Add Booking CTA + Fix Sequence Issues

## Problems Found

1. **No booking/call option in any email** -- None of the 5 email templates include a Calendly link or WhatsApp contact for booking a call
2. **Sequence skipping** -- Steps 2-4 (personalDiagnosis, socialProof, urgencyOffer) were never sent; the system jumped from feedbackAsk to valueInsight
3. **Outdated pricing** -- Templates reference old pricing (from 39, normally 79) instead of the new structure (from 299)
4. **Auto-nurture bug** -- The scheduler breaks after first lead, only processing one batch per run

## Changes

### 1. Add booking CTA to all email templates
**File: `supabase/functions/send-nurture-campaign/index.ts`**

Add a consistent booking/call block at the end of every email template (all 5 templates, all 5 languages), before the signature:

```
---
Want to talk to someone? Book a free 15-min call:
https://calendly.com/[your-link]

Or message us directly on WhatsApp:
https://wa.me/[your-number]
```

This block will be appended automatically in the `generatePlainEmail` function so it appears in every nurture email without duplicating it across all template bodies.

Also add the same block to:
- `supabase/functions/win-back-campaign/index.ts`
- `supabase/functions/send-reengagement-email/index.ts`
- `supabase/functions/send-homologation-plan/index.ts`

### 2. Update pricing references in email templates
**File: `supabase/functions/send-nurture-campaign/index.ts`**

- socialProof template: Change "from 39 with our Digital package" to "from 299 with our Guided Homologation package" (all 5 languages)
- urgencyOffer template: Remove fake urgency about "introductory pricing ends soon", replace with value-focused messaging referencing the new 299/899/3800 tiers (all 5 languages)

**File: `supabase/functions/win-back-campaign/index.ts`**
- Same pricing update: 39 to 299

**File: `supabase/functions/send-reengagement-email/index.ts`**
- Same pricing update: 39 to 299

### 3. Fix auto-nurture-sequence logic
**File: `supabase/functions/auto-nurture-sequence/index.ts`**

Current bug: The function processes leads one by one but then calls `send-nurture-campaign` for the entire batch and immediately `break`s, so it only ever triggers one template per execution.

Fix: Instead of delegating to `send-nurture-campaign`, process each lead individually:
- For each lead, determine the correct next step based on their `email_sequence_day` and `last_email_sent` timestamp
- Call `send-nurture-campaign` with the specific templateId for that lead, OR refactor to send directly per-lead
- Remove the `break` statement so all eligible leads are processed in one run
- Add proper per-lead delay checking (3 days after feedbackAsk, 2 days after personalDiagnosis, etc.)

### 4. Prevent manual template skipping
**File: `supabase/functions/send-nurture-campaign/index.ts`**

Add a sequence validation check: when not in test mode, verify that a lead has received the previous step before sending the current one. For example, don't send `socialProof` unless `personalDiagnosis` was already sent to that email. This prevents accidentally skipping steps when manually triggering campaigns.

## Technical Details

- The booking CTA will use a shared constant for the Calendly URL and WhatsApp number, making it easy to update in one place
- All 4 edge functions will be redeployed after changes
- The pricing update affects template text in approximately 20 language/template combinations
- No database schema changes needed

