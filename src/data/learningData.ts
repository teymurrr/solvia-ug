export interface CountryLanguageData {
  id: string;
  name: Record<string, string>;
  flag: string;
  language: Record<string, string>;
  exams: string[];
  averageSalary: number;
  currency: string;
}

export interface CourseData {
  id: string;
  country: string;
  language: string;
  levels: string;
  includes: string[];
}

export interface TestimonialData {
  name: string;
  profession: Record<string, string>;
  country: string;
  targetCountry: string;
  quote: Record<string, string>;
  image: string;
}

export interface FAQData {
  question: Record<string, string>;
  answer: Record<string, string>;
}

export const countries: CountryLanguageData[] = [
  {
    id: 'germany',
    name: {
      es: 'Alemania',
      en: 'Germany',
      de: 'Deutschland',
      fr: 'Allemagne',
      ru: 'Германия'
    },
    flag: '🇩🇪',
    language: {
      es: 'Alemán',
      en: 'German',
      de: 'Deutsch',
      fr: 'Allemand',
      ru: 'Немецкий'
    },
    exams: ['FSP', 'TELC Medizin B2-C1'],
    averageSalary: 6500,
    currency: '€'
  },
  {
    id: 'austria',
    name: {
      es: 'Austria',
      en: 'Austria',
      de: 'Österreich',
      fr: 'Autriche',
      ru: 'Австрия'
    },
    flag: '🇦🇹',
    language: {
      es: 'Alemán',
      en: 'German',
      de: 'Deutsch',
      fr: 'Allemand',
      ru: 'Немецкий'
    },
    exams: ['Gleichwertigkeitsprüfung', 'ÖSD Medizin'],
    averageSalary: 6000,
    currency: '€'
  },
  {
    id: 'spain',
    name: {
      es: 'España',
      en: 'Spain',
      de: 'Spanien',
      fr: 'Espagne',
      ru: 'Испания'
    },
    flag: '🇪🇸',
    language: {
      es: 'Español',
      en: 'Spanish',
      de: 'Spanisch',
      fr: 'Espagnol',
      ru: 'Испанский'
    },
    exams: ['DELE Médico'],
    averageSalary: 4000,
    currency: '€'
  }
];

export const languageLevels = [
  { id: 'beginner', level: 'A1' },
  { id: 'intermediate', level: 'A2-B1' },
  { id: 'advanced', level: 'B2-C1' },
  { id: 'fluent', level: 'native' },
  { id: 'unknown', level: 'test' }
];

export const professions = [
  { id: 'general', key: 'generalPractitioner' },
  { id: 'specialist', key: 'specialist' },
  { id: 'nurse', key: 'nurse' },
  { id: 'other', key: 'otherHealthcare' }
];

export const testimonialsByCountry: TestimonialData[] = [
  // Germany testimonials
  {
    name: "Dr. Sofia Ramirez",
    profession: {
      es: "Médica General",
      en: "General Practitioner",
      de: "Allgemeinärztin",
      fr: "Médecin Généraliste",
      ru: "Терапевт"
    },
    country: "Colombia",
    targetCountry: "germany",
    quote: {
      es: "Estaba preocupada por aprender alemán mientras trabajaba tiempo completo, pero Solvia lo hizo muy manejable. El enfoque médico me ayudó a sentirme segura hablando con pacientes.",
      en: "I was worried about learning German while working full time, but Solvia made it so manageable. The medical focus helped me feel confident speaking with patients.",
      de: "Ich war besorgt, Deutsch zu lernen während ich Vollzeit arbeitete, aber Solvia hat es so handhabbar gemacht. Der medizinische Fokus half mir, selbstbewusst mit Patienten zu sprechen.",
      fr: "J'étais inquiète d'apprendre l'allemand tout en travaillant à temps plein, mais Solvia l'a rendu si gérable. L'accent médical m'a aidée à me sentir confiante avec les patients.",
      ru: "Я беспокоилась об изучении немецкого, работая полный день, но Solvia сделала это очень удобным. Медицинский фокус помог мне чувствовать себя уверенно с пациентами."
    },
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Dr. Luis Herrera",
    profession: {
      es: "Residente de Medicina Interna",
      en: "Internal Medicine Resident",
      de: "Assistenzarzt für Innere Medizin",
      fr: "Résident en Médecine Interne",
      ru: "Ординатор по внутренней медицине"
    },
    country: "Mexico",
    targetCountry: "germany",
    quote: {
      es: "La mentoría FSP fue un cambio total. ¡Aprobé mi examen en el primer intento! Me dieron casos reales para practicar.",
      en: "The FSP mentoring was a game changer. I passed my exam on the first try! They gave me real cases to practice with.",
      de: "Das FSP-Mentoring war ein Wendepunkt. Ich habe meine Prüfung beim ersten Versuch bestanden! Sie gaben mir echte Fälle zum Üben.",
      fr: "Le mentorat FSP a tout changé. J'ai réussi mon examen du premier coup ! Ils m'ont donné de vrais cas pour pratiquer.",
      ru: "Наставничество FSP стало переломным моментом. Я сдал экзамен с первой попытки! Мне дали реальные случаи для практики."
    },
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
  },
  // France testimonials
  {
    name: "Dr. Ana García",
    profession: {
      es: "Cardióloga",
      en: "Cardiologist",
      de: "Kardiologin",
      fr: "Cardiologue",
      ru: "Кардиолог"
    },
    country: "Argentina",
    targetCountry: "france",
    quote: {
      es: "El curso de francés médico me preparó perfectamente para trabajar en París. La terminología clínica fue exactamente lo que necesitaba.",
      en: "The medical French course prepared me perfectly to work in Paris. The clinical terminology was exactly what I needed.",
      de: "Der medizinische Französischkurs hat mich perfekt auf die Arbeit in Paris vorbereitet. Die klinische Terminologie war genau das, was ich brauchte.",
      fr: "Le cours de français médical m'a parfaitement préparée à travailler à Paris. La terminologie clinique était exactement ce dont j'avais besoin.",
      ru: "Курс медицинского французского идеально подготовил меня к работе в Париже. Клиническая терминология была именно тем, что мне нужно."
    },
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face"
  },
  // Italy testimonials
  {
    name: "Dr. Marco Silva",
    profession: {
      es: "Cirujano",
      en: "Surgeon",
      de: "Chirurg",
      fr: "Chirurgien",
      ru: "Хирург"
    },
    country: "Brazil",
    targetCountry: "italy",
    quote: {
      es: "Aprender italiano médico con Solvia me abrió las puertas a trabajar en Milán. Los casos clínicos reales hicieron toda la diferencia.",
      en: "Learning medical Italian with Solvia opened doors for me to work in Milan. The real clinical cases made all the difference.",
      de: "Medizinisches Italienisch mit Solvia zu lernen öffnete mir Türen zur Arbeit in Mailand. Die echten klinischen Fälle machten den Unterschied.",
      fr: "Apprendre l'italien médical avec Solvia m'a ouvert les portes pour travailler à Milan. Les vrais cas cliniques ont fait toute la différence.",
      ru: "Изучение медицинского итальянского с Solvia открыло мне двери для работы в Милане. Реальные клинические случаи сделали всю разницу."
    },
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face"
  },
  // Spain testimonials
  {
    name: "Dr. Camila Torres",
    profession: {
      es: "Pediatra",
      en: "Pediatrician",
      de: "Kinderärztin",
      fr: "Pédiatre",
      ru: "Педиатр"
    },
    country: "Chile",
    targetCountry: "spain",
    quote: {
      es: "El curso de español médico perfeccionó mi comunicación profesional. Ahora trabajo en Barcelona con total confianza.",
      en: "The medical Spanish course perfected my professional communication. Now I work in Barcelona with complete confidence.",
      de: "Der medizinische Spanischkurs perfektionierte meine professionelle Kommunikation. Jetzt arbeite ich in Barcelona mit vollem Vertrauen.",
      fr: "Le cours d'espagnol médical a perfectionné ma communication professionnelle. Maintenant je travaille à Barcelone en toute confiance.",
      ru: "Курс медицинского испанского усовершенствовал мою профессиональную коммуникацию. Теперь я работаю в Барселоне с полной уверенностью."
    },
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face"
  }
];

export const courseDurations: Record<string, Record<string, string>> = {
  beginner: {
    es: '12-18 meses',
    en: '12-18 months',
    de: '12-18 Monate',
    fr: '12-18 mois',
    ru: '12-18 месяцев'
  },
  intermediate: {
    es: '6-12 meses',
    en: '6-12 months',
    de: '6-12 Monate',
    fr: '6-12 mois',
    ru: '6-12 месяцев'
  },
  advanced: {
    es: '3-6 meses',
    en: '3-6 months',
    de: '3-6 Monate',
    fr: '3-6 mois',
    ru: '3-6 месяцев'
  },
  fluent: {
    es: '1-3 meses (preparación de examen)',
    en: '1-3 months (exam prep)',
    de: '1-3 Monate (Prüfungsvorbereitung)',
    fr: '1-3 mois (préparation examen)',
    ru: '1-3 месяца (подготовка к экзамену)'
  }
};
