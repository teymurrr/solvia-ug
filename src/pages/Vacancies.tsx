
import React, { useState, useEffect, FormEvent } from 'react';
import MainLayout from '@/components/MainLayout';
import VacancyCard from '@/components/VacancyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, X, ChevronDown, Briefcase, Building, MapPin, GraduationCap, Heart } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useVacancies } from '@/hooks/useVacancies';
import { Skeleton } from '@/components/ui/skeleton';

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

const ITEMS_PER_PAGE = 20;

const Vacancies = () => {
  const { vacancies, loading } = useVacancies();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(vacancies);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedResults, setPaginatedResults] = useState(vacancies);
  
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('all_countries');
  const [selectedCity, setSelectedCity] = useState<string>('all_cities');
  const [selectedProfession, setSelectedProfession] = useState<string>('all_professions');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all_specialties');
  
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);

  // Extract unique values for filters from real vacancies
  const jobTypes = getUniqueValues(vacancies, 'job_type');
  const countries = getUniqueValues(vacancies.filter(v => v.country), 'country');
  const cities = getUniqueValues(vacancies.filter(v => v.city), 'city');
  const professions = getUniqueValues(vacancies.filter(v => v.profession), 'profession');
  const specialties = getUniqueValues(vacancies.filter(v => v.specialty), 'specialty');

  useEffect(() => {
    const savedVacanciesData = localStorage.getItem('savedVacancies');
    if (savedVacanciesData) {
      try {
        setSavedVacancies(JSON.parse(savedVacanciesData));
      } catch (error) {
        console.error("Error parsing saved vacancies from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedVacancies', JSON.stringify(savedVacancies));
  }, [savedVacancies]);

  const toggleSaveVacancy = (vacancyId: string) => {
    setSavedVacancies(prev => {
      if (prev.includes(vacancyId)) {
        return prev.filter(id => id !== vacancyId);
      } else {
        return [...prev, vacancyId];
      }
    });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    applyFilters();
  };

  const applyFilters = () => {
    const filtered = vacancies.filter(vacancy => {
      if (searchQuery && 
          !vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !vacancy.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !vacancy.institution.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !vacancy.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(vacancy.job_type)) {
        return false;
      }
      
      if (selectedCountry !== 'all_countries' && vacancy.country !== selectedCountry) {
        return false;
      }
      
      if (selectedCity !== 'all_cities' && vacancy.city !== selectedCity) {
        return false;
      }
      
      if (selectedProfession !== 'all_professions' && vacancy.profession !== selectedProfession) {
        return false;
      }
      
      if (selectedSpecialty !== 'all_specialties' && vacancy.specialty !== selectedSpecialty) {
        return false;
      }
      
      return true;
    });
    
    setSearchResults(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(prev => (prev > Math.ceil(filtered.length / ITEMS_PER_PAGE) ? 1 : prev));
    
    const newActiveFilters = [];
    if (selectedJobTypes.length > 0) {
      newActiveFilters.push(...selectedJobTypes);
    }
    if (selectedCountry !== 'all_countries') {
      newActiveFilters.push(selectedCountry);
    }
    if (selectedCity !== 'all_cities') {
      newActiveFilters.push(selectedCity);
    }
    if (selectedProfession !== 'all_professions') {
      newActiveFilters.push(selectedProfession);
    }
    if (selectedSpecialty !== 'all_specialties') {
      newActiveFilters.push(selectedSpecialty);
    }
    
    setActiveFilters(newActiveFilters);
  };

  const toggleJobType = (jobType: string) => {
    if (selectedJobTypes.includes(jobType)) {
      setSelectedJobTypes(selectedJobTypes.filter(type => type !== jobType));
    } else {
      setSelectedJobTypes([...selectedJobTypes, jobType]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedJobTypes([]);
    setSelectedCountry('all_countries');
    setSelectedCity('all_cities');
    setSelectedProfession('all_professions');
    setSelectedSpecialty('all_specialties');
    setActiveFilters([]);
    setSearchResults(vacancies);
  };

  useEffect(() => {
    if (vacancies.length > 0) {
      applyFilters();
    }
  }, [selectedJobTypes, selectedCountry, selectedCity, selectedProfession, selectedSpecialty, vacancies]);

  useEffect(() => {
    setSearchResults(vacancies);
  }, [vacancies]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedResults(searchResults.slice(startIndex, endIndex));
  }, [searchResults, currentPage]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 7) {
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

  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Healthcare Vacancies</h1>
            <p className="text-muted-foreground">
              Find the perfect healthcare position that matches your skills and career goals
            </p>
            
            <form onSubmit={handleSearch} className="mt-8 relative">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for job titles, skills, or institutions..."
                  className="pl-10 pr-20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex md:hidden justify-between items-center mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <Filter className="h-4 w-4" />
                Filters
                <Badge variant="secondary" className="ml-1">{activeFilters.length}</Badge>
              </Button>
              
              {activeFilters.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="py-1 px-3">
                    {filter}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    if (selectedJobTypes.includes(filter)) {
                      setSelectedJobTypes(selectedJobTypes.filter(type => type !== filter));
                    } else if (selectedCountry === filter) {
                      setSelectedCountry('all_countries');
                    } else if (selectedCity === filter) {
                      setSelectedCity('all_cities');
                    } else if (selectedProfession === filter) {
                      setSelectedProfession('all_professions');
                    } else if (selectedSpecialty === filter) {
                      setSelectedSpecialty('all_specialties');
                    }
                  }}
                    />
                  </Badge>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetFilters}
                  className="text-sm font-normal h-7"
                >
                  Clear all
                </Button>
              </div>
            )}
            
            <aside className={`md:w-72 space-y-6 ${filtersVisible ? 'block' : 'hidden'} md:block bg-card p-4 rounded-lg h-fit sticky top-20`}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setFiltersVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium mb-2">Job Type</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span>{selectedJobTypes.length > 0 ? `${selectedJobTypes.length} selected` : 'Select job types'}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
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
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Country</h3>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_countries">All countries</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">City</h3>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_cities">All cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Profession</h3>
                  <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_professions">All professions</SelectItem>
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Specialty</h3>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_specialties">All specialties</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </aside>
            
            <div className="flex-1">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">
                      {searchResults.length} {searchResults.length === 1 ? 'Vacancy' : 'Vacancies'}
                    </h3>
                    
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {searchResults.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-6">
                        {paginatedResults.map((vacancy) => (
                          <VacancyCard
                            key={vacancy.id}
                            {...vacancy}
                            jobType={vacancy.job_type}
                            showSaveOption={true}
                            isSaved={savedVacancies.includes(vacancy.id)}
                            onSaveToggle={toggleSaveVacancy}
                          />
                        ))}
                      </div>
                  
                  {totalPages > 1 && (
                    <Pagination className="my-8">
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
                <div className="text-center py-12 border rounded-lg bg-accent/10">
                  <h3 className="text-lg font-medium mb-2">No vacancies found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                  <Button onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Vacancies;
