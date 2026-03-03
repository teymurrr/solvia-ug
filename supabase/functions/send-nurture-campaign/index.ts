import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// =============================================================================
// EMAIL SYSTEM: Personal, Reply-Focused Approach
// =============================================================================

type Language = 'es' | 'en' | 'de' | 'fr' | 'ru';
type TemplateId = 'feedbackAsk' | 'valueInsight' | 'personalDiagnosis' | 'socialProof' | 'urgencyOffer';

// Shared booking CTA constants
const CALENDLY_URL = 'https://calendly.com/david-rehrl-thesolvia/30min';
const WHATSAPP_URL = 'https://wa.me/4915259018297';

const bookingCTA: Record<Language, string> = {
  es: `---\n¿Quieres hablar con alguien? Reserva una llamada gratuita de 15 minutos:\n${CALENDLY_URL}\n\nO escríbenos directamente por WhatsApp:\n${WHATSAPP_URL}`,
  en: `---\nWant to talk to someone? Book a free 15-min call:\n${CALENDLY_URL}\n\nOr message us directly on WhatsApp:\n${WHATSAPP_URL}`,
  de: `---\nMöchtest du mit jemandem sprechen? Buche ein kostenloses 15-Min-Gespräch:\n${CALENDLY_URL}\n\nOder schreib uns direkt auf WhatsApp:\n${WHATSAPP_URL}`,
  fr: `---\nTu veux parler à quelqu'un ? Réserve un appel gratuit de 15 min :\n${CALENDLY_URL}\n\nOu écris-nous directement sur WhatsApp :\n${WHATSAPP_URL}`,
  ru: `---\nХочешь поговорить? Запиши на бесплатный 15-мин звонок:\n${CALENDLY_URL}\n\nИли напиши нам в WhatsApp:\n${WHATSAPP_URL}`,
};

// Sequence order for validation
const SEQUENCE_ORDER: TemplateId[] = ['feedbackAsk', 'personalDiagnosis', 'socialProof', 'urgencyOffer', 'valueInsight'];

// Country name translations for dynamic templates
const countryNames: Record<string, Record<Language, string>> = {
  germany: { en: 'Germany', es: 'Alemania', de: 'Deutschland', fr: 'Allemagne', ru: 'Германия' },
  austria: { en: 'Austria', es: 'Austria', de: 'Österreich', fr: 'Autriche', ru: 'Австрия' },
  switzerland: { en: 'Switzerland', es: 'Suiza', de: 'Schweiz', fr: 'Suisse', ru: 'Швейцария' },
  spain: { en: 'Spain', es: 'España', de: 'Spanien', fr: 'Espagne', ru: 'Испания' },
  france: { en: 'France', es: 'Francia', de: 'Frankreich', fr: 'France', ru: 'Франция' },
};

const getCountryName = (country: string, lang: Language): string => {
  const key = country.toLowerCase().trim();
  return countryNames[key]?.[lang] || countryNames['germany'][lang];
};

interface CampaignRequest {
  templateId?: TemplateId;
  testMode?: boolean;
  testEmail?: string;
  language?: Language;
  includeAllSources?: boolean;
  leadId?: string; // For per-lead sends from auto-nurture
}

interface EmailRecipient {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  study_country: string | null;
  target_country: string | null;
  doctor_type: string | null;
  language_level: string | null;
  preferred_language: string | null;
  source_table: string;
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

const emailTemplates = {
  feedbackAsk: {
    subject: {
      es: 'Pregunta rápida sobre por qué te registraste',
      en: 'Quick question about why you signed up',
      de: 'Kurze Frage, warum du dich angemeldet hast',
      fr: 'Petite question sur ton inscription',
      ru: 'Короткий вопрос о твоей регистрации'
    },
    greeting: {
      es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,'
    },
    body: {
      es: `te registraste en Solvia hace poco y quería hacer un breve check-in.

Normalmente, cuando alguien se registra es porque tiene un problema muy concreto (reconocimiento de título, encontrar hospital, exámenes de idioma, mudanza, etc.).

Estoy trabajando en la próxima versión y quería preguntarte directamente:

¿con qué esperabas que Solvia te ayudara?

Una frase corta es más que suficiente.`,
      en: `You signed up to Solvia a while ago — quick check-in from my side.

When people sign up, it's usually because of one specific problem (diploma recognition, finding a hospital, language exams, relocation).

I'm currently shaping the next version and wanted to ask you directly:

What were you hoping Solvia would help you with?

One short sentence is more than enough.`,
      de: `Du hast dich vor kurzem bei Solvia angemeldet — ich wollte mich kurz melden.

Wenn sich jemand anmeldet, ist es meistens wegen eines bestimmten Problems (Anerkennung, Krankenhaus finden, Sprachprüfungen, Umzug).

Ich arbeite gerade an der nächsten Version und wollte dich direkt fragen:

Wobei hattest du gehofft, dass Solvia dir helfen kann?

Ein kurzer Satz reicht völlig aus.`,
      fr: `Tu t'es inscrit(e) sur Solvia il y a quelques temps — je voulais faire un petit check-in.

Quand quelqu'un s'inscrit, c'est généralement pour un problème spécifique (reconnaissance de diplôme, trouver un hôpital, examens de langue, déménagement).

Je travaille sur la prochaine version et je voulais te demander directement:

Qu'est-ce que tu espérais que Solvia t'aide à faire?

Une courte phrase suffit amplement.`,
      ru: `Ты недавно зарегистрировался в Solvia — хотел просто узнать, как дела.

Обычно люди регистрируются из-за конкретной проблемы (признание диплома, поиск больницы, языковые экзамены, переезд).

Я сейчас работаю над следующей версией и хотел спросить напрямую:

Чем ты надеялся, что Solvia тебе поможет?

Одного короткого предложения вполне достаточно.`
    },
    signature: {
      es: 'Gracias,\n\nDavid', en: 'Thanks,\n\nDavid', de: 'Danke,\n\nDavid', fr: 'Merci,\n\nDavid', ru: 'Спасибо,\n\nDavid'
    }
  },

  valueInsight: {
    subject: {
      es: 'Lo que muchos médicos subestiman al mudarse a {{TARGET_COUNTRY}}',
      en: 'What most doctors underestimate about moving to {{TARGET_COUNTRY}}',
      de: 'Was die meisten Ärzte beim Umzug nach {{TARGET_COUNTRY}} unterschätzen',
      fr: 'Ce que la plupart des médecins sous-estiment en déménageant en {{TARGET_COUNTRY}}',
      ru: 'Что большинство врачей недооценивают при переезде в {{TARGET_COUNTRY}}'
    },
    greeting: {
      es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,'
    },
    body: {
      es: `Un dato rápido de trabajar con médicos internacionales:

Los mayores retrasos no vienen del idioma — vienen del proceso de reconocimiento de documentos.

Hemos visto a personas perder 6-12 meses solo por este paso.

Si todavía estás considerando {{TARGET_COUNTRY}} y quieres evitar eso, con gusto te explico tus opciones.`,
      en: `A quick insight from working with international doctors:

The biggest delays don't come from language — they come from the document recognition process.

We've seen people lose 6-12 months just because of this step.

If you're still considering {{TARGET_COUNTRY}} and want to avoid that, I'm happy to explain your options.`,
      de: `Ein kurzer Einblick aus der Arbeit mit internationalen Ärzten:

Die größten Verzögerungen kommen nicht von der Sprache — sie kommen vom Anerkennungsprozess der Dokumente.

Wir haben gesehen, wie Menschen 6-12 Monate nur wegen dieses Schrittes verloren haben.

Wenn du immer noch {{TARGET_COUNTRY}} in Betracht ziehst und das vermeiden möchtest, erkläre ich dir gerne deine Optionen.`,
      fr: `Un aperçu rapide de mon travail avec des médecins internationaux:

Les plus grands retards ne viennent pas de la langue — ils viennent du processus de reconnaissance des documents.

Nous avons vu des gens perdre 6-12 mois juste à cause de cette étape.

Si tu considères toujours {{TARGET_COUNTRY}} et que tu veux éviter ça, je t'explique volontiers tes options.`,
      ru: `Быстрый инсайт из работы с международными врачами:

Самые большие задержки происходят не из-за языка — они из-за процесса признания документов.

Мы видели, как люди теряли 6-12 месяцев только из-за этого шага.

Если ты все еще рассматриваешь {{TARGET_COUNTRY}} и хочешь этого избежать, я с удовольствием объясню твои варианты.`
    },
    signature: {
      es: 'Saludos,\n\nDavid', en: 'Best,\n\nDavid', de: 'Beste Grüße,\n\nDavid', fr: 'Cordialement,\n\nDavid', ru: 'С уважением,\n\nDavid'
    }
  },

  personalDiagnosis: {
    subject: {
      es: 'He revisado tu caso — esto es lo que necesitas',
      en: 'I looked at your case — here\'s what you need',
      de: 'Ich habe deinen Fall angeschaut — das brauchst du',
      fr: 'J\'ai regardé ton dossier — voici ce qu\'il te faut',
      ru: 'Я изучил твой случай — вот что тебе нужно'
    },
    greeting: {
      es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,'
    },
    body: {
      es: `He estado revisando los perfiles de personas que se registraron recientemente en Solvia — incluyendo el tuyo.

Tu situación es bastante clara: necesitas preparar tus documentos, completar los requisitos lingüísticos y presentar tu solicitud en el orden correcto. El problema es que la mayoría de médicos no saben por dónde empezar, y eso les cuesta meses de retraso.

Hemos creado una hoja de ruta personalizada basada en tu perfil que te muestra exactamente qué hacer, paso a paso.

Puedes ver tu plan completo aquí:
{{RESULTS_LINK}}

Si tienes dudas sobre algún paso, simplemente responde a este email.`,
      en: `I've been reviewing profiles of people who recently signed up on Solvia — including yours.

Your situation is fairly straightforward: you need to prepare your documents, complete language requirements, and submit your application in the right order. The problem is most doctors don't know where to start, and that costs them months of delay.

We've built a personalized roadmap based on your profile that shows you exactly what to do, step by step.

You can see your full plan here:
{{RESULTS_LINK}}

If you have questions about any step, just reply to this email.`,
      de: `Ich habe die Profile der Leute durchgesehen, die sich kürzlich bei Solvia angemeldet haben — deins eingeschlossen.

Deine Situation ist ziemlich klar: Du musst deine Dokumente vorbereiten, die Sprachanforderungen erfüllen und deinen Antrag in der richtigen Reihenfolge einreichen. Das Problem ist, dass die meisten Ärzte nicht wissen, wo sie anfangen sollen, und das kostet sie Monate.

Wir haben einen personalisierten Fahrplan basierend auf deinem Profil erstellt, der dir Schritt für Schritt zeigt, was zu tun ist.

Deinen vollständigen Plan kannst du hier einsehen:
{{RESULTS_LINK}}

Wenn du Fragen zu einem Schritt hast, antworte einfach auf diese E-Mail.`,
      fr: `J'ai passé en revue les profils des personnes récemment inscrites sur Solvia — dont le tien.

Ta situation est assez claire : tu dois préparer tes documents, remplir les conditions linguistiques et soumettre ta demande dans le bon ordre. Le problème, c'est que la plupart des médecins ne savent pas par où commencer, et ça leur coûte des mois de retard.

Nous avons créé une feuille de route personnalisée basée sur ton profil qui te montre exactement quoi faire, étape par étape.

Tu peux voir ton plan complet ici :
{{RESULTS_LINK}}

Si tu as des questions sur une étape, réponds simplement à cet email.`,
      ru: `Я просматривал профили людей, которые недавно зарегистрировались на Solvia — включая твой.

Твоя ситуация довольно понятная: тебе нужно подготовить документы, выполнить языковые требования и подать заявление в правильном порядке. Проблема в том, что большинство врачей не знают, с чего начать, и это стоит им месяцев задержки.

Мы создали персонализированный план на основе твоего профиля, который показывает, что именно делать шаг за шагом.

Ты можешь увидеть свой полный план здесь:
{{RESULTS_LINK}}

Если есть вопросы по какому-то шагу, просто ответь на это письмо.`
    },
    signature: {
      es: 'Saludos,\n\nDavid', en: 'Best,\n\nDavid', de: 'Beste Grüße,\n\nDavid', fr: 'Cordialement,\n\nDavid', ru: 'С уважением,\n\nDavid'
    }
  },

  socialProof: {
    subject: {
      es: 'Cómo una doctora obtuvo su Approbation en 7 meses',
      en: 'How a doctor got her Approbation in 7 months',
      de: 'Wie eine Ärztin ihre Approbation in 7 Monaten bekam',
      fr: 'Comment une médecin a obtenu son Approbation en 7 mois',
      ru: 'Как врач получила свою Approbation за 7 месяцев'
    },
    greeting: {
      es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,'
    },
    body: {
      es: `Quería compartir algo que puede interesarte.

La Dra. María se registró en Solvia en una situación similar a la tuya: médica internacional que quería ejercer en {{TARGET_COUNTRY}} pero no sabía cómo navegar el proceso de reconocimiento.

Con un plan paso a paso y acompañamiento personalizado, completó todo el proceso en 7 meses — desde la preparación de documentos hasta la Approbation final.

¿La diferencia? No intentó hacerlo sola. Siguió un plan estructurado que le evitó los errores típicos que retrasan el proceso 6-12 meses.

Tú puedes empezar hoy desde €150 con nuestros paquetes de homologación:
{{PAYMENT_LINK}}

Incluye guía experta paso a paso, revisión personal de documentos y soporte prioritario.`,
      en: `I wanted to share something that might interest you.

Dr. Maria signed up on Solvia in a situation similar to yours: an international doctor wanting to practice in {{TARGET_COUNTRY}} but unsure how to navigate the recognition process.

With a step-by-step plan and personalized guidance, she completed the entire process in 7 months — from document preparation to final Approbation.

The difference? She didn't try to do it alone. She followed a structured plan that helped her avoid the typical mistakes that delay the process by 6-12 months.

You can start today from €150 with our homologation packages:
{{PAYMENT_LINK}}

It includes step-by-step expert guidance, personal document review, and priority support.`,
      de: `Ich wollte etwas teilen, das dich interessieren könnte.

Dr. Maria hat sich bei Solvia in einer ähnlichen Situation wie du angemeldet: internationale Ärztin, die in {{TARGET_COUNTRY}} arbeiten wollte, aber nicht wusste, wie sie den Anerkennungsprozess navigieren sollte.

Mit einem Schritt-für-Schritt-Plan und persönlicher Begleitung hat sie den gesamten Prozess in 7 Monaten abgeschlossen — von der Dokumentenvorbereitung bis zur finalen Approbation.

Der Unterschied? Sie hat es nicht alleine versucht. Sie ist einem strukturierten Plan gefolgt, der ihr die typischen Fehler erspart hat, die den Prozess um 6-12 Monate verzögern.

Du kannst heute ab €150 mit unseren Homologationspaketen starten:
{{PAYMENT_LINK}}

Es enthält Schritt-für-Schritt Expertenbegleitung, persönliche Dokumentenprüfung und Priority-Support.`,
      fr: `Je voulais partager quelque chose qui pourrait t'intéresser.

La Dr. Maria s'est inscrite sur Solvia dans une situation similaire à la tienne : médecin internationale voulant exercer en {{TARGET_COUNTRY}} mais ne sachant pas comment naviguer le processus de reconnaissance.

Avec un plan étape par étape et un accompagnement personnalisé, elle a complété tout le processus en 7 mois — de la préparation des documents à l'Approbation finale.

La différence ? Elle n'a pas essayé de le faire seule. Elle a suivi un plan structuré qui lui a évité les erreurs typiques qui retardent le processus de 6 à 12 mois.

Tu peux commencer aujourd'hui à partir de 150 € avec nos forfaits d'homologation :
{{PAYMENT_LINK}}

Il inclut un accompagnement expert étape par étape, une révision personnelle des documents et un support prioritaire.`,
      ru: `Хотел поделиться кое-чем, что может тебя заинтересовать.

Доктор Мария зарегистрировалась на Solvia в ситуации, похожей на твою: международный врач, которая хотела практиковать в {{TARGET_COUNTRY}}, но не знала, как пройти процесс признания.

С пошаговым планом и персональным сопровождением она завершила весь процесс за 7 месяцев — от подготовки документов до финальной Approbation.

В чём разница? Она не пыталась сделать это в одиночку. Она следовала структурированному плану, который помог избежать типичных ошибок, задерживающих процесс на 6-12 месяцев.

Ты можешь начать сегодня от €150 с нашими пакетами гомологации:
{{PAYMENT_LINK}}

Он включает пошаговое экспертное сопровождение, персональную проверку документов и приоритетную поддержку.`
    },
    signature: {
      es: 'Saludos,\n\nDavid', en: 'Best,\n\nDavid', de: 'Beste Grüße,\n\nDavid', fr: 'Cordialement,\n\nDavid', ru: 'С уважением,\n\nDavid'
    }
  },

  urgencyOffer: {
    subject: {
      es: 'Cada mes que esperas es un mes de salario perdido',
      en: 'Every month you wait is a month of salary lost',
      de: 'Jeder Monat, den du wartest, ist ein verlorenes Monatsgehalt',
      fr: 'Chaque mois d\'attente est un mois de salaire perdu',
      ru: 'Каждый месяц ожидания — потерянный месяц зарплаты'
    },
    greeting: {
      es: 'Hola,', en: 'Hi,', de: 'Hallo,', fr: 'Salut,', ru: 'Привет,'
    },
    body: {
      es: `Quería ponerte las cosas en perspectiva.

Un médico en {{TARGET_COUNTRY}} gana entre €5.000 y €7.000 al mes. Cada mes que esperas para iniciar tu homologación es un mes de ese salario que pierdes.

Tenemos tres opciones según lo que necesites:

• Homologación Digital (desde €150) — Plantillas, checklists y guía paso a paso
• Asistencia Personal (desde €250) — Todo lo anterior más case manager personal y comunicación con autoridades
• Todo Incluido (desde €350) — Nos encargamos de todo: traducciones, tasas, comunicación con autoridades

Para comparar: agencias similares cobran entre €8.000 y €20.000.

Puedes ver las opciones aquí:
{{PAYMENT_LINK}}

Si quieres que te ayude a elegir la mejor opción para tu caso, simplemente responde a este email.`,
      en: `I wanted to put things in perspective for you.

A doctor in {{TARGET_COUNTRY}} earns between €5,000 and €7,000 per month. Every month you wait to start your homologation is a month of that salary you're missing out on.

We have three options depending on what you need:

• Digital Homologation (from €150) — Templates, checklists, and step-by-step guide
• Personal Assistance (from €250) — Everything above plus personal case manager and authority communication
• Full All-Inclusive (from €350) — We handle everything: translations, fees, authority communication

For comparison: similar agencies charge €8,000–€20,000.

You can see the options here:
{{PAYMENT_LINK}}

If you'd like help choosing the best option for your situation, just reply to this email.`,
      de: `Ich wollte dir die Dinge in Perspektive setzen.

Ein Arzt in {{TARGET_COUNTRY}} verdient zwischen €5.000 und €7.000 pro Monat. Jeder Monat, den du wartest, ist ein Monat dieses Gehalts, den du verlierst.

Wir haben drei Optionen je nach Bedarf:

• Digitale Homologation (ab €150) — Vorlagen, Checklisten und Schritt-für-Schritt-Anleitung
• Persönliche Assistenz (ab €289) — Alles oben plus persönlicher Case Manager und Behördenkommunikation
• Komplett All-Inclusive (ab €1.900) — Wir kümmern uns um alles: Übersetzungen, Gebühren, Behördenkommunikation


Zum Vergleich: Ähnliche Agenturen verlangen €8.000–€20.000.

Du kannst die Optionen hier sehen:
{{PAYMENT_LINK}}

Wenn du Hilfe bei der Auswahl brauchst, antworte einfach auf diese E-Mail.`,
      fr: `Je voulais mettre les choses en perspective pour toi.

Un médecin en {{TARGET_COUNTRY}} gagne entre 5 000 et 7 000 € par mois. Chaque mois que tu attends, c'est un mois de ce salaire que tu perds.

Nous avons trois options selon tes besoins :

• Homologation Digitale (à partir de 150 €) — Modèles, checklists et guide étape par étape
• Assistance Personnelle (à partir de 250 €) — Tout ci-dessus plus case manager personnel et communication avec les autorités
• Tout Inclus (à partir de 350 €) — On s'occupe de tout : traductions, frais, communication avec les autorités

Pour comparer : des agences similaires facturent 8 000 à 20 000 €.

Tu peux voir les options ici :
{{PAYMENT_LINK}}

Si tu veux de l'aide pour choisir, réponds simplement à cet email.`,
      ru: `Хотел поставить вещи в перспективу.

Врач в {{TARGET_COUNTRY}} зарабатывает от €5.000 до €7.000 в месяц. Каждый месяц ожидания — это месяц этой зарплаты, который ты теряешь.

У нас три варианта в зависимости от потребностей:

• Цифровая Гомологация (от €150) — Шаблоны, чеклисты и пошаговое руководство
• Персональная Помощь (от €250) — Всё вышеперечисленное плюс персональный менеджер и общение с властями
• Всё Включено (от €350) — Мы берём всё на себя: переводы, пошлины, общение с властями

Для сравнения: похожие агентства берут €8.000–€20.000.

Варианты можно посмотреть здесь:
{{PAYMENT_LINK}}

Если нужна помощь с выбором, просто ответь на это письмо.`
    },
    signature: {
      es: 'Saludos,\n\nDavid', en: 'Best,\n\nDavid', de: 'Beste Grüße,\n\nDavid', fr: 'Cordialement,\n\nDavid', ru: 'С уважением,\n\nDavid'
    }
  }
};

// =============================================================================
// LANGUAGE DETECTION
// =============================================================================

const spanishCountries = [
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia', 
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico',
  'spain', 'españa'
];

const germanCountries = ['germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz'];
const frenchCountries = ['france', 'belgium', 'belgique', 'switzerland', 'suisse', 'canada', 'morocco', 'algeria', 'tunisia'];
const russianCountries = ['russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan', 'kyrgyzstan'];

const spanishTLDs = ['.es', '.ar', '.mx', '.co', '.cl', '.pe', '.ve', '.ec', '.uy', '.py', '.bo', '.cr', '.gt', '.hn', '.sv', '.ni', '.pa', '.do', '.cu'];
const germanTLDs = ['.de', '.at', '.ch'];
const frenchTLDs = ['.fr', '.be'];
const russianTLDs = ['.ru', '.by', '.kz', '.uz'];

const detectLanguageFromEmailTLD = (email: string): Language | null => {
  const domain = email.toLowerCase().split('@')[1] || '';
  if (spanishTLDs.some(tld => domain.endsWith(tld))) return 'es';
  if (germanTLDs.some(tld => domain.endsWith(tld))) return 'de';
  if (frenchTLDs.some(tld => domain.endsWith(tld))) return 'fr';
  if (russianTLDs.some(tld => domain.endsWith(tld))) return 'ru';
  return null;
};

const detectLanguage = (recipient: EmailRecipient): Language => {
  if (recipient.preferred_language) {
    const pref = recipient.preferred_language.toLowerCase();
    if (['es', 'de', 'en', 'fr', 'ru'].includes(pref)) return pref as Language;
  }
  const study = (recipient.study_country || '').toLowerCase();
  if (spanishCountries.some(c => study.includes(c))) return 'es';
  if (germanCountries.some(c => study.includes(c))) return 'de';
  if (frenchCountries.some(c => study.includes(c))) return 'fr';
  if (russianCountries.some(c => study.includes(c))) return 'ru';
  const tldLang = detectLanguageFromEmailTLD(recipient.email);
  if (tldLang) return tldLang;
  return 'en';
};

// =============================================================================
// EMAIL HTML GENERATION (with booking CTA injected automatically)
// =============================================================================

const generatePlainEmail = (greeting: string, body: string, signature: string, lang: Language): string => {
  // Append booking CTA before signature
  const bodyWithCTA = body + '\n\n' + bookingCTA[lang];
  
  const bodyHtml = bodyWithCTA
    .split('\n\n')
    .map(paragraph => `<p style="margin: 0 0 16px 0;">${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background-color: #ffffff;
    }
    p { margin: 0 0 16px 0; }
  </style>
</head>
<body>
  <p style="margin: 0 0 16px 0;">${greeting}</p>
  ${bodyHtml}
  <p style="margin: 24px 0 0 0; white-space: pre-line;">${signature}</p>
</body>
</html>`;
};

// =============================================================================
// DEDUPLICATION & SEQUENCE VALIDATION
// =============================================================================

const checkAlreadySent = async (
  supabase: ReturnType<typeof createClient>,
  email: string,
  templateId: TemplateId
): Promise<boolean> => {
  const { data } = await supabase
    .from('email_sends')
    .select('id')
    .eq('template_id', templateId)
    .ilike('email', email)
    .limit(1);
  return (data && data.length > 0);
};

// Sequence validation: ensure previous step was sent before allowing current step
const validateSequenceOrder = async (
  supabase: ReturnType<typeof createClient>,
  email: string,
  templateId: TemplateId
): Promise<{ valid: boolean; reason?: string }> => {
  const currentIndex = SEQUENCE_ORDER.indexOf(templateId);
  if (currentIndex <= 0) return { valid: true }; // feedbackAsk is always valid
  
  const previousTemplate = SEQUENCE_ORDER[currentIndex - 1];
  const { data } = await supabase
    .from('email_sends')
    .select('id')
    .eq('template_id', previousTemplate)
    .ilike('email', email)
    .limit(1);
  
  if (!data || data.length === 0) {
    return { valid: false, reason: `Previous step '${previousTemplate}' not sent yet` };
  }
  return { valid: true };
};

// =============================================================================
// LOG EMAIL SEND
// =============================================================================

const logEmailSend = async (
  supabase: ReturnType<typeof createClient>,
  recipient: EmailRecipient,
  templateId: TemplateId,
  language: Language,
  resendEmailId: string | null,
  status: 'sent' | 'failed'
): Promise<void> => {
  try {
    await supabase.from('email_sends').insert({
      email: recipient.email.toLowerCase(),
      template_id: templateId,
      language,
      lead_id: recipient.source_table === 'leads' ? recipient.id : null,
      source_table: recipient.source_table,
      resend_email_id: resendEmailId,
      status
    });
  } catch (err) {
    console.error(`[logEmailSend] Error logging send for ${recipient.email}:`, err);
  }
};

// =============================================================================
// MAIN HANDLER
// =============================================================================

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body: CampaignRequest = await req.json().catch(() => ({}));
    const { 
      templateId = 'feedbackAsk', 
      testMode = false, 
      testEmail, 
      language,
      includeAllSources = false,
      leadId
    } = body;

    console.log(`[send-nurture-campaign] Starting. Test: ${testMode}, Template: ${templateId}, LeadId: ${leadId || 'batch'}`);

    if (!['feedbackAsk', 'valueInsight', 'personalDiagnosis', 'socialProof', 'urgencyOffer'].includes(templateId)) {
      return new Response(
        JSON.stringify({ error: `Invalid template: ${templateId}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let recipients: EmailRecipient[] = [];

    if (testMode && testEmail) {
      recipients = [{
        id: 'test-lead',
        email: testEmail,
        first_name: null,
        last_name: null,
        preferred_language: language || 'es',
        study_country: 'Colombia',
        target_country: 'germany',
        doctor_type: 'general',
        language_level: 'B1',
        source_table: 'test'
      }];
    } else if (leadId) {
      // Per-lead mode: fetch single lead by ID (used by auto-nurture-sequence)
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('id, email, first_name, last_name, study_country, target_country, doctor_type, language_level, preferred_language')
        .eq('id', leadId)
        .single();

      if (leadError || !leadData) {
        return new Response(
          JSON.stringify({ error: `Lead not found: ${leadId}` }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      recipients = [{ ...leadData, source_table: 'leads' }];
    } else {
      // Batch mode
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('id, email, first_name, last_name, study_country, target_country, doctor_type, language_level, preferred_language')
        .eq('status', 'new')
        .not('email', 'is', null)
        .limit(100);

      if (leadsError) throw leadsError;

      recipients = (leadsData || []).map(l => ({ ...l, source_table: 'leads' }));

      if (includeAllSources) {
        const { data: learningData } = await supabase
          .from('learning_form_submissions')
          .select('id, email, full_name, country, preferred_language')
          .not('email', 'is', null)
          .limit(50);

        if (learningData) {
          for (const l of learningData) {
            const [firstName, ...lastParts] = (l.full_name || '').split(' ');
            recipients.push({
              id: l.id,
              email: l.email,
              first_name: firstName || null,
              last_name: lastParts.join(' ') || null,
              study_country: l.country,
              target_country: null,
              doctor_type: null,
              language_level: null,
              preferred_language: l.preferred_language,
              source_table: 'learning_form_submissions'
            });
          }
        }
      }

      console.log(`[send-nurture-campaign] Found ${recipients.length} potential recipients`);
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No recipients found", sent: 0, skipped: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const results = { sent: 0, skipped: 0, failed: 0, errors: [] as string[] };
    const template = emailTemplates[templateId];

    for (const recipient of recipients) {
      try {
        if (!testMode) {
          // Dedup check
          const alreadySent = await checkAlreadySent(supabase, recipient.email, templateId);
          if (alreadySent) {
            console.log(`[send-nurture-campaign] Skipping ${recipient.email} - already received ${templateId}`);
            results.skipped++;
            continue;
          }

          // Sequence validation: ensure previous step was sent (skip in test mode or for feedbackAsk)
          const seqCheck = await validateSequenceOrder(supabase, recipient.email, templateId);
          if (!seqCheck.valid) {
            console.log(`[send-nurture-campaign] Skipping ${recipient.email} - ${seqCheck.reason}`);
            results.skipped++;
            continue;
          }
        }

        const lang = language || detectLanguage(recipient);
        
        const baseUrl = 'https://solvia-flexkapg.lovable.app';
        const targetCountry = recipient.target_country || 'germany';
        const translatedCountry = getCountryName(targetCountry, lang);
        const utmSource = `email_${templateId}`;
        let emailBody = template.body[lang]
          .replace(/\{\{TARGET_COUNTRY\}\}/g, translatedCountry)
          .replace(/\{\{RESULTS_LINK\}\}/g, `${baseUrl}/homologation-result?country=${encodeURIComponent(targetCountry)}&utm_source=${utmSource}`)
          .replace(/\{\{PAYMENT_LINK\}\}/g, `${baseUrl}/payment?country=${encodeURIComponent(targetCountry)}&utm_source=${utmSource}`);

        const emailSubject = template.subject[lang].replace(/\{\{TARGET_COUNTRY\}\}/g, translatedCountry);

        const html = generatePlainEmail(
          template.greeting[lang],
          emailBody,
          template.signature[lang],
          lang
        );

        console.log(`[send-nurture-campaign] Sending ${templateId} to ${recipient.email} in ${lang}`);

        const emailResponse = await resend.emails.send({
          from: "David from Solvia <david@thesolvia.com>",
          to: [recipient.email],
          subject: emailSubject,
          html,
          reply_to: "David.rehrl@thesolvia.com"
        });

        const resendEmailId = emailResponse?.data?.id || null;

        if (!testMode) {
          await logEmailSend(supabase, recipient, templateId, lang, resendEmailId, 'sent');

          if (recipient.source_table === 'leads') {
            await supabase
              .from('leads')
              .update({
                email_sequence_day: ({ feedbackAsk: 1, personalDiagnosis: 2, socialProof: 3, urgencyOffer: 4, valueInsight: 5 } as Record<string, number>)[templateId] || 1,
                last_email_sent: new Date().toISOString(),
                email_campaign: templateId
              })
              .eq('id', recipient.id);
          }
        }

        results.sent++;
      } catch (emailError: any) {
        console.error(`[send-nurture-campaign] Error sending to ${recipient.email}:`, emailError);
        results.failed++;
        results.errors.push(`${recipient.email}: ${emailError.message}`);
        
        if (!testMode) {
          await logEmailSend(supabase, recipient, templateId, 'en', null, 'failed');
        }
      }
    }

    console.log(`[send-nurture-campaign] Complete. Sent: ${results.sent}, Skipped: ${results.skipped}, Failed: ${results.failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${results.sent}, skipped ${results.skipped} (already sent), failed ${results.failed}`,
        templateId,
        ...results
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("[send-nurture-campaign] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
