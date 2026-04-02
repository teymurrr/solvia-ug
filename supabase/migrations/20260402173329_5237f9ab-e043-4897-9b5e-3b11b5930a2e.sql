-- Fix salary posts: replace stock chart (1611974789855) with medical images
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop' WHERE slug = 'cuanto-gana-un-medico-colombiano-alemania-vs-colombia' AND language = 'es';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop' WHERE slug = 'doctor-salary-germany-vs-colombia-guide-en' AND language = 'en';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=630&fit=crop' WHERE slug = 'gehalt-arzt-deutschland-vs-kolumbien-de' AND language = 'de';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=630&fit=crop' WHERE slug = 'salaire-medecin-allemagne-vs-colombie-fr' AND language = 'fr';

-- Fix Indian salary comparison duplicates
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1200&h=630&fit=crop' WHERE slug = 'salaire-medecin-indien-allemagne-vs-inde-fr' AND language = 'fr';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&h=630&fit=crop' WHERE slug = 'salario-medico-indio-alemania-vs-india-es' AND language = 'es';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=630&fit=crop' WHERE slug = 'zarplata-vracha-germany-india-sravnenie-ru' AND language = 'ru';

-- Fix Argentina approbation duplicates (1589391886645 used too many times)
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop' WHERE slug = 'homologar-titulo-medico-alemania-desde-argentina-2026' AND language = 'es';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1585503418462-c3ae8ea46e6e?w=1200&h=630&fit=crop' WHERE slug = 'homologar-titulo-medico-argentino-alemania' AND language = 'es';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop' WHERE slug = 'kak-podtverdit-diplom-vracha-v-germanii-iz-argentiny-2026-ru' AND language = 'ru';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1585503418462-c3ae8ea46e6e?w=1200&h=630&fit=crop' WHERE slug = 'approbation-deutschland-aerzte-argentinien-guide-de' AND language = 'de';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop' WHERE slug = 'medical-homologation-germany-argentine-doctors-2026-en' AND language = 'en';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1585503418462-c3ae8ea46e6e?w=1200&h=630&fit=crop' WHERE slug = 'homologation-allemagne-medecins-argentins-guide-complet-fr' AND language = 'fr';

-- Fix Indian approbation duplicates in DE (1527866959252)
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=630&fit=crop' WHERE slug = 'approbation-indische-aerzte-leitfaden-2026-de' AND language = 'de';

-- Fix Colombia guide duplicates (1512678080587)
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop' WHERE slug = 'arzt-werden-deutschland-kolumbien-approbation-guide-de' AND language = 'de';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop' WHERE slug = 'homologation-allemagne-medecins-colombiens-guide-complet-fr' AND language = 'fr';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop' WHERE slug = 'medical-license-germany-colombian-doctors-guide-en' AND language = 'en';

-- Fix other EN duplicates
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1519922639192-e73293ca430e?w=1200&h=630&fit=crop' WHERE slug = 'medical-license-recognition-europe-guide-en' AND language = 'en';
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop' WHERE slug = 'fachsprachpruefung-indian-doctors-guide' AND language = 'en';

-- Fix RU duplicate
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1200&h=630&fit=crop' WHERE slug = 'vrach-v-ispanii-kolumbija-gid-po-homologacii-ru' AND language = 'ru';

-- Fix EN Spain duplicate
UPDATE blog_posts SET image_url = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=630&fit=crop' WHERE slug = 'medical-license-homologation-spain-colombian-doctors-en' AND language = 'en';