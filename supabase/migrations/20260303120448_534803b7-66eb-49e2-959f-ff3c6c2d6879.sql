
-- Add multilingual columns for title and description
ALTER TABLE public.vacancies 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_de TEXT,
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS title_ru TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_de TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_ru TEXT;

-- Betreuungskraft (Angestellt) – Salzburg
UPDATE public.vacancies SET
  title_de = 'Betreuungskraft (Angestellt) – Salzburg',
  title_en = 'Care Worker (Employed) – Salzburg',
  title_es = 'Cuidador/a (Empleado/a) – Salzburgo',
  title_fr = 'Auxiliaire de vie (Salarié/e) – Salzbourg',
  title_ru = 'Сиделка (в штате) – Зальцбург',
  description_de = 'Solvia Homecare sucht engagierte Betreuungskräfte für die häusliche Betreuung in Salzburg. Als Angestellte/r profitieren Sie von einem stabilen Gehalt, Sozialversicherung und geregelten Arbeitszeiten. Sie unterstützen hilfsbedürftige Menschen im Alltag und sorgen für deren Wohlbefinden.',
  description_en = 'Solvia Homecare is looking for dedicated care workers for home care in Salzburg. As an employee, you benefit from a stable salary, social insurance, and regular working hours. You support people in need in their daily lives and ensure their well-being.',
  description_es = 'Solvia Homecare busca cuidadores/as comprometidos/as para atención domiciliaria en Salzburgo. Como empleado/a, disfrutará de un salario estable, seguridad social y horarios regulares. Apoyará a personas dependientes en su vida diaria.',
  description_fr = 'Solvia Homecare recherche des auxiliaires de vie pour les soins à domicile à Salzbourg. En tant que salarié/e, vous bénéficiez d''un salaire stable, de la sécurité sociale et d''horaires réguliers. Vous accompagnez les personnes dépendantes dans leur quotidien.',
  description_ru = 'Solvia Homecare ищет ответственных сиделок для ухода на дому в Зальцбурге. Как штатный сотрудник, вы получаете стабильную зарплату, социальное страхование и регулярный график работы. Вы помогаете нуждающимся людям в повседневной жизни.'
WHERE id = '23432546-9566-4213-8089-8f469e56785d';

-- Betreuungskraft (Selbständig) – Salzburg
UPDATE public.vacancies SET
  title_de = 'Betreuungskraft (Selbständig) – Salzburg',
  title_en = 'Care Worker (Self-employed) – Salzburg',
  title_es = 'Cuidador/a (Autónomo/a) – Salzburgo',
  title_fr = 'Auxiliaire de vie (Indépendant/e) – Salzbourg',
  title_ru = 'Сиделка (самозанятость) – Зальцбург',
  description_de = 'Arbeiten Sie selbständig als Betreuungskraft in Salzburg mit Solvia Homecare. Als freiberufliche Betreuungskraft genießen Sie flexible Arbeitszeiten und eigenständige Einsatzplanung. Sie betreuen hilfsbedürftige Personen in deren Zuhause und unterstützen sie im täglichen Leben.',
  description_en = 'Work as a self-employed care worker in Salzburg with Solvia Homecare. As a freelance care worker, you enjoy flexible working hours and independent scheduling. You care for people in need in their homes and support them in daily life.',
  description_es = 'Trabaje como cuidador/a autónomo/a en Salzburgo con Solvia Homecare. Como profesional independiente, disfrutará de horarios flexibles y planificación autónoma. Atenderá a personas dependientes en su hogar.',
  description_fr = 'Travaillez en tant qu''auxiliaire de vie indépendant/e à Salzbourg avec Solvia Homecare. En tant que freelance, vous bénéficiez d''horaires flexibles et d''une planification autonome. Vous accompagnez les personnes dépendantes à leur domicile.',
  description_ru = 'Работайте самостоятельно сиделкой в Зальцбурге с Solvia Homecare. Как фрилансер, вы наслаждаетесь гибким графиком и самостоятельным планированием. Вы ухаживаете за нуждающимися людьми на дому.'
WHERE id = 'f1def975-7e69-46a6-8c1a-bd90440e7a39';

-- Pflegekraft (Angestellt) – Salzburg
UPDATE public.vacancies SET
  title_de = 'Pflegekraft (Angestellt) – Salzburg',
  title_en = 'Nurse (Employed) – Salzburg',
  title_es = 'Enfermero/a (Empleado/a) – Salzburgo',
  title_fr = 'Infirmier/ère (Salarié/e) – Salzbourg',
  title_ru = 'Медсестра/Медбрат (в штате) – Зальцбург',
  description_de = 'Solvia Homecare sucht qualifizierte Pflegekräfte für die häusliche Pflege in Salzburg. Als Angestellte/r erhalten Sie ein attraktives Gehalt, volle Sozialleistungen und professionelle Weiterbildungsmöglichkeiten. Sie übernehmen pflegerische Tätigkeiten und medizinische Grundversorgung.',
  description_en = 'Solvia Homecare is looking for qualified nurses for home care in Salzburg. As an employee, you receive an attractive salary, full social benefits, and professional development opportunities. You perform nursing duties and basic medical care.',
  description_es = 'Solvia Homecare busca enfermeros/as cualificados/as para atención domiciliaria en Salzburgo. Como empleado/a, recibirá un salario atractivo, prestaciones sociales completas y oportunidades de formación profesional.',
  description_fr = 'Solvia Homecare recherche des infirmiers/ères qualifié/e/s pour les soins à domicile à Salzbourg. En tant que salarié/e, vous bénéficiez d''un salaire attractif, de prestations sociales complètes et de possibilités de formation continue.',
  description_ru = 'Solvia Homecare ищет квалифицированных медсестёр для ухода на дому в Зальцбурге. Как штатный сотрудник, вы получаете привлекательную зарплату, полный социальный пакет и возможности профессионального развития.'
WHERE id = '042acf1a-49fa-41a5-929b-2b1b0e346c91';

-- Pflegekraft (Selbständig) – Salzburg
UPDATE public.vacancies SET
  title_de = 'Pflegekraft (Selbständig) – Salzburg',
  title_en = 'Nurse (Self-employed) – Salzburg',
  title_es = 'Enfermero/a (Autónomo/a) – Salzburgo',
  title_fr = 'Infirmier/ère (Indépendant/e) – Salzbourg',
  title_ru = 'Медсестра/Медбрат (самозанятость) – Зальцбург',
  description_de = 'Arbeiten Sie selbständig als Pflegekraft in Salzburg mit Solvia Homecare. Flexible Einsatzzeiten und eigenverantwortliche Patientenbetreuung. Sie erbringen qualifizierte Pflegeleistungen im häuslichen Umfeld.',
  description_en = 'Work as a self-employed nurse in Salzburg with Solvia Homecare. Flexible scheduling and independent patient care. You provide qualified nursing services in a home setting.',
  description_es = 'Trabaje como enfermero/a autónomo/a en Salzburgo con Solvia Homecare. Horarios flexibles y atención al paciente de forma independiente. Prestará servicios de enfermería cualificados a domicilio.',
  description_fr = 'Travaillez en tant qu''infirmier/ère indépendant/e à Salzbourg avec Solvia Homecare. Horaires flexibles et prise en charge autonome des patients. Vous fournissez des soins infirmiers qualifiés à domicile.',
  description_ru = 'Работайте самостоятельно медсестрой в Зальцбурге с Solvia Homecare. Гибкий график и самостоятельный уход за пациентами. Вы оказываете квалифицированную медицинскую помощь на дому.'
WHERE id = '80dc7018-7f83-4ec4-a90b-c4d7aa4c79a2';

-- Betreuungskraft (Angestellt) – Dortmund
UPDATE public.vacancies SET
  title_de = 'Betreuungskraft (Angestellt) – Dortmund',
  title_en = 'Care Worker (Employed) – Dortmund',
  title_es = 'Cuidador/a (Empleado/a) – Dortmund',
  title_fr = 'Auxiliaire de vie (Salarié/e) – Dortmund',
  title_ru = 'Сиделка (в штате) – Дортмунд',
  description_de = 'Solvia Homecare sucht engagierte Betreuungskräfte für die häusliche Betreuung in Dortmund. Als Angestellte/r profitieren Sie von einem stabilen Gehalt, Sozialversicherung und geregelten Arbeitszeiten. Sie unterstützen hilfsbedürftige Menschen im Alltag.',
  description_en = 'Solvia Homecare is looking for dedicated care workers for home care in Dortmund. As an employee, you benefit from a stable salary, social insurance, and regular working hours. You support people in need in their daily lives.',
  description_es = 'Solvia Homecare busca cuidadores/as comprometidos/as para atención domiciliaria en Dortmund. Como empleado/a, disfrutará de un salario estable, seguridad social y horarios regulares.',
  description_fr = 'Solvia Homecare recherche des auxiliaires de vie pour les soins à domicile à Dortmund. En tant que salarié/e, vous bénéficiez d''un salaire stable, de la sécurité sociale et d''horaires réguliers.',
  description_ru = 'Solvia Homecare ищет ответственных сиделок для ухода на дому в Дортмунде. Как штатный сотрудник, вы получаете стабильную зарплату, социальное страхование и регулярный график работы.'
WHERE id = '8272c837-1125-432c-8e37-1156fc5411bc';

-- Betreuungskraft (Selbständig) – Dortmund
UPDATE public.vacancies SET
  title_de = 'Betreuungskraft (Selbständig) – Dortmund',
  title_en = 'Care Worker (Self-employed) – Dortmund',
  title_es = 'Cuidador/a (Autónomo/a) – Dortmund',
  title_fr = 'Auxiliaire de vie (Indépendant/e) – Dortmund',
  title_ru = 'Сиделка (самозанятость) – Дортмунд',
  description_de = 'Arbeiten Sie selbständig als Betreuungskraft in Dortmund mit Solvia Homecare. Flexible Arbeitszeiten und eigenständige Einsatzplanung. Sie betreuen hilfsbedürftige Personen in deren Zuhause.',
  description_en = 'Work as a self-employed care worker in Dortmund with Solvia Homecare. Flexible working hours and independent scheduling. You care for people in need in their homes.',
  description_es = 'Trabaje como cuidador/a autónomo/a en Dortmund con Solvia Homecare. Horarios flexibles y planificación autónoma. Atenderá a personas dependientes en su hogar.',
  description_fr = 'Travaillez en tant qu''auxiliaire de vie indépendant/e à Dortmund avec Solvia Homecare. Horaires flexibles et planification autonome.',
  description_ru = 'Работайте самостоятельно сиделкой в Дортмунде с Solvia Homecare. Гибкий график и самостоятельное планирование. Вы ухаживаете за нуждающимися людьми на дому.'
WHERE id = '4547b7aa-80dc-4927-8ac4-1753ce654194';

-- Pflegekraft (Angestellt) – Dortmund
UPDATE public.vacancies SET
  title_de = 'Pflegekraft (Angestellt) – Dortmund',
  title_en = 'Nurse (Employed) – Dortmund',
  title_es = 'Enfermero/a (Empleado/a) – Dortmund',
  title_fr = 'Infirmier/ère (Salarié/e) – Dortmund',
  title_ru = 'Медсестра/Медбрат (в штате) – Дортмунд',
  description_de = 'Solvia Homecare sucht qualifizierte Pflegekräfte für die häusliche Pflege in Dortmund. Attraktives Gehalt, volle Sozialleistungen und professionelle Weiterbildungsmöglichkeiten.',
  description_en = 'Solvia Homecare is looking for qualified nurses for home care in Dortmund. Attractive salary, full social benefits, and professional development opportunities.',
  description_es = 'Solvia Homecare busca enfermeros/as cualificados/as para atención domiciliaria en Dortmund. Salario atractivo, prestaciones sociales completas y oportunidades de formación profesional.',
  description_fr = 'Solvia Homecare recherche des infirmiers/ères qualifié/e/s pour les soins à domicile à Dortmund. Salaire attractif, prestations sociales complètes et possibilités de formation continue.',
  description_ru = 'Solvia Homecare ищет квалифицированных медсестёр для ухода на дому в Дортмунде. Привлекательная зарплата, полный социальный пакет и возможности профессионального развития.'
WHERE id = '7bdeb970-8726-44cc-b107-011a02604787';

-- Pflegekraft (Selbständig) – Dortmund
UPDATE public.vacancies SET
  title_de = 'Pflegekraft (Selbständig) – Dortmund',
  title_en = 'Nurse (Self-employed) – Dortmund',
  title_es = 'Enfermero/a (Autónomo/a) – Dortmund',
  title_fr = 'Infirmier/ère (Indépendant/e) – Dortmund',
  title_ru = 'Медсестра/Медбрат (самозанятость) – Дортмунд',
  description_de = 'Arbeiten Sie selbständig als Pflegekraft in Dortmund mit Solvia Homecare. Flexible Einsatzzeiten und eigenverantwortliche Patientenbetreuung im häuslichen Umfeld.',
  description_en = 'Work as a self-employed nurse in Dortmund with Solvia Homecare. Flexible scheduling and independent patient care in a home setting.',
  description_es = 'Trabaje como enfermero/a autónomo/a en Dortmund con Solvia Homecare. Horarios flexibles y atención al paciente de forma independiente a domicilio.',
  description_fr = 'Travaillez en tant qu''infirmier/ère indépendant/e à Dortmund avec Solvia Homecare. Horaires flexibles et prise en charge autonome des patients à domicile.',
  description_ru = 'Работайте самостоятельно медсестрой в Дортмунде с Solvia Homecare. Гибкий график и самостоятельный уход за пациентами на дому.'
WHERE id = '8b98e851-1104-46fc-ae38-97c6a3aba810';

-- Allgemeinmediziner/in – Extremadura
UPDATE public.vacancies SET
  title_de = 'Allgemeinmediziner/in – Extremadura',
  title_en = 'General Practitioner – Extremadura',
  title_es = 'Médico/a General – Extremadura',
  title_fr = 'Médecin Généraliste – Estrémadure',
  title_ru = 'Врач общей практики – Эстремадура',
  description_de = 'Solvia Homecare sucht Allgemeinmediziner/innen für die Arbeit in Extremadura, Spanien. Möglichkeit, in einer Region mit hoher Nachfrage nach medizinischen Fachkräften und hervorragender Lebensqualität zu praktizieren.',
  description_en = 'Solvia Homecare is looking for general practitioners to work in Extremadura, Spain. Opportunity to practice in a region with high demand for healthcare professionals and excellent quality of life.',
  description_es = 'Solvia Homecare busca médicos/as de medicina general para trabajar en Extremadura, España. Oportunidad de ejercer en una región con alta demanda de profesionales sanitarios y excelente calidad de vida.',
  description_fr = 'Solvia Homecare recherche des médecins généralistes pour travailler en Estrémadure, Espagne. Opportunité d''exercer dans une région à forte demande de professionnels de santé et excellente qualité de vie.',
  description_ru = 'Solvia Homecare ищет врачей общей практики для работы в Эстремадуре, Испания. Возможность работать в регионе с высоким спросом на медицинских специалистов и отличным качеством жизни.'
WHERE id = 'ff5f80f3-8a36-4e94-95e4-2ac2aba327e3';

-- Pflegekraft / Enfermero/a – Extremadura
UPDATE public.vacancies SET
  title_de = 'Pflegekraft – Extremadura',
  title_en = 'Nurse – Extremadura',
  title_es = 'Enfermero/a – Extremadura',
  title_fr = 'Infirmier/ère – Estrémadure',
  title_ru = 'Медсестра/Медбрат – Эстремадура',
  description_de = 'Solvia Homecare sucht Pflegekräfte für die Arbeit in Extremadura, Spanien. Integration in ein häusliches Pflegeteam mit stabilen Arbeitsbedingungen und professionellem Umfeld.',
  description_en = 'Solvia Homecare is looking for nurses to work in Extremadura, Spain. Join a home care team with stable working conditions and a professional environment.',
  description_es = 'Solvia Homecare busca enfermeros/as para trabajar en Extremadura, España. Incorporación a un equipo de atención domiciliaria con condiciones laborales estables y un entorno profesional de calidad.',
  description_fr = 'Solvia Homecare recherche des infirmiers/ères pour travailler en Estrémadure, Espagne. Intégration à une équipe de soins à domicile avec des conditions de travail stables et un environnement professionnel.',
  description_ru = 'Solvia Homecare ищет медсестёр для работы в Эстремадуре, Испания. Вступление в команду по уходу на дому со стабильными условиями труда и профессиональной средой.'
WHERE id = 'a66b4914-31ac-44b7-a968-4e9b329c3418';

-- Betreuungskraft / Cuidador/a – Extremadura
UPDATE public.vacancies SET
  title_de = 'Betreuungskraft – Extremadura',
  title_en = 'Care Worker – Extremadura',
  title_es = 'Cuidador/a – Extremadura',
  title_fr = 'Auxiliaire de vie – Estrémadure',
  title_ru = 'Сиделка – Эстремадура',
  description_de = 'Solvia Homecare sucht Betreuungskräfte für die häusliche Betreuung in Extremadura, Spanien. Unterstützung bei den täglichen Aktivitäten pflegebedürftiger Personen. Menschliches Arbeitsumfeld mit sozialem Einfluss.',
  description_en = 'Solvia Homecare is looking for care workers for home care in Extremadura, Spain. Support for daily activities of dependent persons. Humane work environment with social impact.',
  description_es = 'Solvia Homecare busca cuidadores/as para atención domiciliaria en Extremadura, España. Apoyo en las actividades diarias de personas dependientes en su hogar. Ambiente de trabajo humano y con impacto social.',
  description_fr = 'Solvia Homecare recherche des auxiliaires de vie pour les soins à domicile en Estrémadure, Espagne. Aide aux activités quotidiennes des personnes dépendantes à leur domicile. Environnement de travail humain avec un impact social.',
  description_ru = 'Solvia Homecare ищет сиделок для ухода на дому в Эстремадуре, Испания. Помощь в повседневных делах зависимым людям на дому. Гуманная рабочая среда с социальным воздействием.'
WHERE id = 'c6a6aacd-4df8-4184-b389-67c4b65e640b';
