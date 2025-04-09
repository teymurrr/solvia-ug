
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Users, Briefcase } from 'lucide-react';

interface InstitutionCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  openPositions: number;
  imageSrc?: string;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({
  id,
  name,
  type,
  location,
  openPositions,
  imageSrc,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="h-16 w-16 rounded overflow-hidden bg-healing-100 flex items-center justify-center">
              {imageSrc ? (
                <img src={imageSrc} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-2xl font-bold text-healing-500">{name.charAt(0)}</div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{type}</p>
              
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-muted-foreground" />
              <p className="text-sm">Healthcare Institution</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-muted-foreground" />
              <p className="text-sm">{openPositions} open {openPositions === 1 ? 'position' : 'positions'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <p className="text-sm">Active recruiter</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t mt-4">
        <Button variant="outline" asChild>
          <Link to={`/institutions/${id}`}>View Profile</Link>
        </Button>
        <Button asChild>
          <Link to={`/institutions/${id}/positions`}>See Positions</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InstitutionCard;
