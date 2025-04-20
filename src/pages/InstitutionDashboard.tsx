
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VacancyForm from '@/components/VacancyForm';
import { ProfileTab, VacanciesTab, TalentsTab, DashboardHeader } from '@/components/institution-dashboard';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useVacancies } from '@/hooks/useVacancies';

const InstitutionDashboard = () => {
  const [vacancyFormOpen, setVacancyFormOpen] = useState(false);
  const { professionals, filteredProfessionals, setFilteredProfessionals } = useProfessionals();
  const { vacancies, handleAddVacancy, handleDeleteVacancy } = useVacancies();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = () => {
    if (!professionals) return;
    
    const filtered = professionals.filter(prof => {
      const fullName = `${prof.firstName} ${prof.lastName}`.toLowerCase();
      const specialty = (prof.specialty || '').toLowerCase();
      const profession = (prof.profession || '').toLowerCase();
      const country = (prof.country || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return fullName.includes(query) || 
             specialty.includes(query) || 
             profession.includes(query) || 
             country.includes(query);
    });
    
    setFilteredProfessionals(filtered);
  };
  
  // Apply search when query changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, professionals]);
  
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
            <ProfileTab onEditProfile={() => {}} />
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
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <VacancyForm 
        open={vacancyFormOpen} 
        onOpenChange={setVacancyFormOpen}
        onSubmit={handleAddVacancy}
      />
    </MainLayout>
  );
};

export default InstitutionDashboard;
