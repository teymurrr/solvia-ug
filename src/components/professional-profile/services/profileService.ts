
import { supabase } from '@/integrations/supabase/client';
import { ProfileFormValues, Experience, Education, Language } from '../types';

export const saveProfileToDb = async (userId: string, data: ProfileFormValues) => {
  console.log('Saving profile data for user:', userId, data);
  
  // Save main profile data
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      first_name: data.firstName,
      last_name: data.lastName,
      specialty: data.specialty,
      location: data.location,
      profession: data.profession,
      about: data.about,
      profile_image: data.profileImage,
      actively_searching: data.activelySearching,
      open_to_relocation: data.openToRelocation,
      fsp_certificate: data.fspCertificate,
      fsp_certificate_file: data.fspCertificateFile,
    });

  if (profileError) {
    console.error('Error saving profile:', profileError);
    throw profileError;
  }

  // Handle experiences
  if (data.experiences && data.experiences.length > 0) {
    // Delete existing experiences
    const { error: deleteExpError } = await supabase
      .from('experiences')
      .delete()
      .eq('profile_id', userId);
      
    if (deleteExpError) {
      console.error('Error deleting experiences:', deleteExpError);
      throw deleteExpError;
    }
      
    const experiencesData = data.experiences.map(exp => ({
      profile_id: userId,
      hospital: exp.hospital,
      location: exp.location,
      role: exp.role,
      start_date: exp.startDate,
      end_date: exp.endDate || null,
      current: exp.current || false
    }));
    
    const { error: expError } = await supabase
      .from('experiences')
      .insert(experiencesData);
      
    if (expError) {
      console.error('Error inserting experiences:', expError);
      throw expError;
    }
  }
  
  // Handle education
  if (data.education && data.education.length > 0) {
    // Delete existing education records
    const { error: deleteEduError } = await supabase
      .from('education')
      .delete()
      .eq('profile_id', userId);
      
    if (deleteEduError) {
      console.error('Error deleting education:', deleteEduError);
      throw deleteEduError;
    }
      
    const educationData = data.education.map(edu => ({
      profile_id: userId,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      start_date: edu.startDate,
      end_date: edu.endDate || null,
      current: edu.current || false
    }));
    
    const { error: eduError } = await supabase
      .from('education')
      .insert(educationData);
      
    if (eduError) {
      console.error('Error inserting education:', eduError);
      throw eduError;
    }
  }
  
  // Handle languages
  if (data.languages && data.languages.length > 0) {
    // Delete existing language records
    const { error: deleteLangError } = await supabase
      .from('languages')
      .delete()
      .eq('profile_id', userId);
      
    if (deleteLangError) {
      console.error('Error deleting languages:', deleteLangError);
      throw deleteLangError;
    }
      
    const languagesData = data.languages.map(lang => ({
      profile_id: userId,
      language: lang.language,
      level: lang.level,
      certificate: lang.certificate || null
    }));
    
    const { error: langError } = await supabase
      .from('languages')
      .insert(languagesData);
      
    if (langError) {
      console.error('Error inserting languages:', langError);
      throw langError;
    }
  }

  console.log('Profile saved successfully');
};

export const loadProfileFromDb = async (userId: string) => {
  console.log('Loading profile data for user:', userId);
  
  // Load main profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    if (profileError.code === 'PGRST116') {
      console.log('Profile not found for user:', userId);
      return null;
    }
    console.error('Error loading profile:', profileError);
    throw profileError;
  }

  // Load experiences
  const { data: experiencesData, error: expError } = await supabase
    .from('experiences')
    .select('*')
    .eq('profile_id', userId);

  if (expError) {
    console.error('Error loading experiences:', expError);
    throw expError;
  }

  // Load education 
  const { data: educationData, error: eduError } = await supabase
    .from('education')
    .select('*')
    .eq('profile_id', userId);

  if (eduError) {
    console.error('Error loading education:', eduError);
    throw eduError;
  }

  // Load languages
  const { data: languagesData, error: langError } = await supabase
    .from('languages')
    .select('*')
    .eq('profile_id', userId);

  if (langError) {
    console.error('Error loading languages:', langError);
    throw langError;
  }

  if (profileData) {
    console.log('Profile data loaded successfully');
    
    // Convert DB field names to camelCase for frontend
    const experiences: Experience[] = experiencesData ? experiencesData.map(exp => ({
      hospital: exp.hospital || '',
      location: exp.location || '',
      role: exp.role || '',
      startDate: exp.start_date || '',
      endDate: exp.end_date || '',
      current: exp.current || false
    })) : [];

    const education: Education[] = educationData ? educationData.map(edu => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.start_date || '',
      endDate: edu.end_date || '',
      current: edu.current || false
    })) : [];

    const languages: Language[] = languagesData ? languagesData.map(lang => ({
      language: lang.language || '',
      level: lang.level || '',
      certificate: lang.certificate || ''
    })) : [];

    return {
      firstName: profileData.first_name || '',
      lastName: profileData.last_name || '',
      specialty: profileData.specialty || '',
      location: profileData.location || '',
      profession: profileData.profession || '',
      about: profileData.about || '',
      profileImage: profileData.profile_image || '',
      activelySearching: profileData.actively_searching || false,
      openToRelocation: profileData.open_to_relocation || false,
      experiences,
      education,
      languages,
      fspCertificate: profileData.fsp_certificate || false,
      fspCertificateFile: profileData.fsp_certificate_file || '',
      email: '', // Add an empty email field to match ProfileFormValues type
    };
  }
  
  console.log('No profile data found');
  return null;
};
