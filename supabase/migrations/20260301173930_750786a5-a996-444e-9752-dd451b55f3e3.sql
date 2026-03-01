
-- Update vacancy 1: Germany - Doctor (salary ~85-110k * 1.4 = ~119-154k)
UPDATE vacancies SET 
  title = 'Facharzt für Anästhesiologie',
  institution = 'RoMed Klinik Prien am Chiemsee',
  country = 'Deutschland',
  city = 'Prien am Chiemsee',
  location = 'Prien am Chiemsee, Deutschland',
  salary = '119.000€ - 154.000€',
  profession = 'Doctor',
  posted_date = '2026-03-01 12:00:00+00'
WHERE id = '2f7376df-b4b8-4e0f-89b7-a6e343753b4a';

-- Update vacancy 2: Austria - Doctor (salary ~80-105k * 1.4 = ~112-147k)
UPDATE vacancies SET 
  title = 'Facharzt für Innere Medizin',
  institution = 'Universitätsklinikum Wien',
  country = 'Österreich',
  city = 'Wien',
  location = 'Wien, Österreich',
  salary = '112.000€ - 147.000€',
  profession = 'Doctor',
  posted_date = '2026-03-01 11:00:00+00'
WHERE id = '57f2d71a-035f-4c6e-9ba7-eb7ddfc7b168';

-- Update vacancy 3: France - Nurse (salary ~35-50k * 1.4 = ~49-70k)
UPDATE vacancies SET 
  title = 'Infirmier(ère) Diplômé(e) d''État',
  institution = 'Hôpital Pitié-Salpêtrière',
  country = 'France',
  city = 'Paris',
  location = 'Paris, France',
  salary = '49.000€ - 70.000€',
  profession = 'Nurse',
  specialty = 'Soins intensifs',
  department = 'Soins intensifs',
  posted_date = '2026-03-01 10:00:00+00'
WHERE id = 'c8f4077a-69bd-478d-8ca0-28ac1137848c';

-- Update vacancy 4: Spain - Nurse (salary ~28-40k * 1.4 = ~39-56k)
UPDATE vacancies SET 
  title = 'Enfermero/a Especialista en Urgencias',
  institution = 'Hospital Clínic de Barcelona',
  country = 'España',
  city = 'Barcelona',
  location = 'Barcelona, España',
  salary = '39.000€ - 56.000€',
  profession = 'Nurse',
  specialty = 'Urgencias',
  department = 'Urgencias',
  posted_date = '2026-03-01 09:00:00+00'
WHERE id = 'f39506b1-b39c-4779-bb20-b959f3877734';
