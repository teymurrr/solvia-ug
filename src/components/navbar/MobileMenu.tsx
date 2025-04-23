import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, GraduationCap, Building } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  userType: string | null;
  hasUnreadMessages: boolean;
  getDashboardLink: () => string;
  onSignOut: () => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  userType,
  hasUnreadMessages,
  getDashboardLink,
  onSignOut,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden bg-white">
      <div className="pt-2 pb-3 space-y-1">
        {!isLoggedIn && (
          <>
            <Link
              to="/professionals"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <GraduationCap className="h-5 w-5" />
              <span>For Talents</span>
            </Link>
            <Link
              to="/institutions"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <Building className="h-5 w-5" />
              <span>For Institutions</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <HelpCircle className="h-5 w-5" />
              <span>About</span>
            </Link>
          </>
        )}
        
        {isLoggedIn ? (
          userType === 'professional' ? (
            <>
              <Link
                to="/dashboard/professional"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={onClose}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard/institution"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={onClose}
              >
                Dashboard
              </Link>
            </>
          )
        )}
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200">
        {isLoggedIn ? (
          <div className="space-y-1">
            <Link
              to={getDashboardLink()}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={onClose}
            >
              Dashboard
            </Link>
            <Link
              to="/messages"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 flex items-center"
              onClick={onClose}
            >
              Messages
              {hasUnreadMessages && (
                <Badge className="ml-2 bg-red-500 text-white">1</Badge>
              )}
            </Link>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-500 hover:bg-gray-50 hover:border-red-300"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              to="/login"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={onClose}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={onClose}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
