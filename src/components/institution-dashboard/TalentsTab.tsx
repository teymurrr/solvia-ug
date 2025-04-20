
import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ProfessionalCard from './ProfessionalCard';
import FilterDropdowns from './FilterDropdowns';

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  profession?: string;
  country?: string;
  language?: string;
  isOpenToRelocation?: boolean;
}

interface TalentsTabProps {
  professionals: Professional[];
  filteredProfessionals: Professional[];
  searchQuery: string;
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  filters: {
    role: string;
    profession: string;
    country: string;
    language: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
}

const TalentsTab: React.FC<TalentsTabProps> = ({
  professionals,
  filteredProfessionals,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  filters,
  onFilterChange
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const professionalsPerPage = 20;

  // Debug logs to check what data we're receiving
  console.log('TalentsTab - All professionals:', professionals);
  console.log('TalentsTab - Filtered professionals:', filteredProfessionals);
  console.log('TalentsTab - Current filters:', filters);

  // Calculate pagination values
  const totalPages = Math.ceil((filteredProfessionals?.length || 0) / professionalsPerPage);
  const startIndex = (currentPage - 1) * professionalsPerPage;
  const endIndex = startIndex + professionalsPerPage;
  const currentProfessionals = filteredProfessionals?.slice(startIndex, endIndex) || [];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Healthcare Professionals</CardTitle>
        <CardDescription>
          Find and connect with qualified professionals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by specialty, name, or location" 
                className="pl-10" 
                value={searchQuery}
                onChange={onSearchQueryChange}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>
            <Button type="button" onClick={onSearch}>Search</Button>
          </div>
          
          <FilterDropdowns 
            filters={filters}
            onFilterChange={onFilterChange}
          />
          
          {Array.isArray(currentProfessionals) && currentProfessionals.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                {currentProfessionals.map((professional) => (
                  <ProfessionalCard 
                    key={professional.id || Math.random().toString()} 
                    professional={professional} 
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => prev - 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                    
                    {getPageNumbers().map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => prev + 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          ) : Array.isArray(professionals) && professionals.length > 0 && (searchQuery || !Object.values(filters).every(f => f.startsWith('all_'))) ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No matching professionals found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          ) : !Array.isArray(professionals) || professionals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No professionals have signed up yet</h3>
              <p className="text-muted-foreground">
                Check back later as healthcare professionals join the platform
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Loading professionals...</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch the data
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentsTab;
