-- Create storage bucket for homologation documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('homologation-documents', 'homologation-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for homologation-documents bucket
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'homologation-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'homologation-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'homologation-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'homologation-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create document_requirements table
CREATE TABLE public.document_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_name_en TEXT NOT NULL,
  document_name_es TEXT,
  document_name_de TEXT,
  document_name_fr TEXT,
  document_name_ru TEXT,
  description_en TEXT,
  description_es TEXT,
  description_de TEXT,
  description_fr TEXT,
  description_ru TEXT,
  instructions_en TEXT,
  instructions_es TEXT,
  instructions_de TEXT,
  instructions_fr TEXT,
  instructions_ru TEXT,
  how_to_obtain_en TEXT,
  how_to_obtain_es TEXT,
  how_to_obtain_de TEXT,
  how_to_obtain_fr TEXT,
  how_to_obtain_ru TEXT,
  estimated_time TEXT,
  estimated_cost TEXT,
  priority_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(country, document_type)
);

-- Enable RLS on document_requirements
ALTER TABLE public.document_requirements ENABLE ROW LEVEL SECURITY;

-- Anyone can read document requirements
CREATE POLICY "Anyone can read document requirements"
ON public.document_requirements FOR SELECT
USING (true);

-- Only admins can manage document requirements
CREATE POLICY "Admins can manage document requirements"
ON public.document_requirements FOR ALL
USING (is_admin(auth.uid()));

-- Create client_documents table
CREATE TABLE public.client_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES public.document_requirements(id) ON DELETE CASCADE,
  file_path TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  status TEXT NOT NULL DEFAULT 'not_submitted' CHECK (status IN ('not_submitted', 'pending_review', 'complete', 'partial', 'invalid')),
  ai_feedback_en TEXT,
  ai_feedback_es TEXT,
  ai_feedback_de TEXT,
  ai_feedback_fr TEXT,
  ai_feedback_ru TEXT,
  ai_analysis JSONB,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, requirement_id)
);

-- Enable RLS on client_documents
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own documents
CREATE POLICY "Users can view their own documents"
ON public.client_documents FOR SELECT
USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);

-- Users can insert their own documents
CREATE POLICY "Users can insert their own documents"
ON public.client_documents FOR INSERT
WITH CHECK (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);

-- Users can update their own documents
CREATE POLICY "Users can update their own documents"
ON public.client_documents FOR UPDATE
USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
ON public.client_documents FOR DELETE
USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON public.client_documents FOR SELECT
USING (is_admin(auth.uid()));

-- Admins can update all documents
CREATE POLICY "Admins can update all documents"
ON public.client_documents FOR UPDATE
USING (is_admin(auth.uid()));

-- Seed document requirements for Germany
INSERT INTO public.document_requirements (country, document_type, document_name_en, document_name_es, document_name_de, document_name_fr, document_name_ru, description_en, description_es, description_de, description_fr, description_ru, instructions_en, instructions_es, instructions_de, instructions_fr, instructions_ru, how_to_obtain_en, how_to_obtain_es, how_to_obtain_de, how_to_obtain_fr, how_to_obtain_ru, estimated_time, estimated_cost, priority_order, is_required, icon) VALUES
('germany', 'passport', 'Passport', 'Pasaporte', 'Reisepass', 'Passeport', 'Паспорт', 
'A valid passport is required for identity verification', 
'Se requiere un pasaporte válido para verificación de identidad', 
'Ein gültiger Reisepass ist für die Identitätsprüfung erforderlich', 
'Un passeport valide est requis pour la vérification d''identité', 
'Действующий паспорт необходим для подтверждения личности',
'Upload a clear scan or photo of your passport''s main page (the one with your photo and personal details). Ensure all text is readable.',
'Sube un escaneo claro o foto de la página principal de tu pasaporte (la que tiene tu foto y datos personales). Asegúrate de que todo el texto sea legible.',
'Laden Sie einen klaren Scan oder ein Foto der Hauptseite Ihres Reisepasses hoch (die mit Ihrem Foto und persönlichen Daten). Stellen Sie sicher, dass der gesamte Text lesbar ist.',
'Téléchargez un scan clair ou une photo de la page principale de votre passeport (celle avec votre photo et vos données personnelles). Assurez-vous que tout le texte est lisible.',
'Загрузите четкий скан или фото главной страницы паспорта (с вашей фотографией и личными данными). Убедитесь, что весь текст читаем.',
'Apply at your local passport office or embassy. Processing usually takes 2-6 weeks.',
'Solicítalo en tu oficina de pasaportes local o embajada. El procesamiento suele tardar 2-6 semanas.',
'Beantragen Sie ihn bei Ihrem örtlichen Passamt oder der Botschaft. Die Bearbeitung dauert in der Regel 2-6 Wochen.',
'Faites une demande auprès de votre bureau de passeport local ou ambassade. Le traitement prend généralement 2 à 6 semaines.',
'Подайте заявление в местный паспортный стол или посольство. Обработка обычно занимает 2-6 недель.',
'2-6 weeks', '€30-100', 1, true, 'passport'),

('germany', 'diploma', 'Medical Diploma', 'Título de Medicina', 'Medizinisches Diplom', 'Diplôme de Médecine', 'Диплом врача',
'Your official medical degree certificate from your university',
'Tu certificado oficial de grado en medicina de tu universidad',
'Ihr offizielles medizinisches Abschlusszeugnis von Ihrer Universität',
'Votre certificat officiel de diplôme de médecine de votre université',
'Официальный сертификат о медицинском образовании из вашего университета',
'Upload your original diploma or a certified copy. The document must show your full name, degree title, and date of graduation.',
'Sube tu diploma original o una copia certificada. El documento debe mostrar tu nombre completo, título del grado y fecha de graduación.',
'Laden Sie Ihr Originaldiplom oder eine beglaubigte Kopie hoch. Das Dokument muss Ihren vollständigen Namen, den Abschlussgrad und das Graduierungsdatum enthalten.',
'Téléchargez votre diplôme original ou une copie certifiée. Le document doit indiquer votre nom complet, le titre du diplôme et la date d''obtention.',
'Загрузите оригинал диплома или заверенную копию. Документ должен содержать ваше полное имя, название степени и дату выпуска.',
'Request from your university''s registrar office. May require apostille if from outside the EU.',
'Solicítalo en la oficina de registro de tu universidad. Puede requerir apostilla si es de fuera de la UE.',
'Beantragen Sie es beim Studierendensekretariat Ihrer Universität. Erfordert möglicherweise eine Apostille, wenn außerhalb der EU ausgestellt.',
'Demandez-le au service du registraire de votre université. Peut nécessiter une apostille si en dehors de l''UE.',
'Запросите в регистратуре вашего университета. Может потребоваться апостиль, если диплом получен за пределами ЕС.',
'1-4 weeks', '€20-50', 2, true, 'graduation-cap'),

('germany', 'academic_records', 'Academic Transcript', 'Expediente Académico', 'Akademische Leistungsübersicht', 'Relevé de Notes', 'Академическая справка',
'Complete record of your medical studies including all courses and grades',
'Registro completo de tus estudios de medicina incluyendo todos los cursos y calificaciones',
'Vollständige Aufzeichnung Ihrer medizinischen Studien einschließlich aller Kurse und Noten',
'Dossier complet de vos études médicales incluant tous les cours et notes',
'Полная запись о вашем медицинском образовании, включая все курсы и оценки',
'Upload your complete academic transcript showing all courses, grades, and credit hours throughout your medical education.',
'Sube tu expediente académico completo mostrando todos los cursos, calificaciones y horas de crédito durante tu educación médica.',
'Laden Sie Ihr vollständiges akademisches Zeugnis hoch, das alle Kurse, Noten und Kreditstunden während Ihrer medizinischen Ausbildung zeigt.',
'Téléchargez votre relevé de notes complet montrant tous les cours, notes et heures de crédit tout au long de votre formation médicale.',
'Загрузите полную академическую справку со всеми курсами, оценками и кредитными часами за время медицинского образования.',
'Request from your university''s academic records office. Processing time varies by institution.',
'Solicítalo en la oficina de expedientes académicos de tu universidad. El tiempo de procesamiento varía según la institución.',
'Beantragen Sie es bei der Abteilung für akademische Aufzeichnungen Ihrer Universität. Die Bearbeitungszeit variiert je nach Institution.',
'Demandez au bureau des dossiers académiques de votre université. Le délai de traitement varie selon l''institution.',
'Запросите в отделе академических записей вашего университета. Время обработки зависит от учреждения.',
'1-3 weeks', '€10-30', 3, true, 'file-text'),

('germany', 'curriculum', 'Degree Curriculum', 'Plan de Estudios', 'Studienplan', 'Programme d''Études', 'Учебный план',
'Official curriculum showing all subjects and hours of your medical degree',
'Currículo oficial mostrando todas las materias y horas de tu carrera de medicina',
'Offizieller Lehrplan mit allen Fächern und Stunden Ihres Medizinstudiums',
'Programme officiel montrant toutes les matières et heures de votre diplôme de médecine',
'Официальная программа, показывающая все предметы и часы вашей медицинской степени',
'Upload the official curriculum or study plan from your university that details all subjects studied, practical hours, and theoretical hours.',
'Sube el currículo oficial o plan de estudios de tu universidad que detalle todas las materias estudiadas, horas prácticas y horas teóricas.',
'Laden Sie den offiziellen Lehrplan oder Studienplan Ihrer Universität hoch, der alle studierten Fächer, praktischen Stunden und theoretischen Stunden auflistet.',
'Téléchargez le programme officiel ou le plan d''études de votre université détaillant toutes les matières étudiées, les heures pratiques et théoriques.',
'Загрузите официальную программу или учебный план из вашего университета с подробным описанием всех изученных предметов, практических и теоретических часов.',
'Available from your university''s faculty office or academic department.',
'Disponible en la facultad de tu universidad o departamento académico.',
'Erhältlich bei der Fakultät Ihrer Universität oder der akademischen Abteilung.',
'Disponible auprès du bureau de la faculté ou du département académique de votre université.',
'Доступно в деканате или учебном отделе вашего университета.',
'1-2 weeks', '€5-20', 4, true, 'book-open'),

('germany', 'apostille', 'Apostille', 'Apostilla', 'Apostille', 'Apostille', 'Апостиль',
'Official apostille stamp on your diploma for international recognition',
'Sello oficial de apostilla en tu diploma para reconocimiento internacional',
'Offizieller Apostillenstempel auf Ihrem Diplom für internationale Anerkennung',
'Tampon officiel d''apostille sur votre diplôme pour la reconnaissance internationale',
'Официальный апостиль на вашем дипломе для международного признания',
'Upload your diploma with the apostille stamp/certificate attached. The apostille must be clearly visible and legible.',
'Sube tu diploma con el sello/certificado de apostilla adjunto. La apostilla debe ser claramente visible y legible.',
'Laden Sie Ihr Diplom mit dem angehängten Apostillenstempel/-zertifikat hoch. Die Apostille muss deutlich sichtbar und lesbar sein.',
'Téléchargez votre diplôme avec le tampon/certificat d''apostille joint. L''apostille doit être clairement visible et lisible.',
'Загрузите диплом с прикрепленным штампом/сертификатом апостиля. Апостиль должен быть четко виден и читаем.',
'Apply through your country''s designated authority (usually Ministry of Foreign Affairs or Justice). Takes 1-4 weeks.',
'Solicítalo a través de la autoridad designada de tu país (generalmente Ministerio de Relaciones Exteriores o Justicia). Tarda 1-4 semanas.',
'Beantragen Sie es über die zuständige Behörde Ihres Landes (normalerweise Außen- oder Justizministerium). Dauert 1-4 Wochen.',
'Faites une demande auprès de l''autorité désignée de votre pays (généralement Ministère des Affaires étrangères ou de la Justice). Prend 1 à 4 semaines.',
'Подайте заявление через уполномоченный орган вашей страны (обычно МИД или Министерство юстиции). Занимает 1-4 недели.',
'1-4 weeks', '€20-100', 5, true, 'stamp'),

('germany', 'language_certificate', 'German Language Certificate', 'Certificado de Alemán', 'Deutsches Sprachzertifikat', 'Certificat d''Allemand', 'Сертификат немецкого языка',
'B2 or higher German language certificate (Goethe, telc, TestDaF)',
'Certificado de alemán B2 o superior (Goethe, telc, TestDaF)',
'Deutsches Sprachzertifikat B2 oder höher (Goethe, telc, TestDaF)',
'Certificat d''allemand B2 ou supérieur (Goethe, telc, TestDaF)',
'Сертификат немецкого языка B2 или выше (Goethe, telc, TestDaF)',
'Upload your German language certificate (minimum B2 level). Accepted certificates: Goethe-Zertifikat, telc Deutsch, TestDaF.',
'Sube tu certificado de alemán (nivel mínimo B2). Certificados aceptados: Goethe-Zertifikat, telc Deutsch, TestDaF.',
'Laden Sie Ihr deutsches Sprachzertifikat hoch (mindestens B2). Akzeptierte Zertifikate: Goethe-Zertifikat, telc Deutsch, TestDaF.',
'Téléchargez votre certificat d''allemand (niveau minimum B2). Certificats acceptés: Goethe-Zertifikat, telc Deutsch, TestDaF.',
'Загрузите сертификат немецкого языка (минимум B2). Принимаются: Goethe-Zertifikat, telc Deutsch, TestDaF.',
'Register for an exam at authorized test centers. Goethe-Institut and telc offer exams worldwide. Preparation typically takes 3-6 months.',
'Regístrate para un examen en centros autorizados. Goethe-Institut y telc ofrecen exámenes en todo el mundo. La preparación típicamente toma 3-6 meses.',
'Melden Sie sich zu einer Prüfung bei autorisierten Testzentren an. Goethe-Institut und telc bieten Prüfungen weltweit an. Die Vorbereitung dauert in der Regel 3-6 Monate.',
'Inscrivez-vous à un examen dans les centres agréés. Le Goethe-Institut et telc proposent des examens dans le monde entier. La préparation prend généralement 3 à 6 mois.',
'Зарегистрируйтесь на экзамен в авторизованных центрах. Goethe-Institut и telc проводят экзамены по всему миру. Подготовка обычно занимает 3-6 месяцев.',
'3-6 months', '€150-300', 6, false, 'languages');

-- Create trigger for updated_at
CREATE TRIGGER update_document_requirements_updated_at
BEFORE UPDATE ON public.document_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_documents_updated_at
BEFORE UPDATE ON public.client_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();