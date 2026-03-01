

## Conversion Analysis: Homologation Results Page

### Where It Sits in the Funnel
This page is the **bridge between the wizard (intent capture) and the payment page (monetization)**. The user has already invested time filling in their details -- they are warm leads. The ONLY job of this page is to make them click "Start My Process" or "Book a Consultation."

### Current Issues Hurting Conversion

1. **The biggest hook (18,000 EUR savings) is buried at the bottom** -- the most emotionally compelling number is below the fold, after a roadmap the user has to scroll past.

2. **The diagnosis row (Duration / Language / Documents) feels clinical** -- three stats in a row look like a spreadsheet, not a personalized result. They inform but don't motivate.

3. **The urgency banner competes with the savings message** -- two separate money-related messages (monthly loss AND 3-month savings) dilute each other. They should be unified into one clear financial narrative.

4. **The roadmap creates friction** -- showing locked/blurred steps makes the process look long and intimidating. The locked steps add visual noise without adding value.

5. **The secondary CTA is invisible** -- the outline button blends into the background for users who aren't ready to pay yet.

### Proposed Changes

**1. Lead with the money -- move savings to the top**
Replace the current diagnosis stats row with a single bold savings figure right after the title. The narrative becomes: "Here's how much you lose by waiting" (not three separate stats).

Structure: Flag + Title, then immediately the 3-month savings number with the urgency message merged into one line below it.

**2. Simplify the diagnosis into inline context**
Instead of a 3-column stats bar, weave duration and documents into the roadmap description naturally (e.g., "~9-12 months, 6 documents"). The language gap stays as a colored badge only if relevant.

**3. Slim down the roadmap to 3 items max**
Show only 2 unlocked steps + 1 locked "and more..." teaser. Remove the gradient fade effect. Less is more -- fewer steps = less intimidating process.

**4. Make the secondary CTA warmer**
Change "Book Consultation" from outline to a soft colored variant (e.g., light primary background) so it's clearly clickable but doesn't compete with the primary CTA.

**5. Add a single social proof line**
One line above the CTA: a short testimonial or stat like "500+ doctors already started" -- keeps it authentic per the messaging principles (no fake urgency).

### Technical Changes

**File: `src/pages/HomologationResult.tsx`**
- Restructure the hero: title -> savings highlight (moved up) -> urgency merged inline
- Remove the 3-column diagnosis stats bar
- Add duration/documents as a muted subtitle line (e.g., "~9-12 meses | 6 documentos | B2-C1 requerido")
- Reduce roadmap to max 3 visible items (2 unlocked + 1 locked teaser line)
- Remove gradient fade overlay
- Change secondary CTA to `variant="secondary"` or custom soft styling
- Add a one-line social proof text above CTAs

**Translation files** (en, es, de, fr, ru):
- Add `socialProof` key (e.g., "500+ doctors have started their journey with us")
- Update `savingsMessage` to be the primary hook copy
- Add `diagnosisSummary` key for the inline summary line (e.g., "{duration} months | {docs} documents")

### Result
The page becomes a single-scroll experience: **Title -> Big savings number -> Quick summary line -> 3 clean steps -> CTA**. No stats grid, no gradient blur, no visual clutter. Pure conversion focus.
