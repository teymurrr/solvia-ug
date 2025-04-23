import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, MapPin, Languages, Clock, Building, GraduationCap, Search, Bookmark, MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Professional } from '@/types/landing';
import { useProtectedAction } from '@/hooks/useProtectedAction';

interface ProfessionalCardLandingProps {
  professional: Professional & { isOpenToRelocation?: boolean };
  className?: string;
}

const ProfessionalCardLanding: React.FC<ProfessionalCardLandingProps> = ({ professional, className }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const { handleProtectedAction } = useProtectedAction();

  const {
    firstName,
    lastName,
    specialty,
    country,
    languages,
    experience,
    fspCertificate,
    activelySearching,
    experiences,
    education,
    profileImage,
    isOpenToRelocation,
  } = professional;
  const fullName = `${firstName} ${lastName}`;
  const latestExperience = experiences?.[0];
  const latestEducation = education?.[0];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleProtectedAction(() => {
      navigate('/messages');
    });
  };

  const displayLanguages = languages.slice(0, 3);
  const hasMoreLanguages = languages.length > 3;

  return (
    <Card 
      className={`overflow-hidden cursor-pointer border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ${className || ''}`}
      onClick={() => navigate('/signup')}
    >
      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-medical-100 flex items-center justify-center flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="text-2xl font-bold text-medical-500">{firstName.charAt(0)}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h3 className="text-lg font-semibold truncate">{fullName}</h3>
              {activelySearching && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1 flex-shrink-0">
                  <Search className="h-3 w-3" />
                  <span>Active</span>
                </Badge>
              )}
              {isOpenToRelocation && (
                <Badge variant="outline" className="text-xs flex-shrink-0 border-medical-300 text-medical-700 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>Open to relocation</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-medical-600 truncate">
              {specialty.includes('Doctor') || specialty.includes('Nurse') ? specialty : `Doctor, ${specialty}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={handleMessage}
              aria-label="Message"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`text-muted-foreground ${isSaved ? 'text-primary' : ''}`}
              aria-label={isSaved ? 'Unsave' : 'Save'}
              onClick={handleSave}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{country}</span>
          </div>
          
          {fspCertificate && (
            <div className="flex items-center gap-1 text-yellow-600 justify-end">
              <span className="text-sm font-medium">FSP</span>
              <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{experience} {experience === 1 ? 'year' : 'years'} of experience</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Languages className="h-4 w-4 flex-shrink-0" />
            </div>
            {displayLanguages.map((lang, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {lang.language} ({lang.level})
              </Badge>
            ))}
            {hasMoreLanguages && (
              <span className="text-xs text-muted-foreground">...</span>
            )}
          </div>

          {latestExperience && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
              <Building className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{latestExperience.role} at {latestExperience.hospital}</span>
            </div>
          )}
          
          {latestEducation && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
              <GraduationCap className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{latestEducation.degree} in {latestEducation.field}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCardLanding;
