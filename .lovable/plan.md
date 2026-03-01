

## Declutter the Results Page Hero Section

### What to remove or merge

1. **Remove the "Analizamos tu perfil" badge** -- It's decorative and adds no information. The user knows they just completed a wizard.

2. **Remove the subtitle** ("Esto es lo que te separa de ejercer medicina en Austria") -- It restates what the title already communicates. The title + flag already says "Your path to Austria."

3. **Fold the profile pills into a single line below the title** -- Instead of separate pills, combine into a natural sentence: "General Practitioner from Argentina" as simple muted text under the title (not pills/badges).

4. **Keep the salary urgency line** -- This is the strongest emotional hook and should stay, but it moves up closer to the title now that the badge and subtitle are gone.

### Result: Before vs After

```text
BEFORE (6 layers):
  [Analizamos tu perfil]           <-- delete
  Flag + Title                     
  Subtitle                         <-- delete
  Salary warning                   
  [Pill] [Pill]                    <-- simplify to text
  [Card] [Card] [Card]

AFTER (4 layers):
  Flag + Title
  "General Practitioner from Argentina"  (muted text)
  Salary warning
  [Card] [Card] [Card]
```

### Technical Changes

**File: `src/pages/HomologationResult.tsx`**
- Remove the `inline-flex items-center gap-2 bg-primary/10` sparkle badge block (lines 199-202)
- Remove the subtitle paragraph (lines 208-211)
- Replace the profile pills `flex-wrap` block with a single `<p>` of muted text combining doctor type and origin country, e.g. `{getDoctorTypeLabel(...)} · {t.homologationResult.from} {studyCountry}`
- Keep the salary urgency line as-is, it just moves up visually

**Translation files**: No changes needed -- existing keys are reused or simply not rendered.

### Benefits
- 2 fewer visual layers = faster scanning
- The emotional hook (salary loss) appears closer to the title
- Cleaner, more confident design -- less "explaining," more "showing"
