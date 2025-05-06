
import { supabase } from '@/integrations/supabase/client';

export interface InstitutionProfileFormValues {
  institutionName: string;
  institutionType: string;
  location: string;
  website?: string;
  about?: string;
  profileImage?: string;
  email?: string;
}

export const saveInstitutionProfileToDb = async (userId: string, data: InstitutionProfileFormValues) => {
  console.log('Saving institution profile data for user:', userId);
  
  try {
    // Validate userId to prevent downstream errors
    if (!userId) {
      throw new Error('Invalid user ID provided');
    }
    
    // Save main profile data
    const { error: profileError } = await supabase
      .from('institution_profiles')
      .upsert({
        id: userId,
        institution_name: data.institutionName,
        institution_type: data.institutionType,
        location: data.location,
        website: data.website || null,
        about: data.about || null,
        profile_image: data.profileImage || null,
      });

    if (profileError) {
      console.error('Error saving institution profile:', profileError);
      throw profileError;
    }

    console.log('Institution profile saved successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in institution profile save operation:', error);
    // Return a structured error response
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const loadInstitutionProfileFromDb = async (userId: string) => {
  console.log('Loading institution profile data for user:', userId);
  
  try {
    // Validate userId to prevent downstream errors
    if (!userId) {
      throw new Error('Invalid user ID provided');
    }
    
    // Load main profile data
    const { data: profileData, error: profileError } = await supabase
      .from('institution_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('Institution profile not found for user:', userId);
        return null;
      }
      console.error('Error loading institution profile:', profileError);
      throw profileError;
    }

    if (profileData) {
      console.log('Institution profile data loaded successfully');
      
      return {
        institutionName: profileData.institution_name || '',
        institutionType: profileData.institution_type || '',
        location: profileData.location || '',
        website: profileData.website || '',
        about: profileData.about || '',
        profileImage: profileData.profile_image || '',
        email: '', // Add an empty email field to match form values type
      };
    }
    
    console.log('No institution profile data found');
    return null;
  } catch (error) {
    console.error('Error in institution profile load operation:', error);
    // Return null to indicate loading failure
    return null;
  }
};
