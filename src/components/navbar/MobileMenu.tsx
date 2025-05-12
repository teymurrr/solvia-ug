
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Home, Briefcase, HelpCircle, LayoutDashboard, BookOpen, BarChart } from 'lucide-react';

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
              to="/"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <Home className="h-5 w-5 text-gray-600" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/employers"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <Briefcase className="h-5 w-5 text-gray-600" />
              <span>For Employers</span>
            </Link>

            <Link
              to="/about"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <span>About</span>
            </Link>
          </>
        )}
        
        {isLoggedIn && userType === 'professional' && (
          <>
            <Link
              to="/dashboard/professional"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <LayoutDashboard className="h-5 w-5 text-gray-600" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/learning"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <BookOpen className="h-5 w-5 text-gray-600" />
              <span>Solvia Learning</span>
            </Link>
          </>
        )}

        {isLoggedIn && userType === 'institution' && (
          <>
            <Link
              to="/dashboard/institution"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <LayoutDashboard className="h-5 w-5 text-gray-600" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/insights"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <BarChart className="h-5 w-5 text-gray-600" />
              <span>Solvia Insights</span>
            </Link>
          </>
        )}
      </div>

      <div className="pt-4 pb-3 border-t border-gray-200">
        {isLoggedIn ? (
          <div className="space-y-1">
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
              Free Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
