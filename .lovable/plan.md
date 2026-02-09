

# Quick-Win Product: "Medical German Starter Kit" -- Digital Product for Immediate Sales

## Analysis: Why This Will Sell Fastest

### What we already have built:
- Full learning page with wizard (country > level > profession)
- Payment infrastructure with Stripe (3 tiers: 49/199/499 EUR)
- Lead capture form sending to Resend
- Localized content in 5 languages
- Exam prep data for FSP/TELC

### What's missing for fast sales:
The current flow goes: Wizard -> Free Plan Result -> "Get Free Consultation" (lead form). There is NO direct purchase path from the Learning page. The payment flow only exists on `/homologation-payment` and is tied to the homologation process, not language learning specifically.

### The fastest-to-sell product: "German Medical Language Starter Kit" at EUR 29

**Why EUR 29?**
- Aligns with the "small yes" strategy already documented in memory (EUR 29-49 entry products)
- Low enough for impulse purchase -- no committee decision needed
- High enough to filter serious buyers from tire-kickers
- Creates a buyer relationship for upselling to Complete (EUR 199) or Mentorship (EUR 499)

**What it includes (digital, zero marginal cost):**
1. PDF: "50 Essential Medical German Phrases for Day 1 at the Hospital"
2. PDF: "FSP Exam Structure & Timeline Guide"  
3. PDF: "Your Personal Roadmap: A1 to Approbation"
4. Audio: 10 pronunciation examples of critical medical terms (can link to external hosted files)
5. Checklist: "Document Checklist for Approbation in Germany"
6. Bonus: 1 free 15-minute consultation call booking link

**Why this is fast to implement:**
- All content is informational (PDFs can be stored in Supabase Storage or linked externally)
- We already have Stripe payment infrastructure
- We already have the learning page as the funnel
- We just need: a new product card, a payment path, and a delivery email

## Implementation Plan

### 1. New Landing Section: "German Starter Kit" Card on Learning Page
Add a dedicated product card between the wizard result and the consultation form on `/learning`. When the user completes the wizard and selects Germany, show this as a prominent "Start Now for EUR 29" offer alongside the existing plan result.

**Key conversion elements:**
- Show it right after the wizard result (highest intent moment)
- Urgency: "Limited introductory price"
- Social proof: "Join 500+ professionals who started here"
- Clear deliverables list
- One-click buy button

### 2. Dedicated Purchase Page: `/learning/starter-kit`
A focused, single-product landing page for the German Starter Kit:
- Hero with value proposition
- What's included (visual checklist)
- Testimonial from existing learning data
- Email input + "Buy Now EUR 29" button
- FAQ (2-3 questions)
- Money-back guarantee badge

### 3. Backend: New Stripe Product + Delivery Edge Function

**Edge function: `create-learning-payment`**
- Creates a Stripe Checkout session for EUR 29
- Metadata includes: product type `german_starter_kit`, customer email, language
- Success/cancel URLs point to dedicated pages

**Edge function: `deliver-starter-kit`** (triggered by Stripe webhook or on payment success page)
- Sends a localized email with download links to the purchased materials
- Records the purchase in the database
- Triggers a follow-up nurture sequence (upsell to Complete Package after 3 days)

### 4. Payment Success Page Update
After purchase, redirect to a thank-you page with:
- Immediate access to materials (download links)
- "Your next step" upsell to Complete Package (EUR 199)
- Consultation booking link (the free 15-min bonus)

### 5. Integration Points on Existing Pages
- **Learning page wizard result**: When country = Germany, show "Start with the Starter Kit" CTA (EUR 29) alongside existing "Get Free Consultation"
- **Landing page LearningMiniBanner**: Update to mention "German Starter Kit from EUR 29"
- **Homologation result page**: Cross-sell the Starter Kit for users who selected Germany

### 6. Translation Keys
Add `starterKit` section to all 5 language files with product descriptions, CTAs, and delivery email content.

## Technical Changes Summary

| File | Action |
|------|--------|
| `src/pages/GermanStarterKit.tsx` | NEW -- Dedicated product landing page |
| `src/components/learning/StarterKitOffer.tsx` | NEW -- Product card component for wizard result |
| `src/components/learning/LearningPlanResult.tsx` | EDIT -- Add Starter Kit CTA when country is Germany |
| `src/routes.tsx` | EDIT -- Add `/learning/starter-kit` route |
| `supabase/functions/create-learning-payment/index.ts` | NEW -- Stripe checkout for EUR 29 product |
| `supabase/functions/deliver-starter-kit/index.ts` | NEW -- Email delivery with download links after purchase |
| `supabase/functions/stripe-webhook/index.ts` | EDIT -- Handle `german_starter_kit` product type |
| `src/pages/PaymentSuccess.tsx` | EDIT -- Handle starter kit delivery display |
| `src/utils/i18n/languages/*/learning.ts` | EDIT -- Add `starterKit` translation keys (all 5 languages) |
| `src/components/landing/LearningMiniBanner.tsx` | EDIT -- Mention starter kit price |
| `supabase/config.toml` | EDIT -- Add new function configs |

## Sales Funnel Flow

```text
Landing Page / Learning Page
        |
        v
  Learning Wizard (select Germany)
        |
        v
  Plan Result + Starter Kit Offer (EUR 29)
        |
   +---------+---------+
   |                   |
   v                   v
Buy EUR 29         Free Consultation
   |                   |
   v                   v
Stripe Checkout    Lead Form (existing)
   |
   v
Thank You + Downloads + Upsell (EUR 199)
   |
   v
Nurture Email (Day 3): "Ready for the full package?"
```

## Timeline Estimate
- Implementation: 1 session (all infrastructure exists)
- Content: PDFs need to be created/uploaded separately (you provide or we use placeholder links)
- Go live: Same day after content upload

## Revenue Projection
At EUR 29 with even 5% conversion of learning page visitors, this creates immediate revenue AND a buyer list for upselling to EUR 199/499 packages -- which is where the real margin sits.

