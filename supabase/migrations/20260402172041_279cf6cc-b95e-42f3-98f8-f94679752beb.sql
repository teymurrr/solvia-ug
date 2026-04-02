
-- Add hero images based on slug/category patterns

-- INDIA + APPROBATION
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%approbation%indian%' OR slug ILIKE '%approbation%indisch%' OR slug ILIKE '%approbation%indiens%' OR slug ILIKE '%approbacija%indii%' OR slug ILIKE '%approbation%indios%' OR slug ILIKE '%guia-approbation-medicos-india%' OR slug ILIKE '%approbation-medecins-indiens%' OR slug ILIKE '%approbation-dlya-vrachey-iz-indii%');

-- GERMAN LICENSE FROM INDIA
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%german-medical-license%india%' OR slug ILIKE '%licencia-medica-alemania%india%' OR slug ILIKE '%licence-medicale-allemagne%inde%' OR slug ILIKE '%meditsinskuyu-litsenziyu%germanii%');

-- MBBS articles
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%mbbs%');

-- MISTAKES/ERRORS
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%mistake%' OR slug ILIKE '%fehler%' OR slug ILIKE '%errores%' OR slug ILIKE '%erreurs%' OR slug ILIKE '%oshibok%');

-- SALARY: India
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND category = 'salary' AND (slug ILIKE '%india%' OR slug ILIKE '%indien%' OR slug ILIKE '%indio%' OR slug ILIKE '%inde%' OR slug ILIKE '%indii%');

-- SALARY: Argentina
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND category = 'salary' AND (slug ILIKE '%argentin%');

-- SALARY: Colombia
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND category = 'salary' AND (slug ILIKE '%colombia%' OR slug ILIKE '%kolumbien%' OR slug ILIKE '%colombie%' OR slug ILIKE '%kolumbij%');

-- LANGUAGE / FSP
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (category = 'language' OR slug ILIKE '%fachsprach%' OR slug ILIKE '%fsp%');

-- CAREER / ROI
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (category = 'career' OR slug ILIKE '%roi%' OR slug ILIKE '%lohnt%' OR slug ILIKE '%vale-la-pena%' OR slug ILIKE '%vaut-le-coup%' OR slug ILIKE '%vygody%');

-- AUSTRIA
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%austria%' OR slug ILIKE '%oesterreich%' OR slug ILIKE '%autriche%' OR slug ILIKE '%avstrii%');

-- KENNTNISPRÜFUNG / GLEICHWERTIGKEITSPRÜFUNG
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%kenntnis%' OR slug ILIKE '%gleichwert%');

-- SPAIN / homologation
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%spain%' OR slug ILIKE '%spanien%' OR slug ILIKE '%espana%' OR slug ILIKE '%espagne%' OR slug ILIKE '%ispaniya%' OR slug ILIKE '%homologacion%espana%' OR slug ILIKE '%homologacion-medica-espana%');

-- TIMELINE / DURATION
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%dauer%' OR slug ILIKE '%timeline%' OR slug ILIKE '%how-long%' OR slug ILIKE '%cuanto-tarda%' OR slug ILIKE '%delais%' OR slug ILIKE '%sroki%');

-- EUROPE GENERAL
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%europe%' OR slug ILIKE '%europa%' OR slug ILIKE '%anerkennung%' OR slug ILIKE '%reconnaissance%' OR slug ILIKE '%priznanie%' OR slug ILIKE '%homologation%europe%');

-- ARGENTINA + GERMANY
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND slug ILIKE '%argentin%';

-- COLOMBIA + GERMANY
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1512678080587-27446ccdb0db?w=1200&h=630&fit=crop'
WHERE image_url IS NULL AND (slug ILIKE '%colombia%' OR slug ILIKE '%kolumbien%' OR slug ILIKE '%colombie%' OR slug ILIKE '%kolumbij%');

-- CATCH-ALL
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=630&fit=crop'
WHERE image_url IS NULL;

-- Standardize Key Takeaway box: blue -> green
UPDATE blog_posts 
SET content = REPLACE(
  content,
  'background:#f0f9ff;border-left:4px solid #0ea5e9;padding:16px;margin:16px 0;border-radius:8px',
  'background:#f0fdf4;border-left:4px solid #22c55e;padding:20px;border-radius:8px;margin-bottom:32px'
)
WHERE content LIKE '%background:#f0f9ff;border-left:4px solid #0ea5e9%';
