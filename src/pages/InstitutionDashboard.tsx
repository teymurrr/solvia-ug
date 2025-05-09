
// InstitutionDashboard.tsx

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VacancyForm from '@/components/VacancyForm';
import InstitutionProfileEditForm from '@/components/InstitutionProfileEditForm';
import { ProfileTab, VacanciesTab, TalentsTab, DashboardHeader } from '@/components/institution-dashboard';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useVacancies, VacancyInput } from '@/hooks/useVacancies';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';

const InstitutionDashboard = () => {
  const [vacancyFormOpen, setVacancyFormOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const { session, user, loading: authLoading } = useAuth();
  const { 
    professionals, 
    filteredProfessionals, 
    setFilteredProfessionals,
    loading: professionalsLoading,
    error: professionalsError,
    refreshProfessionals
  } = useProfessionals();
  
  const { 
    vacancies, 
    handleAddVacancy, 
    handleDeleteVacancy, 
    loading: vacanciesLoading, 
    refreshVacancies,
    submitting: vacancySubmitting 
  } = useVacancies();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all_roles',
    profession: 'all_professions',
    country: 'all_countries',
    language: 'all_languages'
  });
  const { toast } = useToast();
  
  // Filter vacancies to show only those created by the current institution
  const institutionVacancies = user?.id ? 
    vacancies.filter(vacancy => vacancy.institution_id === user.id) : 
    [];

  useEffect(() => {
    // Log information about current authentication state
    console.log("Current user ID:", user?.id);
    console.log("All vacancies:", vacancies);
    console.log("Filtered institution vacancies:", institutionVacancies);
  }, [user, vacancies, institutionVacancies]);

  // If authentication state changes, refresh vacancies
  useEffect(() => {
    if (user?.id) {
      refreshVacancies();
    }
  }, [user]);

  const handleSearch = () => {
    if (!professionals) return;
    
    const filtered = professionals.filter(prof => {
      const fullName = `${prof.firstName} ${prof.lastName}`.toLowerCase();
      const specialty = (prof.specialty || '').toLowerCase();
      const profession = (prof.profession || '').toLowerCase();
      const country = (prof.country || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      
      const matchesText = !searchQuery || 
        fullName.includes(query) || 
        specialty.includes(query) || 
        profession.includes(query) || 
        country.includes(query);
      
      const matchesRole = filters.role === 'all_roles' || 
        prof.profession?.toLowerCase() === filters.role.toLowerCase();
      
      const matchesProfession = filters.profession === 'all_professions' || 
        prof.specialty?.toLowerCase() === filters.profession.toLowerCase();
      
      const matchesCountry = filters.country === 'all_countries' || 
        prof.country?.toLowerCase() === filters.country.toLowerCase();
      
      const matchesLanguage = filters.language === 'all_languages' || 
        (prof.languages && prof.languages.some(lang => 
          lang.language.toLowerCase() === filters.language.toLowerCase()
        ));
      
      return matchesText && matchesRole && matchesProfession && matchesCountry && matchesLanguage;
    });
    
    setFilteredProfessionals(filtered);

    if (filtered.length === 0) {
      toast({
        title: "No matching professionals",
        description: "Try adjusting your search criteria or filters",
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, filters, professionals]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleAddVacancySubmit = async (data: VacancyInput) => {
    console.log("Handling vacancy submission with data:", data);
    
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post vacancies.",
        variant: "destructive",
      });
      return;
    }
    
    // Make sure institution_id is set
    const vacancyWithInstitutionId = {
      ...data,
      institution_id: user.id,
    };
    
    console.log("Submitting vacancy with institution ID:", vacancyWithInstitutionId);
    
    const result = await handleAddVacancy(vacancyWithInstitutionId);
    if (result) {
      setVacancyFormOpen(false);
      // Force refresh vacancies to ensure we see the new one
      setTimeout(() => {
        refreshVacancies();
      }, 500);
    }
  };

  return (
    <MainLayout hideEditProfile>
      <div className="container py-8">
        <DashboardHeader 
          onAddVacancy={() => setVacancyFormOpen(true)} 
        />
        
        {authLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3">Loading authentication...</span>
          </div>
        ) : !user ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">Authentication Required</h3>
            <p className="mt-2">You need to be logged in to access this dashboard.</p>
          </div>
        ) : (
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="vacancies">Your Vacancies</TabsTrigger>
              <TabsTrigger value="talents">Talent Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileTab onEditProfile={() => setProfileEditOpen(true)} />
            </TabsContent>
            
            <TabsContent value="vacancies" className="space-y-6">
              <VacanciesTab 
                vacancies={institutionVacancies} 
                onAddVacancy={() => setVacancyFormOpen(true)} 
                onDeleteVacancy={handleDeleteVacancy}
                loading={vacanciesLoading}
              />
            </TabsContent>
            
            <TabsContent value="talents" className="space-y-6">
              <TalentsTab 
                professionals={professionals}
                filteredProfessionals={filteredProfessionals}
                loading={professionalsLoading}
                error={professionalsError}
                searchQuery={searchQuery}
                onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                filters={filters}
                onFilterChange={handleFilterChange}
                refreshProfessionals={refreshProfessionals}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      <VacancyForm 
        open={vacancyFormOpen} 
        onOpenChange={setVacancyFormOpen}
        onSubmit={handleAddVacancySubmit}
        isSubmitting={vacancySubmitting}
        userId={user?.id}
      />

      <InstitutionProfileEditForm
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
      />
    </MainLayout>
  );
};

export default InstitutionDashboard;
