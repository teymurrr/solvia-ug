
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface VacancySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

const VacancySearch: React.FC<VacancySearchProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch
}) => {
  const { t } = useLanguage();
  
  // Ensure that t.dashboard.vacancies has the needed properties
  const vacancyText = t?.dashboard?.vacancies || {
    searchPlaceholder: "Search by title, location, or keyword...",
    search: "Search"
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={vacancyText.searchPlaceholder || "Search by title, location, or keyword..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </div>
      <Button variant="outline" className="md:w-auto" onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        {vacancyText.search || "Search"}
      </Button>
    </div>
  );
};

export default VacancySearch;
