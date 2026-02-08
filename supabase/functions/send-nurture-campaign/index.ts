import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Language = 'es' | 'de' | 'en' | 'fr';

interface CampaignRequest {
  segment?: 'hot_leads' | 'germany_beginners' | 'advanced_speakers' | 'cold_leads' | 'all';
  templateId?: 'day0' | 'day1' | 'day3' | 'day5' | 'day7';
  testMode?: boolean;
  testEmail?: string;
  language?: Language; // Manual language override
}

interface Lead {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  target_country: string | null;
  study_country: string | null;
  doctor_type: string | null;
  language_level: string | null;
  email_sequence_day: number;
  preferred_language: string | null; // NEW: User's preferred language
}

// Latin American countries for Spanish language detection
const latAmCountries = [
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia', 
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico'
];

// Language detection based on preferred_language, study_country, and target_country
// Priority: preferred_language > study_country/target_country detection > 'en' fallback
const detectLeadLanguage = (lead: Lead): Language => {
  // 1. First, check if preferred_language is set (from browser or explicit choice)
  if (lead.preferred_language) {
    const pref = lead.preferred_language.toLowerCase();
    if (['es', 'de', 'en', 'fr'].includes(pref)) {
      console.log(`Using preferred_language for ${lead.email}: ${pref}`);
      return pref as Language;
    }
  }
  
  // 2. Fall back to auto-detection based on study_country and target_country
  const study = (lead.study_country || '').toLowerCase();
  const target = (lead.target_country || '').toLowerCase();
  
  // Spanish for Latin American leads
  if (latAmCountries.some(c => study.includes(c))) {
    console.log(`Auto-detected Spanish for ${lead.email} based on study_country: ${lead.study_country}`);
    return 'es';
  }
  if (study.includes('spain') || study.includes('españa')) return 'es';
  
  // German for Germany/Austria targets or origins
  if (target.includes('germany') || target.includes('alemania') || target.includes('deutschland')) return 'de';
  if (target.includes('austria') || target.includes('österreich')) return 'de';
  if (study.includes('germany') || study.includes('alemania') || study.includes('deutschland')) return 'de';
  if (study.includes('austria') || study.includes('österreich')) return 'de';
  
  // French for France targets
  if (target.includes('france') || target.includes('francia') || target.includes('frankreich')) return 'fr';
  if (study.includes('france') || study.includes('francia')) return 'fr';
  if (study.includes('algeria') || study.includes('argelia')) return 'fr';
  if (study.includes('morocco') || study.includes('marruecos')) return 'fr';
  
  // Default to English
  console.log(`Defaulting to English for ${lead.email}`);
  return 'en';
};

// Country name mapping for personalization (all 4 languages)
const countryNames: Record<string, Record<Language, string>> = {
  germany: { es: 'Alemania', en: 'Germany', de: 'Deutschland', fr: 'Allemagne' },
  alemania: { es: 'Alemania', en: 'Germany', de: 'Deutschland', fr: 'Allemagne' },
  deutschland: { es: 'Alemania', en: 'Germany', de: 'Deutschland', fr: 'Allemagne' },
  spain: { es: 'España', en: 'Spain', de: 'Spanien', fr: 'Espagne' },
  españa: { es: 'España', en: 'Spain', de: 'Spanien', fr: 'Espagne' },
  austria: { es: 'Austria', en: 'Austria', de: 'Österreich', fr: 'Autriche' },
  österreich: { es: 'Austria', en: 'Austria', de: 'Österreich', fr: 'Autriche' },
  france: { es: 'Francia', en: 'France', de: 'Frankreich', fr: 'France' },
  francia: { es: 'Francia', en: 'France', de: 'Frankreich', fr: 'France' },
  italy: { es: 'Italia', en: 'Italy', de: 'Italien', fr: 'Italie' },
  italia: { es: 'Italia', en: 'Italy', de: 'Italien', fr: 'Italie' },
  switzerland: { es: 'Suiza', en: 'Switzerland', de: 'Schweiz', fr: 'Suisse' },
};

// Profession mapping (all 4 languages)
const professionNames: Record<string, Record<Language, string>> = {
  general: { es: 'médico general', en: 'general practitioner', de: 'Allgemeinarzt/ärztin', fr: 'médecin généraliste' },
  specialist: { es: 'especialista', en: 'specialist', de: 'Facharzt/ärztin', fr: 'spécialiste' },
  nurse: { es: 'enfermero/a', en: 'nurse', de: 'Krankenpfleger/in', fr: 'infirmier/ère' },
  dentist: { es: 'dentista', en: 'dentist', de: 'Zahnarzt/ärztin', fr: 'dentiste' },
  other: { es: 'profesional de la salud', en: 'healthcare professional', de: 'Gesundheitsfachkraft', fr: 'professionnel de santé' },
};

// Timeline translations
const getTimeline = (languageLevel: string | null, lang: Language): string => {
  const level = languageLevel?.toLowerCase() || '';
  
  const timelines: Record<string, Record<Language, string>> = {
    fast: { es: '6-9 meses', en: '6-9 months', de: '6-9 Monate', fr: '6-9 mois' },
    medium: { es: '9-12 meses', en: '9-12 months', de: '9-12 Monate', fr: '9-12 mois' },
    normal: { es: '12-15 meses', en: '12-15 months', de: '12-15 Monate', fr: '12-15 mois' },
    slow: { es: '15-18 meses', en: '15-18 months', de: '15-18 Monate', fr: '15-18 mois' },
    slower: { es: '18-24 meses', en: '18-24 months', de: '18-24 Monate', fr: '18-24 mois' },
  };
  
  if (level.includes('mother') || level.includes('materna') || level.includes('c2')) return timelines.fast[lang];
  if (level.includes('c1')) return timelines.medium[lang];
  if (level.includes('b2')) return timelines.normal[lang];
  if (level.includes('b1')) return timelines.slow[lang];
  return timelines.slower[lang];
};

// Common UI translations
const uiStrings: Record<string, Record<Language, string>> = {
  hello: { es: '¡Hola', en: 'Hello', de: 'Hallo', fr: 'Bonjour' },
  yourSituation: { es: 'Tu situación actual', en: 'Your current situation', de: 'Deine aktuelle Situation', fr: 'Ta situation actuelle' },
  originCountry: { es: 'País de origen', en: 'Country of origin', de: 'Herkunftsland', fr: 'Pays d\'origine' },
  languageLevel: { es: 'Nivel de idioma', en: 'Language level', de: 'Sprachniveau', fr: 'Niveau de langue' },
  estimatedTime: { es: 'Tiempo estimado', en: 'Estimated time', de: 'Geschätzte Zeit', fr: 'Temps estimé' },
  goodNews: { es: 'La buena noticia', en: 'The good news', de: 'Die gute Nachricht', fr: 'La bonne nouvelle' },
  unlockPlan: { es: 'DESBLOQUEAR MI PLAN', en: 'UNLOCK MY PLAN', de: 'MEINEN PLAN FREISCHALTEN', fr: 'DÉBLOQUER MON PLAN' },
  spotsLeft: { es: 'Solo 23 spots disponibles a este precio', en: 'Only 23 spots available at this price', de: 'Nur 23 Plätze zu diesem Preis verfügbar', fr: 'Seulement 23 places disponibles à ce prix' },
  validUntil: { es: 'Oferta válida hasta el domingo', en: 'Offer valid until Sunday', de: 'Angebot gültig bis Sonntag', fr: 'Offre valable jusqu\'à dimanche' },
  warmRegards: { es: 'Un abrazo', en: 'Best regards', de: 'Herzliche Grüße', fr: 'Cordialement' },
  team: { es: 'Equipo Solvia', en: 'Team Solvia', de: 'Team Solvia', fr: 'Équipe Solvia' },
  unsubscribe: { es: 'Si no deseas recibir más emails, responde a este mensaje con "CANCELAR"', en: 'If you wish to unsubscribe, reply to this email with "UNSUBSCRIBE"', de: 'Wenn du keine weiteren E-Mails erhalten möchtest, antworte mit "ABMELDEN"', fr: 'Si tu ne souhaites plus recevoir d\'emails, réponds avec "DÉSABONNER"' },
  // Day 0 specific
  iSawAnalysis: { 
    es: 'Vi que completaste el análisis para trabajar como', 
    en: 'I saw you completed the analysis to work as', 
    de: 'Ich habe gesehen, dass du die Analyse abgeschlossen hast, um als', 
    fr: 'J\'ai vu que tu as complété l\'analyse pour travailler comme' 
  },
  inCountry: { es: 'en', en: 'in', de: 'in', fr: 'en' },
  toWorkAs: { es: '', en: '', de: 'zu arbeiten', fr: '' },
  thousandsWork: {
    es: 'Miles de médicos internacionales ya ejercen en',
    en: 'Thousands of international doctors already practice in',
    de: 'Tausende internationale Ärzte praktizieren bereits in',
    fr: 'Des milliers de médecins internationaux exercent déjà en'
  },
  clearProcess: {
    es: 'El proceso es claro, solo necesitas el roadmap correcto.',
    en: 'The process is clear, you just need the right roadmap.',
    de: 'Der Prozess ist klar, du brauchst nur die richtige Roadmap.',
    fr: 'Le processus est clair, tu as juste besoin de la bonne feuille de route.'
  },
  thisWeekOffer: {
    es: 'Esta semana, estamos ofreciendo nuestro paquete Digital Starter a solo €49 (precio normal €99) que incluye:',
    en: 'This week, we\'re offering our Digital Starter package for just €49 (regular price €99) which includes:',
    de: 'Diese Woche bieten wir unser Digital Starter-Paket für nur €49 an (Normalpreis €99), das enthält:',
    fr: 'Cette semaine, nous offrons notre pack Digital Starter à seulement €49 (prix normal €99) qui comprend:'
  },
  benefit1: {
    es: 'Lista de documentos personalizada para',
    en: 'Personalized document checklist for',
    de: 'Personalisierte Dokumentenliste für',
    fr: 'Liste de documents personnalisée pour'
  },
  benefit2: { es: 'Videos tutoriales paso a paso', en: 'Step-by-step tutorial videos', de: 'Schritt-für-Schritt-Videotutorials', fr: 'Tutoriels vidéo étape par étape' },
  benefit3: { es: 'Plantillas de formularios oficiales', en: 'Official form templates', de: 'Offizielle Formularvorlagen', fr: 'Modèles de formulaires officiels' },
  benefit4: { es: 'Soporte por email durante 30 días', en: '30-day email support', de: '30 Tage E-Mail-Support', fr: 'Support par email pendant 30 jours' },
  // Day 1 - Success story
  successStoryTitle: {
    es: 'Cómo María pasó de México a',
    en: 'How María went from Mexico to',
    de: 'Wie María von Mexiko nach',
    fr: 'Comment María est passée du Mexique à'
  },
  successStoryTitleEnd: { es: 'en 14 meses', en: 'in 14 months', de: 'in 14 Monaten kam', fr: 'en 14 mois' },
  todayShare: {
    es: 'Hoy quiero compartirte la historia de María, una médica general de Guadalajara que ahora trabaja en un hospital universitario en',
    en: 'Today I want to share the story of María, a general practitioner from Guadalajara who now works at a university hospital in',
    de: 'Heute möchte ich dir die Geschichte von María erzählen, einer Allgemeinärztin aus Guadalajara, die jetzt in einem Universitätsklinikum in',
    fr: 'Aujourd\'hui, je veux te partager l\'histoire de María, une médecin généraliste de Guadalajara qui travaille maintenant dans un hôpital universitaire en'
  },
  todayShareEnd: { es: '', en: '', de: 'arbeitet', fr: '' },
  mariaQuote: {
    es: 'Cuando empecé, pensé que tomaría años. Con el plan correcto y la documentación en orden, en 14 meses ya estaba ejerciendo.',
    en: 'When I started, I thought it would take years. With the right plan and proper documentation, in 14 months I was already practicing.',
    de: 'Als ich anfing, dachte ich, es würde Jahre dauern. Mit dem richtigen Plan und der richtigen Dokumentation praktizierte ich nach 14 Monaten bereits.',
    fr: 'Quand j\'ai commencé, je pensais que ça prendrait des années. Avec le bon plan et la bonne documentation, en 14 mois j\'exerçais déjà.'
  },
  herTimeline: { es: 'Su timeline', en: 'Her timeline', de: 'Ihr Zeitplan', fr: 'Son calendrier' },
  month: { es: 'Mes', en: 'Month', de: 'Monat', fr: 'Mois' },
  timeline1: { es: 'Recopilación de documentos y apostillas', en: 'Document collection and apostilles', de: 'Dokumentensammlung und Apostillen', fr: 'Collecte de documents et apostilles' },
  timeline2: { es: 'Curso intensivo de alemán (A1→B2)', en: 'Intensive German course (A1→B2)', de: 'Intensiver Deutschkurs (A1→B2)', fr: 'Cours intensif d\'allemand (A1→B2)' },
  timeline3: { es: 'Preparación FSP', en: 'FSP preparation', de: 'FSP-Vorbereitung', fr: 'Préparation FSP' },
  timeline4: { es: 'Examen FSP aprobado', en: 'FSP exam passed', de: 'FSP-Prüfung bestanden', fr: 'Examen FSP réussi' },
  timeline5: { es: 'Primer día de trabajo', en: 'First day of work', de: 'Erster Arbeitstag', fr: 'Premier jour de travail' },
  mariaUsed: {
    es: 'María usó exactamente el mismo plan que ahora ofrecemos en nuestro paquete Digital Starter.',
    en: 'María used exactly the same plan that we now offer in our Digital Starter package.',
    de: 'María verwendete genau denselben Plan, den wir jetzt in unserem Digital Starter-Paket anbieten.',
    fr: 'María a utilisé exactement le même plan que nous proposons maintenant dans notre pack Digital Starter.'
  },
  wantSameRoadmap: {
    es: '¿Quieres el mismo roadmap que usó María?',
    en: 'Want the same roadmap María used?',
    de: 'Willst du dieselbe Roadmap, die María verwendet hat?',
    fr: 'Tu veux la même feuille de route que María a utilisée?'
  },
  viewMyPlan: { es: 'VER MI PLAN PERSONALIZADO', en: 'VIEW MY PERSONALIZED PLAN', de: 'MEINEN PERSÖNLICHEN PLAN ANSEHEN', fr: 'VOIR MON PLAN PERSONNALISÉ' },
  // Day 3 - 3 Errors
  errorsTitle: { es: '3 errores que retrasan tu homologación (y cómo evitarlos)', en: '3 mistakes that delay your homologation (and how to avoid them)', de: '3 Fehler, die deine Approbation verzögern (und wie du sie vermeidest)', fr: '3 erreurs qui retardent ton homologation (et comment les éviter)' },
  costlyErrors: { es: '3 Errores Costosos', en: '3 Costly Mistakes', de: '3 kostspielige Fehler', fr: '3 erreurs coûteuses' },
  afterHelping: {
    es: 'Después de ayudar a cientos de médicos con su homologación en',
    en: 'After helping hundreds of doctors with their homologation in',
    de: 'Nachdem wir Hunderten von Ärzten bei ihrer Approbation in',
    fr: 'Après avoir aidé des centaines de médecins avec leur homologation en'
  },
  identifiedErrors: {
    es: 'hemos identificado 3 errores comunes que pueden retrasar tu proceso hasta 12 meses:',
    en: 'we\'ve identified 3 common mistakes that can delay your process by up to 12 months:',
    de: 'geholfen haben, haben wir 3 häufige Fehler identifiziert, die deinen Prozess um bis zu 12 Monate verzögern können:',
    fr: 'nous avons identifié 3 erreurs courantes qui peuvent retarder ton processus jusqu\'à 12 mois:'
  },
  error1Title: { es: 'Apostillar documentos incorrectamente', en: 'Apostilling documents incorrectly', de: 'Dokumente falsch apostillieren', fr: 'Apostiller les documents incorrectement' },
  error1Desc: {
    es: 'El 40% de los rechazos son por apostillas incorrectas o faltantes. Cada país tiene requisitos específicos que cambian constantemente.',
    en: '40% of rejections are due to incorrect or missing apostilles. Each country has specific requirements that constantly change.',
    de: '40% der Ablehnungen sind auf falsche oder fehlende Apostillen zurückzuführen. Jedes Land hat spezifische Anforderungen, die sich ständig ändern.',
    fr: '40% des rejets sont dus à des apostilles incorrectes ou manquantes. Chaque pays a des exigences spécifiques qui changent constamment.'
  },
  error2Title: { es: 'No validar traducciones antes de enviar', en: 'Not validating translations before sending', de: 'Übersetzungen vor dem Einreichen nicht validieren', fr: 'Ne pas valider les traductions avant l\'envoi' },
  error2Desc: {
    es: 'Una traducción rechazada significa 2-3 meses perdidos. Las traducciones deben seguir formatos específicos para cada Landesärztekammer.',
    en: 'A rejected translation means 2-3 months lost. Translations must follow specific formats for each Landesärztekammer.',
    de: 'Eine abgelehnte Übersetzung bedeutet 2-3 Monate Verzögerung. Übersetzungen müssen spezifische Formate für jede Landesärztekammer einhalten.',
    fr: 'Une traduction rejetée signifie 2-3 mois perdus. Les traductions doivent suivre des formats spécifiques pour chaque Landesärztekammer.'
  },
  error3Title: { es: 'Empezar el idioma sin un plan estructurado', en: 'Starting language without a structured plan', de: 'Mit dem Sprachkurs ohne strukturierten Plan beginnen', fr: 'Commencer la langue sans plan structuré' },
  error3Desc: {
    es: 'Muchos gastan €2,000+ en cursos que no los preparan para el B2 médico o el FSP. El orden y el enfoque importan.',
    en: 'Many spend €2,000+ on courses that don\'t prepare them for medical B2 or FSP. Order and focus matter.',
    de: 'Viele geben €2.000+ für Kurse aus, die sie nicht auf das medizinische B2 oder FSP vorbereiten. Reihenfolge und Fokus sind entscheidend.',
    fr: 'Beaucoup dépensent plus de 2 000€ en cours qui ne les préparent pas au B2 médical ou au FSP. L\'ordre et la concentration comptent.'
  },
  theSolution: { es: 'La solución', en: 'The solution', de: 'Die Lösung', fr: 'La solution' },
  packageIncludes: { es: 'Nuestro paquete Digital Starter incluye:', en: 'Our Digital Starter package includes:', de: 'Unser Digital Starter-Paket enthält:', fr: 'Notre pack Digital Starter comprend:' },
  apostilleChecklist: { es: 'Checklist de apostillas específico para', en: 'Apostille checklist specific to', de: 'Apostillen-Checkliste speziell für', fr: 'Liste de contrôle des apostilles spécifique à' },
  translationTemplates: { es: 'Plantillas de traducción pre-validadas', en: 'Pre-validated translation templates', de: 'Vorvalidierte Übersetzungsvorlagen', fr: 'Modèles de traduction pré-validés' },
  languagePlan: { es: 'Plan de estudio de idioma optimizado', en: 'Optimized language study plan', de: 'Optimierter Sprachlernplan', fr: 'Plan d\'étude de langue optimisé' },
  avoidErrors: { es: 'EVITAR ESTOS ERRORES', en: 'AVOID THESE MISTAKES', de: 'DIESE FEHLER VERMEIDEN', fr: 'ÉVITER CES ERREURS' },
  // Day 5 - Price increase
  priceIncrease: { es: 'el precio sube en 48 horas', en: 'price increases in 48 hours', de: 'Preiserhöhung in 48 Stunden', fr: 'le prix augmente dans 48 heures' },
  lastChance: { es: 'Última oportunidad', en: 'Last chance', de: 'Letzte Chance', fr: 'Dernière chance' },
  lastTimeSee: {
    es: 'Esta es la última vez que verás el paquete Digital Starter a €49.',
    en: 'This is the last time you\'ll see the Digital Starter package at €49.',
    de: 'Dies ist das letzte Mal, dass du das Digital Starter-Paket für €49 siehst.',
    fr: 'C\'est la dernière fois que tu verras le pack Digital Starter à 49€.'
  },
  priceGoesUp: { es: 'El precio sube en', en: 'Price increases in', de: 'Preiserhöhung in', fr: 'Le prix augmente dans' },
  hours48: { es: '48 HORAS', en: '48 HOURS', de: '48 STUNDEN', fr: '48 HEURES' },
  sundayBack: { es: 'El domingo a medianoche vuelve a €99', en: 'Sunday at midnight it goes back to €99', de: 'Sonntag um Mitternacht wieder €99', fr: 'Dimanche à minuit, retour à 99€' },
  yourTimelineFor: { es: 'Tu timeline para', en: 'Your timeline for', de: 'Dein Zeitplan für', fr: 'Ton calendrier pour' },
  estimatedTimeLabel: { es: 'Tiempo estimado', en: 'Estimated time', de: 'Geschätzte Zeit', fr: 'Temps estimé' },
  totalInvestment: { es: 'Inversión total estimada', en: 'Estimated total investment', de: 'Geschätzte Gesamtinvestition', fr: 'Investissement total estimé' },
  avgSalary: { es: 'Salario promedio en', en: 'Average salary in', de: 'Durchschnittsgehalt in', fr: 'Salaire moyen en' },
  for49Get: {
    es: 'Por €49, obtienes el roadmap exacto que te ahorrará meses de investigación y miles de euros en errores.',
    en: 'For €49, you get the exact roadmap that will save you months of research and thousands of euros in mistakes.',
    de: 'Für €49 erhältst du die exakte Roadmap, die dir Monate an Recherche und Tausende Euro an Fehlern erspart.',
    fr: 'Pour 49€, tu obtiens la feuille de route exacte qui te fera économiser des mois de recherche et des milliers d\'euros d\'erreurs.'
  },
  after: { es: 'DESPUÉS', en: 'AFTER', de: 'DANACH', fr: 'APRÈS' },
  now: { es: 'AHORA', en: 'NOW', de: 'JETZT', fr: 'MAINTENANT' },
  securePrice: { es: 'ASEGURAR PRECIO €49', en: 'SECURE €49 PRICE', de: '€49 PREIS SICHERN', fr: 'SÉCURISER LE PRIX 49€' },
  // Day 7 - Final offer
  finalOffer: { es: 'Último día: €49 + Consulta GRATIS', en: 'Last day: €49 + FREE Consultation', de: 'Letzter Tag: €49 + GRATIS Beratung', fr: 'Dernier jour: 49€ + Consultation GRATUITE' },
  finalOfferHeader: { es: 'Oferta Final', en: 'Final Offer', de: 'Letztes Angebot', fr: 'Offre Finale' },
  lastEmail: {
    es: 'Este es el último email que te envío sobre esta oferta.',
    en: 'This is the last email I\'ll send you about this offer.',
    de: 'Dies ist die letzte E-Mail, die ich dir zu diesem Angebot schicke.',
    fr: 'C\'est le dernier email que je t\'envoie sur cette offre.'
  },
  tonightMidnight: {
    es: 'Hoy a medianoche, el precio vuelve a €99. Pero antes de que eso pase, quiero añadir algo especial:',
    en: 'Tonight at midnight, the price goes back to €99. But before that happens, I want to add something special:',
    de: 'Heute Nacht um Mitternacht geht der Preis zurück auf €99. Aber bevor das passiert, möchte ich etwas Besonderes hinzufügen:',
    fr: 'Ce soir à minuit, le prix repasse à 99€. Mais avant que cela n\'arrive, je veux ajouter quelque chose de spécial:'
  },
  bonusConsult: { es: 'BONUS: Consulta 1:1 GRATIS', en: 'BONUS: FREE 1:1 Consultation', de: 'BONUS: KOSTENLOSES 1:1 Beratungsgespräch', fr: 'BONUS: Consultation 1:1 GRATUITE' },
  bonusDesc: {
    es: 'Solo para quienes compren HOY: Una llamada de 30 minutos conmigo para revisar tu caso específico.',
    en: 'Only for those who buy TODAY: A 30-minute call with me to review your specific case.',
    de: 'Nur für diejenigen, die HEUTE kaufen: Ein 30-minütiges Gespräch mit mir, um deinen spezifischen Fall zu besprechen.',
    fr: 'Uniquement pour ceux qui achètent AUJOURD\'HUI: Un appel de 30 minutes avec moi pour examiner ton cas spécifique.'
  },
  bonusValue: { es: 'Valor: €50 → Hoy: GRATIS', en: 'Value: €50 → Today: FREE', de: 'Wert: €50 → Heute: GRATIS', fr: 'Valeur: 50€ → Aujourd\'hui: GRATUIT' },
  lastOpportunity: { es: 'Última oportunidad', en: 'Last opportunity', de: 'Letzte Gelegenheit', fr: 'Dernière opportunité' },
  digitalStarterPlus: { es: 'Digital Starter + Consulta 1:1 incluida', en: 'Digital Starter + 1:1 Consultation included', de: 'Digital Starter + 1:1 Beratung inklusive', fr: 'Digital Starter + Consultation 1:1 incluse' },
  buyNow: { es: 'COMPRAR AHORA', en: 'BUY NOW', de: 'JETZT KAUFEN', fr: 'ACHETER MAINTENANT' },
  offerEndsMidnight: { es: 'Oferta termina a medianoche', en: 'Offer ends at midnight', de: 'Angebot endet um Mitternacht', fr: 'L\'offre se termine à minuit' },
  guarantee: { es: 'Garantía 30 días', en: '30-day guarantee', de: '30 Tage Garantie', fr: 'Garantie 30 jours' },
  guaranteeDesc: {
    es: 'Si no te es útil, te devolvemos el 100% de tu dinero. Sin preguntas.',
    en: 'If it\'s not useful to you, we\'ll refund 100% of your money. No questions asked.',
    de: 'Wenn es dir nicht nützlich ist, erstatten wir dir 100% deines Geldes zurück. Ohne Fragen.',
    fr: 'Si ce n\'est pas utile, nous te remboursons 100% de ton argent. Sans questions.'
  },
  thankYou: {
    es: 'Gracias por considerar Solvia. Espero poder ayudarte en tu camino a',
    en: 'Thank you for considering Solvia. I hope to help you on your journey to',
    de: 'Danke, dass du Solvia in Betracht ziehst. Ich hoffe, dir auf deinem Weg nach',
    fr: 'Merci de considérer Solvia. J\'espère t\'aider dans ton parcours vers'
  },
  thankYouEnd: { es: '', en: '', de: 'helfen zu können', fr: '' },
};

// Get email template with language support
const getEmailTemplate = (templateId: string, lead: Lead, paymentUrl: string, lang: Language) => {
  const firstName = lead.first_name || (lang === 'es' ? 'Profesional' : lang === 'de' ? 'Kolleg/in' : lang === 'fr' ? 'Professionnel' : 'Professional');
  const countryKey = lead.target_country?.toLowerCase() || 'germany';
  const country = countryNames[countryKey]?.[lang] || lead.target_country || (lang === 'es' ? 'Europa' : lang === 'de' ? 'Europa' : lang === 'fr' ? 'Europe' : 'Europe');
  const professionKey = lead.doctor_type?.toLowerCase() || 'general';
  const profession = professionNames[professionKey]?.[lang] || professionNames.general[lang];
  const studyCountry = lead.study_country || (lang === 'es' ? 'tu país' : lang === 'de' ? 'deinem Land' : lang === 'fr' ? 'ton pays' : 'your country');
  const languageLevel = lead.language_level || (lang === 'es' ? 'por determinar' : lang === 'de' ? 'noch festzulegen' : lang === 'fr' ? 'à déterminer' : 'to be determined');
  const timeline = getTimeline(lead.language_level, lang);
  const ui = uiStrings;

  const templates: Record<string, { subject: string; html: string }> = {
    day0: {
      subject: `${firstName}, ${lang === 'es' ? 'tu plan para trabajar en' : lang === 'de' ? 'dein Plan für die Arbeit in' : lang === 'fr' ? 'ton plan pour travailler en' : 'your plan to work in'} ${country} - ${lang === 'es' ? 'precio especial' : lang === 'de' ? 'Sonderpreis' : lang === 'fr' ? 'prix spécial' : 'special price'} €49`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .situation-box { background: #f0fdfa; border-left: 4px solid #0D9488; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .situation-box p { margin: 8px 0; color: #1a1a1a; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .benefits { margin: 25px 0; }
    .benefit { display: flex; align-items: flex-start; margin: 12px 0; }
    .benefit-check { color: #0D9488; font-size: 18px; margin-right: 10px; }
    .urgency { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${ui.hello[lang]} ${firstName}!</h1>
    </div>
    <div class="content">
      <p>${ui.iSawAnalysis[lang]} <strong>${profession}</strong> ${ui.inCountry[lang]} <strong>${country}</strong>${ui.toWorkAs[lang]}.</p>
      
      <div class="situation-box">
        <p><strong>📍 ${ui.yourSituation[lang]}:</strong></p>
        <p>• ${ui.originCountry[lang]}: ${studyCountry}</p>
        <p>• ${ui.languageLevel[lang]}: ${languageLevel}</p>
        <p>• ${ui.estimatedTime[lang]}: ${timeline}</p>
      </div>
      
      <p><strong>${ui.goodNews[lang]}:</strong> ${ui.thousandsWork[lang]} ${country}. ${ui.clearProcess[lang]}</p>
      
      <p>${ui.thisWeekOffer[lang]}</p>
      
      <div class="benefits">
        <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit1[lang]} ${studyCountry}</div>
        <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit2[lang]}</div>
        <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit3[lang]}</div>
        <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit4[lang]}</div>
      </div>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">${ui.unlockPlan[lang]} - €49</a>
      </div>
      
      <div class="urgency">
        <strong>⏰ ${ui.spotsLeft[lang]}</strong><br>
        ${ui.validUntil[lang]}
      </div>
      
      <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Solvia | <a href="https://thesolvia.com">thesolvia.com</a></p>
      <p style="font-size: 12px; color: #999;">${ui.unsubscribe[lang]}</p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day1: {
      subject: `${ui.successStoryTitle[lang]} ${country} ${ui.successStoryTitleEnd[lang]}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .story-box { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .quote { font-style: italic; font-size: 18px; color: #0D9488; border-left: 3px solid #0D9488; padding-left: 20px; margin: 20px 0; }
    .timeline { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .timeline-item { display: flex; margin: 10px 0; }
    .timeline-month { font-weight: 600; color: #0D9488; min-width: 80px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${lang === 'es' ? 'Historia de éxito: De México a' : lang === 'de' ? 'Erfolgsgeschichte: Von Mexiko nach' : lang === 'fr' ? 'Histoire de réussite: Du Mexique à' : 'Success story: From Mexico to'} ${country}</h1>
    </div>
    <div class="content">
      <p>${ui.hello[lang]} ${firstName},</p>
      
      <p>${ui.todayShare[lang]} ${country}${ui.todayShareEnd[lang]}.</p>
      
      <div class="story-box">
        <p><strong>María García, 32 ${lang === 'es' ? 'años' : lang === 'de' ? 'Jahre' : lang === 'fr' ? 'ans' : 'years'}</strong></p>
        <p>${lang === 'es' ? 'Médica General' : lang === 'de' ? 'Allgemeinärztin' : lang === 'fr' ? 'Médecin Généraliste' : 'General Practitioner'} - Guadalajara, México → ${country}</p>
        
        <div class="quote">
          "${ui.mariaQuote[lang]}"
        </div>
      </div>
      
      <p><strong>${ui.herTimeline[lang]}:</strong></p>
      
      <div class="timeline">
        <div class="timeline-item"><span class="timeline-month">${ui.month[lang]} 1-3:</span> ${ui.timeline1[lang]}</div>
        <div class="timeline-item"><span class="timeline-month">${ui.month[lang]} 4-8:</span> ${ui.timeline2[lang]}</div>
        <div class="timeline-item"><span class="timeline-month">${ui.month[lang]} 9-11:</span> ${ui.timeline3[lang]}</div>
        <div class="timeline-item"><span class="timeline-month">${ui.month[lang]} 12:</span> ${ui.timeline4[lang]} ✓</div>
        <div class="timeline-item"><span class="timeline-month">${ui.month[lang]} 14:</span> ${ui.timeline5[lang]}</div>
      </div>
      
      <p>${ui.mariaUsed[lang]}</p>
      
      <p><strong>${ui.wantSameRoadmap[lang]}</strong></p>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">${ui.viewMyPlan[lang]} - €49</a>
      </div>
      
      <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Solvia | <a href="https://thesolvia.com">thesolvia.com</a></p>
      <p style="font-size: 12px; color: #999;">${ui.unsubscribe[lang]}</p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day3: {
      subject: `⚠️ ${ui.errorsTitle[lang]}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .error-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .error-title { color: #dc2626; font-weight: 600; margin-bottom: 10px; }
    .solution-box { background: #f0fdfa; border-left: 4px solid #0D9488; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .solution-title { color: #0D9488; font-weight: 600; margin-bottom: 10px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ ${ui.costlyErrors[lang]}</h1>
    </div>
    <div class="content">
      <p>${ui.hello[lang]} ${firstName},</p>
      
      <p>${ui.afterHelping[lang]} ${country}, ${ui.identifiedErrors[lang]}</p>
      
      <div class="error-box">
        <p class="error-title">❌ ${lang === 'es' ? 'Error' : lang === 'de' ? 'Fehler' : lang === 'fr' ? 'Erreur' : 'Mistake'} #1: ${ui.error1Title[lang]}</p>
        <p>${ui.error1Desc[lang]}</p>
      </div>
      
      <div class="error-box">
        <p class="error-title">❌ ${lang === 'es' ? 'Error' : lang === 'de' ? 'Fehler' : lang === 'fr' ? 'Erreur' : 'Mistake'} #2: ${ui.error2Title[lang]}</p>
        <p>${ui.error2Desc[lang]}</p>
      </div>
      
      <div class="error-box">
        <p class="error-title">❌ ${lang === 'es' ? 'Error' : lang === 'de' ? 'Fehler' : lang === 'fr' ? 'Erreur' : 'Mistake'} #3: ${ui.error3Title[lang]}</p>
        <p>${ui.error3Desc[lang]}</p>
      </div>
      
      <div class="solution-box">
        <p class="solution-title">✅ ${ui.theSolution[lang]}</p>
        <p>${ui.packageIncludes[lang]}</p>
        <ul>
          <li>${ui.apostilleChecklist[lang]} ${studyCountry}</li>
          <li>${ui.translationTemplates[lang]}</li>
          <li>${ui.languagePlan[lang]}</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">${ui.avoidErrors[lang]} - €49</a>
      </div>
      
      <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Solvia | <a href="https://thesolvia.com">thesolvia.com</a></p>
      <p style="font-size: 12px; color: #999;">${ui.unsubscribe[lang]}</p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day5: {
      subject: `${firstName}, ${ui.priceIncrease[lang]} ⏰`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .countdown { background: #1a1a1a; color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
    .countdown-time { font-size: 36px; font-weight: 700; color: #f59e0b; }
    .price-compare { display: flex; justify-content: center; gap: 30px; margin: 25px 0; text-align: center; }
    .price-old { color: #999; text-decoration: line-through; font-size: 24px; }
    .price-new { color: #0D9488; font-size: 36px; font-weight: 700; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ ${ui.lastChance[lang]}</h1>
    </div>
    <div class="content">
      <p>${ui.hello[lang]} ${firstName},</p>
      
      <p>${ui.lastTimeSee[lang]}</p>
      
      <div class="countdown">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${ui.priceGoesUp[lang]}</p>
        <p class="countdown-time">${ui.hours48[lang]}</p>
        <p style="margin: 0; font-size: 14px;">${ui.sundayBack[lang]}</p>
      </div>
      
      <p>${ui.yourTimelineFor[lang]} ${country}:</p>
      <ul>
        <li>${ui.estimatedTimeLabel[lang]}: <strong>${timeline}</strong></li>
        <li>${ui.totalInvestment[lang]}: <strong>€3,000-5,000</strong> (${lang === 'es' ? 'idioma + trámites' : lang === 'de' ? 'Sprache + Formalitäten' : lang === 'fr' ? 'langue + démarches' : 'language + procedures'})</li>
        <li>${ui.avgSalary[lang]} ${country}: <strong>€60,000-80,000/${lang === 'es' ? 'año' : lang === 'de' ? 'Jahr' : lang === 'fr' ? 'an' : 'year'}</strong></li>
      </ul>
      
      <p>${ui.for49Get[lang]}</p>
      
      <div class="price-compare">
        <div>
          <p style="margin: 0; font-size: 12px; color: #666;">${ui.after[lang]}</p>
          <p class="price-old">€99</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 12px; color: #666;">${ui.now[lang]}</p>
          <p class="price-new">€49</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">${ui.securePrice[lang]}</a>
      </div>
      
      <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Solvia | <a href="https://thesolvia.com">thesolvia.com</a></p>
      <p style="font-size: 12px; color: #999;">${ui.unsubscribe[lang]}</p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day7: {
      subject: `🎁 ${ui.finalOffer[lang]}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .bonus-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; }
    .bonus-title { font-size: 20px; font-weight: 700; color: #92400e; margin-bottom: 10px; }
    .final-offer { background: #0D9488; color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0; }
    .final-price { font-size: 48px; font-weight: 700; }
    .cta-button { display: inline-block; background: white; color: #0D9488 !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 15px 0; }
    .guarantee { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 ${ui.finalOfferHeader[lang]}</h1>
    </div>
    <div class="content">
      <p>${ui.hello[lang]} ${firstName},</p>
      
      <p>${ui.lastEmail[lang]}</p>
      
      <p>${ui.tonightMidnight[lang]}</p>
      
      <div class="bonus-box">
        <p class="bonus-title">🎁 ${ui.bonusConsult[lang]}</p>
        <p>${ui.bonusDesc[lang]}</p>
        <p style="font-size: 14px; color: #666;">${ui.bonusValue[lang]}</p>
      </div>
      
      <div class="final-offer">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${ui.lastOpportunity[lang]}</p>
        <p class="final-price">€49</p>
        <p style="margin: 10px 0;">${ui.digitalStarterPlus[lang]}</p>
        <a href="${paymentUrl}" class="cta-button">${ui.buyNow[lang]}</a>
        <p style="font-size: 12px; margin-top: 15px; opacity: 0.9;">${ui.offerEndsMidnight[lang]}</p>
      </div>
      
      <div class="guarantee">
        <p><strong>🛡️ ${ui.guarantee[lang]}</strong></p>
        <p style="margin: 0; font-size: 14px;">${ui.guaranteeDesc[lang]}</p>
      </div>
      
      <p>${ui.thankYou[lang]} ${country}${ui.thankYouEnd[lang]}.</p>
      
      <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Solvia | <a href="https://thesolvia.com">thesolvia.com</a></p>
      <p style="font-size: 12px; color: #999;">${ui.unsubscribe[lang]}</p>
    </div>
  </div>
</body>
</html>
      `,
    },
  };

  return templates[templateId] || templates.day0;
};

// Segment leads based on criteria
const segmentLeads = (leads: Lead[], segment: string): Lead[] => {
  switch (segment) {
    case 'hot_leads':
      return leads.filter(l => {
        const lang = l.language_level?.toLowerCase() || '';
        const country = l.target_country?.toLowerCase() || '';
        return (lang.includes('materna') || lang.includes('mother') || lang.includes('nativ')) && 
               (country === 'spain' || country === 'españa');
      });
    
    case 'germany_beginners':
      return leads.filter(l => {
        const lang = l.language_level?.toLowerCase() || '';
        const country = l.target_country?.toLowerCase() || '';
        return (country === 'germany' || country === 'alemania' || country === 'deutschland') &&
               (lang.includes('a1') || lang.includes('a2') || lang === '');
      });
    
    case 'advanced_speakers':
      return leads.filter(l => {
        const lang = l.language_level?.toLowerCase() || '';
        const country = l.target_country?.toLowerCase() || '';
        return (country === 'germany' || country === 'alemania' || country === 'deutschland') &&
               (lang.includes('b2') || lang.includes('c1'));
      });
    
    case 'cold_leads':
    case 'all':
    default:
      return leads;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { segment = 'all', templateId = 'day0', testMode = false, testEmail, language }: CampaignRequest = await req.json();

    // If testEmail is provided, automatically enable test mode
    const effectiveTestMode = testMode || !!testEmail;

    console.log(`📧 Starting nurture campaign - Segment: ${segment}, Template: ${templateId}, TestMode: ${effectiveTestMode}, TestEmail: ${testEmail || 'none'}, Language override: ${language || 'auto'}`);

    // Fetch all leads from the leads table (including preferred_language)
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name, target_country, study_country, doctor_type, language_level, email_sequence_day, preferred_language')
      .eq('converted', false);

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw new Error(`Failed to fetch leads: ${leadsError.message}`);
    }

    let leads = leadsData as Lead[];
    console.log(`📊 Found ${leads.length} unconverted leads`);

    // Apply segmentation
    leads = segmentLeads(leads, segment);
    console.log(`📊 After segmentation (${segment}): ${leads.length} leads`);

    // In test mode, only send to one email
    if (effectiveTestMode) {
      if (testEmail) {
        leads = leads.filter(l => l.email.toLowerCase() === testEmail.toLowerCase());
        // If test email not found in leads, create a mock lead for testing
        if (leads.length === 0) {
          console.log(`🧪 Test email ${testEmail} not in leads, creating mock lead for testing`);
          leads = [{
            id: 'test-lead',
            email: testEmail,
            first_name: 'David',
            last_name: 'Rehrl',
            target_country: 'germany',
            study_country: 'Mexico',
            doctor_type: 'general',
            language_level: 'B1',
            email_sequence_day: 0,
            preferred_language: null, // Let auto-detection handle it
          }];
        }
      } else {
        leads = leads.slice(0, 1);
      }
      console.log(`🧪 Test mode: sending to ${leads.length} lead(s): ${leads.map(l => l.email).join(', ')}`);
    }

    const paymentBaseUrl = 'https://thesolvia.com/homologation-payment';
    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
      languageBreakdown: { es: 0, de: 0, en: 0, fr: 0 } as Record<Language, number>,
    };

    // Helper function to add delay between API calls to respect Resend rate limits (2 req/sec)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      // Add 600ms delay between emails to stay under 2 req/sec rate limit
      if (i > 0) {
        await delay(600);
      }
      
      try {
        // Detect language for this lead (or use override)
        const detectedLang = language || detectLeadLanguage(lead);
        console.log(`🌍 Lead ${lead.email}: preferred=${lead.preferred_language}, study=${lead.study_country}, target=${lead.target_country} → language=${detectedLang}`);
        
        // Build personalized payment URL with lead data
        const paymentUrl = `${paymentBaseUrl}?email=${encodeURIComponent(lead.email)}&country=${encodeURIComponent(lead.target_country || 'germany')}`;
        
        const template = getEmailTemplate(templateId, lead, paymentUrl, detectedLang);

        const emailResponse = await resend.emails.send({
          from: "Solvia <team@thesolvia.com>",
          to: [lead.email],
          subject: template.subject,
          html: template.html,
        });

        // Check if Resend returned an error
        if (emailResponse.error) {
          throw new Error(`Resend error: ${emailResponse.error.message}`);
        }

        console.log(`✅ Email sent to ${lead.email} (${detectedLang}):`, emailResponse);
        results.languageBreakdown[detectedLang]++;

        // Update lead tracking (skip for mock test leads)
        if (lead.id !== 'test-lead') {
          const dayNumber = parseInt(templateId.replace('day', ''));
          await supabase
            .from('leads')
            .update({
              email_sequence_day: dayNumber,
              last_email_sent: new Date().toISOString(),
              email_campaign: `nurture_${segment}_${templateId}_${detectedLang}`,
            })
            .eq('id', lead.id);
        }

        results.sent++;
      } catch (emailError: any) {
        console.error(`❌ Failed to send to ${lead.email}:`, emailError);
        results.failed++;
        results.errors.push(`${lead.email}: ${emailError.message}`);
      }
    }

    console.log(`📧 Campaign complete:`, results);

    return new Response(
      JSON.stringify({
        success: true,
        campaign: `${segment}_${templateId}`,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("❌ Campaign error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
