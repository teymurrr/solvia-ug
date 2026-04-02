

# Blog Post Fixes: Images, Duplicates & Missing Translations

## Problems Identified

1. **Broken images**: Some Unsplash URLs return "Image not available" (visible in your first screenshot)
2. **Duplicate images within same language**: Multiple posts in the same language share identical hero images (e.g., two Argentine homologation posts both use the same gavel photo)
3. **Inappropriate images**: Salary comparison posts use a stock trading chart (`photo-1611974789855`) which doesn't match medical salary content
4. **10 English-only articles** missing from DE, ES, FR, RU — these are the original pillar articles:
   - Blue Card for Doctors in Germany
   - Doctor Salary in Germany 2026
   - Documents Needed for Approbation
   - FSP Preparation Guide
   - Germany vs Spain vs Austria for Doctors
   - Life as a Foreign Doctor in Germany
   - Medical License Recognition in Germany (Complete Guide)
   - Medical License Recognition in Spain
   - Medical Specialties / Facharzt in Germany
   - Nostrifizierung Austria Medical License

## Plan

### Step 1: Fix images via SQL migration
- Replace broken/inappropriate Unsplash URLs with working, relevant alternatives
- Assign unique images per topic cluster so no two posts in the same language share the same hero image
- Replace the stock chart image on salary posts with a medical/financial hybrid image (e.g., doctor with calculator, hospital corridor)
- Use verified Unsplash photo IDs that are known to work

### Step 2: Create 40 translated blog posts
- Translate each of the 10 EN-only articles into DE, ES, FR, RU (40 new posts)
- Match the existing structure: ~1,500-2,000 words, Key Takeaway boxes, FAQ sections, HTML comparison tables
- Generate proper SEO slugs in each language
- Assign unique hero images per topic
- Use an edge function or SQL migration to insert the content

### Step 3: Verify image accessibility
- Test a sample of Unsplash URLs to confirm they load correctly

## Technical Details

- All changes via Supabase SQL migration(s)
- Blog post content stored in `blog_posts` table with `title`, `slug`, `content`, `language`, `image_url`, `category`, `status`, `meta_title`, `meta_description`, `tags`
- New posts will follow the same HTML content format as existing pillar articles (h2 headings, Key Takeaway boxes with green styling, FAQ sections with proper schema)

