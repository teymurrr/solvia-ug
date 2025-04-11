
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProfessionalCard from './ProfessionalCard';

interface TalentsTabProps {
  professionals: any[];
  filteredProfessionals: any[];
  searchQuery: string;
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const TalentsTab: React.FC<TalentsTabProps> = ({
  professionals,
  filteredProfessionals,
  searchQuery,
  onSearchQueryChange,
  onSearch
}) => {
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
              />
            </div>
            <Button type="button" onClick={onSearch}>Search</Button>
          </div>
          
          {filteredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfessionals.map((professional) => (
                <ProfessionalCard 
                  key={professional.id || professional.email} 
                  professional={professional} 
                />
              ))}
            </div>
          ) : professionals.length > 0 && searchQuery ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No matching professionals found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No professionals have signed up yet</h3>
              <p className="text-muted-foreground">
                Check back later as healthcare professionals join the platform
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionals.map((professional) => (
                <ProfessionalCard 
                  key={professional.id || professional.email} 
                  professional={professional} 
                />
              ))}
            </div>
          )}
          
          {professionals.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <Link to="/professionals">
                <Users className="h-4 w-4 mr-2" />
                View All Professionals
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentsTab;
