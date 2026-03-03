
-- Normalize all country values to consistent English lowercase keys
UPDATE public.vacancies SET country = 'germany' WHERE LOWER(country) IN ('deutschland', 'germany');
UPDATE public.vacancies SET country = 'austria' WHERE LOWER(country) IN ('österreich', 'austria');
UPDATE public.vacancies SET country = 'spain' WHERE LOWER(country) IN ('españa', 'spain', 'spanien');
UPDATE public.vacancies SET country = 'france' WHERE LOWER(country) IN ('france', 'frankreich', 'francia');
