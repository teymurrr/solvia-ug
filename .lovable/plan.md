

# Extend Nurture Campaign to Registered Users

## Overview

Extend the email campaign to include **47 registered users** (from `professional_profiles`) who aren't in the `leads` table. These are high-intent users who signed up directly without completing the wizard.

## Current Situation

| Source | Total | Already Emailed | Remaining |
|--------|-------|-----------------|-----------|
| Leads table | 56 | 56 | 0 |
| Professional profiles (not in leads) | 47 | 0 | **47** |

## Approach

**Option A: Add registered users to leads table first (Recommended)**
- Insert the 47 professional profiles into the `leads` table with `source: 'direct_signup'`
- This keeps tracking unified and allows the existing edge function to work without major changes

**Option B: Modify edge function to query both tables**
- More complex, requires parallel tracking in two tables

I recommend **Option A** for simplicity and unified tracking.

## Implementation Steps

### Step 1: Database Migration
Insert registered users into the leads table (only those not already there):

```sql
INSERT INTO leads (id, email, first_name, last_name, target_country, study_country, 
                   doctor_type, language_level, source, status, email_sequence_day)
SELECT 
  pp.id,
  pp.email,
  pp.first_name,
  pp.last_name,
  pp.target_country,
  pp.study_country,
  pp.doctor_type,
  pp.language_level,
  'direct_signup',        -- Mark source as direct signup
  'new',                  -- New status for email sequence
  0                       -- Ready for feedbackAsk email
FROM professional_profiles pp
LEFT JOIN leads l ON LOWER(pp.email) = LOWER(l.email)
WHERE l.id IS NULL
  AND pp.email IS NOT NULL;
```

### Step 2: Send Emails
After migration, simply call the existing edge function:
```json
{
  "templateId": "feedbackAsk",
  "testMode": false
}
```

The function will pick up the 47 new leads (now with `email_sequence_day: 0`) and send emails.

## Data Mapping

| Professional Profile Field | Leads Field | Notes |
|---------------------------|-------------|-------|
| id | id | UUID preserved |
| email | email | Direct copy |
| first_name | first_name | Direct copy |
| last_name | last_name | Direct copy |
| target_country | target_country | Direct copy |
| study_country | study_country | Used for language detection |
| doctor_type | doctor_type | Direct copy |
| language_level | language_level | Direct copy |
| - | source | Set to `'direct_signup'` |
| - | status | Set to `'new'` |
| - | email_sequence_day | Set to `0` |

## Language Detection

The existing language detection logic will work because it uses `study_country`:
- Spanish-speaking countries → Spanish email
- German-speaking countries → German email
- Other countries → English email (default)

**Note:** Many direct signup users have `NULL` study_country, so they'll receive English emails by default.

## Technical Details

### Edge Function Behavior (No Changes Needed)

The edge function already:
1. Queries leads with `status='new'` and `email_sequence_day=0`
2. Sends email in detected language
3. Updates `email_sequence_day` to `1` after sending

### Tracking

After sending, all 47 users will have:
- `email_sequence_day: 1`
- `last_email_sent: [timestamp]`
- `email_campaign: 'feedbackAsk'`
- `source: 'direct_signup'` (distinguishes them from wizard leads)

## Execution Plan

1. Run the SQL migration to add 47 professional profiles to leads table
2. Call the edge function with `testMode: false`
3. Monitor results (expect ~47 emails sent)

