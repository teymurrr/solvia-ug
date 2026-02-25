

## Replace GA4 Measurement ID

### What changes
Replace the old Google Analytics measurement ID (`G-JEZQDDWEWX`) with the new one (`G-F0JGP3YJGV`) across all relevant files.

### Files to update

**1. `index.html`** (line ~133)
- Change the GA4 script source and config from `G-JEZQDDWEWX` to `G-F0JGP3YJGV`

**2. `public/analytics.txt`**
- Update the measurement ID from `355353944` to `G-F0JGP3YJGV` (or add it) so Google can verify ownership of the new property

**3. `src/utils/analyticsTracking.ts`**
- No changes needed here -- this utility calls `window.gtag` which will automatically use whichever measurement ID is configured in `index.html`

### Result
All analytics data will flow to your new GA4 property. The old property will stop receiving data.
