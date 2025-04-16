
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, BookOpen, Bookmark, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Mock learning resources data
const mockResources = Array(60).fill(null).map((_, index) => ({
  id: `resource-${index + 1}`,
  title: `Medical Resource ${index + 1}`,
  description: 'Comprehensive guide for healthcare professionals on latest medical practices and research.',
  type: index % 3 === 0 ? 'Article' : index % 3 === 1 ? 'Video' : 'Course',
  duration: index % 3 === 0 ? '10 min read' : index % 3 === 1 ? '20 min watch' : '2h course',
  category: index % 4 === 0 ? 'Cardiology' : index % 4 === 1 ? 'Neurology' : index % 4 === 2 ? 'Pediatrics' : 'General',
}));

const ITEMS_PER_PAGE = 8;

const SolviaLearning = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResources, setFilteredResources] = useState(mockResources);

  // Calculate total pages
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentItems = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = mockResources.filter(resource => 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Generate pagination numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        // Add ellipsis if current page is away from beginning
        pageNumbers.push('ellipsis1');
      }
      
      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        // Add ellipsis if current page is away from end
        pageNumbers.push('ellipsis2');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Get resource icon based on type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Article':
        return <FileText className="h-5 w-5" />;
      case 'Video':
        return <BookOpen className="h-5 w-5" />;
      case 'Course':
        return <Bookmark className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Solvia Learning</h1>
          
          {/* Search section */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search for learning resources..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
          
          {/* Resources grid */}
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentItems.map((resource) => (
                <Card key={resource.id} className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      <Badge variant="outline">{resource.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {resource.duration}
                    </div>
                    <Badge variant={resource.type === 'Article' ? 'default' : 
                              resource.type === 'Video' ? 'secondary' : 'outline'}>
                      {resource.type}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-accent/10 mb-8">
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilteredResources(mockResources);
                setCurrentPage(1);
              }}>
                Reset Search
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
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
        </div>
      </div>
    </MainLayout>
  );
};

export default SolviaLearning;
