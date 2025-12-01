import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useLanguage } from '@/hooks/useLanguage';

const Professionals = () => {
  const { professionals, loading, error } = useProfessionals();
  const { t } = useLanguage();
  
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

  // Get unique specialties and locations from the data
  const { specialties, locations, availableLanguages } = useMemo(() => {
    const specialtiesSet = new Set<string>();
    const locationsSet = new Set<string>();
    const languagesSet = new Set<string>();
    
    professionals.forEach(p => {
      if (p.specialty) specialtiesSet.add(p.specialty);
      if (p.country) locationsSet.add(p.country);
      p.languages?.forEach(lang => {
        if (lang.language) languagesSet.add(lang.language);
      });
    });
    
    return {
      specialties: Array.from(specialtiesSet).sort(),
      locations: Array.from(locationsSet).sort(),
      availableLanguages: Array.from(languagesSet).sort()
    };
  }, [professionals]);

  // Calculate experience from experiences array
  const calculateExperience = (experiences: any[]) => {
    if (!experiences || experiences.length === 0) return 0;
    return experiences.reduce((total, exp) => {
      const start = exp.startDate ? new Date(exp.startDate) : null;
      const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : null);
      if (start && end) {
        return total + Math.max(0, end.getFullYear() - start.getFullYear());
      }
      return total;
    }, 0);
  };

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(professional => {
      const fullName = `${professional.firstName} ${professional.lastName}`.toLowerCase();
      const specialty = (professional.specialty || '').toLowerCase();
      
      if (searchQuery && !fullName.includes(searchQuery.toLowerCase()) && 
          !specialty.includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (selectedSpecialty !== 'all' && professional.specialty !== selectedSpecialty) {
        return false;
      }
      
      if (selectedLocation !== 'all' && professional.country !== selectedLocation) {
        return false;
      }
      
      const experience = calculateExperience(professional.experiences || []);
      if (experience < minExperience) {
        return false;
      }
      
      if (selectedLanguages.length > 0) {
        const profLanguages = professional.languages?.map(l => l.language) || [];
        if (!selectedLanguages.every(lang => profLanguages.includes(lang))) {
          return false;
        }
      }
      
      return true;
    });
  }, [professionals, searchQuery, selectedSpecialty, selectedLocation, minExperience, selectedLanguages]);

  // Map professional data to card props
  const mapToCardProps = (professional: typeof professionals[0]) => {
    const languageNames = professional.languages?.map(l => l.language).filter(Boolean) || [];
    const experience = calculateExperience(professional.experiences || []);
    
    return {
      id: professional.id,
      name: `${professional.firstName} ${professional.lastName}`.trim(),
      title: professional.profession || professional.specialty || 'Healthcare Professional',
      location: professional.country || 'Location not specified',
      specialty: professional.specialty || 'General',
      languages: languageNames.length > 0 ? languageNames : ['Not specified'],
      experience,
      imageSrc: professional.profileImage
    };
  };

  return (
    <MainLayout>
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">{t('professionals.title')}</h1>
            <p className="text-muted-foreground">
              {t('professionals.subtitle')}
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
              {t('professionals.filters')}
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`md:w-64 lg:w-72 space-y-6 ${filtersVisible ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center justify-between md:justify-start">
              <h2 className="font-semibold text-lg">{t('professionals.filters')}</h2>
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
                <label className="text-sm font-medium">{t('professionals.specialty')}</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('professionals.location')}</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t('professionals.experience')}</label>
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
                  {availableLanguages.map((language) => (
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
                {loading ? '...' : filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'Professional' : 'Professionals'}
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
            
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard
                    key={professional.id}
                    {...mapToCardProps(professional)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-medium mb-2">No professionals found</h3>
                <p className="text-muted-foreground mb-6">
                  {error || 'Try adjusting your search filters'}
                </p>
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
