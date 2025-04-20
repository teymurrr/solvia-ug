
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, LogOut, Mail, Settings, Languages, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { availableLanguages } from '@/data/languages';

interface UserDropdownProps {
  userType: string | null;
  hasUnreadMessages: boolean;
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userType, hasUnreadMessages, onSignOut }) => {
  return (
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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="h-4 w-4 mr-2" />
            <span>Language</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {availableLanguages.map((language) => (
              <DropdownMenuItem key={language}>
                {language}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem asChild>
          <Link to="/messages">
            <Mail className="h-4 w-4 mr-2" />
            Messages
            {hasUnreadMessages && <Badge className="ml-2 bg-red-500 text-white">1</Badge>}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onSignOut} className="text-red-500">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
