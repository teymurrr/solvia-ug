
# SEO Domination Plan for Solvia

## Current State Assessment

**What's missing (critical gaps):**
- No per-page meta tags (title, description, OG tags) -- every page uses the same generic `index.html` title "Solvia"
- No `react-helmet-async` or equivalent for dynamic `<head>` management
- No JSON-LD structured data (Schema.org) on any page
- No canonical URLs
- No `hreflang` tags for multi-language pages (you support EN, DE, FR, ES, RU)
- Blog posts have no individual SEO metadata
- Sitemap is static and doesn't include blog post URLs or starter kit country pages
- No Open Graph tags per page (only one generic set in `index.html`)

**What's already good:**
- `robots.txt` properly configured
- Static `sitemap.xml` exists with main routes
- Google Analytics integrated
- Multi-language content available
- Fast loading with lazy-loaded components

---

## Implementation Plan

### 1. Install `react-helmet-async` and create an SEO component

Create a reusable `<SEO />` component that sets:
- `<title>` with brand suffix (e.g., "Medical License Recognition in Germany | Solvia")
- `<meta name="description">`
- `<link rel="canonical">`
- `<meta property="og:*">` (title, description, image, url, type)
- `<meta name="twitter:*">`
- `<html lang="">` attribute based on current language
- `<link rel="alternate" hreflang="x">` for all supported languages

### 2. Add per-page SEO metadata to every public page

Each page gets keyword-optimized title and description targeting high-intent searches:

| Page | Target Keywords | Title Pattern |
|------|----------------|---------------|
| `/` (Home) | medical license recognition Europe, work as doctor in Germany | "Medical License Recognition in Europe - Work as a Doctor Abroad \| Solvia" |
| `/homologation` | homologation medical degree, Approbation Germany | "Medical Degree Homologation in Europe - Germany, Austria, Spain \| Solvia" |
| `/vacancies` | medical jobs Europe, doctor jobs Germany | "Medical Jobs in Europe - Doctor & Nurse Positions \| Solvia" |
| `/learning` | medical German course, FSP preparation | "Medical Language Courses for Doctors - German, French, Spanish \| Solvia" |
| `/learning/starter-kit` | starter kit medical career Germany | "Medical Career Starter Kit - Begin Your Journey to Europe \| Solvia" |
| `/visa-info` | work visa doctors Germany, Blue Card medical | "Work Visa Guide for Medical Professionals in Europe \| Solvia" |
| `/employers` | hire international doctors, recruit medical staff | "Hire International Medical Professionals \| Solvia for Employers" |
| `/blog` | medical career abroad blog | "Blog - Medical Career in Europe Tips & Guides \| Solvia" |
| `/about` | about Solvia, medical recruitment agency | "About Solvia - Medical Career Services for Europe" |
| `/contact` | contact medical recruitment | "Contact Us \| Solvia" |
| `/professionals` | international doctors database | "Find Medical Professionals \| Solvia" |

Titles and descriptions will be translated per language using the existing i18n system.

### 3. Add JSON-LD structured data

Add Schema.org markup to key pages:

- **Home page**: `Organization` schema (name, logo, url, contact, sameAs)
- **Home page**: `WebSite` schema with `SearchAction`
- **Vacancies page**: `JobPosting` schema for each listed vacancy
- **Blog posts**: `Article` schema (headline, author, datePublished, image)
- **FAQ section**: `FAQPage` schema (already have FAQ content, just need the markup)
- **Learning page**: `Course` schema for language courses
- **Home page**: `Service` schema for homologation services

### 4. Add `hreflang` tags for multilingual support

Since the site supports 5 languages (en, de, fr, es, ru), each public page needs alternate links:
```
<link rel="alternate" hreflang="en" href="https://solvia-flexkapg.lovable.app/" />
<link rel="alternate" hreflang="de" href="https://solvia-flexkapg.lovable.app/?lang=de" />
...
<link rel="alternate" hreflang="x-default" href="https://solvia-flexkapg.lovable.app/" />
```

### 5. Enhance the sitemap

- Add `<lastmod>` dates to all URLs
- Add blog post URLs dynamically (or as a separate blog sitemap)
- Add `hreflang` annotations in sitemap for multi-language
- Add starter kit country-specific URLs if they exist

### 6. Add SEO translations to i18n files

Add an `seo` section to each language file containing page-specific titles and descriptions, properly localized and keyword-optimized for each market.

---

## Technical Details

### Files to create:
- `src/components/SEO.tsx` -- reusable Helmet component
- `src/components/StructuredData.tsx` -- JSON-LD injection component
- `src/utils/seo/metadata.ts` -- centralized page metadata config
- `src/utils/i18n/languages/en/seo.ts` (and de, fr, es, ru) -- SEO translations

### Files to modify:
- `src/App.tsx` -- wrap with `HelmetProvider`
- `src/pages/Index.tsx` -- add `<SEO />` + Organization/FAQPage structured data
- `src/pages/Blog.tsx` -- add `<SEO />` + Article structured data
- `src/pages/VacanciesConversion.tsx` -- add `<SEO />` + JobPosting structured data
- `src/pages/SolviaLearning.tsx` -- add `<SEO />` + Course structured data
- `src/pages/VisaInfo.tsx` -- add `<SEO />`
- `src/pages/EmployersLanding.tsx` -- add `<SEO />`
- `src/pages/About.tsx` -- add `<SEO />`
- `src/pages/Contact.tsx` -- add `<SEO />`
- `src/pages/StarterKit.tsx` -- add `<SEO />`
- `src/pages/HomologationWizard.tsx` -- add `<SEO />`
- `src/pages/CountrySelection.tsx` -- add `<SEO />`
- All other public pages -- add `<SEO />`
- `public/sitemap.xml` -- enhanced with lastmod and hreflang
- `index.html` -- clean up duplicate meta, add `HelmetProvider`-compatible defaults

### Dependencies to add:
- `react-helmet-async`

This plan covers on-page SEO fundamentals. Off-page SEO (backlinks, content marketing strategy, Google Search Console submission) should be handled outside the codebase.
