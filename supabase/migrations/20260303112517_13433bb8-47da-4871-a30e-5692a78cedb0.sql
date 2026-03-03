
-- Insert Solvia Homecare vacancies
-- Salzburg, Austria
INSERT INTO public.vacancies (institution, institution_id, title, description, location, city, country, salary, job_type, contract_type, department, profession, requirements, posted_date)
VALUES
-- Salzburg Betreuungskraft Angestellt
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Betreuungskraft (Angestellt) – Salzburg',
 'Solvia Homecare sucht engagierte Betreuungskräfte für die häusliche Betreuung in Salzburg. Als Angestellte/r profitieren Sie von einem stabilen Gehalt, Sozialversicherung und geregelten Arbeitszeiten. Sie unterstützen hilfsbedürftige Menschen im Alltag und sorgen für deren Wohlbefinden.',
 'Salzburg, Österreich', 'Salzburg', 'austria', '€30.000 - €45.000/Jahr', 'Full-time', 'Angestellt', 'Homecare', 'nurse',
 ARRAY['Erfahrung in der Betreuung oder Pflege', 'Deutschkenntnisse (mind. B1)', 'Einfühlungsvermögen und Zuverlässigkeit', 'EU-Arbeitsgenehmigung oder österreichische Aufenthaltsgenehmigung'],
 now()),

-- Salzburg Betreuungskraft Selbständig
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Betreuungskraft (Selbständig) – Salzburg',
 'Arbeiten Sie selbständig als Betreuungskraft in Salzburg mit Solvia Homecare. Als freiberufliche Betreuungskraft genießen Sie flexible Arbeitszeiten und eigenständige Einsatzplanung. Sie betreuen hilfsbedürftige Personen in deren Zuhause und unterstützen sie im täglichen Leben.',
 'Salzburg, Österreich', 'Salzburg', 'austria', 'Auf Anfrage', 'Freelance', 'Selbständig', 'Homecare', 'nurse',
 ARRAY['Gewerbeschein oder Bereitschaft zur Anmeldung', 'Erfahrung in der häuslichen Betreuung', 'Deutschkenntnisse (mind. B1)', 'Eigenverantwortliches Arbeiten'],
 now()),

-- Salzburg Pflegekraft Angestellt
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Pflegekraft (Angestellt) – Salzburg',
 'Solvia Homecare sucht qualifizierte Pflegekräfte für die häusliche Pflege in Salzburg. Als Angestellte/r erhalten Sie ein attraktives Gehalt, volle Sozialleistungen und professionelle Weiterbildungsmöglichkeiten. Sie übernehmen pflegerische Tätigkeiten und medizinische Grundversorgung.',
 'Salzburg, Österreich', 'Salzburg', 'austria', '€38.000 - €55.000/Jahr', 'Full-time', 'Angestellt', 'Homecare', 'nurse',
 ARRAY['Abgeschlossene Pflegeausbildung', 'Anerkannter Abschluss in Österreich oder Bereitschaft zur Anerkennung', 'Deutschkenntnisse (mind. B2)', 'Berufserfahrung in der Pflege von Vorteil'],
 now()),

-- Salzburg Pflegekraft Selbständig
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Pflegekraft (Selbständig) – Salzburg',
 'Arbeiten Sie selbständig als Pflegekraft in Salzburg mit Solvia Homecare. Flexible Einsatzzeiten und eigenverantwortliche Patientenbetreuung. Sie erbringen qualifizierte Pflegeleistungen im häuslichen Umfeld.',
 'Salzburg, Österreich', 'Salzburg', 'austria', 'Auf Anfrage', 'Freelance', 'Selbständig', 'Homecare', 'nurse',
 ARRAY['Abgeschlossene Pflegeausbildung', 'Gewerbeschein oder Bereitschaft zur Anmeldung', 'Deutschkenntnisse (mind. B2)', 'Eigenständige Arbeitsweise'],
 now()),

-- Dortmund Betreuungskraft Angestellt
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Betreuungskraft (Angestellt) – Dortmund',
 'Solvia Homecare sucht engagierte Betreuungskräfte für die häusliche Betreuung in Dortmund. Als Angestellte/r profitieren Sie von einem stabilen Gehalt, Sozialversicherung und geregelten Arbeitszeiten. Sie unterstützen hilfsbedürftige Menschen im Alltag.',
 'Dortmund, Deutschland', 'Dortmund', 'germany', '€30.000 - €45.000/Jahr', 'Full-time', 'Angestellt', 'Homecare', 'nurse',
 ARRAY['Erfahrung in der Betreuung oder Pflege', 'Deutschkenntnisse (mind. B1)', 'Einfühlungsvermögen und Zuverlässigkeit', 'EU-Arbeitsgenehmigung oder deutsche Aufenthaltsgenehmigung'],
 now()),

-- Dortmund Betreuungskraft Selbständig
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Betreuungskraft (Selbständig) – Dortmund',
 'Arbeiten Sie selbständig als Betreuungskraft in Dortmund mit Solvia Homecare. Flexible Arbeitszeiten und eigenständige Einsatzplanung. Sie betreuen hilfsbedürftige Personen in deren Zuhause.',
 'Dortmund, Deutschland', 'Dortmund', 'germany', 'Auf Anfrage', 'Freelance', 'Selbständig', 'Homecare', 'nurse',
 ARRAY['Gewerbeschein oder Bereitschaft zur Anmeldung', 'Erfahrung in der häuslichen Betreuung', 'Deutschkenntnisse (mind. B1)', 'Eigenverantwortliches Arbeiten'],
 now()),

-- Dortmund Pflegekraft Angestellt
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Pflegekraft (Angestellt) – Dortmund',
 'Solvia Homecare sucht qualifizierte Pflegekräfte für die häusliche Pflege in Dortmund. Attraktives Gehalt, volle Sozialleistungen und professionelle Weiterbildungsmöglichkeiten.',
 'Dortmund, Deutschland', 'Dortmund', 'germany', '€38.000 - €55.000/Jahr', 'Full-time', 'Angestellt', 'Homecare', 'nurse',
 ARRAY['Abgeschlossene Pflegeausbildung', 'Anerkannter Abschluss in Deutschland oder Bereitschaft zur Anerkennung', 'Deutschkenntnisse (mind. B2)', 'Berufserfahrung in der Pflege von Vorteil'],
 now()),

-- Dortmund Pflegekraft Selbständig
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Pflegekraft (Selbständig) – Dortmund',
 'Arbeiten Sie selbständig als Pflegekraft in Dortmund mit Solvia Homecare. Flexible Einsatzzeiten und eigenverantwortliche Patientenbetreuung im häuslichen Umfeld.',
 'Dortmund, Deutschland', 'Dortmund', 'germany', 'Auf Anfrage', 'Freelance', 'Selbständig', 'Homecare', 'nurse',
 ARRAY['Abgeschlossene Pflegeausbildung', 'Gewerbeschein oder Bereitschaft zur Anmeldung', 'Deutschkenntnisse (mind. B2)', 'Eigenständige Arbeitsweise'],
 now()),

-- Extremadura Allgemeinmediziner
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Allgemeinmediziner/in – Extremadura',
 'Solvia Homecare busca médicos de medicina general para trabajar en Extremadura, España. Oportunidad de ejercer en una región con alta demanda de profesionales sanitarios y excelente calidad de vida. Contrato estable con posibilidades de desarrollo profesional.',
 'Extremadura, España', 'Extremadura', 'spain', '€30.000 - €50.000/Jahr', 'Full-time', 'Angestellt', 'Medicina General', 'doctor',
 ARRAY['Título de medicina homologado en España', 'Conocimientos de español (mín. B2)', 'Experiencia en atención primaria', 'Colegiación médica o disposición para tramitarla'],
 now()),

-- Extremadura Pflegekraft
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Pflegekraft / Enfermero/a – Extremadura',
 'Solvia Homecare busca enfermeros/as para trabajar en Extremadura, España. Incorporación a un equipo de atención domiciliaria con condiciones laborales estables y un entorno profesional de calidad.',
 'Extremadura, España', 'Extremadura', 'spain', '€18.000 - €30.000/Jahr', 'Full-time', 'Angestellt', 'Enfermería', 'nurse',
 ARRAY['Título de enfermería homologado en España', 'Conocimientos de español (mín. B1)', 'Experiencia en cuidados domiciliarios de ventaja', 'Colegiación o disposición para tramitarla'],
 now()),

-- Extremadura Betreuungskraft
('Solvia Homecare', 'df03a807-9b71-4126-a409-e36ea2053f90',
 'Betreuungskraft / Cuidador/a – Extremadura',
 'Solvia Homecare busca cuidadores/as para atención domiciliaria en Extremadura, España. Apoyo en las actividades diarias de personas dependientes en su hogar. Ambiente de trabajo humano y con impacto social.',
 'Extremadura, España', 'Extremadura', 'spain', '€14.000 - €25.000/Jahr', 'Full-time', 'Angestellt', 'Cuidados', 'nurse',
 ARRAY['Experiencia en cuidado de personas mayores o dependientes', 'Conocimientos de español (mín. A2-B1)', 'Empatía y responsabilidad', 'Permiso de trabajo en la UE'],
 now());
