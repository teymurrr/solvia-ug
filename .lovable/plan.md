

# Email Deliverability & Language Preference Implementation Plan

## Problem Analysis

### Issue 1: Email Going to Spam (david.rehrl@me.com)
The email was received correctly on `@thesolvia.com` but may have landed in spam on `@me.com` (Apple iCloud). This is a common deliverability issue caused by:

1. **Missing DMARC record** - Most critical for iCloud/Apple Mail
2. **No warm-up period** - New sending domains need gradual volume increases
3. **Link/tracking URLs mismatch** - CTA buttons may point to different domains than the sending domain
4. **Potential SPF/DKIM misconfiguration** - Need to verify records are correctly set up

### Issue 2: No Language Preference Stored
Currently, language is **auto-detected** at send time based on `study_country`. This works but has limitations:
- No way to know a user's actual preference
- Can't handle edge cases (e.g., a Mexican living in Germany who prefers German)
- No user choice in the matter

---

## Solution 1: Email Deliverability Improvements

### A. DNS Authentication (Action Required: You/Admin)
You need to verify these DNS records are set up correctly in your domain registrar:

| Record Type | Name | Value |
|-------------|------|-------|
| TXT (SPF) | `send.thesolvia.com` | Check Resend dashboard for exact value |
| TXT (DKIM) | `resend._domainkey.thesolvia.com` | Check Resend dashboard for exact value |
| TXT (DMARC) | `_dmarc.thesolvia.com` | `v=DMARC1; p=none; rua=mailto:dmarc@thesolvia.com` |

**DMARC is critical** - Apple iCloud, Gmail, and Outlook all require DMARC for trusted delivery.

### B. Subdomain Strategy (Recommended)
Instead of sending from `team@thesolvia.com`, use a subdomain like:
- `team@mail.thesolvia.com` or `team@updates.thesolvia.com`

This isolates your marketing/campaign reputation from your main domain.

### C. Link/URL Consistency
Ensure all links in emails match the sending domain:
- Current: Sending from `thesolvia.com`, linking to `thesolvia.com` ✅
- Verify: All CTA buttons and footer links use `thesolvia.com`

### D. Email Content Best Practices
- Avoid spam trigger words in subject lines
- Keep HTML clean and accessible
- Include plain-text alternative (Resend supports this)
- Add physical address in footer (CAN-SPAM compliance)

### E. Warm-up Strategy
For new sending domains:
1. Start with 50-100 emails/day
2. Increase by 50% every 2-3 days
3. Monitor bounce rates and complaints
4. Full volume after 2-3 weeks

---

## Solution 2: Store Language Preference

### A. Database Schema Change
Add a `preferred_language` column to all relevant tables:

```text
+---------------------------+
|         leads             |
+---------------------------+
| id                        |
| email                     |
| first_name                |
| ...                       |
| preferred_language  (NEW) |  -- 'es', 'de', 'en', 'fr', or NULL
+---------------------------+

+---------------------------+
|   professional_profiles   |
+---------------------------+
| ...                       |
| preferred_language  (NEW) |
+---------------------------+

+---------------------------+
| learning_form_submissions |
+---------------------------+
| ...                       |
| preferred_language  (NEW) |
+---------------------------+
```

### B. Language Selection at Capture Time
When users fill out the wizard/forms, we can:

**Option 1: Auto-detect from browser**
- Capture `navigator.language` from the user's browser
- Store as `preferred_language`
- Works automatically, no user action needed

**Option 2: Explicit selection**
- Add a language selector dropdown to signup/wizard forms
- User explicitly chooses their preferred email language

**Recommendation:** Combine both - auto-detect from browser but allow manual override.

### C. Update Edge Function Logic
Modify `send-nurture-campaign` to:
1. First check `preferred_language` field
2. If NULL, fall back to auto-detection based on `study_country`
3. Log which method was used for analytics

```text
Priority order for language selection:
1. preferred_language (if set by user)
2. Browser language (if captured during signup)
3. Auto-detect from study_country
4. Default to 'en'
```

---

## Implementation Steps

### Phase 1: Email Deliverability (Immediate)
1. **Check DNS records** in Resend dashboard (https://resend.com/domains)
   - Verify SPF is configured correctly
   - Verify DKIM is configured correctly
   - Add DMARC record if missing

2. **Add plain-text version** of emails in the edge function

3. **Add physical address** to email footer for compliance

### Phase 2: Database & Language Capture
1. Add `preferred_language` column to:
   - `leads` table
   - `professional_profiles` table
   - `learning_form_submissions` table

2. Update the `capture-lead` edge function to:
   - Accept `browser_language` parameter
   - Store it as `preferred_language`

3. Update frontend forms (HomologationWizard, OnboardingWizard) to:
   - Capture `navigator.language`
   - Send it with the lead data

### Phase 3: Update Email Sending Logic
1. Modify `send-nurture-campaign` to prioritize `preferred_language`
2. Add logging for language source tracking
3. Test with sample leads

---

## Files to Modify

1. **Database migrations** (via Supabase migration tool):
   - Add `preferred_language TEXT` to `leads`, `professional_profiles`, `learning_form_submissions`

2. **supabase/functions/capture-lead/index.ts**:
   - Accept `browser_language` parameter
   - Store in `preferred_language` column

3. **supabase/functions/send-nurture-campaign/index.ts**:
   - Prioritize `preferred_language` over auto-detection
   - Add plain-text email alternative

4. **Frontend forms**:
   - `src/pages/HomologationWizard.tsx`
   - `src/pages/OnboardingWizard.tsx`
   - Capture and send `navigator.language`

---

## Technical Details

### DNS Records to Verify (in Resend Dashboard)

Go to https://resend.com/domains and check that `thesolvia.com` shows:
- SPF: ✅ Verified
- DKIM: ✅ Verified
- DMARC: ✅ Configured (if missing, add it)

### DMARC Record to Add

If DMARC is not configured, add this TXT record in your DNS:

| Type | Name | Value |
|------|------|-------|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc-reports@thesolvia.com` |

Start with `p=none` (monitoring only), then move to `p=quarantine` or `p=reject` after verification.

---

## Expected Outcomes

After implementing these changes:

1. **Improved Deliverability**: Emails will be less likely to go to spam, especially on Apple/iCloud, Gmail, and Outlook
2. **Language Consistency**: Every user will receive emails in their preferred language
3. **Future-Proof**: New leads will automatically have their language preference captured
4. **Backfill Option**: Existing leads can be updated based on auto-detection to populate `preferred_language`

---

## Immediate Next Steps

1. **Check Resend Domain Settings**: Go to https://resend.com/domains and verify DNS authentication status
2. **Add DMARC Record**: If missing, add the DMARC TXT record to your DNS
3. **Approve this plan**: I'll implement the database changes and code updates

