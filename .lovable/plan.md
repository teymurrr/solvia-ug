

# Homologation Result Page - Visual Redesign

The current page has several aesthetic issues: the layout feels flat, sections are disconnected, there's redundant CTA messaging (the same "Start My Process" appears three times), and the overall visual hierarchy doesn't guide the user's eye effectively. Here's the plan to make it significantly more polished and conversion-oriented.

## Key Problems Identified

1. **Redundant CTAs** -- "Iniciar Mi Proceso" appears inside the Timeline card, potentially in the Language card, AND again in the bottom CTA card. This dilutes urgency and looks repetitive.
2. **Flat, boxy layout** -- Every section is a plain bordered card with no visual depth or contrast variation.
3. **Urgency banner feels disconnected** -- It sits between the header and content without visual integration.
4. **Benefits row is generic** -- Four small cards with icons feel like filler rather than trust signals.
5. **No visual storytelling** -- The page reads like a list of boxes rather than a guided journey.

## Redesign Approach

### 1. Hero Section -- Make it feel premium
- Add a subtle gradient background card behind the title area instead of just centered text
- Integrate the urgency/salary-loss message directly into the hero as an accent callout (inline amber text or a small pill), removing the separate banner block
- Show the user's profile summary (doctor type, origin country, target) as styled pills/tags

### 2. Timeline Card -- Visual upgrade
- Replace the three plain colored boxes with a horizontal step-indicator style (dots connected by a line, with labels below)
- Use subtle gradient backgrounds instead of flat color blocks
- Remove the duplicate CTA from inside this card

### 3. Language Card -- Cleaner presentation
- Use a visual progress indicator (e.g., A1 to C2 scale with the user's level and required level marked) instead of two Badge rows
- Keep the single contextual CTA here (this one makes sense since it routes differently based on language needs)

### 4. Benefits Section -- Social proof strip
- Convert from 4 separate bordered cards to a single row with a light background, no borders, just icons and text inline -- feels more like a trust bar
- Add subtle separator dots between items

### 5. Bottom CTA -- Single, strong call to action
- Replace the gradient-bordered card with a clean, bold section
- One primary button + one secondary (consultation)
- Add the "limited spots" urgency badge here

### 6. Overall Polish
- Increase spacing between sections for breathing room
- Add subtle background color shifts between sections for visual rhythm
- Ensure motion animations are staggered smoothly

## Technical Details

**Files to modify:**
- `src/pages/HomologationResult.tsx` -- Main restructuring of the layout, removing duplicate CTAs, updating styling classes

**No new dependencies needed** -- all changes use existing Tailwind classes, Framer Motion, Lucide icons, and shadcn/ui components.

**Changes summary:**
- Merge urgency banner into the hero section as a compact callout
- Restyle timeline from 3 colored boxes to a connected step-indicator layout with gradient backgrounds
- Add a visual language level scale (A1-C2 bar) to the language card
- Convert benefits from 4 bordered cards to a seamless trust bar
- Remove redundant CTAs (keep one in timeline/language cards contextually, one strong bottom CTA)
- Improve spacing and add section background alternation

