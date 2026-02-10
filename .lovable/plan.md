

# Auto-Translate Community Posts for Every Reader

## The Problem

Community posts and replies are displayed in whatever language they were written in. A Spanish doctor's post appears in Spanish for everyone, even users browsing in English or German.

## Solution: On-Demand AI Translation via Edge Function

Use Lovable AI (already available via `LOVABLE_API_KEY`) to translate post titles, content, and replies on the fly, then cache translations in a new database table so each text is only translated once per language.

```text
User loads Community page (language = DE)
        |
        v
Frontend checks: do cached translations exist for these posts in DE?
        |
   YES -+- NO
   |        |
   v        v
Show cached  Call translate-community edge function
             (sends texts + target language)
                    |
                    v
             Lovable AI translates
                    |
                    v
             Cache in community_translations table
                    |
                    v
             Return translated texts
```

## Changes

### 1. New database table: `community_translations`

Caches translations so we don't re-translate the same content repeatedly.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| source_type | text | 'post_title', 'post_content', or 'reply_content' |
| source_id | uuid | ID of the post or reply |
| language | text | Target language code (en, de, fr, es, ru) |
| translated_text | text | The translated content |
| created_at | timestamptz | When the translation was cached |

Unique constraint on (source_type, source_id, language) to prevent duplicates. RLS enabled with public read, service-role write.

### 2. New Edge Function: `translate-community`

- Receives: array of `{ id, type, text }` items + target language
- Checks `community_translations` for existing cached translations
- For uncached items, calls Lovable AI (`google/gemini-3-flash-preview`) with a batch translation prompt
- Stores results in `community_translations` and returns them
- Skips translation when the target language matches the source (detected by the AI)

### 3. New React hook: `useTranslatedPosts`

- Takes an array of posts + the current language
- If current language is the original post language, returns posts as-is
- Otherwise, calls the edge function for any missing translations
- Merges translated titles/content into the post objects
- Uses React Query with cache key including language, so switching languages is instant after first load

### 4. Update Community pages

- **`Community.tsx`**: Wrap posts through `useTranslatedPosts` before rendering
- **`CommunityPost.tsx`**: Translate the single post + its replies
- **`CommunityWidget.tsx`** (dashboard): Translate the preview posts
- **`CommunitySection.tsx`** (landing): Translate the top 3 posts
- Add a small "Translated" indicator badge so users know the text was auto-translated
- Also fix the missing `date-fns` locale on `Community.tsx` and `CommunityPost.tsx` (same pattern already applied elsewhere)

### 5. Config

- Register `translate-community` in `supabase/config.toml` with `verify_jwt = false`

## Technical Details

**Edge function prompt strategy**: Send all untranslated texts in a single batch to minimize API calls. The prompt instructs the model to return a JSON array mapping each item ID to its translation. Uses tool calling for structured output.

**Cost control**: Translations are cached permanently. A post is only translated once per language. With 5 languages and ~50 posts, that's ~250 cached translations total -- minimal storage and API usage.

**UX**: Translations load asynchronously. Posts appear immediately in their original language, then swap to translated text once ready (with a brief shimmer/skeleton on the text). The "Translated" badge lets users know the content was auto-translated.

