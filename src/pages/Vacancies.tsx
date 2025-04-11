
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
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, ChevronDown, Briefcase, Building, MapPin, GraduationCap, Heart } from 'lucide-react';

// Sample vacancy data that would normally come from an API
const sampleVacancies = [
  {
    id: '1',
    title: 'Neurologist',
    institution: 'Berlin Medical Center',
    location: 'Berlin, Germany',
    jobType: 'Full-time',
    specialty: 'Neurology',
    profession: 'Doctor',
    description: 'We are looking for an experienced neurologist to join our team...',
    requirements: ['5+ years of experience', 'German language (B2)', 'Board certification'],
    postedDate: '2025-03-15',
    applicationDeadline: '2025-05-15',
  },
  {
    id: '2',
    title: 'Pediatric Nurse',
    institution: 'Vienna Children\'s Hospital',
    location: 'Vienna, Austria',
    jobType: 'Part-time',
    specialty: 'Pediatrics',
    profession: 'Nurse',
    description: 'Join our pediatric department as a part-time nurse...',
    requirements: ['3+ years in pediatric care', 'German language (B2)', 'Registered nurse certification'],
    postedDate: '2025-03-20',
    applicationDeadline: '2025-05-01',
  },
  {
    id: '3',
    title: 'General Practitioner',
    institution: 'Stockholm Health Center',
    location: 'Stockholm, Sweden',
    jobType: 'Full-time',
    specialty: 'Family Medicine',
    profession: 'Doctor',
    description: 'General practitioner needed for primary care center...',
    requirements: ['Medical license', 'Swedish language (B1)', 'Experience with electronic health records'],
    postedDate: '2025-03-25',
    applicationDeadline: '2025-04-30',
  },
  {
    id: '4',
    title: 'Emergency Room Nurse',
    institution: 'Barcelona General Hospital',
    location: 'Barcelona, Spain',
    jobType: 'Full-time',
    specialty: 'Emergency Medicine',
    profession: 'Nurse',
    description: 'Seeking experienced emergency room nurses...',
    requirements: ['Critical care certification', 'Spanish language (B2)', '2+ years in emergency medicine'],
    postedDate: '2025-03-10',
    applicationDeadline: '2025-04-10',
  },
  {
    id: '5',
    title: 'Medical Intern',
    institution: 'Amsterdam University Medical Center',
    location: 'Amsterdam, Netherlands',
    jobType: 'Internship',
    specialty: 'Various',
    profession: 'Doctor',
    description: 'Medical internship opportunity for recent graduates...',
    requirements: ['Medical degree', 'Dutch or English language (B2)', 'Recent graduate'],
    postedDate: '2025-03-05',
    applicationDeadline: '2025-04-15',
  },
  {
    id: '6',
    title: 'Volunteer Nurse',
    institution: 'Lisbon Community Clinic',
    location: 'Lisbon, Portugal',
    jobType: 'Volunteer',
    specialty: 'Community Health',
    profession: 'Nurse',
    description: 'Volunteer opportunities for nurses in community health...',
    requirements: ['Nursing certification', 'Portuguese or English language (A2)', 'Passion for community service'],
    postedDate: '2025-03-01',
    applicationDeadline: '2025-05-30',
  },
];

// Extract unique values for filters
const getUniqueValues = (data: any[], property: string) => {
  return [...new Set(data.map(item => item[property]))];
};

// Get job type icon
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

const Vacancies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(sampleVacancies);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  // Get unique values for filters
  const jobTypes = getUniqueValues(sampleVacancies, 'jobType');
  const locations = getUniqueValues(sampleVacancies, 'location');
  const professions = getUniqueValues(sampleVacancies, 'profession');
  const specialties = getUniqueValues(sampleVacancies, 'specialty');

  // Handle search form submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Apply filters to vacancies
  const applyFilters = () => {
    const filtered = sampleVacancies.filter(vacancy => {
      // Search query filter
      if (searchQuery && 
          !vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !vacancy.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !vacancy.institution.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Job type filter
      if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(vacancy.jobType)) {
        return false;
      }
      
      // Location filter
      if (selectedLocation && !vacancy.location.includes(selectedLocation)) {
        return false;
      }
      
      // Profession filter
      if (selectedProfession && vacancy.profession !== selectedProfession) {
        return false;
      }
      
      // Specialty filter
      if (selectedSpecialty && vacancy.specialty !== selectedSpecialty) {
        return false;
      }
      
      return true;
    });
    
    setSearchResults(filtered);
    
    // Update active filters for display
    const newActiveFilters = [];
    if (selectedJobTypes.length > 0) {
      newActiveFilters.push(...selectedJobTypes);
    }
    if (selectedLocation) {
      newActiveFilters.push(selectedLocation);
    }
    if (selectedProfession) {
      newActiveFilters.push(selectedProfession);
    }
    if (selectedSpecialty) {
      newActiveFilters.push(selectedSpecialty);
    }
    
    setActiveFilters(newActiveFilters);
  };

  // Handle job type selection
  const toggleJobType = (jobType: string) => {
    if (selectedJobTypes.includes(jobType)) {
      setSelectedJobTypes(selectedJobTypes.filter(type => type !== jobType));
    } else {
      setSelectedJobTypes([...selectedJobTypes, jobType]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedJobTypes([]);
    setSelectedLocation('');
    setSelectedProfession('');
    setSelectedSpecialty('');
    setActiveFilters([]);
    setSearchResults(sampleVacancies);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedJobTypes, selectedLocation, selectedProfession, selectedSpecialty]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Healthcare Vacancies</h1>
            <p className="text-muted-foreground">
              Find the perfect healthcare position that matches your skills and career goals
            </p>
            
            {/* Search Box */}
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
      
      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Mobile Toggle */}
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
            
            {/* Active Filters */}
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
                        } else if (selectedLocation === filter) {
                          setSelectedLocation('');
                        } else if (selectedProfession === filter) {
                          setSelectedProfession('');
                        } else if (selectedSpecialty === filter) {
                          setSelectedSpecialty('');
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
            
            {/* Filters Sidebar - Desktop (always visible) and Mobile (toggled) */}
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
                {/* Job Type Filter - Using Dropdown Menu */}
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
                
                {/* Location Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location.split(',')[1].trim()}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Profession Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Profession</h3>
                  <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All professions</SelectItem>
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Specialty Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Specialty</h3>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All specialties</SelectItem>
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
            
            {/* Vacancies List */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium">
                  {searchResults.length} {searchResults.length === 1 ? 'Vacancy' : 'Vacancies'}
                </h3>
                
                {/* Sort Dropdown */}
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
              
              {/* Results */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {searchResults.map((vacancy) => (
                    <VacancyCard
                      key={vacancy.id}
                      {...vacancy}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-accent/10">
                  <h3 className="text-lg font-medium mb-2">No vacancies found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                  <Button onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Vacancies;
