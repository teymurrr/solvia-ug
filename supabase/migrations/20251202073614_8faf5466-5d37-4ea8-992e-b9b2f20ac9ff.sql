-- Add missing document requirements for German homologation process
-- These documents are essential for the Approbation (medical license) recognition

-- 1. Curriculum Vitae (CV) - signed physically by the doctor
INSERT INTO document_requirements (
  country, document_type, document_name_en, document_name_de, document_name_es, document_name_fr, document_name_ru,
  description_en, description_de, description_es, description_fr, description_ru,
  instructions_en, instructions_de, instructions_es, instructions_fr, instructions_ru,
  how_to_obtain_en, how_to_obtain_de, how_to_obtain_es, how_to_obtain_fr, how_to_obtain_ru,
  estimated_time, estimated_cost, icon, is_required, priority_order
) VALUES (
  'germany', 'cv_signed', 
  'Curriculum Vitae (CV) - Signed', 
  'Lebenslauf - Eigenhändig unterschrieben',
  'Currículum Vitae (CV) - Firmado',
  'Curriculum Vitae (CV) - Signé',
  'Резюме (CV) - С подписью',
  'A tabular CV with your complete professional and educational history, physically signed by you',
  'Ein tabellarischer Lebenslauf mit Ihrer vollständigen beruflichen und schulischen Laufbahn, eigenhändig von Ihnen unterschrieben',
  'Un CV tabular con tu historial profesional y educativo completo, firmado físicamente por ti',
  'Un CV tabulaire avec votre parcours professionnel et éducatif complet, signé physiquement par vous',
  'Табличное резюме с полной профессиональной и образовательной историей, подписанное вами лично',
  'Upload a clear scan of your CV in tabular format. Must include: personal data, education (with dates), work experience (with dates), language skills, and your PHYSICAL SIGNATURE at the bottom. German authorities require the original signature to verify authenticity.',
  'Laden Sie einen klaren Scan Ihres tabellarischen Lebenslaufs hoch. Muss enthalten: persönliche Daten, Ausbildung (mit Daten), Berufserfahrung (mit Daten), Sprachkenntnisse und Ihre EIGENHÄNDIGE UNTERSCHRIFT am Ende. Deutsche Behörden verlangen die Originalunterschrift zur Authentizitätsprüfung.',
  'Sube un escaneo claro de tu CV en formato tabular. Debe incluir: datos personales, educación (con fechas), experiencia laboral (con fechas), idiomas, y tu FIRMA FÍSICA al final. Las autoridades alemanas requieren la firma original para verificar autenticidad.',
  'Téléchargez un scan clair de votre CV au format tabulaire. Doit inclure: données personnelles, formation (avec dates), expérience professionnelle (avec dates), compétences linguistiques, et votre SIGNATURE PHYSIQUE en bas. Les autorités allemandes exigent la signature originale pour vérifier l''authenticité.',
  'Загрузите четкий скан резюме в табличном формате. Должно содержать: личные данные, образование (с датами), опыт работы (с датами), языковые навыки и вашу ЛИЧНУЮ ПОДПИСЬ внизу. Немецкие власти требуют оригинальную подпись для проверки подлинности.',
  'Print your CV, sign it by hand with blue or black ink, then scan it. Use tabular (table) format, not narrative style. Include all periods without gaps.',
  'Drucken Sie Ihren Lebenslauf aus, unterschreiben Sie ihn per Hand mit blauer oder schwarzer Tinte und scannen Sie ihn dann. Verwenden Sie tabellarisches Format, keinen Fließtext. Alle Zeiträume lückenlos angeben.',
  'Imprime tu CV, fírmalo a mano con tinta azul o negra, luego escanéalo. Usa formato tabular (tabla), no narrativo. Incluye todos los períodos sin vacíos.',
  'Imprimez votre CV, signez-le à la main avec de l''encre bleue ou noire, puis numérisez-le. Utilisez le format tabulaire (tableau), pas narratif. Incluez toutes les périodes sans lacunes.',
  'Распечатайте резюме, подпишите его от руки синими или черными чернилами, затем отсканируйте. Используйте табличный формат, а не повествовательный. Включите все периоды без пробелов.',
  '1-2 days', 'Free', 'file-signature', true, 7
);

-- 2. Internship/Rotations Certificates (optional but important)
INSERT INTO document_requirements (
  country, document_type, document_name_en, document_name_de, document_name_es, document_name_fr, document_name_ru,
  description_en, description_de, description_es, description_fr, description_ru,
  instructions_en, instructions_de, instructions_es, instructions_fr, instructions_ru,
  how_to_obtain_en, how_to_obtain_de, how_to_obtain_es, how_to_obtain_fr, how_to_obtain_ru,
  estimated_time, estimated_cost, icon, is_required, priority_order
) VALUES (
  'germany', 'internship_certificates', 
  'Internship / Clinical Rotations Certificates', 
  'Praktikums- / Famulatur-Bescheinigungen',
  'Certificados de Prácticas / Rotaciones Clínicas',
  'Certificats de Stage / Rotations Cliniques',
  'Сертификаты о практике / клинических ротациях',
  'Certificates proving your clinical rotations and practical training during medical studies',
  'Bescheinigungen über Ihre klinischen Rotationen und praktische Ausbildung während des Medizinstudiums',
  'Certificados que demuestran tus rotaciones clínicas y formación práctica durante los estudios de medicina',
  'Certificats prouvant vos rotations cliniques et votre formation pratique pendant les études de médecine',
  'Сертификаты, подтверждающие ваши клинические ротации и практическую подготовку во время учебы',
  'Upload certificates from each clinical rotation/internship. Each should show: hospital/clinic name, department (e.g., Surgery, Internal Medicine), duration (start and end dates), and supervisor signature. These prove your hands-on clinical experience.',
  'Laden Sie Bescheinigungen von jeder klinischen Rotation/Famulatur hoch. Jede sollte zeigen: Krankenhaus-/Klinikname, Abteilung (z.B. Chirurgie, Innere Medizin), Dauer (Anfangs- und Enddatum) und Unterschrift des Betreuers. Diese belegen Ihre praktische klinische Erfahrung.',
  'Sube certificados de cada rotación clínica/práctica. Cada uno debe mostrar: nombre del hospital/clínica, departamento (ej. Cirugía, Medicina Interna), duración (fechas de inicio y fin), y firma del supervisor. Estos prueban tu experiencia clínica práctica.',
  'Téléchargez les certificats de chaque rotation/stage clinique. Chacun doit montrer: nom de l''hôpital/clinique, département (ex. Chirurgie, Médecine Interne), durée (dates de début et fin), et signature du superviseur. Ceux-ci prouvent votre expérience clinique pratique.',
  'Загрузите сертификаты о каждой клинической ротации/практике. Каждый должен содержать: название больницы/клиники, отделение (напр. Хирургия, Терапия), продолжительность (даты начала и окончания) и подпись руководителя. Они подтверждают ваш практический клинический опыт.',
  'Request from the hospitals/clinics where you completed rotations. Contact their medical education or HR department. If you cannot obtain them, request a letter from your university confirming your clinical rotations.',
  'Beantragen Sie diese bei den Krankenhäusern/Kliniken, wo Sie Ihre Rotationen absolviert haben. Kontaktieren Sie deren Ausbildungsabteilung oder Personalabteilung. Falls nicht erhältlich, bitten Sie Ihre Universität um eine Bestätigung der klinischen Rotationen.',
  'Solicítalos en los hospitales/clínicas donde completaste las rotaciones. Contacta su departamento de educación médica o RRHH. Si no puedes obtenerlos, solicita una carta de tu universidad confirmando tus rotaciones clínicas.',
  'Demandez aux hôpitaux/cliniques où vous avez effectué les rotations. Contactez leur département de formation médicale ou RH. Si impossible, demandez une lettre de votre université confirmant vos rotations cliniques.',
  'Запросите в больницах/клиниках, где вы проходили ротации. Свяжитесь с их отделом медицинского образования или отделом кадров. Если не удается получить, запросите письмо из университета, подтверждающее ваши клинические ротации.',
  '2-4 weeks', '€10-50 per certificate', 'stethoscope', false, 8
);

-- 3. Employment Certificates (optional but strongly recommended)
INSERT INTO document_requirements (
  country, document_type, document_name_en, document_name_de, document_name_es, document_name_fr, document_name_ru,
  description_en, description_de, description_es, description_fr, description_ru,
  instructions_en, instructions_de, instructions_es, instructions_fr, instructions_ru,
  how_to_obtain_en, how_to_obtain_de, how_to_obtain_es, how_to_obtain_fr, how_to_obtain_ru,
  estimated_time, estimated_cost, icon, is_required, priority_order
) VALUES (
  'germany', 'employment_certificates', 
  'Employment Certificates (Arbeitszeugnisse)', 
  'Arbeitszeugnisse',
  'Certificados de Trabajo',
  'Certificats de Travail',
  'Трудовые сертификаты',
  'Official employment certificates from all medical positions held after graduation - strongly recommended',
  'Offizielle Arbeitszeugnisse von allen medizinischen Positionen nach dem Studium - dringend empfohlen',
  'Certificados de trabajo oficiales de todas las posiciones médicas después de la graduación - muy recomendado',
  'Certificats de travail officiels de tous les postes médicaux après l''obtention du diplôme - fortement recommandé',
  'Официальные трудовые сертификаты со всех медицинских должностей после выпуска - настоятельно рекомендуется',
  'Upload employment certificates from each hospital/clinic where you worked as a doctor. These should include: employer name, your position/title, department, employment period (exact dates), main responsibilities, and employer signature/stamp. These strengthen your application significantly.',
  'Laden Sie Arbeitszeugnisse von jedem Krankenhaus/jeder Klinik hoch, wo Sie als Arzt gearbeitet haben. Diese sollten enthalten: Arbeitgebername, Ihre Position/Titel, Abteilung, Beschäftigungszeitraum (genaue Daten), Hauptaufgaben und Unterschrift/Stempel des Arbeitgebers. Diese stärken Ihre Bewerbung erheblich.',
  'Sube certificados de trabajo de cada hospital/clínica donde trabajaste como médico. Deben incluir: nombre del empleador, tu posición/título, departamento, período de empleo (fechas exactas), responsabilidades principales, y firma/sello del empleador. Estos fortalecen significativamente tu solicitud.',
  'Téléchargez les certificats de travail de chaque hôpital/clinique où vous avez travaillé comme médecin. Ceux-ci doivent inclure: nom de l''employeur, votre poste/titre, département, période d''emploi (dates exactes), responsabilités principales, et signature/cachet de l''employeur. Ceux-ci renforcent considérablement votre candidature.',
  'Загрузите трудовые сертификаты из каждой больницы/клиники, где вы работали врачом. Они должны включать: название работодателя, вашу должность, отделение, период работы (точные даты), основные обязанности и подпись/печать работодателя. Это значительно усиливает вашу заявку.',
  'Request from the HR department of each hospital/clinic where you worked. In Germany, employers are legally required to provide "Arbeitszeugnisse". Allow 2-4 weeks for processing. Keep copies of all certificates.',
  'Beantragen Sie diese bei der Personalabteilung jedes Krankenhauses/jeder Klinik, wo Sie gearbeitet haben. In Deutschland sind Arbeitgeber gesetzlich verpflichtet, Arbeitszeugnisse auszustellen. Planen Sie 2-4 Wochen für die Bearbeitung ein. Bewahren Sie Kopien aller Zeugnisse auf.',
  'Solicítalos al departamento de RRHH de cada hospital/clínica donde trabajaste. En Alemania, los empleadores están legalmente obligados a proporcionar "Arbeitszeugnisse". Planifica 2-4 semanas para el procesamiento. Guarda copias de todos los certificados.',
  'Demandez au département RH de chaque hôpital/clinique où vous avez travaillé. En Allemagne, les employeurs sont légalement tenus de fournir des "Arbeitszeugnisse". Prévoyez 2-4 semaines pour le traitement. Conservez des copies de tous les certificats.',
  'Запросите в отделе кадров каждой больницы/клиники, где вы работали. В Германии работодатели обязаны по закону предоставлять "Arbeitszeugnisse". Планируйте 2-4 недели на обработку. Сохраняйте копии всех сертификатов.',
  '2-4 weeks', 'Usually free', 'briefcase-medical', false, 9
);

-- 4. Certificate of Good Standing (required, time-sensitive)
INSERT INTO document_requirements (
  country, document_type, document_name_en, document_name_de, document_name_es, document_name_fr, document_name_ru,
  description_en, description_de, description_es, description_fr, description_ru,
  instructions_en, instructions_de, instructions_es, instructions_fr, instructions_ru,
  how_to_obtain_en, how_to_obtain_de, how_to_obtain_es, how_to_obtain_fr, how_to_obtain_ru,
  estimated_time, estimated_cost, icon, is_required, priority_order
) VALUES (
  'germany', 'good_standing', 
  'Certificate of Good Standing', 
  'Unbedenklichkeitsbescheinigung / Certificate of Good Standing',
  'Certificado de Buena Conducta Profesional',
  'Certificat de Bonne Conduite Professionnelle',
  'Сертификат о профессиональной репутации',
  'Official certificate confirming you are in good standing with your medical licensing authority - MUST BE LESS THAN 3 MONTHS OLD when submitting',
  'Offizielle Bescheinigung, dass Sie bei Ihrer ärztlichen Zulassungsbehörde in gutem Ansehen stehen - DARF BEI EINREICHUNG NICHT ÄLTER ALS 3 MONATE SEIN',
  'Certificado oficial que confirma que estás en buena situación con tu autoridad de licencias médicas - DEBE TENER MENOS DE 3 MESES al presentar',
  'Certificat officiel confirmant que vous êtes en règle auprès de votre autorité médicale - DOIT AVOIR MOINS DE 3 MOIS lors de la soumission',
  'Официальный сертификат, подтверждающий вашу хорошую репутацию в органе медицинского лицензирования - ДОЛЖЕН БЫТЬ НЕ СТАРШЕ 3 МЕСЯЦЕВ при подаче',
  'This certificate proves you have no disciplinary actions, license suspensions, or ongoing investigations. ⚠️ IMPORTANT: This document expires quickly! Only request it when you are ready to submit your complete application. The certificate must show: your name, license/registration number, confirmation of good standing, issuing authority, and issue date.',
  'Diese Bescheinigung beweist, dass keine Disziplinarmaßnahmen, Lizenzsperrungen oder laufende Ermittlungen gegen Sie vorliegen. ⚠️ WICHTIG: Dieses Dokument verfällt schnell! Beantragen Sie es erst, wenn Sie bereit sind, Ihre vollständige Bewerbung einzureichen. Die Bescheinigung muss enthalten: Ihren Namen, Lizenz-/Registrierungsnummer, Bestätigung des guten Rufs, ausstellende Behörde und Ausstellungsdatum.',
  'Este certificado prueba que no tienes acciones disciplinarias, suspensiones de licencia ni investigaciones en curso. ⚠️ IMPORTANTE: ¡Este documento caduca rápidamente! Solo solicítalo cuando estés listo para enviar tu solicitud completa. El certificado debe mostrar: tu nombre, número de licencia/registro, confirmación de buena situación, autoridad emisora y fecha de emisión.',
  'Ce certificat prouve que vous n''avez aucune action disciplinaire, suspension de licence ou enquête en cours. ⚠️ IMPORTANT: Ce document expire rapidement! Ne le demandez que lorsque vous êtes prêt à soumettre votre candidature complète. Le certificat doit montrer: votre nom, numéro de licence/enregistrement, confirmation de bonne conduite, autorité émettrice et date d''émission.',
  'Этот сертификат подтверждает отсутствие дисциплинарных взысканий, приостановок лицензии или текущих расследований. ⚠️ ВАЖНО: Этот документ быстро истекает! Запрашивайте его только когда готовы подать полную заявку. Сертификат должен содержать: ваше имя, номер лицензии/регистрации, подтверждение хорошей репутации, выдающий орган и дату выдачи.',
  'Request from your country''s Medical Council, Medical Chamber, or Health Ministry - whoever issued your medical license. Examples: General Medical Council (UK), Colegio de Médicos (Spain), Ordre des Médecins (France). ⏰ Get this LAST, right before submitting all documents!',
  'Beantragen Sie bei der Ärztekammer, dem Medizinischen Rat oder dem Gesundheitsministerium Ihres Landes - wer auch immer Ihre ärztliche Zulassung ausgestellt hat. ⏰ Holen Sie sich dies ZULETZT, kurz bevor Sie alle Dokumente einreichen!',
  'Solicítalo al Consejo Médico, Colegio de Médicos o Ministerio de Salud de tu país - quien haya emitido tu licencia médica. Ejemplos: Colegio de Médicos (España). ⏰ ¡Obtén esto AL FINAL, justo antes de enviar todos los documentos!',
  'Demandez à l''Ordre des Médecins, au Conseil Médical ou au Ministère de la Santé de votre pays - celui qui a délivré votre licence médicale. ⏰ Obtenez ceci EN DERNIER, juste avant de soumettre tous les documents!',
  'Запросите в Медицинском совете, Медицинской палате или Министерстве здравоохранения вашей страны - у того, кто выдал вашу медицинскую лицензию. ⏰ Получите это ПОСЛЕДНИМ, прямо перед подачей всех документов!',
  '1-4 weeks', '€20-100', 'shield-check', true, 10
);

-- 5. Criminal Record Certificate (required, time-sensitive)
INSERT INTO document_requirements (
  country, document_type, document_name_en, document_name_de, document_name_es, document_name_fr, document_name_ru,
  description_en, description_de, description_es, description_fr, description_ru,
  instructions_en, instructions_de, instructions_es, instructions_fr, instructions_ru,
  how_to_obtain_en, how_to_obtain_de, how_to_obtain_es, how_to_obtain_fr, how_to_obtain_ru,
  estimated_time, estimated_cost, icon, is_required, priority_order
) VALUES (
  'germany', 'criminal_record', 
  'Criminal Record Certificate (Police Clearance)', 
  'Polizeiliches Führungszeugnis',
  'Certificado de Antecedentes Penales',
  'Extrait de Casier Judiciaire',
  'Справка об отсутствии судимости',
  'Official police clearance certificate proving no criminal record - MUST BE LESS THAN 3 MONTHS OLD when submitting',
  'Offizielles polizeiliches Führungszeugnis ohne Einträge - DARF BEI EINREICHUNG NICHT ÄLTER ALS 3 MONATE SEIN',
  'Certificado oficial de antecedentes penales sin registros - DEBE TENER MENOS DE 3 MESES al presentar',
  'Extrait de casier judiciaire officiel sans mentions - DOIT AVOIR MOINS DE 3 MOIS lors de la soumission',
  'Официальная справка об отсутствии судимости - ДОЛЖНА БЫТЬ НЕ СТАРШЕ 3 МЕСЯЦЕВ при подаче',
  'This certificate is required for patient safety and is mandatory for medical license recognition. ⚠️ IMPORTANT: This document expires quickly! Only request it when you are ready to submit your complete application. The certificate must be issued by an official government authority.',
  'Dieses Zeugnis ist für die Patientensicherheit erforderlich und obligatorisch für die Anerkennung der ärztlichen Approbation. ⚠️ WICHTIG: Dieses Dokument verfällt schnell! Beantragen Sie es erst, wenn Sie bereit sind, Ihre vollständige Bewerbung einzureichen. Das Zeugnis muss von einer offiziellen Regierungsbehörde ausgestellt sein.',
  'Este certificado es necesario para la seguridad del paciente y es obligatorio para el reconocimiento de la licencia médica. ⚠️ IMPORTANTE: ¡Este documento caduca rápidamente! Solo solicítalo cuando estés listo para enviar tu solicitud completa. El certificado debe ser emitido por una autoridad gubernamental oficial.',
  'Ce certificat est requis pour la sécurité des patients et est obligatoire pour la reconnaissance de la licence médicale. ⚠️ IMPORTANT: Ce document expire rapidement! Ne le demandez que lorsque vous êtes prêt à soumettre votre candidature complète. Le certificat doit être délivré par une autorité gouvernementale officielle.',
  'Этот сертификат необходим для безопасности пациентов и обязателен для признания медицинской лицензии. ⚠️ ВАЖНО: Этот документ быстро истекает! Запрашивайте его только когда готовы подать полную заявку. Сертификат должен быть выдан официальным государственным органом.',
  'Request from your national police or justice ministry. Examples: DBS Check (UK), Certificado de Antecedentes Penales (Spain), Extrait B3 (France). For some countries, you may need to visit the police station in person. ⏰ Get this LAST, right before submitting all documents!',
  'Beantragen Sie beim Einwohnermeldeamt, online über das Bundesamt für Justiz (www.bundesjustizamt.de), oder bei der Polizei Ihres Heimatlandes. ⏰ Holen Sie sich dies ZULETZT, kurz bevor Sie alle Dokumente einreichen!',
  'Solicítalo en la comisaría de policía, ministerio de justicia, o en línea en algunos países. Ejemplos: Certificado de Antecedentes Penales del Ministerio de Justicia. ⏰ ¡Obtén esto AL FINAL, justo antes de enviar todos los documentos!',
  'Demandez auprès de la police nationale ou du ministère de la justice. Exemples: Extrait B3 du casier judiciaire (France). ⏰ Obtenez ceci EN DERNIER, juste avant de soumettre tous les documents!',
  'Запросите в национальной полиции или министерстве юстиции. В некоторых странах можно получить онлайн, в других нужно посетить отделение лично. ⏰ Получите это ПОСЛЕДНИМ, прямо перед подачей всех документов!',
  '1-4 weeks', '€10-50', 'file-warning', true, 11
);

-- 6. Birth Certificate (required)
INSERT INTO document_requirements (
  country, document_type, document_name_en, document_name_de, document_name_es, document_name_fr, document_name_ru,
  description_en, description_de, description_es, description_fr, description_ru,
  instructions_en, instructions_de, instructions_es, instructions_fr, instructions_ru,
  how_to_obtain_en, how_to_obtain_de, how_to_obtain_es, how_to_obtain_fr, how_to_obtain_ru,
  estimated_time, estimated_cost, icon, is_required, priority_order
) VALUES (
  'germany', 'birth_certificate', 
  'Birth Certificate', 
  'Geburtsurkunde',
  'Certificado de Nacimiento',
  'Acte de Naissance',
  'Свидетельство о рождении',
  'Official birth certificate for identity verification and establishing legal name',
  'Offizielle Geburtsurkunde zur Identitätsprüfung und Feststellung des rechtlichen Namens',
  'Certificado de nacimiento oficial para verificación de identidad y establecimiento del nombre legal',
  'Acte de naissance officiel pour vérification d''identité et établissement du nom légal',
  'Официальное свидетельство о рождении для подтверждения личности и установления юридического имени',
  'Upload a clear scan of your official birth certificate. If your name has changed (e.g., through marriage), also include the marriage certificate or official name change document. The birth certificate helps verify your identity and ensures your name matches across all documents.',
  'Laden Sie einen klaren Scan Ihrer offiziellen Geburtsurkunde hoch. Wenn sich Ihr Name geändert hat (z.B. durch Heirat), fügen Sie auch die Heiratsurkunde oder das offizielle Namensänderungsdokument bei. Die Geburtsurkunde hilft bei der Identitätsprüfung und stellt sicher, dass Ihr Name in allen Dokumenten übereinstimmt.',
  'Sube un escaneo claro de tu certificado de nacimiento oficial. Si tu nombre ha cambiado (ej. por matrimonio), incluye también el certificado de matrimonio o documento oficial de cambio de nombre. El certificado de nacimiento ayuda a verificar tu identidad y asegura que tu nombre coincida en todos los documentos.',
  'Téléchargez un scan clair de votre acte de naissance officiel. Si votre nom a changé (ex. par mariage), incluez également l''acte de mariage ou le document officiel de changement de nom. L''acte de naissance aide à vérifier votre identité et garantit que votre nom correspond sur tous les documents.',
  'Загрузите четкий скан официального свидетельства о рождении. Если ваше имя изменилось (напр. в браке), также приложите свидетельство о браке или официальный документ о смене имени. Свидетельство о рождении помогает подтвердить личность и обеспечивает совпадение имени во всех документах.',
  'Request from the civil registry office (Standesamt, Registro Civil, Mairie, ЗАГС) in your place of birth. If you already have the original, you can use a certified copy. May require apostille for non-EU documents.',
  'Beantragen Sie beim Standesamt Ihres Geburtsortes. Wenn Sie das Original bereits haben, können Sie eine beglaubigte Kopie verwenden. Für Dokumente aus Nicht-EU-Ländern kann eine Apostille erforderlich sein.',
  'Solicítalo en el Registro Civil de tu lugar de nacimiento. Si ya tienes el original, puedes usar una copia certificada. Puede requerir apostilla para documentos de fuera de la UE.',
  'Demandez à la mairie ou au service d''état civil de votre lieu de naissance. Si vous avez déjà l''original, vous pouvez utiliser une copie certifiée. Peut nécessiter une apostille pour les documents hors UE.',
  'Запросите в ЗАГСе по месту рождения. Если у вас есть оригинал, можете использовать заверенную копию. Может потребоваться апостиль для документов из стран вне ЕС.',
  '1-4 weeks', '€10-30', 'baby', true, 12
);