

# SEO Audit & Optimization Plan

## Critical Finding: Empty HTML Shell

Fetching the live site returns **an almost empty HTML body** -- just the `<div id="root"></div>` with no content. This is the single biggest SEO blocker. Google's crawler may execute JavaScript, but it deprioritizes JS-rendered content and many crawlers (Bing, social media, LLMs) do not execute JS at all.

**What Google/Bing/ChatGPT actually sees when crawling Solvia:**
```text
<html lang="en">
  <body>
    <div id="root"></div>   ← empty
  </body>
</html>
```

No title, no headings, no content, no structured data. React Helmet injects meta tags client-side, but non-JS crawlers never see them.

---

## Issues Found (Priority Order)

### 1. SPA Renders Nothing Server-Side (CRITICAL)
- All content, meta tags, structured data, and hreflang are injected via JavaScript
- Googlebot can render JS but deprioritizes it; Bing/Yandex/LLM crawlers often cannot
- **Fix**: Add pre-rendering for all public pages so crawlers get full HTML

### 2. index.html Has Generic/Duplicate Meta Tags
- `<title>Solvia</title>` and `<meta name="description" content="Connecting qualified medical professionals...">` are hardcoded
- These are the ONLY tags crawlers see if JS doesn't execute
- OG image uses relative path (`/lovable-uploads/...`) instead of absolute URL -- social previews may break

### 3. FAQ Section Has No Structured Data
- `ConversionFAQSection` renders 6 FAQ items but `createFAQSchema` is never used anywhere
- Missing FAQ rich snippets in Google search results (competitors like Angie BRU get these)

### 4. Vacancies Page Has No Structured Data
- No `JobPosting` schema despite having `createJobPostingSchema` available
- Missing job listing rich results in Google

### 5. Missing Pages from Structured Data
- Only 3 of 16+ pages use `StructuredData` (Index, BlogPost, Learning)
- Homologation, Vacancies, VisaInfo, About, Contact -- none have structured data

### 6. Hreflang Implementation Issues
- Hreflang URLs use query params (`?lang=de`) but the app uses localStorage for language -- Google may see identical content on all hreflang URLs
- No server-side language detection from URL params

### 7. Service Worker May Cache Stale Content
- SW uses cache-first for static assets, which could serve outdated content to crawlers

---

## Implementation Plan

### Phase 1: Fix Critical Indexing (Pre-rendering)

**Add `react-snap` for static pre-rendering**
- Install `react-snap` and configure it to pre-render all 16 public routes
- This generates static HTML files at build time so crawlers get full content
- Each pre-rendered page will include the React Helmet meta tags, structured data, and content
- Files to modify: `package.json` (add react-snap config), `src/main.tsx` (hydrate instead of render)

### Phase 2: Fix index.html Fallback Meta Tags

**Update `index.html`**
- Change the default `<title>` to include target keywords: "Solvia -- Medical License Recognition in Europe"
- Update default description to be keyword-rich
- Fix OG image to use absolute URL (`https://solvia-flexkapg.lovable.app/lovable-uploads/...`)
- These serve as fallbacks when JS doesn't execute

### Phase 3: Add Missing Structured Data

**Add FAQ schema to landing page**
- Import `createFAQSchema` in `ConversionFAQSection.tsx` or `Index.tsx`
- Generate FAQ JSON-LD from the 6 FAQ items
- This enables FAQ rich snippets in Google

**Add JobPosting schema to Vacancies**
- Use `createJobPostingSchema` for real vacancy listings on the Vacancies page

**Add BreadcrumbList to all major pages**
- Homologation, VisaInfo, Learning, About, Contact, Blog

### Phase 4: Fix Hreflang & Language URL Handling

**Make language query param functional**
- On app init, read `?lang=` from URL and set it as the active language
- This ensures Google sees different content for each hreflang URL
- Modify `useLanguage` hook to check URL params on mount

### Phase 5: Optimize index.html SEO Signals

**Clean up resource hints**
- Remove `<link rel="modulepreload" href="/src/components/landing/HeroSection.tsx" />` (file doesn't exist)
- Ensure preloads match actual critical resources

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Modify | `package.json` | Add react-snap for pre-rendering |
| Modify | `src/main.tsx` | Use hydrate for pre-rendered pages |
| Modify | `index.html` | Fix fallback title, description, OG image |
| Modify | `src/pages/Index.tsx` | Add FAQ structured data |
| Modify | `src/components/landing/ConversionFAQSection.tsx` | Export FAQ data for schema |
| Modify | `src/pages/VacanciesConversion.tsx` | Add JobPosting structured data |
| Modify | `src/hooks/useLanguage.ts` | Read language from URL params |
| Modify | `src/pages/VisaInfo.tsx` | Add breadcrumb structured data |
| Modify | `src/pages/About.tsx` | Add breadcrumb structured data |

