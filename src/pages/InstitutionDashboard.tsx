
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VacancyForm from '@/components/VacancyForm';
import InstitutionProfileEditForm from '@/components/InstitutionProfileEditForm';
import { ProfileTab, VacanciesTab, TalentsTab, DashboardHeader } from '@/components/institution-dashboard';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useVacancies } from '@/hooks/useVacancies';

const InstitutionDashboard = () => {
  const [vacancyFormOpen, setVacancyFormOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const { professionals, filteredProfessionals, setFilteredProfessionals } = useProfessionals();
  const { vacancies, handleAddVacancy, handleDeleteVacancy } = useVacancies();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all_roles',
    profession: 'all_professions',
    country: 'all_countries',
    language: 'all_languages'
  });
  
  const handleSearch = () => {
    if (!professionals) return;
    
    const filtered = professionals.filter(prof => {
      // Text search
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
      
      // Filter by role/profession
      const matchesRole = filters.role === 'all_roles' || 
        prof.profession?.toLowerCase() === filters.role.toLowerCase();
      
      // Filter by specialty/profession field
      const matchesProfession = filters.profession === 'all_professions' || 
        prof.specialty?.toLowerCase() === filters.profession.toLowerCase();
      
      // Filter by country
      const matchesCountry = filters.country === 'all_countries' || 
        prof.country?.toLowerCase() === filters.country.toLowerCase();
      
      // Filter by language
      const matchesLanguage = filters.language === 'all_languages' || 
        prof.language?.toLowerCase() === filters.language.toLowerCase();
      
      return matchesText && matchesRole && matchesProfession && matchesCountry && matchesLanguage;
    });
    
    setFilteredProfessionals(filtered);
  };
  
  // Apply filters when they change
  useEffect(() => {
    handleSearch();
  }, [searchQuery, filters, professionals]);
  
  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  return (
    <MainLayout hideEditProfile>
      <div className="container py-8">
        <DashboardHeader 
          onAddVacancy={() => setVacancyFormOpen(true)} 
        />
        
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
              vacancies={vacancies} 
              onAddVacancy={() => setVacancyFormOpen(true)} 
              onDeleteVacancy={handleDeleteVacancy} 
            />
          </TabsContent>
          
          <TabsContent value="talents" className="space-y-6">
            <TalentsTab 
              professionals={professionals}
              filteredProfessionals={filteredProfessionals}
              searchQuery={searchQuery}
              onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <VacancyForm 
        open={vacancyFormOpen} 
        onOpenChange={setVacancyFormOpen}
        onSubmit={handleAddVacancy}
      />

      <InstitutionProfileEditForm
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
      />
    </MainLayout>
  );
};

export default InstitutionDashboard;
