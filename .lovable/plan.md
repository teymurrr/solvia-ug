

# Fix 40 Blog Posts with Untranslated Content

## Problem

40 non-English blog posts have translated titles but **English body content**. These are the 10 "general topic" posts (Approbation guide, FSP, salary, Blue Card, etc.) duplicated across DE, ES, FR, RU — all still containing the original English HTML content.

The 18 pillar articles (with `post_group_id`) are fine — properly translated across all 5 languages.

## Affected Posts

| Language | Posts affected | Example |
|----------|--------------|---------|
| DE | 10 | "Arztgehalt in Deutschland 2026" — content says "Key Takeaways" in English |
| ES | 10 (of 11) | "Salario Médico en Alemania 2026" — content in English |
| FR | 10 | "Salaire Médecin en Allemagne 2026" — content in English |
| RU | 10 | "Зарплата врача в Германии 2026" — content in English |

**1 Spanish post is correctly translated** ("Cómo homologar tu título médico argentino en Alemania").

## Solution

Create an Edge Function that:
1. Fetches all 40 affected posts (non-English, `post_group_id IS NULL`, content contains English markers)
2. For each post, sends the English content to the AI translation API (same pattern as `translate-community`)
3. Translates the full HTML body content to the post's target language, preserving all HTML structure (tables, styled divs, headings, links)
4. Updates each post's `content` column with the translated version
5. Also translates the `excerpt`, `meta_title`, and `meta_description` fields

## Implementation Steps

### Step 1: Create `translate-blog-posts` Edge Function
- Accepts a batch of post IDs or a language filter
- For each post, fetches its content and calls the Lovable AI gateway to translate
- Preserves all HTML formatting, inline styles, class names, and structure
- Updates the post in-place via Supabase service role
- Processes posts sequentially to avoid rate limits (with small delays)

### Step 2: Run the function for each language
- Call it 4 times: DE, ES (10 posts only — skip the already-translated one), FR, RU
- Each call translates ~10 posts

### Step 3: Verify results
- Spot-check a few posts per language to confirm content is properly translated
- Ensure HTML structure (tables, Key Takeaway boxes, FAQ sections) is preserved

## Technical Details

- Uses the same AI gateway pattern as `translate-community` (`https://ai.gateway.lovable.dev/v1/chat/completions`)
- Model: `google/gemini-2.5-flash` (handles long HTML content well)
- Posts are ~2,000 words each, so content will be sent in full per post (not batched)
- The function will be a one-time migration tool — can be deleted afterward
- No frontend changes needed

