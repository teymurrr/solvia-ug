

## Analysis: SEO Issues in Blog Across Languages

The last change (translating UI strings) was **partially good but missed critical SEO issues**:

### Problems Found

1. **Incorrect hreflang on blog posts (HIGH IMPACT)**
   The `SEO` component blindly appends `?lang=XX` to the current path for hreflang tags. For blog posts, this produces invalid URLs like `/blog/medical-license-germany?lang=es` — but the Spanish version is a completely different post at `/blog/homologacion-titulo-medico-alemania`. Since translations are linked via `post_group_id`, the hreflang tags should point to the actual translated post URLs instead.

2. **Hardcoded English H1 on blog listing page**
   Line 38: `<span className="text-primary">Solvia</span> Blog` — the H1 tag is always English regardless of language. Search engines weight H1 heavily for language relevance.

3. **Hardcoded English in BlogTranslations component**
   Line 29: `"Available in other languages:"` is not translated. Minor but contributes to mixed-language signals.

### Plan

**A. Fix hreflang for blog posts** (`BlogPost.tsx`, `SEO.tsx`)
- Add an optional `hreflangOverrides` prop to the `SEO` component that accepts a map of `{ lang: url }`.
- In `BlogPost.tsx`, build hreflang overrides from the `translations` array (which already contains slug and language data) and pass them to `SEO`.
- When overrides are provided, use them instead of the auto-generated `?lang=` pattern.

**B. Translate blog listing H1** (`Blog.tsx`)
- Replace hardcoded `"Solvia Blog"` with `{t.blog.title}` (already available: "Блог", "Blog", etc.).

**C. Translate BlogTranslations component** (`BlogTranslations.tsx`, all blog.ts i18n files)
- Add `availableInOtherLanguages` key to each language's `blog.ts`.
- Use the translation in the component.

