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
  language?: Language;
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
  preferred_language: string | null;
}

// Solvia Brand Colors
const BRAND = {
  primary: '#0974f1',
  primaryDark: '#0560d1',
  primaryLight: '#9fccfa',
  backgroundLight: '#e6f2ff',
  gradient: 'linear-gradient(135deg, #0974f1 0%, #4c9cf5 100%)',
  logoUrl: 'https://ehrxpaxvyuwiwqclqkyh.supabase.co/storage/v1/object/public/email-assets/logo.png',
};

// Latin American countries for Spanish language detection
const latAmCountries = [
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia', 
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico'
];

// Language detection based on preferred_language, study_country, and target_country
const detectLeadLanguage = (lead: Lead): Language => {
  if (lead.preferred_language) {
    const pref = lead.preferred_language.toLowerCase();
    if (['es', 'de', 'en', 'fr'].includes(pref)) {
      console.log(`Using preferred_language for ${lead.email}: ${pref}`);
      return pref as Language;
    }
  }
  
  const study = (lead.study_country || '').toLowerCase();
  const target = (lead.target_country || '').toLowerCase();
  
  if (latAmCountries.some(c => study.includes(c))) {
    console.log(`Auto-detected Spanish for ${lead.email} based on study_country: ${lead.study_country}`);
    return 'es';
  }
  if (study.includes('spain') || study.includes('españa')) return 'es';
  
  if (target.includes('germany') || target.includes('alemania') || target.includes('deutschland')) return 'de';
  if (target.includes('austria') || target.includes('österreich')) return 'de';
  if (study.includes('germany') || study.includes('alemania') || study.includes('deutschland')) return 'de';
  if (study.includes('austria') || study.includes('österreich')) return 'de';
  
  if (target.includes('france') || target.includes('francia') || target.includes('frankreich')) return 'fr';
  if (study.includes('france') || study.includes('francia')) return 'fr';
  if (study.includes('algeria') || study.includes('argelia')) return 'fr';
  if (study.includes('morocco') || study.includes('marruecos')) return 'fr';
  
  console.log(`Defaulting to English for ${lead.email}`);
  return 'en';
};

// Country name mapping
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

// Profession mapping
const professionNames: Record<string, Record<Language, string>> = {
  general: { es: 'médico general', en: 'general practitioner', de: 'Allgemeinarzt/ärztin', fr: 'médecin généraliste' },
  specialist: { es: 'especialista', en: 'specialist', de: 'Facharzt/ärztin', fr: 'spécialiste' },
  nurse: { es: 'enfermero/a', en: 'nurse', de: 'Krankenpfleger/in', fr: 'infirmier/ère' },
  dentist: { es: 'dentista', en: 'dentist', de: 'Zahnarzt/ärztin', fr: 'dentiste' },
  other: { es: 'profesional de la salud', en: 'healthcare professional', de: 'Gesundheitsfachkraft', fr: 'professionnel de santé' },
};

// Dynamic success stories based on study_country
interface SuccessStory {
  name: string;
  age: number;
  origin: string;
  profession: Record<Language, string>;
  quote: Record<Language, string>;
  months: number;
}

const successStories: Record<string, SuccessStory> = {
  mexico: {
    name: 'María García',
    age: 32,
    origin: 'Guadalajara, México',
    profession: { es: 'Médica General', en: 'General Practitioner', de: 'Allgemeinärztin', fr: 'Médecin Généraliste' },
    quote: {
      es: 'Cuando empecé, pensé que tomaría años. Con el plan correcto y la documentación en orden, en 14 meses ya estaba ejerciendo.',
      en: 'When I started, I thought it would take years. With the right plan and proper documentation, in 14 months I was already practicing.',
      de: 'Als ich anfing, dachte ich, es würde Jahre dauern. Mit dem richtigen Plan und der richtigen Dokumentation praktizierte ich nach 14 Monaten bereits.',
      fr: 'Quand j\'ai commencé, je pensais que ça prendrait des années. Avec le bon plan et la bonne documentation, en 14 mois j\'exerçais déjà.'
    },
    months: 14
  },
  colombia: {
    name: 'Andrés Rodríguez',
    age: 35,
    origin: 'Bogotá, Colombia',
    profession: { es: 'Cardiólogo', en: 'Cardiologist', de: 'Kardiologe', fr: 'Cardiologue' },
    quote: {
      es: 'El proceso parecía imposible hasta que tuve el roadmap claro. Solvia me ayudó a evitar errores costosos y ahorrar meses.',
      en: 'The process seemed impossible until I had a clear roadmap. Solvia helped me avoid costly mistakes and save months.',
      de: 'Der Prozess schien unmöglich, bis ich einen klaren Fahrplan hatte. Solvia half mir, kostspielige Fehler zu vermeiden.',
      fr: 'Le processus semblait impossible jusqu\'à ce que j\'aie une feuille de route claire. Solvia m\'a aidé à éviter des erreurs coûteuses.'
    },
    months: 12
  },
  default: {
    name: 'Ana Martínez',
    age: 29,
    origin: 'Latinoamérica',
    profession: { es: 'Médica', en: 'Physician', de: 'Ärztin', fr: 'Médecin' },
    quote: {
      es: 'Tener un plan personalizado marcó la diferencia. Sabía exactamente qué hacer cada mes.',
      en: 'Having a personalized plan made all the difference. I knew exactly what to do each month.',
      de: 'Ein personalisierter Plan machte den Unterschied. Ich wusste genau, was ich jeden Monat tun musste.',
      fr: 'Avoir un plan personnalisé a fait toute la différence. Je savais exactement quoi faire chaque mois.'
    },
    months: 15
  }
};

const getSuccessStory = (studyCountry: string | null): SuccessStory => {
  const country = (studyCountry || '').toLowerCase();
  if (country.includes('mexico') || country.includes('méxico')) return successStories.mexico;
  if (country.includes('colombia')) return successStories.colombia;
  return successStories.default;
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

// Common UI translations - Updated for authentic, personal tone
const uiStrings: Record<string, Record<Language, string>> = {
  hello: { es: 'Hola', en: 'Hi', de: 'Hallo', fr: 'Bonjour' },
  yourSituation: { es: 'Tu situación', en: 'Your situation', de: 'Deine Situation', fr: 'Ta situation' },
  originCountry: { es: 'País de origen', en: 'Country of origin', de: 'Herkunftsland', fr: 'Pays d\'origine' },
  targetCountry: { es: 'Objetivo', en: 'Target', de: 'Ziel', fr: 'Objectif' },
  languageLevel: { es: 'Nivel de idioma', en: 'Language level', de: 'Sprachniveau', fr: 'Niveau de langue' },
  estimatedTime: { es: 'Tiempo estimado', en: 'Estimated time', de: 'Geschätzte Zeit', fr: 'Temps estimé' },
  unlockPlan: { es: 'VER MI PLAN', en: 'VIEW MY PLAN', de: 'MEINEN PLAN ANSEHEN', fr: 'VOIR MON PLAN' },
  warmRegards: { es: 'Un abrazo', en: 'Best regards', de: 'Herzliche Grüße', fr: 'Cordialement' },
  team: { es: 'Equipo Solvia', en: 'Team Solvia', de: 'Team Solvia', fr: 'Équipe Solvia' },
  unsubscribe: { 
    es: 'Si no deseas recibir más emails, responde "CANCELAR"', 
    en: 'To unsubscribe, reply "UNSUBSCRIBE"', 
    de: 'Zum Abmelden antworte "ABMELDEN"', 
    fr: 'Pour te désabonner, réponds "DÉSABONNER"' 
  },
  // Day 0 - Personal, value-focused hook
  day0Hook: {
    es: 'Vi que estás considerando dar el salto a',
    en: 'I saw you\'re considering making the move to',
    de: 'Ich habe gesehen, dass du darüber nachdenkst, nach',
    fr: 'J\'ai vu que tu envisages de faire le pas vers'
  },
  day0Hook2: {
    es: 'Es una gran decisión - y la buena noticia es que el proceso es más sencillo de lo que parece cuando tienes el plan correcto.',
    en: 'It\'s a big decision - and the good news is the process is simpler than it seems when you have the right plan.',
    de: 'zu ziehen. Das ist eine große Entscheidung - und die gute Nachricht ist, dass der Prozess einfacher ist als er scheint, wenn du den richtigen Plan hast.',
    fr: 'C\'est une grande décision - et la bonne nouvelle est que le processus est plus simple qu\'il n\'y paraît avec le bon plan.'
  },
  whatYouGet: {
    es: 'Con tu plan personalizado recibes',
    en: 'With your personalized plan you get',
    de: 'Mit deinem persönlichen Plan erhältst du',
    fr: 'Avec ton plan personnalisé tu reçois'
  },
  benefit1: { es: 'Lista de documentos específica para tu caso', en: 'Document checklist specific to your case', de: 'Dokumentenliste speziell für deinen Fall', fr: 'Liste de documents spécifique à ton cas' },
  benefit2: { es: 'Timeline realista basado en tu nivel de idioma', en: 'Realistic timeline based on your language level', de: 'Realistischer Zeitplan basierend auf deinem Sprachniveau', fr: 'Calendrier réaliste basé sur ton niveau de langue' },
  benefit3: { es: 'Guía paso a paso para evitar errores comunes', en: 'Step-by-step guide to avoid common mistakes', de: 'Schritt-für-Schritt-Anleitung zur Vermeidung häufiger Fehler', fr: 'Guide étape par étape pour éviter les erreurs courantes' },
  includes2026: { 
    es: 'El plan incluye actualizaciones de 2026', 
    en: 'Plan includes 2026 updates', 
    de: 'Plan enthält 2026-Updates', 
    fr: 'Le plan inclut les mises à jour 2026' 
  },
  // Day 1 - Success story
  successStoryTitle: { es: 'Una historia que te puede inspirar', en: 'A story that might inspire you', de: 'Eine Geschichte, die dich inspirieren könnte', fr: 'Une histoire qui pourrait t\'inspirer' },
  todayShare: {
    es: 'Quiero compartirte la historia de',
    en: 'I want to share the story of',
    de: 'Ich möchte dir die Geschichte von',
    fr: 'Je veux te partager l\'histoire de'
  },
  whoNowWorks: {
    es: 'que ahora trabaja como médico en',
    en: 'who now works as a doctor in',
    de: 'erzählen, die jetzt als Ärztin in',
    fr: 'qui travaille maintenant comme médecin en'
  },
  herTimeline: { es: 'Su proceso', en: 'Their process', de: 'Ihr Prozess', fr: 'Son processus' },
  month: { es: 'Mes', en: 'Month', de: 'Monat', fr: 'Mois' },
  timeline1: { es: 'Recopilación de documentos y apostillas', en: 'Document collection and apostilles', de: 'Dokumentensammlung und Apostillen', fr: 'Collecte de documents et apostilles' },
  timeline2: { es: 'Curso intensivo de alemán (A1→B2)', en: 'Intensive German course (A1→B2)', de: 'Intensiver Deutschkurs (A1→B2)', fr: 'Cours intensif d\'allemand (A1→B2)' },
  timeline3: { es: 'Preparación FSP', en: 'FSP preparation', de: 'FSP-Vorbereitung', fr: 'Préparation FSP' },
  timeline4: { es: 'Examen FSP aprobado', en: 'FSP exam passed', de: 'FSP-Prüfung bestanden', fr: 'Examen FSP réussi' },
  timeline5: { es: 'Primer día de trabajo', en: 'First day of work', de: 'Erster Arbeitstag', fr: 'Premier jour de travail' },
  sameRoadmap: {
    es: 'usó exactamente el mismo tipo de plan que ahora ofrecemos.',
    en: 'used exactly the same type of plan we now offer.',
    de: 'verwendete genau denselben Plan, den wir jetzt anbieten.',
    fr: 'a utilisé exactement le même type de plan que nous proposons maintenant.'
  },
  viewMyPlan: { es: 'VER MI PLAN - €49', en: 'VIEW MY PLAN - €49', de: 'MEINEN PLAN ANSEHEN - €49', fr: 'VOIR MON PLAN - 49€' },
  // Day 3 - 3 Errors
  errorsTitle: { es: '3 errores que retrasan tu homologación', en: '3 mistakes that delay your homologation', de: '3 Fehler, die deine Approbation verzögern', fr: '3 erreurs qui retardent ton homologation' },
  afterHelping: {
    es: 'Después de ayudar a cientos de médicos con su homologación, hemos identificado los errores más comunes:',
    en: 'After helping hundreds of doctors with their homologation, we\'ve identified the most common mistakes:',
    de: 'Nachdem wir Hunderten von Ärzten bei ihrer Approbation geholfen haben, haben wir die häufigsten Fehler identifiziert:',
    fr: 'Après avoir aidé des centaines de médecins avec leur homologation, nous avons identifié les erreurs les plus courantes:'
  },
  error1Title: { es: 'Apostillar documentos incorrectamente', en: 'Apostilling documents incorrectly', de: 'Dokumente falsch apostillieren', fr: 'Apostiller les documents incorrectement' },
  error1Desc: {
    es: 'El 40% de los rechazos son por apostillas incorrectas. Cada país tiene requisitos específicos.',
    en: '40% of rejections are due to incorrect apostilles. Each country has specific requirements.',
    de: '40% der Ablehnungen sind auf falsche Apostillen zurückzuführen. Jedes Land hat spezifische Anforderungen.',
    fr: '40% des rejets sont dus à des apostilles incorrectes. Chaque pays a des exigences spécifiques.'
  },
  error2Title: { es: 'No validar traducciones antes de enviar', en: 'Not validating translations before sending', de: 'Übersetzungen vor dem Einreichen nicht validieren', fr: 'Ne pas valider les traductions avant l\'envoi' },
  error2Desc: {
    es: 'Una traducción rechazada significa 2-3 meses perdidos.',
    en: 'A rejected translation means 2-3 months lost.',
    de: 'Eine abgelehnte Übersetzung bedeutet 2-3 Monate Verzögerung.',
    fr: 'Une traduction rejetée signifie 2-3 mois perdus.'
  },
  error3Title: { es: 'Empezar el idioma sin un plan estructurado', en: 'Starting language without a structured plan', de: 'Mit dem Sprachkurs ohne strukturierten Plan beginnen', fr: 'Commencer la langue sans plan structuré' },
  error3Desc: {
    es: 'Muchos gastan €2,000+ en cursos que no los preparan para el B2 médico.',
    en: 'Many spend €2,000+ on courses that don\'t prepare them for medical B2.',
    de: 'Viele geben €2.000+ für Kurse aus, die sie nicht auf das medizinische B2 vorbereiten.',
    fr: 'Beaucoup dépensent plus de 2 000€ en cours qui ne les préparent pas au B2 médical.'
  },
  theSolution: { es: 'La solución', en: 'The solution', de: 'Die Lösung', fr: 'La solution' },
  avoidErrors: { es: 'EVITAR ESTOS ERRORES', en: 'AVOID THESE MISTAKES', de: 'DIESE FEHLER VERMEIDEN', fr: 'ÉVITER CES ERREURS' },
  // Day 5 - Value reminder (no fake urgency)
  reminderTitle: { es: 'Un recordatorio rápido', en: 'A quick reminder', de: 'Eine kurze Erinnerung', fr: 'Un rappel rapide' },
  reminderBody: {
    es: 'Hace unos días completaste el análisis para trabajar en',
    en: 'A few days ago you completed the analysis to work in',
    de: 'Vor ein paar Tagen hast du die Analyse abgeschlossen, um in',
    fr: 'Il y a quelques jours tu as complété l\'analyse pour travailler en'
  },
  reminderBody2: {
    es: 'Si todavía estás considerando dar el paso, aquí tienes un resumen de lo que obtienes:',
    en: 'If you\'re still considering taking the step, here\'s a summary of what you get:',
    de: 'zu arbeiten. Wenn du immer noch überlegst, den Schritt zu wagen, hier eine Zusammenfassung:',
    fr: 'Si tu envisages toujours de faire le pas, voici un résumé de ce que tu obtiens:'
  },
  yourStats: { es: 'Tu perfil', en: 'Your profile', de: 'Dein Profil', fr: 'Ton profil' },
  avgSalary: { es: 'Salario promedio en', en: 'Average salary in', de: 'Durchschnittsgehalt in', fr: 'Salaire moyen en' },
  securePrice: { es: 'VER MI PLAN - €49', en: 'VIEW MY PLAN - €49', de: 'MEINEN PLAN ANSEHEN - €49', fr: 'VOIR MON PLAN - 49€' },
  // Day 7 - Final genuine offer
  finalOffer: { es: 'Última oportunidad + algo extra', en: 'Last opportunity + something extra', de: 'Letzte Gelegenheit + etwas Extra', fr: 'Dernière opportunité + quelque chose en plus' },
  lastEmail: {
    es: 'Este es el último email de esta serie.',
    en: 'This is the last email in this series.',
    de: 'Dies ist die letzte E-Mail dieser Serie.',
    fr: 'C\'est le dernier email de cette série.'
  },
  addBonus: {
    es: 'Si decides obtener tu plan hoy, incluyo sin costo adicional:',
    en: 'If you decide to get your plan today, I\'ll include at no extra cost:',
    de: 'Wenn du dich heute für deinen Plan entscheidest, füge ich ohne Aufpreis hinzu:',
    fr: 'Si tu décides d\'obtenir ton plan aujourd\'hui, j\'inclus sans frais supplémentaires:'
  },
  bonusConsult: { es: 'Revisión de documentos por email', en: 'Email document review', de: 'Dokumentenprüfung per E-Mail', fr: 'Révision de documents par email' },
  bonusDesc: {
    es: 'Puedes enviarme tus documentos y te daré feedback personalizado.',
    en: 'You can send me your documents and I\'ll give you personalized feedback.',
    de: 'Du kannst mir deine Dokumente schicken und ich gebe dir persönliches Feedback.',
    fr: 'Tu peux m\'envoyer tes documents et je te donnerai un feedback personnalisé.'
  },
  buyNow: { es: 'OBTENER MI PLAN', en: 'GET MY PLAN', de: 'MEINEN PLAN HOLEN', fr: 'OBTENIR MON PLAN' },
  guarantee: { es: 'Garantía 30 días', en: '30-day guarantee', de: '30 Tage Garantie', fr: 'Garantie 30 jours' },
  guaranteeDesc: {
    es: 'Si no te es útil, te devolvemos el 100%.',
    en: 'If it\'s not useful, we refund 100%.',
    de: 'Wenn es dir nicht nützlich ist, erstatten wir 100%.',
    fr: 'Si ce n\'est pas utile, nous remboursons 100%.'
  },
  thankYou: {
    es: 'Gracias por considerar Solvia. Espero poder ayudarte.',
    en: 'Thank you for considering Solvia. I hope to help you.',
    de: 'Danke, dass du Solvia in Betracht ziehst. Ich hoffe, dir helfen zu können.',
    fr: 'Merci de considérer Solvia. J\'espère pouvoir t\'aider.'
  },
};

// Email base styles - Solvia branded
const getBaseStyles = () => `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f5; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 0 0 12px 12px; }
  .header { background: ${BRAND.gradient}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
  .header img { max-width: 140px; height: auto; margin-bottom: 10px; }
  .header h1 { color: white; margin: 10px 0 0 0; font-size: 22px; font-weight: 600; }
  .content { padding: 35px 30px; }
  .content p { margin: 0 0 16px 0; }
  .situation-box { background: ${BRAND.backgroundLight}; border-left: 4px solid ${BRAND.primary}; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
  .situation-box p { margin: 6px 0; color: #1a1a1a; font-size: 15px; }
  .cta-button { display: inline-block; background: ${BRAND.primary}; color: white !important; text-decoration: none; padding: 18px 48px; border-radius: 8px; font-weight: 700; font-size: 17px; margin: 25px 0; box-shadow: 0 4px 14px rgba(9, 116, 241, 0.35); }
  .cta-button:hover { background: ${BRAND.primaryDark}; }
  .benefits { margin: 25px 0; }
  .benefit { display: flex; align-items: flex-start; margin: 12px 0; font-size: 15px; }
  .benefit-check { color: ${BRAND.primary}; font-size: 18px; margin-right: 12px; flex-shrink: 0; }
  .note { background: #fafafa; border: 1px solid #e5e5e5; padding: 15px 20px; border-radius: 8px; margin: 25px 0; text-align: center; font-size: 14px; color: #666; }
  .footer { background: #f8f8f8; padding: 25px 30px; text-align: center; color: #666; font-size: 13px; border-radius: 0 0 12px 12px; }
  .footer a { color: ${BRAND.primary}; text-decoration: none; }
  .footer-address { margin-top: 10px; font-size: 12px; color: #999; }
`;

// Get email template with language support
const getEmailTemplate = (templateId: string, lead: Lead, paymentUrl: string, lang: Language) => {
  const firstName = lead.first_name || (lang === 'es' ? 'Profesional' : lang === 'de' ? 'Kolleg/in' : lang === 'fr' ? 'Professionnel' : 'Professional');
  const countryKey = lead.target_country?.toLowerCase() || 'germany';
  const country = countryNames[countryKey]?.[lang] || lead.target_country || (lang === 'es' ? 'Europa' : lang === 'de' ? 'Europa' : lang === 'fr' ? 'Europe' : 'Europe');
  const studyCountry = lead.study_country || (lang === 'es' ? 'tu país' : lang === 'de' ? 'deinem Land' : lang === 'fr' ? 'ton pays' : 'your country');
  const languageLevel = lead.language_level || (lang === 'es' ? 'por determinar' : lang === 'de' ? 'noch festzulegen' : lang === 'fr' ? 'à déterminer' : 'to be determined');
  const timeline = getTimeline(lead.language_level, lang);
  const successStory = getSuccessStory(lead.study_country);
  const ui = uiStrings;

  const baseHtml = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${BRAND.logoUrl}" alt="Solvia" onerror="this.style.display='none'" />
      ${title ? `<h1>${title}</h1>` : ''}
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 Solvia | <a href="https://thesolvia.com">thesolvia.com</a></p>
      <p class="footer-address">Solvia GmbH · Berlin, Germany</p>
      <p style="font-size: 11px; color: #aaa; margin-top: 15px;">${ui.unsubscribe[lang]}</p>
    </div>
  </div>
</body>
</html>
  `;

  const templates: Record<string, { subject: string; html: string }> = {
    day0: {
      subject: `${firstName}, ${lang === 'es' ? 'tu plan para' : lang === 'de' ? 'dein Plan für' : lang === 'fr' ? 'ton plan pour' : 'your plan for'} ${country}`,
      html: baseHtml('', `
        <p>${ui.hello[lang]} ${firstName},</p>
        
        <p>${ui.day0Hook[lang]} <strong>${country}</strong>. ${ui.day0Hook2[lang]}</p>
        
        <div class="situation-box">
          <p><strong>📍 ${ui.yourSituation[lang]}:</strong></p>
          <p>• ${ui.originCountry[lang]}: ${studyCountry}</p>
          <p>• ${ui.targetCountry[lang]}: ${country}</p>
          <p>• ${ui.languageLevel[lang]}: ${languageLevel}</p>
          <p>• ${ui.estimatedTime[lang]}: <strong>${timeline}</strong></p>
        </div>
        
        <p><strong>${ui.whatYouGet[lang]}:</strong></p>
        
        <div class="benefits">
          <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit1[lang]}</div>
          <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit2[lang]}</div>
          <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit3[lang]}</div>
        </div>
        
        <div style="text-align: center;">
          <a href="${paymentUrl}" class="cta-button">${ui.unlockPlan[lang]} - €49</a>
        </div>
        
        <div class="note">
          📅 ${ui.includes2026[lang]}
        </div>
        
        <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
      `),
    },
    day1: {
      subject: `${successStory.name}: ${lang === 'es' ? 'de' : lang === 'de' ? 'von' : lang === 'fr' ? 'de' : 'from'} ${successStory.origin.split(',')[1]?.trim() || 'Latinoamérica'} ${lang === 'es' ? 'a' : lang === 'de' ? 'nach' : lang === 'fr' ? 'à' : 'to'} ${country}`,
      html: baseHtml(ui.successStoryTitle[lang], `
        <p>${ui.hello[lang]} ${firstName},</p>
        
        <p>${ui.todayShare[lang]} <strong>${successStory.name}</strong>, ${ui.whoNowWorks[lang]} ${country}${lang === 'de' ? ' arbeitet' : ''}.</p>
        
        <div class="situation-box" style="background: #f8fafc; border-left-color: ${BRAND.primary};">
          <p><strong>${successStory.name}, ${successStory.age} ${lang === 'es' ? 'años' : lang === 'de' ? 'Jahre' : lang === 'fr' ? 'ans' : 'years'}</strong></p>
          <p style="color: #666; font-size: 14px;">${successStory.profession[lang]} · ${successStory.origin}</p>
          
          <blockquote style="font-style: italic; font-size: 16px; color: ${BRAND.primary}; border-left: 3px solid ${BRAND.primary}; padding-left: 15px; margin: 15px 0;">
            "${successStory.quote[lang]}"
          </blockquote>
        </div>
        
        <p><strong>${ui.herTimeline[lang]}:</strong></p>
        
        <div style="background: ${BRAND.backgroundLight}; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="display: flex; margin: 8px 0;"><span style="font-weight: 600; color: ${BRAND.primary}; min-width: 80px;">${ui.month[lang]} 1-3:</span> ${ui.timeline1[lang]}</div>
          <div style="display: flex; margin: 8px 0;"><span style="font-weight: 600; color: ${BRAND.primary}; min-width: 80px;">${ui.month[lang]} 4-8:</span> ${ui.timeline2[lang]}</div>
          <div style="display: flex; margin: 8px 0;"><span style="font-weight: 600; color: ${BRAND.primary}; min-width: 80px;">${ui.month[lang]} 9-11:</span> ${ui.timeline3[lang]}</div>
          <div style="display: flex; margin: 8px 0;"><span style="font-weight: 600; color: ${BRAND.primary}; min-width: 80px;">${ui.month[lang]} 12:</span> ${ui.timeline4[lang]} ✓</div>
          <div style="display: flex; margin: 8px 0;"><span style="font-weight: 600; color: ${BRAND.primary}; min-width: 80px;">${ui.month[lang]} ${successStory.months}:</span> ${ui.timeline5[lang]} 🎉</div>
        </div>
        
        <p>${successStory.name} ${ui.sameRoadmap[lang]}</p>
        
        <div style="text-align: center;">
          <a href="${paymentUrl}" class="cta-button">${ui.viewMyPlan[lang]}</a>
        </div>
        
        <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
      `),
    },
    day3: {
      subject: `⚠️ ${ui.errorsTitle[lang]}`,
      html: baseHtml(ui.errorsTitle[lang], `
        <p>${ui.hello[lang]} ${firstName},</p>
        
        <p>${ui.afterHelping[lang]}</p>
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 18px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px 0;">❌ #1: ${ui.error1Title[lang]}</p>
          <p style="margin: 0; font-size: 14px;">${ui.error1Desc[lang]}</p>
        </div>
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 18px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px 0;">❌ #2: ${ui.error2Title[lang]}</p>
          <p style="margin: 0; font-size: 14px;">${ui.error2Desc[lang]}</p>
        </div>
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 18px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px 0;">❌ #3: ${ui.error3Title[lang]}</p>
          <p style="margin: 0; font-size: 14px;">${ui.error3Desc[lang]}</p>
        </div>
        
        <div class="situation-box">
          <p style="color: ${BRAND.primary}; font-weight: 600; margin: 0 0 10px 0;">✅ ${ui.theSolution[lang]}</p>
          <p style="margin: 0; font-size: 14px;">${ui.benefit1[lang]}, ${ui.benefit2[lang].toLowerCase()}, ${ui.benefit3[lang].toLowerCase()}.</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${paymentUrl}" class="cta-button">${ui.avoidErrors[lang]} - €49</a>
        </div>
        
        <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
      `),
    },
    day5: {
      subject: `${firstName}, ${ui.reminderTitle[lang].toLowerCase()}`,
      html: baseHtml(ui.reminderTitle[lang], `
        <p>${ui.hello[lang]} ${firstName},</p>
        
        <p>${ui.reminderBody[lang]} <strong>${country}</strong>. ${ui.reminderBody2[lang]}</p>
        
        <div class="situation-box">
          <p><strong>📊 ${ui.yourStats[lang]}:</strong></p>
          <p>• ${ui.estimatedTime[lang]}: <strong>${timeline}</strong></p>
          <p>• ${ui.avgSalary[lang]} ${country}: <strong>€60,000-80,000/${lang === 'es' ? 'año' : lang === 'de' ? 'Jahr' : lang === 'fr' ? 'an' : 'year'}</strong></p>
        </div>
        
        <div class="benefits">
          <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit1[lang]}</div>
          <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit2[lang]}</div>
          <div class="benefit"><span class="benefit-check">✓</span> ${ui.benefit3[lang]}</div>
        </div>
        
        <div style="text-align: center;">
          <a href="${paymentUrl}" class="cta-button">${ui.securePrice[lang]}</a>
        </div>
        
        <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
      `),
    },
    day7: {
      subject: `🎁 ${ui.finalOffer[lang]}`,
      html: baseHtml(ui.finalOffer[lang], `
        <p>${ui.hello[lang]} ${firstName},</p>
        
        <p>${ui.lastEmail[lang]}</p>
        
        <p>${ui.addBonus[lang]}</p>
        
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <p style="font-size: 18px; font-weight: 700; color: #92400e; margin: 0 0 8px 0;">🎁 ${ui.bonusConsult[lang]}</p>
          <p style="margin: 0; font-size: 14px; color: #78350f;">${ui.bonusDesc[lang]}</p>
        </div>
        
        <div style="background: ${BRAND.primary}; color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0;">
          <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Digital Starter</p>
          <p style="font-size: 42px; font-weight: 700; margin: 10px 0;">€49</p>
          <a href="${paymentUrl}" style="display: inline-block; background: white; color: ${BRAND.primary} !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 10px 0;">${ui.buyNow[lang]}</a>
        </div>
        
        <div class="note">
          <p style="margin: 0;"><strong>🛡️ ${ui.guarantee[lang]}</strong></p>
          <p style="margin: 8px 0 0 0; font-size: 13px;">${ui.guaranteeDesc[lang]}</p>
        </div>
        
        <p>${ui.thankYou[lang]}</p>
        
        <p>${ui.warmRegards[lang]},<br><strong>${ui.team[lang]}</strong></p>
      `),
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

    const effectiveTestMode = testMode || !!testEmail;

    console.log(`📧 Starting nurture campaign - Segment: ${segment}, Template: ${templateId}, TestMode: ${effectiveTestMode}, TestEmail: ${testEmail || 'none'}, Language override: ${language || 'auto'}`);

    let leads: Lead[] = [];

    if (effectiveTestMode && testEmail) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('*')
        .eq('email', testEmail)
        .single();

      if (existingLead) {
        leads = [existingLead];
      } else {
        leads = [{
          id: 'test-id',
          email: testEmail,
          first_name: 'Test',
          last_name: 'User',
          target_country: 'germany',
          study_country: 'mexico',
          doctor_type: 'general',
          language_level: 'B1',
          email_sequence_day: 0,
          preferred_language: language || null,
        }];
      }
    } else {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('converted', false)
        .or('status.is.null,status.neq.unsubscribed');

      if (error) throw error;
      leads = segmentLeads(data || [], segment);
    }

    console.log(`📊 Found ${leads.length} leads to email`);

    const results = {
      total: leads.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    const paymentUrl = 'https://thesolvia.com/homologation/payment';

    for (const lead of leads) {
      try {
        const emailLang = language || detectLeadLanguage(lead);
        const template = getEmailTemplate(templateId, lead, paymentUrl, emailLang);

        console.log(`📤 Sending ${templateId} email to ${lead.email} in ${emailLang}`);

        const emailResponse = await resend.emails.send({
          from: 'Solvia <hola@thesolvia.com>',
          to: [lead.email],
          subject: template.subject,
          html: template.html,
        });

        console.log(`✅ Email sent to ${lead.email}:`, emailResponse);

        if (!effectiveTestMode) {
          const dayNumber = parseInt(templateId.replace('day', ''));
          await supabase
            .from('leads')
            .update({
              email_sequence_day: dayNumber,
              last_email_sent: new Date().toISOString(),
              email_campaign: templateId,
            })
            .eq('id', lead.id);
        }

        results.sent++;
      } catch (error: any) {
        console.error(`❌ Failed to send to ${lead.email}:`, error);
        results.failed++;
        results.errors.push(`${lead.email}: ${error.message}`);
      }
    }

    console.log(`📧 Campaign complete:`, results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Campaign error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
