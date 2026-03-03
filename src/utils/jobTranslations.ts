import type { Language } from '@/utils/i18n/translations';

const jobTypeTranslations: Record<string, Record<Language, string>> = {
  'full-time': { en: 'Full-time', de: 'Vollzeit', es: 'Tiempo completo', fr: 'Temps plein', ru: 'Полная занятость' },
  'fulltime': { en: 'Full-time', de: 'Vollzeit', es: 'Tiempo completo', fr: 'Temps plein', ru: 'Полная занятость' },
  'part-time': { en: 'Part-time', de: 'Teilzeit', es: 'Medio tiempo', fr: 'Temps partiel', ru: 'Частичная занятость' },
  'parttime': { en: 'Part-time', de: 'Teilzeit', es: 'Medio tiempo', fr: 'Temps partiel', ru: 'Частичная занятость' },
  'internship': { en: 'Internship', de: 'Praktikum', es: 'Prácticas', fr: 'Stage', ru: 'Стажировка' },
  'volunteer': { en: 'Volunteer', de: 'Ehrenamt', es: 'Voluntariado', fr: 'Bénévolat', ru: 'Волонтёрство' },
  'contract': { en: 'Contract', de: 'Vertrag', es: 'Contrato', fr: 'Contrat', ru: 'Контракт' },
  'temporary': { en: 'Temporary', de: 'Befristet', es: 'Temporal', fr: 'Temporaire', ru: 'Временная' },
};

const professionTranslations: Record<string, Record<Language, string>> = {
  'doctor': { en: 'Doctor', de: 'Arzt/Ärztin', es: 'Médico', fr: 'Médecin', ru: 'Врач' },
  'nurse': { en: 'Nurse', de: 'Krankenpfleger/in', es: 'Enfermero/a', fr: 'Infirmier/ère', ru: 'Медсестра/Медбрат' },
  'dentist': { en: 'Dentist', de: 'Zahnarzt/Zahnärztin', es: 'Dentista', fr: 'Dentiste', ru: 'Стоматолог' },
  'pharmacist': { en: 'Pharmacist', de: 'Apotheker/in', es: 'Farmacéutico/a', fr: 'Pharmacien/ne', ru: 'Фармацевт' },
  'physiotherapist': { en: 'Physiotherapist', de: 'Physiotherapeut/in', es: 'Fisioterapeuta', fr: 'Kinésithérapeute', ru: 'Физиотерапевт' },
  'caregiver': { en: 'Caregiver', de: 'Betreuer/in', es: 'Cuidador/a', fr: 'Aide-soignant/e', ru: 'Сиделка' },
};

export const getLocalizedJobType = (jobType: string, language: Language): string => {
  const key = jobType?.toLowerCase()?.replace(/[\s-]/g, '') === 'fulltime' ? 'full-time'
    : jobType?.toLowerCase()?.replace(/[\s-]/g, '') === 'parttime' ? 'part-time'
    : jobType?.toLowerCase();
  return jobTypeTranslations[key]?.[language] || jobType;
};

export const getLocalizedProfession = (profession: string, language: Language): string => {
  const key = profession?.toLowerCase();
  return professionTranslations[key]?.[language] || profession;
};
