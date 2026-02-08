

# Lead Conversion Strategy: Converting 113 Leads into Paying Customers

## Current Lead Asset Analysis

### Your Lead Database (113 Total Unique Emails)

| Source | Count | Data Quality | Key Info Available |
|--------|-------|--------------|-------------------|
| **Leads Table (Wizard)** | 56 | Medium | Target country, doctor type, study country, language level |
| **Professional Profiles** | 57 | Low-Medium | Names, some have wizard data |
| **Learning Form Submissions** | 5 | High | Full name, country, profession, interests |

### Lead Segmentation by Target Country
- **Germany**: 27 leads (48%) - PRIMARY TARGET
- **Spain**: 11 leads (20%)
- **Austria**: 10 leads (18%)
- **France**: 5 leads (9%)
- **Italy**: 3 leads (5%)

### Lead Segmentation by Language Level
- **Mother tongue/Lengua materna**: 17 leads (30%) - Already speak target language
- **A1/A2 (Beginners)**: 19 leads (34%) - Need language + homologation
- **B1/B2**: 5 leads (9%) - Intermediate, closer to FSP
- **C1**: 3 leads (5%) - Advanced, ready for FSP
- **Unknown**: 12 leads (21%) - Need more info

### Lead Segmentation by Profession
- **General Practitioners**: 29 leads (52%)
- **Specialists**: 18 leads (32%)
- **Nurses**: 5 leads (9%)
- **Other (Dentists, etc.)**: 4 leads (7%)

---

## Conversion Strategy: 4-Pronged Approach

### 1. Immediate Outreach Campaign (Today - This Week)

**Tool**: Email campaign using existing Resend integration

**Segment A: Hot Leads - Spain Native Speakers going to Spain (11 leads)**
- These are the EASIEST conversions - they don't need language prep
- **Offer**: Digital Starter at €49 (special one-week offer)
- **Message**: "You're 80% there - just need document guidance"

**Segment B: Germany-Bound with A1/A2 Level (15 leads)**
- Need both language and homologation
- **Offer**: Complete Package at €299 (special launch)
- **Message**: "Your personalized German + Homologation roadmap"

**Segment C: Advanced Speakers (B2/C1) going to Germany (6 leads)**
- Close to FSP-ready
- **Offer**: Digital Starter €99 + FSP Prep add-on
- **Message**: "You're almost there - final steps to your license"

**Segment D: Re-engage Cold Leads (rest)**
- General follow-up with value content
- **Offer**: Free consultation call + €99 Digital Starter

---

### 2. Email Sequence Structure (7-Day Nurture)

```text
Day 0 (Immediate): Personal follow-up on their wizard results
         ↓
Day 1: Success story of someone from their country
         ↓
Day 3: "3 mistakes that delay your homologation" (problem aware)
         ↓
Day 5: Timeline breakdown + urgency (price goes up)
         ↓
Day 7: Final offer with bonus (free consultation)
```

---

### 3. Technical Implementation

**A. Create Email Nurture Edge Function**
- New edge function: `send-nurture-email`
- Accepts: lead email, segment, email template, day in sequence
- Uses existing Resend integration

**B. Create Manual Trigger for Batch Sending**
- Admin interface or edge function to trigger campaigns
- Query leads by segment criteria
- Send personalized emails based on their wizard data

**C. Update Lead Status Tracking**
- Add columns to leads table: `email_sequence_day`, `last_email_sent`, `converted`
- Track opens/clicks if Resend supports it

---

### 4. Offer Restructure for Conversion

**This Week Only Pricing (Aggressive Conversion Focus)**

| Package | Regular | This Week | Savings |
|---------|---------|-----------|---------|
| Digital Starter | €99 | **€49** | 50% off |
| Complete Package | €399 | **€199** | 50% off |
| Personal Mentorship | €999 | **€499** | 50% off |

**Why this works:**
- €49 is impulse-buy territory
- €199 feels like a steal for language + homologation
- €499 for personal mentorship is a no-brainer

---

## Implementation Plan

### Phase 1: Database Preparation (30 mins)
1. Add new columns to `leads` table for email tracking
2. Create segment views/queries

### Phase 2: Email Templates (1-2 hours)
1. Create 5 email templates for the nurture sequence
2. Personalize by: target country, language level, profession
3. Include clear CTAs with special pricing

### Phase 3: Email Sending Function (1 hour)
1. Create `send-nurture-campaign` edge function
2. Accept segment criteria as parameters
3. Send batch emails with personalization

### Phase 4: Manual Campaign Trigger (30 mins)
1. Create admin endpoint or simple UI to trigger campaigns
2. Allow selecting segment and email template

### Phase 5: Update Payment Pricing (15 mins)
1. Update `create-payment` edge function with aggressive pricing
2. Update `PaymentFlow.tsx` to show "This Week Only" badge

---

## Email Template Examples

### Template 1: Immediate Follow-up (Day 0)

**Subject Line (Spanish)**: "Tu plan para trabajar en {{country}} - precio especial €49"

```
Hola,

Vi que completaste el análisis para trabajar como {{profession}} en {{country}}.

Tu situación:
- País de origen: {{study_country}}
- Nivel de idioma: {{language_level}}
- Tiempo estimado: 12-18 meses

La buena noticia: Miles de médicos latinoamericanos ya ejercen en {{country}}.

Esta semana, estamos ofreciendo nuestro paquete Digital Starter a solo €49 
(precio normal €99) que incluye:

✓ Lista de documentos personalizada para tu país
✓ Videos tutoriales paso a paso
✓ Plantillas de formularios oficiales
✓ Soporte por email

[DESBLOQUEAR MI PLAN - €49]

Solo 23 spots disponibles a este precio.

Un abrazo,
Equipo Solvia
```

### Template 2: Success Story (Day 1)

**Subject**: "Cómo María pasó de México a Alemania en 14 meses"

(Social proof email with real or realistic case study)

### Template 3: Problem Aware (Day 3)

**Subject**: "3 errores que retrasan tu homologación (y cómo evitarlos)"

(Educational content that leads to the solution - your service)

---

## Expected Results

Based on industry benchmarks for warm leads with personalized outreach:

| Metric | Conservative | Optimistic |
|--------|-------------|------------|
| Email Open Rate | 25% (28 opens) | 40% (45 opens) |
| Click Rate | 5% (5-6 clicks) | 15% (17 clicks) |
| Conversion Rate | 2% (2 sales) | 5% (5-6 sales) |
| Revenue (at €49) | €98 | €294 |
| Revenue (mixed tiers) | €200-400 | €600-1,200 |

**First sale target**: 2-5 sales this week from the existing 113 leads

---

## Database Migration Required

```sql
-- Add email tracking columns to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS email_sequence_day INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_email_sent TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_campaign TEXT,
ADD COLUMN IF NOT EXISTS converted BOOLEAN DEFAULT FALSE;
```

---

## Summary

**To convert your 113 leads this week:**

1. **Segment your leads** by target country and language level
2. **Create aggressive pricing** (€49/€199/€499) for one week only
3. **Send personalized emails** based on their wizard data
4. **Follow up with a 7-day nurture sequence**
5. **Track conversions** and iterate

The key insight: You have WARM leads who already told you exactly what they want. They just need:
- A reminder of their goal
- Social proof that it's achievable
- A low-friction first step (€49)
- Urgency to act now

