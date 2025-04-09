
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Languages, GraduationCap, Clock, Bookmark } from 'lucide-react';

interface ProfessionalCardProps {
  id: string;
  name: string;
  title: string;
  location: string;
  specialty: string;
  languages: string[];
  experience: number;
  imageSrc?: string;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  id,
  name,
  title,
  location,
  specialty,
  languages,
  experience,
  imageSrc,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-medical-100 flex items-center justify-center">
              {imageSrc ? (
                <img src={imageSrc} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-2xl font-bold text-medical-500">{name.charAt(0)}</div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{title}</p>
              
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bookmark size={18} />
              <span className="sr-only">Save</span>
            </Button>
          </div>
          
          <Badge variant="secondary" className="bg-medical-50 text-medical-700 hover:bg-medical-100">
            {specialty}
          </Badge>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Languages size={16} className="text-muted-foreground" />
              <p className="text-sm">{languages.join(', ')}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <p className="text-sm">{experience} {experience === 1 ? 'year' : 'years'} experience</p>
            </div>
            
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-muted-foreground" />
              <p className="text-sm">Fully certified</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t mt-4">
        <Button variant="outline" asChild>
          <Link to={`/professionals/${id}`}>View Profile</Link>
        </Button>
        <Button asChild>
          <Link to={`/messages/new?professional=${id}`}>Contact</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCard;
