
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  profession?: string;
  country?: string;
  language?: string;
  isOpenToRelocation?: boolean;
  profileImage?: string;
  activelySearching?: boolean;
  experiences?: {
    hospital: string;
    location: string;
    role: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }[];
  languages?: {
    language: string;
    level: string;
  }[];
  fspCertificate?: boolean;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching professional profiles...");
      
      // Load main profiles from professional_profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('professional_profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setError('Failed to load professional profiles');
        toast({
          title: "Error",
          description: "Failed to load professional profiles",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Fetched ${profilesData?.length || 0} professional profiles`);
      
      if (!profilesData || profilesData.length === 0) {
        setProfessionals([]);
        setFilteredProfessionals([]);
        setLoading(false);
        return;
      }

      // Load related data for all profiles
      const enrichedProfiles = await Promise.all(
        profilesData.map(async (profile) => {
          // Get experiences
          const { data: experiencesData } = await supabase
            .from('experiences')
            .select('*')
            .eq('profile_id', profile.id)
            .order('start_date', { ascending: false });

          // Get education
          const { data: educationData } = await supabase
            .from('education')
            .select('*')
            .eq('profile_id', profile.id)
            .order('start_date', { ascending: false });

          // Get languages
          const { data: languagesData } = await supabase
            .from('languages')
            .select('*')
            .eq('profile_id', profile.id);

          return {
            id: profile.id,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            specialty: profile.specialty || '',
            profession: profile.profession || '',
            country: profile.location || '',
            isOpenToRelocation: profile.open_to_relocation || false,
            profileImage: profile.profile_image || '',
            activelySearching: profile.actively_searching || false,
            fspCertificate: profile.fsp_certificate || false,
            experiences: experiencesData ? experiencesData.map(exp => ({
              hospital: exp.hospital || '',
              location: exp.location || '',
              role: exp.role || '',
              startDate: exp.start_date || '',
              endDate: exp.end_date || '',
              current: exp.current || false
            })) : [],
            education: educationData ? educationData.map(edu => ({
              institution: edu.institution || '',
              degree: edu.degree || '',
              field: edu.field || '',
              startDate: edu.start_date || '',
              endDate: edu.end_date || '',
              current: edu.current || false
            })) : [],
            languages: languagesData ? languagesData.map(lang => ({
              language: lang.language || '',
              level: lang.level || ''
            })) : []
          };
        })
      );
      
      console.log("Enriched profiles with related data:", enrichedProfiles);
      
      setProfessionals(enrichedProfiles);
      setFilteredProfessionals(enrichedProfiles);
      
    } catch (error) {
      console.error('Error loading professionals:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to load professional data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return { 
    professionals, 
    filteredProfessionals, 
    setFilteredProfessionals, 
    loading, 
    error,
    refreshProfessionals: fetchProfessionals
  };
};
