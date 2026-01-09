
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, LogOut, Mail, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import InstitutionProfileEditForm from '@/components/InstitutionProfileEditForm';

interface UserDropdownProps {
  userType: string | null;
  hasUnreadMessages: boolean;
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userType, hasUnreadMessages, onSignOut }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [profileEditOpen, setProfileEditOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await onSignOut();
      toast({
        title: t?.common?.logout || "Sign Out Successful",
        description: t?.auth?.signOutSuccess || "You have been signed out successfully."
      });
      // Ensure we redirect to the homepage after signout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        title: t?.common?.error || "Error signing out",
        description: t?.auth?.signOutError || "Please try again",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            {userType === 'professional' ? (
              <User className="h-4 w-4" />
            ) : (
              <Building className="h-4 w-4" />
            )}
            {hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t?.common?.myAccount || "My Account"}</DropdownMenuLabel>

          {userType === 'institution' && (
            <DropdownMenuItem onClick={() => setProfileEditOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              {t?.common?.editProfile || "Edit Profile"}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link to="/messages">
              <Mail className="h-4 w-4 mr-2" />
              {t?.common?.messages || "Messages"}
              {hasUnreadMessages && <Badge className="ml-2 bg-red-500 text-white">1</Badge>}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
            <LogOut className="h-4 w-4 mr-2" />
            {t?.common?.logout || "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {userType === 'institution' && (
        <InstitutionProfileEditForm
          open={profileEditOpen}
          onOpenChange={setProfileEditOpen}
        />
      )}
    </>
  );
};

export default UserDropdown;
