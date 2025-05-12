import React, { useState, useEffect } from 'react';
import { Search, Users, RefreshCw } from 'lucide-react';
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
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface Application {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantPhoto?: string;
  vacancyTitle: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

type PageType = number | 'ellipsis1' | 'ellipsis2';

interface ApplicationsTabProps {
  applications: Application[];
  filteredApplications: Application[];
  loading?: boolean;
  error?: string | null;
  searchQuery: string;
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  filters: {
    status: string;
    date: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  refreshApplications?: () => void;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  applications,
  filteredApplications,
  loading = false,
  error = null,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  filters,
  onFilterChange,
  refreshApplications
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredApplications]);

  // Calculate pagination values
  const totalPages = Math.ceil((filteredApplications?.length || 0) / applicationsPerPage);
  const startIndex = (currentPage - 1) * applicationsPerPage;
  const endIndex = startIndex + applicationsPerPage;
  const currentApplications = filteredApplications?.slice(startIndex, endIndex) || [];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: PageType[] = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers, with ellipsis if needed
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(maxPagesToShow - 1, totalPages - 1);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - (maxPagesToShow - 2));
      }
      
      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pages.push('ellipsis1');
      }
      
      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis2');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Applications</CardTitle>
          <CardDescription>
            Review and manage job applications
          </CardDescription>
        </div>
        {refreshApplications && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshApplications}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by applicant name or vacancy title" 
                className="pl-10" 
                value={searchQuery}
                onChange={onSearchQueryChange}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                disabled={loading}
              />
            </div>
            <Button 
              type="button" 
              onClick={onSearch}
              disabled={loading}
            >
              Search
            </Button>
          </div>
          
          {/* Implement FilterDropdowns component for filtering applications */}
          {/* Add filter options for status and date */}
          {/* Pass filters and onFilterChange props to the FilterDropdowns component */}
          
          {loading ? (
            // Show loading skeletons
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 border rounded-lg space-y-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Show error message
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-red-500">{error}</h3>
              <p className="text-muted-foreground mt-2">
                There was a problem loading applications
              </p>
              {refreshApplications && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={refreshApplications}
                >
                  Try Again
                </Button>
              )}
            </div>
          ) : Array.isArray(currentApplications) && currentApplications.length > 0 ? (
            // Show application cards
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                {/* Implement ApplicationCard component to display application details */}
                {/* Pass application data as props to the ApplicationCard component */}
                {currentApplications.map((application) => (
                  <div key={application.id} className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{application.applicantName}</h3>
                        <p className="text-muted-foreground">{application.vacancyTitle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Applied on {application.appliedDate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: {application.status}
                        </p>
                      </div>
                    </div>
                  </div>
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
                    
                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis1' || page === 'ellipsis2' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (typeof page === 'number') {
                                setCurrentPage(page);
                              }
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        )}
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
          ) : Array.isArray(applications) && applications.length > 0 && (searchQuery || !Object.values(filters).every(f => f.startsWith('all_'))) ? (
            // No results for search/filter
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No matching applications found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          ) : !Array.isArray(applications) || applications.length === 0 ? (
            // No applications in database
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No applications have been received yet</h3>
              <p className="text-muted-foreground">
                Check back later as candidates apply for positions
              </p>
            </div>
          ) : (
            // Default empty state
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Manage job applications</h3>
              <p className="text-muted-foreground">
                Use the search and filters above to find specific applications
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
