

# Localized Supabase Auth Emails

## Problem

Supabase Auth sends confirmation and password-reset emails using built-in templates configured in the Supabase dashboard. These templates are in a single language (English), so all users receive them in English regardless of their browser/UI language.

## Approach

Instead of relying on Supabase's built-in email templates, we will:

1. **Create a new edge function** (`send-auth-email`) that sends localized confirmation and password-reset emails via Resend
2. **Store the user's preferred language** in their `user_metadata` at signup time so we know which language to use
3. **Configure Supabase to use a custom SMTP** or **Auth Hook** to route emails through our function

However, since Supabase's Auth email templates cannot be replaced by edge functions directly (they are triggered internally by Supabase Auth), the most practical approach is:

### Option chosen: Custom signup flow with `autoconfirm` disabled + edge function

We keep Supabase's email confirmation flow but **replace the email content** by:

1. Passing `preferred_language` in user metadata during signup
2. Creating a **Database Webhook / Auth Hook** (Supabase Auth Hook on `signup` event) that triggers our edge function to send a localized email
3. Alternatively (simpler): after calling `signUp()`, immediately call our own edge function to send a branded, localized confirmation email, and configure Supabase's built-in template to be a minimal fallback

**Simplest reliable approach**: Since Supabase does not easily let you fully replace auth emails with custom ones via hooks in the hosted platform, we will:

1. Pass `preferred_language` into user metadata at signup
2. Create a `send-auth-email` edge function that sends localized confirmation/welcome emails via Resend
3. Call this function from the frontend right after a successful `signUp()` call
4. Update the Supabase dashboard confirmation email template to be multilingual as a fallback (instructions provided to user)

## Technical Changes

### Step 1: Pass language into user metadata at signup

**Files:** `src/components/signup/ProfessionalSignupForm.tsx`, `src/components/signup/InstitutionSignupForm.tsx`, `src/contexts/AuthContext.tsx`

- Add `preferred_language` to the metadata type in `AuthContext.tsx`
- In both signup forms, read `currentLanguage` from `useLanguage()` and include it in the `signUp()` metadata call

```typescript
await signUp(data.email, data.password, {
  first_name: data.firstName,
  last_name: data.lastName,
  user_type: 'professional',
  preferred_language: currentLanguage, // NEW
});
```

### Step 2: Create `send-auth-email` edge function

**File:** `supabase/functions/send-auth-email/index.ts`

This function:
- Accepts `email`, `type` (confirmation/welcome), and `language` parameters
- Contains localized email templates for all 5 languages (en, es, de, fr, ru)
- Sends the email via Resend from `team@thesolvia.com`
- For confirmation emails, includes the confirmation link from Supabase

### Step 3: Call the edge function after signup

**Files:** `src/components/signup/ProfessionalSignupForm.tsx`, `src/components/signup/InstitutionSignupForm.tsx`

After a successful `signUp()` call, invoke the edge function:

```typescript
await supabase.functions.invoke('send-auth-email', {
  body: {
    email: data.email,
    type: 'welcome',
    language: currentLanguage,
    firstName: data.firstName,
  },
});
```

### Step 4: Add config.toml entry

**File:** `supabase/config.toml`

```toml
[functions.send-auth-email]
verify_jwt = false
```

### Step 5: Supabase Dashboard instructions

Since the actual "Confirm your email" link is sent by Supabase Auth internally, we cannot fully replace it in code. The user needs to:

1. Go to **Supabase Dashboard > Authentication > Email Templates**
2. Update the **Confirm signup** template to include multilingual content (we will provide the exact HTML)
3. Similarly update the **Reset password** template

The edge function will handle a branded welcome/onboarding email in the correct language, sent alongside the Supabase confirmation email.

## Email Templates (5 languages)

The edge function will include templates for:
- **Welcome email** (sent after signup, in user's language)
- Subjects, greetings, body text, and CTAs in en/es/de/fr/ru

## Summary of files to create/modify

| File | Action |
|------|--------|
| `src/contexts/AuthContext.tsx` | Add `preferred_language` to metadata type |
| `src/components/signup/ProfessionalSignupForm.tsx` | Pass language in metadata + call edge function |
| `src/components/signup/InstitutionSignupForm.tsx` | Pass language in metadata + call edge function |
| `supabase/functions/send-auth-email/index.ts` | New edge function with localized email templates |
| `supabase/config.toml` | Add function config entry |

Additionally, instructions will be provided on how to update the Supabase dashboard email templates to be multilingual for the confirmation and password reset emails.

