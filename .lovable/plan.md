

# Add GA4 Funnel Event Tracking

## Overview
The analytics utility (`analyticsTracking.ts`) exists and works, but several critical funnel steps are **not firing events**. Here's what needs to be added:

## Current State

| Funnel Step | Event | Status |
|---|---|---|
| Wizard start | -- | **Missing** |
| Country selected | `country_selected` | Already works |
| Wizard complete | -- | **Missing** |
| Payment page view | -- | **Missing** |
| Payment initiated | `payment_started` | Already works |
| Payment success | -- | **Missing** |
| Call booked (Calendly click) | -- | **Missing** |

## Changes

### 1. Add new event types to `analyticsTracking.ts`
Add 4 new event names to the `GA4EventName` type and corresponding helper methods to the `Analytics` object:
- `wizard_started` -- fires when the homologation wizard mounts
- `wizard_completed` -- fires when the wizard reaches the summary/result step
- `payment_page_viewed` -- fires when the payment page loads
- `call_booked` -- fires when a user clicks the Calendly booking link

Also wire `payment_completed` (already defined but never called).

### 2. Fire `wizard_started` in `HomologationWizard.tsx`
Add a `useEffect` on mount that calls `Analytics.assessmentStarted('homologation')` (already defined) or the new `wizard_started` event.

### 3. Fire `wizard_completed` in `HomologationWizard.tsx`
When the wizard reaches the summary step (after all fields collected), fire the completion event.

### 4. Fire `payment_page_viewed` in `HomologationPayment.tsx`
Add a `useEffect` on mount to track the page view.

### 5. Fire `payment_completed` in `PaymentSuccess.tsx`
When payment verification succeeds (`verificationStatus === 'success'`), fire `payment_completed` with the product type and amount from `paymentData`.

### 6. Fire `call_booked` on all Calendly link clicks
Update `handleBookConsultation` in `HomologationResult.tsx` and `HomologationWizard.tsx`, and the WhatsApp button component to track when users click the booking link.

### Files Modified
- `src/utils/analyticsTracking.ts` -- add new event types + helpers
- `src/pages/HomologationWizard.tsx` -- wizard_started (mount) + wizard_completed (summary step)
- `src/pages/HomologationPayment.tsx` -- payment_page_viewed (mount)
- `src/pages/PaymentSuccess.tsx` -- payment_completed (on verification success)
- `src/pages/HomologationResult.tsx` -- call_booked (Calendly click)
- `src/components/WhatsAppButton.tsx` -- call_booked (Calendly click if applicable)

