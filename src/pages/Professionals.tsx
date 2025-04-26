import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';

const Professionals = () => {
  const professionals = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Cardiologist',
      location: 'Berlin, Germany',
      specialty: 'Cardiology',
      languages: ['English', 'German'],
      experience: 8,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Neurologist',
      location: 'Barcelona, Spain',
      specialty: 'Neurology',
      languages: ['English', 'Spanish', 'Mandarin'],
      experience: 5,
    },
    {
      id: '3',
      name: 'Emma Williams',
      title: 'Registered Nurse',
      location: 'Stockholm, Sweden',
      specialty: 'Emergency Care',
      languages: ['English', 'Swedish'],
      experience: 7,
    },
    {
      id: '4',
      name: 'Dr. Alejandro Gonzalez',
      title: 'General Practitioner',
      location: 'Lisbon, Portugal',
      specialty: 'Family Medicine',
      languages: ['English', 'Portuguese', 'Spanish'],
      experience: 10,
    },
    {
      id: '5',
      name: 'Sophia Schmidt',
      title: 'Specialized Nurse',
      location: 'Vienna, Austria',
      specialty: 'Pediatrics',
      languages: ['English', 'German'],
      experience: 6,
    },
    {
      id: '6',
      name: 'Dr. James Wilson',
      title: 'Surgeon',
      location: 'Amsterdam, Netherlands',
      specialty: 'Orthopedics',
      languages: ['English', 'Dutch'],
      experience: 12,
    },
  ];

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minExperience, setMinExperience] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const filteredProfessionals = professionals.filter(professional => {
    if (searchQuery && !professional.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !professional.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedSpecialty !== 'all' && professional.specialty !== selectedSpecialty) {
      return false;
    }
    
    if (selectedLocation !== 'all' && !professional.location.includes(selectedLocation)) {
      return false;
    }
    
    if (professional.experience < minExperience) {
      return false;
    }
    
    if (selectedLanguages.length > 0 && !selectedLanguages.every(lang => professional.languages.includes(lang))) {
      return false;
    }
    
    return true;
  });

  return (
    <MainLayout>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Healthcare Professionals</h1>
            <p className="text-muted-foreground">
              Discover skilled medical professionals from around the world ready for their next opportunity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, specialty, etc."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="md:hidden flex items-center gap-2"
              onClick={toggleFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`md:w-64 lg:w-72 space-y-6 ${filtersVisible ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center justify-between md:justify-start">
              <h2 className="font-semibold text-lg">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={toggleFilters}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                    <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Austria">Austria</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Minimum Experience</label>
                  <span className="text-sm text-muted-foreground">{minExperience} years</span>
                </div>
                <Slider
                  value={[minExperience]}
                  min={0}
                  max={15}
                  step={1}
                  onValueChange={(value) => setMinExperience(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Languages</label>
                <div className="space-y-2">
                  {['English', 'German', 'Spanish', 'French', 'Portuguese', 'Swedish', 'Dutch'].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`lang-${language}`} 
                        checked={selectedLanguages.includes(language)}
                        onCheckedChange={() => toggleLanguage(language)}
                      />
                      <label
                        htmlFor={`lang-${language}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setSelectedLocation('all');
                setMinExperience(0);
                setSelectedLanguages([]);
              }}>
                Reset Filters
              </Button>
            </div>
          </aside>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">
                {filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'Professional' : 'Professionals'}
              </h3>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="experience-high">Experience (High to Low)</SelectItem>
                  <SelectItem value="experience-low">Experience (Low to High)</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard
                    key={professional.id}
                    {...professional}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium mb-2">No professionals found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('all');
                  setSelectedLocation('all');
                  setMinExperience(0);
                  setSelectedLanguages([]);
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Professionals;
