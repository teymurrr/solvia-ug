

# Blog Integration Analysis & SEO Domination Plan

## Part 1: Current Blog State -- Critical Issues Found

### What exists:
- Blog list page at `/blog` -- works, pulls posts from Supabase `blog_posts` table
- Admin blog management (referenced at `/admin/blog` but **route is missing from routes.tsx**)
- BlogSection component exists in `src/components/landing/BlogSection.tsx` but is **NOT rendered on the landing page**
- Blog editor toolbar, WYSIWYG editor, comments, likes, views, translations -- all components exist
- SEO translations for the blog page exist in all 5 languages
- `createArticleSchema` JSON-LD generator exists but is **not used** on blog posts

### What is broken:
1. **No individual blog post route** -- `/blog/:id` is not in `routes.tsx`. Every blog card links to `/blog/${post.id}` which hits a **404**. Blog posts are completely inaccessible.
2. **No admin blog route** -- `/admin/blog` is referenced but not registered in routes.tsx. Admin cannot manage posts.
3. **BlogSection removed from landing page** -- was previously integrated, now gone. No blog content surfaces on the homepage.
4. **No slug-based URLs** -- posts link by UUID (`/blog/abc-123-uuid`), not SEO-friendly slugs (`/blog/medical-license-germany`).
5. **Sitemap has no blog post entries** -- only `/blog` list page, no individual articles.

---

## Part 2: Angie BRU Competitive Analysis

Angie BRU (angiebru.com) dominates Google for Spanish-language medical homologation in Germany. Here is what she does:

### Content Strategy (Why She Ranks)
- **20+ long-form articles** targeting specific high-intent keywords:
  - "Homologar titulo medico en Alemania" (pillar page)
  - "Sueldo medico en Alemania" (salary info -- massive search volume)
  - "Especialidades medicas en Alemania"
  - "Visa o permiso de trabajo en Alemania"
  - "Rotaciones medicas en Alemania"
  - "Guardias medicas en Alemania"
  - "Nacionalidad alemana como medico"
  - "Errores medico extranjero Alemania"
  - "Libros para homologacion"
  - "Practicas durante homologacion"
- Each article is **1,500-3,000+ words**, deeply authoritative
- **Table of Contents** on each article (improves dwell time, Google loves it)
- **Personal storytelling** -- "Soy Angie Bru, medico venezolana" builds E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- **SEO-friendly slugs**: `/homologar-el-titulo-de-medico-en-alemania/` not UUIDs

### Technical SEO
- WordPress + Elementor (server-rendered HTML, not SPA)
- Proper `<h1>`, `<h2>` hierarchy in each post
- Clean URL structure with keyword-rich slugs
- Blog posts as standalone pages with full meta tags

### LLM Visibility Strategy
- Comprehensive, factual content that LLMs can cite
- FAQ-style headings ("How much does a doctor earn in Germany?")
- Structured, well-organized content with clear answers
- Personal brand association ("Angie Bru" = medical homologation Germany)

### What Solvia Can Do Better
- **Multilingual advantage** -- Angie only covers Spanish. Solvia can dominate EN, DE, FR, RU
- **Multi-country** -- Angie only covers Germany. Solvia covers Germany, Austria, Spain
- **Platform + content** -- Angie is content-only. Solvia has an actual product (jobs, documents, payments)
- **Structured data** -- Article schema, FAQ schema on every post
- **Programmatic SEO** -- country-specific landing pages + blog content per country

---

## Part 3: Implementation Plan

### Phase 1: Fix the Blog Infrastructure (Critical)

**1. Create BlogPost detail page** (`src/pages/BlogPost.tsx`)
- Fetch post by slug OR id from Supabase
- Render full content with proper `<h1>`, semantic HTML
- Include SEO component with post-specific title, description, og:image
- Include Article JSON-LD structured data using `createArticleSchema`
- Include Table of Contents auto-generated from `<h2>` headings
- Include BlogComments, BlogTranslations, like/view tracking
- Breadcrumb navigation (Blog > Category > Post Title)
- Related posts section at bottom
- Author bio section with E-E-A-T signals

**2. Add slug-based routing**
- Add route `/blog/:slug` to `routes.tsx`
- Resolve posts by `slug` field (already exists in DB schema)
- Redirect `/blog/:uuid` to `/blog/:slug` for old links

**3. Restore admin blog route**
- Re-register `/admin/blog` in `routes.tsx` (lazy load the admin blog management page)

**4. Add BlogSection back to landing page**
- Re-integrate `BlogSection` into `Index.tsx` between FAQ and Super CTA sections
- Shows latest 3 posts as social proof + internal linking

### Phase 2: SEO Content Architecture

**5. Implement SEO-optimized blog post template**
- Auto-generate Table of Contents from H2 headings
- Add reading time estimate
- Add "Last updated" date display
- Add breadcrumb JSON-LD schema
- Add FAQ JSON-LD for posts containing Q&A patterns
- Add social sharing buttons (generates backlinks)
- Related articles based on category/tags

**6. Dynamic sitemap generation**
- Create an Edge Function `generate-sitemap` that queries `blog_posts` (status = 'published') and generates XML sitemap entries dynamically
- Include `<lastmod>` from `updated_at`, proper `<changefreq>`
- Add hreflang annotations linking translated versions via `post_group_id`

**7. Blog category pages**
- Add route `/blog/category/:category`
- Category-specific SEO with targeted meta descriptions
- Categories aligned to pillar topics: homologation, language-learning, visa, life-abroad, career

### Phase 3: Content Strategy for Google & LLM Dominance

**8. Define pillar content plan** (content to create via admin)

Target these high-volume keyword clusters in ALL 5 languages:

| Pillar Topic | Target Keywords (examples) |
|---|---|
| Homologation Germany | "Approbation Germany", "medical license recognition Germany", "Approbation Arzt Deutschland" |
| Homologation Austria | "Nostrifizierung Osterreich", "medical license Austria" |
| Homologation Spain | "homologacion titulo medico Espana" |
| Medical Salaries | "doctor salary Germany", "Arztgehalt Deutschland", "sueldo medico Alemania" |
| Medical Language | "medical German course", "FSP preparation", "Fachsprachprufung" |
| Visa & Immigration | "Blue Card doctors Germany", "Chancenkarte", "work visa medical professionals" |
| Life as a Doctor | "working as a doctor in Germany experience", "Arzt Alltag Deutschland" |
| Specialties | "medical specialties Germany", "Facharzt Weiterbildung" |

**9. Implement LLM-optimized content patterns**
- FAQ sections with clear question-answer format at the end of each post
- "Key Takeaways" summary boxes at the top
- Definitive statements that LLMs can quote: "In 2026, a doctor in Germany earns between..."
- Comparison tables (Germany vs Austria vs Spain)
- Step-by-step numbered guides

### Phase 4: Technical SEO Hardening

**10. Pre-rendering / SSR consideration**
- Since this is an SPA (React), Google may struggle to index dynamic blog content
- Add `react-snap` or a pre-rendering solution to generate static HTML for blog posts
- Alternative: serve blog content in the initial HTML via a serverless pre-render proxy

**11. Internal linking strategy**
- Blog posts should link to: `/homologation`, `/vacancies`, `/learning`, `/visa-info`
- Service pages should link to relevant blog posts
- Auto-suggest related content based on tags

**12. Performance optimization for Core Web Vitals**
- Lazy load blog images below fold
- Preload LCP image on blog post pages
- Ensure CLS stability with image aspect ratios (already using OptimizedImage)

---

### Summary of Files to Create/Modify

| Action | File |
|--------|------|
| Create | `src/pages/BlogPost.tsx` -- individual post detail page |
| Create | `src/components/blog/TableOfContents.tsx` -- auto-generated TOC |
| Create | `src/components/blog/RelatedPosts.tsx` -- related articles |
| Create | `src/components/blog/AuthorBio.tsx` -- E-E-A-T author section |
| Create | `supabase/functions/generate-sitemap/index.ts` -- dynamic sitemap |
| Modify | `src/routes.tsx` -- add `/blog/:slug`, `/admin/blog`, category routes |
| Modify | `src/pages/Index.tsx` -- re-add BlogSection |
| Modify | `src/pages/Blog.tsx` -- link by slug instead of id |
| Modify | `src/components/landing/BlogSection.tsx` -- use slugs |
| Modify | `public/sitemap.xml` -- redirect to dynamic generation |
| Modify | `src/components/StructuredData.tsx` -- add BreadcrumbList schema |

