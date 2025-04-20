
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  profession?: string;
  country?: string;
  language?: string;
  isOpenToRelocation?: boolean;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        // Load profiles from professional_profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('professional_profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }
        
        // Transform profiles to match our Professional interface
        const transformedProfiles: Professional[] = profilesData ? profilesData.map(profile => ({
          id: profile.id,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          specialty: profile.specialty || '',
          profession: profile.profession || '',
          country: profile.location || '',
          isOpenToRelocation: profile.open_to_relocation || false,
        })) : [];
        
        setProfessionals(transformedProfiles);
        setFilteredProfessionals(transformedProfiles);
        
      } catch (error) {
        console.error('Error loading professionals:', error);
        setProfessionals([]);
        setFilteredProfessionals([]);
      }
    };
    
    loadProfessionals();
  }, []);

  return { professionals, filteredProfessionals, setFilteredProfessionals };
};
