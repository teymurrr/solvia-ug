
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import InstitutionProfileEditForm from '@/components/InstitutionProfileEditForm';
import VacancyForm from '@/components/VacancyForm';
import { ProfileTab, VacanciesTab, TalentsTab, DashboardHeader } from '@/components/institution-dashboard';

const InstitutionDashboard = () => {
  // State for talent search
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    profession: '',
    country: '',
    language: ''
  });
  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [vacancyFormOpen, setVacancyFormOpen] = useState(false);
  const { toast } = useToast();
  
  // Load professionals from localStorage on component mount
  useEffect(() => {
    const loadProfessionals = () => {
      try {
        const savedProfessionals = localStorage.getItem('professionals');
        console.log('Raw localStorage professionals data:', savedProfessionals);
        
        if (savedProfessionals) {
          const parsedProfessionals = JSON.parse(savedProfessionals);
          console.log('Parsed professionals:', parsedProfessionals);
          
          if (Array.isArray(parsedProfessionals)) {
            setProfessionals(parsedProfessionals);
            // Initially display all professionals
            setFilteredProfessionals(parsedProfessionals);
          } else {
            console.error('Professionals data is not an array:', parsedProfessionals);
            setProfessionals([]);
            setFilteredProfessionals([]);
          }
        } else {
          console.log('No professionals found in localStorage');
          setProfessionals([]);
          setFilteredProfessionals([]);
        }
      } catch (error) {
        console.error('Error loading professionals:', error);
        setProfessionals([]);
        setFilteredProfessionals([]);
      }
    };
    
    loadProfessionals();
    
    // Set up an event listener to reload professionals when localStorage changes
    window.addEventListener('storage', loadProfessionals);
    
    return () => {
      window.removeEventListener('storage', loadProfessionals);
    };
  }, []);
  
  // Load vacancies from localStorage on component mount
  const [vacancies, setVacancies] = useState<any[]>(() => {
    try {
      const savedVacancies = localStorage.getItem('institutionVacancies');
      return savedVacancies ? JSON.parse(savedVacancies) : [];
    } catch (error) {
      console.error('Error loading vacancies:', error);
      return [];
    }
  });

  // Save vacancies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('institutionVacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  // Handle talent search with filtering
  const handleTalentSearch = () => {
    console.log('Searching for:', searchQuery);
    console.log('With filters:', filters);
    console.log('All professionals before search:', professionals);
    
    let filtered = [...professionals];
    
    // Apply text search if provided
    if (searchQuery.trim()) {
      filtered = filtered.filter(prof => 
        prof.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prof.firstName && prof.lastName && 
         `${prof.firstName} ${prof.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply each filter if selected
    if (filters.role) {
      filtered = filtered.filter(prof => 
        prof.role?.toLowerCase() === filters.role.toLowerCase()
      );
    }
    
    if (filters.profession) {
      filtered = filtered.filter(prof => 
        prof.profession?.toLowerCase() === filters.profession.toLowerCase() ||
        prof.specialty?.toLowerCase() === filters.profession.toLowerCase()
      );
    }
    
    if (filters.country) {
      filtered = filtered.filter(prof => 
        prof.country?.toLowerCase() === filters.country.toLowerCase()
      );
    }
    
    if (filters.language) {
      filtered = filtered.filter(prof => 
        prof.language?.toLowerCase() === filters.language.toLowerCase()
      );
    }
    
    console.log('Filtered professionals after search and filters:', filtered);
    setFilteredProfessionals(filtered);
  };

  // Update filters and trigger search
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    console.log('Updated filters:', newFilters);
    // We'll let the TalentsTab component's useEffect trigger the search
  };

  const handleAddVacancy = (vacancyData: any) => {
    // Add the new vacancy with a timestamp ID
    const newVacancy = { ...vacancyData, id: Date.now() };
    setVacancies([...vacancies, newVacancy]);
    setVacancyFormOpen(false);
    
    toast({
      title: "Vacancy Created",
      description: "Your vacancy has been saved and will persist even after page refresh.",
    });
  };

  const handleDeleteVacancy = (id: number) => {
    setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
    
    toast({
      title: "Vacancy Deleted",
      description: "The vacancy has been removed from your listings.",
    });
  };

  return (
    <MainLayout hideEditProfile>
      <div className="container py-8">
        <DashboardHeader 
          onEditProfile={() => setProfileFormOpen(true)} 
          onAddVacancy={() => setVacancyFormOpen(true)} 
        />
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vacancies">Your Vacancies</TabsTrigger>
            <TabsTrigger value="talents">Talent Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <ProfileTab onEditProfile={() => setProfileFormOpen(true)} />
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
              onSearch={handleTalentSearch}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <InstitutionProfileEditForm 
        open={profileFormOpen} 
        onOpenChange={setProfileFormOpen} 
      />
      
      <VacancyForm 
        open={vacancyFormOpen} 
        onOpenChange={setVacancyFormOpen}
        onSubmit={handleAddVacancy}
      />
    </MainLayout>
  );
};

export default InstitutionDashboard;
