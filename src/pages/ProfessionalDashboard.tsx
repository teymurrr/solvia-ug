import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, GraduationCap, Heart } from 'lucide-react';
import { ProfessionalProfileEditForm } from '@/components/professional-profile';
import VacancyCard from '@/components/VacancyCard';
import { sampleVacancies } from '@/data/sampleData';
import {
  ProfileCard,
  VacancySearch,
  FilterBar,
  NoResults,
  useDashboard,
} from '@/components/professional-dashboard';
import SavedAndApplied from '@/components/professional-dashboard/SavedAndApplied';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 3;

const ProfessionalDashboard: React.FC = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedJobTypes,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    activeFilters,
    savedVacancies,
    setSavedVacancies,
    appliedVacancies,
    profileData,
    isLoading,
    savedTabView,
    setSavedTabView,
    jobTypes,
    countries,
    cities,
    toggleJobType,
    resetFilters,
    handleProfileSave,
  } = useDashboard();

  const calculateProfileCompletion = (profile: typeof profileData): number => {
    let totalFields = 0;
    let completedFields = 0;
    
    const personalInfoFields = ['firstName', 'lastName', 'email', 'profession', 'specialty', 'location', 'about', 'profileImage'];
    totalFields += personalInfoFields.length;
    personalInfoFields.forEach(field => {
      if (profile[field as keyof typeof profile]) completedFields++;
    });
    
    totalFields += 1;
    if (profile.experiences && profile.experiences.length > 0) completedFields++;
    
    totalFields += 1;
    if (profile.education && profile.education.length > 0) completedFields++;
    
    totalFields += 1;
    if (profile.languages && profile.languages.length > 0) completedFields++;
    
    totalFields += 1;
    if (profile.fspCertificate) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const getJobTypeIcon = (jobType: string) => {
    switch(jobType) {
      case 'Internship':
        return <GraduationCap className="h-4 w-4 mr-2" />;
      case 'Volunteer':
        return <Heart className="h-4 w-4 mr-2" />;
      default:
        return <Briefcase className="h-4 w-4 mr-2" />;
    }
  };

  const toggleSaveVacancy = (vacancyId: string) => {
    setSavedVacancies(prev => {
      if (prev.includes(vacancyId)) {
        return prev.filter(id => id !== vacancyId);
      } else {
        return [...prev, vacancyId];
      }
    });
  };

  const [vacancyResults, setVacancyResults] = useState(sampleVacancies);
  const totalPages = Math.ceil(vacancyResults.length / ITEMS_PER_PAGE);
  const currentVacancies = vacancyResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = () => {
    let filtered = sampleVacancies;
    
    if (searchQuery) {
      filtered = filtered.filter(vacancy => 
        vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter(vacancy => selectedJobTypes.includes(vacancy.jobType));
    }
    
    if (selectedCountry) {
      filtered = filtered.filter(vacancy => vacancy.location.includes(selectedCountry));
    }
    
    if (selectedCity) {
      filtered = filtered.filter(vacancy => vacancy.location.includes(selectedCity));
    }
    
    setVacancyResults(filtered);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('ellipsis1');
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis2');
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const profileCompletionPercentage = calculateProfileCompletion(profileData);

  return (
    <MainLayout hideEditProfile={true}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Professional Dashboard</h1>
            <p className="text-muted-foreground">Manage your profile and view opportunities</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vacancies">Vacancies</TabsTrigger>
            <TabsTrigger value="saved">Saved & Applied</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>This is how institutions will see you</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Skeleton className="h-32 w-32 rounded-full" />
                      <div className="space-y-4 flex-grow">
                        <Skeleton className="h-10 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-10 w-40" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <ProfileCard
                    profileData={profileData}
                    profileCompletionPercentage={profileCompletionPercentage}
                    onEdit={() => setIsEditProfileOpen(true)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacancies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Vacancies</CardTitle>
                <CardDescription>Explore open positions in healthcare institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <VacancySearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                  />

                  <FilterBar
                    jobTypes={jobTypes}
                    selectedJobTypes={selectedJobTypes}
                    toggleJobType={toggleJobType}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    countries={countries}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    cities={cities}
                    activeFilters={activeFilters}
                    resetFilters={resetFilters}
                    getJobTypeIcon={getJobTypeIcon}
                  />

                  {currentVacancies.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-6">
                        {currentVacancies.map((vacancy) => (
                          <VacancyCard
                            key={vacancy.id}
                            {...vacancy}
                            showSaveOption={true}
                            isSaved={savedVacancies.includes(vacancy.id)}
                            onSaveToggle={toggleSaveVacancy}
                          />
                        ))}
                      </div>

                      {totalPages > 0 && (
                        <Pagination className="mt-6">
                          <PaginationContent>
                            {currentPage > 1 && (
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                  className="cursor-pointer"
                                />
                              </PaginationItem>
                            )}

                            {getPageNumbers().map((page, index) => (
                              <PaginationItem key={index}>
                                {page === 'ellipsis1' || page === 'ellipsis2' ? (
                                  <PaginationEllipsis />
                                ) : (
                                  <PaginationLink
                                    isActive={page === currentPage}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                )}
                              </PaginationItem>
                            ))}

                            {currentPage < totalPages && (
                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                  className="cursor-pointer"
                                />
                              </PaginationItem>
                            )}
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  ) : (
                    <NoResults
                      title="No vacancies found"
                      description="Try adjusting your search criteria"
                      actionLabel="Reset Search"
                      onAction={resetFilters}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <CardTitle>Saved & Applied Vacancies</CardTitle>
                    <CardDescription>Track vacancies you've saved or applied for</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SavedAndApplied
                  savedTabView={savedTabView}
                  setSavedTabView={setSavedTabView}
                  savedVacancies={savedVacancies}
                  appliedVacancies={appliedVacancies}
                  toggleSaveVacancy={toggleSaveVacancy}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ProfessionalProfileEditForm
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        initialData={profileData}
        onSave={handleProfileSave}
      />
    </MainLayout>
  );
};

export default ProfessionalDashboard;
