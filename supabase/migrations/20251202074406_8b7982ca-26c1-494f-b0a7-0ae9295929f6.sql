
-- Update Birth Certificate to be first in the list
UPDATE document_requirements 
SET priority_order = 1,
    description_en = 'Official birth certificate from your country of origin. Required for identity verification in the German medical license (Approbation) process. Must be translated and apostilled.',
    description_de = 'Offizielle Geburtsurkunde aus Ihrem Herkunftsland. Erforderlich zur Identitätsverifizierung im deutschen Approbationsverfahren. Muss übersetzt und apostilliert werden.',
    description_es = 'Certificado de nacimiento oficial de su país de origen. Requerido para la verificación de identidad en el proceso de licencia médica alemana (Approbation). Debe estar traducido y apostillado.',
    description_fr = 'Acte de naissance officiel de votre pays d''origine. Requis pour la vérification d''identité dans le processus de licence médicale allemande (Approbation). Doit être traduit et apostillé.',
    description_ru = 'Официальное свидетельство о рождении из вашей страны происхождения. Требуется для подтверждения личности в процессе получения немецкой медицинской лицензии (Approbation). Должно быть переведено и апостилировано.',
    instructions_en = 'Important: After obtaining the birth certificate, have it translated by a certified translator, then get an apostille. The apostille must be placed on the original document before translation, or on the translation depending on your country''s requirements.',
    instructions_de = 'Wichtig: Nach Erhalt der Geburtsurkunde lassen Sie diese von einem vereidigten Übersetzer übersetzen und dann apostillieren. Die Apostille muss je nach Anforderungen Ihres Landes auf dem Originaldokument oder der Übersetzung angebracht werden.',
    instructions_es = 'Importante: Después de obtener el certificado de nacimiento, hágalo traducir por un traductor certificado y luego obtenga una apostilla. La apostilla debe colocarse en el documento original o en la traducción según los requisitos de su país.',
    instructions_fr = 'Important : Après avoir obtenu l''acte de naissance, faites-le traduire par un traducteur assermenté, puis obtenez une apostille. L''apostille doit être apposée sur le document original ou sur la traduction selon les exigences de votre pays.',
    instructions_ru = 'Важно: После получения свидетельства о рождении сделайте его перевод у сертифицированного переводчика, затем получите апостиль. Апостиль должен быть поставлен на оригинале документа или на переводе в зависимости от требований вашей страны.'
WHERE country = 'germany' AND document_type = 'birth_certificate';

-- Add Marriage Certificate (if applicable)
INSERT INTO document_requirements (
    country, document_type, document_name_en, document_name_de, document_name_es, document_name_fr, document_name_ru,
    description_en, description_de, description_es, description_fr, description_ru,
    instructions_en, instructions_de, instructions_es, instructions_fr, instructions_ru,
    how_to_obtain_en, how_to_obtain_de, how_to_obtain_es, how_to_obtain_fr, how_to_obtain_ru,
    is_required, priority_order, estimated_time, estimated_cost, icon
) VALUES (
    'germany', 'marriage_certificate',
    'Marriage Certificate (if applicable)',
    'Heiratsurkunde (falls zutreffend)',
    'Certificado de Matrimonio (si aplica)',
    'Acte de Mariage (si applicable)',
    'Свидетельство о браке (при наличии)',
    'Official marriage certificate if you are married. Required if your current name differs from your birth certificate name. Must be translated and apostilled.',
    'Offizielle Heiratsurkunde, falls Sie verheiratet sind. Erforderlich, wenn Ihr aktueller Name von dem auf Ihrer Geburtsurkunde abweicht. Muss übersetzt und apostilliert werden.',
    'Certificado de matrimonio oficial si está casado/a. Requerido si su nombre actual difiere del nombre en su certificado de nacimiento. Debe estar traducido y apostillado.',
    'Acte de mariage officiel si vous êtes marié(e). Requis si votre nom actuel diffère de celui de votre acte de naissance. Doit être traduit et apostillé.',
    'Официальное свидетельство о браке, если вы состоите в браке. Требуется, если ваше текущее имя отличается от имени в свидетельстве о рождении. Должно быть переведено и апостилировано.',
    'Required if married and your name has changed. Have the certificate translated by a certified translator, then apostilled. Submit together with your birth certificate to show the name change chain.',
    'Erforderlich bei Heirat und Namensänderung. Lassen Sie die Urkunde von einem vereidigten Übersetzer übersetzen und dann apostillieren. Zusammen mit der Geburtsurkunde einreichen, um die Namensänderungskette nachzuweisen.',
    'Requerido si está casado/a y su nombre ha cambiado. Haga traducir el certificado por un traductor certificado y luego apostillarlo. Presente junto con su certificado de nacimiento para demostrar la cadena de cambio de nombre.',
    'Requis si marié(e) et votre nom a changé. Faites traduire le certificat par un traducteur assermenté, puis apostillé. Soumettez avec votre acte de naissance pour montrer la chaîne de changement de nom.',
    'Требуется при браке и изменении имени. Сделайте перевод свидетельства у сертифицированного переводчика, затем апостилируйте. Подайте вместе со свидетельством о рождении для подтверждения цепочки изменения имени.',
    'Request from the civil registry office (Standesamt) where you were married, or equivalent authority in your country.',
    'Beantragen Sie beim Standesamt, wo Sie geheiratet haben, oder bei der entsprechenden Behörde in Ihrem Land.',
    'Solicite en el registro civil donde se casó, o en la autoridad equivalente en su país.',
    'Demandez au bureau d''état civil où vous vous êtes marié(e), ou à l''autorité équivalente dans votre pays.',
    'Запросите в органе ЗАГС, где вы зарегистрировали брак, или в эквивалентном органе вашей страны.',
    false, 2, '1-2 weeks', '€10-30', 'Heart'
);

-- Update priorities for other documents to accommodate new order
UPDATE document_requirements SET priority_order = 3 WHERE country = 'germany' AND document_type = 'medical_diploma';
UPDATE document_requirements SET priority_order = 4 WHERE country = 'germany' AND document_type = 'medical_degree';
UPDATE document_requirements SET priority_order = 5 WHERE country = 'germany' AND document_type = 'transcript';
UPDATE document_requirements SET priority_order = 6 WHERE country = 'germany' AND document_type = 'syllabus';
UPDATE document_requirements SET priority_order = 7 WHERE country = 'germany' AND document_type = 'cv_signed';
UPDATE document_requirements SET priority_order = 8 WHERE country = 'germany' AND document_type = 'internship_certificates';
UPDATE document_requirements SET priority_order = 9 WHERE country = 'germany' AND document_type = 'employment_certificates';
UPDATE document_requirements SET priority_order = 10 WHERE country = 'germany' AND document_type = 'good_standing';
UPDATE document_requirements SET priority_order = 11 WHERE country = 'germany' AND document_type = 'criminal_record';
UPDATE document_requirements SET priority_order = 12 WHERE country = 'germany' AND document_type = 'passport';
UPDATE document_requirements SET priority_order = 13 WHERE country = 'germany' AND document_type = 'language_certificate';

-- Update Medical Diploma to mention apostille requirement (after translation)
UPDATE document_requirements 
SET instructions_en = 'Upload your original medical diploma. Must be certified/apostilled and translated into German by a certified translator. Note: First translate the document, then apostille both the original and translation.',
    instructions_de = 'Laden Sie Ihr Original-Medizindiplom hoch. Muss beglaubigt/apostilliert und von einem vereidigten Übersetzer ins Deutsche übersetzt sein. Hinweis: Erst übersetzen, dann Original und Übersetzung apostillieren.',
    instructions_es = 'Suba su diploma médico original. Debe estar certificado/apostillado y traducido al alemán por un traductor certificado. Nota: Primero traduzca el documento, luego apostille tanto el original como la traducción.',
    instructions_fr = 'Téléchargez votre diplôme médical original. Doit être certifié/apostillé et traduit en allemand par un traducteur assermenté. Note: D''abord traduire le document, puis apostiller l''original et la traduction.',
    instructions_ru = 'Загрузите оригинал медицинского диплома. Должен быть заверен/апостилирован и переведен на немецкий сертифицированным переводчиком. Примечание: Сначала переведите документ, затем апостилируйте оригинал и перевод.'
WHERE country = 'germany' AND document_type = 'medical_diploma';

-- Update Medical Degree Certificate
UPDATE document_requirements 
SET instructions_en = 'Upload your medical degree certificate. Must be apostilled and translated into German. Note: First translate, then apostille both documents.',
    instructions_de = 'Laden Sie Ihr Studienabschlusszeugnis hoch. Muss apostilliert und ins Deutsche übersetzt sein. Hinweis: Erst übersetzen, dann beide Dokumente apostillieren.',
    instructions_es = 'Suba su certificado de grado médico. Debe estar apostillado y traducido al alemán. Nota: Primero traduzca, luego apostille ambos documentos.',
    instructions_fr = 'Téléchargez votre certificat de diplôme médical. Doit être apostillé et traduit en allemand. Note: D''abord traduire, puis apostiller les deux documents.',
    instructions_ru = 'Загрузите сертификат о медицинской степени. Должен быть апостилирован и переведен на немецкий. Примечание: Сначала переведите, затем апостилируйте оба документа.'
WHERE country = 'germany' AND document_type = 'medical_degree';

-- Update Transcript of Records
UPDATE document_requirements 
SET instructions_en = 'Upload your complete transcript showing all courses, grades, and credit hours. Must be apostilled and translated into German.',
    instructions_de = 'Laden Sie Ihr vollständiges Transcript mit allen Kursen, Noten und Kreditstunden hoch. Muss apostilliert und ins Deutsche übersetzt sein.',
    instructions_es = 'Suba su expediente académico completo mostrando todos los cursos, calificaciones y horas de crédito. Debe estar apostillado y traducido al alemán.',
    instructions_fr = 'Téléchargez votre relevé de notes complet montrant tous les cours, notes et heures de crédit. Doit être apostillé et traduit en allemand.',
    instructions_ru = 'Загрузите полную выписку с оценками, показывающую все курсы, оценки и кредитные часы. Должна быть апостилирована и переведена на немецкий.'
WHERE country = 'germany' AND document_type = 'transcript';

-- Update University Syllabus
UPDATE document_requirements 
SET instructions_en = 'Upload the detailed syllabus/curriculum from your medical university. Must be apostilled and translated into German.',
    instructions_de = 'Laden Sie den detaillierten Lehrplan Ihrer medizinischen Universität hoch. Muss apostilliert und ins Deutsche übersetzt sein.',
    instructions_es = 'Suba el programa detallado de su universidad médica. Debe estar apostillado y traducido al alemán.',
    instructions_fr = 'Téléchargez le programme détaillé de votre université de médecine. Doit être apostillé et traduit en allemand.',
    instructions_ru = 'Загрузите подробную учебную программу вашего медицинского университета. Должна быть апостилирована и переведена на немецкий.'
WHERE country = 'germany' AND document_type = 'syllabus';

-- Update CV - explicitly mention NO apostille needed
UPDATE document_requirements 
SET instructions_en = 'Upload your CV in tabular format (tabellarischer Lebenslauf), signed physically by hand. No apostille required for this document.',
    instructions_de = 'Laden Sie Ihren tabellarischen Lebenslauf hoch, eigenhändig unterschrieben. Keine Apostille für dieses Dokument erforderlich.',
    instructions_es = 'Suba su CV en formato tabular (tabellarischer Lebenslauf), firmado físicamente a mano. No se requiere apostilla para este documento.',
    instructions_fr = 'Téléchargez votre CV au format tabulaire (tabellarischer Lebenslauf), signé physiquement à la main. Pas d''apostille requise pour ce document.',
    instructions_ru = 'Загрузите ваше резюме в табличном формате (tabellarischer Lebenslauf), подписанное собственноручно. Апостиль для этого документа не требуется.'
WHERE country = 'germany' AND document_type = 'cv_signed';

-- Update Internship Certificates
UPDATE document_requirements 
SET instructions_en = 'Upload certificates for all clinical rotations/internships during your medical education. Must be apostilled and translated into German.',
    instructions_de = 'Laden Sie Bescheinigungen für alle klinischen Rotationen/Praktika während Ihrer medizinischen Ausbildung hoch. Müssen apostilliert und ins Deutsche übersetzt sein.',
    instructions_es = 'Suba certificados de todas las rotaciones clínicas/pasantías durante su educación médica. Deben estar apostillados y traducidos al alemán.',
    instructions_fr = 'Téléchargez les certificats de tous les stages cliniques pendant votre formation médicale. Doivent être apostillés et traduits en allemand.',
    instructions_ru = 'Загрузите сертификаты всех клинических ротаций/стажировок во время вашего медицинского образования. Должны быть апостилированы и переведены на немецкий.'
WHERE country = 'germany' AND document_type = 'internship_certificates';

-- Update Employment Certificates
UPDATE document_requirements 
SET instructions_en = 'Upload employment certificates (Arbeitszeugnisse) from all previous medical positions. Must be apostilled and translated into German.',
    instructions_de = 'Laden Sie Arbeitszeugnisse von allen vorherigen medizinischen Positionen hoch. Müssen apostilliert und ins Deutsche übersetzt sein.',
    instructions_es = 'Suba certificados de empleo (Arbeitszeugnisse) de todas las posiciones médicas anteriores. Deben estar apostillados y traducidos al alemán.',
    instructions_fr = 'Téléchargez les certificats de travail de tous vos postes médicaux précédents. Doivent être apostillés et traduits en allemand.',
    instructions_ru = 'Загрузите трудовые сертификаты (Arbeitszeugnisse) со всех предыдущих медицинских должностей. Должны быть апостилированы и переведены на немецкий.'
WHERE country = 'germany' AND document_type = 'employment_certificates';

-- Update Good Standing Certificate
UPDATE document_requirements 
SET instructions_en = 'Upload your Certificate of Good Standing from the medical authority in your country. Must be apostilled and translated. ⚠️ Get this document last - must be less than 3 months old when submitted!',
    instructions_de = 'Laden Sie Ihre Unbedenklichkeitsbescheinigung der Ärztekammer Ihres Landes hoch. Muss apostilliert und übersetzt sein. ⚠️ Holen Sie dieses Dokument zuletzt - darf bei Einreichung nicht älter als 3 Monate sein!',
    instructions_es = 'Suba su Certificado de Buena Conducta de la autoridad médica de su país. Debe estar apostillado y traducido. ⚠️ Obtenga este documento al final - ¡debe tener menos de 3 meses al momento de presentarlo!',
    instructions_fr = 'Téléchargez votre Certificat de Bonne Conduite de l''autorité médicale de votre pays. Doit être apostillé et traduit. ⚠️ Obtenez ce document en dernier - doit avoir moins de 3 mois lors de la soumission!',
    instructions_ru = 'Загрузите сертификат о добропорядочности от медицинского органа вашей страны. Должен быть апостилирован и переведен. ⚠️ Получите этот документ последним - должен быть не старше 3 месяцев при подаче!'
WHERE country = 'germany' AND document_type = 'good_standing';

-- Update Criminal Record Certificate
UPDATE document_requirements 
SET instructions_en = 'Upload your criminal record certificate (police clearance). Must be apostilled and translated. ⚠️ Get this document last - must be less than 3 months old when submitted!',
    instructions_de = 'Laden Sie Ihr Führungszeugnis (polizeiliches Führungszeugnis) hoch. Muss apostilliert und übersetzt sein. ⚠️ Holen Sie dieses Dokument zuletzt - darf bei Einreichung nicht älter als 3 Monate sein!',
    instructions_es = 'Suba su certificado de antecedentes penales. Debe estar apostillado y traducido. ⚠️ Obtenga este documento al final - ¡debe tener menos de 3 meses al momento de presentarlo!',
    instructions_fr = 'Téléchargez votre extrait de casier judiciaire. Doit être apostillé et traduit. ⚠️ Obtenez ce document en dernier - doit avoir moins de 3 mois lors de la soumission!',
    instructions_ru = 'Загрузите справку о несудимости. Должна быть апостилирована и переведена. ⚠️ Получите этот документ последним - должен быть не старше 3 месяцев при подаче!'
WHERE country = 'germany' AND document_type = 'criminal_record';

-- Update Passport - explicitly mention NO apostille needed
UPDATE document_requirements 
SET instructions_en = 'Upload a clear copy of your valid passport showing your photo and personal details. No apostille or translation required.',
    instructions_de = 'Laden Sie eine deutliche Kopie Ihres gültigen Reisepasses mit Foto und persönlichen Daten hoch. Keine Apostille oder Übersetzung erforderlich.',
    instructions_es = 'Suba una copia clara de su pasaporte válido mostrando su foto y datos personales. No se requiere apostilla ni traducción.',
    instructions_fr = 'Téléchargez une copie claire de votre passeport valide montrant votre photo et vos données personnelles. Pas d''apostille ni de traduction requise.',
    instructions_ru = 'Загрузите четкую копию вашего действующего паспорта с фотографией и личными данными. Апостиль и перевод не требуются.'
WHERE country = 'germany' AND document_type = 'passport';

-- Update Language Certificate - explicitly mention NO apostille needed
UPDATE document_requirements 
SET instructions_en = 'Upload your German language certificate (minimum B2 level required). No apostille required - original certificate is sufficient.',
    instructions_de = 'Laden Sie Ihr Deutschzertifikat hoch (mindestens B2-Niveau erforderlich). Keine Apostille erforderlich - Originalzertifikat genügt.',
    instructions_es = 'Suba su certificado de idioma alemán (se requiere nivel mínimo B2). No se requiere apostilla - el certificado original es suficiente.',
    instructions_fr = 'Téléchargez votre certificat de langue allemande (niveau B2 minimum requis). Pas d''apostille requise - le certificat original suffit.',
    instructions_ru = 'Загрузите сертификат о знании немецкого языка (требуется минимум уровень B2). Апостиль не требуется - достаточно оригинала сертификата.'
WHERE country = 'germany' AND document_type = 'language_certificate';
