

# Plan: Create a "Spain Opportunity" Broadcast Campaign Edge Function

## What This Does
A new one-time broadcast edge function that emails **all contacts** (leads + professional_profiles + learning_form_submissions) with a localized message about new job opportunities in Spain as a stepping stone while waiting for German homologation.

## Message Translations

The Spanish version is provided. The function will include equivalent translations for all 5 languages:
- **ES**: As provided by you
- **EN**: English equivalent
- **DE**: German equivalent  
- **FR**: French equivalent
- **RU**: Russian equivalent

## Technical Implementation

### 1. New Edge Function: `supabase/functions/spain-opportunity-blast/index.ts`

Modeled after `win-back-campaign` with the following changes:

- **Recipients**: Query from **three sources**:
  - `leads` table (all with email, regardless of status)
  - `professional_profiles` (via join to auth users for email)
  - `learning_form_submissions` (all with email)
  - Deduplicate by email address (lowercase)
- **Language detection**: Reuse the existing `detectLanguage()` logic (preferred_language > study_country > email TLD > English)
- **Deduplication**: Check `email_sends` table with `template_id = 'spainOpportunity'` to avoid double-sends
- **Logging**: Insert into `email_sends` for tracking opens/clicks via existing Resend webhook infrastructure
- **Booking CTA**: Appended automatically (Calendly + WhatsApp) as in all other campaigns
- **Sender**: "David from Solvia" with reply-to David.rehrl@thesolvia.com

### 2. Subject Lines
- ES: "Nueva oportunidad: trabaja en España mientras esperas tu homologación"
- EN: "New opportunity: work in Spain while waiting for your homologation"
- DE: "Neue Möglichkeit: Arbeite in Spanien während du auf deine Anerkennung wartest"
- FR: "Nouvelle opportunité : travaille en Espagne en attendant ton homologation"
- RU: "Новая возможность: работай в Испании, пока ждёшь гомологацию"

### 3. Supports Test Mode
- `testMode: true` + `testEmail` to send only to a specific address for review before blasting

### 4. Config & Deployment
- Add JWT bypass in `supabase/config.toml`
- Deploy and test via edge function invocation

