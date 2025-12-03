// Data structure for country-specific homologation information

export interface CountryHomologationData {
  country: string;
  processTime: {
    min: string;
    med: string;
    max: string;
  };
  costEstimate: {
    min: number;
    max: number;
    currency: string;
    breakdown: { item: string; cost: string }[];
  };
  languageRequirement: {
    level: string;
    exam: string;
    description: string;
  };
  documents: {
    name: string;
    description: string;
    required: boolean;
  }[];
  professionalExam?: {
    name: string;
    description: string;
  };
  showGermanClasses: boolean;
}

export const homologationDataByCountry: Record<string, CountryHomologationData> = {
  germany: {
    country: 'Germany',
    processTime: {
      min: '6 months',
      med: '9-12 months',
      max: '18 months',
    },
    costEstimate: {
      min: 3000,
      max: 8000,
      currency: 'EUR',
      breakdown: [
        { item: 'Document translations', cost: '500-1,500€' },
        { item: 'Apostille & certifications', cost: '200-500€' },
        { item: 'Application fees', cost: '400-1,000€' },
        { item: 'Language courses (B2/C1)', cost: '1,500-3,500€' },
        { item: 'FSP preparation', cost: '500-1,500€' },
      ],
    },
    languageRequirement: {
      level: 'B2-C1',
      exam: 'Fachsprachprüfung (FSP)',
      description: 'You need B2 German for the medical language exam (FSP). Most states require FSP before Approbation.',
    },
    documents: [
      { name: 'Medical Diploma', description: 'Original or certified copy with apostille', required: true },
      { name: 'Diploma Supplement/Transcript', description: 'Detailed curriculum of your medical studies', required: true },
      { name: 'Certificate of Good Standing', description: 'From medical council of your home country', required: true },
      { name: 'ID/Passport', description: 'Valid identification document', required: true },
      { name: 'CV (Lebenslauf)', description: 'German-format curriculum vitae', required: true },
      { name: 'Language Certificate', description: 'B2/C1 German certificate', required: true },
      { name: 'Birth Certificate', description: 'With apostille and translation', required: true },
      { name: 'Police Clearance', description: 'Criminal background check', required: true },
    ],
    professionalExam: {
      name: 'Kenntnisprüfung or Deficiency Assessment',
      description: 'Depending on your country of study, you may need to pass the Kenntnisprüfung (knowledge exam) or complete a deficiency assessment period.',
    },
    showGermanClasses: true,
  },
  austria: {
    country: 'Austria',
    processTime: {
      min: '4 months',
      med: '6-9 months',
      max: '12 months',
    },
    costEstimate: {
      min: 2500,
      max: 6000,
      currency: 'EUR',
      breakdown: [
        { item: 'Document translations', cost: '400-1,200€' },
        { item: 'Nostification process', cost: '500-1,000€' },
        { item: 'Application fees', cost: '300-600€' },
        { item: 'Language courses', cost: '1,000-3,000€' },
      ],
    },
    languageRequirement: {
      level: 'B2-C1',
      exam: 'ÖSD or Goethe Certificate',
      description: 'German language proficiency at B2 level minimum is required for medical practice.',
    },
    documents: [
      { name: 'Medical Diploma', description: 'With apostille and certified translation', required: true },
      { name: 'Study Curriculum', description: 'Detailed list of completed courses and hours', required: true },
      { name: 'Certificate of Good Standing', description: 'Recent, not older than 3 months', required: true },
      { name: 'Passport/ID', description: 'Valid identification', required: true },
      { name: 'German Language Certificate', description: 'B2 or higher', required: true },
      { name: 'Birth Certificate', description: 'Translated and apostilled', required: true },
    ],
    professionalExam: {
      name: 'Nostrifizierung',
      description: 'Recognition through a university process that may require additional exams.',
    },
    showGermanClasses: true,
  },
  spain: {
    country: 'Spain',
    processTime: {
      min: '8 months',
      med: '12-18 months',
      max: '24 months',
    },
    costEstimate: {
      min: 1500,
      max: 4000,
      currency: 'EUR',
      breakdown: [
        { item: 'Document translations', cost: '300-800€' },
        { item: 'Apostille & legalizations', cost: '150-400€' },
        { item: 'Ministry application fees', cost: '200-400€' },
        { item: 'Spanish language courses', cost: '500-1,500€' },
      ],
    },
    languageRequirement: {
      level: 'B2',
      exam: 'DELE B2',
      description: 'Spanish at B2 level is typically required. Native Spanish speakers from Latin America may not need additional certification.',
    },
    documents: [
      { name: 'Medical Diploma', description: 'Apostilled and officially translated', required: true },
      { name: 'Academic Transcript', description: 'Complete academic record', required: true },
      { name: 'Certificate of Good Standing', description: 'From original medical council', required: true },
      { name: 'Passport/NIE', description: 'Foreign identity number for Spain', required: true },
      { name: 'Birth Certificate', description: 'Apostilled and translated', required: true },
      { name: 'Criminal Record', description: 'From country of origin', required: true },
    ],
    showGermanClasses: false,
  },
  italy: {
    country: 'Italy',
    processTime: {
      min: '3 months',
      med: '6-9 months',
      max: '12 months',
    },
    costEstimate: {
      min: 2000,
      max: 5000,
      currency: 'EUR',
      breakdown: [
        { item: 'Document translations', cost: '400-1,000€' },
        { item: 'Apostille & legalizations', cost: '200-400€' },
        { item: 'Ministry application', cost: '300-500€' },
        { item: 'Italian language courses', cost: '800-2,000€' },
      ],
    },
    languageRequirement: {
      level: 'B2',
      exam: 'CILS or CELI B2',
      description: 'Italian at B2 level is required. The exam tests reading, writing, listening, and speaking.',
    },
    documents: [
      { name: 'Medical Diploma', description: 'With apostille and sworn translation', required: true },
      { name: 'Study Plan', description: 'Detailed curriculum of medical studies', required: true },
      { name: 'Certificate of Good Standing', description: 'From home country medical board', required: true },
      { name: 'Passport', description: 'Valid for at least 6 months', required: true },
      { name: 'Italian Language Certificate', description: 'B2 level', required: true },
      { name: 'Birth Certificate', description: 'Apostilled and translated', required: true },
    ],
    showGermanClasses: false,
  },
  france: {
    country: 'France',
    processTime: {
      min: '6 months',
      med: '12-18 months',
      max: '24 months',
    },
    costEstimate: {
      min: 2000,
      max: 5500,
      currency: 'EUR',
      breakdown: [
        { item: 'Document translations', cost: '400-1,000€' },
        { item: 'Apostille & certifications', cost: '200-400€' },
        { item: 'Application fees', cost: '300-600€' },
        { item: 'French language courses', cost: '800-2,500€' },
        { item: 'EVC preparation', cost: '500-1,000€' },
      ],
    },
    languageRequirement: {
      level: 'B2-C1',
      exam: 'DELF/DALF or TCF',
      description: 'French at B2 minimum is required. Higher levels improve your chances in the EVC (Épreuves de Vérification des Connaissances).',
    },
    documents: [
      { name: 'Medical Diploma', description: 'Apostilled with certified French translation', required: true },
      { name: 'Attestation of Comparability', description: 'From France Éducation International', required: true },
      { name: 'Certificate of Good Standing', description: 'From medical council', required: true },
      { name: 'Passport/ID', description: 'Valid identification', required: true },
      { name: 'French Language Certificate', description: 'B2 or higher', required: true },
      { name: 'CV in French', description: 'Detailed career history', required: true },
    ],
    professionalExam: {
      name: 'EVC (Épreuves de Vérification des Connaissances)',
      description: 'Knowledge verification exams required for non-EU doctors. Includes written and oral components.',
    },
    showGermanClasses: false,
  },
};

export const getProfessionSpecificInfo = (country: string, doctorType: string) => {
  const professionNotes: Record<string, Record<string, string>> = {
    germany: {
      general: 'General practitioners can often start with Berufserlaubnis while waiting for full Approbation.',
      specialist: 'Specialists may need to complete additional recognition of their specialty (Facharztanerkennung).',
      nurse: 'Nurses follow a separate recognition process through the nursing authority (Pflegekammer).',
      dentist: 'Dentists follow a similar Approbation process but through dental regulatory bodies.',
      other: 'Other medical professionals have specific recognition pathways depending on their field.',
    },
    austria: {
      general: 'GPs can apply for Berufserlaubnis for immediate practice under supervision.',
      specialist: 'Specialist recognition requires proof of completed training and may need additional assessments.',
      nurse: 'Nursing recognition is handled by regional health authorities.',
      dentist: 'Dental recognition follows the Nostrifizierung process.',
      other: 'Contact the relevant professional chamber for specific requirements.',
    },
    spain: {
      general: 'MIR (residency) may be required for full specialist recognition.',
      specialist: 'Specialist titles need separate homologation from the Ministry.',
      nurse: 'Nurses apply through the Ministry of Education for title recognition.',
      dentist: 'Dental degrees are homologated through the same Ministry process.',
      other: 'Each profession has specific requirements under Ministry guidelines.',
    },
    italy: {
      general: 'Registration with the Ordine dei Medici is required after recognition.',
      specialist: 'Specialist qualifications need separate Ministry approval.',
      nurse: 'Nurses register with regional nursing boards after recognition.',
      dentist: 'Dentists join the Ordine dei Medici Chirurghi e Odontoiatri.',
      other: 'Professional registration with the relevant order is mandatory.',
    },
    france: {
      general: 'PAE (Procedure d\'Autorisation d\'Exercice) pathway for non-EU doctors.',
      specialist: 'Specialist recognition requires additional documentation of training.',
      nurse: 'Nurses apply through regional health agencies (ARS).',
      dentist: 'Dentists follow a similar EVC pathway as doctors.',
      other: 'Contact the relevant Ordre for specific recognition requirements.',
    },
  };

  return professionNotes[country]?.[doctorType] || '';
};
