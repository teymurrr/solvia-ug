

## Make the "Not sure?" Consultation CTA More Prominent

### Goal
Increase visibility of the free consultation link without competing with the primary "Start My Journey Now" button. The consultation CTA serves as a safety net for hesitant buyers -- making it more noticeable can capture high-intent users who aren't ready to pay yet, which actually supports conversion rather than hurting it.

### Design Approach
Transform the current plain text link into a lightweight styled card with a subtle background, border, and slightly larger text. This gives it visual weight without making it look like a competing button.

**Current state:** Small muted text link, easily overlooked.

**Proposed state:** A soft-bordered container with a calendar icon, bolder "Not sure?" question, and a styled consultation link -- visually distinct from both the payment button and surrounding content.

### Technical Changes

**File: `src/components/payments/PaymentFlow.tsx`** (lines 680-694)

Replace the current plain `<div className="text-center">` wrapper with a styled container:

- Add a subtle background: `bg-muted/50 rounded-lg p-4 border border-border/50`
- Make "Not sure yet?" text slightly bolder: `font-medium text-foreground` (instead of muted)
- Make the consultation link more visible: `text-primary font-medium` with underline
- Increase icon size from `w-4 h-4` to `w-5 h-5`
- Add a small separator (`mt-4 pt-4 border-t`) between the payment button and this section to create visual breathing room

This keeps the consultation CTA clearly secondary (it's not a button, it's a styled text block) while making it impossible to miss.

