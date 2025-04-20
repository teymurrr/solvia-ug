
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
        // First load profiles from Supabase
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles from Supabase:', profilesError);
        }
        
        // Transform Supabase profiles to match our Professional interface
        const supabaseProfiles: Professional[] = profilesData ? profilesData.map(profile => ({
          id: profile.id,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          specialty: profile.specialty || '',
          profession: profile.profession || '',
          country: profile.location || '',
          isOpenToRelocation: profile.open_to_relocation || false,
        })) : [];
        
        console.log('Profiles loaded from Supabase:', supabaseProfiles);
        
        // Then load sample data from localStorage
        const savedProfessionals = localStorage.getItem('professionals');
        console.log('Raw localStorage professionals data:', savedProfessionals);
        
        let localProfiles: Professional[] = [];
        if (savedProfessionals) {
          try {
            const parsedProfessionals = JSON.parse(savedProfessionals);
            console.log('Parsed professionals from localStorage:', parsedProfessionals);
            
            if (Array.isArray(parsedProfessionals)) {
              localProfiles = parsedProfessionals;
            }
          } catch (e) {
            console.error('Error parsing professionals data from localStorage:', e);
          }
        }
        
        // If no profiles in either source, use sample data
        if (supabaseProfiles.length === 0 && localProfiles.length === 0) {
          console.log('No profiles found, using sample data');
          const sampleData: Professional[] = [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Smith',
              specialty: 'Cardiology',
              profession: 'Doctor',
              country: 'Germany',
              language: 'English',
              isOpenToRelocation: true
            },
            {
              id: '2',
              firstName: 'Maria',
              lastName: 'Garcia',
              specialty: 'Neurology',
              profession: 'Specialist',
              country: 'Spain',
              language: 'Spanish',
              isOpenToRelocation: false
            },
            {
              id: '3',
              firstName: 'David',
              lastName: 'Chen',
              specialty: 'Pediatrics',
              profession: 'Doctor',
              country: 'Canada',
              language: 'English',
              isOpenToRelocation: true
            }
          ];
          
          // Combine all profiles - give priority to Supabase profiles
          const allProfiles = [...supabaseProfiles, ...sampleData];
          setProfessionals(allProfiles);
          setFilteredProfessionals(allProfiles);
          localStorage.setItem('professionals', JSON.stringify(allProfiles));
        } else {
          // Combine profiles from both sources, removing duplicates based on ID
          const combinedProfiles = [...supabaseProfiles];
          
          // Only add local profiles that don't exist in Supabase profiles
          localProfiles.forEach(localProfile => {
            if (!supabaseProfiles.some(p => p.id === localProfile.id)) {
              combinedProfiles.push(localProfile);
            }
          });
          
          console.log('Combined profiles:', combinedProfiles);
          setProfessionals(combinedProfiles);
          setFilteredProfessionals(combinedProfiles);
        }
      } catch (error) {
        console.error('Error loading professionals:', error);
        setProfessionals([]);
        setFilteredProfessionals([]);
      }
    };
    
    loadProfessionals();
    window.addEventListener('storage', loadProfessionals);
    
    return () => {
      window.removeEventListener('storage', loadProfessionals);
    };
  }, []);

  return { professionals, filteredProfessionals, setFilteredProfessionals };
};
