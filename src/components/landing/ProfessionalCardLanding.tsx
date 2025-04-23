
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, MapPin, Languages, Clock, Building, GraduationCap, Search, Bookmark, MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Professional } from '@/types/landing';

interface ProfessionalCardLandingProps {
  professional: Professional & { isOpenToRelocation?: boolean, aboutMe?: string };
  className?: string;
}

const ProfessionalCardLanding: React.FC<ProfessionalCardLandingProps> = ({ professional, className }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

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
    aboutMe,
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
    // Could trigger a modal or redirect to messaging if needed
  };

  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer border-transparent bg-white shadow-none hover:shadow-lg hover:scale-[1.02] transition-all duration-300
        rounded-xl w-full aspect-square flex flex-col ${className || ''}`}
      onClick={() => navigate('/signup')}
      style={{ minHeight: 350, maxWidth: 420 }}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Top row: Profile picture & actions */}
        <div className="flex items-center gap-4 mb-2">
          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-medical-100 flex items-center justify-center flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="text-2xl font-bold text-medical-500">{firstName.charAt(0)}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <h3 className="text-lg font-semibold truncate">{fullName}</h3>
              {fspCertificate && (
                <Badge variant="outline" className="border-yellow-400 text-yellow-600 flex items-center gap-1 px-2 py-0.5 ml-1">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium text-xs">FSP</span>
                </Badge>
              )}
            </div>
            <p className="text-xs text-medical-600 truncate">{specialty}</p>
          </div>
          {/* Actions: Save & Message */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`text-muted-foreground ${isSaved ? 'text-primary' : ''} p-1`}
              aria-label={isSaved ? 'Unsave' : 'Save'}
              onClick={handleSave}
              tabIndex={0}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground p-1"
              aria-label="Message"
              onClick={handleMessage}
              tabIndex={0}
            >
              <MessageCircle size={20} />
            </Button>
          </div>
        </div>
        {/* Relocation + Status */}
        <div className="flex items-center gap-2 mb-3">
          {isOpenToRelocation && (
            <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 border-medical-300 text-medical-700 bg-medical-100">
              <span className="font-semibold text-xs">Open to relocation</span>
            </Badge>
          )}
          {activelySearching && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
              <Search className="h-3 w-3" />
              <span className="font-semibold text-xs">Actively looking</span>
            </Badge>
          )}
        </div>
        {/* About me */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 font-semibold mb-1">About me</div>
          <div className="text-sm text-medical-700 line-clamp-3">{aboutMe || "No summary provided."}</div>
        </div>
        {/* Stats & Info */}
        <div className="flex-1 grid grid-cols-1 gap-y-1 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{country}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Languages className="h-4 w-4" />
            <div className="flex flex-wrap gap-1 truncate">
              {languages?.map((lang, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {lang.language}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{experience} {experience === 1 ? 'year' : 'years'}</span>
          </div>
          {latestExperience ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building className="h-4 w-4" />
              <span className="truncate">{latestExperience.role} at {latestExperience.hospital}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>No experience listed</span>
            </div>
          )}
          {latestEducation ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span className="truncate">{latestEducation.degree} in {latestEducation.field}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>No education listed</span>
            </div>
          )}
        </div>
        {/* Invisible filler for square aspect */}
        <div className="flex-1" />
      </CardContent>
    </Card>
  );
};

export default ProfessionalCardLanding;
