import { supabase } from '@/integrations/supabase/client';

interface WizardData {
  targetCountry?: string;
  studyCountry?: string;
  doctorType?: 'general' | 'specialist' | 'unsure';
  documentsReady?: 'yes' | 'no' | 'unsure';
  languageLevel?: string;
}

export const saveWizardDataToProfile = async (userId: string, wizardData: WizardData) => {
  try {
    const { error } = await supabase
      .from('professional_profiles')
      .update({
        target_country: wizardData.targetCountry,
        study_country: wizardData.studyCountry,
        doctor_type: wizardData.doctorType,
        documents_ready: wizardData.documentsReady,
        language_level: wizardData.languageLevel,
      })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving wizard data:', error);
    return { success: false, error };
  }
};
