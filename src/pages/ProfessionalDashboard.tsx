import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Settings, FileText, Search, Filter, ChevronDown, MapPin, Building, GraduationCap, Heart, BookmarkCheck, FileCheck, MagnifyingGlass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProfessionalProfileEditForm } from '@/components/professional-profile';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { useAuth } from '@/contexts/AuthContext';
import VacancyCard from '@/components/VacancyCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from "@/components/ui/progress";

const sampleVacancies = [
  {
    id: '1',
    title: 'Senior Cardiologist',
    institution: 'General Hospital, New York',
    location: 'New York, USA',
    description: 'Looking for an experienced cardiologist to join our team. Must have excellent diagnostic skills and patient care abilities.',
    jobType: 'Full-time',
    specialty: 'Cardiology',
    profession: 'Doctor',
    postedDate: '2025-03-15',
    applicationDeadline: '2025-05-15',
    requirements: ['English required', '5+ years experience', 'Board certification']
  },
  {
    id: '2',
    title: 'Pediatric Nurse',
    institution: 'Children\'s Hospital, Boston',
    location: 'Boston, USA',
    description: 'Seeking pediatric nurse with experience in intensive care unit. Compassionate care for young patients required.',
    jobType: 'Part-time',
    specialty: 'Pediatrics',
    profession: 'Nurse',
    postedDate: '2025-03-10',
    applicationDeadline: '2025-04-30',
    requirements: ['Pediatric certification', '3+ years experience', 'BLS certification']
  },
  {
    id: '3',
    title: 'Neurologist',
    institution: 'Medical Center, Chicago',
    location: 'Chicago, USA',
    description: 'Neurologist needed for busy medical center. Will be responsible for patient diagnosis and treatment plans.',
    jobType: 'Full-time',
    specialty: 'Neurology',
    profession: 'Doctor',
    postedDate: '2025-03-05',
    applicationDeadline: '2025-05-05',
    requirements: ['Board certified', '7+ years experience', 'Research experience preferred']
  },
  {
    id: '4',
    title: 'Emergency Room Physician',
    institution: 'City Hospital, Los Angeles',
    location: 'Los Angeles, USA',
    description: 'ER doctor needed for high-volume emergency department. Must excel in fast-paced environment.',
    jobType: 'Full-time',
    specialty: 'Emergency Medicine',
    profession: 'Doctor',
    postedDate: '2025-02-28',
    applicationDeadline: '2025-04-28',
    requirements: ['ER certification', '5+ years experience', 'ACLS certification']
  },
  {
    id: '5',
    title: 'Medical Technician',
    institution: 'Diagnostic Center, Dallas',
    location: 'Dallas, USA',
    description: 'Medical lab tech needed for diagnostic testing. Experience with advanced equipment required.',
    jobType: 'Full-time',
    specialty: 'Laboratory Science',
    profession: 'Technician',
    postedDate: '2025-03-01',
    applicationDeadline: '2025-04-15',
    requirements: ['Lab certification', '2+ years experience', 'Experience with PCR testing']
  },
  {
    id: '6',
    title: 'Volunteer Nurse',
    institution: 'Community Clinic, Miami',
    location: 'Miami, USA',
    description: 'Looking for volunteer nurses to help at our community clinic serving underprivileged populations.',
    jobType: 'Volunteer',
    specialty: 'General Nursing',
    profession: 'Nurse',
    postedDate: '2025-03-08',
    applicationDeadline: '2025-06-08',
    requirements: ['Nursing license', 'Compassionate attitude', 'Bilingual (English/Spanish) preferred']
  },
  {
    id: '7',
    title: 'Medical Intern',
    institution: 'University Hospital, Seattle',
    location: 'Seattle, USA',
    description: 'Medical internship position available for recent graduates looking to gain hands-on experience.',
    jobType: 'Internship',
    specialty: 'General Medicine',
    profession: 'Doctor',
    postedDate: '2025-03-12',
    applicationDeadline: '2025-05-01',
    requirements: ['Medical degree', 'Recent graduate', 'Strong academic record']
  },
];

const getUniqueValues = (data: any[], property: string) => {
  return [...new Set(data.map(item => item[property]))];
};

const getJobTypeIcon = (jobType: string) => {
  switch(jobType) {
    case 'Full-time':
      return <Briefcase className="h-4 w-4 mr-2" />;
    case 'Part-time':
      return <Briefcase className="h-4 w-4 mr-2" />;
    case 'Internship':
      return <GraduationCap className="h-4 w-4 mr-2" />;
    case 'Volunteer':
      return <Heart className="h-4 w-4 mr-2" />;
    default:
      return <Briefcase className="h-4 w-4 mr-2" />;
  }
};

const ProfessionalDashboard = () => {
  const { userType } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [vacancyResults, setVacancyResults] = useState(sampleVacancies);
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(vacancyResults.length / ITEMS_PER_PAGE);
  
  const currentVacancies = vacancyResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);
  const [appliedVacancies, setAppliedVacancies] = useState<string[]>(['1', '3']);
  
  const jobTypes = getUniqueValues(sampleVacancies, 'jobType');
  const countries = ['USA'];
  const cities = ['New York', 'Boston', 'Chicago', 'Los Angeles', 'Dallas', 'Miami', 'Seattle'];
  
  const defaultProfileData: ProfileFormValues = {
    firstName: "John",
    lastName: "Doe",
    profession: "Doctor",
    specialty: "Cardiologist",
    email: "john.doe@example.com",
    location: "New York, USA",
    about: "Your profile is incomplete. Add more information about yourself to attract potential employers.",
    experiences: [],
    education: [],
    languages: [],
    activelySearching: false,
    profileImage: "",
    sfpCertificate: false,
    sfpCertificateFile: ""
  };
  
  const [profileData, setProfileData] = useState<ProfileFormValues>(defaultProfileData);
  const [savedTabView, setSavedTabView] = useState<'saved' | 'applied'>('saved');
  
  useEffect(() => {
    const storageKey = userType ? `profileData_${userType}` : 'profileData';
    const userData = localStorage.getItem(storageKey);
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setProfileData(parsedData);
      } catch (error) {
        console.error("Error parsing profile data from localStorage:", error);
        setProfileData(defaultProfileData);
      }
    }
    
    const savedVacanciesData = localStorage.getItem('savedVacancies');
    if (savedVacanciesData) {
      try {
        setSavedVacancies(JSON.parse(savedVacanciesData));
      } catch (error) {
        console.error("Error parsing saved vacancies from localStorage:", error);
      }
    }
  }, [userType]);

  useEffect(() => {
    localStorage.setItem('savedVacancies', JSON.stringify(savedVacancies));
  }, [savedVacancies]);

  const handleProfileSave = (data: ProfileFormValues) => {
    setProfileData(data);
    
    const storageKey = userType ? `profileData_${userType}` : 'profileData';
    localStorage.setItem(storageKey, JSON.stringify(data));
  };
  
  useEffect(() => {
    setSelectedCity('');
  }, [selectedCountry]);

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

  const toggleJobType = (jobType: string) => {
    setSelectedJobTypes(prev => {
      if (prev.includes(jobType)) {
        return prev.filter(type => type !== jobType);
      } else {
        return [...prev, jobType];
      }
    });
  };

  const applyFilters = () => {
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
    
    const newActiveFilters = [];
    if (selectedJobTypes.length > 0) {
      newActiveFilters.push(...selectedJobTypes);
    }
    if (selectedCountry) {
      newActiveFilters.push(selectedCountry);
    }
    if (selectedCity) {
      newActiveFilters.push(selectedCity);
    }
    
    setActiveFilters(newActiveFilters);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedJobTypes([]);
    setSelectedCountry('');
    setSelectedCity('');
    setActiveFilters([]);
    setVacancyResults(sampleVacancies);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedJobTypes, selectedCountry, selectedCity]);

  const handleSearch = () => {
    applyFilters();
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
  
  const getSavedVacancies = () => {
    return sampleVacancies.filter(vacancy => savedVacancies.includes(vacancy.id));
  };
  
  const getAppliedVacancies = () => {
    return sampleVacancies.filter(vacancy => appliedVacancies.includes(vacancy.id));
  };
  
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
                <CardDescription>
                  This is how institutions will see you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {profileData.profileImage ? (
                        <img 
                          src={profileData.profileImage} 
                          alt={`${profileData.firstName} ${profileData.lastName}`} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-grow">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {profileData.firstName} {profileData.lastName}
                        {profileData.activelySearching && (
                          <Badge className="ml-2 bg-green-500">Actively searching</Badge>
                        )}
                      </h2>
                      <p className="text-medical-600">{profileData.specialty}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>{profileData.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p>{profileData.location || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Profession</h3>
                        <p>{profileData.profession}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">SFP Certificate</h3>
                        <p>{profileData.sfpCertificate ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    
                    {profileData.experiences && profileData.experiences.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                        <div className="space-y-2 mt-1">
                          {profileData.experiences.map((exp, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{exp.role} at {exp.hospital}</p>
                              <p className="text-muted-foreground">
                                {exp.location} | {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profileData.education && profileData.education.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Education</h3>
                        <div className="space-y-2 mt-1">
                          {profileData.education.map((edu, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{edu.degree} in {edu.field}</p>
                              <p className="text-muted-foreground">
                                {edu.institution} | {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profileData.languages && profileData.languages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Languages</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profileData.languages.map((lang, index) => (
                            <Badge key={index} variant="outline">
                              {lang.language} ({lang.level})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                      <p className="text-muted-foreground">
                        {profileData.about || "Your profile is incomplete. Add more information about yourself to attract potential employers."}
                      </p>
                    </div>
                    
                    <Button variant="default" onClick={() => setIsEditProfileOpen(true)}>
                      {!profileData.experiences || profileData.experiences.length === 0 ? "Complete Your Profile" : "Update Profile"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vacancies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Vacancies</CardTitle>
                <CardDescription>
                  Explore open positions in healthcare institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search by title, location, or keyword..." 
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="md:w-auto"
                      onClick={handleSearch}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4" />
                                  Job Type
                                  {selectedJobTypes.length > 0 && (
                                    <Badge className="ml-1 bg-primary text-white">{selectedJobTypes.length}</Badge>
                                  )}
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuLabel>Select Job Types</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {jobTypes.map((jobType) => (
                                  <DropdownMenuCheckboxItem
                                    key={jobType}
                                    checked={selectedJobTypes.includes(jobType)}
                                    onCheckedChange={() => toggleJobType(jobType)}
                                  >
                                    {getJobTypeIcon(jobType)}
                                    {jobType}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Filter by job type</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Country
                                  {selectedCountry && (
                                    <Badge className="ml-1 bg-primary text-white">1</Badge>
                                  )}
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuLabel>Select Country</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {countries.map((country) => (
                                  <DropdownMenuCheckboxItem
                                    key={country}
                                    checked={selectedCountry === country}
                                    onCheckedChange={() => setSelectedCountry(prev => prev === country ? '' : country)}
                                  >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {country}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Filter by country</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="flex items-center gap-2"
                                >
                                  <Building className="h-4 w-4" />
                                  City
                                  {selectedCity && (
                                    <Badge className="ml-1 bg-primary text-white">1</Badge>
                                  )}
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuLabel>Select City</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {cities.map((city) => (
                                  <DropdownMenuCheckboxItem
                                    key={city}
                                    checked={selectedCity === city}
                                    onCheckedChange={() => setSelectedCity(prev => prev === city ? '' : city)}
                                  >
                                    <Building className="h-4 w-4 mr-2" />
                                    {city}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Filter by city</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {activeFilters.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={resetFilters}
                        className="ml-auto"
                      >
                        Reset filters
                      </Button>
                    )}
                  </div>
                  
                  {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter, index) => (
                        <Badge key={index} variant="secondary" className="py-1">
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  )}
                
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
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No vacancies found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search criteria
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={resetFilters}
                      >
                        Reset Search
                      </Button>
                    </div>
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
                    <CardDescription>
                      Track vacancies you've saved or applied for
                    </CardDescription>
                  </div>
                  <div className="flex mt-2 sm:mt-0">
                    <Button 
                      variant={savedTabView === 'saved' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSavedTabView('saved')}
                      className="rounded-r-none"
                    >
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Saved
                    </Button>
                    <Button 
                      variant={savedTabView === 'applied' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSavedTabView('applied')}
                      className="rounded-l-none"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Applied
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedTabView === 'saved' ? (
                    savedVacancies.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {getSavedVacancies().map((vacancy) => (
                          <VacancyCard
                            key={vacancy.id}
                            {...vacancy}
                            showSaveOption={true}
                            isSaved={true}
                            onSaveToggle={toggleSaveVacancy}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookmarkCheck className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No saved vacancies</h3>
                        <p className="text-muted-foreground">
                          Save vacancies you're interested in to view them later
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            const tabsList = document.querySelector('[role="tablist"]');
                            const vacanciesTab = tabsList?.querySelector('[value="vacancies"]') as HTMLButtonElement;
                            if (vacanciesTab) vacanciesTab.click();
                          }}
                        >
                          Browse Vacancies
                        </Button>
                      </div>
                    )
                  ) : (
                    appliedVacancies.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {getAppliedVacancies().map((vacancy) => (
                          <VacancyCard
                            key={vacancy.id}
                            {...vacancy}
                            showSaveOption={true}
                            isSaved={savedVacancies.includes(vacancy.id)}
                            onSaveToggle={toggleSaveVacancy}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileCheck className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                        <p className="text-muted-foreground">
                          When you apply for vacancies, they will appear here
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            const tabsList = document.querySelector('[role="tablist"]');
                            const vacanciesTab = tabsList?.querySelector('[value="vacancies"]') as HTMLButtonElement;
                            if (vacanciesTab) vacanciesTab.click();
                          }}
                        >
                          Browse Vacancies
                        </Button>
                      </div>
                    )
                  )}
                </div>
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
