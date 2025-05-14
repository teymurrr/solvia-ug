import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VacancyForm from '@/components/VacancyForm';
import InstitutionProfileEditForm from '@/components/InstitutionProfileEditForm';
import { ProfileTab, VacanciesTab, TalentsTab, DashboardHeader } from '@/components/institution-dashboard';
import ApplicationsTab from '@/components/institution-dashboard/ApplicationsTab';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useVacancies, VacancyInput } from '@/hooks/useVacancies';
import { useApplications } from '@/hooks/applications';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { featuredVacancies } from '@/data/landingPageData';

const InstitutionDashboard = () => {
  const location = useLocation();
  const [vacancyFormOpen, setVacancyFormOpen] = useState(false);
  const [vacancyFormMode, setVacancyFormMode] = useState<'create' | 'edit'>('create');
  const [currentVacancy, setCurrentVacancy] = useState(null);
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
  
  // Use the enhanced applications hook
  const {
    applications,
    filteredApplications,
    loading: applicationsLoading,
    error: applicationsError,
    searchQuery: applicationsSearchQuery,
    filters: applicationsFilters,
    handleSearchQueryChange: handleApplicationsSearchQueryChange,
    handleFilterChange: handleApplicationsFilterChange,
    updateApplicationStatus,
    refreshApplications,
    updateApplicationFilters
  } = useApplications();
  
  const { 
    vacancies, 
    handleAddVacancy,
    handleUpdateVacancy,
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
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  
  // Get active tab from location state if available
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
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

  // If authentication state changes, refresh data
  useEffect(() => {
    if (user?.id) {
      refreshVacancies();
      refreshApplications();
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
    
    let result;
    if (vacancyFormMode === 'edit' && currentVacancy) {
      // Update existing vacancy
      result = await handleUpdateVacancy({
        ...vacancyWithInstitutionId,
        id: currentVacancy.id
      });
    } else {
      // Create new vacancy
      result = await handleAddVacancy(vacancyWithInstitutionId);
    }
    
    if (result) {
      setVacancyFormOpen(false);
      // Reset form state
      setVacancyFormMode('create');
      setCurrentVacancy(null);
      // Force refresh vacancies to ensure we see the new one
      setTimeout(() => {
        refreshVacancies();
      }, 500);
    }
  };

  const handleOpenAddVacancy = () => {
    setVacancyFormMode('create');
    setCurrentVacancy(null);
    setVacancyFormOpen(true);
  };

  const handleOpenEditVacancy = (vacancy) => {
    setVacancyFormMode('edit');
    setCurrentVacancy(vacancy);
    setVacancyFormOpen(true);
  };

  const handleApplicationSearch = () => {
    // Handled by the useApplications hook
    console.log("Application search triggered");
  };

  const handleEmptyAction = () => {
    // Empty function - no action needed for display-only vacancies
    console.log("This action is not available for sample vacancies");
  };

  return (
    <MainLayout hideEditProfile>
      <div className="container py-8">
        <DashboardHeader 
          onAddVacancy={handleOpenAddVacancy} 
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="vacancies">Your Vacancies</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="talents">Talent Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileTab onEditProfile={() => setProfileEditOpen(true)} />
            </TabsContent>
            
            <TabsContent value="vacancies" className="space-y-6">
              <VacanciesTab 
                vacancies={institutionVacancies} 
                onAddVacancy={handleOpenAddVacancy} 
                onEditVacancy={handleOpenEditVacancy}
                onDeleteVacancy={handleDeleteVacancy}
                loading={vacanciesLoading}
              />
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-6">
              <ApplicationsTab 
                applications={applications}
                filteredApplications={filteredApplications}
                loading={applicationsLoading}
                error={applicationsError}
                searchQuery={applicationsSearchQuery}
                onSearchQueryChange={handleApplicationsSearchQueryChange}
                onSearch={handleApplicationSearch}
                filters={applicationsFilters}
                onFilterChange={handleApplicationsFilterChange}
                refreshApplications={refreshApplications}
                onUpdateStatus={updateApplicationStatus}
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
              
              {/* Add the sample vacancies section to the talents tab */}
              {!professionalsLoading && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Featured Vacancies</h2>
                  <VacanciesTab
                    vacancies={featuredVacancies || []} 
                    onAddVacancy={handleEmptyAction}
                    onEditVacancy={handleEmptyAction}
                    onDeleteVacancy={handleEmptyAction}
                    title="Sample Vacancies"
                    description="Examples of vacancy listings from leading healthcare institutions"
                    showAddButton={false}
                  />
                </div>
              )}
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
        editVacancy={currentVacancy}
        mode={vacancyFormMode}
      />

      <InstitutionProfileEditForm
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
      />
    </MainLayout>
  );
};

export default InstitutionDashboard;
