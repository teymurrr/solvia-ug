
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, MapPin, Languages, Clock, Building, GraduationCap, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Professional } from '@/types/landing';

interface ProfessionalCardLandingProps {
  professional: Professional;
}

const ProfessionalCardLanding: React.FC<ProfessionalCardLandingProps> = ({ professional }) => {
  const navigate = useNavigate();
  const { firstName, lastName, specialty, country, languages, experience, fspCertificate, activelySearching, experiences, education, profileImage } = professional;
  const fullName = `${firstName} ${lastName}`;
  const latestExperience = experiences?.[0];
  const latestEducation = education?.[0];

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate('/signup')}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-medical-100 flex items-center justify-center flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="text-2xl font-bold text-medical-500">{firstName.charAt(0)}</div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{fullName}</h3>
              {fspCertificate && (
                <Award className="h-5 w-5 text-yellow-500" aria-label="FSP Certified" />
              )}
              {activelySearching && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  <span>Active</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-medical-600">{specialty}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{country}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {languages.map((lang, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {lang.language} ({lang.level})
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{experience} {experience === 1 ? 'year' : 'years'} experience</span>
          </div>
          
          {latestExperience && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{latestExperience.role} at {latestExperience.hospital}</span>
            </div>
          )}
          
          {latestEducation && (
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{latestEducation.degree} in {latestEducation.field}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCardLanding;
