import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, GraduationCap, Heart } from 'lucide-react';
import { ProfessionalProfileEditForm } from '@/components/professional-profile';
import VacancyCard from '@/components/VacancyCard';
import {
  ProfileCard,
  VacancySearch,
  FilterBar,
  NoResults,
  useDashboard,
} from '@/components/professional-dashboard';
import SavedAndApplied from '@/components/professional-dashboard/SavedAndApplied';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
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
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Get the active tab from location state if provided
  const defaultTab = location.state?.activeTab || 'profile';
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
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
    appliedVacancies,
    profileData,
    savedTabView,
    setSavedTabView,
    jobTypes,
    countries,
    cities,
    toggleJobType,
    resetFilters,
    handleProfileSave,
    vacancyResults,
    handleSearch,
    loading,
    toggleSaveVacancy,
    refreshSavedVacancies,
    refreshAppliedVacancies
  } = useDashboard();

  // Update active tab when location state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    
    // Restore search state if available
    if (location.state?.searchQuery !== undefined) {
      setSearchQuery(location.state.searchQuery);
    }
    
    if (location.state?.currentPage) {
      setCurrentPage(location.state.currentPage);
    }
    
    // If an application was just submitted, show a success toast
    if (location.state?.applicationSubmitted) {
      toast({
        title: "Application submitted successfully",
        description: "Your application has been recorded. You can view it in the 'Saved & Applied' tab.",
        variant: "default", // Changed from "success" to "default"
      });
    }
  }, [location.state, setSearchQuery, setCurrentPage, toast]);

  useEffect(() => {
    // Refresh saved and applied vacancies when switching to saved tab
    if (activeTab === 'saved') {
      refreshSavedVacancies();
      refreshAppliedVacancies();
    }
  }, [activeTab, refreshSavedVacancies, refreshAppliedVacancies]);

  const calculateProfileCompletion = (profile: typeof profileData): number => {
    if (!profile) return 0;
    
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

  const totalPages = Math.ceil(vacancyResults.length / ITEMS_PER_PAGE);
  const currentVacancies = vacancyResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCurrentFilters = () => {
    return {
      jobTypes: selectedJobTypes,
      country: selectedCountry,
      city: selectedCity
    };
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

  const profileCompletionPercentage = profileData ? calculateProfileCompletion(profileData) : 0;

  const selectedFilters = getCurrentFilters();

  // ProfileSkeleton component for loading state
  const ProfileSkeleton = () => (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
      <div className="space-y-4 flex-grow w-full">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
        
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
        
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );

  return (
    <MainLayout hideEditProfile={true}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t?.dashboard?.title || "Professional Dashboard"}</h1>
            <p className="text-muted-foreground">{t?.dashboard?.subtitle || "Manage your profile and view opportunities"}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="profile">{t?.common?.profile || "Profile"}</TabsTrigger>
            <TabsTrigger value="vacancies">{t?.common?.vacancies || "Vacancies"}</TabsTrigger>
            <TabsTrigger value="saved">{t?.dashboard?.saved?.title || "Saved & Applied"}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t?.dashboard?.profile?.title || "Your Profile"}</CardTitle>
                <CardDescription>{t?.dashboard?.profile?.description || "This is how institutions will see you"}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ProfileSkeleton />
                ) : profileData ? (
                  <ProfileCard
                    profileData={profileData}
                    profileCompletionPercentage={profileCompletionPercentage}
                    onEdit={() => setIsEditProfileOpen(true)}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No profile data found. Click below to create your profile.</p>
                    <button 
                      onClick={() => setIsEditProfileOpen(true)}
                      className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                    >
                      {t?.dashboard?.profile?.createProfile || "Create Profile"}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacancies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t?.dashboard?.vacancies?.title || "Available Vacancies"}</CardTitle>
                <CardDescription>{t?.dashboard?.vacancies?.description || "Explore open positions in healthcare institutions"}</CardDescription>
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

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-16 w-full mt-2" />
                            <div className="flex justify-between mt-2">
                              <Skeleton className="h-8 w-24" />
                              <Skeleton className="h-8 w-24" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentVacancies.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-6">
                        {currentVacancies.map((vacancy) => (
                          <VacancyCard
                            key={vacancy.id}
                            {...vacancy}
                            jobType={vacancy.job_type}
                            showSaveOption={true}
                            isSaved={savedVacancies.includes(vacancy.id)}
                            onSaveToggle={toggleSaveVacancy}
                            isDashboardCard={true}
                            isApplied={appliedVacancies.includes(vacancy.id)}
                            searchQuery={searchQuery}
                            currentPage={currentPage}
                            selectedFilters={selectedFilters}
                            fromDashboard={true} // Add this prop to indicate card is from dashboard
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
                      title={t?.dashboard?.vacancies?.noVacanciesFound || "No vacancies found"}
                      description={t?.dashboard?.vacancies?.noVacanciesDesc || "Try adjusting your search criteria"}
                      actionLabel={t?.dashboard?.vacancies?.resetFilters || "Reset Search"}
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
                    <CardTitle>{t?.dashboard?.saved?.title || "Saved & Applied Vacancies"}</CardTitle>
                    <CardDescription>{t?.dashboard?.saved?.description || "Track vacancies you've saved or applied for"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-12 w-full mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <SavedAndApplied 
                    userId={user?.id || ''}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ProfessionalProfileEditForm
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        initialData={profileData || undefined}
        onSave={handleProfileSave}
      />
    </MainLayout>
  );
};

export default ProfessionalDashboard;
