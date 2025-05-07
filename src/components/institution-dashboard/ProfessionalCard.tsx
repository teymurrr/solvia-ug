
import React from 'react';
import { User, MapPin, Globe, GraduationCap, Clock, Mail, Award, Languages, Building, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { useMessages } from '@/hooks/useMessages';

interface ProfessionalCardProps {
  professional: {
    id: string;
    firstName: string;
    lastName: string;
    specialty?: string;
    profession?: string;
    country?: string;
    isOpenToRelocation?: boolean;
    profileImage?: string;
    activelySearching?: boolean;
    fspCertificate?: boolean;
    experiences?: {
      hospital: string;
      location: string;
      role: string;
      startDate: string;
      endDate?: string;
      current?: boolean;
    }[];
    education?: {
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      current?: boolean;
    }[];
    languages?: {
      language: string;
      level: string;
    }[];
  };
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleProtectedAction } = useProtectedAction();
  const { addMessage } = useMessages();
  
  // Calculate years of experience
  const getYearsOfExperience = () => {
    if (!professional.experiences || professional.experiences.length === 0) return 0;
    
    // Simple calculation: count the number of experiences
    return professional.experiences.length;
  };
  
  const yearsOfExperience = getYearsOfExperience();
  
  const handleSendMessage = () => {
    handleProtectedAction(() => {
      // Start a chat in the inbox page
      navigate(`/messages/${professional.id}`);
      
      toast({
        title: "Opening conversation",
        description: `You can now send a message to ${professional.firstName} ${professional.lastName}`,
      });
    });
  };
  
  const latestExperience = professional.experiences?.[0];
  const latestEducation = professional.education?.[0];
  
  return (
    <Card className="w-full mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Image and Basic Info */}
          <div className="flex items-start gap-4 w-full md:w-auto">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
              {professional.profileImage ? (
                <img 
                  src={professional.profileImage} 
                  alt={`${professional.firstName} ${professional.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {professional.firstName} {professional.lastName}
                </h3>
                {professional.fspCertificate && (
                  <span title="FSP Certified">
                    <Award className="h-5 w-5 text-yellow-500" />
                  </span>
                )}
                {professional.activelySearching && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Search className="h-3 w-3 mr-1" />
                    Actively searching
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                {professional.specialty && (
                  <p className="text-sm text-blue-600 font-medium">{professional.specialty}</p>
                )}
                {professional.profession && (
                  <p className="text-sm text-gray-600">{professional.profession}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Experience & Current Role */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 md:mt-0 w-full">
            {/* Experience */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span className="font-medium">Current</span>
              </div>
              {latestExperience ? (
                <p className="text-sm">
                  {latestExperience.role} at {latestExperience.hospital}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No current position</p>
              )}
            </div>
            
            {/* Languages */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Languages className="h-4 w-4" />
                <span className="font-medium">Languages</span>
              </div>
              {professional.languages && professional.languages.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {professional.languages.map((lang, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {lang.language} ({lang.level})
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No languages specified</p>
              )}
            </div>
            
            {/* Education */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">Education</span>
              </div>
              {latestEducation ? (
                <p className="text-sm">
                  {latestEducation.degree} in {latestEducation.field} at {latestEducation.institution}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No education specified</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600 w-full sm:w-auto">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} experience</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{professional.country || 'Location not specified'}</span>
          </div>
          
          {professional.isOpenToRelocation && (
            <Badge variant="outline" className="text-xs">
              Open to relocation
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => navigate(`/professionals/${professional.id}`)} className="flex-1 sm:flex-none">
            View Profile
          </Button>
          <Button onClick={handleSendMessage} className="flex items-center gap-2 flex-1 sm:flex-none">
            <Mail className="h-4 w-4" />
            Contact
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCard;
