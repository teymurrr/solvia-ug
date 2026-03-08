

# Post-Payment Automation Gaps and Proposed Enhancements

## Current State: What IS Automated

| Step | Status |
|------|--------|
| Payment marked "completed" in DB | Done |
| Starter kit email (for starter kit product) | Done |
| Discount code usage tracking | Done |
| Redirect to onboarding wizard | Done (client-side) |
| AI document validation on upload | Done |
| Refund handling | Done |

## What's Missing: 6 Automation Opportunities

### 1. Post-Payment Welcome Email (High Priority)
After a homologation payment completes, no email is sent. The client only sees the success page. If they close the tab, they lose context.

**Proposed**: Add a `send-payment-confirmation` Edge Function triggered from the stripe-webhook. Sends a branded email with:
- Payment receipt summary
- Direct link to the onboarding wizard
- Document checklist for their country
- WhatsApp contact + Calendly link
- Localized in their preferred language

### 2. Auto-Create Client Record on Payment (High Priority)
Currently the `clients` table record is only created when the user manually completes the onboarding wizard. If they drop off, there's no client record tied to the payment.

**Proposed**: In the stripe-webhook, after marking payment as completed, automatically insert a `clients` row with `user_id`, `email`, and `target_country` from payment metadata. The onboarding wizard would then update this record instead of creating it fresh.

### 3. Admin/Team Notification on New Payment (Medium Priority)
No one on the team gets notified when a new payment comes in. You only find out by checking Stripe or the admin dashboard.

**Proposed**: Extend the stripe-webhook to send an internal notification email (via Resend) to the team with client details, country, tier purchased, and amount. Could also insert a row into `notifications` for admin dashboard.

### 4. Document Upload Reminder Sequence (Medium Priority)
After payment + onboarding, if a client hasn't uploaded documents within 48 hours, there's no nudge.

**Proposed**: Create a `send-document-reminder` Edge Function triggered by a cron/scheduled invocation that:
- Queries clients with completed payments but no documents in `client_documents`
- Sends a reminder email with the direct upload link
- Tracks sends in `email_sends` to prevent duplicates
- Escalates after 7 days with a second reminder

### 5. Auto-Generate Personalized Document Checklist (Medium Priority)
The `document_requirements` table has country-specific requirements, but no per-client checklist is auto-created.

**Proposed**: After payment, automatically create `client_documents` rows (with status `not_submitted`) for each requirement matching the client's target country. This gives the client a pre-built checklist in the dashboard immediately.

### 6. Automated Calendar Booking Prompt (Low Priority)
For Personal and All-Inclusive tiers, clients should be prompted to book their first consultation call.

**Proposed**: Based on the payment tier (from metadata), include a Calendly link in the welcome email and create a notification in the dashboard prompting them to book.

## Recommended Implementation Order

1. **Post-Payment Welcome Email** — immediate impact, prevents drop-off
2. **Auto-Create Client Record** — ensures no paying client falls through cracks
3. **Auto-Generate Document Checklist** — gives instant value after payment
4. **Admin Notification** — operational visibility
5. **Document Upload Reminders** — retention/completion improvement
6. **Calendar Booking Prompt** — tier-specific enhancement

## Technical Approach

All changes center on the `stripe-webhook/index.ts` Edge Function, extending the `checkout.session.completed` handler to trigger these automations in sequence. Some items (like reminders) would need a separate scheduled Edge Function.

Shall I implement these starting from the top priority items?

