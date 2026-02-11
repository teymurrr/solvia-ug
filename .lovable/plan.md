
# Fix: Update Hardcoded €99 Price to €49 in Homologation Plan Email

## Problem Analysis

The user is receiving emails that mention a €99 plan when the actual current pricing is €49. The issue is in the **`send-homologation-plan` edge function** which sends the personalized homologation plan email after users complete the wizard.

**Root Cause:**
- Lines 138 and 143 in `supabase/functions/send-homologation-plan/index.ts` have hardcoded €99 pricing
- This pricing is hardcoded in multiple language versions (English, Spanish, German, French)
- The actual current pricing for the "Digital Starter" product is €49 (as defined in `create-payment/index.ts`)

**Why This Happened:**
The `send-homologation-plan` function was created with a fixed €99 "launch offer" price, but pricing has been updated in the `create-payment` function without updating the email template.

## Solution Approach

### 1. Update Email Content
Replace all instances of €99 with €49 in the `send-homologation-plan` function:
- Line 138: Change "€99" to "€49" in the heading for all 5 languages
- Line 143: Change "€99" to "€49" in the CTA button text for all 5 languages

### 2. Why Only Replace Text?
- The pricing is dynamic (€49 for "Digital Starter")
- The email doesn't need to be parametrized since it's specific to the "Digital Starter" product at the point when users receive it after the wizard
- Simply updating the hardcoded values to match current pricing is sufficient
- No database queries or additional complexity needed

### 3. Files to Modify
- `supabase/functions/send-homologation-plan/index.ts` (2 locations: heading and button)

### 4. Impact
- **Immediate:** Users will see the correct €49 pricing in their email
- **Scope:** Only affects the homologation plan email sent after wizard completion
- **No Breaking Changes:** The email structure remains identical, only the price changes

## Technical Details

**Changes:**
```
Line 138: "€99" → "€49" (in all 5 language versions)
Line 143: "€99" → "€49" (in all 5 language versions)
```

**Before:**
```
'Limited Time: €99 Launch Offer'
'Unlock Full Plan - €99'
```

**After:**
```
'Limited Time: €49 Launch Offer'
'Unlock Full Plan - €49'
```

