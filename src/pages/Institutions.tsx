
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import InstitutionCard from '@/components/InstitutionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const Institutions = () => {
  // Sample data for institutions
  const institutions = [
    {
      id: '1',
      name: 'Berlin Medical Center',
      type: 'Hospital',
      location: 'Berlin, Germany',
      openPositions: 12,
    },
    {
      id: '2',
      name: 'Madrid Health Clinic',
      type: 'Specialty Clinic',
      location: 'Madrid, Spain',
      openPositions: 5,
    },
    {
      id: '3',
      name: 'Stockholm University Hospital',
      type: 'University Hospital',
      location: 'Stockholm, Sweden',
      openPositions: 8,
    },
    {
      id: '4',
      name: 'Vienna General Hospital',
      type: 'General Hospital',
      location: 'Vienna, Austria',
      openPositions: 15,
    },
    {
      id: '5',
      name: 'Amsterdam Medical Institute',
      type: 'Research Hospital',
      location: 'Amsterdam, Netherlands',
      openPositions: 7,
    },
    {
      id: '6',
      name: 'Lisbon Primary Care',
      type: 'Primary Care Center',
      location: 'Lisbon, Portugal',
      openPositions: 4,
    },
  ];

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [hasOpenPositions, setHasOpenPositions] = useState(false);

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Filter institutions based on criteria
  const filteredInstitutions = institutions.filter(institution => {
    // Search query filter
    if (searchQuery && !institution.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !institution.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (selectedType && institution.type !== selectedType) {
      return false;
    }
    
    // Location filter
    if (selectedLocation && !institution.location.includes(selectedLocation)) {
      return false;
    }
    
    // Open positions filter
    if (hasOpenPositions && institution.openPositions <= 0) {
      return false;
    }
    
    return true;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Healthcare Institutions</h1>
            <p className="text-muted-foreground">
              Discover top hospitals, clinics, and healthcare facilities seeking talented professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search institutions..."
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
          {/* Filters - Desktop (always visible) and Mobile (toggled) */}
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
                <label className="text-sm font-medium">Institution Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                    <SelectItem value="Specialty Clinic">Specialty Clinic</SelectItem>
                    <SelectItem value="University Hospital">University Hospital</SelectItem>
                    <SelectItem value="General Hospital">General Hospital</SelectItem>
                    <SelectItem value="Research Hospital">Research Hospital</SelectItem>
                    <SelectItem value="Primary Care Center">Primary Care Center</SelectItem>
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
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Austria">Austria</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="open-positions" 
                    checked={hasOpenPositions}
                    onCheckedChange={(checked) => setHasOpenPositions(checked === true)}
                  />
                  <label
                    htmlFor="open-positions"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Has open positions
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedType('');
                setSelectedLocation('');
                setHasOpenPositions(false);
              }}>
                Reset Filters
              </Button>
            </div>
          </aside>
          
          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">
                {filteredInstitutions.length} {filteredInstitutions.length === 1 ? 'Institution' : 'Institutions'}
              </h3>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="positions-high">Open Positions (High to Low)</SelectItem>
                  <SelectItem value="positions-low">Open Positions (Low to High)</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredInstitutions.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredInstitutions.map((institution) => (
                  <InstitutionCard
                    key={institution.id}
                    {...institution}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium mb-2">No institutions found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedType('');
                  setSelectedLocation('');
                  setHasOpenPositions(false);
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

export default Institutions;
