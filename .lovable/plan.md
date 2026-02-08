
# Set Up Resend Webhook Tracking for Email Events

## Overview

Implement a new Edge Function (`resend-webhooks`) to capture email events from Resend (opens, clicks, bounces, complaints) and automatically update the `email_sends` table with engagement metrics. This provides real-time visibility into email performance and enables sophisticated follow-up strategies.

## Current State Analysis

**Email Sends Table Structure** (already exists):
- Core fields: `id`, `email`, `template_id`, `language`, `resend_email_id`, `status`
- Engagement fields: `opened_at`, `clicked_at`, `bounced_at`, `metadata` (already in schema!)
- These fields are currently NULL because there's no webhook handler

**Resend Integration**:
- Already using Resend for sending campaigns
- No webhook handler currently exists
- RESEND_API_KEY secret is already configured

**Pattern to Follow**:
- Stripe webhook exists at `supabase/functions/stripe-webhook/index.ts`
- Uses signature verification (similar approach needed for Resend)

## Requirements Met

✅ One email per address: Deduplication already enforced via unique constraint on `(LOWER(email), template_id)`
✅ Unified tracking: All sources logged to single `email_sends` table
✅ Event capture: Database schema already has fields for `opened_at`, `clicked_at`, `bounced_at`
✅ Webhook signature verification: Use Resend SDK's `webhooks.verify()` method

## Implementation Plan

### Step 1: Add Resend Webhook Secret
- Create new Supabase secret: `RESEND_WEBHOOK_SECRET`
- This will be provided to Resend when configuring the webhook endpoint
- User will need to set this after deployment

### Step 2: Create `resend-webhooks` Edge Function

**Location**: `supabase/functions/resend-webhooks/index.ts`

**Key Components**:
1. **Webhook Verification** (using Resend SDK):
   - Extract raw request body and headers
   - Call `resend.webhooks.verify()` with signing secret
   - Return 400 if signature invalid

2. **Event Processing**:
   - Handle events: `email.opened`, `email.clicked`, `email.bounced`, `email.complained`
   - Extract `resend_email_id` from webhook event metadata
   - Update corresponding row in `email_sends` table

3. **Update Logic**:
   - `email.opened` → Set `opened_at = now()`
   - `email.clicked` → Set `clicked_at = now()`
   - `email.bounced` → Set `bounced_at = now()`, store bounce reason in `metadata`
   - `email.complained` → Set `metadata['complained'] = true`, store complaint reason

4. **Error Handling**:
   - Log all events (successful and failed)
   - Return 200 for valid signatures (even if DB update fails) to prevent Resend retries
   - Use try-catch to handle database errors gracefully

### Step 3: Update Supabase Configuration

Add function config to `supabase/config.toml`:
```toml
[functions.resend-webhooks]
verify_jwt = false
```

Note: `verify_jwt = false` because webhooks from Resend won't have JWT auth; signature verification provides security.

### Step 4: Manual Configuration in Resend Dashboard

After deployment, user must:
1. Go to Resend Dashboard → Webhooks
2. Create new webhook endpoint: `https://ehrxpaxvyuwiwqclqkyh.functions.supabase.co/resend-webhooks`
3. Subscribe to events: `email.opened`, `email.clicked`, `email.bounced`, `email.complained`
4. Copy the signing secret from Resend
5. Add it to Lovable project as `RESEND_WEBHOOK_SECRET` secret

### Implementation Details

**Edge Function Structure**:
```typescript
// Dependencies: resend SDK (already installed)
// Authentication: Signature verification via RESEND_WEBHOOK_SECRET

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return CORS response

  try {
    // 1. Get raw body for signature verification
    const rawBody = await req.text()
    
    // 2. Extract headers
    const headers = {
      id: req.headers.get('svix-id'),
      timestamp: req.headers.get('svix-timestamp'),
      signature: req.headers.get('svix-signature')
    }
    
    // 3. Verify webhook signature using Resend SDK
    const event = resend.webhooks.verify({
      payload: rawBody,
      headers,
      webhookSecret: Deno.env.get("RESEND_WEBHOOK_SECRET")
    })
    
    // 4. Parse event and update email_sends table
    switch(event.type) {
      case 'email.opened':
        UPDATE email_sends SET opened_at = NOW() WHERE resend_email_id = event.data.email_id
      case 'email.clicked':
        UPDATE email_sends SET clicked_at = NOW() WHERE resend_email_id = event.data.email_id
      case 'email.bounced':
        UPDATE email_sends SET bounced_at = NOW(), metadata = {reason: event.data.bounce_reason}
      case 'email.complained':
        UPDATE email_sends SET metadata = {complained: true, reason: event.data.reason}
    }
    
    // 5. Log and return 200 (Resend expects 200 for successful receipt)
    return Response(200, { status: "ok" })
    
  } catch (error) {
    // Return 400 for signature verification failures
    // Log error for debugging
    return Response(400, { error: "Invalid signature" })
  }
}
```

**Database Updates** (no schema changes needed):
- `opened_at`, `clicked_at`, `bounced_at` columns already exist
- `metadata` JSONB column stores additional event data
- All updates are simple row updates by `resend_email_id`

### Benefits

✅ **Real-time Engagement Tracking**: Opens/clicks captured automatically
✅ **Smart Follow-ups**: Can query unopened emails for Wave 2 campaigns
✅ **Bounce Management**: Automatically mark invalid addresses for future exclusion
✅ **Performance Analytics**: Language/template performance by engagement metrics
✅ **No Code Changes**: Existing send function doesn't need modification
✅ **Secure**: Webhook signature verification prevents spoofing

### Testing Strategy

1. **Initial Setup Test**: Send test email via `send-nurture-campaign`
2. **Verification**: Check `resend_email_id` is captured in `email_sends`
3. **Event Simulation**: Use Resend dashboard to send test webhook events
4. **Database Validation**: Query `email_sends` to verify event timestamps updated
5. **Production**: Monitor Edge Function logs for webhook receipts

### Sequence of Steps for User

1. **AI creates the Edge Function** ✓ (this plan)
2. **Deploy** (automatic when preview builds)
3. **User adds RESEND_WEBHOOK_SECRET** via Lovable secrets modal
4. **User configures webhook in Resend Dashboard** (manual step)
5. **Test with sample email** to verify webhook is working
6. **Run campaigns** - events will auto-populate in real-time

