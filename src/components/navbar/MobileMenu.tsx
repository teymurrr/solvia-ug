
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Briefcase, FileText, LayoutDashboard, BookOpen, BarChart, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="sm:hidden bg-white">
      <div className="pt-2 pb-3 space-y-1">
        {!isLoggedIn && (
          <>
            <Link
              to="/employers"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <Briefcase className="h-5 w-5 text-gray-600" />
              <span>{t?.common?.forEmployers || "For Employers"}</span>
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
              <span>{t?.common?.dashboard || "Dashboard"}</span>
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
              <span>{t?.common?.dashboard || "Dashboard"}</span>
            </Link>

            <Link
              to="/insights"
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
              onClick={onClose}
            >
              <BarChart className="h-5 w-5 text-gray-600" />
              <span>{t?.insights?.title || "Solvia Insights"}</span>
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
              {t?.common?.messages || "Messages"}
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
              {t?.common?.logout || "Sign out"}
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              to="/login"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={onClose}
            >
              {t?.common?.login || "Log in"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
