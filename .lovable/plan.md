

# Email System Redesign: From Sales Funnel to Personal Conversations

## Current State vs. New Approach

| Current Approach | New Approach |
|-----------------|--------------|
| 5-email sales sequence (day0-day7) | 2-3 simple, personal emails |
| CTA buttons → payment page | Reply-focused, no buttons |
| Branded HTML with logos | Plain-text feel, personal |
| "Buy now" urgency | "Quick question" curiosity |
| Features & benefits | Genuine question about their problem |
| Automated pipeline | Conversation starter |

## No Emails Sent Yet

All 113+ leads still have `email_sequence_day: 0` and `status: new`. Only test emails went to `david.rehrl@me.com`.

---

## New Email Templates

### Email 1: "Why Did You Sign Up?" (Day 0)

**Subject (by language):**
- ES: `Pregunta rápida sobre por qué te registraste`
- EN: `Quick question about why you signed up`
- DE: `Kurze Frage, warum du dich angemeldet hast`
- FR: `Petite question sur ton inscription`

**Body (Spanish example):**
```
Hola,

Te registraste en Solvia hace poco — quería hacer un breve check-in.

Cuando alguien se registra, normalmente es por un problema específico
(reconocimiento de título, encontrar hospital, exámenes de idioma, mudanza).

Estoy trabajando en la próxima versión y quería preguntarte directamente:

¿Con qué esperabas que Solvia te ayudara?

Una frase corta es más que suficiente.

Gracias,

David
```

**Why it works:**
- Zero pressure
- Ego-boost ("your opinion matters")
- Opens conversation
- Replies = sales gold

---

### Email 2: Value Email for Silent Users (Day 3-5)

**Subject:**
- ES: `Lo que muchos médicos subestiman al mudarse a Alemania`
- EN: `What most doctors underestimate about moving to Germany`
- DE: `Was die meisten Ärzte beim Umzug nach Deutschland unterschätzen`

**Body (Spanish example):**
```
Hola,

Un dato rápido de trabajar con médicos internacionales:

Los mayores retrasos no vienen del idioma — vienen de
[cuello de botella burocrático específico].

Hemos visto a personas perder 6-12 meses solo por este paso.

Si todavía estás considerando Alemania/Austria y quieres
evitar eso, con gusto te explico tus opciones.

Saludos,

David
```

**No CTA button.** Just "reply if relevant."

---

## Implementation Plan

### Step 1: Create New Template System

Replace the current 5-template system with 2 focused templates:

| Template ID | Purpose | Timing |
|-------------|---------|--------|
| `feedback_ask` | "Why did you sign up?" | Day 0-1 |
| `value_insight` | Bureaucracy insight | Day 3-5 (if no reply) |

### Step 2: Update Edge Function

Modify `supabase/functions/send-nurture-campaign/index.ts`:

1. **Remove complex HTML styling** - use minimal, plain-text-like HTML
2. **Remove CTA buttons** - no payment links in initial emails
3. **Update copy** - personal, from "David", asks for replies
4. **Keep language detection** - still auto-detect ES/EN/DE/FR
5. **Keep branding minimal** - no logo in body, just simple footer

### Step 3: Simplify the Email Structure

```
┌─────────────────────────────────────┐
│                                     │
│   Hola,                             │  ← No name (we don't have it)
│                                     │
│   [Personal message - 4-5 lines]   │
│                                     │
│   ¿Con qué esperabas que Solvia    │  ← The question
│   te ayudara?                       │
│                                     │
│   Una frase corta es suficiente.   │
│                                     │
│   Gracias,                          │
│   David                             │  ← Personal signature
│                                     │
└─────────────────────────────────────┘
No footer. No logo. No unsubscribe (reply-based).
```

### Step 4: Handle the "No First Name" Problem

Looking at your leads database: **none of them have first_name populated**.

Options:
- A: Use just "Hola," (casual, works in Spanish)
- B: Use "Hola, colega" (peer-to-peer, medical)
- C: Keep it blank (most personal)

I recommend **Option A** - just "Hola," for Spanish, "Hi," for English, etc.

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/send-nurture-campaign/index.ts` | Complete template overhaul: plain-text style, personal copy, reply-focused |

---

## Technical Details

### New `uiStrings` Structure

```typescript
const uiStrings = {
  // Email 1: Feedback Ask
  feedbackSubject: {
    es: 'Pregunta rápida sobre por qué te registraste',
    en: 'Quick question about why you signed up',
    de: 'Kurze Frage, warum du dich angemeldet hast',
    fr: 'Petite question sur ton inscription'
  },
  feedbackBody: {
    es: `Te registraste en Solvia hace poco — quería hacer un breve check-in.

Cuando alguien se registra, normalmente es por un problema específico (reconocimiento de título, encontrar hospital, exámenes de idioma, mudanza).

Estoy trabajando en la próxima versión y quería preguntarte directamente:

¿Con qué esperabas que Solvia te ayudara?

Una frase corta es más que suficiente.`,
    // ... other languages
  },
  
  // Email 2: Value Insight
  valueSubject: {
    es: 'Lo que muchos médicos subestiman al mudarse a Alemania',
    // ...
  },
  valueBody: {
    es: `Un dato rápido de trabajar con médicos internacionales:

Los mayores retrasos no vienen del idioma — vienen del proceso de reconocimiento de documentos.

Hemos visto a personas perder 6-12 meses solo por este paso.

Si todavía estás considerando Alemania/Austria y quieres evitar eso, con gusto te explico tus opciones.`,
    // ...
  },
  
  signature: {
    es: 'Gracias,\n\nDavid',
    en: 'Thanks,\n\nDavid',
    de: 'Danke,\n\nDavid',
    fr: 'Merci,\n\nDavid'
  }
};
```

### Minimal Email HTML (Plain-text feel)

```typescript
const getPlainStyleEmail = (body: string, signature: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      line-height: 1.6; 
      color: #1a1a1a; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px;
    }
  </style>
</head>
<body>
  <p>Hola,</p>
  ${body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
  <p style="white-space: pre-line;">${signature}</p>
</body>
</html>
`;
```

---

## Expected Outcomes

1. **Higher Reply Rate**: 20-40% vs ~1% click rate on current emails
2. **Conversation Starters**: Each reply is a potential sale
3. **Market Research**: Learn what problems people actually have
4. **Trust Building**: Personal touch beats automated sequences
5. **Deliverability**: Plain emails less likely to hit spam

---

## What This Does NOT Change

- Logo is still uploaded to `email-assets` bucket (for future use, payment emails, etc.)
- Language detection still works
- Lead segmentation still available
- Test mode still works

