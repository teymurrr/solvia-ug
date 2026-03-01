

## Condense Roadmap + Price Card into One Conversion Section

### The Problem
Currently, the results page has two separate sections after the diagnosis cards:
1. **Roadmap** (step-by-step plan with locked steps + "Unlock" CTA)
2. **Price Card** (salary vs. investment comparison + "Start Process" CTA)

This splits the user's attention across two CTAs and creates unnecessary scroll distance. The value proposition (salary vs. investment) is disconnected from the action (unlocking the roadmap).

### The Solution
Merge both into a single "Roadmap + Value" card that tells a tighter story:
**"Here's your plan -> most steps are locked -> here's what it costs (almost nothing vs. your salary) -> unlock now"**

### Design

```text
+--------------------------------------------------+
|  Your Step-by-Step Roadmap                        |
|  Personalized action plan based on your profile   |
|                                                   |
|  01  Document Collection & Verification      [v]  |
|  02  Language Preparation                    [v]  |
|  03  Application Submission                  [x]  |
|  04  Exam Preparation                        [x]  |
|  05  Final Approval & Registration           [x]  |
|      (gradient fade over locked steps)            |
|                                                   |
|  --- separator ---                                |
|                                                   |
|  Potential salary        Your investment          |
|  8,500 EUR/mo            Starting from 39 EUR     |
|                                                   |
|  < That's less than X% of your first salary >     |
|                                                   |
|  [  Start My Process  ->  ] [Book Consultation]   |
|                                                   |
|  --- separator ---                                |
|                                                   |
|  Experts  *  98% success  *  24/7 support         |
+--------------------------------------------------+
```

### Technical Changes

**File: `src/pages/HomologationResult.tsx`**
- Remove Section 4 as a standalone `<motion.section>`
- Move the salary/investment comparison, return note, CTAs, and trust signals **inside** the roadmap section card, below the locked-steps overlay
- Keep the gradient fade + unlock overlay on the roadmap steps
- Below the roadmap area, add a separator then the salary vs. investment grid, return note, action buttons, separator, and trust signals -- all within one `bg-card border rounded-2xl` container
- Remove the standalone Section 4 title ("The smartest investment in your career") since the section header is now the roadmap title

**File: `src/utils/i18n/languages/en/homologationResult.ts`** (and es, de, fr, ru equivalents)
- No new translation keys needed; existing keys from both `roadmap` and `value` namespaces are reused within the merged section

### Benefits
- Single scroll-stopping card instead of two
- One clear decision point instead of two competing CTAs
- The "locked steps" create desire, immediately followed by the low-cost reveal -- tighter persuasion loop
- Less page length = less drop-off
