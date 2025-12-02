-- Delete the separate Apostille document (apostille info should be in individual document instructions)
DELETE FROM document_requirements WHERE document_type = 'apostille' AND country = 'germany';

-- Update Medical Diploma to include translation and apostille requirement
UPDATE document_requirements 
SET 
  description_en = 'Your official medical degree certificate from your university. Must be translated by a certified translator and apostilled.',
  description_de = 'Ihr offizielles Medizindiplom von Ihrer Universität. Muss von einem vereidigten Übersetzer übersetzt und mit Apostille versehen werden.',
  description_es = 'Su título oficial de medicina de su universidad. Debe ser traducido por un traductor certificado y apostillado.',
  description_fr = 'Votre diplôme de médecine officiel de votre université. Doit être traduit par un traducteur assermenté et apostillé.',
  description_ru = 'Ваш официальный диплом врача из университета. Должен быть переведен сертифицированным переводчиком и апостилирован.',
  instructions_en = 'Upload your original diploma or a certified copy. The document must show your full name, degree title, and date of graduation. After obtaining, have it translated by a certified translator, then get an apostille.',
  instructions_de = 'Laden Sie Ihr Originaldiplom oder eine beglaubigte Kopie hoch. Das Dokument muss Ihren vollständigen Namen, den Studienabschluss und das Abschlussdatum enthalten. Lassen Sie es von einem vereidigten Übersetzer übersetzen und dann apostillieren.',
  instructions_es = 'Suba su diploma original o una copia certificada. El documento debe mostrar su nombre completo, título obtenido y fecha de graduación. Después de obtenerlo, hágalo traducir por un traductor certificado y luego apostillar.',
  instructions_fr = 'Téléchargez votre diplôme original ou une copie certifiée. Le document doit indiquer votre nom complet, le titre du diplôme et la date de graduation. Faites-le traduire par un traducteur assermenté, puis apostiller.',
  instructions_ru = 'Загрузите оригинал диплома или заверенную копию. Документ должен содержать ваше полное имя, название степени и дату выпуска. После получения переведите у сертифицированного переводчика, затем получите апостиль.'
WHERE document_type = 'diploma' AND country = 'germany';

-- Restructure priority order logically by category:
-- Personal Documents: 1-3
-- Academic/Title Documents: 4-8
-- Professional Documents: 9-10
-- Regulatory Documents: 11-13 (time-sensitive last)
-- Language: 14

-- 1. Passport (Personal)
UPDATE document_requirements SET priority_order = 1 WHERE document_type = 'passport' AND country = 'germany';

-- 2. Birth Certificate (Personal)
UPDATE document_requirements SET priority_order = 2 WHERE document_type = 'birth_certificate' AND country = 'germany';

-- 3. Marriage Certificate (Personal)
UPDATE document_requirements SET priority_order = 3 WHERE document_type = 'marriage_certificate' AND country = 'germany';

-- 4. Medical Diploma (Academic)
UPDATE document_requirements SET priority_order = 4 WHERE document_type = 'diploma' AND country = 'germany';

-- 5. Diploma Supplement (Academic)
UPDATE document_requirements SET priority_order = 5 WHERE document_type = 'diploma_supplement' AND country = 'germany';

-- 6. Academic Transcript (Academic)
UPDATE document_requirements SET priority_order = 6 WHERE document_type = 'academic_records' AND country = 'germany';

-- 7. Degree Curriculum (Academic)
UPDATE document_requirements SET priority_order = 7 WHERE document_type = 'curriculum' AND country = 'germany';

-- 8. Internship/Clinical Rotations Certificates (Academic)
UPDATE document_requirements SET priority_order = 8 WHERE document_type = 'internship_certificates' AND country = 'germany';

-- 9. CV - Signed (Professional)
UPDATE document_requirements SET priority_order = 9 WHERE document_type = 'cv_signed' AND country = 'germany';

-- 10. Employment Certificates (Professional)
UPDATE document_requirements SET priority_order = 10 WHERE document_type = 'employment_certificates' AND country = 'germany';

-- 11. Medical License (Regulatory)
UPDATE document_requirements SET priority_order = 11 WHERE document_type = 'medical_license' AND country = 'germany';

-- 12. Certificate of Good Standing (Regulatory - time-sensitive)
UPDATE document_requirements SET priority_order = 12 WHERE document_type = 'good_standing' AND country = 'germany';

-- 13. Criminal Record Certificate (Regulatory - time-sensitive)
UPDATE document_requirements SET priority_order = 13 WHERE document_type = 'criminal_record' AND country = 'germany';

-- 14. Language Certificate (Language)
UPDATE document_requirements SET priority_order = 14 WHERE document_type = 'language_certificate' AND country = 'germany';