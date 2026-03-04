

# Redesign Email Template for Higher Conversion

## Problems Identified

1. **Layout**: Email body sits in the middle with no visual structure — just raw paragraphs
2. **CTA links**: Calendly and WhatsApp appear as raw URLs — ugly and low-click
3. **Signature**: Generic "Saludos, David" — no title, no trust signal
4. **Shared across 3 edge functions**: `generatePlainEmail` is duplicated in `spain-opportunity-blast`, `win-back-campaign`, and `send-nurture-campaign`

## Design: High-Conversion Email Template

The new template will follow best practices from high-performing outreach emails (personal feel, clear CTAs, trust signals):

- **Left-aligned**, max-width 600px, clean white background with subtle padding
- **Body text**: Clean, readable paragraphs (16px, #1a1a1a, 1.7 line-height)
- **CTA section**: Replace raw URLs with two styled **buttons** side by side:
  - **Primary button** (green, branded): "📞 Book a Free Call" → Calendly
  - **Secondary button** (green outline): "💬 WhatsApp Us" → wa.me link
- **Signature block**: Professional with title to build trust:
  - "David Rehrl"
  - "Head of Talent Partnerships — Solvia"
  - Subtle divider line above signature
- **No `---` separator** — replace with proper styled divider or spacing

## Technical Approach

1. **Create a shared email template utility** at `supabase/functions/_shared/email-template.ts` with the new `generateEmail()` function
2. **Update all 3 edge functions** to import from the shared module instead of their local `generatePlainEmail`
3. The shared function receives: `greeting`, `body`, `signature`, `lang`, and generates the full HTML

### Signature (localized)
- ES: "David Rehrl\nDirector de Alianzas de Talento — Solvia"
- EN: "David Rehrl\nHead of Talent Partnerships — Solvia"
- DE: "David Rehrl\nLeiter Talent-Partnerschaften — Solvia"
- FR: "David Rehrl\nResponsable Partenariats Talents — Solvia"
- RU: "David Rehrl\nРуководитель партнёрских программ — Solvia"

### CTA Button Labels (localized)
- Book a Call: ES "Reservar llamada gratuita" / EN "Book a Free Call" / DE "Kostenloses Gespräch buchen" / FR "Réserver un appel gratuit" / RU "Записаться на звонок"
- WhatsApp: ES "Escríbenos por WhatsApp" / EN "Message us on WhatsApp" / DE "Schreib uns auf WhatsApp" / FR "Écris-nous sur WhatsApp" / RU "Написать в WhatsApp"

### Files Changed
- **Create**: `supabase/functions/_shared/email-template.ts`
- **Edit**: `supabase/functions/spain-opportunity-blast/index.ts` — remove local `generatePlainEmail`, `bookingCTA`, `signature`; import shared
- **Edit**: `supabase/functions/win-back-campaign/index.ts` — same
- **Edit**: `supabase/functions/send-nurture-campaign/index.ts` — same

