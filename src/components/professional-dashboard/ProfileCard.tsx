
import React from 'react';
import { User, MapPin, Award, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/hooks/useLanguage';

const countryFlags: Record<string, string> = {
  germany: '🇩🇪',
  austria: '🇦🇹',
  spain: '🇪🇸',
  italy: '🇮🇹',
  france: '🇫🇷',
};

interface ProfileCardProps {
  profileData: ProfileFormValues;
  profileCompletionPercentage: number;
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileData,
  profileCompletionPercentage,
  onEdit
}) => {
  const { t } = useLanguage();
  
  // Ensure all required properties exist
  const profileText = t?.dashboard?.profile || {
    loading: "Loading profile data...",
    createProfile: "Create Profile",
    activelySearching: "Actively searching",
    openToRelocation: "Open to relocation",
    fspCertified: "FSP Certified",
    profileCompletion: "Profile completion",
    location: "Location",
    notSpecified: "Not specified",
    profession: "Profession",
    fspCertificate: "FSP Certificate",
    yes: "Yes",
    no: "No",
    experience: "Experience",
    at: "at",
    present: "Present",
    education: "Education",
    in: "in",
    languages: "Languages",
    about: "About",
    incompleteProfile: "Your profile is incomplete. Add more information about yourself to attract potential employers.",
    completeProfile: "Complete Your Profile",
    updateProfile: "Update Profile"
  };
  
  if (!profileData) {
    return (
      <div className="text-center py-6">
        <p>{profileText.loading || "Loading profile data..."}</p>
        <Button variant="outline" className="mt-4" onClick={onEdit}>
          {profileText.createProfile || "Create Profile"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
          {profileData.profileImage ? (
            <img
              src={profileData.profileImage}
              alt={`${profileData.firstName} ${profileData.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {profileData.firstName} {profileData.lastName}
            <div className="flex gap-2">
              {profileData.activelySearching && (
                <Badge className="bg-green-500">
                  {profileText.activelySearching || "Actively searching"}
                </Badge>
              )}
              {profileData.openToRelocation && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <MapPin className="h-5 w-5 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{profileText.openToRelocation || "Open to relocation"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {profileData.fspCertificate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Award className="h-5 w-5 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{profileText.fspCertified || "FSP Certified"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </h2>
          <p className="text-medical-600">{profileData.specialty}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">
              {profileText.profileCompletion || "Profile completion"}
            </span>
            <span className="text-sm font-medium">{profileCompletionPercentage}%</span>
          </div>
          <Progress value={profileCompletionPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {profileText.location || "Location"}
            </h3>
            <p>{profileData.location || profileText.notSpecified || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {profileText.profession || "Profession"}
            </h3>
            <p>{profileData.profession || profileText.notSpecified || "Not specified"}</p>
          </div>
          {profileData.targetCountry && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {profileText.targetCountry || "Target Country"}
              </h3>
              <p className="flex items-center gap-2">
                <span className="text-2xl">{countryFlags[profileData.targetCountry] || '🌍'}</span>
                <span className="capitalize">{profileData.targetCountry}</span>
              </p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {profileText.fspCertificate || "FSP Certificate"}
            </h3>
            <p>{profileData.fspCertificate ? 
              (profileText.yes || "Yes") : 
              (profileText.no || "No")}
            </p>
          </div>
        </div>

        {profileData.experiences && profileData.experiences.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {profileText.experience || "Experience"}
            </h3>
            <div className="space-y-2 mt-1">
              {profileData.experiences.map((exp, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{exp.role} {profileText.at || "at"} {exp.hospital}</p>
                  <p className="text-muted-foreground">
                    {exp.location} | {exp.startDate} - {exp.current ? 
                      (profileText.present || "Present") : 
                      exp.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profileData.education && profileData.education.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {profileText.education || "Education"}
            </h3>
            <div className="space-y-2 mt-1">
              {profileData.education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{edu.degree} {profileText.in || "in"} {edu.field}</p>
                  <p className="text-muted-foreground">
                    {edu.institution} | {edu.startDate} - {edu.current ? 
                      (profileText.present || "Present") : 
                      edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profileData.languages && profileData.languages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {profileText.languages || "Languages"}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {profileData.languages.map((lang, index) => (
                <Badge key={index} variant="outline">
                  {lang.language} ({lang.level})
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            {profileText.about || "About"}
          </h3>
          <p className="text-muted-foreground">
            {profileData.about || profileText.incompleteProfile || 
              "Your profile is incomplete. Add more information about yourself to attract potential employers."}
          </p>
        </div>

        <Button variant="default" onClick={onEdit}>
          {!profileData.experiences || profileData.experiences.length === 0
            ? (profileText.completeProfile || "Complete Your Profile")
            : (profileText.updateProfile || "Update Profile")}
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
