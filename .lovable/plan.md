

# Blog Country Filtering: Personalized Content by Origin Country

## Problem

The blog currently shows all posts mixed together -- an Indian doctor sees articles about Argentine homologation, and vice versa. With plans to add many more origin countries, the blog will become increasingly cluttered and irrelevant per visitor.

## Current State

- Posts already have country-specific tags (e.g., `india`, `argentina`, `colombia`) and some have country in their slugs
- ~10 "general" posts apply to all doctors (FSP guide, salary overview, Blue Card, etc.)
- ~18 country-specific posts (7 India, 5 Argentina, 5 Colombia, 1 timeline comparison)
- The wizard and professional profiles already capture `study_country`
- Blog only filters by language today, not by origin country

## Proposed Solution: Tag-Based Country Filter Chips

Add a horizontal row of filter chips/pills on the blog page (below the language selector) that lets users filter by origin country. Posts tagged with a country only show when that country is selected. General posts always show.

```text
┌─────────────────────────────────────────────────┐
│  [🌍 All]  [🇮🇳 India]  [🇦🇷 Argentina]        │
│  [🇨🇴 Colombia]  [🇪🇬 Egypt]  ...               │
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ Post 1  │  │ Post 2  │  │ Post 3  │          │
│  └─────────┘  └─────────┘  └─────────┘          │
└─────────────────────────────────────────────────┘
```

### Why This Approach

1. **No schema changes needed** -- uses the existing `tags` column to detect country
2. **Scales to many countries** -- just add more country-tagged posts; the filter chips auto-populate from what's in the database
3. **Auto-personalization** -- if the user is logged in and has `study_country` in their profile, pre-select that filter automatically
4. **SEO-friendly** -- all posts remain in the DOM/indexable; the filter is client-side state (or optional URL param like `?country=india`)
5. **Works with the landing page** -- the BlogSection on the landing page can also show country-relevant posts if a returning user has a stored preference

### Future-Proofing

As you add more countries (Egypt, Philippines, Syria, etc.), simply tag new posts with the country name. The filter chips will auto-generate from the distinct countries found in post tags. No code changes needed per country.

## Implementation Steps

### Step 1: Add a `country_tag` column to `blog_posts`
Rather than parsing free-text tags at runtime, add a nullable `country_tag` column (e.g., `india`, `argentina`, `colombia`, or `null` for general posts). Populate it from existing tag data via a migration. This is cleaner than regex-parsing tags every render.

### Step 2: Create `BlogCountryFilter` component
A horizontal scrollable row of pill buttons. "All" is the default. Chips are dynamically built from the distinct `country_tag` values in the current language's posts. Each chip shows a flag emoji and country name.

### Step 3: Update Blog page
- Add the filter below `BlogLanguageSelector`
- Filter `filteredPosts` by selected country (or show all if "All" selected)
- Auto-select country from user's `study_country` profile field if logged in
- Persist selection in `localStorage` for returning visitors

### Step 4: Update `useBlogPostsOptimized` hook
Fetch `country_tag` alongside existing fields so the client can filter without extra queries.

### Step 5: Populate `country_tag` for existing posts
SQL migration to set `country_tag` based on slug/tag keywords:
- Slugs containing `india`, `mbbs`, `indian` → `india`
- Slugs containing `argentin` → `argentina`
- Slugs containing `colombia` → `colombia`
- All others → `NULL` (general/universal posts)

### Step 6: Update BlogSection on landing page
If a logged-in user has `study_country`, prioritize showing country-relevant posts first in the 3-post preview on the homepage.

## Technical Details

- New column: `blog_posts.country_tag TEXT NULL` (simple string, not enum -- easier to extend)
- No RLS changes needed
- Client-side filtering only -- no extra API calls per filter change
- The `BlogManagement` admin page gets a new dropdown field for `country_tag` when creating/editing posts

