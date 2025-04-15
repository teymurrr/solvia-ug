
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Briefcase, MapPin, Building } from 'lucide-react';

interface FilterBarProps {
  jobTypes: string[];
  selectedJobTypes: string[];
  toggleJobType: (jobType: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countries: string[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
  activeFilters: string[];
  resetFilters: () => void;
  getJobTypeIcon: (jobType: string) => JSX.Element;
}

const FilterBar: React.FC<FilterBarProps> = ({
  jobTypes,
  selectedJobTypes,
  toggleJobType,
  selectedCountry,
  setSelectedCountry,
  countries,
  selectedCity,
  setSelectedCity,
  cities,
  activeFilters,
  resetFilters,
  getJobTypeIcon
}) => {
  return (
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
                      <Badge className="ml-1 bg-primary text-white">
                        {selectedJobTypes.length}
                      </Badge>
                    )}
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
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Select Country</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {countries.map((country) => (
                    <DropdownMenuCheckboxItem
                      key={country}
                      checked={selectedCountry === country}
                      onCheckedChange={() => {
                        if (selectedCountry === country) {
                          setSelectedCountry('');
                        } else {
                          setSelectedCountry(country);
                        }
                      }}
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    City
                    {selectedCity && (
                      <Badge className="ml-1 bg-primary text-white">1</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Select City</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {cities.map((city) => (
                    <DropdownMenuCheckboxItem
                      key={city}
                      checked={selectedCity === city}
                      onCheckedChange={() => {
                        if (selectedCity === city) {
                          setSelectedCity('');
                        } else {
                          setSelectedCity(city);
                        }
                      }}
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
        <>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto">
            Reset filters
          </Button>
          <div className="flex flex-wrap gap-2 w-full mt-2">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="py-1">
                {filter}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterBar;
