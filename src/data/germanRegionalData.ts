export interface BundeslandData {
  name: string;
  authority: string;
  processingTime: string;
  fspFormat: string;
  berufserlaubnisSpeed: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  notes: string;
  tips: string;
}

export const germanRegionalData: Record<string, BundeslandData> = {
  'baden-wuerttemberg': {
    name: 'Baden-Württemberg',
    authority: 'Regierungspräsidium Stuttgart',
    processingTime: '3–6 months',
    fspFormat: 'Patient case simulation + documentation',
    berufserlaubnisSpeed: 'Medium (6–10 weeks)',
    difficulty: 3,
    notes: 'Multiple RP offices (Stuttgart, Freiburg, Karlsruhe, Tübingen). Apply to the one responsible for your intended work location.',
    tips: 'Strong job market in Stuttgart and Freiburg university hospitals.',
  },
  bayern: {
    name: 'Bayern',
    authority: 'Regierung von Oberbayern (central)',
    processingTime: '4–8 months',
    fspFormat: 'Structured clinical exam with patient actor',
    berufserlaubnisSpeed: 'Slow (8–14 weeks)',
    difficulty: 4,
    notes: 'Bavaria is known for stricter FSP standards. Centralized processing through Regierung von Oberbayern for most cases.',
    tips: 'High salaries and excellent hospitals, but prepare well for the FSP — pass rates are lower.',
  },
  berlin: {
    name: 'Berlin',
    authority: 'Landesamt für Gesundheit und Soziales (LAGeSo)',
    processingTime: '4–9 months',
    fspFormat: 'Patient consultation + documentation',
    berufserlaubnisSpeed: 'Medium (6–10 weeks)',
    difficulty: 3,
    notes: 'High demand for international doctors. LAGeSo can be slow due to volume. Charité is a major employer.',
    tips: 'Very international city — easier social integration. Apply early as LAGeSo has long queues.',
  },
  brandenburg: {
    name: 'Brandenburg',
    authority: 'Landesamt für Arbeitsschutz, Verbraucherschutz und Gesundheit (LAVG)',
    processingTime: '2–5 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Fast (4–6 weeks)',
    difficulty: 2,
    notes: 'Less bureaucratic than Berlin. Strong need for doctors in rural areas.',
    tips: 'Consider Brandenburg as alternative to Berlin — faster processing, close proximity.',
  },
  bremen: {
    name: 'Bremen',
    authority: 'Senatorin für Gesundheit, Frauen und Verbraucherschutz',
    processingTime: '2–4 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Fast (3–5 weeks)',
    difficulty: 2,
    notes: 'Small state with fast processing. Limited hospital options but good work-life balance.',
    tips: 'Excellent for quick Berufserlaubnis while waiting for Approbation.',
  },
  hamburg: {
    name: 'Hamburg',
    authority: 'Behörde für Gesundheit und Verbraucherschutz',
    processingTime: '3–6 months',
    fspFormat: 'Clinical case + doctor-patient dialogue',
    berufserlaubnisSpeed: 'Medium (6–8 weeks)',
    difficulty: 3,
    notes: 'UKE (Universitätsklinikum Hamburg-Eppendorf) is a top employer. Good international community.',
    tips: 'High cost of living but excellent quality of life. Port city with international flair.',
  },
  hessen: {
    name: 'Hessen',
    authority: 'Regierungspräsidium Darmstadt / Gießen',
    processingTime: '3–7 months',
    fspFormat: 'Patient history + physical exam discussion',
    berufserlaubnisSpeed: 'Medium (6–10 weeks)',
    difficulty: 3,
    notes: 'Frankfurt area has high demand. Two RP offices — Darmstadt (south) and Gießen (north).',
    tips: 'Frankfurt offers highest salaries in Hessen. Consider smaller cities for faster processing.',
  },
  'mecklenburg-vorpommern': {
    name: 'Mecklenburg-Vorpommern',
    authority: 'Landesamt für Gesundheit und Soziales (LAGuS)',
    processingTime: '2–4 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Fast (3–5 weeks)',
    difficulty: 1,
    notes: 'Very doctor-friendly state with acute shortage. Fastest processing times in Germany.',
    tips: 'Best choice for quick entry. Universities in Rostock and Greifswald offer good opportunities.',
  },
  niedersachsen: {
    name: 'Niedersachsen',
    authority: 'Niedersächsischer Zweckverband zur Approbationserteilung (NiZzA)',
    processingTime: '3–6 months',
    fspFormat: 'Anamnesis + case presentation',
    berufserlaubnisSpeed: 'Medium (5–8 weeks)',
    difficulty: 2,
    notes: 'Centralized through NiZzA in Hannover. Good hospital landscape across the state.',
    tips: 'Hannover Medical School (MHH) is internationally recognized. Good mid-range cost of living.',
  },
  nrw: {
    name: 'Nordrhein-Westfalen',
    authority: 'Bezirksregierung (Düsseldorf, Köln, Arnsberg, Detmold, Münster)',
    processingTime: '4–8 months',
    fspFormat: 'Varies by Bezirksregierung — generally patient case based',
    berufserlaubnisSpeed: 'Slow (8–12 weeks)',
    difficulty: 3,
    notes: 'Largest state by population. Five different Bezirksregierungen with slightly different processes. High competition.',
    tips: 'Cologne and Düsseldorf are popular but slower. Consider Münster or Detmold for faster processing.',
  },
  'rheinland-pfalz': {
    name: 'Rheinland-Pfalz',
    authority: 'Landesamt für Soziales, Jugend und Versorgung',
    processingTime: '3–5 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Medium (5–7 weeks)',
    difficulty: 2,
    notes: 'University hospital Mainz is major employer. Wine region with good quality of life.',
    tips: 'Good balance of processing speed and job opportunities. Close to Frankfurt.',
  },
  saarland: {
    name: 'Saarland',
    authority: 'Landesamt für Soziales',
    processingTime: '2–4 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Fast (3–5 weeks)',
    difficulty: 1,
    notes: 'Smallest state (excluding city-states). Very fast processing. French border — bilingual advantage.',
    tips: 'Ideal for French-speaking doctors. Saarbrücken university hospital is the main employer.',
  },
  sachsen: {
    name: 'Sachsen',
    authority: 'Landesdirektion Sachsen',
    processingTime: '3–6 months',
    fspFormat: 'Patient case simulation',
    berufserlaubnisSpeed: 'Medium (5–8 weeks)',
    difficulty: 2,
    notes: 'Dresden and Leipzig have excellent university hospitals. Growing international community.',
    tips: 'Lower cost of living than western Germany. Leipzig is increasingly popular.',
  },
  'sachsen-anhalt': {
    name: 'Sachsen-Anhalt',
    authority: 'Landesverwaltungsamt',
    processingTime: '2–4 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Fast (3–5 weeks)',
    difficulty: 1,
    notes: 'Severe doctor shortage, especially rural. Very welcoming to international doctors.',
    tips: 'Magdeburg and Halle offer good university hospital positions. Fast-track possible.',
  },
  'schleswig-holstein': {
    name: 'Schleswig-Holstein',
    authority: 'Landesamt für soziale Dienste',
    processingTime: '3–5 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Medium (5–7 weeks)',
    difficulty: 2,
    notes: 'Northern state between North Sea and Baltic Sea. UKSH (Kiel/Lübeck) is major employer.',
    tips: 'Great quality of life. Consider Lübeck or Kiel for university hospital positions.',
  },
  thueringen: {
    name: 'Thüringen',
    authority: 'Landesverwaltungsamt',
    processingTime: '2–4 months',
    fspFormat: 'Standard FSP format',
    berufserlaubnisSpeed: 'Fast (3–5 weeks)',
    difficulty: 1,
    notes: 'Central location, doctor shortage. Jena university hospital is well-regarded.',
    tips: 'Fastest processing in central Germany. Jena is a vibrant university city.',
  },
};

export const getDifficultyColor = (difficulty: number): string => {
  switch (difficulty) {
    case 1: return 'hsl(142, 71%, 45%)';
    case 2: return 'hsl(142, 50%, 55%)';
    case 3: return 'hsl(45, 93%, 55%)';
    case 4: return 'hsl(25, 95%, 55%)';
    case 5: return 'hsl(0, 84%, 60%)';
    default: return 'hsl(215, 20%, 65%)';
  }
};

export const getDifficultyLabel = (difficulty: number): string => {
  switch (difficulty) {
    case 1: return 'Very Easy';
    case 2: return 'Easy';
    case 3: return 'Moderate';
    case 4: return 'Difficult';
    case 5: return 'Very Difficult';
    default: return 'Unknown';
  }
};
