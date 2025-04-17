
import React from 'react';
import { User, MapPin, Globe, GraduationCap, Clock, Mail, Award, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useProtectedAction } from '@/hooks/useProtectedAction';

interface ProfessionalCardProps {
  professional: {
    id?: string | number;
    email?: string;
    firstName: string;
    lastName: string;
    specialty?: string;
    role?: string;
    profession?: string;
    country?: string;
    language?: string;
    languages?: { language: string; level: string }[];
    isOpenToRelocation?: boolean;
    fspCertificate?: boolean;
    experience?: number;
    experiences?: { hospital: string; role: string; startDate: string; endDate?: string; current?: boolean }[];
    education?: { institution: string; degree: string; field: string }[];
  };
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleProtectedAction } = useProtectedAction();
  
  // Calculate years of experience from experiences array if available
  const yearsOfExperience = professional.experience || 
    (professional.experiences && professional.experiences.length > 0 ? professional.experiences.length : 0);
  
  const handleSendMessage = () => {
    handleProtectedAction(() => {
      // Navigate to message page with professional ID
      navigate(`/messages/new?recipientId=${professional.id}`);
      
      toast({
        title: "Redirecting to messages",
        description: `You can now send a message to ${professional.firstName} ${professional.lastName}`,
      });
    });
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium flex items-center gap-2">
                {professional.firstName} {professional.lastName}
                {professional.fspCertificate && (
                  <Award className="h-4 w-4 text-yellow-500" title="FSP Certified" />
                )}
              </h3>
              {professional.specialty && (
                <p className="text-sm text-medical-600">{professional.specialty}</p>
              )}
              {professional.role && (
                <p className="text-xs text-muted-foreground">{professional.role}</p>
              )}
              {professional.profession && (
                <p className="text-xs text-muted-foreground">{professional.profession}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {professional.country && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {professional.country}
                  </div>
                )}
                {professional.language && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Globe className="h-3 w-3 mr-1" />
                    {professional.language}
                  </div>
                )}
                {professional.languages && professional.languages.length > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Languages className="h-3 w-3 mr-1" />
                    {professional.languages.map(lang => lang.language).join(', ')}
                  </div>
                )}
                {yearsOfExperience > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} experience
                  </div>
                )}
                {professional.education && professional.education.length > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {professional.education[0].institution}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {professional.isOpenToRelocation ? (
                  <Badge className="text-xs" variant="outline">Open to relocation</Badge>
                ) : "Not open to relocation"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0 border-t mt-2">
        <Button variant="outline" size="sm" onClick={() => navigate(`/professionals/${professional.id}`)}>
          View Profile
        </Button>
        <Button size="sm" onClick={handleSendMessage} className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCard;
