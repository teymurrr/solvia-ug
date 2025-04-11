
import React from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileTabProps {
  onEditProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onEditProfile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Profile</CardTitle>
        <CardDescription>
          This is how healthcare professionals will see your institution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center">
              <Building2 className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">General Hospital</h2>
              <p className="text-medical-600">Hospital</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>contact@hospital.com</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                <p>Not specified</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                <p>Not specified</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>New York, USA</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">About</h3>
              <p className="text-muted-foreground">
                Your profile is incomplete. Add more information about your institution to attract healthcare professionals.
              </p>
            </div>
            
            <Button variant="default" onClick={onEditProfile}>Complete Your Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
